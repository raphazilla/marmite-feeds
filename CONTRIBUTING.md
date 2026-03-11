# Contributing to marmite-feeds

Thanks for your interest in contributing!
marmite-feeds is intentionally minimal — please keep that spirit in mind.

## What we welcome

- **Bug fixes** — something broken? Open an issue first, then a PR.
- **New built-in feed sources** — must have a public JSON API with native CORS (no proxy needed).
  Check the [source compatibility table](README.md#source-compatibility) before proposing.
- **Documentation improvements** — typos, clearer examples, missing edge cases.
- **Demo improvements** — better examples, new configuration demos.
- **Translations** — `locale` object examples in other languages.

## What we don't want

- External dependencies (no npm, no bundler, no frameworks).
- Breaking changes to the `window.MarmiteFeeds` config API.
- Sources that require authentication or a server-side proxy.
- CSS that overrides user themes (all values must go through `--mf-*` custom properties).

## Development setup

No build step required.

```bash
git clone https://github.com/raphazilla/marmite-feeds
cd marmite-feeds

# Edit marmite-feeds.js or marmite-feeds.css directly

# Run the demo (requires Docker)
./demo.sh start   # http://localhost:8000
./demo.sh stop
./demo.sh logs
```

The demo uses Marmite's default theme with no template modifications —
a good way to verify the widget works in a real Marmite environment.

## Adding a new built-in source

1. Add a `fetchXxx(feed)` function in `marmite-feeds.js` that returns a `Promise<Item[]>`.
2. Register it in the `BUILTIN` map.
3. Document options in `README.md` (options table + example snippet).
4. Add a demo section in `demo/content/demos.md` and a matching config block in `demo/static/feeds-config.js`.
5. Test with `./demo.sh start`.

Each item must have: `title` (string), `link` (string), `score` (number), `comments` (number),
`date` (Unix timestamp or ISO string), `icon` (string).

## Pull request checklist

- [ ] `marmite-feeds.js` passes a quick manual test in the demo
- [ ] No new external dependencies introduced
- [ ] `README.md` updated if behaviour or config options changed
- [ ] Demo updated if a new source or option is added

## Reporting issues

Open a [GitHub issue](https://github.com/raphazilla/marmite-feeds/issues) with:
- Marmite version (`marmite --version`)
- Browser and version
- Minimal reproduction (config snippet + container HTML)
- Expected vs actual behaviour

## License

By contributing you agree that your changes will be released under the [MIT License](LICENSE).
