
import React from 'react';

interface Props {
  html: string;
  css: string;
}

const BusinessCardPreview: React.FC<Props> = ({ html, css }) => {
  const combined = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: transparent; font-family: sans-serif; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return (
    <div className="w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative" style={{ minHeight: '400px' }}>
      <iframe
        title="Card Preview"
        className="w-full h-full border-none"
        srcDoc={combined}
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default BusinessCardPreview;
