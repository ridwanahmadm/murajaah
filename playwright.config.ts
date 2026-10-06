import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./e2e',use:{baseURL:'http://127.0.0.1:3000'},webServer:{command:'npm run dev -- --hostname 127.0.0.1',url:'http://127.0.0.1:3000',reuseExistingServer:true},projects:[{name:'mobile',use:{viewport:{width:360,height:800}}},{name:'desktop',use:{viewport:{width:1280,height:900}}}]});
