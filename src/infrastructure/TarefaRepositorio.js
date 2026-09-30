const pool = require('./conexaoBanco');

class TarefaRepositorio {
    async salvar(tarefa){
        const resultado = await pool.query(
            'INSERT INTO tarefas (titulo, concluida) VALUES ($1, $2) RETURNING *',
            [tarefa.titulo, tarefa.concluida]
        );
        return resultado.rows[0];
    }
    async listarTodas() {
        const resultado = await pool.query('SELECT * FROM tarefas ORDER BY id');
        return resultado.rows;
    }
    async atualizar(id, dadosAtualizados) {
        const resultado = await pool.query(
            'UPDATE tarefas SET titulo = $1, concluida = $2 WHERE id = $3 RETURNING *',
            [dadosAtualizados.titulo, dadosAtualizados.concluida, id]
        );
        return resultado.rows[0];
    }
    async deletar(id) {
        const resultado = await pool.query(
            'DELETE FROM tarefas Where id = $1 RETURNING *',
            [id]
        );
        return resultado.rows[0]
}
}

module.exports = TarefaRepositorio;