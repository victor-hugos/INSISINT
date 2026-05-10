create table if not exists pilot_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  instagram text,
  niche text,
  pain text,
  frequency text,
  goal text,
  feedback text,
  source text not null default 'pilot_landing',
  status text not null default 'new',
  notes text,
  contacted_at timestamptz,
  approved_at timestamptz,
  converted_at timestamptz,
  rejected_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table pilot_leads enable row level security;
