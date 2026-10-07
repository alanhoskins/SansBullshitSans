# sansbullshitsans.org

A static site for [Sans Bullshit Sans](https://github.com/RoelN/SansBullshitSans), the font by Roel Nieskens ([PixelAmbacht](https://pixelambacht.nl)) that stamps “bullshit” over 237 corporate buzzwords using OpenType ligatures.

The original site at sansbullshitsans.com no longer belongs to the project and redirects to malware. This site keeps the font available. Here's the [original on the Internet Archive](https://web.archive.org/web/20250121184840/https://www.sansbullshitsans.com/).

## Layout

```
public/
  index.html        the page (the word wall is static markup)
  404.html
  styles.css
  app.js            filter toggle, typing hero, sentence generator, tap-to-reveal
  filter.js         restores the saved filter choice before first paint
  og.png            1200×630 social preview
  favicon.svg
  fonts/
    SansBullshitSans.ttf               original, unmodified (download)
    SansBullshitSans.woff2             original, compressed for the web
    SansBullshitSans-Unfiltered.woff2  same font with GSUB removed (site only)
    LICENSE.txt                        Apache 2.0
vercel.json         static output from public/, caching and security headers
```

There's no build step. To run it locally:

```sh
npx serve public      # or: python3 -m http.server -d public
```

## Notes

- **The ligatures can't be switched off with CSS.** The font marks `liga` as a *required* feature (`ReqFeatureIndex=0`), so `font-variant-ligatures: none` does nothing. The “Bullshit filter” toggle swaps to `SansBullshitSans-Unfiltered.woff2` instead, which is the same font with its GSUB table removed. Regenerate it with fontTools:

  ```py
  from fontTools.ttLib import TTFont
  f = TTFont("public/fonts/SansBullshitSans.ttf")
  del f["GSUB"]
  f.flavor = "woff2"
  f.save("public/fonts/SansBullshitSans-Unfiltered.woff2")
  ```

- **Multi-word buzzwords break across lines in Chrome.** Chrome will wrap a line in the middle of a ligature that spans a space (e.g. “paradigm shift”), which leaves the stamp overflowing the line. In authored copy, wrap these phrases in `white-space: nowrap` (see `.hero-sentence .phrase`).
- **Matching is case sensitive.** “synergy” is stamped but “Synergy” isn't.
- **Copy is set in the font too**, so check new text for accidental matches. Plenty of ordinary words contain a buzzword: “typing” has “ping”, “clean” has “lean”, “popular” has “pop”.
- The CSP in `vercel.json` allows only same-origin scripts and styles. Don't add inline `<script>` or `style=""` without updating it.

## Deploy

1. Import the repo in Vercel (or run `vercel` in this folder). `vercel.json` sets the framework to none and the output directory to `public`.
2. Add `www.sansbullshitsans.org` and `sansbullshitsans.org` under **Project → Settings → Domains**, with the apex redirecting to www. Do the redirect there only: a host redirect in `vercel.json` as well creates a redirect loop.

## License

The font files are copied from [RoelN/SansBullshitSans](https://github.com/RoelN/SansBullshitSans) at commit [`b780f97`](https://github.com/RoelN/SansBullshitSans/commit/b780f97f0fa38d1f38c6256b14077549e3992e2f) (March 2017), which is the latest upstream commit. Upstream isn't maintained, so they're copied in rather than tracked as a fork or submodule.

The font is © Roel Nieskens, based on Droid Sans, and licensed under the [Apache License 2.0](public/fonts/LICENSE.txt). `SansBullshitSans-Unfiltered.woff2` is a modified copy (ligature table removed) distributed under the same license.
