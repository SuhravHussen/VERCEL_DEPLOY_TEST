export function getOrganizationUrl(slug: string) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "localhost";

  // Use NEXT_PUBLIC_DEPLOY_ENV to distinguish between local and deployed
  const isLocalEnvironment =
    process.env.NEXT_PUBLIC_DEPLOY_ENV === "local" ||
    process.env.NODE_ENV === "development";

  const protocol = isLocalEnvironment ? "http" : "https";
  const port = isLocalEnvironment ? ":3000" : "";

  const url = `${protocol}://${slug}.${domain}${port}`;
  return url;
}
