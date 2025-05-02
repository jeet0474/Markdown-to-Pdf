import React from 'react';

export default function Header({ onGetPDF }) {
  return (
    <div className="header">
      <div className="logo">MD to PDF</div>
      <button onClick={onGetPDF}>Get PDF</button>
    </div>
  );
}
