import { notFound } from "next/navigation";

export default async function OrganizationDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Organization Dashboard</h1>
      <p className="mb-4">Organization Dashboard</p>

      <div>Coming Soon</div>
    </div>
  );
}
