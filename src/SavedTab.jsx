import { useState } from 'react';
import { useBookmarks } from './BookmarkContext';
import { Trash2, Link, BookmarkX } from 'lucide-react';
import './SavedTab.css';

export default function SavedTab({ onOpenArticle }) {
  const { bookmarks, removeBookmark, exportBookmarks, nickname } = useBookmarks();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = async (bookmark) => {
    try {
      await navigator.clipboard.writeText(bookmark.url);
    } catch {
      prompt('Copy this link:', bookmark.url);
    }
    setCopiedId(bookmark.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

  if (bookmarks.length === 0) {
    return (
      <div className="saved-empty">
        <BookmarkX size={40} strokeWidth={1.25} color="#333" />
        <p>No saved articles yet.</p>
        <p className="saved-empty-hint">
          Click the <strong>bookmark icon</strong> on any article card to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="saved-tab">
      <div className="saved-header">
        <span className="saved-count">
          {bookmarks.length} saved{bookmarks.length !== 1 ? '' : ''}
          {nickname ? <span className="saved-nick"> · {nickname}</span> : null}
        </span>
        <button className="export-btn" onClick={exportBookmarks} title="Export bookmarks as JSON">
          ↓ Export
        </button>
      </div>

      <div className="saved-list">
        {bookmarks.map((b) => (
          <div key={b.id} className="saved-card">
            <div className="saved-card-meta">
              <span className="saved-source">{b.source}</span>
              <span className="saved-category-tag">{b.category}</span>
              <span className="saved-date">{formatDate(b.savedAt)}</span>
            </div>

            {/* Clicking the title opens the reader if a handler is provided */}
            <span
              className="saved-title"
              onClick={() => onOpenArticle?.({ title: b.title, link: b.url, source: b.source })}
            >
              {b.title}
            </span>

            <div className="saved-actions">
              <button
                className={`saved-copy-btn ${copiedId === b.id ? 'copied' : ''}`}
                onClick={() => handleCopyLink(b)}
              >
                {copiedId === b.id ? '✓ Copied!' : <><Link size={12} style={{marginRight: '4px', verticalAlign: 'middle'}} />Copy link</>}
              </button>

             <a 
                className="saved-original-btn"
                href={b.url}
                target="_blank"
                rel="noreferrer"
              >
                ↗ Original
              </a>
              <button
                className="saved-remove-btn"
                onClick={() => removeBookmark(b.url)}
                title="Remove bookmark"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}