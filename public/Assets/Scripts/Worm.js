/*jshint esversion: 6 */
class Worm
{
    constructor(id, headPos, radius, bodySegmentsNum)
    {
        this.id = id;
        this.headPos = headPos;
        this.camPos = headPos;

        this.radius = radius;
        this.bodySegmentsNum = bodySegmentsNum
        this.bodySegments = [];
    }

    Start()
    {
        this.bodySegments[0] = this.headPos;

        this.distBetweenSegments = 1;
        this.radiusDecaySegments = round(this.bodySegmentsNum * 0.4);
        this.unedibleSegments = round(this.bodySegmentsNum * 0.1);

        this.camLerpSpeed = 0.04;

        this.angularSpeed = 0.12;
        this.moveAngle = 0;
        this.baseMoveSpeed = 1.7;
        this.moveSpeed = 0.5;
        this.turnSpeedBoost = 1.5;

        this.cMoveSpeed = 0;
        this.minSegDistToUpdate = 1;
    }

    Update()
    {
        this.Move();
    }

    Show(camPos)
    {
        let dSidePointsA = [];
        let dSidePointsB = [];
        for (let i = 1; i < this.bodySegments.length - 1; i++)
        {
            let dx = this.bodySegments[i - 1].x - this.bodySegments[i].x;
            let dy = this.bodySegments[i - 1].y - this.bodySegments[i].y;
            let decayRatio = min(1, (this.bodySegments.length - i) / this.radiusDecaySegments);
            let inverseMag = this.radius * decayRatio / sqrt(dx * dx + dy * dy);
            dSidePointsA[i] = createVector(- dy * inverseMag, dx * inverseMag);
            dSidePointsB[i] = createVector(dy * inverseMag, - dx * inverseMag);
            if (i == 1) ellipse(this.headPos.x - camPos.x, this.headPos.y - camPos.y, 2 * this.radius * decayRatio, 2 * this.radius * decayRatio);
        }
        beginShape();
        for (let i = 1; i < dSidePointsA.length; i++) vertex(this.bodySegments[i].x + dSidePointsA[i].x - camPos.x, this.bodySegments[i].y + dSidePointsA[i].y - camPos.y);
        for (let i = dSidePointsB.length - 1; i > 1; i--) vertex(this.bodySegments[i].x + dSidePointsB[i].x - camPos.x, this.bodySegments[i].y + dSidePointsB[i].y - camPos.y);
        endShape();
    }

    Move()
    {
        if (this.moveAngle > 180 || this.moveAngle < -180) this.moveAngle - Math.sign(this.moveAngle) * 360;
        let dv = createVector(this.cMoveSpeed * cos(this.moveAngle), this.cMoveSpeed * sin(this.moveAngle));
        this.headPos = createVector(this.headPos.x + dv.x, this.headPos.y - dv.y);
        this.camPos = createVector((this.headPos.x - this.camPos.x) * this.camLerpSpeed + this.camPos.x, (this.headPos.y - this.camPos.y) * this.camLerpSpeed + this.camPos.y);

        let delta = sqrt(pow(this.headPos.x - this.bodySegments[0].x, 2) + pow(this.headPos.y - this.bodySegments[0].y, 2));
        if (delta > this.minSegDistToUpdate)
        {
            this.bodySegments.unshift(this.headPos);
        }
        this.CreateTrail();

    }

    CreateTrail()
    {
        while (this.bodySegments.length > this.bodySegmentsNum)
        {
            this.bodySegments.pop();
        }

        for (let i = 1; i < this.bodySegments.length; i++)
        {

            let dx = this.bodySegments[i - 1].x - this.bodySegments[i].x;
            let dy = this.bodySegments[i - 1].y - this.bodySegments[i].y;
            let sqrDDist = dx * dx + dy * dy;

            if (sqrDDist > this.distBetweenSegments * this.distBetweenSegments)
            {
                this.bodySegments[i] = createVector(this.bodySegments[i].x + dx * 0.65, this.bodySegments[i].y + dy * 0.65)
            }
        }
    }

    Grow(amount)
    {
        this.bodySegmentsNum += amount;
        print("grew " + amount);
    }

    Cut(index)
    {
        print("lost " + (this.bodySegments.length - index));
        this.bodySegmentsNum -= (this.bodySegments.length - index);
        this.bodySegments.splice(index, this.bodySegments.length - index)
    }
}

class PlayerWorm extends Worm
{
    constructor(headPos, radius, bodySegmentsNum)
    {
        super(headPos, radius, bodySegmentsNum);

        this.inputAxis = createVector(0, 0);
        print("player");
    }

    Update()
    {
        this.HandlePlayerInput();
        this.CreateTrail();
        this.Move();
    }

    HandlePlayerInput()
    {
        this.inputAxis = createVector(0, 0);
        if (keyIsDown(38) || keyIsDown(87)) this.inputAxis.y += 1;
        if (keyIsDown(40) || keyIsDown(83)) this.inputAxis.y -= 1;
        if (keyIsDown(39) || keyIsDown(68)) this.inputAxis.x += 1;
        if (keyIsDown(37) || keyIsDown(65)) this.inputAxis.x -= 1;

        if (this.inputAxis.x * this.inputAxis.x + this.inputAxis.y * this.inputAxis.y > 1)
        {
            this.inputAxis.x *= 0.707;
            this.inputAxis.y *= 0.707;
        }
        this.cMoveSpeed = this.baseMoveSpeed + this.inputAxis.y * this.moveSpeed;
        if (this.inputAxis.x != 0) this.cMoveSpeed += this.turnSpeedBoost;
        this.moveAngle += -this.inputAxis.x * this.angularSpeed;
    }
}