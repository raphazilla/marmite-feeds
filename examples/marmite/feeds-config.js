/**
 * feeds-config.js — marmite-feeds configuration
 * Place this file in your theme's static/ folder alongside marmite-feeds.js.
 * Edit the feeds array to match your blog's topics.
 */
window.MarmiteFeeds = {
  containerId:  'feeds-container',
  postsPerFeed: 5,
  cacheTtlMs:   15 * 60 * 1000,
  label:        '// community feeds',

  /* Uncomment and edit for your language */
  // locale: {
  //   loading:     'Carregando…',       // PT-BR
  //   unavailable: 'Indisponível',
  //   rateLimit:   'Rate limit — tente em instantes',
  //   ago:         ' atrás',
  // },

  feeds: [
    /* ── Hacker News ──────────────────────────────────────── */
    {
      type:      'hackernews',
      label:     'Hacker News',
      query:     'linux docker homelab',  /* ← edit to match your topics */
      tags:      'story',
      minPoints: 3,
    },

    /* ── TabNews (Brazilian tech community) ──────────────── */
    // {
    //   type:  'tabnews',
    //   label: 'TabNews',
    // },

    /* ── Custom fetcher example ──────────────────────────── */
    // {
    //   label: 'My Custom Feed',
    //   fetcher: async function (feed) {
    //     var res = await fetch('https://api.example.com/posts');
    //     var data = await res.json();
    //     return data.map(function (item) {
    //       return {
    //         title:    item.title,
    //         link:     item.url,
    //         score:    item.votes    || 0,
    //         comments: item.replies  || 0,
    //         date:     item.created_at,
    //         icon:     '★',
    //       };
    //     });
    //   },
    // },
  ],
};
