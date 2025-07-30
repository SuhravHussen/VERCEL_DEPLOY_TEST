import React from "react";
import { UserOrganizationCard } from "@/components/pages/dashboard/user/UserOrganizationCard";
import { UserOrganization } from "@/types/user-organization";
import { Plus } from "lucide-react";
import Link from "next/link";

interface OrganizationsListProps {
  userOrganizations: UserOrganization[];
}

export function OrganizationsList({
  userOrganizations,
}: OrganizationsListProps) {
  const cardColors = [
    "bg-rose-50 dark:bg-rose-950/30",
    "bg-green-50 dark:bg-green-950/30",
    "bg-blue-50 dark:bg-blue-950/30",
    "bg-purple-50 dark:bg-purple-950/30",
    "bg-pink-50 dark:bg-pink-950/30",
    "bg-cyan-50 dark:bg-cyan-950/30",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#333] dark:text-gray-100">
          Organizations
        </h1>
        <Link
          href="/dashboard/organizations/create"
          className="flex items-center gap-2  text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/90 transition-colors bg-primary dark:text-black dark:hover:bg-gray-200"
        >
          <Plus size={16} />
          Apply for Organization
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="w-full lg:w-2/3">
          <p className="text-muted-foreground mb-6">
            Here you can see all the organizations you are a member of.
          </p>

          {userOrganizations.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <h3 className="text-xl font-medium mb-2">
                No organizations found
              </h3>
              <p className="text-muted-foreground mb-4">
                You are not a member of any organization yet.
              </p>
              <Link
                href="/dashboard/organizations/create"
                className="inline-flex items-center gap-2 bg-[#111] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/90 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                <Plus size={16} />
                Apply for Organization
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {userOrganizations.map((userOrganization, index) => (
                <UserOrganizationCard
                  key={userOrganization.organization.id}
                  userOrganization={userOrganization}
                  gradientClass={cardColors[index % cardColors.length]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Benefits sidebar */}
        <div className="w-full lg:w-1/3 lg:pt-12">
          <div className="sticky top-20 rounded-xl bg-white dark:bg-card p-6 border border-border shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-[#333] dark:text-gray-100">
              Benefits of Organizations
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-300 mt-0.5 flex items-center justify-center w-8 h-8">
                  <span className="text-lg">🏢</span>
                </div>
                <div>
                  <h4 className="font-medium text-[#333] dark:text-gray-100">
                    Team Collaboration
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Work together with your team in a centralized workspace.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-300 mt-0.5 flex items-center justify-center w-8 h-8">
                  <span className="text-lg">👥</span>
                </div>
                <div>
                  <h4 className="font-medium text-[#333] dark:text-gray-100">
                    User Management
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage members and their access permissions easily.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-300 mt-0.5 flex items-center justify-center w-8 h-8">
                  <span className="text-lg">🛡️</span>
                </div>
                <div>
                  <h4 className="font-medium text-[#333] dark:text-gray-100">
                    Enhanced Security
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Better data protection and security for your projects.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-300 mt-0.5 flex items-center justify-center w-8 h-8">
                  <span className="text-lg">⚡</span>
                </div>
                <div>
                  <h4 className="font-medium text-[#333] dark:text-gray-100">
                    Increased Productivity
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Streamlined workflows and improved team efficiency.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="/dashboard/organizations/create"
                className="flex w-full items-center justify-center gap-2 
                 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-black/90 transition-colors bg-primary dark:text-black dark:hover:bg-gray-200"
              >
                <Plus size={16} />
                Apply for Organization
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
