import { executionError, executionRunning, executionSubmitted, executionSuccess } from "@/data/mock-status";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ExecutionInfo } from "@/types/query-status";
import { MOCK_HISTORY } from "@/data/mock-query-history";
import { MOCK_QUERY_LOGS } from "@/data/mock-logs";
import { QueryHistory } from "@/types/query-history";
import { useQueryContext } from "../providers/query-context-provider";

export const useSubmitQuery = () =>
  useMutation({
    mutationFn: async (queryObj: QueryHistory) => {
      await new Promise((r) => setTimeout(r, 1000));
      return null;
    },
  });

export const useDownloadCsv = () => {
  return useMutation({
    mutationFn: async (id?: string) => {
      if (!id) {
        return Promise.reject(new Error("No query ID provided"));
      }

      // Simulate fetching results
      const response = await new Promise<string>((resolve) =>
        setTimeout(() => resolve("id,message\n1,Why did the data scientist break up?\n2,Because they lost interest over time!"), 500)
      );

      return response;
    },
    onSuccess: (csvText: string) => {
      const blob = new Blob([csvText], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "results.csv";
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}

export const useQueryHistory = () =>
  useQuery<QueryHistory[]>({
    queryKey: ["query-history"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 1500));
      return [...MOCK_HISTORY];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useQueryStatus = (queryHistory: QueryHistory | null) => {
  if (!queryHistory || !queryHistory.id) {
    return {
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    }
  }

  return useQuery({
    queryKey: ["query-status", queryHistory.id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      switch (queryHistory.status) {
        case "running":
          return executionRunning as ExecutionInfo;
        case "queued":
          return executionSubmitted as ExecutionInfo;
        case "success":
          return executionSuccess as ExecutionInfo;
        case "error":
          return executionError as ExecutionInfo;
        default:
          throw new Error("Unknown status");
      }
    },
    enabled: !!queryHistory.id,
    refetchInterval: 2000,
  });
}

export const useQueryLogs = (id: string) =>
  useQuery({
    queryKey: ["query-logs", id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return MOCK_QUERY_LOGS || "No logs";
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

export const useQueryResults = (id: string) =>
  useQuery<string>({
    queryKey: ["query-results", id],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 2000));
      const response = await fetch(`/data/${id}.csv`);
      if (!response.ok) throw new Error("Failed to fetch CSV");
      const csvText = await response.text();
      return csvText;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

export const useAddQueryToHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (query: QueryHistory) => {
      MOCK_HISTORY.unshift(query); // mutate the mock directly
      return query;
    },
    onSuccess: () => {
      // update query cache
      queryClient.setQueryData(["query-history"], [...MOCK_HISTORY]);
    },
  });
};

export const useDeleteQueryFromHistory = () => {
  const queryClient = useQueryClient();
  const { setSelectedQuery } = useQueryContext();

  return useMutation({
    mutationFn: async (id: string) => {

      const index = MOCK_HISTORY.findIndex((q) => q.id === id);
      if (index === -1) throw new Error("Query not found");

      MOCK_HISTORY.splice(index, 1); // remove the item

      setSelectedQuery(MOCK_HISTORY[0]);

      return id;
    },
    onSuccess: () => {
      queryClient.setQueryData(["query-history"], [...MOCK_HISTORY]);
    },
  });
};

export const useUpdateQueryInHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<QueryHistory>;
    }) => {
      const index = MOCK_HISTORY.findIndex((q) => q.id === id);
      if (index === -1) throw new Error("Query not found");

      MOCK_HISTORY[index] = {
        ...MOCK_HISTORY[index],
        ...updates,
      };

      return MOCK_HISTORY[index];
    },
    onSuccess: () => {
      queryClient.setQueryData(["query-history"], [...MOCK_HISTORY]);
    },
  });
};