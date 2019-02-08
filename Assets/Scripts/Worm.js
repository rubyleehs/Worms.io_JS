/*jshint esversion: 6 */
class Worm
{
    constructor(headPosX, headPosY, radius)
    {
        this.headPosX = headPosX;
        this.headPosY = headPosY;
        this.radius = radius;
    }

    Update()
    {
        this.Move(random(-2, 2), random(-2, 2));
    }

    Show()
    {
        ellipse(this.headPosX, this.headPosY, this.radius, this.radius);
        ellipse(10, 10, 30, 30);
    }

    Move(dx, dy)
    {
        this.headPosX += dx;
        this.headPosY -= dy;
    }
}

class PlayerWorm extends Worm
{
    constructor(moveSpeed, headPosX, headPosY, radius)
    {
        super(headPosX, headPosY, radius);
        this.moveSpeed = moveSpeed;

        this.inputX = 0;
        this.inputY = 0;
    }

    Update()
    {
        this.HandlePlayerInput();
        this.Move(this.inputX * this.moveSpeed, this.inputY * this.moveSpeed)
    }

    HandlePlayerInput()
    {
        this.inputX = 0;
        this.inputY = 0;
        if (keyIsDown(UP_ARROW)) this.inputY += 1;
        if (keyIsDown(DOWN_ARROW)) this.inputY -= 1;
        if (keyIsDown(RIGHT_ARROW)) this.inputX += 1;
        if (keyIsDown(LEFT_ARROW)) this.inputX -= 1;
    }
}