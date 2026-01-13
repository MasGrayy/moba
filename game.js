const map = document.getElementById("map");
const hero = document.getElementById("hero");
const enemyHero = document.getElementById("enemyHero");
const turret = document.getElementById("turret");
const minionBox = document.getElementById("minions");
const bulletBox = document.getElementById("bullets");
const goldUI = document.getElementById("gold");

/* DATA */
const MAP_W = 2000, MAP_H = 1200;
let heroX = 500, heroY = 500;
let enemyX = 900, enemyY = 500;
let turretX = 1200, turretY = 500;
let gold = 0;

/* JOYSTICK */
const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");
let angle = 0, power = 0, dragging = false;
const R = 40;

document.body.addEventListener("touchmove", e => e.preventDefault(), { passive:false });

joystick.addEventListener("touchstart", e => {
  dragging = true;
}, { passive:false });

joystick.addEventListener("touchmove", e => {
  if (!dragging) return;
  const t = e.touches[0];
  const r = joystick.getBoundingClientRect();
  let dx = t.clientX - (r.left + r.width/2);
  let dy = t.clientY - (r.top + r.height/2);
  const d = Math.min(Math.hypot(dx, dy), R);
  power = d / R;
  angle = Math.atan2(dy, dx);
  stick.style.transform = `translate(${Math.cos(angle)*d}px, ${Math.sin(angle)*d}px)`;
}, { passive:false });

joystick.addEventListener("touchend", () => {
  dragging = false;
  power = 0;
  stick.style.transform = "translate(0,0)";
}, { passive:false });

/* MINION */
let minions = [];
setInterval(() => {
  const m = document.createElement("div");
  m.className = "minion";
  minionBox.appendChild(m);
  minions.push({ el:m, x:0, y:600 });
}, 3000);

/* BULLET */
let bullets = [];
function shoot(tx, ty) {
  const b = document.createElement("div");
  b.className = "bullet";
  bulletBox.appendChild(b);
  bullets.push({ el:b, x:turretX, y:turretY, tx, ty });
}

/* GAME LOOP */
function loop() {
  moveHero();
  enemyAI();
  turretAI();
  updateMinions();
  updateBullets();
  render();
  camera();
  requestAnimationFrame(loop);
}
loop();

/* LOGIC */
function moveHero() {
  heroX += Math.cos(angle) * 5 * power;
  heroY += Math.sin(angle) * 5 * power;

  heroX = Math.max(0, Math.min(MAP_W-46, heroX));
  heroY = Math.max(0, Math.min(MAP_H-46, heroY));
}

function enemyAI() {
  const dx = heroX - enemyX;
  const dy = heroY - enemyY;
  const d = Math.hypot(dx, dy);
  if (d > 1 && d < 300) {
    enemyX += dx / d * 2;
    enemyY += dy / d * 2;
  }
}

function turretAI() {
  const d = Math.hypot(heroX-turretX, heroY-turretY);
  if (d < 400 && Math.random() < 0.02) shoot(heroX, heroY);
}

function updateMinions() {
  minions.forEach(m => {
    m.x += 1;
    m.el.style.transform = `translate(${m.x}px,${m.y}px)`;
  });
}

function updateBullets() {
  bullets.forEach((b, i) => {
    const dx = b.tx - b.x;
    const dy = b.ty - b.y;
    const d = Math.hypot(dx, dy);
    if (d < 5) {
      b.el.remove();
      bullets.splice(i,1);
      return;
    }
    b.x += dx / d * 6;
    b.y += dy / d * 6;
    b.el.style.transform = `translate(${b.x}px,${b.y}px)`;
  });
}

function render() {
  hero.style.transform = `translate(${heroX}px,${heroY}px)`;
  enemyHero.style.transform = `translate(${enemyX}px,${enemyY}px)`;
  turret.style.transform = `translate(${turretX}px,${turretY}px)`;
  goldUI.textContent = "💰 " + gold;
}

function camera() {
  const cx = Math.min(0, Math.max(innerWidth-MAP_W, -heroX + innerWidth/2));
  const cy = Math.min(0, Math.max(innerHeight-MAP_H, -heroY + innerHeight/2));
  map.style.transform = `translate(${cx}px,${cy}px)`;
}
