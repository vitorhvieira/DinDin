# API DinDin

Uma RESTful API desenvolvida oferece funcionalidades abrangentes para gerenciar usuários e transações. Os principais recursos incluem o cadastro e login de usuários, detalhes e edição do perfil do usuário logado, listagem de categorias e transações, além de operações específicas como cadastrar, editar, remover e detalhar transações. A API também suporta a obtenção de extrato de transações e a filtragem de transações por categoria. Essa abordagem permite uma integração eficaz em sistemas que exigem controle de usuários e registros de transações de forma flexível e segura.

## ⚙️ Como executar o projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/).
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

#### 🎲 Rodando o Backend

```bash
# Clone este repositório
$ git clone git@github.com:vitorhvieira/DinDin.git

# Acesse a pasta do projeto no terminal/cmd
$ cd DinDin

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor inciará na porta:3000

# Acesse o Swagger (Documentação da API) em
GET http://localhost:3000
```

#### 🗃️ Variáveis de ambiente

Consulte as variáveis necessárias no arquivo .env.example, e atribua valores de acordo com suas informações pessoais.

## **Banco de dados**

Você precisa criar um Banco de Dados PostgreSQL chamado `dindin` contendo as seguintes tabelas e colunas:  
**ATENÇÃO! Os nomes das tabelas e das colunas a serem criados devem seguir exatamente os nomes listados abaixo.**

- usuarios
  - id
  - nome
  - email (campo único)
  - senha
- categorias
  - id
  - descricao
- transacoes
  - id
  - descricao
  - valor
  - data
  - categoria_id
  - usuario_id
  - tipo

As categorias a seguir precisam ser previamente cadastradas para que sejam listadas no endpoint de listagem das categorias.

## **Categorias**

- Alimentação
- Assinaturas e Serviços
- Casa
- Mercado
- Cuidados Pessoais
- Educação
- Família
- Lazer
- Pets
- Presentes
- Roupas
- Saúde
- Transporte
- Salário
- Vendas
- Outras receitas
- Outras despesas

## 🛣️ Endpoints

### Cadastrar Usuário

#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome 
  - email 
  - senha 

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}
```

### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - email 
  - senha 

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "jose@email.com",
    "senha": "123456"
}
```

### Detalhar Usuário

#### `GET` `/usuario`

Esse endpoint deve mostrar todas as informações (exceto a senha) do usuário logado.

### Atualizar Usuário

#### `PUT` `/usuario`

Esse endpoint deverá atualizar os dados do usuário logado.

- **Requisição** - O corpo (body) deverá possuir um objeto com todas as seguintes propriedades (respeitando estes nomes):

  - nome
  - email
  - senha

#### **Exemplo de requisição**

```javascript
// PUT /usuario
{
    "nome": "José de Abreu",
    "email": "jose_abreu@email.com",
    "senha": "j4321"
}
```

### Listar Categorias

#### `GET` `/categoria`

Esse endpoint deve listar todas as categorias cadastradas no sistema.

### **Listar transações do usuário logado**

#### `GET` `/transacao`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas.  

### **Detalhar uma transação do usuário logado**

#### `GET` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas transações cadastradas.

- **Requisição**  
  Deverá ser enviado o ID da transação no parâmetro de rota do endpoint. 

### **Cadastrar transação para o usuário logado**

#### `POST` `/transacao`

Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.  

- **Requisição**  
  O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - descricao
  - valor
  - data
  - categoria_id
  - tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

#### **Exemplo de requisição**

```javascript
// POST /transacao
{
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "categoria_id": 6
}
```

### **Atualizar transação do usuário logado**

#### `PUT` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas.  

- **Requisição**  
  Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.

  - descricao
  - valor
  - data
  - categoria_id
  - tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

#### **Exemplo de requisição**

```javascript
// PUT /transacao/2
{
	"descricao": "Sapato amarelo",
	"valor": 15800,
	"data": "2022-03-23 12:35:00",
	"categoria_id": 4,
	"tipo": "saida"
}
```  

### Deletar Produto

### **Excluir transação do usuário logado**

#### `DELETE` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.

- **Requisição**  
  Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.

### **Obter extrato de transações**

#### `GET` `/transacao/extrato`

Essa é a rota que será chamada quando o usuario logado quiser obter o extrato de todas as suas transações cadastradas.

### **Filtrar transações por categoria**

Na funcionalidade de listagem de transações do usuário logado (**GET /transacao**), deveremos incluir um parâmetro do tipo query **filtro** para que seja possível consultar apenas transações das categorias informadas.

- **Requisição**  
  Parâmetro opcional do tipo query **filtro**.

#### **Exemplo de requisição**

```javascript
// GET /transacao?filtro[]=roupas&filtro[]=salários
// Sem conteúdo no corpo (body) da requisição
```

---

## 💪 Como contribuir para o projeto

1. Faça um **fork** do projeto.
2. Crie uma nova branch com as suas alterações: `git checkout -b my-feature`
3. Salve as alterações e crie uma mensagem de commit contando o que você fez: `git commit -m "feature: My new feature"`
4. Envie as suas alterações: `git push origin my-feature`

📱 [Entre em contato com o Vitor!](https://www.linkedin.com/in/vitorhvieira/)

###### tags: `back-end` `nodeJS` `API REST` `desafio`
