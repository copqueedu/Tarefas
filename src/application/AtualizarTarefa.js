class AtualizarTarefa {
    constructor(tarefaRepositorio){
        this.tarefaRepositorio = tarefaRepositorio;
    }
    async executar(id, titulo, concluida){
        if (!titulo || titulo.trim() === ''){
            throw new Error('Titulo da tarefa não pode ser vazio');
        }
        const tarefaAtualizada = await this.tarefaRepositorio.atualizar(id, {titulo, concluida});
        if (!tarefaAtualizada){
            throw new Error('Tarefa não encontrada');
        }
        return tarefaAtualizada
    }
}

module.exports = AtualizarTarefa;