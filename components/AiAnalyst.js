// components/AiAnalyst.js
import { useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

export default function AiAnalyst({ entry, type }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [responseHtml, setResponseHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const [activeTab, setActiveTab] = useState('rendered');
  
  // Character limit constant
  const MAX_CHARS = 1000;
  
  const convertMarkdownToHtml = async (markdown) => {
    const result = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(markdown);
    return result.toString();
  };
  
  // Handle query input with character limit
  const handleQueryChange = (e) => {
    const input = e.target.value;
    // Only update if under the character limit
    if (input.length <= MAX_CHARS) {
      setQuery(input);
    }
  };
  
  // Get color for character count
  const getCountColor = () => {
    const percentage = (query.length / MAX_CHARS) * 100;
    if (percentage >= 90) return '#ff4d4d'; // Red when near limit
    if (percentage >= 75) return '#ffa64d'; // Orange when getting close
    return '#6e6e6e'; // Default gray
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          entry,
          type
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch AI response');
      }
      
      const data = await res.json();
      setResponse(data.response);
      
      // Convert markdown to HTML
      const htmlContent = await convertMarkdownToHtml(data.response);
      setResponseHtml(htmlContent);
      
      setHasAsked(true);
    } catch (error) {
      console.error('Error querying AI:', error);
      setResponse('Error: Failed to get an AI response. Please try again later.');
      setResponseHtml('<p>Error: Failed to get an AI response. Please try again later.</p>');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPlaceholderExamples = (type) => {
    // Check the full type name instead of slicing
    switch(type) {
      case 'bestiary':
        return `Examples: "Increase the CR by 2", "Add a breath weapon attack", "Is this balanced against a party of level 5?"`;
      case 'spells':
        return `Examples: "Make this spell scale better at higher levels", "Reduce the casting time to a bonus action", "Suggest a creative combo with other spells"`;
      case 'items':
        return `Examples: "Add a daily use limitation", "Make this require attunement", "What character would benefit most from this?"`;
      case 'subclasses':
        return `Examples: "Balance the 6th level feature", "Add a ribbon ability at 3rd level", "Improve synergy with the base class features"`;
      default:
        return `Examples: "Make this more powerful", "Is this balanced?", "Add a new feature"`;
    }
  };
    
  const handleExportPDF = () => {
    if (typeof window === 'undefined') return;
    
    import('html2pdf.js').then(module => {
      const html2pdf = module.default;
      
      const element = document.createElement('div');
      element.className = 'pdf-container';
      // Force light mode colors for PDF
      element.style.cssText = `
        color: #333 !important;
        background-color: #fff !important;
        font-family: Arial, sans-serif;
        line-height: 1.6;
      `;
      
      element.innerHTML = `
        <h1 style="color: #8b0000 !important; break-after: avoid-page;">AI Analysis for ${entry.name}</h1>
        <div class="ai-content-pdf" style="color: #333 !important; background-color: #fff !important; padding: 15px; margin: 15px 0;">
          ${responseHtml}
        </div>
      `;
      
      // Add temporary styling for light mode PDF
      const tempStyle = document.createElement('style');
      tempStyle.innerHTML = `
        .pdf-container {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333 !important;
          background-color: #fff !important;
          padding: 20px;
        }
        .pdf-container h1, .pdf-container h2, .pdf-container h3 {
          margin-top: 20px;
          margin-bottom: 10px;
          color: #8b0000 !important;
          page-break-after: avoid;
        }
        .ai-content-pdf {
          padding: 15px;
          margin: 15px 0;
          color: #333 !important;
          background-color: #fff !important;
        }
        .pdf-container p, .ai-content-pdf p {
          margin: 0 0 10px 0;
          page-break-inside: avoid;
          color: #333 !important;
        }
        .pdf-container ul, .pdf-container ol, .ai-content-pdf ul, .ai-content-pdf ol {
          margin-bottom: 15px;
          padding-left: 20px;
          color: #333 !important;
        }
        .pdf-container table, .ai-content-pdf table {
          width: 100%;
          border-collapse: collapse;
          page-break-inside: avoid;
          margin: 15px 0;
          border: 1px solid #ddd !important;
        }
        .pdf-container th, .ai-content-pdf th {
          border: 1px solid #ddd !important;
          padding: 8px;
          text-align: left;
          background-color: #f6f6f6 !important;
          color: #333 !important;
        }
        .pdf-container td, .ai-content-pdf td {
          border: 1px solid #ddd !important;
          padding: 8px;
          text-align: left;
          color: #333 !important;
        }
        .pdf-container tr, .ai-content-pdf tr {
          page-break-inside: avoid;
        }
        * {
          orphans: 3;
          widows: 3;
          color: #333 !important;
        }
        strong, b {
          color: #333 !important;
          font-weight: bold;
        }
        code, pre {
          font-family: monospace;
          color: #333 !important;
          background-color: #f5f5f5 !important;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
        }
        .ai-content-pdf h1,
        .ai-content-pdf h2,
        .ai-content-pdf h3,
        .ai-content-pdf h4 {
          color: #8b0000 !important;
          margin-top: 1.2em;
          margin-bottom: 0.5em;
        }
        .ai-content-pdf pre {
          background-color: #f5f5f5 !important;
          padding: 0.8em;
          border-radius: 4px;
          overflow-x: auto;
          margin: 1em 0;
          page-break-inside: avoid;
        }
        .ai-content-pdf blockquote {
          border-left: 3px solid #8b0000 !important;
          padding-left: 1em;
          margin: 1em 0;
          color: #333 !important;
          background-color: #f9f9f9 !important;
          padding: 0.5em 1em;
          border-radius: 0 4px 4px 0;
          page-break-inside: avoid;
        }
      `;
      document.head.appendChild(tempStyle);
      
      const opt = {
        margin: [25, 25, 25, 25], // top, right, bottom, left margins in mm
        filename: `ai-analysis-${entry.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
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
          putOnlyUsedFonts: true,
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['tr', 'td', 'th', 'img', 'table', 'h1', 'h2', 'h3']
        }
      };
      
      html2pdf().from(element).set(opt).save().then(() => {
        // Clean up temporary style
        document.head.removeChild(tempStyle);
      });
    });
  };
  
  return (
    <div className="ai-analyst">
      <h2>Analyze or Modify</h2>
      
      {!hasAsked ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ai-query">
              Ask a question or request modifications:
            </label>
            <div className="textarea-container">
              <textarea
                id="ai-query"
                value={query}
                onChange={handleQueryChange}
                placeholder={getPlaceholderExamples(type)}
                disabled={isLoading}
                rows={4}
                maxLength={MAX_CHARS} // HTML5 maxlength as a fallback
              />
              <div 
                className="char-counter" 
                style={{ color: getCountColor() }}
              >
                {query.length}/{MAX_CHARS}
              </div>
            </div>
          </div>
          <button 
          type="submit" 
          disabled={isLoading || !query.trim()}
          className="ai-submit-btn"
        >
          {isLoading ? (
            <div className="ai-loading">
              <div className="loader"></div>
            </div>
          ) : "Submit"}
        </button>
        </form>
      ) : (
        <div className="ai-response">
          <h3>Analysis</h3>
          <div className="response-actions">
            <div className="response-tabs">
              <button 
                className={`tab-btn ${activeTab === 'rendered' ? 'active' : ''}`} 
                onClick={() => setActiveTab('rendered')}
              >
                Rendered
              </button>
              <button 
                className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`} 
                onClick={() => setActiveTab('raw')}
              >
                Raw Markdown
              </button>
            </div>
            <button 
              className="export-pdf-btn" 
              onClick={handleExportPDF}
            >
              Export AI PDF
            </button>
          </div>
          
          {activeTab === 'rendered' ? (
            <div className="response-content rendered" dangerouslySetInnerHTML={{ __html: responseHtml }}></div>
          ) : (
            <div className="response-content raw">
              <pre>{response}</pre>
            </div>
          )}
          
          <button 
            onClick={() => {
              setQuery('');
              setResponse('');
              setResponseHtml('');
              setHasAsked(false);
            }}
            className="ai-reset-btn"
          >
            Ask Another Question
          </button>
        </div>
      )}
    </div>
  );
}
