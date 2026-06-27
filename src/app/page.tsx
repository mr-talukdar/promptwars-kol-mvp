import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AuthButton from '@/components/AuthButton';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, redirect them to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
        
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Understand why you feel overwhelmed <span className="text-primary">before burnout happens.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground sm:text-xl">
            Sahaara is an AI-powered emotional pattern discovery platform. We help you uncover the hidden stress triggers that traditional mood trackers miss.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* We use the AuthButton directly since it handles Google Sign-in */}
          <div className="rounded-lg bg-card p-6 shadow-sm border border-border w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Start Your First Reflection</h2>
            <div className="flex justify-center">
              <AuthButton />
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}
