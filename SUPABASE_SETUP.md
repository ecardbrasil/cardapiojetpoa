# Setup Supabase (Jetpoa)

## 1) Criar projeto
1. Criar um projeto no Supabase.
2. Abrir SQL Editor.

## 2) Criar estrutura do banco
Executar nesta ordem:
1. `supabase/schema.sql`
2. `supabase/policies.sql`
3. `supabase/seed.sql` (opcional, apenas dados iniciais)

## 3) Criar usuario admin (obrigatorio)
1. Acessar `Authentication > Users`.
2. Criar usuario com e-mail e senha.
3. Esse e-mail/senha sera usado no login de `admin/index.html`.

## 4) Campos da tabela `products`
- `id` (uuid)
- `category` (text)
- `name` (text)
- `description` (text)
- `price` (integer)
- `ativo` (boolean)
- `em_estoque` (boolean)
- `image_url` (text)
- `ordem` (integer)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## 5) Regras aplicadas
- Menu publico (anon): so le itens `ativo = true` e `em_estoque = true`.
- Admin autenticado: leitura e escrita completas.

## 6) Integracao atual do front
- Publico (`index.html`): le do Supabase e usa fallback local se der erro.
- Admin (`admin/index.html`): login com Supabase Auth + CRUD na tabela `products`.

## 7) Arquivo de configuracao
Preencher em `supabase-config.js`:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

## 8) Observacao importante
A chave publishable pode ficar no frontend. Nunca exponha `service_role` no cliente.
