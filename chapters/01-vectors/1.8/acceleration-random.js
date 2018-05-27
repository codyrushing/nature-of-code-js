import * as d3 from 'd3';
import Vec2 from '../../../base/vector';

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

const numDots = 50;
const dotSize = 8;

class Dot {
  constructor({position, velocity, acceleration}){
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
  }
  update(){
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    if(this.position.x > width || this.position.x <= 0){
      this.velocity.x *= -1;
    }
    if(this.position.y > height || this.position.y <= 0){
      this.velocity.y *= -1;
    }
    this.acceleration = new Vec2(
      (Math.random() - 0.5) * 2 * width/2000,
      (Math.random() - 0.5) * 2 * height/2000,
    );
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
        (Math.random() - 0.5) * 2 * width/200,
        (Math.random() - 0.5) * 2 * height/200,
      ),
      acceleration: new Vec2(
        (Math.random() - 0.5) * 2 * width/10000,
        (Math.random() - 0.5) * 2 * height/10000,
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
    dots.forEach(
      dot => dot.update()
    );
  }
);
