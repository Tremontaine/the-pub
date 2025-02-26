import Link from 'next/link';
import AiAnalyst from './AiAnalyst';
import { useState, useEffect } from 'react';

export default function EntryDetail({ entry, content, type, rawMarkdown }) {
  const [showSource, setShowSource] = useState(false);
  const [html2pdf, setHtml2pdf] = useState(null);
  const typeLabel = type.slice(0, -1); // Remove 's' from plural
  
  // Dynamically import html2pdf on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('html2pdf.js').then(module => {
        setHtml2pdf(() => module.default);
      });
    }
  }, []);
  
const handleExportPDF = () => {
  if (!html2pdf) return;
  
  const element = document.createElement('div');
  element.innerHTML = `
    <h1>${entry.name}</h1>
    <div class="stat-block-pdf">
        ${type === 'bestiary' ? `
          <p><strong>Type:</strong> ${entry.type}</p>
          <p><strong>CR:</strong> ${entry.challenge_rating}</p>
          <p><strong>Size:</strong> ${entry.size}</p>
          <p><strong>Alignment:</strong> ${entry.alignment}</p>
        ` : ''}
        
        ${type === 'spells' ? `
          <p><strong>Level:</strong> ${entry.level}</p>
          <p><strong>School:</strong> ${entry.school}</p>
          <p><strong>Casting Time:</strong> ${entry.casting_time}</p>
          <p><strong>Range:</strong> ${entry.range}</p>
          <p><strong>Components:</strong> ${entry.components}</p>
          <p><strong>Duration:</strong> ${entry.duration}</p>
        ` : ''}
        
        ${type === 'items' ? `
          <p><strong>Type:</strong> ${entry.type}</p>
          <p><strong>Rarity:</strong> ${entry.rarity}</p>
          <p><strong>Requires Attunement:</strong> ${entry.requires_attunement ? 'Yes' : 'No'}</p>
        ` : ''}
        
        ${type === 'subclasses' ? `
          <p><strong>Class:</strong> ${entry.class}</p>
          <p><strong>Source:</strong> ${entry.source || 'Homebrew'}</p>
          <p><strong>Level:</strong> ${entry.level || '3'}</p>
        ` : ''}
      </div>
      ${content}
    `;

   // Add page break CSS to the element
  element.style.cssText = `
    * {
      orphans: 3;
      widows: 3;
    }
    h1, h2, h3, h4, h5, h6 {
      break-after: avoid-page;
    }
    table, tr, img {
      page-break-inside: avoid;
    }
    p {
      page-break-inside: avoid;
    }
  `;
      
  const opt = {
    margin: 10,
    filename: `${entry.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      letterRendering: true,
      useCORS: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true 
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: ['tr', 'td', 'th', 'img', 'table', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    }
  };
  
  html2pdf().from(element).set(opt).save();
};
  
  return (
    <div className="entry-detail">
      <div className="entry-header">
        <Link href={`/${type}`} className="back-button">
          <button>← Back to {type}</button>
        </Link>
        
        <div className="entry-buttons">
          <button 
            className="show-source-btn" 
            onClick={() => setShowSource(!showSource)}
          >
            {showSource ? 'Hide Source' : 'Show Markdown'}
          </button>
          
          <button 
            className="export-pdf-btn" 
            onClick={handleExportPDF}
            disabled={!html2pdf}
          >
            Export PDF
          </button>
        </div>
      </div>
      
      <h1>{entry.name}</h1>
      
      <div className="stat-block">
        {type === 'bestiary' && (
          <>
            <p><strong>Type:</strong> {entry.type}</p>
            <p><strong>CR:</strong> {entry.challenge_rating}</p>
            <p><strong>Size:</strong> {entry.size}</p>
            <p><strong>Alignment:</strong> {entry.alignment}</p>
          </>
        )}
        
        {type === 'spells' && (
          <>
            <p><strong>Level:</strong> {entry.level}</p>
            <p><strong>School:</strong> {entry.school}</p>
            <p><strong>Casting Time:</strong> {entry.casting_time}</p>
            <p><strong>Range:</strong> {entry.range}</p>
            <p><strong>Components:</strong> {entry.components}</p>
            <p><strong>Duration:</strong> {entry.duration}</p>
          </>
        )}
        
        {type === 'items' && (
          <>
            <p><strong>Type:</strong> {entry.type}</p>
            <p><strong>Rarity:</strong> {entry.rarity}</p>
            <p><strong>Requires Attunement:</strong> {entry.requires_attunement ? 'Yes' : 'No'}</p>
          </>
        )}
        
        {type === 'subclasses' && (
          <>
            <p><strong>Class:</strong> {entry.class}</p>
            <p><strong>Source:</strong> {entry.source || 'Homebrew'}</p>
            <p><strong>Level:</strong> {entry.level || '3'}</p>
          </>
        )}
      </div>
      
      {showSource ? (
        <div className="markdown-source">
          <h3>Markdown Source</h3>
          <pre className="source-content">{rawMarkdown}</pre>
        </div>
      ) : (
        <div className="entry-content" dangerouslySetInnerHTML={{ __html: content }} />
      )}
      
      <div className="entry-ai-section">
        <AiAnalyst entry={entry} type={type} />
      </div>
    </div>
  );
}
