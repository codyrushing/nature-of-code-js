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

hiddenContext.globalAlpha = 0.5;

class Ship extends Mover {
  constructor(params){
    super(params);
    this.angle = params.angle;
    document.addEventListener(
      'keydown',
      e => {
        if(e.which === 37){
          this.turning = -1;
        }
        else if(e.which === 38){
          this.thrusting = 1;
        }
        else if(e.which === 39){
          this.turning = 1;
        }
        else if(e.which === 40){
          this.thrusting = -1;
        }
      }
    );
    document.addEventListener(
      'keyup',
      e => {
        this.turning = null;
        this.thrusting = null;
      }
    );
  }

  checkEdges(){
    if(this.position.x < 0){
      this.position.x += width;
    }
    if(this.position.x > width){
      this.position.x -= width;
    }
    if(this.position.y < 0){
      this.position.y += height;
    }
    if(this.position.y > height){
      this.position.y -= height;
    }
  }

  update(){
    this.checkEdges();
    if(this.turning){
      this.angle += 0.05 * this.turning;
    }
    this.acceleration = this.thrusting
      ? new Vec2(Math.cos(this.angle), Math.sin(this.angle)).scale(0.1 * this.thrusting)
      : new Vec2(0,0);
    this.velocity.add(this.acceleration).truncate(15);
    this.position.add(this.velocity);
    this.draw();
  }
  draw(){
    const shipSize = 20;
    context.save();
    context.translate(...this.position.toArray());
    context.rotate(this.angle);
    context.beginPath();
    context.moveTo(-shipSize/3, -shipSize/3);
    context.lineTo(shipSize, 0);
    context.lineTo(-shipSize/3, shipSize/3);
    context.fill();
    context.stroke();
    context.closePath();
    context.restore();
  }
}

const s = new Ship({
  position: new Vec2(width/2, height/2),
  velocity: new Vec2(0,0),
  angle: 0
})

d3.timer(
  t => {
    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    context.save();
    context.translate(...s.position.toArray());
    context.restore();

    s.update();

  },

);
