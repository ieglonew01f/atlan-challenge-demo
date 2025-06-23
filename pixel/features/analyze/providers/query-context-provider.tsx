"use client";

import { createContext, useContext, useState } from "react";

import { QueryHistory } from "@/types/query-history";

const QueryContext = createContext<{
  selectedQuery: QueryHistory | null;
  setSelectedQuery: (query: QueryHistory | null) => void;
}>({
  selectedQuery: null,
  setSelectedQuery: () => {},
});

export const useQueryContext = () => useContext(QueryContext);

export function QueryContextProvider({ children }: { children: React.ReactNode }) {
  const [selectedQuery, setSelectedQuery] = useState<QueryHistory | null>(null);
  return (
    <QueryContext.Provider value={{ selectedQuery, setSelectedQuery }}>
      {children}
    </QueryContext.Provider>
  );
}
