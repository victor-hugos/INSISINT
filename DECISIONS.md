# Decisions

## Next.js App Router

### Decisao

Usar Next.js App Router como base do frontend e das APIs.

### Motivo

- acelera o MVP full-stack
- facilita deploy na Vercel
- permite agrupar UI e rotas server-side no mesmo projeto

### Trade-off

- parte da logica de backend fica acoplada ao projeto web

## Supabase

### Decisao

Usar Supabase para auth e banco.

### Motivo

- auth pronta
- Postgres gerenciado
- boa velocidade para MVP
- combina bem com Next.js

### Trade-off

- exige cuidado com RLS, service role e modelagem

## OpenAI

### Decisao

Usar OpenAI para diagnostico, ideias, scripts e calendario.

### Motivo

- reduz tempo de desenvolvimento de uma camada de IA propria
- ajuda a validar valor do produto rapidamente

### Trade-off

- custo por uso
- dependencia externa
- necessidade de observar prompts e qualidade das respostas

## RLS + ownership

### Decisao

Combinar:

- auth real
- checagem de ownership no backend
- RLS no banco

### Motivo

- mais seguranca em camadas
- menos dependencia de dados enviados pelo frontend

### Trade-off

- mais complexidade de implementacao
- necessidade de manter tipagem e policies coerentes

## Area admin por e-mail

### Decisao

Usar `ADMIN_EMAILS` para liberar acessos administrativos iniciais.

### Motivo

- simples para MVP
- rapido de colocar no ar

### Trade-off

- nao escala tao bem quanto roles formais
- precisa evoluir no futuro

## Estrutura por dominio

### Decisao

Organizar `components`, `lib` e `services` por contexto.

### Motivo

- deixa o projeto mais legivel
- reduz bagunca em crescimento rapido

### Trade-off

- exige disciplina para manter padrao nos proximos ciclos
