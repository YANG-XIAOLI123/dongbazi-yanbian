let symbols = [];

const COUNT = 20;        // 20个
const START = 1;         // 文件名从 1.png 开始
const COLS = 5;          // 5列

let spacing = 140;
let cellSize = 90;

let labels = [
  "uomo",
  "donna",
  "vomitare",
  "strofinare",
  "indossare",
  "rituale",
  "re",
  "madre",
  "lavare",
  "dire",
  "frutto",
  "montagna innevata",
  "luna",
  "ventaglio",
  "sole",
  "fiore",
  "bocciolo",
  "autunno",
  "inverno",
  "Mabbondanza"
];

const TRANSITION_FRAMES = 18; // 转译时长：18帧≈0.3秒
const EASE_POWER = 3;         // 缓动强度，数值越大越柔
function preload() {
  for (let i = START; i < START + COUNT; i++) {
    const dongbaPath = `assets/dongba/${i}.png`;
    const pixelPath = `assets/pixel/${i}.png`;

    const dongbaImg = loadImage(
      dongbaPath,
      () => {},
      (err) => console.error("FAILED:", dongbaPath, err)
    );

    const pixelImg = loadImage(
      pixelPath,
      () => {},
      (err) => console.error("FAILED:", pixelPath, err)
    );

    symbols.push({
      id: i,
      label: labels[i - START] || `#${i}`, 

      dongba: dongbaImg,
      pixel: pixelImg,

      state: 0,   
      target: 0,  
      t: 1,    
      x: 0,
      y: 0
    });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textFont("Arial"); 
  noSmooth();        

  layoutGrid();
}

function layoutGrid() {
  const w = width;
  const h = height;

  
  const maxGridW = w * 0.9;
  const maxGridH = h * 0.72;

  const rows = Math.ceil(symbols.length / COLS);

  const spX = maxGridW / (COLS - 1);
  const spY = rows > 1 ? maxGridH / (rows - 1) : maxGridH;

  spacing = Math.min(spX, spY);
  cellSize = spacing * 0.6;

  const startX = w / 2 - ((COLS - 1) * spacing) / 2;
  const startY = h / 2 - ((rows - 1) * spacing) / 2;

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!symbols[idx]) break;
      symbols[idx].x = startX + c * spacing;
      symbols[idx].y = startY + r * spacing;
      idx++;
    }
  }
}

function draw() {
  background(245);

  
  for (const s of symbols) {
    if (s.t < 1) {
      s.t = Math.min(1, s.t + 1 / TRANSITION_FRAMES);
      if (s.t >= 1) s.state = s.target;
    }
  }

  for (const s of symbols) {
    const dongbaOk = s.dongba && s.dongba.width > 0;
    const pixelOk = s.pixel && s.pixel.width > 0;

    
    if (!dongbaOk || !pixelOk) {
      noFill();
      stroke(210);
      rectMode(CENTER);
      rect(s.x, s.y, cellSize, cellSize);

      noStroke();
      fill(160);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(`missing ${s.id}`, s.x, s.y);

      
      drawLabel(s);
      continue;
    }

    if (s.t >= 1) {
      const finalImg = s.state === 0 ? s.dongba : s.pixel;
      drawImageContain(finalImg, s.x, s.y, cellSize, cellSize);
      drawLabel(s);
      continue;
    }

    
    const p = easeInOutPow(s.t, EASE_POWER);
    const alphaIn = Math.floor(255 * p);
    const alphaOut = 255 - alphaIn;

    const scaleIn = lerp(0.98, 1.0, p);
    const scaleOut = lerp(1.0, 0.98, p);

    push();
    if (s.target === 1) {
      // dongba -> pixel
      tint(255, alphaOut);
      drawImageContainScaled(s.dongba, s.x, s.y, cellSize, cellSize, scaleOut);

      tint(255, alphaIn);
      drawImageContainScaled(s.pixel, s.x, s.y, cellSize, cellSize, scaleIn);
    } else {
      // pixel -> dongba
      tint(255, alphaOut);
      drawImageContainScaled(s.pixel, s.x, s.y, cellSize, cellSize, scaleOut);

      tint(255, alphaIn);
      drawImageContainScaled(s.dongba, s.x, s.y, cellSize, cellSize, scaleIn);
    }
    pop();
    noTint();

    drawLabel(s);
  }
}

function drawLabel(s) {
 
  noStroke();
  fill(0, 140);
  textAlign(CENTER, TOP);

  
  const fs = Math.max(11, Math.min(14, width / 90));
  textSize(fs);

  text(s.label, s.x, s.y + cellSize / 2 + 10);
}

function mousePressed() {
  for (const s of symbols) {
    const d = dist(mouseX, mouseY, s.x, s.y);
    if (d < cellSize / 2) {
      
      if (s.t < 1) return;

      s.target = 1 - s.state; 
      s.t = 0;                
      break;
    }
  }
}


function drawImageContain(img, cx, cy, boxW, boxH) {
  drawImageContainScaled(img, cx, cy, boxW, boxH, 1.0);
}

function drawImageContainScaled(img, cx, cy, boxW, boxH, scaleMul) {
  const iw = img.width;
  const ih = img.height;
  const scale = Math.min(boxW / iw, boxH / ih) * scaleMul;
  image(img, cx, cy, iw * scale, ih * scale);
}


function easeInOutPow(t, p) {
  t = constrain(t, 0, 1);
  if (t < 0.5) return 0.5 * pow(2 * t, p);
  return 1 - 0.5 * pow(2 * (1 - t), p);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layoutGrid();
}