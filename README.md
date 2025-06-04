# UEEK

## Checklist de Requisitos

- [x] Landing page responsiva conforme Figma
- [ ] Área administrativa para depoimentos (CRUD)
- [ ] Exportação de leads e usuários
- [x] Tela de login com autenticação
- [x] Processo de recuperação de senha
- [ ] Feedback visual (toast, loading, modais)
- [ ] Validação de formulários (client/server)
- [ ] Filtro/ordenação de depoimentos
- [ ] Acessibilidade (aria-labels, focus states)

## Requisitos do projeto:

Design figma: https://www.figma.com/design/U8QZaSJh3mzgPMmHIpWkQB/LP-Dev?node-id=0-1&p=f&t=aP0EwFO4J5HrmZa1-0

1- Design mobile first
2- Criar uma página interna com uma tabela e um formulário para o
cadastro, edição e exclusão de depoimentos, que devem ser exibidos
na seção dedicada a isto na landing page
3- Tela de login com autenticacao para acessar o formulário interno
4- Processo de recuperacao de senha
5- Adicionar feedback visual (toast, loadings, spinners, modais de confirmacao etc)
6 - Validacao dos campos do formulário (client-side e server-side)
7 - Filtro de ordenazao na listagem de depoimentos
8 - Acessibilidade (aria-labels, focus states, etc)
9 - Área de gestão administrativa para que o dono do projeto possa: Gerenciar os depoimentos cadastrados e exportar leads e usuários que se cadastram no site.

## Requisitos

- Docker
- Docker Compose
- Node.js (para desenvolvimento local)

## Configuração do Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/ueek_test"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta"
```

## Executando o Projeto com Docker

1. **Construir e iniciar os containers:**

   ```bash
   docker compose up -d
   ```

   Este comando irá:

   - Construir a imagem da aplicação
   - Iniciar o container do PostgreSQL
   - Iniciar o container da aplicação
   - Configurar a rede entre os containers

2. **Verificar os logs da aplicação:**

   ```bash
   docker compose logs -f app
   ```

3. **Acessar a aplicação:**
   Abra seu navegador e acesse `http://localhost:3000`

## Comandos Úteis

- **Parar os containers:**

  ```bash
  docker compose down
  ```

- **Reconstruir e reiniciar os containers:**

  ```bash
  docker compose up -d --build
  ```

- **Acessar o shell do container da aplicação:**

  ```bash
  docker compose exec app sh
  ```

- **Executar comandos do Prisma dentro do container:**
  ```bash
  docker compose exec app npx prisma migrate dev
  ```

## Estrutura do Projeto

```
.
├── src/                # Código fonte da aplicação
├── prisma/            # Configurações e migrações do Prisma
├── public/            # Arquivos estáticos
├── docker-compose.yml # Configuração do Docker Compose
└── Dockerfile        # Configuração do container da aplicação
```

## Solução de Problemas

### Porta 5432 já em uso

Se você encontrar o erro "port 5432 is already allocated", significa que você já tem um PostgreSQL rodando localmente. Você tem duas opções:

1. Parar o PostgreSQL local:

   ```bash
   sudo systemctl stop postgresql
   ```

2. Ou alterar a porta no `docker-compose.yml` para usar outra porta (por exemplo, 5433)

### Problemas com o banco de dados

Se precisar resetar o banco de dados:

```bash
docker compose down -v
docker compose up -d
```

## Desenvolvimento

Para desenvolvimento local sem Docker:

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Execute as migrações do Prisma:

   ```bash
   npx prisma migrate dev
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
