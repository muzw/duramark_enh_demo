# DuraMark demo

Live page: https://muzw.github.io/duramark_enh_demo/

The page temporarily uses the content from the original [DuraMark demo](https://muzw.github.io/duramark_demo/): its title, authors, abstract, two model diagrams, and six AISHELL-3 examples comparing Unwatermarked, AudioSeal, Timbre, WavMark, and DuraMark (30 audio files total).

Content and media are copied from `muzw/duramark_demo` at commit `4dde5269fae894f031641222595ae9d17aeccf4d`. Images and WAV files are unchanged. The page retains local styling and responsive audio controls. The original repository and website are unchanged.

The previously prepared Enh assets and metadata remain in the repository for later use, but are not displayed by the current page. In particular, the displayed DuraMark column uses the original demo's recordings, not the Enh recordings in `audio/enh/`.

## Local preview

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

GitHub Pages serves the root of the `main` branch. The current page needs no external scripts or build step.
