import React from "react";
import { UserOrganization } from "@/types/user-organization";
import Image from "next/image";
import Link from "next/link";
import { Role } from "@/types/role";
import { getOrganizationUrl } from "@/lib/getOrgUrl";

interface UserOrganizationCardProps {
  userOrganization: UserOrganization;
  gradientClass: string;
}

function getRoleBadgeColor(role: Role) {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "INSTRUCTOR":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "USER":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export function UserOrganizationCard({
  userOrganization,
  gradientClass,
}: UserOrganizationCardProps) {
  const { organization, role } = userOrganization;

  return (
    <div
      className={`${gradientClass} rounded-2xl p-6 border border-gray-100 dark:border-gray-800 overflow-hidden`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Logo */}
        <div className="flex-shrink-0">
          {organization.logo ? (
            <Image
              src={organization.logo}
              alt={organization.name}
              width={100}
              height={100}
              className="rounded-lg object-cover w-full h-full"
            />
          ) : (
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {organization.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Organization Details */}
        <div className="flex-1 py-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-[#333] dark:text-gray-100">
              {organization.name}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                role
              )}`}
            >
              {formatRole(role)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {organization.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 self-center mt-3 sm:mt-0 sm:self-center">
          <div className="flex flex-col gap-2">
            {/* Dashboard link for admins and instructors */}
            {(role === "ADMIN" || role === "INSTRUCTOR") && (
              <Link
                href={`/dashboard/organization/${organization.id}`}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors text-white hover:bg-black/90 bg-primary dark:text-black dark:hover:bg-gray-200 inline-block text-center"
              >
                Go to Dashboard
              </Link>
            )}

            {/* Organization link for all users */}
            <Link
              href={getOrganizationUrl(organization.slug)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 inline-block text-center"
            >
              Go to Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
