/*
Helium balloons accelerating updwards with some perlin noise wind
*/

import * as d3 from 'd3';
import Vec2 from '../../../base/vector';
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

const numDots = 25;
const dotSize = 20;

const balloonLiftForce = new Vec2(0, -0.1);
var windForce = new Vec2(0, 0);

class Dot {
  constructor({position, velocity, acceleration=new Vec2(0,0)}){
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
  }
  update(){
    this.acceleration = balloonLiftForce.add(windForce);
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.checkEdges();
    this.draw();
  }
  checkEdges(){
    if(this.position.x >= width || this.position.x <= 0){
      this.velocity.x *= -1;
      this.position.x = this.position.x > 0
        ? width - 1
        : 1;
    }
    if(this.position.y >= height || this.position.y <= 0){
      this.velocity.y *= -1;
      this.position.y = this.position.y > 0
        ? height - 1
        : 1;
    }
  }
  draw(){
    context.beginPath();
    context.fillStyle = 'red';
    context.arc(this.position.x, this.position.y, dotSize, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();
  }
}


const dots = d3.range(numDots).map(
  () => new Dot(
    {
      position: new Vec2(
        Math.random() * width,
        Math.random() * height
      ),
      velocity: new Vec2(
        0,
        0
      )
    }
  )
);

d3.timer(
  t => {
    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    windForce = new Vec2(
      noise.perlin2(t/1000, 0) * 0.0001,
      noise.perlin2(0, t/1000) * 0.0001
    );

    dots.forEach(
      dot => dot.update()
    );
  }
);
