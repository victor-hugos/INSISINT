# Webhooks

## Visao geral

Hoje o projeto possui uma base inicial de automacao por comentario do Instagram.

O objetivo do fluxo atual e:

1. receber evento de comentario
2. salvar o evento no banco
3. encontrar regra compativel
4. criar acao pendente
5. executar a resposta privada em etapa separada

## Endpoint atual

- `GET /api/webhooks/instagram`
- `POST /api/webhooks/instagram`

Arquivo principal:

- [route.ts](c:/Users/zello/Desktop/INSTASOCIAL/src/app/api/webhooks/instagram/route.ts)

## Eventos recebidos

Hoje o fluxo implementado esta orientado a:

- comentarios do Instagram

O sistema ainda nao possui um fluxo real fechado para:

- mensagens diretas completas
- seguidores
- outros eventos de automacao

## Validacao do webhook

O `GET` do webhook faz a verificacao padrao com:

- `hub.mode`
- `hub.verify_token`
- `hub.challenge`

Configuracao exigida:

- `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`

## Estrutura do payload usada hoje

O handler atual le estas partes do payload:

- `entry`
- `changes`
- `change.value.text`
- `change.value.id`
- `change.value.media.id`
- `change.value.from.id`

Campos extraidos internamente:

- `text`
- `commentId`
- `mediaId`
- `fromId`

## Fluxo interno atual

### Recebimento

1. o webhook recebe o payload
2. resolve o perfil a partir de `DEMO_PROFILE_ID`
3. localiza o dono do perfil em `profiles`

### Persistencia

4. verifica se o comentario ja foi registrado
5. salva em `automation_events`

### Match de regra

6. busca regras ativas em `automation_rules`
7. faz match por palavra-chave no texto do comentario
8. atualiza `matched_rule_id` no evento

### Acao

9. verifica se ja existe acao para o evento
10. cria linha em `automation_actions` com status `pending`

### Execucao

11. o endpoint administrativo `/api/automation/actions/run` processa acoes pendentes
12. usa [send-private-reply.ts](c:/Users/zello/Desktop/INSTASOCIAL/src/lib/instagram/send-private-reply.ts)
13. atualiza o status para:
   - `sent`
   - `failed`

## Regras de automacao

Tabela:

- `automation_rules`

Campos centrais:

- `keyword`
- `reply_message`
- `is_active`

Logica atual:

- o comentario bate na regra se `text.toLowerCase().includes(keyword.toLowerCase())`

## Limites atuais

1. o webhook depende de `DEMO_PROFILE_ID`
2. o fluxo esta em nivel MVP
3. nao existe ainda gerenciamento completo de retries
4. nao existe ainda orquestracao multi-conta mais robusta
5. a implementacao nao deve ser vendida como automacao completa em producao

## Tratamento de erro

### No webhook

- se `DEMO_PROFILE_ID` nao estiver configurado, retorna erro
- se nao localizar o dono do perfil, retorna erro
- eventos invalidos ou incompletos sao ignorados

### Na execucao

- se faltar token do Instagram, retorna erro
- se faltar comentario ou mensagem, marca falha
- falhas de envio atualizam `automation_actions.status = failed`

## Boas praticas recomendadas

1. validar assinatura oficial do webhook quando o fluxo evoluir
2. remover dependencia de `DEMO_PROFILE_ID`
3. registrar mais contexto de erro em `automation_actions`
4. adicionar retries controlados e observabilidade melhor
5. criar testes de integracao para payloads de comentario

## Estado atual

Esta parte do sistema e util para experimentacao e demonstracao tecnica, mas ainda nao deve ser tratada como o coracao comercial do produto.
