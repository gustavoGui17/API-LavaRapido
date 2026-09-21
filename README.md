# API Lava Rápido

Backend (REST API) do sistema de lava rápido com app mobile para clientes. Fornece autenticação, cadastro de consumidores, lava rápidos com geolocalização, veículos do cliente, agendamentos e fila de lavagem do lava rápido, com documentação interativa via Swagger.

## Tecnologias

- **Node.js + Express** — servidor e rotas
- **MongoDB + Mongoose** — banco de dados (com geolocalização `2dsphere`)
- **JWT + cookie-parser** — autenticação com token em cookie
- **bcryptjs** — hash de senhas
- **CORS** — liberação de origens configurável
- **swagger-ui-express** — documentação interativa da API

## Instalação

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
SECRET_JWT=uma_chave_secreta_forte
FRONTEND_URL=http://localhost:5173

# WhatsApp (opcional)
# WHATSAPP_ACCESS_TOKEN=
# WHATSAPP_PHONE_NUMBER_ID=
# WHATSAPP_ENABLED=false
# WHATSAPP_COUNTRY_CODE=55
```

> `FRONTEND_URL` aceita múltiplas origens separadas por vírgula. Em ambiente de desenvolvimento, qualquer origem `localhost` é liberada automaticamente.

## Como rodar

```bash
npm run dev    # desenvolvimento (nodemon)
npm start      # produção
```

Por padrão, o servidor roda na porta `3000`.

## Documentação da API

Com o servidor rodando, acesse a documentação interativa (Swagger):

```
http://localhost:3000/doc
```

## 🔗 Endpoints

### Autenticação

| Método | Rota             | Autenticação | Descrição |
|--------|------------------|--------------|-----------|
| POST   | `/auth/login`    | —            | Login e geração do token (cookie) |
| GET    | `/auth/me`       | ✔            | Dados do usuário logado |
| POST   | `/auth/logout`   | —            | Encerra a sessão |

### Usuários e consumidores

| Método  | Rota               | Autenticação | Descrição |
|---------|--------------------|--------------|-----------|
| POST    | `/user/register`   | —            | Cadastro de conta (role sempre `consumidor`) |
| GET     | `/user`            | Admin        | Lista todos os usuários |
| GET     | `/user/:id`        | Admin        | Busca usuário por ID |
| PATCH   | `/user/:id`        | ✔            | Atualiza dados do usuário (dono ou admin) |
| DELETE  | `/user/:id`        | Admin        | Remove um usuário |

### Lava rápidos (Customers)

| Método | Rota                    | Autenticação | Descrição |
|--------|-------------------------|--------------|-----------|
| POST   | `/customers/register`   | Admin        | Cadastra um lava rápido (endereço + localização GeoJSON) |
| GET    | `/customers`            | Admin        | Lista lava rápidos |
| GET    | `/customers/nearby`     | ✔            | Lava rápidos próximos a `latitude`/`longitude` (distância em `distance` km) |
| GET    | `/customers/public/:id` | ✔            | Detalhes públicos de um lava rápido |
| GET    | `/customers/:id`        | Admin        | Busca lava rápido por ID |
| PATCH  | `/customers/:id`        | Admin        | Atualiza lava rápido (aceita `location`) |
| DELETE | `/customers/:id`        | Admin        | Remove um lava rápido |

Parâmetros de `/customers/nearby`: `latitude`, `longitude` (obrigatórios), `maxDistance` (metros, padrão 10000), `limit`, `search`.

### Veículos do consumidor

> Rotas para o cliente do app cadastrar os veículos dele. A localização GeoJSON é `{ "type": "Point", "coordinates": [longitude, latitude] }`.

| Método  | Rota                     | Autenticação | Descrição |
|---------|--------------------------|--------------|-----------|
| POST    | `/veiculo-cliente/register` | ✔         | Cadastra um veículo do consumidor |
| GET     | `/veiculo-cliente`       | ✔            | Lista veículos do consumidor logado |
| GET     | `/veiculo-cliente/:id`   | ✔            | Busca um veículo (somente do dono) |
| PATCH   | `/veiculo-cliente/:id`   | ✔            | Atualiza um veículo |
| DELETE  | `/veiculo-cliente/:id`   | ✔            | Remove um veículo |

### Agendamentos

> Ao criar um agendamento, um **Veículo** é criado automaticamente na fila do lava rápido (vinculado via `veiculoFila`) e aparece na dashboard do dono.

| Método  | Rota                          | Autenticação | Descrição |
|---------|-------------------------------|--------------|-----------|
| POST    | `/agendamentos/register`      | ✔            | Cria agendamento (`lavaRapidoId`, `veiculoId`, `data`, `observacao?`) |
| GET     | `/agendamentos/meus`          | ✔            | Agendamentos do consumidor logado |
| GET     | `/agendamentos/dashboard`     | ✔            | Agendamentos do lava rápido do dono (filtros `status`, `inicio`, `fim`) |
| GET     | `/agendamentos/:id`           | ✔            | Busca agendamento (dono ou consumidor) |
| PATCH   | `/agendamentos/:id`           | ✔            | Atualiza status (`agendado`, `confirmado`, `concluido`, `cancelado`) |
| PATCH   | `/agendamentos/:id/cancelar`  | ✔            | Cancela agendamento |

Status do agendamento → status da fila: `agendado` → `pendente`, `confirmado` → `em atendimento`, `concluido` → `finalizado`.

### Fila de lavagem (Veículo)

| Método  | Rota                     | Autenticação | Descrição |
|---------|--------------------------|--------------|-----------|
| POST    | `/veiculo/register`      | ✔            | Cadastra um veículo/lavagem |
| GET     | `/veiculo`               | ✔            | Lista veículos (cliente vê os dele; admin vê tudo) |
| GET     | `/veiculo/top`           | —            | Veículos em destaque |
| GET     | `/veiculo/search?placa=` | —            | Busca por placa |
| GET     | `/veiculo/byUser`        | ✔            | Veículos do usuário logado |
| GET     | `/veiculo/:id`           | ✔            | Busca veículo por ID |
| PATCH   | `/veiculo/:id`           | ✔            | Atualiza veículo (status, lavagem, etc.) |
| DELETE  | `/veiculo/:id`           | ✔            | Remove veículo |

> **Admin** = usuário com `role: "admin"`. **Dono do lava rápido** = `role: "cliente"` (criado junto com o Customer). **Consumidor do app** = `role: "consumidor"` (criado via `/user/register`).

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
│   ├── services/             # regras de negócio auxiliares
│   └── utils/geo.js          # cálculo de distância (haversine)
```

## Modelos de dados

### Usuário (`User`)
`name`, `email` (único), `password` (hasheada), `role` (`admin` | `cliente` | `consumidor`), `telefone`, `endereco`, `location` (GeoJSON), `veiculos[]`

### Cliente / Lava rápido (`Customer`)
`nome`, `nomeFantasia`, `documento` (único), `documentoTipo` (`cpf` | `cnpj`), `contato`, `endereco`, `location` (GeoJSON, índice `2dsphere` esparso), `diasFuncionamento[]`, `status` (`ativo` | `inativo`)

### Veículo do consumidor (`VeiculoCliente`)
`placa`, `modelo`, `cor`, `ano`, `user` (único por placa)

### Agendamento (`Agendamento`)
`cliente` (User), `lavaRapido` (Customer), `veiculo` (VeiculoCliente), `veiculoFila` (Veiculo criado na fila), `data`, `status` (`agendado` | `confirmado` | `concluido` | `cancelado`), `observacao`

### Veículo / fila de lavagem (`Veiculo`)
`placa`, `modelo`, `cor`, `tipoLavagem` (`simples` | `completa` | `premium`), `nomeCliente`, `contato`, `entryDate`, `finishedAt`, `status` (`pendente` | `em atendimento` | `finalizado`), `usuario`, `customer`, `agendamento?`

## Licença

Este projeto está sob a licença **ISC**.