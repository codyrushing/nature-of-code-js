/*
Dots with normal distribution of mass
gravity, falling into liquid.
*/

import * as d3 from 'd3';
import Vec2 from '../../base/vector';
import Mover from '../../base/mover';
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
const groundElasticFactor = 0.95;

const massScale = d3.scaleLinear()
  .domain([0, 1])
  .range([5, 30])
  .clamp(true);

const massDistribution = d3.randomNormal(0.5, 0.25);

class Dot extends Mover {
  getAcceleration(){
    if(this.position.y < height/2){
      return gravity.clone();
    }
    const viscosity = 0.1;
    const velocityMagnitude = this.velocity.length();
    return gravity.clone()
      // apply drag from liquid
      .add(
        this.velocity.clone()
          .normalize()
          .scale( -Math.pow(velocityMagnitude, 2) * viscosity / this.mass )
      );
  }
  checkEdges(){
    return super.checkEdges(screenDimensions, groundElasticFactor);
  }
  draw(){
    super.draw(context);
  }
}

// init Dots
const dots = d3.range(numDots).map(
  (v, i) => new Dot(
    {
      position: new Vec2(
        Math.random() * width,
        Math.random() * height
      ),
      velocity: new Vec2(
        Math.random() * 5,
        Math.random() * 5
      ),
      mass: massScale(massDistribution()),
      i
    }
  )
);

// draw water
context.beginPath();
context.rect(
  0,
  height/2,
  width,
  height/2
);
context.fillStyle = 'rgba(0,150,180,0.5)';
context.fill();
context.strokeStyle = 'rgba(0,150,180,1)';
context.stroke();
context.closePath();

d3.timer(
  t => {
    // draw water
    context.beginPath();
    context.rect(
      0,
      height/2,
      width,
      height/2
    );
    context.fillStyle = 'rgba(0,150,180,0.2)';
    context.fill();
    context.strokeStyle = 'rgba(0,150,180,1)';
    context.stroke();
    context.closePath();

    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    dots.forEach(
      dot => dot.update()
    );

  }
);
