import { type NextRequest, NextResponse } from "next/server";
import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
import { ROOT_DOMAIN } from "~/src/common/constants";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes(".localhost")) {
      return hostname.split(".")[0];
    }

    return null;
  }

  // Production environment
  const formattedRootDomain = ROOT_DOMAIN.split(":")[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== formattedRootDomain &&
    hostname !== `www.${formattedRootDomain}` &&
    hostname.endsWith(`.${formattedRootDomain}`);

  return isSubdomain ? hostname.replace(`.${formattedRootDomain}`, "") : null;
}

const isPublicRoute = (pathname: string): boolean => {
  // Allow login page and auth endpoints
  return pathname.includes("/login") || pathname.startsWith("/api/auth");
};

export default convexAuthNextjsMiddleware(async (request: NextRequest, ctx: any) => {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // Handle path-based tenant routes (e.g., /tenant/play/dashboard)
  if (pathname.startsWith("/tenant/")) {
    const pathParts = pathname.split("/");
    const tenantSlug = pathParts[2]; // Extract tenant from path
    
    if (tenantSlug && !ctx.isAuthenticated && !isPublicRoute(pathname)) {
      // Redirect to login page for this tenant
      return NextResponse.redirect(
        new URL(`/tenant/${tenantSlug}/login`, request.url)
      );
    }
  }

  if (subdomain) {
    // Block access to admin page from subdomains
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check authentication for tenant routes
    const tenantPath = `/tenant/${subdomain}${pathname}`;
    if (!ctx.isAuthenticated && !isPublicRoute(tenantPath)) {
      // Redirect to login page
      return NextResponse.redirect(
        new URL(`/tenant/${subdomain}/login`, request.url)
      );
    }

    // Rewrite to tenant
    return NextResponse.rewrite(new URL(tenantPath, request.url));
  }

  // On the root domain, allow normal access
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|[\\w-]+\\.\\w+).*)"],
};
