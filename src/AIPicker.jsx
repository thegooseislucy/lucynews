import { useState } from 'react'
import './AIPicker.css'
 
const BOTS = [
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/new',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com/',
  },
]
 
// Builds the prompt that gets copied to clipboard
function buildPrompt(article) {
  return `I'm reading an article and would like your help understanding it.
 
Title: "${article.title}"
Source: ${article.source}
Link: ${article.link}
 
Please read the article at the link above and give me:
1. A concise summary of the key points
2. Any important context I should know
3. Any notable omissions or other perspectives worth considering`
}
 
export default function AIPicker({ article, onClose }) {
  const [copied, setCopied] = useState(false)
 
  async function pick(bot) {
    const prompt = buildPrompt(article)
 
    // Copy prompt to clipboard
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
 
    // Open the AI site in a new tab after a short delay
    // so the user sees the toast before focus shifts
    setTimeout(() => {
      window.open(bot.url, '_blank')
    }, 1500)
 
    // Reset after a couple seconds so they can pick again if needed
    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }
 
  return (
    <div className="aipicker__backdrop" onClick={onClose}>
      <div className="aipicker" onClick={e => e.stopPropagation()}>
 
        {!copied ? (
          <>
            <p className="aipicker__label">Open article with...</p>
            <div className="aipicker__bots">
              {BOTS.map(bot => (
                <button
                  key={bot.id}
                  className="aipicker__bot"
                  onClick={() => pick(bot)}
                >
                  {bot.name}
                </button>
              ))}
            </div>
            <button className="aipicker__cancel" onClick={onClose}>Cancel</button>
          </>
        ) : (
          <div className="aipicker__toast">
            <div className="aipicker__toast-icon">✓</div>
            <p className="aipicker__toast-text">
              Prompt copied — paste with <kbd>Cmd+V</kbd>
            </p>
          </div>
        )}
 
      </div>
    </div>
  )
}