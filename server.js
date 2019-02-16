var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var worms = [];
var cWorm;

function Worm(id, headPos, camPos, radius, bodySegmentsNum)
{
    this.id = id;
    this.headPos = headPos;
    this.camPos = camPos;

    this.radius = radius;
    this.bodySegmentsNum = bodySegmentsNum
    this.bodySegments = [];
}

server.listen(3000, Listen);
app.use(express.static('public'));

function Listen()
{
    console.log('listening on *:3000');
    var host = server.address().address;
    var port = server.address().port;
}

app.get('/', function (req, res)
{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', Connection);

function Connection(socket)
{
    console.log('We have a new client: ' + socket.id);

    socket.on('disconnect', function ()
    {
        console.log('A client left: ' + socket.id);
        socket.removeAllListeners('disconnect');
        //socket.broadcast.emit('disconnect', socket);
    });
}
