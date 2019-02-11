class Consumable
{
    constructor(position, amount)
    {
        this.position = position;
        this.amount = amount;

        this.radius = sqrt(amount / PI);
    }

    Show(camPos)
    {
        ellipse(this.position.x - camPos.x, this.position.y - camPos.y, 2 * this.radius, 2 * this.radius);
    }

}