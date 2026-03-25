export type DashboardData = {
  profile: {
    id: string;
    niche: string;
    target_audience: string;
    goal: string;
    tone: string;
    posting_frequency: string;
    products_services?: string | null;
    competitors?: string | null;
  } | null;
  diagnosis: {
    result: {
      summary?: string;
      strengths?: string[];
      weaknesses?: string[];
      opportunities?: string[];
      pillars?: string[];
    };
  } | null;
  ideas: Array<{
    id: string;
    category: string;
    title: string;
    hook: string;
    description: string;
  }>;
  scripts: Array<{
    id: string;
    idea_title: string;
    category: string;
    hook: string;
    development: string;
    cta: string;
    caption: string;
  }>;
  calendar: Array<{
    id: string;
    day_of_week: string;
    category: string;
    content_type: string;
    title: string;
    objective: string;
    notes: string;
    source_idea_title?: string | null;
  }>;
  reminders: Array<{
    id: string;
    title: string;
    description: string | null;
    reminder_type: string;
    scheduled_for: string;
    status: string;
    calendar_item_id?: string | null;
  }>;
  automation?: Array<{
    id: string;
    status: "pending" | "sent" | "failed";
  }>;
  ideasSummary?: Array<{
    id: string;
    status: "generated" | "approved" | "rejected";
  }>;
};

export type ProgressData = {
  weekKey: string;
  total: number;
  completed: number;
  percentage: number;
};
