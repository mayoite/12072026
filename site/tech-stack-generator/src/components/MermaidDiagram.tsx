import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: 'var(--brand-500)',
    primaryTextColor: 'var(--text-strong)',
    primaryBorderColor: 'var(--brand-600)',
    lineColor: 'var(--text-muted)',
    secondaryColor: 'var(--text-body)',
    tertiaryColor: 'var(--color-dark-midnight-blue-750)',
    background: 'var(--color-dark-midnight-blue-750)',
    mainBkg: 'var(--text-body)',
    nodeBorder: 'var(--text-heading-soft)',
    clusterBkg: 'var(--text-body)',
    titleColor: 'var(--text-strong)',
    edgeLabelBackground: 'var(--text-body)',
    fontFamily: 'var(--font-sans)',
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
