import { useEffect, useRef, useState } from 'react'
import hljs from 'highlight.js'
import { Check, Copy } from "@phosphor-icons/react";import clsx from 'clsx'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
}

export function CodeBlock({ code, language = 'typescript', title, className }: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (ref.current) {
      hljs.highlightElement(ref.current)
    }
  }, [code, language])

  const handleCopy = () => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={clsx('rounded-xl overflow-hidden scheme-border', className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-panel border-b scheme-border">
          <span className="text-xs font-mono text-muted">{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-subtle uppercase tracking-wider">{language}</span>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-soft transition-colors text-subtle hover:text-body"
              aria-label="Copy code"
            >
              {copied ? <Check size={13} className="text-success-400" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      )}
      {!title && (
        <div className="absolute right-3 top-3">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-soft hover:bg-panel transition-colors text-muted hover:text-body"
            aria-label="Copy code"
          >
            {copied ? <Check size={13} className="text-success-400" /> : <Copy size={13} />}
          </button>
        </div>
      )}
      <div className={clsx('relative', !title && 'group')}>
        {!title && (
          <button
            onClick={handleCopy}
            className="absolute right-3 top-3 p-1.5 rounded-lg bg-soft hover:bg-panel transition-colors text-muted hover:text-body opacity-0 group-hover:opacity-100 z-10"
            aria-label="Copy code"
          >
            {copied ? <Check size={13} className="text-success-400" /> : <Copy size={13} />}
          </button>
        )}
        <pre className="overflow-x-auto m-0">
          <code ref={ref} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  )
}
