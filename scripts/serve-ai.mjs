import {existsSync,mkdirSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
const local=resolve('.local-ai/runtime/ollama');const models=resolve('.local-ai/models');mkdirSync(models,{recursive:true});
const child=spawn(existsSync(local)?local:'ollama',['serve'],{stdio:'inherit',env:{...process.env,OLLAMA_NO_CLOUD:'1',OLLAMA_HOST:'127.0.0.1:11434',OLLAMA_MODELS:models}});
child.on('error',()=>{console.error('Install the free Ollama runtime first; see README.');process.exitCode=1;});child.on('exit',code=>{process.exitCode=code??1;});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
