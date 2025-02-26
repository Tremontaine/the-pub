// components/Sidebar.js
import { useRouter } from 'next/router';
import GlobalSearch from './GlobalSearch';

export default function Sidebar() {
  const router = useRouter();
  
  const isActive = (path) => {
    return router.pathname.startsWith(path) ? 'active' : '';
  };
  
  // Direct navigation handler to bypass any event issues
  const navigateTo = (path) => {
    // Use window.location for hard navigation
    window.location.href = path;
  };
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <a href="/" onClick={(e) => {
          e.preventDefault();
          navigateTo('/');
        }}>
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="The Pub Logo" 
              className="logo-image"
            />
          </div>
        </a>
      </div>
      
      <div className="search-container">
        <GlobalSearch />
      </div>
      
      <nav>
        <ul className="nav-links">
          <li>
            <a 
              href="/bestiary"
              className={isActive('/bestiary')}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/bestiary');
              }}
            >
              <span className="nav-icon">🐲</span>
              <span className="nav-text">Bestiary</span>
            </a>
          </li>
          <li>
            <a 
              href="/spells"
              className={isActive('/spells')}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/spells');
              }}
            >
              <span className="nav-icon">✨</span>
              <span className="nav-text">Spells</span>
            </a>
          </li>
          <li>
            <a 
              href="/items"
              className={isActive('/items')}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/items');
              }}
            >
              <span className="nav-icon">⚔️</span>
              <span className="nav-text">Items</span>
            </a>
          </li>
          <li>
            <a 
              href="/subclasses"
              className={isActive('/subclasses')}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/subclasses');
              }}
            >
              <span className="nav-icon">👑</span>
              <span className="nav-text">Subclasses</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}