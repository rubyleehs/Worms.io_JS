var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var worms = [];

function Worm(id, headPos, camPos, radius, bodySegmentsNum)
{
    this.id = id;
    this.headPos = headPos;
    this.moveAngle;

    this.radius = radius;
    this.bodySegmentsNum = bodySegmentsNum;
    this.bodySegments = [];
    this.bodySegments[0] = headPos;
}

server.listen(3000, Listen);
app.use(express.static('public'));

setInterval(Heartbeat, 1000);

function Heartbeat()
{
    io.sockets.emit('Heartbeat', worms);
}

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
    CreateNewWorm(socket);

    socket.on('disconnect', function ()
    {
        console.log('A client left: ' + socket.id);
        socket.removeAllListeners('disconnect');
        //socket.broadcast.emit('disconnect', socket);
    });

    socket.on('update', function (data)
    {
        let cWorm;
        for (let i = 0; i < worms.length; i++)
        {
            if (socket.id == worms[i].id) cWorm = worms[i];
        }
        cWorm.headPos = data.headPos;
        cWorm.moveAngle = data.moveAngle;
        cWorm.radius = data.radius;
        cWorm.bodySegmentsNum = data.bodySegmentsNum
        cWorm.bodySegments = data.bodySegments;
    });

    socket.on('cut', function (data)
    {
        worms[data.wormIndex].bodySegmentsNum -= (worms[data.wormIndex].bodySegments.length - data.cutIndex);
        worms[data.wormIndex].bodySegments.splice(data.cutIndex, worms[data.wormIndex].bodySegments.length - data.cutIndex);
    })
}

function CreateNewWorm(socket)
{
    let pos = [Math.random() * 10, Math.random() * 10]
    let w = new Worm(socket.id, pos, pos, 7, 250);
    console.log('W.POSITION:' + w.headPos);
    worms.push(w);
    let data = {
        index: worms.length - 1,
        headPos: w.headPos,
        radius: w.radius,
        bodySegmentsNum: w.bodySegmentsNum,
    }
    socket.emit("assignWorm", data);
}
