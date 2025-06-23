export type ExecutionStatus = "success" | "running" | "submitted" | "error";

export interface AppLink {
  label: string;
  href: string;
}

export interface ErrorDetails {
  message: string;
  links: AppLink[];
}

export interface ExecutionInfo {
  submittedAt: string;
  completedAt?: string; // success
  clusterId: string;
  clusterInstanceId: string;
  status: ExecutionStatus;
  duration?: string; // success
  scannedRows?: number; // success
  currentStage?: string; // running
  progress?: string; // running
  message?: string; // submitted
  appLinks: AppLink[];
  error: ErrorDetails | null;
}
