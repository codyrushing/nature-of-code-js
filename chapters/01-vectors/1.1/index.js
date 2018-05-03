import * as d3 from 'd3';

const width = window.innerWidth;
const height = window.innerHeight;

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

const numDots = 100;

const dots = d3.range(numDots).map(
  () => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * width/100 - width/100/2,
      vy: Math.random() * height/100 - height/100/2,
    };
  }
);

d3.timer(
  t => {

    hiddenContext.clearRect(0, 0, width, height);
    hiddenContext.drawImage(canvas, 0, 0, width, height);
    context.clearRect(0, 0, width, height);
    context.drawImage(hiddenCanvas, 0, 0, width, height);

    dots.forEach(
      dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if(dot.x > width || dot.x <= 0){
          dot.vx = -dot.vx;
        }
        if(dot.y > height || dot.y <= 0){
          dot.vy = -dot.vy;
        }
        context.beginPath();
        context.fillStyle = 'red';
        context.arc(dot.x, dot.y, 4, 0, 2 * Math.PI);
        context.fill();
      }
    );
  }
)
