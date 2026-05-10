-- ============================================================
-- INSISINT core tables
-- ============================================================

-- profiles
create table if not exists profiles (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users on delete cascade,
  niche            text        not null,
  target_audience  text        not null default '',
  goal             text        not null default '',
  tone             text        not null default '',
  posting_frequency text       not null default '',
  products_services text       not null default '',
  competitors       text       not null default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "profiles: own rows" on profiles
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- content_ideas
create table if not exists content_ideas (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users on delete cascade,
  profile_id  uuid        not null references profiles on delete cascade,
  category    text        not null,
  title       text        not null,
  hook        text        not null default '',
  description text        not null default '',
  status      text        not null default 'generated',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table content_ideas enable row level security;
create policy "content_ideas: own rows" on content_ideas
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- content_calendar
create table if not exists content_calendar (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users on delete cascade,
  profile_id        uuid        not null references profiles on delete cascade,
  day_of_week       text        not null,
  category          text        not null,
  content_type      text        not null,
  title             text        not null,
  objective         text        not null default '',
  notes             text        not null default '',
  source_idea_title text,
  created_at        timestamptz not null default now()
);
alter table content_calendar enable row level security;
create policy "content_calendar: own rows" on content_calendar
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- weekly_plan_ideas
create table if not exists weekly_plan_ideas (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users on delete cascade,
  profile_id uuid        not null references profiles on delete cascade,
  idea_id    uuid        not null references content_ideas on delete cascade,
  week_key   text        not null,
  created_at timestamptz not null default now(),
  unique (user_id, profile_id, idea_id, week_key)
);
alter table weekly_plan_ideas enable row level security;
create policy "weekly_plan_ideas: own rows" on weekly_plan_ideas
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- reminders
create table if not exists reminders (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users on delete cascade,
  profile_id       uuid        not null references profiles on delete cascade,
  calendar_item_id uuid        references content_calendar on delete set null,
  title            text        not null,
  description      text,
  reminder_type    text        not null,
  scheduled_for    timestamptz not null,
  status           text        not null default 'pending',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table reminders enable row level security;
create policy "reminders: own rows" on reminders
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- scripts
create table if not exists scripts (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users on delete cascade,
  profile_id  uuid        not null references profiles on delete cascade,
  idea_title  text        not null,
  category    text        not null,
  hook        text        not null default '',
  development text        not null default '',
  cta         text        not null default '',
  caption     text        not null default '',
  created_at  timestamptz not null default now()
);
alter table scripts enable row level security;
create policy "scripts: own rows" on scripts
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- diagnoses
create table if not exists diagnoses (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users on delete cascade,
  profile_id uuid        not null references profiles on delete cascade,
  result     jsonb       not null default '{}',
  created_at timestamptz not null default now()
);
alter table diagnoses enable row level security;
create policy "diagnoses: own rows" on diagnoses
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- automation_rules
create table if not exists automation_rules (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users on delete cascade,
  profile_id    uuid        not null references profiles on delete cascade,
  platform      text        not null,
  trigger_type  text        not null,
  keyword       text        not null,
  reply_message text        not null,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table automation_rules enable row level security;
create policy "automation_rules: own rows" on automation_rules
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- automation_events
create table if not exists automation_events (
  id                   uuid        primary key default gen_random_uuid(),
  user_id              uuid        not null references auth.users on delete cascade,
  profile_id           uuid        not null references profiles on delete cascade,
  platform             text        not null,
  event_type           text        not null,
  external_event_id    text,
  external_media_id    text,
  external_comment_id  text,
  external_from_id     text,
  comment_text         text,
  raw_payload          jsonb,
  matched_rule_id      uuid        references automation_rules on delete set null,
  created_at           timestamptz not null default now()
);
alter table automation_events enable row level security;
create policy "automation_events: own rows" on automation_events
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- automation_actions
create table if not exists automation_actions (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null references auth.users on delete cascade,
  profile_id          uuid        not null references profiles on delete cascade,
  event_id            uuid        not null references automation_events on delete cascade,
  rule_id             uuid        not null references automation_rules on delete cascade,
  action_type         text        not null,
  status              text        not null default 'pending',
  response_payload    jsonb,
  external_message_id text,
  error_message       text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
alter table automation_actions enable row level security;
create policy "automation_actions: own rows" on automation_actions
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
