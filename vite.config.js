import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request to /rss?url=... gets forwarded to corsproxy.io
      // This tricks the browser into thinking the feed came from our own server
      '/rss': {
        target: 'https://corsproxy.io',
        changeOrigin: true,
        rewrite: (path) => path.replace('/rss', ''),
      },
    },
  },
})