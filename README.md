# Portfólio de Escritor Infantil — Silmar Vasconcelos

Protótipo funcional, responsivo e sem framework obrigatório.

## Estrutura
- `index.html` — página principal
- `css/style.css` — identidade visual e responsividade
- `js/config.js` — WhatsApp, endpoint do formulário e PIX
- `js/books.js` — catálogo dos livros
- `js/app.js` — interações, modal, carrinho, pedidos e formulário
- `admin.html` — gerador simples de cadastro para novos livros
- `Code.gs` — backend opcional Google Apps Script + Google Sheets

## Antes de publicar
1. Coloque as capas em `assets/images/`.
2. Em `js/books.js`, preencha `cover` com o caminho real da imagem.
3. Edite `js/config.js` e coloque seu WhatsApp.
4. Substitua os blocos “SEU QR CODE PIX” por sua imagem de QR Code.
5. Substitua os placeholders de vídeo por embeds do YouTube/Vimeo ou MP4.
6. Configure o Google Apps Script usando `Code.gs` e cole a URL `/exec` em `leadEndpoint`.
7. Crie uma Política de Privacidade antes de coletar dados em produção.
8. Revise preços, faixas etárias, frete e textos editoriais.

## Como adicionar livro
Você pode:
- editar diretamente o array de `js/books.js`, ou
- abrir `admin.html`, preencher o formulário e copiar o bloco gerado para `js/books.js`.

## Evolução recomendada
Fase 2: Supabase ou Firebase para login administrativo, cadastro de livros sem editar código, upload de imagens, pedidos e estoque.
Fase 3: cálculo de frete, cupons, automação de PIX/cartão via gateway e e-mails transacionais.

## Hospedagem
Funciona em GitHub Pages, Netlify, Vercel ou hospedagem tradicional.

## Observação
O QR Code no protótipo é apenas um espaço visual e não realiza pagamento.


## Regra de frete
O carrinho está configurado com **frete fixo de R$ 10,00 por pedido**.
O valor é somado automaticamente ao subtotal dos livros e gravado separadamente na planilha.
