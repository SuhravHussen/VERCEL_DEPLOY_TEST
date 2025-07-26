"use client";

import { usePathname } from "next/navigation";
import Head from "next/head";
import { siteConfig } from "@/config/site";

interface MetadataGeneratorProps {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Client-side component that adds additional metadata to pages
 * This complements the server-side metadata in layout.tsx
 */
export function MetadataGenerator({
  title,
  description,
  ogImage,
  noIndex = false,
  canonical,
}: MetadataGeneratorProps) {
  const pathname = usePathname();

  // Default values from config
  const pageTitle = title || siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageImage = ogImage || siteConfig.ogImage;
  const pageUrl = canonical || `${siteConfig.url}${pathname}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      {title && <title>{pageTitle}</title>}
      {description && <meta name="description" content={pageDescription} />}

      {/* Canonical */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={`${siteConfig.url}${pageImage}`} />

      {/* Twitter */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${siteConfig.url}${pageImage}`} />

      {/* No index directive if needed */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </Head>
  );
}
