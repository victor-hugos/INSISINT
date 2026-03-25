export type AnalyticsData = {
  ideas: {
    total: number;
    approved: number;
    rejected: number;
    generated: number;
  };
  scripts: {
    total: number;
  };
  calendar: {
    total: number;
  };
  reminders: {
    total: number;
    completed: number;
    pending: number;
    executionRate: number;
  };
  automations: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
};
