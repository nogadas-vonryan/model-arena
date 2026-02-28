import nextConfig from 'eslint-config-next'
import prettier from 'eslint-config-prettier'
import unusedImports from 'eslint-plugin-unused-imports'

const eslintConfig = [
  {
    ignores: ['.agents/**'],
  },
  ...nextConfig,
  prettier,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]

export default eslintConfig
