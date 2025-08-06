import { getCurrentUser } from "@/lib/auth";
import { OrganizationHeader } from "./organizationHeader";

export async function OrganizationHeaderWrapper() {
  const user = await getCurrentUser();

  return <OrganizationHeader user={user} />;
}
