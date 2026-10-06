import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {input,fixture} from './fixtures/draft';
const generate=vi.hoisted(()=>vi.fn());
vi.mock('../lib/ai/provider',()=>({createProvider:()=>({generate})}));
import {POST} from '../app/api/generate/route';
function request(body:unknown=input,code='test-access-code-long-enough'){return new Request('http://localhost/api/generate',{method:'POST',headers:{'content-type':'application/json','x-access-code':code},body:JSON.stringify(body)});}
beforeEach(()=>{vi.stubEnv('APP_ACCESS_CODE','test-access-code-long-enough');generate.mockResolvedValue(fixture());});
afterEach(()=>{vi.unstubAllEnvs();vi.clearAllMocks();});
describe('generation endpoint',()=>{
 it('rejects unauthorized access before calling a provider',async()=>{expect((await POST(request(input,'wrong'))).status).toBe(401);expect(generate).not.toHaveBeenCalled();});
 it('fails closed when server access code is absent',async()=>{vi.stubEnv('APP_ACCESS_CODE','');expect((await POST(request())).status).toBe(503);expect(generate).not.toHaveBeenCalled();});
 it('validates payloads before spending credits',async()=>{expect((await POST(request({topic:''}))).status).toBe(400);expect(generate).not.toHaveBeenCalled();});
 it('rejects cross-origin and oversize requests',async()=>{const cross=request();cross.headers.set('origin','https://other.example');expect((await POST(cross)).status).toBe(403);expect((await POST(request({data:'x'.repeat(3200000)}))).status).toBe(413);expect(generate).not.toHaveBeenCalled();});
 it('returns a validated draft without leaking access code or API key',async()=>{const response=await POST(request());expect(response.status).toBe(200);expect(response.headers.get('cache-control')).toBe('no-store');const body=await response.text();expect(body).not.toContain('test-access-code');expect(JSON.parse(body).grounded).toBe(true);});
 it('returns a safe failure without exposing upstream secrets',async()=>{generate.mockRejectedValue(new Error('private upstream secret'));const response=await POST(request());expect(response.status).toBe(502);expect(await response.text()).not.toContain('private upstream secret');});
});
