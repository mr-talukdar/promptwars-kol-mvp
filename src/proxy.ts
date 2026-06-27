import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  // First, update the session
  const response = await updateSession(request)

  // Protect routes /reflect and /dashboard
  const path = request.nextUrl.pathname
  if (path.startsWith('/reflect') || path.startsWith('/dashboard')) {
    // Need to check auth status manually since updateSession just returns the response
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {} // Not setting here
        }
      }
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
