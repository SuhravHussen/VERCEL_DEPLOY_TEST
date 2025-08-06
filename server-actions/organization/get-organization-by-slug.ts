"use server";

import mockdb from "@/mockdb";

export async function getOrganizationBySlug(slug: string) {
  // fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const organization = mockdb.findOrganizationBySlug(slug);
  return organization;
}
