import globals from 'globals';
import tseslint from 'typescript-eslint';
import {FlatCompat} from '@eslint/eslintrc';
// @ts-ignore -- no types for this plugin
import drizzle from 'eslint-plugin-drizzle';
import reactPlugin from 'eslint-plugin-react';
import perfectionist from 'eslint-plugin-perfectionist';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
    ignores: ['.next'],
  },
  ...compat.extends('next/core-web-vitals'),
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat['jsx-runtime'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      drizzle,
      'unused-imports': unusedImports,
    },
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {args: 'after-used', argsIgnorePattern: '^_'},
      ],
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {prefer: 'type-imports', fixStyle: 'inline-type-imports'},
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {argsIgnorePattern: '^_'},
      ],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {checksVoidReturn: {attributes: false}},
      ],
      'drizzle/enforce-delete-with-where': [
        'error',
        {drizzleObjectName: ['db', 'ctx.db']},
      ],
      'drizzle/enforce-update-with-where': [
        'error',
        {drizzleObjectName: ['db', 'ctx.db']},
      ],
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'warn',
        {
          type: 'line-length',
          internalPattern: ['^@/[A-Z].*'],
          newlinesBetween: 'never',
          groups: [
            'react',
            ['type', 'reactLib'],
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          customGroups: {
            value: {
              react: '^react$',
              reactLib: '^react-.+',
            },
            type: {
              react: '^react$',
              reactLib: '^react-.+',
            },
          },
        },
      ],
      'perfectionist/sort-named-imports': ['warn', {type: 'line-length'}],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  }
);
