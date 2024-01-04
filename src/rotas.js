const express = require("express");
const {
  cadastrarUsuario,
  login,
  detalharUsuario,
  atualizarUsuario,
} = require("./controladores/usuario");
const { autenticaUsuario } = require("./middleware/autenticacao");
const {
  cadastraTransacao,
  listarTransacoes,
  atualizaTransacao,
  removerTransacao,
  obterExtratoTransacao,
  transacaoPorId,
} = require("./controladores/transacoes");
const { listarCategorias } = require("./controladores/categorias");

const rotas = express();

rotas.post("/usuario", cadastrarUsuario);
rotas.post("/login", login);

rotas.use(autenticaUsuario);

rotas.get("/categoria", listarCategorias);
rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", atualizarUsuario);
rotas.post("/transacao", cadastraTransacao);
rotas.get("/transacao/extrato", obterExtratoTransacao);
rotas.get("/transacao/", listarTransacoes);
rotas.delete("/transacao/:id", removerTransacao);
rotas.put("/transacao/:id", atualizaTransacao);
rotas.get('/transacao/:id', transacaoPorId);

module.exports = rotas;
