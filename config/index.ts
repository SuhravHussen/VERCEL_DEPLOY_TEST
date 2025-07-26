export * from "./app";
export * from "./seo";
export * from "./site";

// Export a combined config for easy access
import { appConfig } from "./app";
import { defaultSeoConfig } from "./seo";
import { siteConfig } from "./site";

export const config = {
  app: appConfig,
  seo: defaultSeoConfig,
  site: siteConfig,
};
