const jwt = require("jsonwebtoken");
const pool = require("../conexao");
const bcrypt = require("bcrypt");


async function verificarEmail(email) {
  const verificarEmail = await pool.query(
    "select * from usuarios where email=$1",
    [email]
  );

  return verificarEmail.rows[0];
}

async function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Preencha todos os dados corretamente!" });
  }

  try {
    const emailEncontrado = await verificarEmail(email);

    if (emailEncontrado) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const cadastro = await pool.query(
      "insert into usuarios (nome, email, senha) values ($1,$2,$3) returning *",
      [nome, email, senhaCriptografada]
    );

    return res.status(201).json({
      id: cadastro.rows[0].id,
      nome: cadastro.rows[0].nome,
      email: cadastro.rows[0].email,
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Falha interna do servidor!" });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Preencha todos os dados corretamente!" });
  }

  try {
    const emailEncontrado = await verificarEmail(email);

    if (!emailEncontrado) {
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const verificarSenha = await bcrypt.compare(senha, emailEncontrado.senha);

    if (!verificarSenha) {
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const token = await jwt.sign({ id: emailEncontrado.id }, process.env.JWT_PASS, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      usuario: {
        id: emailEncontrado.id,
        nome: emailEncontrado.nome,
        email: emailEncontrado.email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ mensagem: "Falha interna do servidor!" });
  }
}

function detalharUsuario(req, res) {
  const { ...usuarioLogado } = req.usuario;
  try {
    return res.status(200).json(usuarioLogado);
  } catch (error) {
    return res.status(500).json({ mensagem: "Falha interna do servidor!" });
  }
}

async function atualizarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Preencha todos os dados corretamente!" });
  }

  try {
    const verificarUsuario = await pool.query(
      "select * from usuarios where id=$1",
      [req.usuario.id]
    );

    if (verificarUsuario.rowCount < 1) {
      return res.status(400).json({
        mensagem: "Usuario não encontrado!",
      });
    }

    const emailEncontrado = await verificarEmail(email);

    if (emailEncontrado) {
      return res.status(400).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const atualizar = await pool.query(
      "update usuarios set nome=$1, email=$2, senha=$3 where id=$4",
      [nome, email, senhaCriptografada, req.usuario.id]
    );

    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Falha interna do servidor!" });
  }
}

module.exports = { cadastrarUsuario, login, detalharUsuario, atualizarUsuario };
