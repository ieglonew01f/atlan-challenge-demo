export const executionSuccess = {
  submittedAt: "03/13/20, 06:31:08 pm",
  completedAt: "03/13/20, 06:32:05 pm",
  clusterId: "21835",
  clusterInstanceId: "1356547",
  status: "success",
  duration: "57s",
  scannedRows: 23456789,
  appLinks: [
    {
      label: "Application UI",
      href: "https://api.acme.com/api/v1/querytracker?qid=110512144",
    },
  ],
  error: null,
};

export const executionRunning = {
  submittedAt: "03/13/20, 06:31:08 pm",
  clusterId: "21835",
  clusterInstanceId: "1356547",
  status: "running",
  currentStage: "Stage 2 of 5 - Sorting results",
  progress: "41%",
  appLinks: [
    {
      label: "Application UI",
      href: "https://api.acme.com/api/v1/querytracker?qid=110512144",
    },
  ],
  error: null,
};

export const executionSubmitted = {
  submittedAt: "03/13/20, 06:31:08 pm",
  clusterId: "21835",
  clusterInstanceId: "1356547",
  status: "submitted",
  message: "Waiting for resource allocation...",
  appLinks: [],
  error: null,
};

export const executionError = {
  submittedAt: "03/13/20, 06:31:08 pm",
  completedAt: "03/13/20, 06:32:05 pm",
  clusterId: "21835",
  clusterInstanceId: "1356547",
  status: "error",
  duration: "1h 23m 45s",
  scannedRows: 0,
  appLinks: [
    {
      label: "Application UI",
      href: "https://api.acme.com/api/v1/querytracker?qid=110512144",
    },
  ],
  error: {
    message:
      "Query exceeded per-node total memory limit of 29.87GB [Allocated: 29.87GB, Delta: 159.83kB, Top Consumers: {OrderByOperator=29.87GB}]",
    links: [
      { label: "Show stacktrace", href: "#" },
      { label: "Troubleshoot Guide", href: "#" },
    ],
  },
};
