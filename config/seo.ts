import type { Metadata, Viewport } from "next";

export type SeoConfig = {
  metadataBase: URL;
  title: string;
  description: string;
  keywords: string[];
  authors: {
    name: string;
    url: string;
  }[];
  creator: string;
  themeColor: string;
  robots: {
    index: boolean;
    follow: boolean;
    googleBot: {
      index: boolean;
      follow: boolean;
    };
  };
  openGraph: {
    type: string;
    locale: string;
    url: string;
    siteName: string;
    images: {
      url: string;
      width: number;
      height: number;
      alt: string;
    }[];
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    creator: string;
    images: string[];
  };
};

// Default SEO configuration
export const defaultSeoConfig: SeoConfig = {
  metadataBase: new URL("https://fluency-checker.com"),
  title: "Fluency Checker - Analyze and improve your language proficiency",
  description:
    "A sophisticated tool for analyzing and improving your language proficiency across multiple languages",
  keywords: [
    "language",
    "fluency",
    "proficiency",
    "checker",
    "analysis",
    "learning",
  ],
  authors: [
    {
      name: "Fluency Checker Team",
      url: "https://fluency-checker.com",
    },
  ],
  creator: "Fluency Checker Team",
  themeColor: "#0f172a",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fluency-checker.com",
    siteName: "Fluency Checker",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fluency Checker - Analyze and improve your language proficiency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluency Checker - Analyze and improve your language proficiency",
    description:
      "A sophisticated tool for analyzing and improving your language proficiency across multiple languages",
    creator: "@fluencychecker",
    images: ["/images/twitter-image.png"],
  },
};

export function generateMetadata(config: Partial<SeoConfig> = {}): Metadata {
  const seoConfig = { ...defaultSeoConfig, ...config };

  return {
    metadataBase: seoConfig.metadataBase,
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    authors: seoConfig.authors,
    creator: seoConfig.creator,
    openGraph: seoConfig.openGraph,
    twitter: seoConfig.twitter,
    robots: seoConfig.robots,
  };
}

export const viewport: Viewport = {
  themeColor: defaultSeoConfig.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
