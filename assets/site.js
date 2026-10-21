"use strict";

(() => {
  const sampleContainer = document.getElementById("samples");
  const tableWrapper = document.getElementById("sample-table-wrapper");
  const status = document.getElementById("sample-status");
  const context = document.getElementById("sample-context");
  let players = [];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  async function loadPaper() {
    const abstract = document.getElementById("paper-abstract");
    try {
      const response = await fetch("data/paper.json");
      if (!response.ok) throw new Error("Paper details unavailable");
      const data = await response.json();
      if (typeof data.abstract !== "string" || !data.abstract.trim()) throw new Error("Abstract unavailable");
      abstract.textContent = data.abstract;
      if (Array.isArray(data.affiliations) && data.affiliations.length && data.affiliations.every((value) => typeof value === "string")) {
        const affiliations = document.getElementById("affiliations");
        affiliations.replaceChildren();
        data.affiliations.forEach((text, index) => {
          const line = document.createElement("p");
          line.append(element("sup", "", index + 1), document.createTextNode(` ${text}`));
          affiliations.append(line);
        });
      }
      if (typeof data.corresponding_email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.corresponding_email)) {
        const email = document.getElementById("corresponding-email");
        email.textContent = data.corresponding_email;
        email.href = `mailto:${data.corresponding_email}`;
      }
    } catch (_) {
      abstract.textContent = "The abstract could not be loaded. Please refresh the page and try again.";
    }
  }

  function localAudioUrl(value) {
    if (typeof value !== "string" || !value.trim()) throw new Error("Missing audio path");
    const url = new URL(value, document.baseURI);
    if (url.origin !== window.location.origin || !["http:", "https:"].includes(url.protocol)) throw new Error("Unsupported audio path");
    return url.href;
  }

  function validateSample(sample) {
    if (!sample || typeof sample.text !== "string" || !sample.text.trim() ||
        typeof sample.watermark_bits !== "string" || !/^[01]+$/.test(sample.watermark_bits) ||
        !Number.isFinite(sample.duration_seconds) || sample.duration_seconds <= 0) throw new Error("Incomplete sample metadata");
    return { ...sample, audioUrl: localAudioUrl(sample.audio) };
  }

  function renderSample(sample, index) {
    const row = document.createElement("tr");
    const textCell = document.createElement("td");
    const transcript = element("p", "transcript", sample.text);
    transcript.lang = "zh-Hans";
    textCell.append(transcript);

    const audioCell = element("td", "audio-cell");
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "metadata";
    audio.src = sample.audioUrl;
    audio.setAttribute("aria-label", `Play DuraMark-Enh example ${index + 1}`);
    audio.append(document.createTextNode("Your browser does not support audio playback."));
    audio.addEventListener("play", () => {
      players.forEach((other) => { if (other !== audio) other.pause(); });
    });
    audio.addEventListener("error", () => {
      if (!audioCell.querySelector(".audio-error")) {
        const error = element("p", "audio-error", "Audio could not be loaded. Please refresh and try again.");
        error.setAttribute("role", "status");
        audioCell.append(error);
      }
    });
    players.push(audio);
    const metadata = element("div", "audio-metadata");
    const bits = element("span", "", "Watermark: ");
    bits.append(element("code", "watermark-bits", sample.watermark_bits));
    metadata.append(bits, element("span", "", `${sample.duration_seconds.toFixed(2)} s`));
    audioCell.append(audio, metadata);
    row.append(textCell, audioCell);
    return row;
  }

  async function loadSamples() {
    status.hidden = false;
    status.textContent = "Loading audio examples…";
    context.hidden = true;
    tableWrapper.hidden = true;
    sampleContainer.replaceChildren();
    players.forEach((player) => player.pause());
    players = [];

    try {
      const response = await fetch("data/samples.json");
      if (!response.ok) throw new Error("Sample list could not be loaded");
      const data = await response.json();
      if (!Array.isArray(data.samples) || data.samples.length === 0) throw new Error("No samples available");
      const samples = data.samples.map(validateSample);
      const fragment = document.createDocumentFragment();
      samples.forEach((sample, index) => fragment.append(renderSample(sample, index)));
      sampleContainer.append(fragment);

      context.textContent = [data.model, data.watermark && `${data.watermark} watermark`, data.condition]
        .filter((value) => typeof value === "string" && value.trim()).join(" · ");
      context.hidden = !context.textContent;
      tableWrapper.hidden = false;
      status.hidden = true;
    } catch (_) {
      status.textContent = "Audio examples could not be loaded. Please try again.";
      const retry = element("button", "retry-button", "Retry");
      retry.type = "button";
      retry.addEventListener("click", loadSamples);
      status.append(retry);
    }
  }

  loadPaper();
  loadSamples();
})();
