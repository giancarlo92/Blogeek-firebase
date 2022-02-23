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
                            null
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
                            post?.id
                        )
                        $("#posts").append(postHtml)
                    })
                }
            })
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
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-llena" href="*"></a>
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
        id
    ) {
        let botonesDeAccion = ""
        if(id != null){
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
                            <a class="post-estrellita-llena" href="*"></a>
                            <a class="post-estrellita-llena" href="*"></a>
                            <a class="post-estrellita-llena" href="*"></a>
                            <a class="post-estrellita-llena" href="*"></a>
                            <a class="post-estrellita-vacia" href="*"></a>
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
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-vacia" href="*"></a>
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
}
