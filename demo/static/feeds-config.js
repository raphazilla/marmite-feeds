/**
 * feeds-config.js — marmite-feeds demo
 * Multiple instances, one per demo section on the homepage.
 */
window.MarmiteFeeds = [

  /* ── 3 columns (default) ───────────────────────────────── */
  {
    containerId:  'feeds-3col',
    postsPerFeed: 5,
    feeds: [
      { type: 'hackernews', label: 'HN · Linux/DevOps', query: 'linux docker homelab ansible', tags: 'story', minPoints: 3 },
      { type: 'hackernews', label: 'HN · Show HN',      query: 'show hn', tags: 'show_hn' },
      { type: 'tabnews',    label: 'TabNews' },
    ],
  },

  /* ── 2 columns ──────────────────────────────────────────── */
  {
    containerId:  'feeds-2col',
    postsPerFeed: 5,
    feeds: [
      { type: 'hackernews', label: 'HN · Open Source', query: 'open source release', tags: '(story,show_hn)' },
      { type: 'hackernews', label: 'HN · Security',    query: 'security vulnerability cve', tags: 'story', minPoints: 10 },
    ],
  },

  /* ── 1 column, 10 items ─────────────────────────────────── */
  {
    containerId:  'feeds-1col',
    postsPerFeed: 10,
    feeds: [
      { type: 'hackernews', label: 'HN · Ask HN', query: 'ask hn', tags: 'ask_hn' },
    ],
  },

  /* ── DEV.to ─────────────────────────────────────────────── */
  {
    containerId: 'feeds-devto',
    feeds: [
      { type: 'devto', label: 'DEV.to · Linux',  tag: 'linux',  top: 7 },
      { type: 'devto', label: 'DEV.to · DevOps', tag: 'devops', top: 7 },
    ],
  },

  /* ── GitHub ─────────────────────────────────────────────── */
  {
    containerId: 'feeds-github',
    feeds: [
      { type: 'github', label: 'GitHub · Rust SSGs',   query: 'ssg language:rust stars:>50',    sort: 'updated' },
      { type: 'github', label: 'GitHub · Self-hosted', query: 'topic:self-hosted stars:>500',    sort: 'updated' },
    ],
  },

  /* ── Custom fetcher (static mock) ──────────────────────── */
  {
    containerId: 'feeds-custom',
    showLabel:   false,
    feeds: [
      {
        label: 'Custom fetcher — static mock',
        fetcher: async function () {
          return [
            { title: 'Custom API item #1 — title from your fetcher',     link: 'https://example.com/1', score: 42, comments: 7, date: Math.floor(Date.now() / 1000) - 1800,  icon: '★' },
            { title: 'Custom API item #2 — any JSON endpoint works',     link: 'https://example.com/2', score: 18, comments: 3, date: Math.floor(Date.now() / 1000) - 7200,  icon: '★' },
            { title: 'Custom API item #3 — score, comments, date, icon', link: 'https://example.com/3', score: 9,  comments: 1, date: Math.floor(Date.now() / 1000) - 86400, icon: '★' },
          ];
        },
      },
    ],
  },

];
