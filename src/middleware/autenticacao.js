const jwt = require("jsonwebtoken");
const pool = require("../conexao");

async function autenticaUsuario(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "Não autorizado." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_PASS);

    const usuario = await pool.query("select id, nome, email from usuarios where id = $1", [
      id,
    ]);

    if (usuario.rowCount === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    req.usuario = usuario.rows[0];

    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        mensagem:
          "Para acessar este recurso um token de autenticação válido deve ser enviado.",
      });
  }
}

module.exports = {
  autenticaUsuario,
};
