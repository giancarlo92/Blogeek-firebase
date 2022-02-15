class Autenticacion {
  authEmailPass (email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        // Preguntar si confirmo el correo 
        if(result.user.emailVerified) {
          $('#avatar').attr('src', 'imagenes/usuario_auth.png')
          Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000)
        } else {
          firebase.auth().signOut()
          Materialize.toast(`Por favor realiza la verificación de la cuenta`, 5000)
        }
      })
    $('.modal').modal('close')
   
  }

  crearCuentaEmailPass (email, password, nombres) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        result.user.updateProfile({
          displayName: nombres  
        })

        const configuration = {
          url: "http://127.0.0.1:5500/"
        }

        // Enviar correo de verificacion
        result
          .user
          .sendEmailVerification(configuration)
          .catch(error => {
            console.error(error);
            Materialize.toast(error.message, 4000)
          })
        
        // Hacer logout al usuario hasta que verifique su correo
        firebase.auth().signOut()

        // Mensaje de bienvenida
        Materialize.toast(
          `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
          4000
        )

        // Cerrar la ventana
        $('.modal').modal('close')

      })
      .catch(error => {
        console.error(error);
        Materialize.toast(error.message, 4000)
      })
    
  }

  authCuentaGoogle () {
    const provider = new firebase.auth.GoogleAuthProvider()
    // Hay otra forma de loguear al usuario sacandolo de la aplicacion pero no es recomendable para la experiencia de usuario
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        $('#avatar').attr('src', result.user.photoURL)
        $('.modal').modal('close')
        // displayName es el nombre de su cuenta de Google
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
      })
      .catch(error => {
        console.error(error);
        Materialize.toast(`Error al autenticarse con Google: ${error.message}`, 4000)
      })
  }

  authCuentaFacebook () {
    const provider = new firebase.auth.FacebookAuthProvider()
    // Lo mismo que el anterior
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        $('#avatar').attr('src', result.user.photoURL)
        $('.modal').modal('close')
        // displayName es el nombre de su cuenta de Google
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
      })
      .catch(error => {
        console.error(error);
        Materialize.toast(`Error al autenticarse con Facebook: ${error.message}`, 4000)
      })
  }

  authTwitter () {
    // TODO: Crear auth con twitter
  }
}
