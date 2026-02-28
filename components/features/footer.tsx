import { BarChart3 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>Model Arena &copy; {new Date().getFullYear()}</span>
          </div>

          <div className="text-sm text-muted-foreground">
            Benchmark data from{' '}
            <a
              href="https://chat.lmsys.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Chatbot Arena
            </a>
            ,{' '}
            <a
              href="https://artificialanalysis.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              ArtificialAnalysis
            </a>
            ,{' '}
            <a
              href="https://huggingface.co"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              HuggingFace
            </a>
            , and{' '}
            <a
              href="https://livecodebench.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              LiveCodeBench
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
