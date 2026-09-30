class ListarTarefas{
    constructor(tarefaRepositorio){
        this.tarefaRepositorio = tarefaRepositorio;
    }
    async executar(){
        return await this.tarefaRepositorio.listarTodas()
    }
}
module.exports = ListarTarefas;