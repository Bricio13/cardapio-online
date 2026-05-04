# MenuMaster - Cardápio Digital Profissional

Sistema completo de cardápio online com pedidos via WhatsApp e painel administrativo.

## 🚀 Como Começar

### Painel Administrativo
Para gerenciar produtos, categorias e pedidos, acesse:
**URL:** `https://[sua-url]/admin`

**Credenciais Padrão (Seed):**
- **E-mail:** `admin@restaurante.com`
- **Senha:** `admin123`

## 📋 Funcionalidades Administrativas

### 1. Cadastrar Produtos
- Vá para a seção **Produtos** no menu lateral.
- Clique em **Novo Produto**.
- Preencha o nome, descrição, preço, URL da imagem e selecione a categoria.
- Clique em **Salvar**.

### 2. Alterar Preços
- Vá para a seção **Produtos**.
- Clique no ícone de edição (lápis) ao lado do produto que deseja alterar.
- Atualize o valor no campo **Preço**.
- Clique em **Salvar**.

### 3. Gerenciar Categorias
- Vá para a seção **Categorias**.
- Você pode criar novas categorias (ex: Burgers, Bebidas, Sobremesas) ou editar as existentes.
- A ordem de exibição pode ser definida editando a categoria.

### 4. Configurações do Restaurante
- Acesse **Configurações** para alterar:
    - Nome do restaurante.
    - Logotipo e Banner.
    - Cores do sistema.
    - WhatsApp para recebimento de pedidos.
    - Endereço.

### 5. Gerenciar Pedidos
- Os pedidos realizados pelos clientes aparecem em tempo real na seção **Pedidos**.
- Você pode visualizar os detalhes e alterar o status (Novo, Preparando, Pronto, Entregue).

## 🛠 Tecnologias
- **Frontend:** Next.js, Tailwind CSS, Luciade React, Motion.
- **Backend:** Next.js API Routes.
- **Database:** SQLite com Prisma ORM.

## ⚙️ Instalação Local

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o banco de dados:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```

---
Desenvolvido com ❤️ para restaurantes modernos.
