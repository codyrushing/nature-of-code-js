/*
draw a square that walks around
it is more likely to take a small step than a large step
*/

import * as d3 from 'd3';

const screenDimensions = [
  window.innerWidth,
  window.innerHeight
];

const [ width, height ] = screenDimensions;

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

document.body.appendChild(canvas);

var position;
const maxStepSize = 100;

// returns a value from -1 to 1
function getStepSize(){
  while(true){
    const v = Math.random();
    const p = Math.random();
    if(p > v){
      return v;
    }
  }
}

function getPosition(currentPosition=[width/2,height/2]){
  return currentPosition.map(
    (coord, i) => {
      coord += getStepSize() * ((Math.random() > 0.5) ? 1 : -1) * maxStepSize;
      return coord > screenDimensions[i] || coord < 0
        ? Math.abs(coord - screenDimensions[i])
        : coord;
    }
  );
}

d3.interval(
  t => {
    position = getPosition(position);
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.rect(...position, 10, 10);
    context.fill();
  },
  50
);
