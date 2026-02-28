export interface Model {
  id: string
  name: string
  provider:
    | 'OpenAI'
    | 'Anthropic'
    | 'Google'
    | 'Meta'
    | 'Mistral'
    | 'DeepSeek'
    | 'xAI'
    | 'Amazon'
    | 'Meta'
  architecture: string
  contextWindow: number
  releaseDate: string
  tags: string[]
  description?: string
}
