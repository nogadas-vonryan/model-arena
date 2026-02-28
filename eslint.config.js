import nextConfig from 'eslint-config-next'
import prettier from 'eslint-config-prettier'

const eslintConfig = [
  {
    ignores: ['.agents/**'],
  },
  ...nextConfig,
  prettier,
]

export default eslintConfig
