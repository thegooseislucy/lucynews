# LucyNews

A personal RSS reader built for my own reading habits. Clean, fast, no ads, no algorithms — just the feeds I care about.

**[lucynews.vercel.app](https://lucynews.vercel.app)**

## What it is

LucyNews pulls from 40+ RSS feeds across 9 categories — IT & Security, Apple, AI, Gaming, Emerging Tech, World News, US News, Buyer Guides, and Durham & Duke. Articles are sorted by date and presented without clutter.

## Features

- **Reader mode** — distills articles down to just the text, same engine Firefox uses
- **Ask AI** — copies a prompt to your clipboard and opens Claude or ChatGPT so you can discuss any article
- **Bookmarks** — save articles to a dedicated tab, with copy link and JSON export
- **Keyword filters** — show or hide articles by keyword in real time
- **Mark as read** — opened articles dim automatically

## Tech

React + Vite, no backend. CORS handled via a Vercel serverless function. Bookmarks and preferences stored in localStorage. Icons by Lucide React.

## Local development
```bash
npm install
npm run dev
```

## Built by

Lucy (the goose)

THANKS FOR READING THIS