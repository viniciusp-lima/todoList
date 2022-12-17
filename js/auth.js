firebase.auth().languageCode = 'pt-BR';

function userLogin() {
    const formConect = document.querySelector('.conectar-se');
    const email = document.querySelector('.conectar-se .email');
    const password = document.querySelector('.conectar-se .password');

    if(formConect) {
        formConect.onsubmit = function(event) {
            event.preventDefault();
            firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch((error) => {
                switch(error.code) {
                    case 'auth/wrong-password':
                        mensage('Senha incorreta');
                        break;
                    default:
                        return null
                }
            });
        }
    }
}

userLogin();

function userRegister() {
    const formRegister = document.querySelector('.registrar');
    const userName = document.querySelector('.registrar #name');
    const email = document.querySelector('.registrar .email');
    const password = document.querySelector('.registrar .password');
    
    if(formRegister) {
        formRegister.onsubmit = function(event) {
            event.preventDefault();
        
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then((result) => {
                
                result.user.updateProfile({
                    displayName: userName.value
                });
    
            }).catch((error) => {
                switch(error.code) {
                    case 'auth/weak-password':
                        mensage('A senha é muito fraca');
                        break;
                    case 'auth/invalid-email':
                        mensage('Endereço de E-mail invalido');
                        break;
                    case 'auth/email-already-in-use':
                        mensage('Endereço de email fornecido já existe');
                        break;
                    case 'auth/account-exists-with-different-credential':
                        mensage('E-mail já associado a outra conta');
                        break;
                    default:
                        mensage('Falha no cadastro');
                }
            });
        }
    }
}

userRegister()

function signInWithGoole() {
    const google = document.querySelector('#google');

    if(google) {
        google.addEventListener('click', () => {
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch((error) => {
                alert(error);
            });
        });
    }
}

signInWithGoole();

function signInWithGithub() {
    const github = document.querySelector('#github');

    if(github) {
        github.addEventListener('click', () => {
            firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch((error) => {
                alert(error);
            });
        });
    }
}

signInWithGithub();

function stateChange() {
    firebase.auth().onAuthStateChanged((result) => {
        if(result) {
            logged(result);
        } else {
            logout();
        }
    });
}

stateChange();

function logged(user) {
    const body = document.querySelector('body');
    body.classList.toggle('logged');

    if(user.emailVerified) {
        if(window.location.pathname != '/application.html') {
            window.location.pathname = '/application.html';
        } else {
            return null
        }
    } else {
        if(window.location.pathname != '/checkEmail.html') {
            window.location.pathname = '/checkEmail.html';
        } else {
            return null
        }
    }
}

function logout() {
    if(window.location.pathname != '/index.html') {
        window.location = 'index.html';
    }
}