import * as d3 from 'd3';
import Vec2 from '../../base/vector';

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

hiddenContext.globalAlpha = 0.5;

const velocity = 0.01;

class Oscillator {
  constructor({x}){
    this.x = x;
    this.angle = x * velocity;
  }
  update(){
    // angle keeps increasing, which is fine because we are just taking the sin() cos() of it
    this.angle += velocity;
    this.x += Math.cos(velocity);
    if(this.x > width){
      this.x -= width;
      this.angle = 0;
    }
    this.draw();
  }
  draw(){
    context.beginPath();
    context.fillStyle = 'red';
    context.arc(
      this.x,
      (height/2-5) + Math.sin(this.angle) * height/2,
      10,
      0,
      2 * Math.PI
    );
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();
  }
}

const numOfDots = 100;

const dots = d3.range(numOfDots).map(
  (item, i) => {
    return new Oscillator({
      x: width/numOfDots/2 + width/numOfDots * i+1
    });
  }
);

d3.timer(
  t => {
    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);
    dots.forEach(d => d.update());
  }
);
