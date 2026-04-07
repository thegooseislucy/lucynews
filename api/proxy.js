export default async function handler(req, res) {
  const { url } = req.query

  if (!url) return res.status(400).send('Missing url parameter')

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LucyNews/1.0)' },
    })
    const contentType = response.headers.get('content-type') || 'application/xml'
    const body = await response.text()
    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(response.status).send(body)
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message)
  }
}