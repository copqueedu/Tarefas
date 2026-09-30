const express = require('express');
require('dotenv').config();

const TarefaRepositorio = require('./infrastructure/TarefaRepositorio');
const CriarTarefa = require('./application/CriarTarefa');
const ListarTarefas = require('./application/ListarTarefas');
const AtualizarTarefa = require('./application/AtualizarTarefa');
const DeletarTarefa = require('./application/DeletarTarefa');


const app = express();
app.use(express.json());
app.use(express.static('public'));

const tarefaRepositorio = new TarefaRepositorio();

app.get('/', (req, res) => {
    res.json({ mensagem: 'API de tarefas funcionando' });
});

app.post('/tarefas', async (req, res) => {
    try{
        const casoDeUso = new CriarTarefa(tarefaRepositorio);
        const tarefa = await casoDeUso.executar(req.body.titulo);
        res.status(201).json(tarefa);
    } catch (erro) {
        res.status(400).json({ erro: erro.message});
    }
    
});

app.get('/tarefas', async (req, res) => {
    const casoDeUso = new ListarTarefas(tarefaRepositorio);
    const tarefas = await casoDeUso.executar();
    res.json(tarefas)
});

app.put('/tarefas/:id', async (req, res) =>{
    try {
        const casoDeUso = new AtualizarTarefa(tarefaRepositorio);
        const tarefa = await casoDeUso.executar(req.params.id, req.body.titulo, req.body.concluida);
        res.json(tarefa);
    }  catch (erro) {
        console.error('ERRO COMPLETO:', erro);
        res.status(400).json({ erro: erro.message });
    }   
});

app.delete('/tarefas/:id', async (req, res) =>{
    try{
        const casoDeUso = new DeletarTarefa(tarefaRepositorio);
        const tarefa = await casoDeUso.executar(req.params.id);
        res.json({ mensagem : 'Tarefa deletada com sucesso', tarefa});
   }   catch (erro) {
    res.status(404).json({ erro: erro.message });
   }
});





const PORTA = process.env.PORTA || 3000;




app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});