# Instruções do Projeto

## Projeto
Cardápio digital da **Jetpoa Beach Club**, com foco em carregamento muito rápido no celular, navegação simples e fácil manutenção de itens e preços.

## Objetivo principal
Entregar uma experiência mobile extremamente leve para clientes acessando via QR Code no local.

## Metas de performance
- Primeira carga ideal abaixo de **500 KB** (meta agressiva: abaixo de 300 KB quando possível).
- Métricas alvo no mobile:
  - **LCP < 2.5s**
  - **CLS < 0.1**
  - **INP dentro de faixa boa**
- Funcionar bem em redes 4G instáveis.

## Diretrizes técnicas
- Implementação inicial em **site estático** (HTML, CSS e JS mínimo).
- Evitar dependências pesadas e bibliotecas desnecessárias.
- Priorizar renderização rápida com conteúdo essencial no topo.
- Habilitar compressão e cache de assets estáticos.

## Diretrizes de conteúdo
- Estrutura por categorias (ex.: Drinks, Comidas, Combos, Sobremesas).
- Cada item deve conter:
  - Nome
  - Descrição curta
  - Preço
- Texto direto e legível em tela pequena.

## Imagens e mídia
- Preferir **WebP/AVIF**.
- Redimensionar para uso real em mobile (evitar imagens muito grandes).
- Aplicar compressão otimizada.
- Usar carregamento tardio (`lazy`) em imagens fora da primeira tela.

## UX mobile
- Interface limpa, sem excesso de animações.
- Botões de ação rápidos (ex.: WhatsApp, chamar atendimento).
- Tamanho de fonte e contraste adequados para uso ao ar livre.

## Publicação
- Hospedagem recomendada em CDN (ex.: Cloudflare Pages, Vercel ou Netlify).
- URL curta para QR Code.
- Atualizações simples de conteúdo sem quebrar layout.

## Escopo da primeira versão (MVP)
1. Página única com categorias e itens.
2. Layout totalmente responsivo para smartphone.
3. Performance otimizada desde o início.
4. Estrutura preparada para expansão futura.

## Próximos passos
1. Definir identidade visual base (cores, tipografia e estilo fotográfico).
2. Montar estrutura HTML semântica do cardápio.
3. Implementar CSS responsivo leve.
4. Incluir dados iniciais dos produtos.
5. Rodar auditoria Lighthouse e ajustar gargalos.

## Plano em partes pequenas
### Fase 1 - Base pública do cardápio (rápida)
1. Criar estrutura inicial dos arquivos (`index.html`, `styles.css`, `script.js`).
2. Montar layout mobile-first com foco em leitura rápida.
3. Cadastrar categorias e produtos iniciais em JSON local.
4. Validar performance da primeira carga.

### Fase 2 - Dashboard admin (manual)
1. Criar tela administrativa separada (`/admin`) com login simples.
2. Implementar cadastro/edição de produtos.
3. Adicionar controle manual de estoque (`em_estoque` ligado/desligado).
4. Garantir que o menu público mostre apenas itens disponíveis.

### Fase 3 - Publicação e operação
1. Publicar em hospedagem com CDN.
2. Configurar cache para menu público e atualização rápida de estoque.
3. Gerar QR Code final.
4. Fazer checklist final de qualidade e performance.

## Checklist vivo do projeto
Instrução de uso: atualizar este checklist a cada avanço, mudando `[ ]` para `[x]` e adicionando data quando necessário.

### Bloco A - Planejamento
- [x] Documento inicial do projeto criado.
- [ ] Identidade visual definida (cores, fonte, estilo).
- [ ] Estrutura final de categorias aprovada.

### Bloco B - Menu público
- [x] Arquivos base criados (`index.html`, `styles.css`, `script.js`).
- [x] Layout mobile-first implementado.
- [x] Produtos de exemplo cadastrados.
- [ ] Teste de usabilidade em celular realizado.
- [ ] Performance alvo validada no Lighthouse.

### Bloco C - Dashboard admin
- [x] Estrutura `/admin` criada.
- [x] Login administrativo implementado.
- [x] CRUD de produtos funcionando.
- [x] Campo `em_estoque` funcionando.
- [x] Integração admin -> menu público validada.
- [x] Estrutura SQL base para Supabase criada.
- [x] Integração frontend com Supabase implementada.

### Bloco D - Publicação
- [x] Deploy em CDN concluído.
- [x] Cache configurado.
- [ ] QR Code gerado e testado.
- [ ] Revisão final de conteúdo e preços feita.

## Regra de atualização do checklist
Sempre que concluirmos uma tarefa:
1. Marcar o item correspondente como `[x]`.
2. Se necessário, adicionar observação curta (ex.: data, decisão tomada, bloqueio).
3. Incluir novas tarefas caso surjam demandas fora do escopo inicial.
