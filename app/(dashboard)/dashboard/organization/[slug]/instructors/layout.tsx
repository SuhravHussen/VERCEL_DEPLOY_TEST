import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organization Instructors",
  description: "Manage instructors in your organization",
};

export default async function InstructorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
