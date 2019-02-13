var express = require('express');
var app = express();
var http = require('http').Server(express);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function (req, res)
{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', Connection);

http.listen(3000, function ()
{
    console.log('listening on *:3000');
});

function Connection(socket)
{
    console.log('a user connected');

    socket.on('disconnect', OnDisconnect);
    socket.on('input', OnInput);

}

function OnDisconnect()
{
    console.log('user disconnected');
}


function OnInput(input)
{
    console.log('input received: ' + input);
}