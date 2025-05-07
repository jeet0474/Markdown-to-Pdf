// src/App.jsx
import React, { useState } from 'react';
// Removed unused import for 'html2pdf'
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import './index.css';

function App() {
  const [mdText, setMdText] = useState(`## 🔸 1. **State-Value Function**: $V^\\pi(s)$

The value of a state $s$ under policy $\\pi$ is the expected return starting from $s$ and following $\\pi$:

$$
V^\\pi(s) = \\mathbb{E}_\\pi \\left[ \\sum_{t=0}^\\infty \\gamma^t R(s_t, a_t) \\,\\bigg|\\, s_0 = s \\right]
$$

### 🔹 **Bellman Expectation Equation for $V^\\pi$**

$$
V^\\pi(s) = \\sum_{a \\in A} \\pi(a|s) \\sum_{s' \\in S} P(s'|s,a) \\left[ R(s,a,s') + \\gamma V^\\pi(s') \\right]
$$

# Styled Markdown Example

This is a paragraph with *bold* and italic text.

## Lists Example

* First item
* Second item with *bold*

  * Nested item with italic
  * Another nested item
* Third item

## Java Code Example

\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Python Example

\`\`\`python
def fibonacci(n):
  if n <= 1:
    return n
  else:
    a, b = 0, 1
    for _ in range(n - 1):
      a, b = b, a + b
    return b

# List comprehension example

squares = [x**2 for x in range(10)]
\`\`\`

## Bellman Optimality Equation

The Bellman optimality equation for the value function is:

\`\`\`math
V^*(s) = \\max_{a \\in A} \\sum_{s'} P(s'|s,a) \\left[ R(s,a,s') + \\gamma V^*(s') \\right]
\`\`\`

## Blockquote Example

> This is a blockquote.
> It can span multiple lines.

## Table Example

| Feature | Description               |
| ------- | ------------------------- |
| Tables  | Organized data display    |
| Lists   | Bullet points and numbers |
| Code    | Syntax highlighted blocks |

## Link Example

[Visit GitHub](https://github.com)

---

### Cat Image Example

![Placeholder Image](https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?q=80&w=800)
`);

const [pdfName, setPdfName] = useState('');

const handleGetPDF = async () => {
  const previewEl = document.querySelector('.preview');

  // 1) Wait for all images to finish loading
  const images = Array.from(previewEl.querySelectorAll('img'));
  await Promise.all(images.map(img =>
    img.complete
      ? Promise.resolve()
      : new Promise(r => { img.onload = r; img.onerror = r; })
  ));

  // 2) Temporarily expand preview to full height & disable scrolling
  const origOverflow = previewEl.style.overflow;
  const origHeight   = previewEl.style.height;
  previewEl.style.overflow = 'visible';
  previewEl.style.height   = `${previewEl.scrollHeight}px`;

  // 3) Render a high-DPI canvas of the full preview
  const canvas = await html2canvas(previewEl, {
    scale: 2,        // 2× resolution
    useCORS: true,
  });

  // 4) Revert preview styles
  previewEl.style.overflow = origOverflow;
  previewEl.style.height   = origHeight;

  // 5) Turn that canvas into a JPEG data-URL
  const imgData = canvas.toDataURL('image/jpeg', 1.0);

  // 6) Create a PDF whose size (in px) matches the canvas exactly
  const pdf = new jsPDF({
    unit: 'px',
    format: [canvas.width, canvas.height],
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
  });

  // 7) Draw the image at full size and save
  pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
  // pdf.save('markdown-fullscreen.pdf');
  const filename = (pdfName.trim() || 'markdown to pdf') + '.pdf';
  pdf.save(filename);

  // counting converted to pdfs
  fetch('/api/increment', { method: 'POST' })
  .catch(err => {
    // optional: log error, but we don't block the user
    console.error('Failed to bump Redis counter:', err);
  });
};



  return (
    <div className="app-container">
      <Header
        onGetPDF={handleGetPDF}
        pdfName={pdfName}
        setPdfName={setPdfName}
      />
      <div className="main">
        <Editor value={mdText} onChange={setMdText} />
        <Preview markdown={mdText} />
      </div>
    </div>
  );
}

export default App;
