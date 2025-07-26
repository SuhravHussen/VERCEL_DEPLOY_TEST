import { MetadataRoute } from "next";
import { siteConfig } from "@/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static routes with their last modified date
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Add product pages
  const productPages =
    siteConfig.footerLinks
      .find((section) => section.title === "Products")
      ?.links.map((link) => ({
        url: `${baseUrl}${link.href}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })) || [];

  // Combine all routes
  return [...staticRoutes, ...productPages];
}
