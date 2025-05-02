// src/utils/mdToPdfMake.js
import MarkdownIt from 'markdown-it';
import htmlToPdfmake from 'html-to-pdfmake';

const md = new MarkdownIt({
  html:        true,
  linkify:     true,
  typographer: true,
});

/**
 * Converts Markdown → HTML → pdfMake node array (no images injected).
 */
export function mdToPdfMake(markdownText) {
  const html = md.render(markdownText);
  const nodes = htmlToPdfmake(html, { window });
  return Array.isArray(nodes) ? nodes : [nodes];
}
