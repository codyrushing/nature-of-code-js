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

hiddenContext.globalAlpha = 0.5;

var angle = 0;
var aVelocity = 0;
var aAcceleration = 0.001;
var maxVelocity = 1;
d3.timer(
  t => {
    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    // akin to pushMatrix in processing
    context.save();

    context.beginPath();
    context.translate(width/2, height/2);
    context.rotate(angle);
    context.rect(-50, -2, 100, 4);
    context.fill();

    context.beginPath();
    context.arc(-50, 0, 5, 0, Math.PI * 2);
    context.arc(50, 0, 5, 10, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();

    // akin to popMatrix in processing
    context.restore();

    aVelocity += aAcceleration;
    angle += aVelocity;
    if(aVelocity > maxVelocity){
      aVelocity = maxVelocity;
    }
    // reset current transformation matrix to the identity matrix
    // context.setTransform(1, 0, 0, 1, 0, 0);
  },

);
