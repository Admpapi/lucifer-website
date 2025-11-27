"use client"

import { useEffect, useState } from "react"
import { Highlight, themes, type Language } from "prism-react-renderer"

interface CodeBlockProps {
  code: string
  language: Language
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} p-4 rounded-lg overflow-auto`} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

