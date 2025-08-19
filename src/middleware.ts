import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/tenant/:tenant/login"]);
const isHomePage = createRouteMatcher(["/"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Handle home page - redirect to dashboard if authenticated
  if (isHomePage(request)) {
    if (isAuthenticated) {
      return nextjsMiddlewareRedirect(request, "/tenant/play/dashboard");
    }
    // Allow access to home page if not authenticated
    return;
  }

  // Handle login page - redirect to dashboard if already authenticated
  if (pathname.endsWith("/login") && isAuthenticated) {
    const tenantMatch = pathname.match(/^\/tenant\/([^\/]+)/);
    const tenant = tenantMatch ? tenantMatch[1] : "play";
    return nextjsMiddlewareRedirect(request, `/tenant/${tenant}/dashboard`);
  }

  // Allow public pages
  if (isPublicPage(request)) {
    return;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Extract tenant from path if it exists
    const tenantMatch = pathname.match(/^\/tenant\/([^\/]+)/);
    if (tenantMatch) {
      const tenant = tenantMatch[1];
      return nextjsMiddlewareRedirect(request, `/tenant/${tenant}/login`);
    }

    // For non-tenant routes, redirect to play tenant login
    return nextjsMiddlewareRedirect(request, "/tenant/play/login");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
