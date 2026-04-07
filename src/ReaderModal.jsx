import { useState, useEffect } from 'react'
import { Readability } from '@mozilla/readability'
import DOMPurify from 'dompurify'
import './ReaderModal.css'
import AIPicker from './AIPicker'

 
export default function ReaderModal({ article, onClose }) {
  const [content, setContent]   = useState(null)   // parsed article body
  const [aiPickerOpen, setAiPickerOpen] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
 
  // Close on Escape key
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])
 
  // Fetch and parse the full article when the modal opens
  useEffect(() => {
    if (!article) return
    setLoading(true)
    setError(null)
    setContent(null)
 
    async function loadArticle() {
      try {
        // Fetch the full article page through the same proxy we use for feeds
        const proxyUrl = `/rss/?url=${encodeURIComponent(article.link)}`
        const response = await fetch(proxyUrl)
        const html = await response.text()
 
        // Parse the HTML into a real DOM so Readability can work on it
        const doc = new DOMParser().parseFromString(html, 'text/html')
 
        // Set the base URL so relative image/link paths resolve correctly
        const base = doc.createElement('base')
        base.href = article.link
        doc.head.appendChild(base)
 
        // Readability extracts just the article — same algo as Firefox reader mode
        const reader = new Readability(doc)
        const parsed = reader.parse()
 
        if (!parsed) {
          setError("Couldn't extract article content. The site may block readers.")
          return
        }
 
        // Sanitize the HTML before injecting it into the page (security)
        const clean = DOMPurify.sanitize(parsed.content, {
          ALLOWED_TAGS: [
            'p','h1','h2','h3','h4','h5','h6',
            'ul','ol','li','blockquote','pre','code',
            'strong','em','a','img','figure','figcaption',
            'table','thead','tbody','tr','th','td','br','hr'
          ],
          ALLOWED_ATTR: ['href','src','alt','title','target'],
        })
 
        setContent({ ...parsed, html: clean })
      } catch (err) {
        setError('Failed to load the article. ' + err.message)
      } finally {
        setLoading(false)
      }
    }
 
    loadArticle()
  }, [article])
 
  if (!article) return null
 
  return (
    // Clicking the backdrop closes the modal
    <div className="reader-backdrop" onClick={onClose}>
      <div className="reader-modal" onClick={e => e.stopPropagation()}>
 
        {/* Header */}
        <div className="reader-header">
          <div className="reader-meta">
            <span className="reader-source">{article.source}</span>
            <span className="reader-date">
              {article.date ? new Date(article.date).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              }) : ''}
            </span>
          </div>
          <div className="reader-actions">
            <button className="reader-btn" onClick={() => setAiPickerOpen(true)}>
                Ask AI
            </button>
            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="reader-btn"
              title="Open original"
            >
              ↗ Original
            </a>
            <button className="reader-btn reader-btn--close" onClick={onClose}>
              ✕
            </button>
            {aiPickerOpen && (
                <AIPicker
                    article={article}
                    onClose={() => setAiPickerOpen(false)}
                />
            )}
          </div>
        </div>
 
        {/* Article content */}
        <div className="reader-body">
          <h1 className="reader-title">{article.title}</h1>
 
          {loading && <div className="reader-status">Loading article...</div>}
 
          {error && (
            <div className="reader-status reader-status--error">
              <p>{error}</p>
              <a href={article.link} target="_blank" rel="noreferrer" className="reader-btn" style={{marginTop:'1rem',display:'inline-block'}}>
                Open in new tab instead ↗
              </a>
            </div>
          )}
 
          {content && (
            <div
              className="reader-content"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          )}
        </div>
        
        
      </div>
    </div>
  )
}
 