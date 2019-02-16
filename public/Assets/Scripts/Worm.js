/*jshint esversion: 6 */
class Worm
{
    constructor(headPos, radius, bodySegmentsNum)
    {
        //this.id = id;
        this.headPos = [];
        this.headPos = headPos;
        this.camPos = [];
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
        this.minSegDistToUpdate = 1.5;
        this.constains = [3000, 3000];
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
            let dx = this.bodySegments[i - 1][0] - this.bodySegments[i][0];
            let dy = this.bodySegments[i - 1][1] - this.bodySegments[i][1];
            let decayRatio = min(1, (this.bodySegments.length - i) / this.radiusDecaySegments);
            let inverseMag = this.radius * decayRatio / sqrt(dx * dx + dy * dy);
            dSidePointsA[i] = [- dy * inverseMag, dx * inverseMag];
            dSidePointsB[i] = [dy * inverseMag, - dx * inverseMag];
            if (i == 1) ellipse(this.headPos[0] - camPos[0], this.headPos[1] - camPos[1], 2 * this.radius * decayRatio, 2 * this.radius * decayRatio);
        }
        beginShape();
        for (let i = 1; i < dSidePointsA.length; i++) vertex(this.bodySegments[i][0] + dSidePointsA[i][0] - camPos[0], this.bodySegments[i][1] + dSidePointsA[i][1] - camPos[1]);
        for (let i = dSidePointsB.length - 1; i > 1; i--) vertex(this.bodySegments[i][0] + dSidePointsB[i][0] - camPos[0], this.bodySegments[i][1] + dSidePointsB[i][1] - camPos[1]);
        endShape();
    }

    Move()
    {
        if (this.moveAngle > PI || this.moveAngle < -PI) this.moveAngle -= Math.sign(this.moveAngle) * 2 * PI;
        let dv = [this.cMoveSpeed * cos(this.moveAngle), this.cMoveSpeed * sin(this.moveAngle)];
        this.headPos = [this.headPos[0] + dv[0], this.headPos[1] - dv[1]];

        this.headPos[0] = constrain(this.headPos[0], -this.constains[0], this.constains[0]);
        this.headPos[1] = constrain(this.headPos[1], -this.constains[1], this.constains[1]);

        this.camPos = [(this.headPos[0] - this.camPos[0]) * this.camLerpSpeed + this.camPos[0], (this.headPos[1] - this.camPos[1]) * this.camLerpSpeed + this.camPos[1]];

        let delta = [this.headPos[0] - this.bodySegments[0][0], this.headPos[1] - this.bodySegments[0][1]];
        this.moveAngle = atan(delta[1] / -delta[0])
        if (delta[0] < 0) this.moveAngle -= PI * Math.sign(delta[1]);

        let sqrDeltaM = pow(delta[0], 2) + pow(delta[1], 2);
        if (sqrDeltaM > this.minSegDistToUpdate * this.minSegDistToUpdate)
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

            let dx = this.bodySegments[i - 1][0] - this.bodySegments[i][0];
            let dy = this.bodySegments[i - 1][1] - this.bodySegments[i][1];
            let sqrDDist = dx * dx + dy * dy;

            if (sqrDDist > this.distBetweenSegments * this.distBetweenSegments)
            {
                this.bodySegments[i] = [this.bodySegments[i][0] + dx * 0.65, this.bodySegments[i][1] + dy * 0.65];
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

        this.inputAxis = [0, 0];
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
        this.inputAxis = [0, 0];
        if (keyIsDown(38) || keyIsDown(87)) this.inputAxis[1] += 1;
        if (keyIsDown(40) || keyIsDown(83)) this.inputAxis[1] -= 1;
        if (keyIsDown(39) || keyIsDown(68)) this.inputAxis[0] += 1;
        if (keyIsDown(37) || keyIsDown(65)) this.inputAxis[0] -= 1;

        if (this.inputAxis[0] * this.inputAxis[0] + this.inputAxis[1] * this.inputAxis[1] > 1)
        {
            this.inputAxis[0] *= 0.707;
            this.inputAxis[1] *= 0.707;
        }
        this.cMoveSpeed = this.baseMoveSpeed + this.inputAxis[1] * this.moveSpeed;
        if (this.inputAxis[0] != 0) this.cMoveSpeed += this.turnSpeedBoost;
        this.moveAngle += -this.inputAxis[0] * this.angularSpeed;
    }
}