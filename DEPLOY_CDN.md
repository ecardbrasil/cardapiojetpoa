# Deploy em CDN (Vercel)

## 1) Subir projeto para Git
1. Criar repositório no GitHub.
2. Na pasta do projeto, rodar:

```bash
git init
git add .
git commit -m "jetpoa menu"
git branch -M main
git remote add origin <URL_DO_REPO>
git push -u origin main
```

## 2) Importar no Vercel
1. Acessar `https://vercel.com/new`.
2. Importar o repositório.
3. Configurar:
- Framework Preset: `Other`
- Build Command: vazio
- Output Directory: `.`
- Install Command: vazio
4. Clicar em `Deploy`.

## 3) Cache de performance
O arquivo `vercel.json` ja esta configurado com:
- HTML: cache curto (60s)
- CSS/JS: cache longo (7 dias)
- Imagens: cache longo (30 dias)

## 4) Validacao pos-deploy
1. Abrir `https://SEU_DOMINIO.vercel.app/`.
2. Abrir `https://SEU_DOMINIO.vercel.app/admin/`.
3. Fazer login admin e alterar um produto.
4. Confirmar mudanca no menu publico.

## 5) Supabase (recomendado)
No Supabase, ajustar URL do projeto:
- Authentication > URL Configuration
- Site URL: `https://SEU_DOMINIO.vercel.app`

## 6) QR Code final
Gerar QR Code apontando para:
- `https://SEU_DOMINIO.vercel.app/`
