<<<<<<< HEAD
# API Lava Rápido

Backend (REST API) do sistema de gerenciamento de um lava rápido. Fornece autenticação, cadastro de usuários, clientes e controle de veículos (lavagens), com documentação interativa via Swagger.

## Tecnologias
>>>>>>> 83d55d601e3711981f532fe74c103375e93b06e6

- **Node.js + Express** — servidor e rotas
- **MongoDB + Mongoose** — banco de dados
- **JWT + cookie-parser** — autenticação com token em cookie
- **bcryptjs** — hash de senhas
- **CORS** — liberação de origens configurável
- **swagger-ui-express** — documentação interativa da API

<<<<<<< HEAD
## Instalação
=======

```bash
# clone o repositório
git clone https://github.com/gustavoGui17/API-LavaRapido.git
cd API-LavaRapido

# instale as dependências
npm install
```

### Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>
FRONTEND_URL=http://localhost:5173
```

> `FRONTEND_URL` aceita múltiplas origens separadas por vírgula. Em ambiente de desenvolvimento, qualquer origem `localhost` é liberada automaticamente.

<<<<<<< HEAD
## Como rodar

```bash
npm run dev    # desenvolvimento (nodemon)
npm start      # produção
```

Por padrão, o servidor roda na porta `3000`.

<<<<<<< HEAD
## Documentação da API

Com o servidor rodando, acesse a documentação interativa (Swagger):

```
http://localhost:3000/doc
```

## 🔗 Endpoints

| Método | Rota                | Autenticação | Descrição |
|--------|---------------------|--------------|-----------|
| POST   | `/auth/login`       | —             | Login e geração do token (cookie) |
| GET    | `/auth/me`          | ✔            | Dados do usuário logado |
| POST   | `/auth/logout`      | —             | Encerra a sessão |
| POST   | `/user/register`    | —             | Cadastro de usuário |
| GET    | `/user`             | Admin         | Lista todos os usuários |
| GET    | `/user/:id`         | Admin         | Busca usuário por ID |
| PATCH  | `/user/:id`         | ✔            | Atualiza dados do usuário (dono ou admin) |
| DELETE | `/user/:id`         | Admin         | Remove um usuário |
| POST   | `/customers/register` | Admin       | Cadastra um cliente |
| GET    | `/customers`        | Admin         | Lista clientes |
| GET    | `/customers/:id`    | Admin         | Busca cliente por ID |
| PATCH  | `/customers/:id`    | Admin         | Atualiza cliente |
| DELETE | `/customers/:id`    | Admin         | Remove cliente |
| POST   | `/veiculo/register` | ✔            | Cadastra um veículo/lavagem |
| GET    | `/veiculo`          | ✔            | Lista veículos |
| GET    | `/veiculo/top`      | —             | Veículos em destaque |
| GET    | `/veiculo/search?placa=` | —        | Busca por placa |
| GET    | `/veiculo/byUser`   | ✔            | Veículos do usuário logado |
| GET    | `/veiculo/:id`      | ✔            | Busca veículo por ID |
| PATCH  | `/veiculo/:id`      | ✔            | Atualiza veículo (status, lavagem, etc.) |
| DELETE | `/veiculo/:id`      | ✔            | Remove veículo |

> **Admin** = usuário com `role: "admin"`.

<<<<<<< HEAD
## Estrutura do projeto

```
API-LavaRapido/
├── index.js                  # entrada da aplicação
├── swagger.json              # definição da documentação
├── src/
│   ├── controllers/          # lógica das rotas
│   ├── database/db.js        # conexão com o MongoDB
│   ├── middlewares/          # autenticação, admin, validações
│   ├── models/               # schemas Mongoose
│   ├── routes/               # definição de rotas
│   └── services/             # regras de negócio auxiliares
```

<<<<<<< HEAD
## Modelos de dados

### Usuário (`User`)
`name`, `email` (único), `password` (hasheada), `role` (`admin` | `cliente`), `veiculos[]`

### Cliente (`Customer`)
`nome`, `nomeFantasia`, `documento` (único), `documentoTipo` (`cpf` | `cnpj`), `contato`, `status` (`ativo` | `inativo`)

### Veículo (`Veiculo`)
`placa`, `modelo`, `cor`, `tipoLavagem` (`simples` | `completa` | `premium`), `nomeCliente`, `contato`, `status` (`pendente` | `em atendimento` | `finalizado`), `usuario`, `customer`

<<<<<<< HEAD
## Licença

Este projeto está sob a licença **ISC**.
