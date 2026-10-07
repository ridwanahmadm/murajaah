import {cpSync} from 'node:fs';
cpSync('node_modules/pdfjs-dist/build/pdf.worker.min.mjs','public/pdf.worker.min.mjs');
