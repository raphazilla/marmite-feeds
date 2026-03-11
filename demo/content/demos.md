---
title: Demos
description: Live demonstrations of the marmite-feeds widget — different layouts, feed sources, and configuration options.
---

All examples below are live — they fetch real data from each source.
Widget loaded via `_htmlhead.md`, no template modification needed.

---

### Default layout — 3 columns

Grid `auto-fit` with minimum card width of 240px.
Override with `--mf-columns` on the container element.

```js
window.MarmiteFeeds = {
  containerId: "feeds-3col",
  feeds: [
    { type: "hackernews", label: "HN · Linux/DevOps", query: "linux docker homelab" },
    { type: "hackernews", label: "HN · Show HN",      tags: "show_hn" },
    { type: "tabnews",    label: "TabNews" },
  ]
};
```

<div id="feeds-3col"></div>

---

### 2 columns — `--mf-columns`

Force a fixed column count with a CSS custom property on the container — no JS needed.

```html
<div id="my-feeds" style="--mf-columns: repeat(2, 1fr)"></div>
```

<div id="feeds-2col" style="--mf-columns: repeat(2, 1fr)"></div>

---

### 1 column, 10 items — `postsPerFeed`

Ideal for a sidebar. Combine `--mf-columns: 1fr` with `max-width` and `postsPerFeed`.

```js
{ postsPerFeed: 10, feeds: [{ type: "hackernews", tags: "ask_hn" }] }
```

<div id="feeds-1col" style="--mf-columns: 1fr; max-width: 420px"></div>

---

### DEV.to — `type: "devto"`

Filter by `tag`, `username`, or recency (`top` = last N days). No API key required.

```js
{ type: "devto", label: "DEV.to · Linux",  tag: "linux",  top: 7 }
{ type: "devto", label: "DEV.to · DevOps", tag: "devops", top: 7 }
```

<div id="feeds-devto"></div>

---

### GitHub — `type: "github"`

Repository search via the GitHub Search API. Rate limit: 60 req/h unauthenticated.

```js
{ type: "github", label: "GitHub · Rust SSGs",  query: "ssg language:rust stars:>50" }
{ type: "github", label: "GitHub · Self-hosted", query: "topic:self-hosted stars:>500" }
```

<div id="feeds-github"></div>

---

### Custom fetcher — `feed.fetcher`

Any async function returning items. Works with any CORS-native JSON API.

```js
{
  label: "My custom feed",
  fetcher: async function (feed) {
    const res  = await fetch("https://api.example.com/posts");
    const data = await res.json();
    return data.map(post => ({
      title: post.title, link: post.url,
      score: post.likes, comments: post.replies,
      date:  post.created_at, icon: "★",
    }));
  }
}
```

<div id="feeds-custom" style="--mf-columns: 1fr; max-width: 480px"></div>
