import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

// Mermaid only accepts concrete color strings — not CSS var().
// Values aligned to dark docs theme (see site theme tokens).
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#406F99',
    primaryTextColor: '#F1F5F9',
    primaryBorderColor: '#36638A',
    lineColor: '#94A3B8',
    secondaryColor: '#1B2940',
    tertiaryColor: '#0E1925',
    background: '#0E1925',
    mainBkg: '#152033',
    nodeBorder: '#3B4756',
    clusterBkg: '#152033',
    titleColor: '#F1F5F9',
    edgeLabelBackground: '#152033',
    fontFamily: 'system-ui, "Segoe UI", sans-serif',
  },
  flowchart: { curve: 'basis', htmlLabels: true },
  sequence: { actorMargin: 50 },
})

let counter = 0

interface MermaidDiagramProps {
  chart: string
  title?: string
  className?: string
}

export function MermaidDiagram({ chart, title, className }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const idRef = useRef(`mermaid-${++counter}`)

  useEffect(() => {
    const render = async () => {
      try {
        const { svg: rendered } = await mermaid.render(idRef.current, chart)
        setSvg(rendered)
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Diagram render error')
      }
    }
    void render()
  }, [chart])

  return (
    <div className={className}>
      {title && (
        <p className="text-sm font-medium text-docs-text-muted mb-3 text-center">{title}</p>
      )}
      {error ? (
        <div className="rounded-xl border border-red-800 bg-red-950/30 p-4 text-danger-400 text-sm font-mono">
          {error}
        </div>
      ) : (
        <div
          ref={ref}
          className="bg-docs-surface-raised/50 rounded-xl border border-docs-border p-4 overflow-x-auto flex justify-center"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  )
}
