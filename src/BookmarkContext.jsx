import { createContext, useContext, useState, useEffect } from 'react';


const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const [nickname, setNickname] = useState(() =>
    localStorage.getItem('lucynews_nickname') || null
  );

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lucynews_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  // Persist bookmarks whenever they change
  useEffect(() => {
    localStorage.setItem('lucynews_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const resetNickname = () => {
    localStorage.removeItem('lucynews_nickname');
    setNickname(null);
  };
  
  const saveNickname = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem('lucynews_nickname', trimmed);
    setNickname(trimmed);
  };

  const addBookmark = (article) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.url === article.link)) return prev; // no dupes
      return [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          title: article.title,
          url: article.link,
          source: article.source,
          category: article.category,
          savedAt: new Date().toISOString(),
          nickname,
        },
        ...prev,
      ];
    });
  };

  const removeBookmark = (url) =>
    setBookmarks((prev) => prev.filter((b) => b.url !== url));

  const isBookmarked = (url) => bookmarks.some((b) => b.url === url);

  const exportBookmarks = () => {
    const data = JSON.stringify({ nickname, exportedAt: new Date().toISOString(), bookmarks }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lucynews-bookmarks-${nickname || 'export'}.json`;
    a.click();
  };

  return (
    <BookmarkContext.Provider
      value={{ nickname, saveNickname, resetNickname, bookmarks, addBookmark, removeBookmark, isBookmarked, exportBookmarks }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);