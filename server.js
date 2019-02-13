var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//7 mins of 12.3 but mots likely need to change. replace index with full file paths(for now)
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
}

function OnDisconnect()
{
    console.log('user disconnected');
}
