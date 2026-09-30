class DeletarTarefa {
    constructor(tarefaRepositorio) {
     this.tarefaRepositorio = tarefaRepositorio;
    }
    async executar(id) {
        const tarefaDeletada = await this.tarefaRepositorio.deletar(id);
        if(!tarefaDeletada) {
            throw new Error('Tarefa não encontrada');
        }
        return tarefaDeletada;
    }
}
module.exports = DeletarTarefa