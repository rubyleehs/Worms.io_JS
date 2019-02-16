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

  CreateWorm(createVector(random(10), random(10)), 7, true);
  //CreateWorm(createVector(width / 3, height / 3), 7, true);
  CreateConsumable(createVector(2, 2), 25);
}

function draw()
{
  background(32, 31, 32);
  Update();
  Show();
}

function CreateWorm(position, radius, isPlayer)
{
  let w;
  if (isPlayer) w = new PlayerWorm(position, radius, 250);
  else w = new Worm(position, radius, 200);

  var data = {
    hx: w.headPos.x,
    hy: w.headPos.y,
    cx: w.camPos.x,
    cy: w.camPos.y,
    radius: w.radius,
    bodySegmentsNum: w.bodySegmentsNum
  };
  w.Start();
  socket.emit('start', data);
  cWormIndex = worms.length;
  worms[worms.length] = w;
}

function CreateConsumable(position, amount)
{
  let c = new Consumable(position, amount);
  consumables[consumables.length] = c;
}

function Update()
{
  let w = worms[cWormIndex];
  w.Update();
  CheckWormsConsuption();

  var data = {
    hx: w.headPos.x,
    hy: w.headPos.y,
    cx: w.camPos.x,
    cy: w.camPos.y,
    radius: w.radius,
    bodySegmentsNum: w.bodySegmentsNum,
    bodySegments: [[0, 0], [1, 0], [2, 0], [3, 0]],
  };
  socket.emit('update', data);
}

function Show()
{
  CalCamPosition(0);
  for (let i = 0; i < consumables.length; i++)
  {
    consumables[i].Show(currentCamPos);
  }
  for (let i = 0; i < worms.length; i++)
  {
    worms[i].Show(currentCamPos);
  }
}

function CalCamPosition(index)
{
  currentCamPos = createVector(worms[index].camPos.x - width * 0.5, worms[index].camPos.y - height * 0.5);
}

function CheckWormsConsuption()
{
  let headPos = worms[cWormIndex].bodySegments[0];

  for (let i = 0; i < worms.length; i++)
  {
    for (let s = worms[i].unedibleSegments; s < worms[i].bodySegments.length; s += edibleSegmentsInterval)
    {
      let deltaX = worms[i].bodySegments[s].x - headPos.x;
      let deltaY = worms[i].bodySegments[s].y - headPos.y;
      if (deltaX * deltaX + deltaY * deltaY < worms[i].radius * worms[i].radius)
      {
        worms[cWormIndex].Grow(worms[i].bodySegments.length - s);
        worms[i].Cut(s);
      }
    }
  }

  for (let i = 0; i < consumables.length; i++)
  {
    let deltaX = consumables[i].position.x - headPos.x;
    let deltaY = consumables[i].position.y - headPos.y;
    if (deltaX * deltaX + deltaY * deltaY < consumables[i].radius * consumables[i].radius)
    {
      worms[cWormIndex].Grow(consumables[i].amount);
      consumables.splice(i, 1);
    }
  }
}


