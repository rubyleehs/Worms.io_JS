/*jshint esversion: 6 */
var socket;

var worms = [];
var consumables = [];

var edibleSegmentsInterval = 5;

var currentCamPos;
function setup()
{
  createCanvas(600, 600);

  CreateWorm(createVector(width / 2, height / 2), 7, true);
  CreateWorm(createVector(width / 3, height / 3), 7, true);
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
  if (isPlayer) w = new PlayerWorm(position, radius, 500);
  else w = new Worm(position, radius, 200);

  worms[worms.length] = w;
}

function CreateConsumable(position, amount)
{
  let c = new Consumable(position, amount);
  consumables[consumables.length] = c;
}

function Update()
{
  for (let i = 0; i < worms.length; i++)
  {
    worms[i].Update();
  }

  CheckWormsConsuption();
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
  for (let w = 0; w < worms.length; w++)
  {
    let headPos = worms[w].bodySegments[0];

    for (let i = 0; i < worms.length; i++)
    {
      for (let s = worms[i].unedibleSegments; s < worms[i].bodySegments.length; s += edibleSegmentsInterval)
      {
        let deltaX = worms[i].bodySegments[s].x - headPos.x;
        let deltaY = worms[i].bodySegments[s].y - headPos.y;
        if (deltaX * deltaX + deltaY * deltaY < worms[i].radius * worms[i].radius)
        {
          worms[w].Grow(worms[i].bodySegments.length - s);
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
        worms[w].Grow(consumables[i].amount);
        consumables.splice(i, 1);
      }
    }
  }
}


