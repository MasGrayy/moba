/* HERO DATA */
const HERO = {
  tank:{hp:600,atk:15,speed:4},
  mage:{hp:350,atk:30,speed:5},
  marksman:{hp:400,atk:25,speed:6}
};

let heroStat, heroX=300, heroY=750;
let enemyX=2000, enemyY=750;
let gold=0;

/* START */
function startGame(type){
  heroStat={...HERO[type]};
  document.getElementById("select").classList.add("hide");
  document.getElementById("game").classList.remove("hide");
}

/* ELEMENT */
const map=document.getElementById("map");
const heroEl=document.getElementById("hero");
const enemyEl=document.getElementById("enemy");
const bulletBox=document.getElementById("bullets");
const minionBox=document.getElementById("minions");
const goldUI=document.getElementById("gold");

/* BASE */
let baseEnemy={x:2200,y:700,hp:800};
document.getElementById("base-player").style.transform=`translate(100px,700px)`;
document.getElementById("base-enemy").style.transform=`translate(${baseEnemy.x}px,${baseEnemy.y}px)`;

/* SKILL */
const skills={
 s1:{cd:1500,last:0},
 s2:{cd:3000,last:0},
 s3:{cd:5000,last:0},
 ult:{cd:9000,last:0}
};
function useSkill(s){
 if(Date.now()-skills[s].last<skills[s].cd)return;
 skills[s].last=Date.now();
 if(s==="s1")shoot(enemyX,enemyY);
 if(s==="s2"){heroX+=Math.cos(angle)*150;heroY+=Math.sin(angle)*150}
 if(s==="s3")aoe(120,20);
 if(s==="ult")aoe(220,50);
}

/* JOYSTICK */
const joystick=document.getElementById("joystick");
const stick=document.getElementById("stick");
let angle=0,power=0,drag=false,R=40;
joystick.addEventListener("touchstart",()=>drag=true,{passive:false});
joystick.addEventListener("touchmove",e=>{
 if(!drag)return;
 const t=e.touches[0],r=joystick.getBoundingClientRect();
 let dx=t.clientX-(r.left+r.width/2);
 let dy=t.clientY-(r.top+r.height/2);
 const d=Math.min(Math.hypot(dx,dy),R);
 power=d/R;angle=Math.atan2(dy,dx);
 stick.style.transform=`translate(${Math.cos(angle)*d}px,${Math.sin(angle)*d}px)`;
},{passive:false});
joystick.addEventListener("touchend",()=>{drag=false;power=0;stick.style.transform="translate(0,0)"},{passive:false});

/* MINION */
let minions=[];
setInterval(()=>{
 for(let i=0;i<3;i++){
  const m=document.createElement("div");
  m.className="minion";
  minionBox.appendChild(m);
  minions.push({el:m,x:200,y:400+i*300,hp:40});
 }
},4000);

/* BULLET */
let bullets=[];
function shoot(tx,ty){
 const b=document.createElement("div");
 b.className="bullet";
 bulletBox.appendChild(b);
 bullets.push({el:b,x:heroX,y:heroY,tx,ty});
}

/* ITEM */
const items=[
 {atk:10,price:120},
 {speed:2,price:100},
 {atk:20,price:200}
];
function buyItem(i){
 if(gold<items[i].price)return;
 gold-=items[i].price;
 heroStat.atk+=items[i].atk||0;
 heroStat.speed+=items[i].speed||0;
}

/* LOOP */
function loop(){
 moveHero();
 enemyAI();
 updateMinion();
 updateBullet();
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
function enemyAI(){
 const dx=heroX-enemyX,dy=heroY-enemyY,d=Math.hypot(dx,dy);
 if(d<350){enemyX+=dx/d*2;enemyY+=dy/d*2;}
}
function updateMinion(){
 minions.forEach(m=>{
  m.x+=1.2;
  m.el.style.transform=`translate(${m.x}px,${m.y}px)`;
  if(m.x>baseEnemy.x){
   baseEnemy.hp-=5;m.el.remove();
  }
 });
}
function updateBullet(){
 bullets.forEach((b,i)=>{
  const dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);
  if(d<5){b.el.remove();bullets.splice(i,1);gold+=5;}
  else{b.x+=dx/d*6;b.y+=dy/d*6;b.el.style.transform=`translate(${b.x}px,${b.y}px)`;}
 });
}
function aoe(r,dmg){
 minions.forEach(m=>{
  if(Math.hypot(m.x-heroX,m.y-heroY)<r){
   m.hp-=dmg;
   if(m.hp<=0){m.el.remove();gold+=10;}
  }
 });
}
function checkWin(){
 if(baseEnemy.hp<=0){alert("VICTORY");location.reload();}
}
function render(){
 heroEl.style.transform=`translate(${heroX}px,${heroY}px)`;
 enemyEl.style.transform=`translate(${enemyX}px,${enemyY}px)`;
 goldUI.textContent="💰 "+gold;
}
function camera(){
 map.style.transform=`translate(${-heroX+innerWidth/2}px,${-heroY+innerHeight/2}px)`;
}
