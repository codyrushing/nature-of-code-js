/*
Helium balloons accelerating updwards with some perlin noise wind
*/

import * as d3 from 'd3';
import Vec2 from '../../base/vector';
import Mover from '../../base/mover';

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

hiddenContext.globalAlpha = 0.1;

var projectiles = [];

const aXScale = d3.scaleLinear()
  .domain([0,1])
  .range([5,50]);

const aYScale = d3.scaleLinear()
  .domain([0,1])
  .range([-5,-50]);

const gravity = new Vec2(0, 0.5);
const groundElasticFactor = 0.8;

class Projectile extends Mover {
  constructor(params){
    super(params);
    this.aPosition = 0;
  }
  update(){
    this.checkEdges([width, height], groundElasticFactor);
    this.acceleration = gravity;
    this.velocity.add(this.acceleration);
    // this.aVelocity = this.velocity.length()/50;
    this.position.add(this.velocity);
    // this.aPosition += this.aVelocity;
    this.draw();
  }
  draw(){
    context.save();
    context.beginPath();
    context.translate(this.position.x, this.position.y);
    context.rotate(Math.atan2(this.velocity.y, this.velocity.x));
    context.rect(-15, -2, 30, 4);
    context.fillStyle = 'red';
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();
    context.restore();
  }
}

// create new projectiles on an interval
const launch = () => {
  const p = new Projectile({
    position: new Vec2(0, height),
    velocity: new Vec2(
      aXScale(Math.random()),
      aYScale(Math.random())
    )
  })

  projectiles.push(p);

  setTimeout(
    () => {
      projectiles = projectiles.filter(pr => pr !== p)
    },
    5000
  );
};
launch();
setInterval(
  launch,
  500
);

d3.timer(
  t => {
    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    projectiles.forEach(
      p => p.update()
    );

  },

);
