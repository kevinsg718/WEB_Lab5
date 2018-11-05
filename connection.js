//codigo utilizado como fuente https://socket.io/docs/
// codgio utilizado como fuente https://carlosazaustre.es/websockets-como-utilizar-socket-io-en-tu-aplicacion-web/
//Oscar Sanchez, 15803

//En server/connection.js creamos una aplicación con express, que pasaremos a un servidor http y 
//todo esto irá ligado al servidor de websockets que creamos con socket.io

var express = require('express');
var app = express();
var server = require('http').Server(app);
var websockets = require('socket.io')(server);
var fetch = require('node-fetch');

// array de mensajes
messages = [];

// Después en nuestro server/connection.js tenemos que indicar cual es la ruta 
//que tendrán los ficheros estáticos, lo hacemos con el middleware express.static.
app.use(express.static('public'));

// Dentro de éste método enviaremos el array de objetos mensaje con el evento 'messages':
websockets.on('connection', function(socket) {
    // fetch messages
    getMessages();
    socket.emit('refresh', messages);

    // for new messages
    socket.on('new', function() {
        // POST request
        sendMessage();
    })

});

// funcion para recibir los mensajes
function getMessages() {
    fetch('http://34.210.35.174:7000')
     .then(function(response) {
         return response.json();
     })
     .then(function(data) {
         messages = data;
         websockets.sockets.emit('refresh', messages);
     })
}

// pedido de mensajes 
function sendMessage() {
    // refrescar mensajes
    getMessages();        
}

server.listen(8080, function() {
    console.log('Server is running');
    getMessages();
});