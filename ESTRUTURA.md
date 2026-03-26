# Estrutura

## Raiz do projeto

- `src`
  - codigo da aplicacao
- `supabase`
  - schema e seed
- `teste`
  - relatorios e analises

## App

- `src/app`
  - paginas e rotas API do Next.js App Router

### Paginas

- `/`
- `/login`
- `/signup`
- `/onboarding`
- `/ideas`
- `/weekly-plan`
- `/calendar`
- `/reminders`
- `/dashboard`
- `/analytics`
- `/automation`
- `/automation/monitor`
- `/pilot`
- `/pilot/apply`
- `/pilot/leads`

### APIs

- `src/app/api`
  - onboarding
  - diagnosis
  - ideas
  - scripts
  - weekly-plan
  - calendar
  - reminders
  - dashboard
  - analytics
  - pilot
  - automation
  - webhooks
  - health

## Components

- `src/components/auth`
  - auth guard, auth provider, session box
- `src/components/profile`
  - perfil ativo e contexto
- `src/components/layout`
  - shell principal
- `src/components/ui`
  - componentes reutilizaveis
- `src/components/modules`
  - paineis de cada modulo do produto

## Lib

- `src/lib/auth`
  - auth server-side e admin
- `src/lib/db`
  - clients do Supabase
- `src/lib/config`
  - envs e constantes
- `src/lib/utils`
  - utilitarios, labels, erros e testes unitarios
- `src/lib/services`
  - chamadas HTTP do frontend
- `src/lib/agents`
  - geracao com OpenAI
- `src/lib/instagram`
  - envio de private reply

## Types

- `src/types`
  - contratos principais do dominio

## Documentacao

- `README.md`
- `ARCHITECTURE.md`
- `SECURITY.md`
- `PRODUCT.md`
- `TESTING.md`
- `ROADMAP.md`
- `DECISIONS.md`
- `WEBHOOKS.md`
- `DEPLOY_CHECKLIST.md`
