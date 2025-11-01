// FIX: Removed unnecessary triple-slash directive for React types.
import React from 'react';

const links = [
  { name: 'About', href: '#' },
  { name: 'Projects', href: '#' },
  { name: 'Contact', href: '#' },
  { name: 'Source', href: '#' },
];

const UtilityLinks: React.FC = () => {
  return (
    <footer className="absolute bottom-8 z-10">
      <nav className="flex items-center space-x-6 sm:space-x-8">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-sm text-neutral-500 hover:text-white transition-colors duration-300"
          >
            {link.name}
          </a>
        ))}
      </nav>
    </footer>
  );
};

export default UtilityLinks;