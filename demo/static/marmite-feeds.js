/**
 * marmite-feeds.js
 * Community feeds widget for Marmite static sites.
 * Zero dependencies. Configure via window.MarmiteFeeds before loading.
 *
 * Single instance:   window.MarmiteFeeds = { containerId, feeds, ... }
 * Multi instance:    window.MarmiteFeeds = [ { containerId, feeds }, { containerId, feeds } ]
 *
 * https://github.com/raphazilla/marmite-feeds
 * MIT License
 */
(function () {
  'use strict';

  /* ── utils ──────────────────────────────────────────────── */

  function timeAgo(val) {
    var ts = typeof val === 'number' ? val : Math.floor(new Date(val).getTime() / 1000);
    var d  = Math.floor(Date.now() / 1000 - ts);
    if (d < 3600)  return Math.floor(d / 60)  + 'm';
    if (d < 86400) return Math.floor(d / 3600) + 'h';
    return             Math.floor(d / 86400)   + 'd';
  }

  function truncate(s, n) {
    return s && s.length > n ? s.slice(0, n).trimEnd() + '\u2026' : (s || '');
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── built-in fetchers ───────────────────────────────────── */

  async function fetchHN(feed, postsPerFeed) {
    var n = feed.postsPerFeed || postsPerFeed;
    var params = 'tags='          + encodeURIComponent(feed.tags || 'story')
      + '&query='         + encodeURIComponent(feed.query || '')
      + '&optionalWords=' + encodeURIComponent(feed.query || '')
      + '&hitsPerPage='   + n;
    if (feed.minPoints) {
      params += '&numericFilters=' + encodeURIComponent('points>' + feed.minPoints);
    }
    var url = 'https://hn.algolia.com/api/v1/search_by_date?' + params;
    var res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var json = await res.json();
    return (json.hits || []).slice(0, n).map(function (hit) {
      return {
        title:    hit.title || '',
        link:     hit.url || ('https://news.ycombinator.com/item?id=' + hit.objectID),
        score:    hit.points       || 0,
        comments: hit.num_comments || 0,
        date:     hit.created_at_i || 0,
        icon:     '\u25b2', /* ▲ */
      };
    });
  }

  async function fetchTabNews(feed, postsPerFeed) {
    var n        = feed.postsPerFeed || postsPerFeed;
    var strategy = feed.strategy    || 'new';
    var url = 'https://www.tabnews.com.br/api/v1/contents?strategy='
      + encodeURIComponent(strategy) + '&per_page=' + n;
    var res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var items = await res.json();
    return items.slice(0, n).map(function (item) {
      return {
        title:    item.title || '',
        link:     'https://www.tabnews.com.br/' + item.owner_username + '/' + item.slug,
        score:    item.tabcoins       || 0,
        comments: item.comments_count || 0,
        date:     item.published_at   || item.created_at || 0,
        icon:     '\u25c6', /* ◆ */
      };
    });
  }

  async function fetchDevTo(feed, postsPerFeed) {
    var n = feed.postsPerFeed || postsPerFeed;
    var params = 'per_page=' + n;
    if (feed.tag)  params += '&tag='  + encodeURIComponent(feed.tag);
    if (feed.top)  params += '&top='  + encodeURIComponent(feed.top); /* days */
    if (feed.username) params += '&username=' + encodeURIComponent(feed.username);
    var url = 'https://dev.to/api/articles?' + params;
    var res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var items = await res.json();
    return items.slice(0, n).map(function (item) {
      return {
        title:    item.title || '',
        link:     item.url   || '',
        score:    item.positive_reactions_count || 0,
        comments: item.comments_count           || 0,
        date:     item.published_at             || 0,
        icon:     '\u2665', /* ♥ reactions */
      };
    });
  }

  async function fetchGitHub(feed, postsPerFeed) {
    var n = feed.postsPerFeed || postsPerFeed;
    var q = feed.query || 'stars:>100';
    var sort = feed.sort || 'updated';
    var url = 'https://api.github.com/search/repositories?q='
      + encodeURIComponent(q) + '&sort=' + encodeURIComponent(sort)
      + '&per_page=' + n;
    var res = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var json = await res.json();
    return (json.items || []).slice(0, n).map(function (repo) {
      return {
        title:    repo.full_name    || '',
        link:     repo.html_url    || '',
        score:    repo.stargazers_count || 0,
        comments: repo.forks_count      || 0,
        date:     repo.updated_at       || 0,
        icon:     '\u2605', /* ★ stars */
      };
    });
  }

  var BUILTIN = {
    hackernews: fetchHN,
    tabnews:    fetchTabNews,
    devto:      fetchDevTo,
    github:     fetchGitHub,
  };

  function getFetcher(feed) {
    if (typeof feed.fetcher === 'function') return feed.fetcher;
    if (feed.type && BUILTIN[feed.type])    return BUILTIN[feed.type];
    return null;
  }

  /* ── render ─────────────────────────────────────────────── */

  function renderWidget(container, feed, items, error, i18n, titleMaxLen) {
    var w = document.createElement('div');
    w.className = 'feeds-widget';

    if (error || !items || items.length === 0) {
      w.innerHTML = '<h3>' + esc(feed.label) + '</h3>'
        + '<p class="feeds-post-meta" style="padding:.5rem 0">'
        + esc(error === 'rate-limit' ? i18n.rateLimit : i18n.unavailable)
        + '</p>';
      container.appendChild(w);
      return;
    }

    var li = items.map(function (item) {
      return '<li>'
        + '<a href="' + esc(item.link) + '" target="_blank" rel="noopener noreferrer">'
        +   esc(truncate(item.title, titleMaxLen))
        + '</a>'
        + '<div class="feeds-post-meta">'
        +   esc(item.icon) + ' ' + esc(String(item.score))
        + ' &nbsp;&middot;&nbsp; &#128172; ' + esc(String(item.comments))
        + ' &nbsp;&middot;&nbsp; ' + esc(timeAgo(item.date)) + esc(i18n.ago)
        + '</div>'
        + '</li>';
    }).join('');

    w.innerHTML = '<h3>' + esc(feed.label) + '</h3>'
      + '<ul class="feeds-post-list">' + li + '</ul>';
    container.appendChild(w);
  }

  function renderAll(container, feeds, results, i18n, titleMaxLen) {
    container.querySelectorAll('.feeds-widget').forEach(function (el) { el.remove(); });
    feeds.forEach(function (feed, i) {
      var result = results[i];
      renderWidget(container, feed,
        result && !result.error ? result : null,
        result && result.error  ? result.error : null,
        i18n, titleMaxLen);
    });
  }

  function showPlaceholders(container, feeds, i18n) {
    feeds.forEach(function (feed) {
      var w = document.createElement('div');
      w.className = 'feeds-widget';
      w.innerHTML = '<h3>' + esc(feed.label) + '</h3>'
        + '<p class="feeds-loading">' + esc(i18n.loading) + '</p>';
      container.appendChild(w);
    });
  }

  /* ── instance ────────────────────────────────────────────── */

  function initInstance(cfg) {
    var containerId   = cfg.containerId   || 'feeds-container';
    var postsPerFeed  = cfg.postsPerFeed  || 5;
    var cacheTtlMs    = cfg.cacheTtlMs    || 15 * 60 * 1000;
    var cacheKey      = cfg.cacheKey      || 'marmite_feeds_' + containerId;
    var labelText     = cfg.label         || '// community feeds';
    var showLabel     = cfg.showLabel     !== false;
    var titleMaxLen   = cfg.titleMaxLen   || 85;
    var feeds         = cfg.feeds         || [];

    var i18n = Object.assign({
      loading:     'Loading\u2026',
      unavailable: 'Unavailable',
      rateLimit:   'Rate limit \u2014 try again shortly',
      ago:         ' ago',
    }, cfg.locale || {});

    var container = document.getElementById(containerId);
    if (!container || !feeds.length) return;

    container.classList.add('feeds-container');

    /* section label */
    if (showLabel) {
      var lbl = document.createElement('div');
      lbl.className = 'feeds-section-label';
      lbl.textContent = labelText;
      container.appendChild(lbl);
    }

    /* cache helpers (scoped per instance) */
    function readCache() {
      try {
        var raw = sessionStorage.getItem(cacheKey);
        if (!raw) return null;
        var obj = JSON.parse(raw);
        if (Date.now() - obj.ts > cacheTtlMs) return null;
        return obj.data;
      } catch (_) { return null; }
    }

    function writeCache(data) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: data }));
      } catch (_) {}
    }

    async function load() {
      var cached = readCache();
      if (cached) { renderAll(container, feeds, cached, i18n, titleMaxLen); return; }

      showPlaceholders(container, feeds, i18n);

      var results = await Promise.all(feeds.map(async function (feed) {
        var fetcher = getFetcher(feed);
        if (!fetcher) return { error: 'error' };
        try {
          return await fetcher(feed, postsPerFeed);
        } catch (_) {
          return { error: 'error' };
        }
      }));

      writeCache(results);
      renderAll(container, feeds, results, i18n, titleMaxLen);
    }

    /* lazy load */
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { obs.disconnect(); load(); }
      }, { rootMargin: '200px' });
      observer.observe(container);
    } else {
      load();
    }
  }

  /* ── bootstrap ───────────────────────────────────────────── */

  function bootstrap() {
    var raw = window.MarmiteFeeds;
    if (!raw) return;
    var configs = Array.isArray(raw) ? raw : [raw];
    configs.forEach(initInstance);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
