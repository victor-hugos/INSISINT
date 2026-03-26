# Testing

## Tipos de testes

### Unitarios

Cobrem utilitarios e regras pequenas:

- datas
- labels
- calculos simples

### Integracao

Devem cobrir:

- APIs
- autorizacao
- ownership por perfil
- agregacoes de dashboard

### E2E

Devem cobrir o fluxo principal do produto em ambiente parecido com producao.

## O que ja existe

Hoje existem testes unitarios com Vitest para:

- `week-key`
- `labels`
- `calendar-reminder-time`

Comando atual:

- `npm run test`

Tambem fazem parte do criterio tecnico minimo:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## O que precisa ser testado

### Auth

- signup
- login
- logout
- sessao persistida
- bloqueio de paginas protegidas

### Criacao de conteudo

- onboarding
- geracao de diagnostico
- geracao de ideias
- aprovacao e rejeicao
- criacao de roteiro

### Planejamento

- selecao semanal
- calendario
- lembretes automativos do calendario
- lembrete manual

### Execucao

- conclusao de lembrete
- progresso semanal
- dashboard consolidado

### Seguranca

- isolamento entre usuarios
- acesso indevido por `profileId`
- restricao admin no painel de leads

### Comercial

- envio da aplicacao do piloto
- listagem de leads para admin
- atualizacao de status

## Como rodar testes

### Basico

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

## Recomendacao de evolucao

### Curto prazo

1. criar testes de API para:
   - onboarding
   - ideas
   - weekly plan
   - reminders
   - dashboard

### Medio prazo

2. adicionar E2E para o fluxo principal:
   - login
   - onboarding
   - gerar ideias
   - aprovar
   - selecionar semana
   - gerar calendario
   - gerar lembretes
   - abrir dashboard

### Boas praticas

1. nao aceitar deploy sem:
   - typecheck
   - lint
   - test
   - build
2. testar isolamento entre usuarios sempre que mexer em auth ou ownership
