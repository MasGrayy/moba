/* ================= ELEMENT ================= */
const map = document.getElementById("map");
const hero = document.getElementById("hero");
const enemy = document.getElementById("enemy");

const heroHPBar = document.getElementById("heroHP");
const enemyHPBar = document.getElementById("enemyHP");

/* ================= DATA ================= */
let heroX = 500;
let heroY = 500;
let enemyX = 650;
let enemyY = 500;

let heroHP = 100;
let enemyHP = 100;

const HERO_SIZE = 46;
const SPEED = 4;

/* MAP & SCREEN */
const MAP_W = 2000;
const MAP_H = 1200;
const SCREEN_W = window.innerWidth;
const SCREEN_H = window.innerHeight;

/* CONTROL */
let axisX = 0;
let axisY = 0;

/* ================= KEYBOARD ================= */
document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") axisX = 1;
    if (e.key === "ArrowLeft") axisX = -1;
    if (e.key === "ArrowDown") axisY = 1;
    if (e.key === "ArrowUp") axisY = -1;
});

document.addEventListener("keyup", e => {
    if (["ArrowRight", "ArrowLeft"].includes(e.key)) axisX = 0;
    if (["ArrowUp", "ArrowDown"].includes(e.key)) axisY = 0;
});

/* ================= JOYSTICK ================= */
const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");
let dragging = false;
const RADIUS = 40;

joystick.addEventListener("touchstart", () => dragging = true);

joystick.addEventListener("touchmove", e => {
    if (!dragging) return;
    const t = e.touches[0];
    const r = joystick.getBoundingClientRect();

    let dx = t.clientX - (r.left + r.width / 2);
    let dy = t.clientY - (r.top + r.height / 2);

    const dist = Math.hypot(dx, dy);
    if (dist > RADIUS) {
        dx = dx / dist * RADIUS;
        dy = dy / dist * RADIUS;
    }

    axisX = dx / RADIUS;
    axisY = dy / RADIUS;

    stick.style.left = 35 + dx + "px";
    stick.style.top = 35 + dy + "px";
});

joystick.addEventListener("touchend", () => {
    dragging = false;
    axisX = axisY = 0;
    stick.style.left = "35px";
    stick.style.top = "35px";
});

/* ================= LOOP ================= */
function loop() {
    moveHero();
    camera();
    combat();
    requestAnimationFrame(loop);
}
loop();

/* ================= HERO MOVE ================= */
function moveHero() {
    heroX += axisX * SPEED;
    heroY += axisY * SPEED;

    heroX = Math.max(0, Math.min(MAP_W - HERO_SIZE, heroX));
    heroY = Math.max(0, Math.min(MAP_H - HERO_SIZE, heroY));

    hero.style.left = heroX + "px";
    hero.style.top = heroY + "px";

    enemy.style.left = enemyX + "px";
    enemy.style.top = enemyY + "px";
}

/* ================= CAMERA ================= */
function camera() {
    const camX = Math.min(0, Math.max(SCREEN_W - MAP_W, -heroX + SCREEN_W / 2));
    const camY = Math.min(0, Math.max(SCREEN_H - MAP_H, -heroY + SCREEN_H / 2));

    map.style.left = camX + "px";
    map.style.top = camY + "px";
}

/* ================= COMBAT ================= */
let cooldown = 0;

function combat() {
    if (enemyHP <= 0) return;

    const dx = heroX - enemyX;
    const dy = heroY - enemyY;
    const dist = Math.hypot(dx, dy);

    if (dist < 60 && cooldown <= 0) {
        enemyHP -= 5;
        heroHP -= 2;

        enemyHPBar.style.width = enemyHP + "%";
        heroHPBar.style.width = heroHP + "%";

        cooldown = 30;

        if (enemyHP <= 0) enemy.style.display = "none";
    }

    if (cooldown > 0) cooldown--;
}
