import React from "react";
import { Organization } from "@/types/organization";
import Image from "next/image";
import Link from "next/link";

interface UserOrganizationCardProps {
  organization: Organization;
  gradientClass: string;
}

export function UserOrganizationCard({
  organization,
  gradientClass,
}: UserOrganizationCardProps) {
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
          <h3 className="text-xl font-bold mb-1.5 text-[#333] dark:text-gray-100">
            {organization.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {organization.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 self-center mt-3 sm:mt-0 sm:self-center">
          <Link
            href={`/dashboard/organizations/${organization.id}`}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors  text-white hover:bg-black/90 bg-primary dark:text-black dark:hover:bg-gray-200 inline-block"
          >
            Go to Organization
          </Link>
        </div>
      </div>
    </div>
  );
}
