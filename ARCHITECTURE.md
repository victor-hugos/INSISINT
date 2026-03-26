# Architecture

## Visao geral da arquitetura

INSISINT e um aplicativo full-stack em Next.js App Router com:

- frontend em React
- APIs server-side em `src/app/api`
- autenticacao em Supabase Auth
- banco de dados em Supabase Postgres
- integracoes com OpenAI e Instagram

O projeto esta organizado por dominio para facilitar crescimento incremental.

## Frontend

### Estrutura principal

- `src/app`
  - paginas do App Router
- `src/components/layout`
  - shell e navegacao
- `src/components/auth`
  - sessao, auth guard e provider
- `src/components/profile`
  - perfil ativo e contexto de perfil
- `src/components/modules`
  - paineis principais do produto
- `src/components/ui`
  - componentes reutilizaveis

### Paginas principais

- `/`
  - central do produto
- `/login`
  - autenticacao
- `/signup`
  - cadastro
- `/onboarding`
  - criacao do perfil operacional
- `/ideas`
  - geracao e aprovacao de ideias
- `/weekly-plan`
  - selecao da semana
- `/calendar`
  - calendario de conteudo
- `/reminders`
  - lembretes e execucao
- `/dashboard`
  - visao consolidada
- `/pilot`
  - landing de captacao
- `/pilot/apply`
  - formulario de lead
- `/pilot/leads`
  - painel interno de leads

### Componentes principais

- `AuthProvider`
- `ProfileProvider`
- `AppShell`
- `OnboardingForm`
- `IdeasPanel`
- `WeeklyPlanPanel`
- `CalendarPanel`
- `RemindersPanel`
- `DashboardPanel`
- `AnalyticsPanel`
- `AutomationPanel`
- `AutomationMonitorPanel`

## Backend / APIs

As APIs ficam em `src/app/api` e seguem um padrao geral:

1. autenticar usuario
2. validar ownership do perfil quando necessario
3. usar client autenticado do usuario para operacoes comuns
4. usar client server/service role apenas onde faz sentido operacional

### Endpoints principais

- `/api/onboarding`
  - cria perfil do usuario
- `/api/diagnosis`
  - gera diagnostico inicial com OpenAI
- `/api/profile-context`
  - busca perfil ativo
- `/api/ideas`
  - gera ideias e salva no banco
- `/api/ideas/list`
  - lista ideias do perfil
- `/api/ideas/status`
  - aprova ou rejeita ideias
- `/api/ideas/generate-script`
  - cria roteiro a partir de ideia
- `/api/scripts`
  - persiste roteiros
- `/api/weekly-plan/current`
  - carrega plano atual da semana
- `/api/weekly-plan/select-ideas`
  - salva selecao semanal
- `/api/calendar`
  - gera e salva calendario
- `/api/calendar/generate-reminders`
  - cria lembretes a partir do calendario
- `/api/reminders`
  - cria lembrete manual
- `/api/reminders/list`
  - lista lembretes
- `/api/reminders/complete`
  - conclui lembrete
- `/api/reminders/progress`
  - calcula progresso da semana
- `/api/dashboard`
  - agrega dados principais
- `/api/analytics`
  - agrega contadores de operacao
- `/api/pilot/apply`
  - salva lead do piloto
- `/api/pilot/leads`
  - lista leads, restrito a admin
- `/api/pilot/leads/status`
  - atualiza status do lead
- `/api/health`
  - health-check operacional

### Endpoints avancados

- `/api/automation/rules`
- `/api/automation/logs`
- `/api/automation/actions/retry`
- `/api/automation/actions/run`
- `/api/webhooks/instagram`

## Banco de dados (Supabase)

### Tabelas principais

- `profiles`
  - contexto principal do usuario
- `diagnoses`
  - diagnosticos gerados
- `content_ideas`
  - ideias de conteudo
- `scripts`
  - roteiros gerados
- `weekly_plan_ideas`
  - relacao das ideias da semana
- `content_calendar`
  - calendario de conteudo
- `reminders`
  - lembretes operacionais
- `automation_rules`
  - regras de automacao por comentario
- `automation_events`
  - eventos recebidos
- `automation_actions`
  - acoes disparadas
- `pilot_leads`
  - interessados do piloto

### Relacoes principais

- `profiles` -> base do contexto do usuario
- `diagnoses.profile_id` -> `profiles.id`
- `content_ideas.profile_id` -> `profiles.id`
- `scripts.profile_id` -> `profiles.id`
- `weekly_plan_ideas.profile_id` -> `profiles.id`
- `weekly_plan_ideas.idea_id` -> `content_ideas.id`
- `content_calendar.profile_id` -> `profiles.id`
- `reminders.profile_id` -> `profiles.id`
- `reminders.calendar_item_id` -> `content_calendar.id`
- `automation_rules.profile_id` -> `profiles.id`
- `automation_events.profile_id` -> `profiles.id`
- `automation_actions.profile_id` -> `profiles.id`
- `automation_actions.event_id` -> `automation_events.id`
- `automation_actions.rule_id` -> `automation_rules.id`

## Fluxo de autenticacao

1. o usuario cria conta ou faz login pelo browser
2. a sessao e mantida pelo Supabase Auth
3. `AuthProvider` expoe `user` e `session`
4. `ProfileProvider` gerencia o perfil ativo por usuario
5. rotas protegidas usam:
   - `requireAuthenticatedUser`
   - `requireProfileOwnership`

## Fluxo principal do sistema

### Fluxo operacional

1. lead ou usuario entra no sistema
2. cria conta
3. faz onboarding
4. gera diagnostico
5. gera ideias
6. aprova ideias
7. escolhe as ideias da semana
8. gera calendario
9. cria lembretes
10. executa a semana
11. acompanha tudo no dashboard

### Fluxo comercial

1. usuario chega em `/pilot`
2. envia aplicacao em `/pilot/apply`
3. lead e salvo em `pilot_leads`
4. admin acompanha em `/pilot/leads`

## Dependencias externas

- Supabase
  - auth
  - database
- OpenAI
  - diagnostico
  - ideias
  - scripts
  - calendario
- Instagram / Meta
  - base de webhook e private reply, ainda em nivel MVP
