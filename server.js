var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var worms = [];

function Worm(id, headPos, camPos, radius, bodySegmentsNum)
{
    this.id = id;
    this.headPos = headPos;
    this.camPos = camPos;

    this.radius = radius;
    this.bodySegmentsNum = bodySegmentsNum;
    this.bodySegments = [];
    this.bodySegments[0] = headPos;
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

    socket.on('start', function (data)
    {
        let cWormIndex = worms.push(new Worm(socket.id, data.headPos, data.camPos, data.radius, data.bodySegmentsNum)) - 1;
        console.log(worms[cWormIndex]);
    });

    socket.on('update', function (data)
    {
        let cWorm;
        for (let i = 0; i < worms.length; i++)
        {
            if (socket.id == worms[i].id) cWorm = worms[i];
        }
        cWorm.headPos = data.headPos;
        cWorm.camPos = data.camPos;
        cWorm.radius = data.radius;
        cWorm.bodySegmentsNum = data.bodySegmentsNum
        cWorm.bodySegments = data.bodySegments;

        console.log('update received from: ' + socket.id);
        console.log(data.headPos)
    });
}
