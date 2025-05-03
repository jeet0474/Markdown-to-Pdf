import React from 'react';

export default function Header({ onGetPDF, pdfName, setPdfName }) {
  return (
    <div className="header">
      <div className="logo">MD to PDF</div>

      <div className="header-actions">
        <label htmlFor="pdf-name-input" className="pdf-name-label">
          Name:
        </label>
        <input
          id="pdf-name-input"
          type="text"
          className="pdf-name-input"
          placeholder="markdown to pdf"
          value={pdfName}
          onChange={e => setPdfName(e.target.value)}
        />
        <button onClick={onGetPDF}>Get PDF</button>
      </div>
    </div>
  );
}
