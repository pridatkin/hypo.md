const hljs = require("highlight.js");
const { escapeHtml } = require("../utils/html");
const { makeHeadingId } = require("./heading-ids");

const renderer = {
  code(tokenOrCode, infostring) {
    let text, lang;
    if (tokenOrCode && typeof tokenOrCode === "object") {
      text = tokenOrCode.text ?? "";
      lang = tokenOrCode.lang ?? "";
    } else {
      text = tokenOrCode ?? "";
      lang = infostring ?? "";
    }
    text = String(text);
    lang = String(lang).split(/\s+/)[0];

    if (lang === "mermaid") {
      return `<div class="mermaid">${escapeHtml(text)}</div>`;
    }
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs language-${lang}">${
        hljs.highlight(text, { language: lang }).value
      }</code></pre>`;
    }
    return `<pre><code class="hljs">${hljs.highlightAuto(text).value}</code></pre>`;
  },

  heading(tokenOrText, level, raw) {
    let depth, inlineHtml, plainForSlug;

    if (tokenOrText && typeof tokenOrText === "object") {
      depth = tokenOrText.depth ?? 1;
      inlineHtml = tokenOrText.text ?? "";
      plainForSlug =
        tokenOrText.raw ?? String(inlineHtml).replace(/<[^>]+>/g, "");
    } else {
      depth = level ?? 1;
      inlineHtml = tokenOrText ?? "";
      plainForSlug = raw ?? inlineHtml;
    }

    const id = makeHeadingId(plainForSlug);
    return `<h${depth} id="${id}">${inlineHtml}</h${depth}>`;
  },
};

module.exports = { renderer };
