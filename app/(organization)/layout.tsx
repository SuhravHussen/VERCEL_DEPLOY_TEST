import { OrganizationHeaderWrapper } from "@/components/layout/header";

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

export default function OrganizationLayout({
  children,
}: OrganizationLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <OrganizationHeaderWrapper />
      <main className="flex-1 pt-24">{children}</main>
    </div>
  );
}
