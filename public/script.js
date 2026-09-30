const API_URL = 'http://localhost:3000';

const els = {
  list: document.getElementById('taskList'),
  empty: document.getElementById('emptyState'),
  form: document.getElementById('addForm'),
  input: document.getElementById('newTitle'),
  addBtn: document.getElementById('addBtn'),
  footer: document.getElementById('footerCount'),
  dot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  errorBanner: document.getElementById('errorBanner'),
  apiUrlText: document.getElementById('apiUrlText'),
};

els.apiUrlText.textContent = API_URL;

function setConnectionState(online) {
    els.dot.className = 'dot ' + (online ? 'online' : 'offline');
    els.statusText.textContent = online
    ? 'conectando a ' + API_URL
    : 'sem conexão com a API';
    els.errorBanner.classList.toggle('visible', !online);
}
function renderTasks(tasks) {
    els.list.innerHTML = '';

    if (!tasks.length) {
        els.empty.style.display = 'block';
        els.footer.textContent = '';
        return;
    }
    els.empty.style.display = 'none';

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'task' + (task.concluida ? 'done' : '');
        li.dataset.id = task.id;

       const checkbox = document.createElement('input');
       checkbox.type = 'checkbox';
       checkbox.className = 'checkbox';
       checkbox.checked = !!task.concluida;
       checkbox.addEventListener('change', () => toggleDone(task, checkbox.checked));

       const body = document.createElement('div');
       body.className = 'task-body';

       const title = document.createElement('div');
       title.className = 'task-title';
       title.textContent = task.titulo;
       title.contentEditable = 'true';
       title.spellcheck = false;
       title.addEventListener('blur', () => saveTitleEdit(task, title));
       title.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {e.preventDefault(); title.blur();}
       });
       const idLabel = document.createElement('div');
       idLabel.className = 'task-id';
       idLabel.textContent = '#' + task.id;

       body.appendChild(title);
       body.appendChild(idLabel);

       const removeBtn = document.createElement('button');
       removeBtn.className = 'remove-btn';
       removeBtn.type = 'button';
       removeBtn.textContent = 'remover';
       removeBtn.addEventListener('click', () => removeTask(task));

       li.appendChild(checkbox);
       li.appendChild(body);
       li.appendChild(removeBtn);
       els.list.appendChild(li);

    });

    const pending = tasks.filter((t) => !t.concluida).length;
    els.footer.textContent = pending === 0
      ? 'Tudo Concluido.'
      : pending + ' de ' + tasks.length + ' tarefa(s) pendentes(s)';

}

async function loadTasks() {
    try { 
        const res = await fetch (API_URL + '/tarefas');
        if (!res.ok) throw new Error ('status' + res.status);
        const tasks = await res.json();
        setConnectionState(true);
        renderTasks(tasks);
    } catch (err) {
        setConnectionState(false);
    }
}
    
async function  addTask(titulo) {
    els.addBtn.disabled = true;
    try {
        const res = await fetch(API_URL + '/tarefas', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({ titulo }), 
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.erro || 'Falha ao criar tarefa');
        }
        els.input.value = '';
        await loadTasks();
    } catch (err) {
      alert(err.message);
    } finally { 
        els.addBtn.disabled = false;  
    }
}

async function toggleDone(task, concluida) {
    try{
        const res = await fetch(API_URL + '/tarefas/' + task.id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({titulo: task.titulo, concluida}),
        });
        if (!res.ok) throw new Error(' Falha ao Atualizar Tarefa');
        await loadTasks();
    }catch(err){
        alert(err.message);
        await loadTasks(); 
    }
}
async function saveTitleEdit(task, el) {
    const novoTitulo = el.textContent.trim();
    if (!novoTitulo) {
        el.textContent = task.titulo;
        return;
    }
    if (novoTitulo === task.titulo) return;

    try {
        const res = await fetch(API_URL + '/tarefas/' + task.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ titulo: novoTitulo, concluida: task.concluida}),
        });
        if (!res.ok) throw new Error('Falha ao renomear Tarefa');
        await loadTasks();
    }catch (err) {
        alert(err.message);
        await loadTasks();
    }
}
async function removeTask(task) {
    try {
        const res = await fetch(API_URL + '/tarefas/' + task.id, {method: 'DELETE'});
        if (!res.ok) throw new Error('Falha ao remover Tarefa');
        await loadTasks();
      } catch (err) {
        alert(err.message);
    }
}
els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = els.input.value.trim();
    if (!titulo) return;
    addTask(titulo);
});

loadTasks();
setInterval(loadTasks, 8000);