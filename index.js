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
  //usuarios++;
  //console.log("Usuarios actuales: " + usuarios);

  // Función que se encarga de mandar los nuevos mensajes
  socket.on('new message', function(msg){
    io.emit('new message', msg);
  });

  // Funcion que se encarga de gestionar los nuevos usuarios
  socket.on('new user', function(data, callback){
  	test = datosUsuarios.indexOf(data);
  	if (test != -1){
  		callback(false);
  	}else{
  		callback(true);
  		socket.usuario = data;
  		datosUsuarios.push(socket.usuario);
  		io.emit("listado usuarios", datosUsuarios);
  	}
  });

  // Funcion de desconectarse
  socket.on('disconnect', function(){
  	if(!socket.usuario) return;
  	usuarios--;
  	datosUsuarios.splice(datosUsuarios.indexOf(socket.usuario), 1);
  	io.emit("listado usuarios", datosUsuarios);

  	console.log("Usuario desconectado.");
  });

});


