import { PublicHeader } from "@/components/layout/header/public/publicHeader";
import type { ReactNode } from "react";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[10000px] bg-background">
      <PublicHeader />
      <div className=" mx-auto">{children}</div>
    </div>
  );
}
