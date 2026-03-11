# marmite-feeds

Community feeds widget for [Marmite](https://github.com/rochacbruno/marmite) static sites.

Drop two lines into `_htmlhead.md`, add a container div, done.

- Zero dependencies — pure vanilla JS
- Built-in support for **Hacker News** (via Algolia), **TabNews**, **DEV.to**, **GitHub**
- Custom fetcher API for any JSON endpoint with native CORS
- `sessionStorage` cache (configurable TTL)
- Lazy-loaded via `IntersectionObserver`
- Fully i18n — all strings configurable
- Themed via CSS custom properties

---

## Quick start — default Marmite theme

No template modification needed. Uses Marmite's built-in fragment files.

**1. Create `content/_htmlhead.md`** with your config and CDN links:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/raphazilla/marmite-feeds@master/marmite-feeds.css">
<script>
window.MarmiteFeeds = {
  feeds: [
    { type: 'hackernews', label: 'Hacker News', query: 'linux docker homelab', minPoints: 3 },
    { type: 'tabnews',    label: 'TabNews' },
  ],
};
</script>
<script src="https://cdn.jsdelivr.net/gh/raphazilla/marmite-feeds@master/marmite-feeds.js"></script>
```

**2. Add the container div** wherever you want feeds to appear.

For the homepage hero, create `content/_hero.md`:

```html
<div id="feeds-container"></div>
```

That's it. No files to copy, no templates to edit.

---

## Quick start — custom theme

If you already have a custom Marmite theme:

**1. Copy files to your theme's `static/` folder:**

```
theme/static/
├── marmite-feeds.js
├── marmite-feeds.css
└── feeds-config.js   ← your config (copy from examples/marmite/)
```

**2. Edit `feeds-config.js`** with your topics:

```js
window.MarmiteFeeds = {
  feeds: [
    { type: 'hackernews', label: 'Hacker News', query: 'linux docker homelab', minPoints: 3 },
    { type: 'tabnews',    label: 'TabNews' },
  ],
};
```

**3. Add the container div and scripts to your template** (`base.html` or `list.html`):

```html
<!-- where you want the feeds to appear -->
{% if current_page == "index.html" %}
<div id="feeds-container"></div>
{% endif %}

<!-- load the widget -->
<link rel="stylesheet" href="{{ url_for(path='static/marmite-feeds.css') }}">
<script src="{{ url_for(path='static/feeds-config.js') }}"></script>
<script src="{{ url_for(path='static/marmite-feeds.js') }}"></script>
```

That's it.

---

## Configuration reference

All options are set via `window.MarmiteFeeds` before loading the script.

| Option | Type | Default | Description |
|---|---|---|---|
| `containerId` | string | `'feeds-container'` | ID of the container element |
| `postsPerFeed` | number | `5` | Max items per feed |
| `cacheTtlMs` | number | `900000` (15 min) | Cache duration in milliseconds |
| `cacheKey` | string | `'marmite_feeds_v1'` | `sessionStorage` key |
| `label` | string | `'// community feeds'` | Section header text |
| `showLabel` | boolean | `true` | Show/hide the section header |
| `titleMaxLen` | number | `85` | Max characters for item titles |
| `locale` | object | see below | i18n strings |
| `feeds` | array | `[]` | Feed definitions (required) |

### locale

```js
locale: {
  loading:     'Loading…',
  unavailable: 'Unavailable',
  rateLimit:   'Rate limit — try again shortly',
  ago:         ' ago',   // suffix after "5m", "2h", "3d"
}
```

Portuguese example:

```js
locale: {
  loading:     'Carregando…',
  unavailable: 'Indisponível',
  rateLimit:   'Rate limit — tente em instantes',
  ago:         ' atrás',
}
```

---

## Built-in feed types

### `hackernews`

Uses the [Algolia HN Search API](https://hn.algolia.com/api) — no authentication required.

```js
{
  type:      'hackernews',
  label:     'Hacker News',   // required
  query:     'linux docker',  // search keywords
  tags:      'story',         // story | show_hn | ask_hn | (story,show_hn)
  minPoints: 3,               // minimum score filter (optional)
  postsPerFeed: 5,            // override global postsPerFeed (optional)
}
```

### `tabnews`

Uses the [TabNews public API](https://www.tabnews.com.br/api/v1/contents) — Brazilian tech community.

```js
{
  type:     'tabnews',
  label:    'TabNews',  // required
  strategy: 'new',      // new | relevant | old (optional, default: 'new')
  postsPerFeed: 5,      // override global postsPerFeed (optional)
}
```

### `devto`

Uses the [DEV.to public API](https://developers.forem.com/api) — no authentication required.
Score = ♥ reactions.

```js
{
  type:         'devto',
  label:        'DEV.to',   // required
  tag:          'linux',    // filter by tag (optional)
  top:          7,          // articles from last N days (optional)
  username:     'user',     // filter by author username (optional)
  postsPerFeed: 5,          // override global postsPerFeed (optional)
}
```

### `github`

Uses the [GitHub Search API](https://docs.github.com/en/rest/search/search#search-repositories) — no authentication required.
Score = ★ stars, comments column = forks.

> **Rate limit:** 60 requests/hour unauthenticated. The built-in cache keeps this well within limits for normal blog traffic.

```js
{
  type:         'github',
  label:        'GitHub',            // required
  query:        'topic:self-hosted', // GitHub search query
  sort:         'updated',           // updated | stars | forks (optional, default: 'updated')
  postsPerFeed: 5,                   // override global postsPerFeed (optional)
}
```

### Source compatibility

| Source | CORS | Auth | Notes |
|---|---|---|---|
| Hacker News | ✅ | none | via Algolia API |
| TabNews | ✅ | none | Brazilian community |
| DEV.to | ✅ | none | global dev community |
| GitHub | ✅ | none | 60 req/h rate limit |
| Lobste.rs | ❌ | none | great content, needs CORS proxy |
| Mastodon | ✅ | none | use custom fetcher, instance-specific |
| Reddit | ❌ | OAuth | API requires authentication since 2023 |

---

## Custom fetchers

Any feed can use a custom `fetcher` function instead of `type`.
The function receives the feed config object and must return a `Promise` that resolves to an array of items:

```js
{
  label: 'My Feed',
  fetcher: async function (feed) {
    var res  = await fetch('https://api.example.com/posts');
    var data = await res.json();
    return data.map(function (item) {
      return {
        title:    item.title,         // string (required)
        link:     item.url,           // string (required)
        score:    item.votes   || 0,  // number
        comments: item.replies || 0,  // number
        date:     item.created_at,    // Unix timestamp (number) or ISO string
        icon:     '★',               // string displayed before score
      };
    });
  },
}
```

---

## CSS customization

The widget uses CSS custom properties with sensible defaults. Override them in your theme:

```css
:root {
  --mf-card-bg:       #ffffff;
  --mf-border:        #e0e0e0;
  --mf-accent:        #0066cc;   /* top border + heading color */
  --mf-radius:        4px;
  --mf-text:          #333333;
  --mf-heading-color: #0066cc;
  --mf-meta-color:    #888888;
  --mf-label-color:   #888888;
  --mf-font-mono:     monospace;
  --mf-font-body:     system-ui, sans-serif;
  --mf-columns:       repeat(auto-fit, minmax(240px, 1fr));
  --mf-gap:           1rem;
}
```

### Using your theme's existing variables

If your theme already defines variables, map them in your CSS:

```css
:root {
  --mf-card-bg:       var(--bg-card);
  --mf-border:        var(--border);
  --mf-accent:        var(--cyan);
  --mf-text:          var(--text);
  --mf-heading-color: var(--amber);
  --mf-meta-color:    var(--text-muted);
  --mf-font-mono:     var(--font-mono);
  --mf-font-body:     var(--font-body);
}
```

### CSS classes

| Class | Element |
|---|---|
| `#feeds-container` | Outer grid container |
| `.feeds-section-label` | Section header (`// community feeds`) |
| `.feeds-widget` | Individual feed card |
| `.feeds-widget h3` | Feed title / heading |
| `.feeds-post-list` | `<ul>` of items |
| `.feeds-post-meta` | Score / comments / time line |
| `.feeds-loading` | Loading placeholder text |

---

## Container ID

The default container ID is `feeds-container`. You can change it:

```js
window.MarmiteFeeds = { containerId: 'my-feeds', ... };
```

```html
<div id="my-feeds"></div>
```

---

## Browser support

Works in all evergreen browsers. Uses:

- `fetch` API
- `async/await` (transpile if you need IE11 support)
- `IntersectionObserver` (falls back to immediate load if unavailable)
- `sessionStorage` (fails silently if unavailable)

---

## License

MIT
