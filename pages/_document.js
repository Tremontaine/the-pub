// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Prevent flash by applying dark mode immediately */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Default to dark mode
                  document.documentElement.classList.add('dark-mode');
                  
                  // Check if user has previously set to light mode
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'light') {
                    document.documentElement.classList.remove('dark-mode');
                  }
                })();
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
