import { Organization } from "@/types/organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactSectionProps {
  organization: Organization;
}

export function ContactSection({ organization }: ContactSectionProps) {
  return (
    <Card className="shadow-md sm:shadow-lg shadow-black/5 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 border border-blue-200/50 dark:border-blue-800/30">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-800 dark:text-blue-200">
            Contact Us
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
            Have questions about {organization.name}? Need help with
            registration or want to learn more about our programs? We&apos;re
            here to help!
          </p>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Email Contact */}
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-white/60 dark:bg-gray-900/60 border border-blue-100 dark:border-blue-900/50">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base">
                  Email Support
                </h3>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                  contact@
                  {organization.name.toLowerCase().replace(/\s+/g, "")}.org
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-500">
                  Response within 24 hours
                </p>
              </div>
            </div>

            {/* Phone Contact */}
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-white/60 dark:bg-gray-900/60 border border-blue-100 dark:border-blue-900/50">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base">
                  Phone Support
                </h3>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                  +1 (555) 123-4567
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-500">
                  Mon-Fri, 9 AM - 6 PM
                </p>
              </div>
            </div>

            {/* Office Address */}
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-white/60 dark:bg-gray-900/60 border border-blue-100 dark:border-blue-900/50 md:col-span-2">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base">
                  Office Address
                </h3>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                  123 Education Street, Learning District
                  <br />
                  Knowledge City, KC 12345
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-500">
                  Visit us during business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
