export type SiteConfig = {
  name: string;
  url: string;
  ogImage: string;
  description: string;
  links: {
    twitter: string;
    github: string;
  };
  mainNav: {
    title: string;
    href: string;
  }[];
  footerLinks: {
    title: string;
    links: {
      title: string;
      href: string;
      external?: boolean;
    }[];
  }[];
};

export const siteConfig: SiteConfig = {
  name: "Fluency Checker",
  url: "https://fluency-checker.com",
  ogImage: "/images/og-image.png",
  description:
    "A sophisticated tool for analyzing and improving your language proficiency across multiple languages",
  links: {
    twitter: "https://twitter.com/fluencychecker",
    github: "https://github.com/fluencychecker/fluency-checker",
  },
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Features",
      href: "/features",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  footerLinks: [
    {
      title: "Products",
      links: [
        {
          title: "Fluency Test",
          href: "/products/fluency-test",
        },
        {
          title: "Language Analyzer",
          href: "/products/language-analyzer",
        },
        {
          title: "Progress Tracker",
          href: "/products/progress-tracker",
        },
      ],
    },
    {
      title: "Resources",
      links: [
        {
          title: "Documentation",
          href: "/docs",
        },
        {
          title: "Blog",
          href: "/blog",
        },
        {
          title: "Support",
          href: "/support",
        },
      ],
    },
    {
      title: "Company",
      links: [
        {
          title: "About Us",
          href: "/about",
        },
        {
          title: "Careers",
          href: "/careers",
        },
        {
          title: "Privacy Policy",
          href: "/privacy",
        },
        {
          title: "Terms of Service",
          href: "/terms",
        },
      ],
    },
  ],
};
