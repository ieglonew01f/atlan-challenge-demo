export type QueryStatus = "success" | "error" | "queued" | "running";

export interface QueryHistory {
  id: string;
  name: string;
  engine: string;
  user: string;
  date: string;
  query: string;
  status: QueryStatus;
  cluster: string;
  resultUUID?: string;
}