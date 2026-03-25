-- Demo seed for MVP presentations.
-- Replace SUBSTITUIR_PELO_USER_ID with a valid auth user id from Supabase Auth.

insert into profiles (
  id,
  user_id,
  niche,
  target_audience,
  goal,
  tone,
  posting_frequency,
  products_services,
  competitors
)
values (
  gen_random_uuid(),
  'SUBSTITUIR_PELO_USER_ID',
  'Marketing para creators',
  'Creators iniciantes e pequenos influenciadores',
  'Crescer com consistencia e vender mais',
  'Estrategico e direto',
  '4x por semana',
  'Mentoria e consultoria de conteudo',
  'Perfis de social media e creators de marketing'
);
