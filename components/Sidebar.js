import { useRouter } from 'next/router';
import GlobalSearch from './GlobalSearch';
import Image from 'next/image';

export default function Sidebar({ isOpen, closeSidebar }) {
  const router = useRouter();
  
  const isActive = (path) => {
    return router.pathname.startsWith(path) ? 'active' : '';
  };
  
  // Direct navigation handler to bypass any event issues
  const navigateTo = (path) => {
    // Close sidebar on navigation (mobile)
    closeSidebar();
    // Use window.location for hard navigation
    window.location.href = path;
  };
  
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <a href="/" onClick={(e) => {
            e.preventDefault();
            navigateTo('/');
          }}>
            <div className="logo-container">
            <Image 
              src="/logo.png" 
              alt="The Pub Logo" 
              width={150}
              height={150}
              className="logo-image"
              priority
            />
          </div>
          </a>
        </div>
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
              <span className="nav-icon">🐉</span> Bestiary
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
              <span className="nav-icon">✨</span> Spells
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
              <span className="nav-icon">🏆</span> Items
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
              <span className="nav-icon">⚔️</span> Subclasses
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
