function parseTerms(str) {
  return str
    .split(/,|\s+/)
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)
}
 
export function filterArticles(articles, includeRaw, excludeRaw) {
  const include = parseTerms(includeRaw)
  const exclude = parseTerms(excludeRaw)
 
  return articles.filter(article => {
    const haystack = (article.title + ' ' + article.source).toLowerCase()
 
    if (include.length > 0) {
      const matchesAll = include.every(term => haystack.includes(term))
      if (!matchesAll) return false
    }
 
    if (exclude.length > 0) {
      const matchesAny = exclude.some(term => haystack.includes(term))
      if (matchesAny) return false
    }
 
    return true
  })
}