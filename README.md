# InstaSocial

Creator Copilot e um MVP para creators, especialistas e pequenos negocios
organizarem conteudo semanal com ajuda de IA.

- Next.js com App Router
- TypeScript
- Supabase
- OpenAI
- Zod

## Rodando localmente

1. Instale as dependencias com `npm install`.
2. Copie `.env.example` para `.env.local` e preencha as chaves.
3. Rode o SQL de `supabase/schema.sql` no seu projeto Supabase.
4. Inicie com `npm run dev`.

## Variaveis do Supabase

O projeto aceita a chave publica do Supabase em um destes nomes:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Se o painel do Supabase te entregou uma `publishable key`, pode usar esse nome novo sem problema.

## Variaveis da automacao do Instagram

Para testar o MVP de gatilho por comentario, configure tambem:

- `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `DEMO_PROFILE_ID`

## Fluxo implementado

- `/onboarding` salva o perfil no Supabase
- `/api/diagnosis` gera um diagnostico com OpenAI
- O resultado fica salvo na tabela `diagnoses`
- `/ideas` gera ideias de conteudo por categoria
- `/api/ideas` salva as ideias na tabela `content_ideas`
- `/scripts` transforma uma ideia em roteiro publicavel
- `/api/scripts` salva o roteiro na tabela `scripts`
- `/calendar` gera um calendario semanal de conteudo
- `/api/calendar` salva o calendario na tabela `content_calendar`
- `/reminders` cria e lista lembretes operacionais
- `/api/reminders` e `/api/reminders/list` persistem e consultam a tabela `reminders`
- `/dashboard` consolida os dados principais do perfil em uma unica visao
- `/api/dashboard` agrega perfil, diagnostico, ideias, roteiros, calendario e lembretes
- `/automation` cadastra regras de comentario por palavra-chave
- `/api/webhooks/instagram` recebe os eventos de comentario do webhook
- `/api/automation/actions/run` executa as respostas privadas pendentes
- `/analytics` mostra os numeros principais de ideias, execucao e automacoes
- `/api/analytics` agrega os contadores principais por perfil

## Fluxo principal do MVP

1. cadastro ou login
2. onboarding do perfil
3. geracao e aprovacao de ideias
4. selecao das ideias da semana
5. geracao do calendario
6. criacao de lembretes
7. acompanhamento no dashboard

## Recursos secundarios

- roteiros
- analytics
- automacao por comentario
- monitor de automacoes

## Demo data

Para acelerar demonstracoes, use `supabase/seed.sql` e troque
`SUBSTITUIR_PELO_USER_ID` por um usuario valido do Supabase Auth.

## Deploy em producao

Stack recomendada:

- frontend e rotas Next.js na Vercel
- banco, auth e storage no Supabase

### Variaveis minimas na Vercel

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Variaveis opcionais para automacao

- `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `DEMO_PROFILE_ID`

### Auth no Supabase

Inclua em Redirect URLs:

- `http://localhost:3000/**`
- `https://seu-projeto.vercel.app/**`
- `https://*-seu-time.vercel.app/**`

Consulte tambem `DEPLOY_CHECKLIST.md` para o roteiro completo de deploy e validacao.

## Piloto comercial

O projeto ja inclui uma base simples para captacao inicial:

- `/pilot` para apresentar a proposta do piloto
- `/pilot/apply` para aplicar ao piloto

Posicionamento sugerido:

> Um copiloto de conteudo com IA para creators e especialistas organizarem
> ideias, semana, calendario e execucao com mais consistencia.
