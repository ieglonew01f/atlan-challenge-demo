export interface QueryExecutionLog {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  stage: string;
  message: string;
  durationMs?: number;
}
