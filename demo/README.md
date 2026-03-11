# marmite-feeds demo

Live demo of the marmite-feeds widget running on a real Marmite site
with the default theme.

## Requirements

- [Docker](https://docs.docker.com/get-docker/)

## Usage

From the **project root** (one level up):

```bash
./demo.sh start    # builds and serves at http://localhost:8000
./demo.sh stop     # stops the container
./demo.sh logs     # follows container logs
```

## What it shows

- Homepage: project intro with links
- [/demos.html](http://localhost:8000/demos.html): live feeds in 6 configurations
  - 3 columns (default grid)
  - 2 columns (`--mf-columns`)
  - 1 column, 10 items (`postsPerFeed`)
  - DEV.to (`type: "devto"`)
  - GitHub (`type: "github"`)
  - Custom async fetcher (`feed.fetcher`)
- 3 documentation posts covering integration, sources, and configuration

## Structure

```
demo/
├── marmite.yaml          # site config (default Marmite theme, no custom theme)
├── static/               # marmite-feeds.js/css + Marmite default static files
│   ├── marmite-feeds.js  # synced from project root by demo.sh
│   ├── marmite-feeds.css # synced from project root by demo.sh
│   └── feeds-config.js   # demo feed configurations
└── content/
    ├── _htmlhead.md      # injects CSS/JS into <head> (no template change needed)
    ├── _hero.md          # homepage hero section
    ├── demos.md          # all demo configurations
    └── *.md              # documentation posts
```
