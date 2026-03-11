---
date: 2025-07-05
title: Supported feed sources and CORS compatibility
tags: marmite, feeds, api
description: Overview of the built-in feed sources in marmite-feeds — Hacker News, TabNews, DEV.to, GitHub — and how to add custom sources.
---

marmite-feeds works with any JSON API that exposes native CORS headers.
Here is a summary of the built-in sources and their options.

## Hacker News — `type: "hackernews"`

Uses the [Algolia HN Search API](https://hn.algolia.com/api). No key required.

| Option | Description |
|--------|-------------|
| `query` | Full-text search query |
| `tags` | Filter: `story`, `show_hn`, `ask_hn`, `(story,show_hn)` |
| `minPoints` | Minimum score threshold (default: 1) |

```js
{ type: "hackernews", label: "HN · DevOps", query: "docker kubernetes", tags: "story", minPoints: 5 }
```

## TabNews — `type: "tabnews"`

Brazilian tech community at [tabnews.com.br](https://www.tabnews.com.br/).
No configuration needed — returns the latest relevant posts.

```js
{ type: "tabnews", label: "TabNews" }
```

## DEV.to — `type: "devto"`

Articles from [DEV.to](https://dev.to). Public API, native CORS, no key required.

| Option | Description |
|--------|-------------|
| `tag` | Filter by tag (e.g. `linux`, `devops`) |
| `username` | Filter by author username |
| `top` | Recency window in days (e.g. `7` = last 7 days) |

```js
{ type: "devto", label: "DEV.to · Linux", tag: "linux", top: 7 }
```

## GitHub — `type: "github"`

Repository search via the [GitHub Search API](https://docs.github.com/en/rest/search).
Rate limit: 60 requests/hour unauthenticated — use `cacheTtlMs` to stay within limits.

| Option | Description |
|--------|-------------|
| `query` | GitHub search query (`language:rust stars:>50`) |
| `sort` | Sort: `updated`, `stars`, `forks` |

```js
{ type: "github", label: "GitHub · Self-hosted", query: "topic:self-hosted stars:>500", sort: "updated" }
```

## Custom fetcher

Any feed can use an async `fetcher` function instead of a built-in `type`.
Return an array of items with `title`, `link`, `score`, `comments`, `date`, and `icon`.

```js
{
  label: "Mastodon · #linux",
  fetcher: async function (feed) {
    const res  = await fetch("https://mastodon.social/api/v1/timelines/tag/linux?limit=5");
    const data = await res.json();
    return data.map(post => ({
      title:    post.account.display_name + ': ' + post.content.replace(/<[^>]+>/g, '').slice(0, 80),
      link:     post.url,
      score:    post.favourites_count || 0,
      comments: post.replies_count    || 0,
      date:     post.created_at,
      icon:     "🐘",
    }));
  }
}
```

> **Note:** Lobste.rs has great content but no CORS headers. Its JSON API requires
> a server-side proxy to use in the browser.
