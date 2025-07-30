"use client";

interface AnnouncementsTabProps {
  organizationId: string;
}

export function AnnouncementsTab({ organizationId }: AnnouncementsTabProps) {
  // TODO: Use organizationId when implementing actual announcements functionality
  void organizationId;
  return (
    <div className="space-y-6">
      <h1>Announcements</h1>
    </div>
  );
}
