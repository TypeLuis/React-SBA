import { useState, useEffect } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import '../Styles/Nav.scss';

type NavLink = {
  label: string;
  to: string;
};

type NavbarProps = {
  brand?: string;
  links?: NavLink[];
};

const defaultLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Heroes', to: '/heroes' },
  { label: 'Maps', to: '/maps' },
  { label: 'Players', to: '/players' },
];

function Nav({ brand = 'RIVALS', links = defaultLinks }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        {/* Logo */}
        <Link className="navbar__brand" to="/">
          <span className="navbar__brand-icon">⬡</span>
          {brand}
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          {links.map((link) => (
            <li key={link.label}>
              <RouterNavLink
                to={link.to}
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </RouterNavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <RouterNavLink
                to={link.to}
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </RouterNavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;