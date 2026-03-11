---
date: 2025-07-10
title: How to add community feeds to your Marmite blog
tags: marmite, tutorial, feeds
description: Step-by-step guide to integrate marmite-feeds into any Marmite static site using only _htmlhead.md — no template changes needed.
---

marmite-feeds is a zero-dependency JavaScript widget that adds live community feeds
to any Marmite static site. The integration takes about two minutes.

## Step 1 — Copy the files

Download `marmite-feeds.js` and `marmite-feeds.css` from the
[releases page](https://github.com/raphazilla/marmite-feeds/releases) and copy them to your
theme's `static/` directory:

```text
theme/static/
  marmite-feeds.js
  marmite-feeds.css
  feeds-config.js   ← your config (create this)
```

## Step 2 — Add the scripts

Create (or edit) `content/_htmlhead.md`:

```html
<link rel="stylesheet" href="{{ url_for(path='static/marmite-feeds.css') }}">
<script src="{{ url_for(path='static/feeds-config.js') }}"></script>
<script src="{{ url_for(path='static/marmite-feeds.js') }}"></script>
```

That's it — no template modification needed. `_htmlhead.md` injects HTML into
the `<head>` of every page.

## Step 3 — Add a container

In any markdown page or `_hero.md`, add a container div:

```html
<div id="my-feeds"></div>
```

## Step 4 — Configure

Create `theme/static/feeds-config.js`:

```js
window.MarmiteFeeds = {
  containerId: "my-feeds",
  feeds: [
    { type: "hackernews", label: "Hacker News", query: "linux homelab" },
    { type: "tabnews",    label: "TabNews" },
  ]
};
```

Rebuild and you're done. The widget lazy-loads feeds when the container scrolls
into view and caches results in `sessionStorage` for 15 minutes.
