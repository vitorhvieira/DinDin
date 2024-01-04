const pool = require("../conexao");

async function listarCategorias(req, res) {
    const categorias = await pool.query('select * from categorias');

    return res.status(200).json(categorias.rows);
}

module.exports = {
    listarCategorias
}