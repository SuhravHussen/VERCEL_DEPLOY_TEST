import { getCurrentUser } from "@/lib/auth";
import { Organization } from "@/types/organization";
import { Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OrganizationHeader } from "./components/organization-header";
import { MembershipSection } from "./components/membership-section";
import { AboutSection } from "./components/about-section";
import { ExamsSection } from "./components/exams-section";
import { ContactSection } from "./components/contact-section";

interface OrganizationServerViewProps {
  organization: Organization | null | undefined;
}

export async function OrganizationServerView({
  organization,
}: OrganizationServerViewProps) {
  const currentUser = await getCurrentUser();

  if (!organization) {
    return (
      <Alert>
        <AlertDescription>
          Organization not found or you don&apos;t have access to view this
          organization.
        </AlertDescription>
      </Alert>
    );
  }

  // Check if user is a member of the organization
  const isMember = currentUser
    ? Boolean(
        organization.users?.some((user) => user.id === currentUser.id) ||
          organization.instructors?.some(
            (instructor) => instructor.id === currentUser.id
          ) ||
          currentUser.organizations_admin?.some(
            (org) => org.id === organization.id
          ) ||
          currentUser.organizations_instructor?.some(
            (org) => org.id === organization.id
          )
      )
    : false;

  return (
    <div className="space-y-6 md:space-y-8">
      <OrganizationHeader organization={organization} />

      {currentUser && (
        <MembershipSection
          organization={organization}
          isMember={isMember}
          userId={currentUser.id}
        />
      )}

      <AboutSection organization={organization} />

      <Suspense fallback={<div>Loading exams...</div>}>
        <ExamsSection organizationId={organization.id.toString()} />
      </Suspense>

      <ContactSection organization={organization} />
    </div>
  );
}
