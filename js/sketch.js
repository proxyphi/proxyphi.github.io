let x = 100;
let y = 0;
let vx = 0;
let vy = 6;
const CANVAS_WIDTH = 200;

let angles;
let prob = 0.23;
let decay = 1.18;
let regen = 1.17;

let ellipses;
let velocity;

let cnv;

function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function setup() {
  cnv = createCanvas(CANVAS_WIDTH, document.documentElement.scrollHeight);
  positionCanvas(cnv, 0, 0);
  fill(color('#fac73a'));
  velocity = createVector(vx, vy);
  ellipses = [
    [x, y, velocity]  
  ];

  angles = [HALF_PI];
}

function updatePos(e) {
  if (e[0] < 0 || e[0] > 400) {
    e[2].x = -e[2].x;
  }
  
  e[0] = e[0] + e[2].x;
  e[1] = e[1] + e[2].y;
}

function branchEllipse(e) {
  let new_e = [...e];
  new_e[2] = createVector(e[2].x, e[2].y);

  let angle = sample(angles);
  new_e[2].rotate(angle);
  e[2].rotate(-angle);
  
  return [e, new_e];
}

function draw() {
  noStroke();
  smooth();
  let new_ellipses = [];
  
  for (let e of ellipses) {
    ellipse(e[0], e[1], 2, 2);
    updatePos(e);
    
    let is_travelling_up = e[2].y < 0;
    let is_outside_vertical_bounds = e[1] < 0 || e[1] > document.documentElement.scrollHeight;
    let is_horizontal_and_out_of_bounds = (e[0] < 0 || e[0] > 400) && (e[2].x == vy || e[2].x == -vy);

    if (is_travelling_up || is_outside_vertical_bounds || is_horizontal_and_out_of_bounds) {
        prob = prob * regen;
        continue;
    }

    if (Math.random() < prob) {
      prob = prob / decay;
      let eps = branchEllipse(e);
      new_ellipses.push(eps[0]);
      new_ellipses.push(eps[1]);
    } else {
      new_ellipses.push(e);
    }
  }
  
  ellipses = new_ellipses;
}

function positionCanvas(cnv, x, y) {
    cnv.position(x, y);
}

function windowResized() {
  resizeCanvas(CANVAS_WIDTH, document.documentElement.scrollHeight, true);
}