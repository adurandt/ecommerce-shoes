import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")

    // Si está en el dashboard y no es admin, redirigir
    if (req.nextUrl.pathname.startsWith("/dashboard") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Si está autenticado y trata de ir a login/register, redirigir
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acceso público a rutas que no sean dashboard
        if (!req.nextUrl.pathname.startsWith("/dashboard")) {
          return true
        }
        // Para dashboard, requerir autenticación y rol admin
        return !!token && token.role === "ADMIN"
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
