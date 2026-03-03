import { useMemo, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import './App.css'

const starterMarkdown = `# MarkPDF

Write your markdown on the left and download a PDF from the right.

## Features

- Live markdown preview
- Sanitized HTML rendering
- One-click PDF export

## Example table

| Tool | Purpose |
| --- | --- |
| marked | Markdown parser |
| DOMPurify | XSS-safe HTML |
| html2pdf.js | Browser PDF export |

> Edit this content and click **Export PDF**.
`

marked.setOptions({
  gfm: true,
  breaks: true,
})

function App() {
  const [markdown, setMarkdown] = useState(starterMarkdown)
  const [documentTitle, setDocumentTitle] = useState('markpdf-document')
  const [isExporting, setIsExporting] = useState(false)
  const previewRef = useRef<HTMLElement | null>(null)

  const renderedMarkdown = useMemo(() => {
    const rawHtml = marked.parse(markdown) as string
    return DOMPurify.sanitize(rawHtml)
  }, [markdown])

  const handleExportPdf = async () => {
    if (!previewRef.current) return
    setIsExporting(true)

    const fileName =
      documentTitle
        .trim()
        .replace(/[^a-z0-9-_.]+/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'markpdf-document'

    try {
      const { default: html2pdf } = await import('html2pdf.js')

      await html2pdf()
        .set({
          margin: [12, 12, 12, 12],
          filename: `${fileName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(previewRef.current)
        .save()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>MarkPDF</h1>
          <p>Render markdown and export it as a PDF in the browser.</p>
        </div>
        <div className="actions">
          <label htmlFor="document-title">File name</label>
          <input
            id="document-title"
            value={documentTitle}
            onChange={(event) => setDocumentTitle(event.target.value)}
            placeholder="markpdf-document"
            autoComplete="off"
          />
          <button onClick={handleExportPdf} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </header>

      <main className="editor-shell">
        <section className="pane">
          <div className="pane-header">
            <h2>Markdown</h2>
            <p>{markdown.length} chars</p>
          </div>
          <textarea
            aria-label="Markdown input"
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
          />
        </section>

        <section className="pane preview-pane">
          <div className="pane-header">
            <h2>Preview</h2>
            <p>Sanitized HTML</p>
          </div>
          <article
            ref={previewRef}
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>Hosted on Cloudflare Pages. PDF export runs fully client-side.</p>
      </footer>
    </div>
  )
}

export default App
