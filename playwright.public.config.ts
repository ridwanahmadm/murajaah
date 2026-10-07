import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./e2e-public',use:{baseURL:process.env.PUBLIC_PREVIEW_URL??'http://127.0.0.1:4173'},projects:[{name:'mobile',use:{viewport:{width:360,height:800}}},{name:'desktop',use:{viewport:{width:1280,height:900}}}]});
