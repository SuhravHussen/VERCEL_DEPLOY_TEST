import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizations Management",
  description: "Manage organizations in the system",
};

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
