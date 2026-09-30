const Tarefa = require('../domain/Tarefa');
class CriarTarefa {
    constructor(tarefaRepositorio){
        this.tarefaRepositorio = tarefaRepositorio;
    }

    async executar(titulo) {
        const novaTarefa = new Tarefa(null, titulo);
        return await this.tarefaRepositorio.salvar(novaTarefa);
    }
}

module.exports = CriarTarefa;