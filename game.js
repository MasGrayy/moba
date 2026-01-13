/* ================= ELEMENT ================= */
const map = document.getElementById("map");
const hero = document.getElementById("hero");

/* ================= HERO DATA ================= */
let heroX = 500;
let heroY = 500;

const HERO_SIZE = 46;
const SPEED = 5;

const MAP_W = 2000;
const MAP_H = 1200;

/* ================= JOYSTICK ================= */
const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let dragging = false;
let angle = 0;
let power = 0;
const RADIUS = 40;

/* MATIKAN SCROLL TOTAL */
document.body.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

joystick.addEventListener("touchstart", e => {
    e.preventDefault();
    dragging = true;
}, { passive: false });

joystick.addEventListener("touchmove", e => {
    e.preventDefault();
    if (!dragging) return;

    const touch = e.touches[0];
    const rect = joystick.getBoundingClientRect();

    let dx = touch.clientX - (rect.left + rect.width / 2);
    let dy = touch.clientY - (rect.top + rect.height / 2);

    const dist = Math.hypot(dx, dy);
    power = Math.min(dist / RADIUS, 1);

    angle = Math.atan2(dy, dx);

    const clampedX = Math.cos(angle) * Math.min(dist, RADIUS);
    const clampedY = Math.sin(angle) * Math.min(dist, RADIUS);

    stick.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
}, { passive: false });

joystick.addEventListener("touchend", e => {
    e.preventDefault();
    dragging = false;
    power = 0;
    stick.style.transform = "translate(0,0)";
}, { passive: false });

/* ================= GAME LOOP ================= */
function loop() {
    moveHero();
    camera();
    requestAnimationFrame(loop);
}
loop();

/* ================= HERO MOVE ================= */
function moveHero() {
    if (power > 0.05) {
        heroX += Math.cos(angle) * SPEED * power;
        heroY += Math.sin(angle) * SPEED * power;
    }

    heroX = Math.max(0, Math.min(MAP_W - HERO_SIZE, heroX));
    heroY = Math.max(0, Math.min(MAP_H - HERO_SIZE, heroY));

    hero.style.left = heroX + "px";
    hero.style.top = heroY + "px";
}

/* ================= CAMERA ================= */
function camera() {
    const camX = Math.min(0, Math.max(window.innerWidth - MAP_W, -heroX + window.innerWidth / 2));
    const camY = Math.min(0, Math.max(window.innerHeight - MAP_H, -heroY + window.innerHeight / 2));

    map.style.left = camX + "px";
    map.style.top = camY + "px";
}
