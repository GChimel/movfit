# UEEK - Teste técnico

Teste técnico para vaga de desenvolvedor junior 2 - Gustavo Chimel

## Pré-requisitos

- Node.js 20.x ou superior
- npm ou yarn
- Docker e Docker Compose (opcional)

## Instalação e Execução

### Opção 1: Usando Docker (Recomendado)

1. Clone o repositório:

```bash
git clone https://github.com/GChimel/ueek
cd ueek
```

2. As variáveis de ambiente já estão configuradas no arquivo `docker-compose.yml`. Se necessário, você pode modificar os seguintes valores:

```yaml
environment:
  - DATABASE_URL=postgresql://postgres:postgres@db:5432/ueek_test
  - NODE_ENV=production
  - NEXTAUTH_URL=http://localhost:3000
  - NEXTAUTH_SECRET=your-secret-key-here
  - HOSTNAME=0.0.0.0
  - EMAIL_JS_SERVICE_ID=service_exemple
  - EMAIL_JS_TEMPLATE_ID=template_example
  - EMAIL_JS_USER_ID=user_example
  - EMAIL_JS_ACCESS_TOKEN=access_example
```

3. Inicie a aplicação com Docker Compose:

```bash
docker compose up -d
```

A aplicação estará disponível em `http://localhost:3000`

### Opção 2: Instalação Local (Sem Docker)

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITÓRIO]
cd ueek
```

2. Instale o PostgreSQL 16.x em sua máquina

   - [Guia de instalação do PostgreSQL](https://www.postgresql.org/download/)

3. Crie o banco de dados:

```bash
createdb ueek_test
```

4. Configure o arquivo `.env` na raiz do projeto:

```env
# Configurações do Banco de Dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ueek_test"

# Configurações do NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# Configurações do EmailJS
EMAIL_JS_SERVICE_ID="seu-service-id"
EMAIL_JS_TEMPLATE_ID="seu-template-id"
EMAIL_JS_USER_ID="seu-user-id"
EMAIL_JS_ACCESS_TOKEN="seu-access-token"

# Configurações do Next.js
NODE_ENV="development"
```

5. Instale as dependências do projeto:

```bash
npm install
```

6. Execute as migrações do Prisma:

```bash
npx prisma migrate deploy
```

7. Gere o cliente Prisma:

```bash
npx prisma generate
```

8. Execute o seed do banco de dados:

```bash
npx prisma db seed
```

9. Inicie a aplicação:

```bash
# Para desenvolvimento
npm run dev

# Para produção
npm run build
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Variáveis de Ambiente

### Configurações do Banco de Dados

- `DATABASE_URL`: URL de conexão com o PostgreSQL
  - Com Docker: `postgresql://postgres:postgres@db:5432/ueek_test`
  - Sem Docker: `postgresql://postgres:postgres@localhost:5432/ueek_test`

### Configurações do NextAuth

- `NEXTAUTH_URL`: URL base da aplicação (ex: `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Chave secreta para criptografia (gerar com `openssl rand -base64 32`)

### Configurações do EmailJS

É o provedor que utilizei para realizar o envio de e-mail para redefinir a senha do usuário. Para poupar tempo enviei juntamente do link desse repositório um arquivo TXT com as chaves para você utilizarem nesse teste. Não precisa se preocupar, criei uma conta nova para isso!

- `EMAIL_JS_SERVICE_ID`: ID do serviço do EmailJS
- `EMAIL_JS_TEMPLATE_ID`: ID do template do EmailJS
- `EMAIL_JS_USER_ID`: ID do usuário do EmailJS
- `EMAIL_JS_ACCESS_TOKEN`: Token de acesso do EmailJS

### Configurações do Next.js

- `NODE_ENV`: Ambiente de execução (`development` ou `production`)
- `HOSTNAME`: Hostname da aplicação (com Docker: `0.0.0.0`, sem Docker: não necessário)

## Credenciais de Acesso

Após executar o seed, você pode acessar o sistema como `administrador - dono da página` as seguintes credenciais:

- Email: admin@ueek.com
- Senha: admin123

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila a aplicação para produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa a verificação de código
- `npx prisma studio` - Abre o Prisma Studio para gerenciar o banco de dados

## Comandos Docker Úteis

- `docker compose up -d` - Inicia a aplicação em background
- `docker compose down` - Para a aplicação
- `docker compose down -v` - Para a aplicação e remove os volumes
- `docker compose logs` - Visualiza os logs da aplicação
- `docker compose logs -f` - Visualiza os logs em tempo real

## Tecnologias Utilizadas

- Next.js 15.3.3
- Prisma 6.8.2
- PostgreSQL 16
- TypeScript
- TailwindCSS
- NextAuth.js
