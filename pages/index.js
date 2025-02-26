import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout title="The Pub - D&D 5e Homebrew">
      <div className="home-content">
        <h1>Welcome to The Pub</h1>
        <p className="hero-text">A repository for D&D 5e homebrew content, powered by AI analysis and Markdown simplicity. Analyze, balance, and enhance with our integrated AI assistant.</p>
    
        <div className="category-grid">
          <Link href="/bestiary" className="category-card">
            <h2>Bestiary</h2>
            <p>Challenge your players with unique monsters and creatures, each with AI-modifiable stats and balance recommendations</p>
          </Link>
          
          <Link href="/spells" className="category-card">
            <h2>Spells</h2>
            <p>Expand your magical arsenal with innovative spells that can be instantly evaluated, modified, and balanced by our AI assistant</p>
          </Link>
          
          <Link href="/items" className="category-card">
            <h2>Magic Items</h2>
            <p>Discover powerful treasures and artifacts to perfectly reward your adventures</p>
          </Link>
          
          <Link href="/subclasses" className="category-card">
            <h2>Subclasses</h2>
            <p>Diversify character options with specialized paths and features that expand on core class mechanics</p>
          </Link>
        </div>
        <div className="home-about">
          <h2>About The Pub</h2>
          <p>
            The Pub isn't just another homebrew repository - it's a smart platform that combines 
            the simplicity of Markdown with the power of AI analysis. What sets us apart is our 
            built-in AI assistant that can analyze the balance of any entry, suggest improvements, 
            and even modify content based on your specifications.
          </p>
          <p>
            All content is stored in simple Markdown files, making it easy to copy to your own collection. 
            The Pub is open source and available on <a href="https://github.com/Tremontaine/the-pub" 
            target="_blank" rel="noopener noreferrer" className="github-link">GitHub</a> - 
            feel free to fork, star, or contribute to the project!
          </p>

          <div className="github-callout">
            <div>
              <p>Check out the code at <a href="https://github.com/Tremontaine/the-pub" 
              target="_blank" rel="noopener noreferrer" className="github-link">github.com/Tremontaine/the-pub</a></p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
