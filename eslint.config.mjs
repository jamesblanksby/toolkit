import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends('eslint:recommended'), {
    ignores: [
        'node_modules/*',
    ],
    
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.jquery,
            ...globals.node,
        },

        ecmaVersion: 'latest',
        sourceType: 'module',
    },

    rules: {
        'no-async-promise-executor': 'off',
        'no-empty': 'off',
        'no-unused-vars': 'warn',
    },
}];
