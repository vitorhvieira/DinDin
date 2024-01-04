const pool = require("../conexao");

async function cadastraTransacao(req, res) {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id } = req.usuario;

  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return res
      .status(400)
      .json({ mensagem: "Preencha todos os campos corretamente." });
  }

  if (tipo !== "entrada" && tipo !== "saida") {
    return res.status(400).json({ mensagem: "Tipo inválido." });
  }

  try {
    const categoria = await pool.query(
      "select * from categorias where id = $1",
      [categoria_id]
    );

    if (categoria.rowCount === 0) {
      return res.status(404).json({ mensagem: "Categoria inválida." });
    }

    const novaTransacao = await pool.query(
      "insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6) returning *",
      [descricao, valor, data, categoria_id, id, tipo]
    );

    return res.status(201).json(novaTransacao.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

async function listarTransacoes(req, res) {
  const { id } = req.usuario;
  const { filtro } = req.query;

  let queryLike = "";
  let arrayFiltro;
  let queryTransacoes;
  try {
    if (filtro) {
      arrayFiltro = filtro.map((item) => `%${item}%`);
      queryLike += `and c.descricao ilike any($2)`;

      queryTransacoes = await pool.query(
        `select t.*, c.descricao as categoria_nome from transacoes t left join categorias c on t.categoria_id = c.id 
      where t.usuario_id = $1 ${queryLike}`,
        [id, arrayFiltro]
      );
    } else {
      queryTransacoes = await pool.query(
        `select t.*, c.descricao as categoria_nome from transacoes t left join categorias c on t.categoria_id = c.id 
      where t.usuario_id = $1 ${queryLike}`,
        [id]
      );
    }

    if (queryTransacoes.rowCount === 0) {
      return res
        .status(200)
        .json({ mensagem: "Nenhuma transação cadastrada." });
    }

    return res.status(200).json(queryTransacoes.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

async function removerTransacao(req, res) {
  const { id } = req.params;

  try {
    const verificar = await pool.query(
      "select * from transacoes where id=$1 and usuario_id=$2",
      [id, req.usuario.id]
    );

    if (verificar.rowCount < 1) {
      return res.status(400).json({ mensagem: "Transação não encontrada." });
    }

    const remover = await pool.query(
      "delete from transacoes where id=$1 and usuario_id=$2",
      [id, req.usuario.id]
    );

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

async function obterExtratoTransacao(req, res) {
  const { id } = req.usuario;

  try {
    const verificarEntrada = await pool.query(
      "select * from transacoes where tipo='entrada' and usuario_id=$1",
      [id]
    );
    let calculoEntrada = 0;
    let calculoSaida = 0;

    if (verificarEntrada.rowCount > 0) {
      const valoresEntrada = verificarEntrada.rows.map((obj) => {
        return obj.valor;
      });

      calculoEntrada = valoresEntrada.reduce((acumulador, valorAtual) => {
        return acumulador + valorAtual;
      });
    }

    const verificarSaida = await pool.query(
      "select * from transacoes where tipo='saida' and usuario_id=$1",
      [id]
    );

    if (verificarSaida.rowCount > 0) {
      const valoresSaida = verificarSaida.rows.map((obj) => {
        return obj.valor;
      });

      calculoSaida = valoresSaida.reduce((acumulador, valorAtual) => {
        return acumulador + valorAtual;
      });
    }

    res.status(200).json({ entrada: calculoEntrada, saida: calculoSaida });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

async function atualizaTransacao(req, res) {
  const { id: transacao_id } = req.params;
  const { id: usuario_id } = req.usuario;
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return res
      .status(400)
      .json({ mensagem: "Preencha todos os campos corretamente." });
  }

  if (tipo !== "entrada" && tipo !== "saida") {
    return res.status(400).json({ mensagem: "Tipo inválido." });
  }

  try {
    const categoria = await pool.query(
      "select * from categorias where id = $1",
      [categoria_id]
    );

    if (categoria.rowCount === 0) {
      return res.status(404).json({ mensagem: "Categoria inválida." });
    }

    const transacaoUsuario = await pool.query(
      "select * from transacoes where id = $1 and usuario_id = $2",
      [transacao_id, usuario_id]
    );

    if (transacaoUsuario.rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    const transacaoAtualizada = await pool.query(
      "update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6 returning *",
      [descricao, valor, data, categoria_id, tipo, transacao_id]
    );

    return res.status(201).json(transacaoAtualizada.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

async function transacaoPorId(req, res) {
  const { id: transacao_id } = req.params;
  const { id: usuario_id } = req.usuario;

  try {
    const transacaoUsuario = await pool.query(
      "select * from transacoes where id = $1 and usuario_id = $2",
      [transacao_id, usuario_id]
    );

    if (transacaoUsuario.rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    return res.status(200).json(transacaoUsuario.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

module.exports = {
  cadastraTransacao,
  listarTransacoes,
  atualizaTransacao,
  removerTransacao,
  obterExtratoTransacao,
  transacaoPorId,
};
