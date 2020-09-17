# Genoa-Api
Api Rest

Crie a aplicação de forma diferente do solicita, porem respeitando todas as regras de negocio imposta, para que de fato possa mostrar minha habilidades, espero que gostem. Obrigado.

Pontos importantes:

- Knex.js: Query builder reponsavel pela interação com o banco e migrations que seria o vercionamento do banco caso haja alguma alteração na estrutura do banco em ambiente de desenvolvimento.
- Estrutura do banco de dados: Foi elaborada de maneira real de um comportamento de um sistema, onde existe a entidade "User", que representa os usuarios da aplicação, "Clients" que seria os clients, tendo um relacionamento N para N, gerando a tabela de "Contract", que seria o contrato dos clientes.
- Crud "Users": Nao elaborada por conta do tempo disponivel x Prazo de entrega da aplicação, como tinha em mente passar pela ferramenta WebPack para disponibilizar uma pasta de produção. Onde tambem tenho conhecimento

---
<p>Realizar clone da aplicação</p>
## git clone

```sh
git clone https://github.com/Faelst/Genoa-Api.git
```
<p>Apos instalar as dependecias da aplicação</p>

```sh
npm i -g nodemon
npm install
```

<p>apos instalar verifique as configurações knex.js para executar as migrations</p> 

```js
const path = require('path')

module.exports = {
  client: "mysql",
  connection: {
    database: 'genoa_seguros',  // nome do banco 
    host: 'localhost',          // Local
    port: '3306',               // porta
    user: 'root',               // usuario
    password: 'admin'           //  senha
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'DataBase', 'Migrations'),
    tableName: 'knex_migrations'
  },
};
```

<p>Fazendo a alteração execute: </p>


```sh
npx knex migrate:latest
```

- Executando este programa executa todas as migrations definidas na pasta DataBase/Migratons

IMPORTANTE

Apos executar este comando verificar se as tabelas foram criadas e verificar se a tabela users possuem dois registros. Caso ocorra tudo de maneira correta, executa: 

```sh
npm run dev
```

Que ira inicializar a aplicação no endpoint "http://localhost:3030"

As rotas deveram ser solicitadas em http://localhost:3030/genoa_api/v1/  => ROUTERS , que esta expecificadas em ./Routers/Index.js

Estou alocando um link da requisições para ter como base:
<a href="https://documenter.getpostman.com/view/12296849/TVKA3JfQ#d5ef6f19-4a18-4769-8c4f-5802d0a6fa58">Postma Genoa_API</a>