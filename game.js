const hero = document.getElementById("hero");

/* POSISI */
let x = 150;
let y = 150;
const speed = 4;

/* AXIS */
let axisX = 0;
let axisY = 0;

/* ================= KEYBOARD (PC) ================= */
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

/* ================= JOYSTICK (HP) ================= */
const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let dragging = false;
const RADIUS = 40;

joystick.addEventListener("touchstart", () => {
    dragging = true;
});

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

/* ================= GAME LOOP ================= */
function loop() {
    x += axisX * speed;
    y += axisY * speed;

    hero.style.left = x + "px";
    hero.style.top = y + "px";

    requestAnimationFrame(loop);
}

loop();
