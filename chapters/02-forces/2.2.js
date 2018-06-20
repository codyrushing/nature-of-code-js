/*
Helium balloons accelerating updwards with some perlin noise wind
*/

import * as d3 from 'd3';
import Vec2 from '../../base/vector';
import { Noise } from 'noisejs';

const noise = new Noise(Math.random());

const screenDimensions = [
  window.innerWidth,
  window.innerHeight
];
const [ width, height ] = screenDimensions;

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.setAttribute('width', width);
canvas.setAttribute('height', height);
const hiddenCanvas = document.createElement('canvas');
const hiddenContext = hiddenCanvas.getContext('2d');
hiddenCanvas.setAttribute('width', width);
hiddenCanvas.setAttribute('height', height);
hiddenCanvas.style.display = 'none';

document.body.appendChild(canvas);
document.body.appendChild(hiddenCanvas);

hiddenContext.globalAlpha = 0.6;

const numDots = 1;

const balloonLiftForce = new Vec2(0, 0.92383984984924);
var windForce = new Vec2(0, 0);
const groundElasticFactor = .5;

const massScale = d3.scaleLinear()
  .domain([0, 1])
  .range([5, 30])
  .clamp(true);

const massDistribution = d3.randomNormal(0.5, 0.25);

class Dot {
  constructor({position, velocity, mass, acceleration=new Vec2(0,0), i=null}){
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
    this.i = i;
  }
  update(){
    // add the two forces together to get net force, which is used to derive acceleration
    this.acceleration = balloonLiftForce.clone().add(
      windForce.clone()
        // acceleration is inversely porportional to mass
        .scale(1/this.mass)
        .scale(0)
    );
    this.checkEdges();

    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.draw();
  }

  checkEdges(){
    if(this.position.x >= width || this.position.x <= 0){
      let overlap = this.position.x > 0
        ? this.position.x - width
        : Math.abs(this.position.x);
      this.velocity.x *= -(typeof groundElasticFactor !== 'undefined' ? groundElasticFactor : 1);
      if(this.velocity.x < overlap){
        this.velocity.normalize().scale(overlap);
      }
      this.velocity.x += this.acceleration.x;
    }
    if(this.position.y >= height || this.position.y <= 0){
      let overlap = this.position.y > 0
        ? this.position.y - height
        : this.position.y;
      this.velocity.y *= -(typeof groundElasticFactor !== 'undefined' ? groundElasticFactor : 1);
      if(
        (this.position.y < 0 && this.velocity.y < 0)
        ||
        (this.position.y > 0 && this.velocity.y > 0)
      ){
        this.velocity.y *= -1;
      }
    }
  }
  draw(){
    context.beginPath();
    context.fillStyle = 'red';
    context.arc(this.position.x, this.position.y, this.mass, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();
  }
}

const dots = d3.range(numDots).map(
  (v, i) => new Dot(
    {
      position: new Vec2(
        Math.random() * width,
        Math.random() * height
      ),
      velocity: new Vec2(
        0,
        0
      ),
      mass: massScale(massDistribution()),
      i
    }
  )
);

const drawWindArrow = () => {
  // draw an arrow to show the wind vector
  const windArrowForce = windForce.clone().scale(200);
  const targetCenter = new Vec2(
    width - 80,
    height - 20
  );
  const arrowHeadSize = 6;
  const arrowOrigin = targetCenter.add(windArrowForce.clone().scale(-0.5));
  const angle = Math.atan2(windArrowForce.y, windArrowForce.x);
  const point1 = new Vec2(
    arrowOrigin.x + windArrowForce.x,
    arrowOrigin.y + windArrowForce.y
  );
  // begin arrow triangle out to the right
  const point2 = point1.clone().add(
    new Vec2(
      Math.cos(angle + Math.PI / 2) * arrowHeadSize/2,
      Math.sin(angle + Math.PI / 2) * arrowHeadSize/2
    )
  );
  // tip of the arrow
  const point3 = point2.clone().add(
    new Vec2(
      Math.cos(angle - Math.PI / 6) * arrowHeadSize,
      Math.sin(angle - Math.PI / 6) * arrowHeadSize
    )
  );
  // left tip of arrow
  const point4 = point3.clone().add(
    new Vec2(
      Math.cos(angle - Math.PI * 5 / 6) * arrowHeadSize,
      Math.sin(angle - Math.PI * 5 / 6) * arrowHeadSize
    )
  );
  // back to end of vector
  const point5 = point4.clone().add(
    new Vec2(
      Math.cos(angle + Math.PI / 2) * arrowHeadSize/2,
      Math.sin(angle + Math.PI / 2) * arrowHeadSize/2
    )
  );

  // draw an arrow indicating the wind
  context.beginPath();
  context.moveTo(arrowOrigin.x, arrowOrigin.y);
  context.lineTo(...point1.toArray());
  context.lineTo(...point2.toArray());
  context.lineTo(...point3.toArray());
  context.lineTo(...point4.toArray());
  context.lineTo(...point5.toArray());
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
}

d3.timer(
  t => {
    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    // vertical wind is 10% of horizontal wind
    windForce = new Vec2(
      noise.simplex2(t/5000, 0) * 0.3,
      noise.simplex2(0, t/5000) * 0.3 * 0.1
    );

    dots.forEach(
      dot => dot.update()
    );

    drawWindArrow();
  }
);
