$(() => {
  $('#btnModalPost').click(() => {
    $('#tituloNewPost').val('')
    $('#descripcionNewPost').val('')
    $('#linkVideoNewPost').val('')
    $('#btnUploadFile').val('')
    $("#imagen-subida").attr("src", "")
    $('.determinate').attr('style', `width: 0%`)
    sessionStorage.setItem('imgNewPost', null)

    // TODO: Validar que el usuario esta autenticado

    // Materialize.toast(`Para crear el post debes estar autenticado`, 4000)

    $('#modalPost').modal('open')
  })

  $('#btnRegistroPost').click(() => {
    const post = new Post()
    const user = firebase.auth().currentUser

    // TODO: Validar que el usuario esta autenticado
    if(!user){
      Materialize.toast(`Para crear el post debes estar autenticado`, 4000)
      return
    }

    const titulo = $('#tituloNewPost').val()
    const descripcion = $('#descripcionNewPost').val()
    const videoLink = $('#linkVideoNewPost').val()
    const imagenLink = sessionStorage.getItem('imgNewPost') == 'null'
      ? null
      : sessionStorage.getItem('imgNewPost')

    post
      .crearPost(
        user.uid,
        user.email,
        titulo,
        descripcion,
        imagenLink,
        videoLink
      )
      .then(resp => {
        Materialize.toast(`Post creado correctamente`, 4000)
        $('.modal').modal('close')
      })
      .catch(err => {
        Materialize.toast(`Error => ${err}`, 4000)
      })
  })

  $('#btnModalAccionesFirestore').click(() => {
    $('#modalAccionesFirestore').modal('open')
  })

  $('#btnUploadFile').on('change', e => {
    // TODO: Validar que el usuario esta autenticado
    const user = firebase.auth().currentUser
    if(!user){
      Materialize.toast(`Para crear el post debes estar autenticado`, 4000)
      return
    }

    const file = e.target.files[0]

    // TODO: Referencia al storage
    const post = new Post()
    post.subirImagenPost(file, user?.uid)
  })
})

async function editPost(id){

  const postDao = new PostDAO()
  const resp = await postDao.querySingle(id)
  
  $('#tituloNewPost').val(resp.data()?.titulo)
  $('#descripcionNewPost').val(resp.data()?.descripcion)
  $('#linkVideoNewPost').val(resp.data()?.videoLink)
  $('.determinate').attr("style", `width: 100%`)
  $("#imagen-subida").attr("style", `display: block;`)
  $("#imagen-subida").attr("src", resp.data()?.imagenLink)
  $("#btnRegistroPost").text("Editar Post")

  $('#modalPost').modal('open')

  $('#tituloNewPost').focus()
  $('#descripcionNewPost').focus()
  $('#linkVideoNewPost').focus()

}
