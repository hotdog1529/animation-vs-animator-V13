const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// resize
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// cursor
let cursor = {x:200,y:200};
const cursorEl = document.getElementById("cursor");

document.addEventListener("touchmove",(e)=>{
  let t=e.touches[0];
  cursor.x=t.clientX;
  cursor.y=t.clientY;

  cursorEl.style.left=cursor.x+"px";
  cursorEl.style.top=cursor.y+"px";
});

// window system
function openApp(id){
  document.getElementById(id).classList.remove("hidden");
}

function closeApp(id){
  document.getElementById(id).classList.add("hidden");
}

// 🧍 STICKMAN
class Stickman{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.vx=0;
    this.health=100;
    this.state="idle";
    this.weapon=false;
  }

  update(){
    this.x += this.vx;
    this.vx *= 0.9;
  }

  draw(){
    ctx.strokeStyle="black";
    ctx.lineWidth=3;

    // head
    ctx.beginPath();
    ctx.arc(this.x,this.y-40,10,0,Math.PI*2);

    // body
    ctx.moveTo(this.x,this.y-30);
    ctx.lineTo(this.x,this.y);

    // arms (weapon arm if active)
    ctx.moveTo(this.x,this.y-20);
    ctx.lineTo(this.x-15,this.y-5);

    ctx.moveTo(this.x,this.y-20);
    if(this.weapon){
      ctx.lineTo(this.x+30,this.y-10); // longer arm = weapon
    } else {
      ctx.lineTo(this.x+15,this.y-5);
    }

    // legs
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x-10,this.y+20);

    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x+10,this.y+20);

    ctx.stroke();
  }
}

let enemy = new Stickman(400,300);

// 👊 CURSOR ATTACK
document.addEventListener("touchstart",()=>{
  let dx = enemy.x - cursor.x;
  let dy = enemy.y - cursor.y;
  let dist = Math.sqrt(dx*dx+dy*dy);

  if(dist < 60){
    enemy.vx += dx * 0.6;
    enemy.health -= 10;
  }
});

// 🛡 Antivirus
function scan(){
  enemy.health -= 20;
  enemy.vx += (Math.random()-0.5)*120;
}

// 🤖 ChatGPT helper
function chatAttack(){
  enemy.health -= 15;
  enemy.vx += (Math.random()-0.5)*90;
}

// 🧠 AI BEHAVIOUR SYSTEM
let timer = 0;

function updateEnemy(){
  timer++;

  let dx = cursor.x - enemy.x;

  // smooth chase
  enemy.vx += dx * 0.015;

  // 🪟 OPEN APPS
  if(timer === 120){
    openApp("paint");
    enemy.state="usingPaint";
  }

  // 🎨 CREATE WEAPON
  if(timer === 200){
    enemy.weapon = true;
    enemy.state="armed";
  }

  // 💥 THROW WINDOW
  if(timer === 260){
    let win = document.getElementById("paint");
    win.style.left = Math.random()*500 + "px";
    win.style.top = Math.random()*300 + "px";

    // knock cursor (screen shake)
    document.body.style.transform =
      `translate(${Math.random()*20}px,${Math.random()*20}px)`;
  }

  // ⚔ ATTACK PLAYER HARDER WHEN ARMED
  if(enemy.weapon && Math.abs(dx) < 80){
    document.body.style.transform =
      `translate(${Math.random()*12}px,${Math.random()*12}px)`;
  } else {
    document.body.style.transform="";
  }

  // 💀 BSOD
  if(enemy.health <= 0){
    document.getElementById("bsod").classList.remove("hidden");
  }

  enemy.update();
}

// 🔄 LOOP
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  updateEnemy();
  enemy.draw();

  requestAnimationFrame(loop);
}

loop();
