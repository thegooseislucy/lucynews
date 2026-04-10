import { useState, useEffect } from 'react'
import './App.css'
import ReaderModal from './ReaderModal'
import FilterBar from './FilterBar'
import { filterArticles } from './filterArticles'
import { BookmarkProvider, useBookmarks } from './BookmarkContext'
import { Bookmark } from 'lucide-react'
import NicknameModal from './NicknameModal'
import SavedTab from './SavedTab'
import { Analytics } from '@vercel/analytics/next'

const FEEDS = [
  // IT & Security
  { name: 'BleepingComputer',         category: 'IT & Security', url: 'https://www.bleepingcomputer.com/feed/' },
  { name: 'Krebs on Security',        category: 'IT & Security', url: 'https://krebsonsecurity.com/feed' },
  { name: 'The Hacker News',          category: 'IT & Security', url: 'https://feeds.feedburner.com/TheHackernews' },
  { name: 'ZDNet',                    category: 'IT & Security', url: 'https://zdnet.com/news/rss.xml' },
  { name: 'TechRepublic',             category: 'IT & Security', url: 'https://techrepublic.com/feed' },
  { name: 'The Register',             category: 'IT & Security', url: 'https://theregister.com/headlines.atom' },
  { name: 'CVEfeed — High/Critical',  category: 'IT & Security', url: 'https://cvefeed.io/rssfeed/severity/high.xml' },
  { name: 'Microsoft Security Guide', category: 'IT & Security', url: 'https://api.msrc.microsoft.com/update-guide/rss' },
  { name: 'Microsoft MSRC Blog',      category: 'IT & Security', url: 'https://msrc.microsoft.com/blog/feed' },
  { name: 'CISA Advisories',          category: 'IT & Security', url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml' },

  // Apple
  { name: '9to5Mac',                  category: 'Apple',         url: 'https://9to5mac.com/feed' },
  { name: 'MacRumors',                category: 'Apple',         url: 'https://feeds.macrumors.com/MacRumors' },
  { name: 'Macworld',                 category: 'Apple',         url: 'https://www.macworld.com/feed' },
  { name: 'Apple Developer Releases', category: 'Apple',         url: 'https://developer.apple.com/news/releases/rss/releases.rss' },

  // AI
  { name: 'VentureBeat AI',           category: 'AI',            url: 'https://venturebeat.com/category/ai/feed/' },
  { name: 'The Verge — AI',           category: 'AI',            url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
  { name: 'OpenAI News',              category: 'AI',            url: 'https://openai.com/news/rss.xml' },
  { name: 'MIT AI News',              category: 'AI',            url: 'https://news.mit.edu/rss/topic/artificial-intelligence2' },
  { name: 'TechCrunch AI',            category: 'AI',            url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },

  // Gaming
  { name: 'My Nintendo News',         category: 'Gaming',        url: 'https://mynintendonews.com/feed' },
  { name: 'Nintendo World Report',    category: 'Gaming',        url: 'https://www.nintendoworldreport.com/rss' },
  { name: 'GoNintendo',               category: 'Gaming',        url: 'https://gonintendo.com/feeds/all.xml' },

  // Emerging Tech
  { name: 'MIT Technology Review',    category: 'Emerging Tech', url: 'https://www.technologyreview.com/feed/' },
  { name: 'Ars Technica',             category: 'Emerging Tech', url: 'https://feeds.arstechnica.com/arstechnica/index' },
  { name: 'Wired',                    category: 'Emerging Tech', url: 'https://wired.com/feed/rss' },
  { name: 'New Scientist',            category: 'Emerging Tech', url: 'https://www.newscientist.com/feed/home/' },
  { name: 'Hacker News',              category: 'Emerging Tech', url: 'https://news.ycombinator.com/rss' },
  { name: 'GitHub Changelog',         category: 'Emerging Tech', url: 'https://github.blog/changelog/feed/' },

  // World News
  { name: 'BBC News — World',         category: 'World News',    url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { name: 'NPR — World',              category: 'World News',    url: 'https://feeds.npr.org/1004/rss.xml' },
  { name: 'The Guardian — World',     category: 'World News',    url: 'https://www.theguardian.com/world/rss' },

  // US News
  { name: 'PBS NewsHour',             category: 'US News',       url: 'https://www.pbs.org/newshour/feeds/rss/headlines' },
  { name: 'NPR — News',               category: 'US News',       url: 'https://feeds.npr.org/1001/rss.xml' },
  { name: 'The Hill',                 category: 'US News',       url: 'https://thehill.com/homenews/feed/' },
  { name: 'Oxygen — Crime News',      category: 'US News',       url: 'https://oxygen.com/feeds/crime-news' },
  { name: 'ProPublica',               category: 'US News',       url: 'https://feeds.propublica.org/propublica/main' },

  // Buyer Guides
  { name: 'Wirecutter',               category: 'Buyer Guides',  url: 'https://www.nytimes.com/wirecutter/feed/' },
  { name: 'The Verge — Reviews',      category: 'Buyer Guides',  url: 'https://www.theverge.com/rss/reviews/index.xml' },
  { name: 'Engadget',                 category: 'Buyer Guides',  url: 'https://engadget.com/rss.xml' },

// Durham & Duke
  { name: 'Duke Today',               category: 'Durham & Duke', url: 'https://today.duke.edu/rss/feed' },
  { name: 'The Duke Chronicle',       category: 'Durham & Duke', url: 'https://www.dukechronicle.com/feeds/rss.xml' },
  { name: 'Duke News',                category: 'Durham & Duke', url: 'https://news.duke.edu/feed' },
]

async function fetchFeed(feed) {
  const proxyUrl = `/rss/?url=${encodeURIComponent(feed.url)}`
  const response = await fetch(proxyUrl)
  const xmlText = await response.text()
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlText, 'text/xml')
  const items = Array.from(xml.querySelectorAll('item, entry'))
  return items.slice(0, 15).map(item => ({
    title:    item.querySelector('title')?.textContent?.trim() || 'No title',
    link:     item.querySelector('link')?.textContent?.trim()
              || item.querySelector('link')?.getAttribute('href')
              || '#',
    date:     item.querySelector('pubDate')?.textContent
              || item.querySelector('updated')?.textContent
              || item.querySelector('published')?.textContent
              || '',
    summary:  item.querySelector('description')?.textContent?.trim()
              || item.querySelector('summary')?.textContent?.trim()
              || '',
    source:   feed.name,
    category: feed.category,
  }))
}

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [includeFilter, setIncludeFilter] = useState('')
  const [excludeFilter, setExcludeFilter] = useState('')
  const [readerArticle, setReaderArticle] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [readUrls, setReadUrls] = useState(new Set())

  const { nickname, saveNickname, resetNickname, bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks()

  useEffect(() => {
    async function loadAllFeeds() {
      try {
        const results = await Promise.allSettled(
          FEEDS.map(feed =>
            fetchFeed(feed).catch(err => {
              console.warn(`Failed to load ${feed.name}:`, err)
              return []
            })
          )
        )
        const allArticles = results
          .filter(r => r.status === 'fulfilled')
          .flatMap(r => r.value)
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date))
        setArticles(allArticles)
      } catch (err) {
        setError('Something went wrong loading feeds. Check the console.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadAllFeeds()
  }, [refreshKey])

  if (!nickname) {
    return <NicknameModal onSave={saveNickname} />
  }

  const categories = ['All', ...new Set(FEEDS.map(f => f.category)), 'Saved']

  const categoryArticles = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  const visibleArticles = filterArticles(categoryArticles, includeFilter, excludeFilter)

  function openArticle(article) {
    setReadUrls(prev => new Set(prev).add(article.link))
    setReaderArticle(article)
  }

  return (
    <div className="app">


      <header className="header">
        <h1 className="logo"><span>Lucy</span>News</h1>
        <div className="header__sub">
          <p className="tagline">{articles.length} articles loaded</p>
          <button className="nickname-reset" onClick={resetNickname} title="Change nickname">
            {nickname} ·  change
          </button>
        </div>
        <button
          className="refresh-btn"
          onClick={() => { setArticles([]); setLoading(true); setRefreshKey(k => k + 1) }}
          disabled={loading}
        >
          {loading ? 'Loading...' : '↻ Refresh'}
        </button>
      </header>

      <nav className="tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`tab ${activeCategory === cat ? 'tab--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'Saved' && bookmarks.length > 0
              ? `Saved (${bookmarks.length})`
              : cat}
          </button>
        ))}
      </nav>

      {activeCategory !== 'Saved' && (
        <FilterBar
          includeVal={includeFilter}
          excludeVal={excludeFilter}
          onIncludeChange={setIncludeFilter}
          onExcludeChange={setExcludeFilter}
          filteredCount={visibleArticles.length}
          totalCount={categoryArticles.length}
        />
      )}

      <main className="feed">
        {activeCategory === 'Saved' ? (
          <SavedTab onOpenArticle={openArticle} />
        ) : (
          <>
            {loading && (
              <div className="status">Loading feeds...</div>
            )}

            {error && (
              <div className="status status--error">{error}</div>
            )}

            {!loading && visibleArticles.length === 0 && (
              <div className="status">No articles found.</div>
            )}

            {visibleArticles.map((article, i) => (
              <article key={i} className="card">
                <div className="card__meta">
                  <span className="card__source">{article.source}</span>
                  <span className="card__category">{article.category}</span>
                  <span className="card__date">
                    {article.date ? new Date(article.date).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="card__title-row">
                  <a
                    href={article.link}
                    className={`card__title ${readUrls.has(article.link) ? 'card__title--read' : ''}`}
                    onClick={e => { e.preventDefault(); openArticle(article) }}
                  >
                    {article.title}
                  </a>
                  <button
                    className={`card__bookmark ${isBookmarked(article.link) ? 'card__bookmark--saved' : ''}`}
                    onClick={() => isBookmarked(article.link) ? removeBookmark(article.link) : addBookmark(article)}
                    title={isBookmarked(article.link) ? 'Remove bookmark' : 'Save article'}
                  >
                    <Bookmark size={14} fill={isBookmarked(article.link) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </article>
            ))}
          </>
        )}
      </main>

      <ReaderModal article={readerArticle} onClose={() => setReaderArticle(null)} />
    </div>
  )
}

export default function AppWithProvider() {
  return (
    <BookmarkProvider>
      <App />
    </BookmarkProvider>
  )
}