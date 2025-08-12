import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/", "/tenant/:tenant/login"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Allow public pages
  if (isPublicPage(request)) {
    return;
  }

  // Redirect to login if not authenticated
  if (!convexAuth.isAuthenticated()) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Extract tenant from path if it exists
    const tenantMatch = pathname.match(/^\/tenant\/([^\/]+)/);
    if (tenantMatch) {
      const tenant = tenantMatch[1];
      return nextjsMiddlewareRedirect(request, `/tenant/${tenant}/login`);
    }

    // For non-tenant routes, redirect to home
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
