import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { publicEnv, serverEnv } from "@/lib/env";

void publicEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
void serverEnv.CLERK_SECRET_KEY;

const isProtectedRoute = createRouteMatcher([
  "/create(.*)",
  "/post(.*)",
  "/profile(.*)",
  "/trending(.*)",
  "/notifications(.*)",
  "/guidelines(.*)",
  "/api/posts(.*)",
  "/api/users/onboard(.*)",
]);

export default clerkMiddleware(async (auth: any, req: any) => {
  if (isProtectedRoute(req)) {
    await auth.protect({ unauthenticatedUrl: new URL("/sign-in", req.url).toString() });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
