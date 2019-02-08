/*jshint esversion: 6 */
var worm1;
var worm2;
var worms = [];
function setup()
{
  createCanvas(600, 600);

  CreateWorm(width / 2, height / 2, 64, false);
  CreateWorm(width / 3, height / 3, 200, true);
}

function draw()
{
  background(0, 10, 200);
  UpdateWorms();
  ShowWorms();
}

function CreateWorm(x, y, radius, isPlayer)
{
  let w;
  if (isPlayer) w = new PlayerWorm(5, x, y, radius);
  else w = new Worm(x, y, radius);

  worms[worms.length] = w;
}

function UpdateWorms()
{
  for (let i = 0; i < worms.length; i++)
  {
    worms[i].Update();
  }
}

function ShowWorms()
{
  for (let i = 0; i < worms.length; i++)
  {
    worms[i].Show();
  }
}


