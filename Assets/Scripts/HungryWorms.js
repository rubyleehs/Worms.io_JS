/*jshint esversion: 6 */
var worms = [];
var edibleSegmentsInterval = 5;
function setup()
{
  createCanvas(600, 600);

  // CreateWorm(createVector(width / 2, height / 2), 7, true);
  CreateWorm(createVector(width / 3, height / 3), 7, true);
}

function draw()
{
  background(32, 31, 32);
  UpdateWorms();
  ShowWorms();
}

function CreateWorm(position, radius, isPlayer)
{
  let w;
  if (isPlayer) w = new PlayerWorm(position, radius, 500);
  else w = new Worm(position, radius, 200);

  worms[worms.length] = w;
}

function UpdateWorms()
{
  for (let i = 0; i < worms.length; i++)
  {
    worms[i].Update();
  }

  CheckWormsConsuption();
}

function ShowWorms()
{
  for (let i = 0; i < worms.length; i++)
  {
    worms[i].Show();
  }
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
  }
}


