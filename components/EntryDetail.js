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
    // Force light mode colors for PDF regardless of current theme
    element.style.cssText = `
      color: #333 !important;
      background-color: #fff !important;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      orphans: 3;
      widows: 3;
    `;
    
    element.innerHTML = `
      <h1 style="color: #8b0000 !important; break-after: avoid-page;">${entry.name}</h1>
      <div class="stat-block-pdf" style="background-color: #f9f9f9 !important; color: #333 !important; border: 1px solid #eaeaea !important; padding: 15px; margin: 15px 0; border-radius: 4px;">
        ${type === 'bestiary' ? `
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Type:</strong> ${entry.type}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">CR:</strong> ${entry.challenge_rating}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Size:</strong> ${entry.size}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Alignment:</strong> ${entry.alignment}</p>
        ` : ''}
        
        ${type === 'spells' ? `
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Level:</strong> ${entry.level}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">School:</strong> ${entry.school}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Casting Time:</strong> ${entry.casting_time}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Range:</strong> ${entry.range}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Components:</strong> ${entry.components}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Duration:</strong> ${entry.duration}</p>
        ` : ''}
        
        ${type === 'items' ? `
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Type:</strong> ${entry.type}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Rarity:</strong> ${entry.rarity}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Requires Attunement:</strong> ${entry.requires_attunement ? 'Yes' : 'No'}</p>
        ` : ''}
        
        ${type === 'subclasses' ? `
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Class:</strong> ${entry.class}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Source:</strong> ${entry.source || 'Homebrew'}</p>
          <p style="color: #333 !important; margin-bottom: 8px;"><strong style="color: #333 !important;">Level:</strong> ${entry.level || '3'}</p>
        ` : ''}
      </div>
      <div style="color: #333 !important;">${content}</div>
    `;
    
    // Add temporary styling for light mode PDF
    const tempStyle = document.createElement('style');
    tempStyle.innerHTML = `
      * {
        color: #333 !important;
        background-color: transparent !important;
        orphans: 3;
        widows: 3;
      }
      h1, h2, h3, h4, h5, h6 {
        color: #8b0000 !important;
        break-after: avoid-page;
        margin-top: 1.2rem !important;
        margin-bottom: 0.8rem !important;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        page-break-inside: avoid;
        margin: 15px 0;
        border: 1px solid #ddd !important;
      }
      th {
        background-color: #f6f6f6 !important;
        color: #333 !important;
        border: 1px solid #ddd !important;
        padding: 8px;
        text-align: left;
      }
      td {
        border: 1px solid #ddd !important;
        padding: 8px;
        color: #333 !important;
        text-align: left;
      }
      tr {
        page-break-inside: avoid;
      }
      p {
        page-break-inside: avoid;
        color: #333 !important;
        margin-bottom: 0.5rem !important;
      }
      img {
        max-width: 100%;
        height: auto;
        page-break-inside: avoid;
      }
      ul, ol {
        color: #333 !important;
        margin: 0.5rem 0 1rem 0 !important;
        page-break-inside: avoid;
      }
      li {
        color: #333 !important;
        margin-bottom: 0.3rem !important;
      }
      strong, b {
        color: #333 !important;
        font-weight: bold;
      }
      em, i {
        color: #333 !important;
      }
      code, pre {
        font-family: monospace;
        color: #333 !important;
        background-color: #f5f5f5 !important;
        padding: 0.1rem 0.2rem;
        border-radius: 3px;
      }
    `;
    document.head.appendChild(tempStyle);
    
    const opt = {
      margin: 10,
      filename: `${entry.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true,
        backgroundColor: '#ffffff' // Force white background
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
    
    html2pdf().from(element).set(opt).save().then(() => {
      // Clean up
      document.head.removeChild(tempStyle);
    });
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
