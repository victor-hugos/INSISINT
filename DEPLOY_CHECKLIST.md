# Deploy Checklist

## Pre-deploy

Antes de subir:

1. confirme que estes comandos passam localmente:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test`
   - `npm run build`
2. rode `supabase/schema.sql` no projeto Supabase de producao
3. se quiser demo pronta, rode `supabase/seed.sql` trocando `SUBSTITUIR_PELO_USER_ID`
4. revise se nao ha credenciais reais commitadas
5. confirme que o fluxo principal funciona localmente:
   - login
   - onboarding
   - ideias
   - plano semanal
   - calendario
   - lembretes
   - dashboard

## Deploy (Vercel)

Fluxo recomendado:

1. subir o repositorio para o GitHub
2. importar o projeto na Vercel
3. cadastrar as envs em `Project Settings > Environment Variables`
4. conferir se a branch de producao e `main`
5. fazer o primeiro deploy
6. se alterar env depois, fazer `Redeploy`

## Variaveis obrigatorias

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAILS`

## Variaveis opcionais para automacao Instagram

- `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `DEMO_PROFILE_ID`

Se a automacao de Instagram nao fizer parte do piloto inicial, deixe esse bloco para depois.

## Supabase Auth

No painel do Supabase, configure em Redirect URLs pelo menos:

- `http://localhost:3000/**`
- `https://SEU-PROJETO.vercel.app/**`
- `https://*-SEU-TIME.vercel.app/**`

Tambem defina o `Site URL` oficial para a URL principal de producao.

## Pos-deploy

Teste nesta ordem:

1. `GET /api/health`
2. signup
3. login
4. logout
5. onboarding
6. gerar ideias
7. aprovar ideias
8. selecionar a semana
9. gerar calendario
10. gerar lembretes
11. abrir dashboard

## Monitoramento

Conferir:

- deploy status na Vercel
- runtime logs
- functions logs
- resposta de `/api/health`

## Logs

Em caso de falha:

1. abra o deployment atual
2. verifique `Runtime Logs`
3. verifique `Functions Logs`
4. confirme o commit do deployment
5. confirme se as envs estao no ambiente correto

## Falhas comuns

1. `NEXT_PUBLIC_SUPABASE_URL` ausente
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` ausente
3. `NEXT_PUBLIC_SITE_URL` apontando para `localhost`
4. Redirect URLs do Supabase erradas
5. deploy antigo ainda sendo aberto
6. schema do Supabase nao aplicado por completo

## Checklist de producao

- auth funcionando
- perfil sendo salvo no usuario correto
- isolamento entre usuarios funcionando
- `api/health` retornando `status: ok`
- dashboard carregando
- leads restritos a admin
- webhook ativo, se fizer parte do ambiente

## Teste de seguranca

1. crie dados com a conta A
2. entre com a conta B
3. tente acessar um `profileId` da conta A
4. confirme bloqueio ou retorno vazio

## O que nao deve travar o deploy do MVP

- automacao de Instagram
- monitor de automacoes
- webhooks externos

O fluxo principal do MVP deve funcionar mesmo sem essa parte configurada.
