"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useBreadcrumbContext } from "@/providers/breadcrumb-context-provider";
import { useEffect } from "react";

export function Breadcrumbs() {
  const { breadcrumbs } = useBreadcrumbContext();

  const { setBreadcrumbs } = useBreadcrumbContext();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Analyze", href: "/analyze/query" },
      { label: "Query" },
    ]);
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center space-x-1">
            <BreadcrumbItem className={index < breadcrumbs.length - 1 ? "hidden md:block" : ""}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
