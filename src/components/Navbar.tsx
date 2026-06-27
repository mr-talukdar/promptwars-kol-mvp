import Link from 'next/link';
import AuthButton from './AuthButton';
import ThemeToggle from './ui/ThemeToggle';
import { createClient } from '@/utils/supabase/server';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2" aria-label="Sahaara Home">
            <span className="font-bold sm:inline-block">Sahaara</span>
          </Link>
          
          {user && (
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-primary text-muted-foreground">
                Dashboard
              </Link>
              <Link href="/reflect" className="transition-colors hover:text-primary text-muted-foreground">
                Reflect
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
