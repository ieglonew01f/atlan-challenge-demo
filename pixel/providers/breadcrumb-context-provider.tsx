"use client";

import { createContext, useContext, useState } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const BreadcrumbContext = createContext<{
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  clearBreadcrumbs: () => void;
}>({
  breadcrumbs: [],
  setBreadcrumbs: () => {},
  addBreadcrumb: () => {},
  clearBreadcrumbs: () => {},
});

export const useBreadcrumbContext = () => useContext(BreadcrumbContext);

export function BreadcrumbContextProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const addBreadcrumb = (item: BreadcrumbItem) => {
    setBreadcrumbs((prev) => [...prev, item]);
  };

  const clearBreadcrumbs = () => setBreadcrumbs([]);

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumbs, setBreadcrumbs, addBreadcrumb, clearBreadcrumbs }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}
