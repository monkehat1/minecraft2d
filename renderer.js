const fs = require('fs');
const path = require('path');

const saveDir = path.join(__dirname, 'saves');
if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);

const menu = document.getElementById('menu');
const worldList = document.getElementById('worldList');
const newWorldBtn = document.getElementById('newWorldBtn');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let world = null;
let player = null;
let currentSave = null;

// ----- Helpers -----
function listWorlds() {
  worldList.innerHTML = '';
  const files = fs.readdirSync(saveDir).filter(f => f.endsWith('.json'));
  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(saveDir, file)));
    const div = document.createElement('div');
    div.className = 'world';
    const span = document.createElement('span');
    span.textContent = data.name || file;
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play';
    playBtn.onclick = () => loadWorld(file);
    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.onclick = () => { fs.unlinkSync(path.join(saveDir,file)); listWorlds(); };
    div.appendChild(span); div.appendChild(playBtn); div.appendChild(delBtn);
    worldList.appendChild(div);
  });
}

function saveWorld() {
  if (!currentSave) return;
  const data = { name: currentSave, seed: 'demo-seed', player, world };
  fs.writeFileSync(path.join(saveDir, currentSave + '.json'), JSON.stringify(data));
}

function newWorld() {
  currentSave = 'world' + Date.now();
  player = { x: 50, y: 50 };
  world = Array(100*60).fill(0);
  startGame();
}

function loadWorld(file) {
  const data = JSON.parse(fs.readFileSync(path.join(saveDir, file)));
  currentSave = path.basename(file, '.json');
  world = data.world;
  player = data.player;
  startGame();
}

function startGame() {
  menu.style.display = 'none';
  canvas.style.display = 'block';
  resize();
  requestAnimationFrame(loop);
  setInterval(saveWorld, 10000); // autosave every 10s
}

// ----- Rendering -----
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
window.addEventListener('resize', resize);

function loop() {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#ffdd99';
  ctx.fillRect(player.x, player.y, 20, 20);
  requestAnimationFrame(loop);
}

// Init
newWorldBtn.onclick = newWorld;
listWorlds();
