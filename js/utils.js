const login = document.querySelector('.conectar');
const register = document.querySelector('.register');

function switchForm() {
    if(login.classList.contains('conectar')) {
        login.classList.replace('conectar', 'registrar');

        register.innerHTML = `Já possui uma conta? <a href="#" onclick="switchForm()">Clique aqui</a>`;
    } else {
        login.classList.replace('registrar', 'conectar');

        register.innerHTML = `Não possui uma conta? <a href="#" onclick="switchForm()">Clique aqui</a>`;
    }
}

function mensage(msg='', classe='', time=5000) {
    const mensage = document.querySelector('.mensage');

    mensage.innerHTML = msg;
    mensage.classList.add('active');
    mensage.classList.add(classe);

    if(mensage.classList.contains('active')) {
        setInterval(() => {
            mensage.classList.remove('active');
            mensage.classList.remove(classe)
        }, time);
    }
}

let actionCodeSettings = {
    url: 'http://127.0.0.1:5500/application.html'
}