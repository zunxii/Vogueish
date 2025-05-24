import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  const publicPaths = [
    "/buyer-sign-in",
    "/buyer-sign-up",
    "/seller-sign-in",
    "/seller-sign-up",
    "/auth-error",
    "/"
  ];

  const isPublicPath = publicPaths.some(publicPath =>
    path === publicPath || path.startsWith(publicPath + "/")
  );

  // ✅ Redirect authenticated users away from sign-in/up pages
  if (isPublicPath && token) {
    const role = token.role as string;

    if (role === "buyer" && path !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "seller" && path !== "/seller-dashboard") {
      return NextResponse.redirect(new URL("/seller-dashboard", request.url));
    }
  }

  // 🔒 Redirect unauthenticated users away from private pages
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/buyer-sign-in", request.url));
  }

  // 🔐 Role-based access control
  if (token) {
    const role = token.role as string;

    // Prevent buyer from accessing seller-only pages
    if (role === "buyer" && path.startsWith("/seller-dashboard")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Prevent seller from accessing buyer-only pages (in your case, homepage)
    if (role === "seller" && path === "/") {
      return NextResponse.redirect(new URL("/seller-dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
