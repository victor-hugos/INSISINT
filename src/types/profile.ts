export type ProfileContext = {
  id: string;
  user_id: string;
  niche: string;
  target_audience: string;
  goal: string;
  tone: string;
  posting_frequency: string;
  products_services?: string | null;
  competitors?: string | null;
};
