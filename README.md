# DuraMark-Enh demo

Audio demo for **DuraMark: A Duration-Embedded Watermarking Framework for Synthesized Speech**.

The journal manuscript presents one DuraMark framework with two implementations:

- **DuraMark-Basic** uses the duration-controllable TTS backbone without RWF post-training or duration-aware CFG.
- **DuraMark-Enh** adds Reward-Weighted Fine-Tuning (RWF) and duration-aware Classifier-Free Guidance (CFG) to improve duration control and watermark accuracy.

## Links

- Journal demo: https://muzw.github.io/duramark_enh_demo/
- Original Interspeech demo: https://muzw.github.io/duramark_demo/

The page follows the original demo's academic-paper layout, with the current title, author affiliations, abstract, model figures, and a table of Enh audio examples. The original demo remains a separate site. This repository contains the journal audio demo, not the model implementation or checkpoints.

## Audio samples

The initial page contains three unperturbed, 8-bit watermarked DuraMark-Enh samples from the AISHELL-3 archive used for listening previews. They are the first three filenames in the archived V16 sample set, without selection by detection score or perceived quality. The archive was retained for diagnostic/listening use; these examples do not constitute a new formal evaluation or replace the manuscript's aggregate measurements.

The playback files are mono, 16 kHz PCM16 WAV copies of the archived float32 WAVs. The sample rate, channel count and frame count were retained, with no gain adjustment, trimming, denoising or other audio effects. Target texts and watermark bits are in `data/samples.json`; SHA-256 hashes and provenance are in `docs/sample-provenance.json`.

## Local preview

No build tools or external packages are required:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. The page loads `data/samples.json` over HTTP; opening `index.html` directly from the filesystem can block this request.

## Contents

- `index.html`: journal demo page
- `assets/`: local CSS, JavaScript, and the duration-control figure rendered from the current manuscript
- `audio/enh/`: PCM16 playback samples
- `data/samples.json`: sample text, watermark bits and audio links
- `data/paper.json`: current manuscript abstract and affiliation metadata
- `docs/sample-provenance.json`: source and file-integrity records

GitHub Pages serves the root of the `main` branch. The page uses no analytics, external scripts or external font services.
