# Security

## Autenticacao

INSISINT usa Supabase Auth como base de autenticacao.

### Componentes principais

- `src/components/auth/auth-provider.tsx`
- `src/lib/auth/server-auth.ts`
- `src/lib/db/supabase-user-client.ts`

### Fluxo atual

1. o usuario autentica via Supabase no browser
2. a sessao e lida no cliente e no servidor
3. rotas protegidas consultam o usuario autenticado no servidor

## RLS (Row Level Security)

RLS esta habilitado nas tabelas principais da aplicacao, incluindo:

- `profiles`
- `diagnoses`
- `content_ideas`
- `scripts`
- `content_calendar`
- `reminders`
- `weekly_plan_ideas`
- `automation_rules`
- `automation_events`
- `automation_actions`
- `pilot_leads`

### Regra principal aplicada

Na maior parte das tabelas, o acesso e condicionado a:

- `auth.uid()::text = user_id`

### Beneficio

Mesmo que alguma rota esqueça parte da validacao, o banco ainda ajuda a proteger o acesso por linha.

### Risco atual

`user_id` ainda esta modelado como `text`, nao `uuid`.

Isso gera:

- necessidade de cast nas policies
- maior chance de inconsistencias
- menor elegancia na modelagem

## Ownership e autorizacao

### O que esta implementado

- `requireAuthenticatedUser`
- `requireProfileOwnership`
- `requireAdminUser`

### O que isso protege

- acesso a dados do proprio usuario
- acesso apenas aos perfis do proprio usuario
- acesso administrativo restrito ao painel de leads e acoes administrativas

## Uso de service role

### Onde faz sentido hoje

- leitura e escrita operacional privilegiada
- webhook do Instagram
- execucao administrativa de acoes pendentes
- operacoes que nao devem depender da sessao do usuario final

### Onde nao deveria ser usado

- leitura comum de dados do proprio usuario
- atualizacoes normais de perfil, ideias, calendario e lembretes quando a sessao do usuario esta disponivel

### Estado atual

As rotas normais mais importantes ja usam client autenticado do usuario onde faz sentido.

## Protecao de rotas

### Frontend

- `AuthGuard` protege as paginas que exigem sessao

### Backend

- rotas server-side usam autenticacao e ownership

## Variaveis sensiveis

### Nao podem ir para o client

- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `INSTAGRAM_ACCESS_TOKEN`

### Publicas e seguras para browser

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Boas praticas implementadas

1. sessao real com Supabase Auth
2. ownership no backend
3. RLS nas tabelas principais
4. camada admin para areas sensiveis
5. health-check de ambiente
6. separacao entre client do usuario e client administrativo

## Pendencias de seguranca

1. migrar `user_id` para `uuid`
2. formalizar role admin em banco ou tabela propria
3. auditar funcoes `SECURITY DEFINER` no Supabase
4. ampliar testes de autorizacao e isolamento entre usuarios
5. revisar periodicamente chaves expostas e rotacionar segredos quando necessario

## Recomendacao pratica

As proximas evolucoes de seguranca mais valiosas sao:

1. testes de isolamento entre usuarios
2. migracao de `user_id`
3. papel admin mais formal
