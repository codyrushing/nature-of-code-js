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

const amplitude = height/4;

// so instead of boiling everything down to a position vector
// our goal is to boil everything down to an angle, and then deriving x and y position from that
// 
class Oscillator {
  constructor({velocity, acceleration, angle, amplitude}){
    this.velocity = velocity;
    this.angle = angle;
    this.amplitude = amplitude;
    this.acceleration = acceleration;
  }
  update(){
    // angle keeps increasing, which is fine because we are just taking the sin() cos() of it
    this.velocity = this.velocity.add(this.acceleration).truncate(0.05);
    this.angle.add(this.velocity);
    this.draw();
  }
  draw(){
    const x = Math.cos(this.angle.x) * this.amplitude.x;
    const y = Math.sin(this.angle.y) * this.amplitude.y;
    context.save();
    context.translate(width/2, height/2);
    context.beginPath();
    context.lineTo(0, 0);
    context.fillStyle = 'red';
    context.arc(
      x,
      y,
      10,
      0,
      2 * Math.PI
    );
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();
    context.restore();
  }
}

const numOfDots = 20;

const dots = d3.range(numOfDots).map(
  () => {
    const vMultiplier = 1;
    return new Oscillator({
      // random 2d vector, analagous for position
      angle: new Vec2(Math.random(), Math.random()),
      // another random vector that will be used to change velocity
      acceleration: new Vec2(Math.random(), Math.random()).scale(vMultiplier),
      // starting velocity of 0
      velocity: new Vec2(0,0),
      // distance from center
      amplitude: new Vec2(Math.random() * width/2, Math.random() * height/2)
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
