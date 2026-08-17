import { clamp, rgba } from "../core/math.js";

export function renderHorizon(ctx, world, W,H,frame,particles) {
  const horizonY=H*.70;
  const waterDepth=H-horizonY;

  // atmospheric horizon band
  const hg=ctx.createLinearGradient(0,horizonY-90,0,horizonY+90);
  hg.addColorStop(0,`rgba(255,230,198,${.02+world.solar.altitude*.06})`);
  hg.addColorStop(.5,`rgba(255,225,190,${.06+world.solar.altitude*.12})`);
  hg.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=hg;ctx.fillRect(0,horizonY-100,W,200);

  // water
  ctx.fillStyle=`rgba(9,20,30,${.12 + (1-world.light)*.25})`;
  ctx.fillRect(0,horizonY,W,waterDepth);

  const reflectionStrength=.12+world.solar.altitude*.26;
  for(let i=0;i<16;i++){
    const y=horizonY+8+i*(waterDepth/18);
    const width=W*(.04+world.solar.altitude*.18)*(1-i/24);
    const cx=W*(.5 + Math.sin(frame*.004+i)*.015);
    ctx.strokeStyle=`rgba(245,220,184,${reflectionStrength*(1-i/18)})`;
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(cx-width,y);
    ctx.lineTo(cx+width,y+Math.sin(frame*.012+i)*1.5);
    ctx.stroke();
  }

  // sun path / glow on water
  if(world.solar.isDay && world.weatherName!=="fog"){
    const cx=W*world.solar.sunX;
    for(let i=0;i<12;i++){
      const y=horizonY+12+i*12;
      const w=(25+i*18)*(0.35+world.solar.altitude);
      ctx.strokeStyle=`rgba(255,218,170,${.045*(1-i/14)})`;
      ctx.beginPath();ctx.moveTo(cx-w,y);ctx.lineTo(cx+w,y);ctx.stroke();
    }
  }

  // distant birds: absent during rain/fog and winter
  if(world.weatherName==="clear" && world.season.vegetation>.25 && world.solar.daylight>.08){
    const dt = world.dtScale ?? 1;
    particles.birds.forEach(b=>{
      b.x += b.speed*world.motion*dt;
      if(b.x>W+30)b.x=-30;
      const flap=Math.sin(frame*.11+b.phase)*2.5;
      ctx.strokeStyle="rgba(22,25,29,.42)";
      ctx.lineWidth=1.2;
      ctx.beginPath();
      ctx.moveTo(b.x-6,b.y+flap);
      ctx.quadraticCurveTo(b.x,b.y-3,b.x+6,b.y+flap);
      ctx.stroke();
    });
  }
}

export function createHorizonParticles(W,H){
  return {
    birds:Array.from({length:5},()=>({x:Math.random()*W,y:H*(.17+Math.random()*.18),speed:.12+Math.random()*.2,phase:Math.random()*10}))
  };
}
