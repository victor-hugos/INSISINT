# INSISINT

INSISINT e um copiloto de operacao de conteudo com IA para creators, especialistas e pequenos negocios que precisam transformar ideias soltas em um fluxo semanal claro.

## Visao Geral

O produto combina planejamento, execucao e acompanhamento em um unico fluxo:

1. cadastro e login
2. onboarding do perfil
3. diagnostico inicial
4. geracao e aprovacao de ideias
5. selecao das ideias da semana
6. geracao de calendario
7. criacao de lembretes
8. acompanhamento no dashboard

## Publico-alvo

- creators iniciantes
- especialistas que usam conteudo para autoridade
- autonomos e pequenos negocios
- perfis que precisam de mais consistencia operacional

## Problema que resolve

INSISINT ajuda quem:

- trava na hora de decidir o que postar
- acumula ideias sem executar
- nao consegue organizar a semana de conteudo
- precisa de um fluxo mais consistente de planejamento e execucao

## Resultado prometido

- mais clareza sobre o que publicar
- mais organizacao da rotina
- menos improviso
- mais consistencia operacional

## Como funciona

### Fluxo principal do usuario

1. o usuario cria conta ou faz login
2. preenche o onboarding com nicho, publico, objetivo e tom
3. recebe um diagnostico inicial
4. gera ideias alinhadas ao perfil
5. aprova o que faz sentido
6. escolhe as ideias da semana
7. transforma isso em calendario
8. gera lembretes de execucao
9. acompanha progresso no dashboard

## Principais funcionalidades

- autenticacao real com Supabase Auth
- onboarding por perfil
- diagnostico inicial com OpenAI
- geracao de ideias por categoria
- aprovacao e rejeicao de ideias
- geracao de roteiros
- plano semanal
- calendario de conteudo
- lembretes operacionais
- dashboard consolidado
- analytics basico
- landing de piloto e captacao de leads
- automacao inicial por comentario do Instagram

## Fluxo do usuario

### Fluxo principal

1. `/signup` ou `/login`
2. `/onboarding`
3. `/ideas`
4. `/weekly-plan`
5. `/calendar`
6. `/reminders`
7. `/dashboard`

### Fluxos secundarios

- `/scripts`
- `/analytics`
- `/automation`
- `/automation/monitor`
- `/pilot`
- `/pilot/leads`

## Stack

- Next.js App Router
- TypeScript
- React
- Supabase
- OpenAI
- Zod
- Vitest

## Setup local

1. instale as dependencias com `npm install`
2. copie `.env.example` para `.env.local`
3. preencha as variaveis de ambiente
4. rode `supabase/schema.sql` no projeto Supabase
5. opcionalmente rode `supabase/seed.sql`
6. inicie com `npm run dev`

## Variaveis de ambiente

### Publicas

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Privadas

- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `ADMIN_EMAILS`

### Opcionais para automacao Instagram

- `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `DEMO_PROFILE_ID`

## Deploy

Stack recomendada:

- Vercel para frontend e rotas Next.js
- Supabase para banco, auth e storage

Checklist resumido:

1. configurar envs na Vercel
2. configurar Redirect URLs no Supabase Auth
3. rodar `supabase/schema.sql`
4. validar `GET /api/health`
5. testar login, onboarding e fluxo principal

Consulte [DEPLOY_CHECKLIST.md](c:/Users/zello/Desktop/INSTASOCIAL/DEPLOY_CHECKLIST.md) para o roteiro detalhado.

## Testes

Comandos principais:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

Hoje a cobertura automatizada esta concentrada nos utilitarios centrais. O proximo passo recomendado e ampliar testes de API e fluxo E2E.

## Status do produto

Estado atual:

- MVP funcional
- pronto para demo e pilotos
- nao deve ser tratado ainda como plataforma enterprise

## Roadmap

### Curto prazo

- ampliar testes
- melhorar estados de UX
- evoluir documentacao tecnica
- refinar pipeline comercial

### Medio prazo

- migracoes versionadas
- amadurecimento de roles administrativas
- evolucao do CRM de leads
- integracoes mais robustas

### Longo prazo

- SaaS mais completo
- automacoes mais profundas
- IA mais contextual
- operacao multiusuario mais madura
