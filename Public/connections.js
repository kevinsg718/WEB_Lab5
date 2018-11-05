//codigo basada de https://carlosazaustre.es/websockets-como-utilizar-socket-io-en-tu-aplicacion-web/
// programado por Oscar Sanchez, 15803
// Universidad del Valle

var socket = io.connect('http://localhost:8080', { 'forceNew': true });

socket.on('refresh', function(data) {
    render(data);
});

function render(data) {
    // render 
    var chat = document.getElementById("area_mensajes");

    while (chat.firstChild) {
        chat.removeChild(chat.firstChild);
    }
    for (var i = 0; i < data.length; i++) {
                var div = document.createElement("div");
                div.style.width = "50%";
                div.style.height = "auto";
                div.style.background = "#043644";
                div.style.padding = "10px";
                div.style.borderRadius = "5px";
                div.style.marginBottom = "10px";
                div.style.fontFamily = "Arial";
                div.style.fontSize = "15px";
                div.style.color = "#ffffff";

                var node = document.createTextNode(data[i].nombre + ": " + data[i].text);

                div.appendChild(node);
                var urls = getUrls(data[i].text);
                if (urls.length > 0) {
                    for (var j = 0; j < urls.length; j++) {
                        var url = urls[j];
                        var frame = document.createElement("iframe");
                        frame.setAttribute("id", url);
                        frame.setAttribute("src", url);
                        frame.style.marginTop = "10px";
                        frame.style.borderRadius = "5px";

                        div.appendChild(frame);
                    }
                }
                chat.appendChild(div);

    }
}

// POST: sends the message
function sendMessage() {
    var _id = document.getElementById("id-entradas").value;
    var text = document.getElementById("text-entradas").value;
    var nombre = document.getElementById("nombre-entradas").value;

    
    var quick_reply = document.getElementById("quick-reply").value;

    // verify fields

    if (_id === "" || nombre === "" || text === "") {
        // si algo esta vacio
        alert("porfavor ingrese todos los campos");
    } else {
        if (text.length <= 140) {
            // continue
            console.log('preparando para enviar');
            
            // POST request
            var fd = new FormData();

            fd.append("_id", _id);
            fd.append("text", text);
            fd.append("nombre", nombre);

            var request = new XMLHttpRequest();
            request.open("POST", "http://34.210.35.174:7000");
            request.send(fd);
            
            //new socket
            socket.emit('new');

        } else {
            alert("Texto muy largo")
        }
    }  
        if (quick_reply != "") {
        text = quick_reply;
    }  
}

// checks if there are any urls inside text. Returns an array of found urls.
function getUrls(text) {
    var regex = /(https?:\/\/[^\s]+)/g;
    var rawtext = (text || '').toString();
    var urls = [];
    var url;
    var matches = [];

    while ((matches = regex.exec(rawtext)) !== null) {
        var matchUrl = matches[0];
        urls.push(matchUrl);
    }

    return urls;
}