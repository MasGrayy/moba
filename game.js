/* MAP */
const MAP_W = 2200, MAP_H = 1400;

/* ELEMENT */
const map = document.getElementById("map");
const heroEl = document.getElementById("hero");
const enemyEl = document.getElementById("enemy");
const jungleEl = document.getElementById("jungle");
const goldUI = document.getElementById("gold");
const statusUI = document.getElementById("status");
const towerBox = document.getElementById("towers");
const minionBox = document.getElementById("minions");
const bulletBox = document.getElementById("bullets");

/* BASE */
const basePlayer = { x:100, y:640, hp:500 };
const baseEnemy  = { x:2000, y:640, hp:500 };

document.getElementById("base-player").style.transform =
  `translate(${basePlayer.x}px,${basePlayer.y}px)`;
document.getElementById("base-enemy").style.transform =
  `translate(${baseEnemy.x}px,${baseEnemy.y}px)`;

/* HERO */
let heroX=300, heroY=700;
let enemyX=1700, enemyY=700;
let gold=0;
let heroStat={hp:300, atk:20, speed:5};

/* LANE */
const LANES=[400,700,1000];

/* TOWER */
let towers=[];
LANES.forEach(y=>{
  const t=document.createElement("div");
  t.className="tower";
  towerBox.appendChild(t);
  towers.push({el:t,x:1100,y,hp:200});
});

/* SKILL */
const skills={
  s1:{cd:2000,last:0},
  s2:{cd:4000,last:0},
  s3:{cd:6000,last:0},
  ult:{cd:10000,last:0}
};
function useSkill(s){
  if(Date.now()-skills[s].last<skills[s].cd) return;
  skills[s].last=Date.now();
  if(s==="s1") shoot(enemyX,enemyY);
  if(s==="s2"){ heroX+=Math.cos(angle)*120; heroY+=Math.sin(angle)*120; }
  if(s==="s3") aoe(100,15);
  if(s==="ult") aoe(200,40);
}

/* JOYSTICK */
const joystick=document.getElementById("joystick");
const stick=document.getElementById("stick");
let angle=0,power=0,drag=false,R=40;
joystick.addEventListener("touchstart",()=>drag=true,{passive:false});
joystick.addEventListener("touchmove",e=>{
  if(!drag) return;
  const t=e.touches[0], r=joystick.getBoundingClientRect();
  let dx=t.clientX-(r.left+r.width/2);
  let dy=t.clientY-(r.top+r.height/2);
  const d=Math.min(Math.hypot(dx,dy),R);
  power=d/R; angle=Math.atan2(dy,dx);
  stick.style.transform=`translate(${Math.cos(angle)*d}px,${Math.sin(angle)*d}px)`;
},{passive:false});
joystick.addEventListener("touchend",()=>{
  drag=false; power=0; stick.style.transform="translate(0,0)";
},{passive:false});

/* MINION */
let minions=[];
setInterval(()=>{
  LANES.forEach(y=>{
    const m=document.createElement("div");
    m.className="minion";
    minionBox.appendChild(m);
    minions.push({el:m,x:200,y,hp:30});
  });
},4000);

/* BULLET */
let bullets=[];
function shoot(tx,ty){
  const b=document.createElement("div");
  b.className="bullet";
  bulletBox.appendChild(b);
  bullets.push({el:b,x:heroX,y:heroY,tx,ty});
}

/* JUNGLE */
let jungle={x:1100,y:200,hp:200};
jungleEl.style.transform=`translate(${jungle.x}px,${jungle.y}px)`;

/* ITEM */
const items=[
  {atk:10,price:100},
  {speed:2,price:80}
];
function buyItem(i){
  if(gold<items[i].price) return;
  gold-=items[i].price;
  heroStat.atk+=items[i].atk||0;
  heroStat.speed+=items[i].speed||0;
}

/* LOOP */
function loop(){
  moveHero();
  updateMinion();
  updateBullet();
  jungleLogic();
  checkWin();
  render();
  camera();
  requestAnimationFrame(loop);
}
loop();

/* LOGIC */
function moveHero(){
  heroX+=Math.cos(angle)*heroStat.speed*power;
  heroY+=Math.sin(angle)*heroStat.speed*power;
}

function updateMinion(){
  minions.forEach(m=>{
    m.x+=1;
    m.el.style.transform=`translate(${m.x}px,${m.y}px)`;
    if(m.x>baseEnemy.x){
      baseEnemy.hp-=5;
      m.el.remove();
    }
  });
}

function updateBullet(){
  bullets.forEach((b,i)=>{
    const dx=b.tx-b.x, dy=b.ty-b.y;
    const d=Math.hypot(dx,dy);
    if(d<5){
      b.el.remove(); bullets.splice(i,1); gold+=5;
    }else{
      b.x+=dx/d*6; b.y+=dy/d*6;
      b.el.style.transform=`translate(${b.x}px,${b.y}px)`;
    }
  });
}

function aoe(r,damage){
  towers.forEach(t=>{
    if(Math.hypot(t.x-heroX,t.y-heroY)<r){
      t.hp-=damage;
      if(t.hp<=0) t.el.remove();
    }
  });
}

function jungleLogic(){
  if(jungle.hp>0 && Math.hypot(heroX-jungle.x,heroY-jungle.y)<50){
    jungle.hp-=heroStat.atk;
    if(jungle.hp<=0){ heroStat.atk+=10; gold+=50; }
  }
}

function checkWin(){
  statusUI.textContent=`Base Enemy HP: ${baseEnemy.hp}`;
  if(baseEnemy.hp<=0){ alert("YOU WIN"); location.reload(); }
  if(basePlayer.hp<=0){ alert("YOU LOSE"); location.reload(); }
}

function render(){
  heroEl.style.transform=`translate(${heroX}px,${heroY}px)`;
  enemyEl.style.transform=`translate(${enemyX}px,${enemyY}px)`;
  goldUI.textContent="💰 "+gold;
}

function camera(){
  map.style.transform=
    `translate(${-heroX+innerWidth/2}px,${-heroY+innerHeight/2}px)`;
}
