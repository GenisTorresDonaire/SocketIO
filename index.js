var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var datosUsuarios = [];
var usuarios = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});


io.on('connection', function(socket){
  // Función que se encarga de mandar los nuevos mensajes
  socket.on('new message', function(msg){
    // Preparando el json de envio, para los nuevos mensajes, donde se muestra el usuario y el mensaje que ha enviado.
    io.emit('new message', {
      usuario: socket.usuario,
      mensaje: msg
    });
  });

  // Funcion que se encarga de gestionar los nuevos usuarios
  socket.on('new user', function(data, callback){
  	// Aqui miramos si el nickname que estan enviando no esta ya conectado actualmente.
    respuesta = datosUsuarios.indexOf(data);

    // Si retorna -1 no hay ninguno con ese nombre, asi que entrara en el else, sino existe y entra en el if.
    if (respuesta != -1){
      // devuelve un false, para que sepa que ese username ya esta ocupado.
  		callback(false);
    // en el caso de que no haya sido encontrado en el array.
  	}else{
      // devuelve un true
  		callback(true);
  		// Obtiene el nickname y lo guarda global.
      socket.usuario = data;
      // Hace un push en el array para que conste que ya existe.
  		datosUsuarios.push(socket.usuario);
      // Llamada para actualizar el listado, y para crear el nuevo usuario.
  		io.emit("listado usuarios", datosUsuarios);
      io.emit("nuevo usuario", socket.usuario);
  	}
  });

  // Funcion que recibe los sockets desconectado para enviarlos al cliente y que informe por el chat.
  socket.on('disconnect', function(){
    // en caso de que no sea el desconectado, no hara nada.
  	if(!socket.usuario) return;
  	usuarios--;
    // aqui se borra el usuario desconectado.
  	datosUsuarios.splice(datosUsuarios.indexOf(socket.usuario), 1);
    // llamada a dos funciones, una para actualizar la lista una vez se haya ido alguien. Y la segunda que se encarga de enviar el usuario desconectado al cliente.
  	io.emit("listado usuarios", datosUsuarios);
    io.emit("usuario desconectado", socket.usuario);
  });

});


