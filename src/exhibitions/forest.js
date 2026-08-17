import { mix } from "../core/math.js";

export function createForestParticles(W,H){
  return {
    leaves:Array.from({length:34},()=>({x:Math.random()*W,y:Math.random()*H,s:.2+Math.random()*.5,p:Math.random()*10,r:1.5+Math.random()*3}))
  };
}

export function renderForest(ctx,world,W,H,frame,particles){
  const horizon=H*.67;
  const rows=[
    {y:horizon-10,h:90,a:.88,s:1},
    {y:horizon+14,h:135,a:.68,s:1.3},
    {y:horizon+45,h:180,a:.5,s:1.65}
  ];

  rows.forEach((row,ri)=>{
    let base=world.seasonName==="winter" ? [34,38,45] : mix([25,40,30],[76,57,32],Math.max(0,world.season.warmth+.4));
    ctx.fillStyle=`rgba(${base[0]},${base[1]},${base[2]},${row.a})`;
    const tw=48*row.s;
    for(let x=-tw;x<W+tw;x+=tw*.78){
      const sway=Math.sin(frame*.009+x*.02+ri)*3*world.wind;
      ctx.beginPath();
      ctx.moveTo(x+sway,row.y-row.h);
      ctx.lineTo(x-tw*.42+sway,row.y);
      ctx.lineTo(x+tw*.42+sway,row.y);
      ctx.closePath();
      ctx.fill();
    }
  });

  ctx.fillStyle="rgba(7,10,10,.52)";
  ctx.fillRect(0,horizon+40,W,H-horizon-40);

  if(world.seasonName!=="winter"){
    const leaf=world.seasonName==="autumn" ? "rgba(201,123,48,.68)" : "rgba(119,170,91,.55)";
    ctx.fillStyle=leaf;
    const dt = world.dtScale ?? 1;
    particles.leaves.forEach(l=>{
      l.p+=.014*world.motion*dt;
      l.x += (l.s + Math.sin(l.p)*.28*world.wind)*dt;
      l.y += (.08 + world.wind*.08)*dt;
      if(l.x>W)l.x=-5;
      if(l.y>H)l.y=-5;
      ctx.beginPath();ctx.arc(l.x,l.y,l.r,0,Math.PI*2);ctx.fill();
    });
  }
}
