let symbols = [];

let cols = 5;
let rows = 4;
let spacing = 140;
let size = 80;

function preload() {
  for (let i = 1; i < 20; i++) {
    let dongbaImg = loadImage(`assets/dongba/${i}.png`);
    let pixelImg = loadImage(`assets/pixel/${i}.png`);

    symbols.push({
      dongba: dongbaImg,
      pixel: pixelImg,
      state: 0, // 0 = dongba, 1 = pixel
      x: 0,
      y: 0
    });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  let startX = width / 2 - ((cols - 1) * spacing) / 2;
  let startY = height / 2 - ((rows - 1) * spacing) / 2;

  let index = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      symbols[index].x = startX + x * spacing;
      symbols[index].y = startY + y * spacing;
      index++;
    }
  }
}

function draw() {
  background(245);

  for (let s of symbols) {
    if (s.state === 0) {
      image(s.dongba, s.x, s.y, size, size);
    } else {
      image(s.pixel, s.x, s.y, size, size);
    }
  }
}

function mousePressed() {
  for (let s of symbols) {
    let d = dist(mouseX, mouseY, s.x, s.y);
    if (d < size / 2) {
      s.state = 1 - s.state; // 状态切换
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}