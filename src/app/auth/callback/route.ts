import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  // In production, swap this for Supabase OAuth callback:
  // const { searchParams } = new URL(request.url)
  // const code = searchParams.get("code")
  // if (code) { const supabase = createClient(); await supabase.auth.exchangeCodeForSession(code) }
  return NextResponse.redirect(`${origin}/dashboard`)
}
