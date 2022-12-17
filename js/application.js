let db = firebase.database();
let dbRefUsers = db.ref('users');

function logOut() {
    const logOut = document.querySelector('.log-out');

    if(logOut) {
        logOut.addEventListener('click', () => {
            firebase.auth().signOut();
        });
    }
}

logOut();

function showSearch() {
    const btnSearch = document.querySelector('.btnSearch');
    const searchContainer = document.querySelector('.search-container');

    if(btnSearch) {
        btnSearch.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
        });
    }
}

showSearch();

function addTask() {
    const form = document.querySelector('.form-tarefas');

    if(form) {
        form.onsubmit = (event) => {
            event.preventDefault();
            if(form['inputTarefa'].value != '') {

                let formatTask = form['inputTarefa'].value[0].toUpperCase() + form['inputTarefa'].value.substring(1);

                let data = {
                    status: 'incomplete',
                    name: formatTask
                }
    
                dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then((result) => {
                    form['inputTarefa'].value = '';
                });
            } else {
                alert('O formulário não pode estar vazio');
            }
        }
    }
}

addTask();

function getDefaultTodoList() {
    firebase.auth().onAuthStateChanged((result) => {
        if(result) {
            dbRefUsers.child(result.uid).on('value', (dataSnapshot) => {
                listTasks(dataSnapshot);
            });
        } else {
            hideContent();
        }
    });
}

getDefaultTodoList();

function search() {
    let search = document.getElementById('search');

    if(search) {
        search.onkeyup = () => {

            let searchValue = search.value.length > 0 ? (search.value[0].toUpperCase() + search.value.substring(1)) : '';

            if(searchValue.length > 0) {
                dbRefUsers.child(firebase.auth().currentUser.uid).orderByChild('name').startAt(searchValue).endAt(searchValue + '\uf8ff').once('value').then((dataSnapshot) => {
                    listTasks(dataSnapshot);
                })
            } else {
                getDefaultTodoList();
            }
        }
    }
}

search();

function listTasks(dataSnapshot) {
    let ul = document.querySelector('.lista-tarefas');
    
    if(ul) {
        ul.innerHTML = '';
    
        dataSnapshot.forEach((item) => {
            let value = item.val();
    
            let li = document.createElement('li');
            li.classList.add('tarefa-item');
            li.classList.add(`${value.status}`);
            li.id = `${item.key.substr(0,7)}`;
    
            let checkBox = document.createElement('div');
            checkBox.classList.add('checkbox');
            checkBox.setAttribute('onclick', `changeStatus(${JSON.stringify(item.key)}, ${JSON.stringify(value.status)})`);
    
            let span = document.createElement('span');
            span.appendChild(document.createTextNode(value.name));
    
            let div = document.createElement('div');
            div.classList.add('itemButtonsContainer');
    
            let btnEdit = document.createElement('button');
            btnEdit.type = 'submit';
            btnEdit.id = 'edit';
            btnEdit.setAttribute('onclick', `showTaskEditor(${JSON.stringify(li.id)}, ${JSON.stringify(item.key)})`);
    
            let iconEdit = document.createElement('ion-icon');
            iconEdit.name = 'create-outline';
    
            let btnDelete = document.createElement('button');
            btnDelete.type = 'submit';
            btnDelete.id = 'remove';
    
            let iconDelete = document.createElement('ion-icon');
            iconDelete.name = 'trash-outline';
            iconDelete.setAttribute('onclick', `removeTask(${JSON.stringify(item.key)})`);
    
            btnEdit.appendChild(iconEdit);
            btnDelete.appendChild(iconDelete);
    
            div.appendChild(btnEdit);
            div.appendChild(btnDelete);
            
            li.appendChild(checkBox);
            li.appendChild(span);
            li.appendChild(div);
            
            ul.appendChild(li);
        });
    }
}

function showTaskEditor(id, key) {
    const span = document.querySelector(`#${id} span`);

    if(!span.classList.contains('edit')) {
        span.classList.add('edit');

        const inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.placeholder = 'Editar Tarefa';
        inputText.value = span.innerText;
        inputText.classList.add('editTask');
    
        const form = document.createElement('form');
        form.appendChild(inputText);
        form.setAttribute('onsubmit', `editTask(${JSON.stringify(id)}, ${JSON.stringify(key)})`);

        span.innerHTML = '';
        span.appendChild(form);
    }
}

function editTask(id, key) {
    event.preventDefault();
    const span = document.querySelector(`#${id} span`);
    const inputText = document.querySelector(`#${id} span input`);

    if(inputText.value != '') {
        let data = {
            name: inputText.value
        }

        span.classList.remove('edit');
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data);
    }
}

function removeTask(key) {
    const win = document.querySelector('.js-remove-task');
    const btnRemove = document.querySelector('.remove-task-wrapper div input:first-child');
    const btnCancel = document.querySelector('.remove-task-wrapper div input:last-child');

    win.classList.add('active');

    btnRemove.addEventListener('click', () => {
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove();
        win.classList.remove('active');
    });

    btnCancel.addEventListener('click', () => {
        win.classList.remove('active');
    });
}

function changeStatus(key, status) {
    if(status === 'incomplete') {
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update({status: 'complete'})
    } else {
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update({status: 'incomplete'})
    }
}

function hideContent() {
    const section = document.querySelector('.application-container');
    
    if(section) {
        let span = document.createElement('span');
        span.innerText = 'Faça login para ter acesso ao conteúdo';
        span.classList.add('msg_usuario_deslogado');
        
        section.innerHTML = '';
        
        section.appendChild(span);
    }
}