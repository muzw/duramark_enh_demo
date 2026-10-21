"use strict";

(() => {
  const sampleContainer = document.getElementById("samples");
  const status = document.getElementById("sample-status");
  const context = document.getElementById("sample-context");
  let players = [];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function localAudioUrl(value) {
    if (typeof value !== "string" || !value.trim()) throw new Error("Missing audio path");
    const url = new URL(value, document.baseURI);
    if (url.origin !== window.location.origin || !["http:", "https:"].includes(url.protocol)) {
      throw new Error("Unsupported audio path");
    }
    return url.href;
  }

  function validateSample(sample) {
    if (!sample || typeof sample.text !== "string" || !sample.text.trim() ||
        typeof sample.watermark_bits !== "string" || !/^[01]+$/.test(sample.watermark_bits) ||
        !Number.isFinite(sample.duration_seconds) || sample.duration_seconds <= 0) {
      throw new Error("Incomplete sample metadata");
    }
    return { ...sample, audioUrl: localAudioUrl(sample.audio) };
  }

  function renderSample(sample, index) {
    const card = element("article", "sample-card");
    const titleId = `sample-title-${index + 1}`;
    card.setAttribute("aria-labelledby", titleId);

    const topline = element("div", "sample-topline");
    const heading = element("h3", "sample-title", `Example ${String(index + 1).padStart(2, "0")}`);
    heading.id = titleId;
    topline.append(heading, element("span", "sample-duration", `${sample.duration_seconds.toFixed(2)} s`));

    const transcript = element("p", "transcript", sample.text);
    transcript.lang = "zh-Hans";

    const bottom = element("div", "sample-bottom");
    const watermark = element("div", "watermark");
    watermark.append(element("span", "watermark-label", "Watermark bits"), element("code", "watermark-bits", sample.watermark_bits));

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.src = sample.audioUrl;
    audio.setAttribute("aria-label", `Play DuraMark-Enh example ${index + 1}`);
    audio.append(document.createTextNode("Your browser does not support audio playback."));
    audio.addEventListener("play", () => {
      players.forEach((other) => { if (other !== audio) other.pause(); });
    });
    audio.addEventListener("error", () => {
      if (!bottom.querySelector(".audio-error")) {
        const error = element("p", "audio-error", "This audio could not be loaded. Please refresh the page and try again.");
        error.setAttribute("role", "status");
        bottom.append(error);
      }
    });
    players.push(audio);
    bottom.append(watermark, audio);
    card.append(topline, transcript, bottom);
    return card;
  }

  async function loadSamples() {
    status.hidden = false;
    status.textContent = "Loading audio examples…";
    context.hidden = true;
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

      context.replaceChildren();
      [data.dataset, data.model, data.watermark && `${data.watermark} watermark`, data.condition]
        .filter((value) => typeof value === "string" && value.trim())
        .forEach((value) => context.append(element("span", "context-item", value)));
      context.hidden = context.childElementCount === 0;
      status.hidden = true;
    } catch (_) {
      status.textContent = "Audio examples could not be loaded. Please try again.";
      const retry = element("button", "retry-button", "Retry");
      retry.type = "button";
      retry.addEventListener("click", loadSamples);
      status.append(retry);
    }
  }

  loadSamples();
})();
