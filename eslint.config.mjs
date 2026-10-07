import {defineConfig,globalIgnores} from 'eslint/config';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import hooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
export default defineConfig([
 globalIgnores(['public/pdf.worker.min.mjs','.next/**','node_modules/**','next-env.d.ts','.local-ai/**','verification/**','dist-public/**','public-site/**']),
 {files:['**/*.{mjs,ts,tsx}'],languageOptions:{globals:{process:'readonly',Buffer:'readonly',URL:'readonly',console:'readonly',setTimeout:'readonly'}}},
 js.configs.recommended,
 {files:['**/*.{ts,tsx}'],languageOptions:{parser:tsParser,parserOptions:{ecmaFeatures:{jsx:true}}},plugins:{'@typescript-eslint':tsPlugin},rules:{...tsPlugin.configs.recommended.rules,'no-undef':'off','no-unused-vars':'off'}},
 {files:['**/*.tsx'],plugins:{'react-hooks':hooks,'jsx-a11y':a11y},rules:{...hooks.configs.recommended.rules,...a11y.configs.recommended.rules},settings:{'jsx-a11y':{components:{Image:'img'}}}},
]);
