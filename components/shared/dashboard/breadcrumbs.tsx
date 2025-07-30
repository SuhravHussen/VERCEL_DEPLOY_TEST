"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

import { IconSlash } from "@tabler/icons-react";
import { Fragment } from "react";

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  if (items.length === 0) return null;

  return (
    <div className="w-full overflow-hidden">
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap">
          {items.map((item, index) => (
            <Fragment key={item.title}>
              {index !== items.length - 1 && (
                <BreadcrumbItem className="hidden md:block flex-shrink-0">
                  <BreadcrumbLink
                    href={item.link}
                    className="truncate max-w-[150px] lg:max-w-[200px]"
                  >
                    {item.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
              {index < items.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block flex-shrink-0">
                  <IconSlash />
                </BreadcrumbSeparator>
              )}
              {index === items.length - 1 && (
                <BreadcrumbPage className="truncate max-w-[150px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-none">
                  {item.title}
                </BreadcrumbPage>
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
