class Tarefa {
    constructor(id, titulo, concluida = false) {
        if (!titulo || titulo.trim() === '') {
            throw new Error('Titulo da tarefa não pode ser vazio')
        }
        this.id = id;
        this.titulo = titulo;
        this.concluida = concluida;

    }
}

module.exports = Tarefa;