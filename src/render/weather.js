import { clamp } from "../core/math.js";

export function createWeatherParticles(W,H) {
  return {
    rain:Array.from({length:170},()=>({x:Math.random()*W,y:Math.random()*H,len:8+Math.random()*18,s:6+Math.random()*5})),
    snow:Array.from({length:110},()=>({x:Math.random()*W,y:Math.random()*H,r:.8+Math.random()*2.5,s:.35+Math.random()*.8,p:Math.random()*Math.PI*2})),
    mist:Array.from({length:14},()=>({x:Math.random()*W,y:H*(.45+Math.random()*.45),w:120+Math.random()*260,h:20+Math.random()*50,p:Math.random()*10}))
  };
}

export function renderWeather(ctx, world, particles, W,H,frame) {
  const weather = world.weatherName;
  const dt = world.dtScale ?? 1;

  if(weather === "rain"){
    ctx.strokeStyle = `rgba(218,226,238,${.18 + world.weather.rain*.18})`;
    ctx.lineWidth=1;
    particles.rain.forEach(d=>{
      d.y += d.s*world.wind*.75*dt;
      d.x -= 1.4*world.wind*dt;
      if(d.y>H+20){d.y=-20;d.x=Math.random()*W;}
      ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x-3,d.y+d.len); ctx.stroke();
    });
  }

  if(weather === "snow"){
    ctx.fillStyle="rgba(255,255,255,.72)";
    particles.snow.forEach(s=>{
      s.p += .012*world.motion*dt;
      s.x += (Math.sin(s.p)*.35 + world.wind*.12)*dt;
      s.y += s.s*world.motion*dt;
      if(s.y>H+8){s.y=-8;s.x=Math.random()*W;}
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    });
  }

  if(weather === "fog"){
    particles.mist.forEach((m,i)=>{
      m.p += .0015*world.motion*dt;
      const x=m.x+Math.sin(m.p+i)*45;
      const y=m.y+Math.sin(m.p*.7+i)*8;
      const g=ctx.createRadialGradient(x,y,0,x,y,m.w);
      g.addColorStop(0,`rgba(225,227,230,${.045+world.haze*.06})`);
      g.addColorStop(1,"rgba(225,227,230,0)");
      ctx.fillStyle=g;
      ctx.fillRect(x-m.w,y-m.h,m.w*2,m.h*2);
    });
  }

  if(world.haze>.35){
    const g=ctx.createLinearGradient(0,H*.42,0,H);
    g.addColorStop(0,"rgba(215,220,226,0)");
    g.addColorStop(1,`rgba(215,220,226,${clamp(world.haze*.28)})`);
    ctx.fillStyle=g;ctx.fillRect(0,H*.25,W,H*.75);
  }
}
