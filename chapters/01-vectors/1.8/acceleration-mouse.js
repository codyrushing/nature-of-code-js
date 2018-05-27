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

// set initial mouse position
var mousePosition = new Vec2(width/2, height/2);

canvas.addEventListener(
  'mousemove',
  function(e){
    mousePosition = new Vec2(
      e.clientX,
      e.clientY
    );
  }
)

document.body.appendChild(canvas);
document.body.appendChild(hiddenCanvas);

hiddenContext.globalAlpha = 0.6;

const numDots = 20;
const dotSize = 8;

class Dot {
  constructor({position, velocity}){
    this.position = position;
    this.velocity = velocity;
  }
  update(){
    this.acceleration = mousePosition.clone().subtract(this.position);
    // elasticity effect, as you get furter away, greater force
    this.acceleration
      .scale(0.001);
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    if(this.position.x > width || this.position.x <= 0){
      this.velocity.x *= -1;
    }
    if(this.position.y > height || this.position.y <= 0){
      this.velocity.y *= -1;
    }
    // friction
    // this.velocity.scale(0.99);
    // important to truncate, otherwise velocities can exceed the bounds of the screen and dots basically disappear
    this.velocity.truncate(10);
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
