# Deploy Checklist

## 1. Antes de subir

- confirme que `npm run typecheck`, `npm run lint` e `npm run build` passam localmente
- rode `supabase/schema.sql` no projeto Supabase de producao
- se quiser demo pronta, rode `supabase/seed.sql` trocando `SUBSTITUIR_PELO_USER_ID`
- revise se nao ha credenciais reais commitadas

## 2. Variaveis obrigatorias na Vercel

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 3. Variaveis opcionais para automacao Instagram

- `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `DEMO_PROFILE_ID`

Se a automacao de Instagram nao fizer parte do piloto inicial, deixe esse bloco para depois.

## 4. Supabase Auth

No painel do Supabase, configure em Redirect URLs pelo menos:

- `http://localhost:3000/**`
- `https://SEU-PROJETO.vercel.app/**`
- `https://*-SEU-TIME.vercel.app/**`

E defina o `SITE_URL` oficial para a URL principal de producao.

## 5. Vercel

Fluxo recomendado:

1. subir o projeto para GitHub
2. importar o repositorio na Vercel
3. cadastrar as envs em Project Settings > Environment Variables
4. fazer o primeiro deploy de Production

## 6. Validacao em producao

Teste nesta ordem:

1. signup
2. login
3. logout
4. onboarding
5. gerar ideias
6. aprovar ideias
7. selecionar a semana
8. gerar calendario
9. gerar lembretes
10. abrir dashboard

## 7. Teste de seguranca

1. crie dados com a conta A
2. entre com a conta B
3. tente acessar um `profileId` da conta A
4. confirme bloqueio ou retorno vazio

## 8. O que nao deve travar o deploy do MVP

- automacao de Instagram
- monitor de automacoes
- webhooks externos

O fluxo principal do MVP deve funcionar mesmo sem essa parte configurada.
