const CANVAS_WIDTH = 120;
let point_color = '#fac73a';
let timer = 7; // Time for render to stop

// Starting parameters of initial circle
let x = Math.floor(CANVAS_WIDTH / 2);
let y = 0;
let vx = 0;
let vy = 16;

// Affects branching behavior
// Probability of branching
let prob = 0.22;
// Every branch decays the probability of branching by this factor 
let decay = 0.75;
// Ellipses which get deleted regenerate probability with this factor
// (should probably be higher than decay, but can be slightly above to increase density
// as rendering progresses)
let regen = 0.73;

// Initialized on setup()
let angles; // Angles which branching can occur at.
let ellipses; // Holds array of ellipses.
let velocity; // Velocity of first point.
let cnv; // Canvas.
let draw_shape_fn;

// Samples an element from an array
function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Slightly cheap linear interpolation between a and b.
function ramp(a, b, speed) {
    return Math.max(a, Math.min(b, frameCount * speed));
}

// Interpolation on a quadratic bezier curve
function bezier_ramp(x0, y0, x1, y1, x2, y2, speed) {
    let t = Math.max(0., Math.min(1.0, frameCount * speed));

    let p0 = createVector(x0, y0);
    let p1 = createVector(x1, y1);
    let p2 = createVector(x2, y2);

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

    fill(color(point_color));

    velocity = createVector(vx, vy);
    ellipses = [[x, y, velocity]];
    angles = [HALF_PI];
    draw_shape_fn = sample([square, ellipse, make_triangle]);
}

function updatePos(e) {
    if (e[0] < 0 || e[0] > CANVAS_WIDTH) {
        e[2].x = -e[2].x;
    }

    let r = bezier_ramp(0.5, 0.5, 0.8, 1.0, 1.0, 1.0, 0.03);
    e[0] = e[0] + r * e[2].x;
    e[1] = e[1] + r * e[2].y;
}

function branchEllipse(e) {
    let new_e = [...e];
    new_e[2] = createVector(e[2].x, e[2].y);

    let angle = sample(angles);
    new_e[2].rotate(angle);
    e[2].rotate(-angle);
    
    return [e, new_e];
}

function make_triangle(x, y, size) {
    let x1 = x;
    let y1 = y;
    let x2 = x + size;
    let y2 = y;
    let x3 = x;
    let y3 = y + size;

    triangle(x1, y1, x2, y2, x3, y3);
}

function draw() {
    noStroke();
    smooth();
    let new_ellipses = [];

    for (let e of ellipses) {
        let shape_size = ramp(0.0, 2.0, 0.01) + 4;
        //ellipse(e[0], e[1], shape_size, shape_size);
        //square(e[0], e[1], shape_size);
        //make_triangle(e[0], e[1], shape_size);
        draw_shape_fn(e[0], e[1], shape_size);
        updatePos(e);
    
        // Deletion rules
        let is_travelling_up = e[2].y < 0;
        let is_outside_vertical_bounds = e[1] < 0 || e[1] > document.documentElement.scrollHeight;
        let is_horizontal_and_out_of_bounds = (e[0] < 0 || e[0] > CANVAS_WIDTH*1.5) && (Math.abs(e[2].x) == vy);
        // Delete point and regen some branching probability
        if (is_travelling_up || is_outside_vertical_bounds || is_horizontal_and_out_of_bounds) {
            prob = prob / regen;
            continue;
        }

        // Do branching
        if (Math.random() < prob) {
            prob = prob * decay;

            let eps = branchEllipse(e);
            new_ellipses.push(eps[0]);
            new_ellipses.push(eps[1]);
        } else {
            new_ellipses.push(e);
        }
    }

    ellipses = new_ellipses;

    // Timer logic
    if (frameCount % 60 == 0 && timer > 0) {
        timer--;
    }
    if (timer == 0) {
        noLoop();
    }
}

function positionCanvas(cnv, x, y) {
    cnv.position(x, y);
}

function windowResized() {
    //resizeCanvas(CANVAS_WIDTH, document.documentElement.scrollHeight, true);
}