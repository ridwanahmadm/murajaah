import {existsSync,writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
const model=process.argv[2];
if(!model||!/^[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/i.test(model)||/cloud/i.test(model))throw new Error('Pass an explicitly tagged local model, e.g. npm run setup:local -- qwen3.5:4b');
if(existsSync('.env.local'))throw new Error('.env.local already exists; it was not overwritten. Edit it manually.');
writeFileSync('.env.local',`AI_PROVIDER=ollama\nAI_MODEL=${model}\nOLLAMA_BASE_URL=http://127.0.0.1:11434\nOLLAMA_NO_CLOUD=1\nAPP_ACCESS_CODE=${randomBytes(32).toString('hex')}\n`,{mode:0o600});
console.log('Created private .env.local. Enter its APP_ACCESS_CODE once in Pengaturan. No API key or paid account required.');
