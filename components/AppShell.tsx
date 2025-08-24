'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/', label: 'Analyze', shortcut: 'A' },
  { href: '/compare', label: 'Compare', shortcut: 'C' },
  { href: '/encyclopedia', label: 'Encyclopedia', shortcut: 'E' },
  { href: '/timeline', label: 'Timeline', shortcut: 'T' },
  { href: '/saved', label: 'Saved', shortcut: 'S' },
  { href: '/about', label: 'About', shortcut: '?' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Help modal toggle
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setHelpModalOpen(!helpModalOpen);
        }
      }

      // Focus search (if on search-enabled page)
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        setHelpModalOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [helpModalOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LL</span>
              </div>
              <span className="text-xl font-bold text-white">LabelLens</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-slate-700">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">LabelLens</h3>
              <p className="text-slate-400 text-sm">
                Client-only food label analysis. Understand additives, allergens, and regulatory compliance
                instantly. No data collection, completely private.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/reformulate" className="hover:text-white">Reformulate</Link></li>
                <li><Link href="/profile" className="hover:text-white">Preferences</Link></li>
                <li><Link href="/dev" className="hover:text-white">Rule Playground</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/feedback" className="hover:text-white">Feedback</Link></li>
                <li><Link href="/settings" className="hover:text-white">Settings</Link></li>
                <li><Link href="/legal" className="hover:text-white">Legal</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              © 2025 LabelLens. Educational tool, not medical advice.
            </p>
            <p className="text-slate-400 text-sm">
              v1.0.0 | Press ? for help
            </p>
          </div>
        </div>
      </footer>

      {/* Help Modal */}
      {helpModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setHelpModalOpen(false)}
        >
          <div 
            className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close help modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Toggle help</span>
                <kbd className="bg-slate-700 px-2 py-1 rounded text-xs">?</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Focus search</span>
                <kbd className="bg-slate-700 px-2 py-1 rounded text-xs">/</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Close modal</span>
                <kbd className="bg-slate-700 px-2 py-1 rounded text-xs">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
