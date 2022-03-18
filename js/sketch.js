let x = 62;
let y = 0;
let vx = 0;
let vy = 24;
const CANVAS_WIDTH = 125;

let angles;
let prob = 0.23;
let decay = 1.28;
let regen = 1.3;

let ellipses;
let velocity;

let cnv;

function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function ramp(a, b) {
    return Math.max(a, Math.min(b, frameCount / 50));
}

function bezier_ramp(x0, y0, x1, y1) {
    let t = Math.max(0., Math.min(1.0, frameCount / 20));

    let p0 = createVector(0, 0);
    let p1 = createVector(x0, y0);
    let p2 = createVector(x1, y1);

    p0.mult((1 - t)**2);
    p1.mult(2*(1 - t)*t);
    p2.mult(t**2);
    
    let p3 = p5.Vector.add(p0, p1);
    p3.add(p2);

    return p3.y;
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

    e[0] = e[0] + bezier_ramp(0.0, 0.2, 1.0, 1.0) * e[2].x;
    e[1] = e[1] + bezier_ramp(0.0, 0.2, 1.0, 1.0) * e[2].y;
    //e[0] = e[0] + e[2].x;
    //e[1] = e[1] + e[2].y;
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
        let size = ramp(0.0, 1.0) + 3;
        ellipse(e[0], e[1], size, size);
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