import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/app(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth-unified",
  "/sign-in-simple",
  "/subscription",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/auth(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Prevent redirects to Clerk hosted pages
  if (req.url.includes('accounts.cadetai.com')) {
    return Response.redirect(new URL('/auth-unified', req.url));
  }
  
  // Protect all app routes - users must be signed in to access any /app/* routes
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    await auth.protect()
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};