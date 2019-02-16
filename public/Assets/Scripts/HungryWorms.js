/*jshint esversion: 6 */
var socket;

var worms = [];
var consumables = [];

var edibleSegmentsInterval = 5;
var cWormIndex;

var currentCamPos;
function setup()
{
  createCanvas(600, 600);
  socket = io.connect('http://localhost:3000');

  CreateConsumable([2, 2], 25);
  socket.on('assignWorm', CreateWorm);
  socket.on('Heartbeat', Heartbeat);
}

function draw()
{
  background(32, 31, 32);
  Update();
  Show();
}

function Heartbeat(data)
{
  console.log('worm length in client heartbeat: ' + worms.length);
  for (let i = 0; i < data.length; i++)
  {
    if (worms[i] == undefined)
    {
      worms[i] = new PlayerWorm(data[i].headPos, data[i].radius, data[i].bodySegmentsNum)
      worms[i].Start();
    }
    worms[i].headPos = data[i].headPos;
    worms[i].moveAngle = data[i].moveAngle;
    worms[i].radius = data[i].radius;
    worms[i].bodySegmentsNum = data[i].bodySegmentsNum;
    worms[i].bodySegments = data[i].bodySegments;
  }
}

function CreateWorm(data)
{
  let w = new PlayerWorm(data.headPos, data.radius, data.bodySegmentsNum);
  w.Start();
  cWormIndex = data.index;
  worms[data.index] = w;

  console.log('client worm created at' + data.headPos);
}

function CreateConsumable(position, amount)
{
  let c = new Consumable(position, amount);
  consumables[consumables.length] = c;
}

function Update()
{
  if (cWormIndex == undefined) return;
  let w = worms[cWormIndex];
  w.Update();
  CheckWormsConsuption();

  var data = {
    headPos: w.headPos,
    radius: w.radius,
    bodySegmentsNum: w.bodySegmentsNum,
    bodySegments: w.bodySegments,
    moveAngle: w.moveAngle,
  };
  socket.emit('update', data);
}

function Show()
{
  if (cWormIndex == undefined) return;

  CalCamPosition(cWormIndex);
  for (let i = 0; i < consumables.length; i++)
  {
    consumables[i].Show(currentCamPos);
  }
  for (let i = 0; i < worms.length; i++)
  {
    if (worms[i] == undefined) continue;

    worms[i].Show(currentCamPos);
  }
}

function CalCamPosition(index)
{
  currentCamPos = [worms[index].camPos[0] - width * 0.5, worms[index].camPos[1] - height * 0.5];
}

function CheckWormsConsuption()
{
  let headPos = worms[cWormIndex].bodySegments[0];

  for (let i = 0; i < worms.length; i++)
  {
    if (worms[i] == undefined) continue;
    if (!worms[i].isReady) continue;

    for (let s = worms[i].unedibleSegments; s < worms[i].bodySegments.length; s += edibleSegmentsInterval)
    {
      let deltaX = worms[i].bodySegments[s][0] - headPos[0];
      let deltaY = worms[i].bodySegments[s][1] - headPos[1];
      if (deltaX * deltaX + deltaY * deltaY < worms[i].radius * worms[i].radius)
      {
        worms[cWormIndex].Grow(worms[i].bodySegments.length - s);
        worms[i].Cut(s);
        var data = {
          wormIndex: i,
          cutIndex: s,
        }
        socket.emit('cut', data);
      }
    }
  }

  for (let i = 0; i < consumables.length; i++)
  {
    let deltaX = consumables[i].position[0] - headPos[0];
    let deltaY = consumables[i].position[1] - headPos[1];
    if (deltaX * deltaX + deltaY * deltaY < consumables[i].radius * consumables[i].radius)
    {
      worms[cWormIndex].Grow(consumables[i].amount);
      consumables.splice(i, 1);
    }
  }
}


