---
date: 2025-07-01
title: Configuration reference
tags: marmite, feeds, configuration
description: Full reference for the window.MarmiteFeeds configuration object — all options with defaults and examples.
---

`window.MarmiteFeeds` accepts either a single config object or an array of objects
(one per container, for multiple independent instances on the same page).

## Top-level options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `containerId` | `string` | `"feeds-container"` | ID of the container element |
| `feeds` | `array` | required | List of feed configs (see below) |
| `postsPerFeed` | `number` | `5` | Items to show per feed column |
| `showLabel` | `boolean` | `true` | Show the `// community feeds` header |
| `label` | `string` | `"// community feeds"` | Custom header text |
| `cacheTtlMs` | `number` | `900000` | Cache TTL in ms (default 15 min) |
| `locale` | `object` | see below | UI string overrides |

## `locale` options

| Key | Default |
|-----|---------|
| `loading` | `"Loading…"` |
| `unavailable` | `"Unavailable"` |
| `rateLimit` | `"Rate limit — try again shortly"` |
| `ago` | `" ago"` |

## Per-feed options

| Option | Feeds | Description |
|--------|-------|-------------|
| `type` | all built-in | `"hackernews"`, `"tabnews"`, `"devto"`, `"github"` |
| `label` | all | Column header text |
| `fetcher` | custom | Async function returning items array |
| `query` | hackernews, github | Search query string |
| `tags` | hackernews | Tag filter |
| `minPoints` | hackernews | Minimum score (default: 1) |
| `tag` | devto | Tag filter |
| `username` | devto | Author filter |
| `top` | devto | Recency window in days |
| `sort` | github | Sort field: `updated`, `stars`, `forks` |

## Multiple instances

Pass an array to run independent instances on the same page:

```js
window.MarmiteFeeds = [
  {
    containerId: "sidebar-feeds",
    postsPerFeed: 8,
    feeds: [{ type: "hackernews", label: "Hacker News", query: "linux" }]
  },
  {
    containerId: "footer-feeds",
    showLabel: false,
    feeds: [{ type: "tabnews", label: "TabNews" }]
  }
];
```

## CSS custom properties

Override these on the container element or in your theme CSS:

| Property | Default | Description |
|----------|---------|-------------|
| `--mf-columns` | `repeat(auto-fit, minmax(240px, 1fr))` | Grid columns |
| `--mf-gap` | `1rem` | Grid gap |
| `--mf-card-bg` | `#f6f8fa` | Card background |
| `--mf-border` | `#d0d7de` | Border color |
| `--mf-accent` | `#0969da` | Link/accent color |
| `--mf-radius` | `6px` | Border radius |
| `--mf-text` | `#24292f` | Body text color |
| `--mf-heading-color` | `--mf-accent` | Feed title color |
| `--mf-meta-color` | `#57606a` | Meta text (score, date) |
| `--mf-label-color` | `#57606a` | Section label color |
| `--mf-font-mono` | system mono | Monospace font |
| `--mf-font-body` | system sans | Body font |
