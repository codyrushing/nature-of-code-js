/*
Dots with normal distribution of mass
Gravity, with rapelling forces on the edge
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

const numDots = 20;
const gravity = new Vec2(0, 0.5);

const massScale = d3.scaleLinear()
  .domain([0, 1])
  .range([5, 30])
  .clamp(true);

const massDistribution = d3.randomNormal(0.5, 0.25);
const center = new Vec2(width/2, height/2);

class Dot {
  constructor({position, velocity, mass, acceleration=new Vec2(0,0), i=null}){
    this.position = position;
    this.velocity = velocity;
    this.initialVelocity = velocity.clone();
    this.acceleration = acceleration;
    this.mass = mass;
    this.i = i;
  }
  update(){
    // add the two forces together to get net force, which is used to derive acceleration
    this.checkEdges();
    this.acceleration = this.getAcceleration();
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration).truncate(20);
    this.draw();
  }
  getAcceleration(){
    const rappelVector = center.clone().subtract(this.position);
    const baseAcceleration = gravity.clone();
    const neutralRadius = 100;
    const rappelVectorLength = rappelVector.length();
    return rappelVectorLength > neutralRadius
      ? baseAcceleration
        .add(
          rappelVector.normalize()
            .scale(
              (rappelVectorLength - neutralRadius) * 0.1 * 1/this.mass
            )
            .truncate(5)
        )
      : baseAcceleration;
  }
  checkEdges(){
    if(this.position.x >= width || this.position.x <= 0){
      this.velocity.x *= -1;
      this.velocity.x += this.acceleration.x;
    }
    if(this.position.y >= height || this.position.y <= 0){
      this.velocity.y *= -1;
      this.velocity.y += this.acceleration.y;
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

// init Dots
const vStart = new Vec2(
  Math.random(),
  Math.random()
);
const posStart = new Vec2(
  Math.random() * width,
  Math.random() * height
);
const dots = d3.range(numDots).map(
  (v, i) => new Dot(
    {
      position: posStart.clone(),
      velocity: vStart.clone().scale(5),
      mass: massScale(massDistribution()),
      i
    }
  )
);

d3.timer(
  t => {
    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    dots.forEach(
      dot => dot.update()
    );

  }
);
