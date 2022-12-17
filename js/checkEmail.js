function stateChange() {
    firebase.auth().onAuthStateChanged((result) => {
        if(result) {
            userName(result);
            userPhoto(result);
            sendEmailVerification(result);
        } else {
            return null
        }
    });
}

stateChange();

function userName(user) {
    let displayName = document.querySelector('#displayName');

    if(displayName) {
        displayName.innerText = user.displayName.split(' ')[0];
    }
}

function userPhoto(user, url=null) {
    const photoPreview = document.querySelector('.img-user');

    if(user.photoURL != url && url != null) {
        photoPreview.src = url;
    } else {
        photoPreview.src = user.photoURL;
    }
}

function photoSelectionWindow() {
    const boxModel = document.querySelector('.box-model');
    boxModel.classList.toggle('active');
}

function uploadPhoto() {
    const inputFilePhoto = document.getElementById('photo');
    inputFilePhoto.click();
}

function photoPreview() {
    const inputFilePhoto = document.getElementById('photo');
    const photoWrapper = document.querySelector('.photo-wrapper');
    const icon = photoWrapper.querySelector('.bx');

    if(inputFilePhoto) {
        inputFilePhoto.addEventListener('change', () => {

            const inputApply = document.getElementById('inputApplyPhoto');
            inputApply.classList.add('active');

            photoWrapper.removeChild(icon);
    
            const img = document.createElement('img');
            img.src = '#';
            img.classList.add('photoPreview');
            
            photoWrapper.appendChild(img);
    
            applyPhoto('photoPreview');
        });

    } else {
        return null
    }
}

photoPreview();

function applyPhoto(preview, boxModel=null) {
    const reader = new FileReader()
    const photoPreview = document.querySelector(`.${preview}`);
    const inputFile = document.querySelector('#photo');
    const box_model = document.querySelector(`.${boxModel}`);

    const photo = inputFile.files[0];

    if(photoPreview.classList.contains('img-user')) {

        let imgName = firebase.auth().currentUser.uid
        let imgPath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imgName;
    
        let storageRef = firebase.storage().ref(imgPath);

        let user = firebase.auth().currentUser;

        storageRef.put(photo).then((result) => {
            updatePhoto(user);
            resetPreviewPhoto();
        });


    } else {
        reader.onload = (event) => {
            photoPreview.src = reader.result
        }
    
        if(photo) {
            reader.readAsDataURL(photo);
        }   
    }

    if(box_model) box_model.classList.remove('active');
}

function updatePhoto(user) {
    firebase.storage().ref(`todoListFiles/${user.uid}`).listAll().then((result) => {
        if(result['items'] != 0) {
            firebase.storage().ref(`todoListFiles/${user.uid}/${user.uid}`).getDownloadURL().then((URL) => {
                if(user.photoURL != URL) {
                    user.updateProfile({
                        photoURL: `${URL}`
                    });

                    userPhoto(user, URL);
                }
            });
        }
    });
}

function resetPreviewPhoto() {
    const photoPreview = document.querySelector('.photoPreview');
    const inputFile = document.querySelector('#photo');
    const appplyPhoto = document.getElementById('inputApplyPhoto');

    inputFile.value = '';
    const i = document.createElement('i');
    i.classList.add('bx');
    i.classList.add('bxs-cloud-upload');

    const photoWrapper = document.querySelector('.photo-wrapper');
    photoWrapper.removeChild(photoPreview);

    photoWrapper.appendChild(i);

    appplyPhoto.classList.remove('active');
}

function sendEmailVerification(user) {
    const checkEmail = document.querySelector('#checkEmail');

    if(checkEmail) {
        checkEmail.addEventListener('click', () => {
            user.sendEmailVerification(actionCodeSettings).then((result) => {
                alert(`E-mail de verificação enviado para ${user.email}`);
            }).catch((error) => {
                alert(error);
            });
        });
    }
}