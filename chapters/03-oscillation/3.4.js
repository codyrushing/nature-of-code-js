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

hiddenContext.globalAlpha = 1;

var r = 0;
var angle = 0;

d3.timer(
  t => {
    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    const origin = new Vec2(width/2, height/2);
    const target = new Vec2(Math.cos(angle) * r, Math.sin(angle) * r);

    context.save();
    context.beginPath();
    context.translate(...origin.toArray());
    context.arc(target.x, target.y, 10, 0, Math.PI * 2);
    context.stroke();
    context.fill();
    context.restore();

    r += 0.5;
    angle += 0.1;

  },

);
