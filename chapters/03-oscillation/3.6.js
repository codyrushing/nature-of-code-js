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

d3.timer(
  t => {
    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    context.save();

    context.beginPath();
    context.fillStyle = 'red';
    context.arc(
      width/2,
      Math.sin(Math.PI * 2 * t / 3000) * amplitude + amplitude,
      10,
      0,
      2 * Math.PI
    );
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();

    context.restore();
  }
);
