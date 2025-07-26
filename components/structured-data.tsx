"use client";

import { siteConfig } from "@/config/site";

interface StructuredDataProps {
  type: "WebSite" | "Organization" | "Article" | "FAQPage" | "Product";
  data?: Record<string, unknown>;
}

/**
 * Component for adding JSON-LD structured data to pages
 * This helps search engines understand the content and display rich results
 */
export function StructuredData({ type, data = {} }: StructuredDataProps) {
  // Default structured data based on type
  const defaultData: Record<string, Record<string, unknown>> = {
    WebSite: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    Organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
      sameAs: [siteConfig.links.twitter, siteConfig.links.github],
    },
    Article: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Article Title",
      image: `${siteConfig.url}/images/article.jpg`,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
        "@type": "Person",
        name: "Author Name",
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.png`,
        },
      },
    },
    FAQPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Example Question",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Example Answer",
          },
        },
      ],
    },
    Product: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Product Name",
      description: "Product Description",
      image: `${siteConfig.url}/images/product.jpg`,
      brand: {
        "@type": "Brand",
        name: siteConfig.name,
      },
      offers: {
        "@type": "Offer",
        price: "99.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
  };

  // Merge default data with provided data
  const structuredData = {
    ...defaultData[type],
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
