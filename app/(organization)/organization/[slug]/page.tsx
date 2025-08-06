import { OrganizationView } from "@/components/pages/dashboard/user/organization/organization-view";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMetadata as generateSeoMetadata } from "@/config/seo";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getOrganizationBySlug } from "@/server-actions/organization/get-organization-by-slug";

interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: OrganizationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);

  if (!organization) {
    return generateSeoMetadata({
      title: "Organization Not Found - Fluency Checker",
      description:
        "The requested organization could not be found. Explore other organizations on Fluency Checker.",
      openGraph: {
        url: `https://fluency-checker.com/organization/${slug}`,
        siteName: "Fluency Checker",
        type: "website",
        locale: "en_US",
        images: [
          {
            url: "/images/og-image.png",
            width: 1200,
            height: 630,
            alt: "Organization Not Found - Fluency Checker",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Organization Not Found - Fluency Checker",
        description:
          "The requested organization could not be found. Explore other organizations on Fluency Checker.",
        creator: "@fluencychecker",
        images: ["/images/twitter-image.png"],
      },
    });
  }

  const organizationName = organization.name;
  const title = `${organizationName}`;
  const description =
    organization.description ||
    `Join ${organizationName} on Fluency Checker. Access exclusive educational content, exams, and announcements. Improve your language proficiency with our comprehensive learning platform.`;

  return generateSeoMetadata({
    title,
    description,
    keywords: [
      "education",
      "learning",
      "organization",
      "exams",
      "language proficiency",
      "fluency checker",
      organizationName.toLowerCase(),
      "online learning",
      "educational platform",
      "language skills",
      "assessments",
      "announcements",
    ],
    openGraph: {
      url: `https://${slug}.fluency-checker.com`,
      siteName: "Fluency Checker",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: organization.logo || "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: `${organizationName} - Educational Organization on Fluency Checker`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@fluencychecker",
      images: [organization.logo || "/images/twitter-image.png"],
    },
  });
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { slug } = await params;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <Suspense
        fallback={
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl" />
                <div className="space-y-2 sm:space-y-3 text-center sm:text-left">
                  <Skeleton className="h-8 sm:h-10 w-64 sm:w-80 mx-auto sm:mx-0" />
                  <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 mx-auto sm:mx-0" />
                </div>
              </div>
              <Skeleton className="h-32 sm:h-40 w-full rounded-xl" />
              <Skeleton className="h-48 sm:h-64 w-full rounded-xl" />
            </div>
          </div>
        }
      >
        <OrganizationView organizationSlug={slug} />
      </Suspense>
    </div>
  );
}
