import { Metadata } from "next";
import { defaultSeoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";

/**
 * Generate metadata for a specific page
 */
export function generatePageMetadata({
  title,
  description,
  keywords,
  images,
  noIndex = false,
  path = "",
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  images?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  }[];
  noIndex?: boolean;
  path?: string;
}): Metadata {
  // Use default values from config if not provided
  const pageTitle = title
    ? `${title} - ${siteConfig.name}`
    : defaultSeoConfig.title;
  const pageDescription = description || defaultSeoConfig.description;
  const pageKeywords = keywords || defaultSeoConfig.keywords;

  // Generate canonical URL
  const url = path ? `${siteConfig.url}${path}` : siteConfig.url;

  // Generate OpenGraph images
  const ogImages = images || defaultSeoConfig.openGraph.images;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors: defaultSeoConfig.authors,
    creator: defaultSeoConfig.creator,
    metadataBase: defaultSeoConfig.metadataBase,
    alternates: {
      canonical: url,
    },
    robots: noIndex ? { index: false, follow: false } : defaultSeoConfig.robots,
    openGraph: {
      ...defaultSeoConfig.openGraph,
      title: pageTitle,
      description: pageDescription,
      url,
      images: ogImages,
    },
    twitter: {
      ...defaultSeoConfig.twitter,
      title: pageTitle,
      description: pageDescription,
    },
  };
}
