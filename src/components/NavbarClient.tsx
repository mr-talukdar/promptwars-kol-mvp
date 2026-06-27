'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import AuthButton from './AuthButton';
import ThemeToggle from './ui/ThemeToggle';

interface NavbarClientProps {
  user: { id: string; email?: string | null } | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
        
        {/* Brand and Desktop Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" onClick={closeMenu} className="flex items-center space-x-2" aria-label="Sahaara Home">
            <span className="font-bold">Sahaara</span>
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link 
                href="/dashboard" 
                className="transition-colors hover:text-primary text-muted-foreground"
              >
                Dashboard
              </Link>
              <Link 
                href="/reflect" 
                className="transition-colors hover:text-primary text-muted-foreground"
              >
                Reflect
              </Link>
            </nav>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <AuthButton />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-card-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background/98 backdrop-blur animate-in slide-in-from-top duration-200">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {user && (
              <nav className="flex flex-col gap-3 font-medium text-sm">
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/reflect"
                  onClick={closeMenu}
                  className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  Reflect
                </Link>
              </nav>
            )}
            <div className="border-t border-border/60 pt-3 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Session Profile</span>
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
