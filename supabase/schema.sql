create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  niche text not null,
  target_audience text not null,
  goal text not null,
  tone text not null,
  posting_frequency text not null,
  products_services text,
  competitors text,
  created_at timestamptz default now()
);

create table if not exists diagnoses (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  result jsonb not null,
  created_at timestamptz default now()
);

create table if not exists content_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  category text not null,
  title text not null,
  hook text not null,
  description text,
  status text not null default 'generated',
  created_at timestamptz default now()
);

create table if not exists scripts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  idea_title text not null,
  category text not null,
  hook text not null,
  development text not null,
  cta text not null,
  caption text not null,
  created_at timestamptz default now()
);

create table if not exists content_calendar (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  day_of_week text not null,
  category text not null,
  content_type text not null,
  title text not null,
  objective text not null,
  notes text,
  source_idea_title text,
  created_at timestamptz default now()
);

alter table content_calendar
add column if not exists source_idea_title text;

alter table content_ideas
add column if not exists status text not null default 'generated';

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  calendar_item_id uuid references content_calendar(id) on delete set null,
  title text not null,
  description text,
  reminder_type text not null,
  scheduled_for timestamptz not null,
  status text not null default 'pending',
  completed_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table reminders
add column if not exists calendar_item_id uuid references content_calendar(id) on delete set null;

alter table reminders
add column if not exists completed_at timestamptz;

alter table reminders
add column if not exists updated_at timestamptz default now();

create table if not exists weekly_plan_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  idea_id uuid not null references content_ideas(id) on delete cascade,
  week_key text not null,
  created_at timestamptz default now(),
  unique (profile_id, idea_id, week_key)
);

create table if not exists automation_rules (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  platform text not null default 'instagram',
  trigger_type text not null default 'comment_keyword',
  keyword text not null,
  reply_message text not null,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists automation_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  platform text not null default 'instagram',
  event_type text not null,
  external_event_id text,
  external_media_id text,
  external_comment_id text,
  external_from_id text,
  comment_text text,
  raw_payload jsonb,
  matched_rule_id uuid references automation_rules(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists automation_actions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  event_id uuid not null references automation_events(id) on delete cascade,
  rule_id uuid references automation_rules(id) on delete set null,
  action_type text not null default 'instagram_private_reply',
  status text not null default 'pending',
  response_payload jsonb,
  external_message_id text,
  error_message text,
  retry_count integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table automation_actions
add column if not exists retry_count integer not null default 0;

create table if not exists pilot_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  instagram text,
  niche text,
  pain text,
  frequency text,
  goal text,
  feedback text,
  status text not null default 'new',
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table diagnoses enable row level security;
alter table content_ideas enable row level security;
alter table scripts enable row level security;
alter table content_calendar enable row level security;
alter table reminders enable row level security;
alter table weekly_plan_ideas enable row level security;
alter table automation_rules enable row level security;
alter table automation_events enable row level security;
alter table automation_actions enable row level security;

drop policy if exists "profiles_select_own" on profiles;
drop policy if exists "profiles_insert_own" on profiles;
drop policy if exists "profiles_update_own" on profiles;
drop policy if exists "profiles_delete_own" on profiles;

create policy "profiles_select_own"
on profiles
for select
using (auth.uid()::text = user_id);

create policy "profiles_insert_own"
on profiles
for insert
with check (auth.uid()::text = user_id);

create policy "profiles_update_own"
on profiles
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "profiles_delete_own"
on profiles
for delete
using (auth.uid()::text = user_id);

drop policy if exists "diagnoses_select_own" on diagnoses;
drop policy if exists "diagnoses_insert_own" on diagnoses;
drop policy if exists "diagnoses_update_own" on diagnoses;
drop policy if exists "diagnoses_delete_own" on diagnoses;

create policy "diagnoses_select_own"
on diagnoses
for select
using (auth.uid()::text = user_id);

create policy "diagnoses_insert_own"
on diagnoses
for insert
with check (auth.uid()::text = user_id);

create policy "diagnoses_update_own"
on diagnoses
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "diagnoses_delete_own"
on diagnoses
for delete
using (auth.uid()::text = user_id);

drop policy if exists "content_ideas_select_own" on content_ideas;
drop policy if exists "content_ideas_insert_own" on content_ideas;
drop policy if exists "content_ideas_update_own" on content_ideas;
drop policy if exists "content_ideas_delete_own" on content_ideas;

create policy "content_ideas_select_own"
on content_ideas
for select
using (auth.uid()::text = user_id);

create policy "content_ideas_insert_own"
on content_ideas
for insert
with check (auth.uid()::text = user_id);

create policy "content_ideas_update_own"
on content_ideas
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "content_ideas_delete_own"
on content_ideas
for delete
using (auth.uid()::text = user_id);

drop policy if exists "scripts_select_own" on scripts;
drop policy if exists "scripts_insert_own" on scripts;
drop policy if exists "scripts_update_own" on scripts;
drop policy if exists "scripts_delete_own" on scripts;

create policy "scripts_select_own"
on scripts
for select
using (auth.uid()::text = user_id);

create policy "scripts_insert_own"
on scripts
for insert
with check (auth.uid()::text = user_id);

create policy "scripts_update_own"
on scripts
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "scripts_delete_own"
on scripts
for delete
using (auth.uid()::text = user_id);

drop policy if exists "content_calendar_select_own" on content_calendar;
drop policy if exists "content_calendar_insert_own" on content_calendar;
drop policy if exists "content_calendar_update_own" on content_calendar;
drop policy if exists "content_calendar_delete_own" on content_calendar;

create policy "content_calendar_select_own"
on content_calendar
for select
using (auth.uid()::text = user_id);

create policy "content_calendar_insert_own"
on content_calendar
for insert
with check (auth.uid()::text = user_id);

create policy "content_calendar_update_own"
on content_calendar
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "content_calendar_delete_own"
on content_calendar
for delete
using (auth.uid()::text = user_id);

drop policy if exists "reminders_select_own" on reminders;
drop policy if exists "reminders_insert_own" on reminders;
drop policy if exists "reminders_update_own" on reminders;
drop policy if exists "reminders_delete_own" on reminders;

create policy "reminders_select_own"
on reminders
for select
using (auth.uid()::text = user_id);

create policy "reminders_insert_own"
on reminders
for insert
with check (auth.uid()::text = user_id);

create policy "reminders_update_own"
on reminders
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "reminders_delete_own"
on reminders
for delete
using (auth.uid()::text = user_id);

drop policy if exists "weekly_plan_ideas_select_own" on weekly_plan_ideas;
drop policy if exists "weekly_plan_ideas_insert_own" on weekly_plan_ideas;
drop policy if exists "weekly_plan_ideas_update_own" on weekly_plan_ideas;
drop policy if exists "weekly_plan_ideas_delete_own" on weekly_plan_ideas;

create policy "weekly_plan_ideas_select_own"
on weekly_plan_ideas
for select
using (auth.uid()::text = user_id);

create policy "weekly_plan_ideas_insert_own"
on weekly_plan_ideas
for insert
with check (auth.uid()::text = user_id);

create policy "weekly_plan_ideas_update_own"
on weekly_plan_ideas
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "weekly_plan_ideas_delete_own"
on weekly_plan_ideas
for delete
using (auth.uid()::text = user_id);

drop policy if exists "automation_rules_select_own" on automation_rules;
drop policy if exists "automation_rules_insert_own" on automation_rules;
drop policy if exists "automation_rules_update_own" on automation_rules;
drop policy if exists "automation_rules_delete_own" on automation_rules;

create policy "automation_rules_select_own"
on automation_rules
for select
using (auth.uid()::text = user_id);

create policy "automation_rules_insert_own"
on automation_rules
for insert
with check (auth.uid()::text = user_id);

create policy "automation_rules_update_own"
on automation_rules
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "automation_rules_delete_own"
on automation_rules
for delete
using (auth.uid()::text = user_id);

drop policy if exists "automation_events_select_own" on automation_events;
drop policy if exists "automation_events_insert_own" on automation_events;
drop policy if exists "automation_events_update_own" on automation_events;
drop policy if exists "automation_events_delete_own" on automation_events;

create policy "automation_events_select_own"
on automation_events
for select
using (auth.uid()::text = user_id);

create policy "automation_events_insert_own"
on automation_events
for insert
with check (auth.uid()::text = user_id);

create policy "automation_events_update_own"
on automation_events
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "automation_events_delete_own"
on automation_events
for delete
using (auth.uid()::text = user_id);

drop policy if exists "automation_actions_select_own" on automation_actions;
drop policy if exists "automation_actions_insert_own" on automation_actions;
drop policy if exists "automation_actions_update_own" on automation_actions;
drop policy if exists "automation_actions_delete_own" on automation_actions;

create policy "automation_actions_select_own"
on automation_actions
for select
using (auth.uid()::text = user_id);

create policy "automation_actions_insert_own"
on automation_actions
for insert
with check (auth.uid()::text = user_id);

create policy "automation_actions_update_own"
on automation_actions
for update
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "automation_actions_delete_own"
on automation_actions
for delete
using (auth.uid()::text = user_id);

create index if not exists idx_profiles_user_id on profiles(user_id);
create index if not exists idx_diagnoses_user_id on diagnoses(user_id);
create index if not exists idx_content_ideas_user_id on content_ideas(user_id);
create index if not exists idx_content_ideas_profile_id on content_ideas(profile_id);
create index if not exists idx_scripts_user_id on scripts(user_id);
create index if not exists idx_scripts_profile_id on scripts(profile_id);
create index if not exists idx_content_calendar_user_id on content_calendar(user_id);
create index if not exists idx_content_calendar_profile_id on content_calendar(profile_id);
create index if not exists idx_reminders_user_id on reminders(user_id);
create index if not exists idx_reminders_profile_id on reminders(profile_id);
create index if not exists idx_weekly_plan_ideas_user_id on weekly_plan_ideas(user_id);
create index if not exists idx_weekly_plan_ideas_profile_id on weekly_plan_ideas(profile_id);
create index if not exists idx_automation_rules_user_id on automation_rules(user_id);
create index if not exists idx_automation_events_user_id on automation_events(user_id);
create index if not exists idx_automation_actions_user_id on automation_actions(user_id);
