import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  console.log("🔍 Middleware - Full hostname:", hostname);
  console.log("🔍 Middleware - Original pathname:", url.pathname);

  // Define your main domain
  const mainDomain =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_DOMAIN
      : "fluency-checker-local.com";

  console.log("🔍 Main domain:", mainDomain);

  // Skip API routes, static files, and internal Next.js routes FIRST
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/favicon.ico") ||
    url.pathname.startsWith("/robots.txt") ||
    url.pathname.startsWith("/sitemap.xml") ||
    url.pathname.startsWith("/.well-known/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/static/")
  ) {
    console.log("⚠️  API/Static route, skipping rewrite");
    return NextResponse.next();
  }

  // Prevent infinite redirect loops EARLY
  if (url.pathname.startsWith("/organization/")) {
    console.log("⚠️  Already on organization route, preventing loop");
    return NextResponse.next();
  }

  // Clean hostname by removing port if present
  const cleanHostname = hostname.split(":")[0];
  console.log("🔍 Clean hostname:", cleanHostname);

  // Extract subdomain
  let subdomain = null;

  if (process.env.NODE_ENV === "production") {
    // Production: expect format like "orgslug.yourdomain.com"
    if (
      cleanHostname !== mainDomain &&
      cleanHostname.endsWith(`.${mainDomain}`)
    ) {
      const hostParts = cleanHostname.split(".");
      if (hostParts.length >= 3) {
        subdomain = hostParts[0];
      }
    }
  } else {
    // Development: handle both localhost and custom domains
    if (
      cleanHostname.includes("localhost") ||
      cleanHostname.includes("127.0.0.1")
    ) {
      console.log("⚠️  Localhost detected, skipping subdomain logic");
      return NextResponse.next();
    }

    // Check if it's our custom domain with subdomain
    if (
      cleanHostname !== mainDomain &&
      cleanHostname.endsWith(`.${mainDomain}`)
    ) {
      const hostParts = cleanHostname.split(".");
      console.log("🔍 Clean host parts:", hostParts);

      // For "acme.fluency-checker-local.com" we expect 3 parts: ["acme", "fluency-checker-local", "com"]
      if (hostParts.length >= 3) {
        subdomain = hostParts[0];
      }
    }
  }

  console.log("🔍 Extracted subdomain:", subdomain);

  // Skip if no subdomain or if it's www
  if (!subdomain || subdomain === "www") {
    console.log("⚠️  No subdomain or www, proceeding normally");
    return NextResponse.next();
  }

  // Validate subdomain (optional - add your validation logic)
  if (!isValidSubdomain(subdomain)) {
    console.log("❌ Invalid subdomain:", subdomain);
    return NextResponse.next();
  }

  // Create the rewrite path
  let newPath;
  if (url.pathname === "/") {
    newPath = `/organization/${subdomain}`;
  } else {
    newPath = `/organization/${subdomain}${url.pathname}`;
  }

  console.log("✅ Rewriting to:", newPath);

  // Create the rewrite URL with search params preserved
  url.pathname = newPath;

  // Create response with headers
  const response = NextResponse.rewrite(url);
  response.headers.set("x-subdomain", subdomain);
  response.headers.set("x-original-host", hostname);
  response.headers.set("x-original-pathname", request.nextUrl.pathname);

  return response;
}

// Helper function to validate subdomain
function isValidSubdomain(subdomain: string): boolean {
  // Add your subdomain validation logic here
  const validPattern = /^[a-zA-Z0-9-]+$/;
  return (
    validPattern.test(subdomain) &&
    subdomain.length >= 2 &&
    subdomain.length <= 50
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     * - .well-known (for SSL certificates, etc.)
     * - images, static (your static assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|\\.well-known|images|static).*)",
  ],
};
