class Post {
    constructor() {
        // TODO inicializar firestore y settings
        this.db = firebase.firestore()
    }

    crearPost(uid, emailUser, titulo, descripcion, imagenLink, videoLink) {
        return this.db.collection("posts").add({
            uid,
            emailUser,
            titulo,
            descripcion,
            imagenLink,
            videoLink,
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        })
            .then(refDoc => {
                console.log(`Id del post => ${refDoc.id}`);
            })
            .catch(error => {
                console.error(`error creando el post ${error.message}`);
            })
    }

    editarPost(id, uid, emailUser, titulo, descripcion, imagenLink, videoLink){
        let refUser = this.db.collection('posts').doc(id)
  
        return refUser.update({
            uid,
            emailUser,
            titulo,
            descripcion,
            imagenLink,
            videoLink,
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(error => {
            console.error(`error editar el post ${error.message}`);
        })
    }

    consultarTodosPost() {
        this.
            db.
            collection("posts")
            .orderBy("fecha", "asc")
            .orderBy("titulo", "asc")
            .onSnapshot(querySnapshot => {
                $("#posts").empty()
                if (querySnapshot.empty) {
                    $("#posts").append(this.obtenerTemplatePostVacio())
                } else {
                    querySnapshot.forEach(post => {
                        let postHtml = this.obtenerPostTemplate(
                            post.data()?.emailUser,
                            post.data()?.titulo,
                            post.data()?.descripcion,
                            post.data()?.videoLink,
                            post.data()?.imagenLink,
                            Utilidad.obtenerFecha(post.data()?.fecha?.toDate()),
                            post?.id,
                            false
                        )
                        $("#posts").append(postHtml)
                    })
                }
            })
    }

    consultarPostxUsuario(emailUser) {
        this
            .db.
            collection("posts")
            .orderBy("fecha", "asc")
            .where("emailUser", "==", emailUser)
            .onSnapshot(querySnapshot => {
                $("#posts").empty()
                if (querySnapshot.empty) {
                    $("#posts").append(this.obtenerTemplatePostVacio())
                } else {
                    querySnapshot.forEach(post => {
                        let postHtml = this.obtenerPostTemplate(
                            post.data()?.emailUser,
                            post.data()?.titulo,
                            post.data()?.descripcion,
                            post.data()?.videoLink,
                            post.data()?.imagenLink,
                            Utilidad.obtenerFecha(post.data()?.fecha?.toDate()),
                            post?.id,
                            true
                        )
                        $("#posts").append(postHtml)
                    })
                }
            })
    }

    colocarPostSeleccionado(post){
        $("#posts").empty()
        let postHtml = this.obtenerPostTemplate(
            post.data()?.emailUser,
            post.data()?.titulo,
            post.data()?.descripcion,
            post.data()?.videoLink,
            post.data()?.imagenLink,
            Utilidad.obtenerFecha(post.data()?.fecha?.toDate()),
            post?.id,
            $('#tituloPost').text() == 'Mis Posts'
        )
        $("#posts").append(postHtml)
    }

    subirImagenPost(file, uid) {
        const storage = firebase.storage()
        const refStorage = storage.ref(`imagenesPost/${uid}/${file?.name}`)
        const task = refStorage.put(file)

        // tarea que se ejecuta cuando se carga el archivo
        task.on('state_changed', snapshot => {
            const porcentaje = snapshot.bytesTransferred / snapshot.totalBytes * 100
            // Le informa al usuario cuantos bytes a subido en porcentaje
            $('.determinate').attr("style", `width: ${porcentaje}%`)
        },
        error => {
            Materialize.toast(`Error subiendo archivo => ${error.message}`, 4000)
        },
        // funcion una vez se complete la subida del archivo
        () => {
            task.snapshot.ref.getDownloadURL()
                .then(url => {
                    console.log(url)
                    sessionStorage.setItem("imgNewPost", url)
                    $("#imagen-subida").attr("style", `display: block;`)
                    $("#imagen-subida").attr("src", url)
                }).catch( error => {
                    Materialize.toast(`Error obteniendo la URL => ${error.message}`, 4000)
                })
        })
    }

    obtenerTemplatePostVacio() {
        return `<article class="post">
                    <div class="post-titulo">
                        <h5>Crea el primer Post a la comunidad</h5>
                    </div>
                    <div class="post-calificacion">
                        <a class="post-estrellita-vacia" href="*"></a>
                        <a class="post-estrellita-vacia" href="*"></a>
                        <a class="post-estrellita-vacia" href="*"></a>
                        <a class="post-estrellita-vacia" href="*"></a>
                        <a class="post-estrellita-vacia" href="*"></a>
                    </div>
                    <div class="post-video">
                        <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
                            frameborder="0"></iframe>
                        </figure>
                    </div>
                    <div class="post-videolink">
                        Video
                    </div>
                    <div class="post-descripcion">
                        <p>Crea el primer Post a la comunidad</p>
                    </div>
                    <div class="post-footer container">         
                    </div>
                </article>`
    }

    obtenerPostTemplate(
        autor,
        titulo,
        descripcion,
        videoLink,
        imagenLink,
        fecha,
        id,
        condicion
    ) {
        let botonesDeAccion = ""
        if(condicion){
            botonesDeAccion = /*html*/`<div class="col m6 right-align" style="padding-right: 15px;">
                    <a class="btn-floating waves-effect waves-light btnPpal" onclick="editPost('${id}')"><i class="material-icons">edit</i></a>
                    <a class="btn-floating waves-effect waves-light red" onclick="deletePost('${id}')"><i class="material-icons">delete</i></a>
                </div>`
        }

        if (imagenLink) {
            return /*html*/`<article class="post">
                        <div class="post-titulo">
                            <h5>${titulo}</h5>
                        </div>
                        <div class="post-calificacion">
                            <a class="post-estrellita-vacia" onclick="colocarEstrellas(1, '${id}')"></a>
                            <a class="post-estrellita-vacia" onclick="colocarEstrellas(2, '${id}')"></a>
                            <a class="post-estrellita-vacia" onclick="colocarEstrellas(3, '${id}')"></a>
                            <a class="post-estrellita-vacia" onclick="colocarEstrellas(4, '${id}')"></a>
                            <a class="post-estrellita-vacia" onclick="colocarEstrellas(5, '${id}')"></a>
                        </div>
                        <div class="post-video">                
                            <img id="imgVideo" src='${imagenLink}' class="post-imagen-video" 
                                alt="Imagen Video">     
                        </div>
                        <div class="post-videolink">
                            <a href="${videoLink}" target="blank">Ver Video</a>                            
                        </div>
                        <div class="post-descripcion">
                            <p>${descripcion}</p>
                        </div>
                        <div class="post-footer container">
                            <div class="row">
                                <div class="col m6">
                                    Fecha: ${fecha}
                                </div>
                                ${botonesDeAccion}
                                <div class="col m6">
                                    Autor: ${autor}
                                </div>        
                            </div>
                        </div>
                    </article>`
        }

        return /*html*/`<article class="post">
                    <div class="post-titulo">
                        <h5>${titulo}</h5>
                    </div>
                    <div class="post-calificacion">
                        <a class="post-estrellita-vacia" onclick="colocarEstrellas(1, '${id}')"></a>
                        <a class="post-estrellita-vacia" onclick="colocarEstrellas(2, '${id}')"></a>
                        <a class="post-estrellita-vacia" onclick="colocarEstrellas(3, '${id}')"></a>
                        <a class="post-estrellita-vacia" onclick="colocarEstrellas(4, '${id}')"></a>
                        <a class="post-estrellita-vacia" onclick="colocarEstrellas(5, '${id}')"></a>
                    </div>
                    <div class="post-video">
                        <iframe type="text/html" width="500" height="385" src='${videoLink}'
                            frameborder="0"></iframe>
                        </figure>
                    </div>
                    <div class="post-videolink">
                        Video
                    </div>
                    <div class="post-descripcion">
                        <p>${descripcion}</p>
                    </div>
                    <div class="post-footer container">
                        <div class="row">
                            <div class="col m6">
                                Fecha: ${fecha}
                            </div>
                            ${botonesDeAccion}
                            <div class="col m6">
                                Autor: ${autor}
                            </div>        
                        </div>
                    </div>
                </article>`
    }

    obtenerDesplegableBusqueda(busqueda){
        this.
            db.
            collection("posts")
            .where("titulo", ">=", busqueda)
            .where('titulo', '<=', busqueda + '\uf8ff')
            .limit(3)
            .onSnapshot(querySnapshot => {
                $("#data-encontrada").empty()
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(post => {
                        let postHtml = `<li onclick="seleccionado('${post?.id}')">${post.data()?.titulo}</li>`
                        $("#data-encontrada").append(postHtml)
                    })
                }
            })
    }

    async guardarCalificacion(numeroEstrellas, id){
        const refUser = this.db.collection('posts').doc(id)
        const post = await refUser.get()
        
        // Usuario logueado
        const user = firebase.auth().currentUser

        // Verificar si ya voto
        const existeCalificacion = post.data()?.calificacion

        if(!existeCalificacion){
            return refUser.update({
                calificacion: [{
                    idUser: user.uid,
                    estrellas: numeroEstrellas
                }]
            })
            .catch(error => {
                console.error(`error calificar el post ${error.message}`);
            })
        } else {
            const existeUsuario = post.data().calificacion.findIndex(x => x.idUser == user.uid)
            let calificacion = post.data().calificacion
            if(existeUsuario > -1){
                calificacion[existeUsuario] = {
                    idUser: user.uid,
                    estrellas: numeroEstrellas
                }
            } else {
                calificacion = [...calificacion, {
                    idUser: user.uid,
                    estrellas: numeroEstrellas
                }]
            }

            return refUser.update({
                calificacion: calificacion
            })
            .catch(error => {
                console.error(`error calificar el post ${error.message}`);
            })
        }
        
    }
}
