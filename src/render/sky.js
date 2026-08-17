import { clamp, mix, rgba } from "../core/math.js";

function seasonShift(c, warmth) {
  return [
    clamp(c[0] + warmth*26, 0, 255),
    clamp(c[1] + warmth*8, 0, 255),
    clamp(c[2] - warmth*22, 0, 255)
  ];
}

export function renderSky(ctx, world, W, H) {
  let top = seasonShift(world.skyTop, world.paletteBias*.65);
  let bottom = seasonShift(world.skyBottom, world.paletteBias);

  const weatherName = world.weatherName;
  if (weatherName === "rain") {
    top = mix(top,[39,46,58],.34);
    bottom = mix(bottom,[79,84,94],.25);
  } else if (weatherName === "fog") {
    top = mix(top,[170,174,181],.42);
    bottom = mix(bottom,[190,192,196],.5);
  } else if (weatherName === "snow") {
    top = mix(top,[145,154,168],.28);
    bottom = mix(bottom,[208,214,222],.28);
  }

  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0, rgba(top));
  g.addColorStop(1, rgba(bottom));
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  const haze = clamp(world.haze);
  if (haze > .01) {
    const hg = ctx.createLinearGradient(0,H*.18,0,H*.9);
    hg.addColorStop(0,`rgba(220,224,230,${haze*.05})`);
    hg.addColorStop(1,`rgba(220,224,230,${haze*.28})`);
    ctx.fillStyle = hg;
    ctx.fillRect(0,0,W,H);
  }
}

export function renderCelestials(ctx, world, W, H, frame) {
  const { solar } = world;
  const sx = W*solar.sunX;
  const sy = H*solar.sunY;

  if (solar.isDay && world.weatherName !== "rain" && world.weatherName !== "fog") {
    const glowR = 130 + solar.altitude*55;
    const glow = ctx.createRadialGradient(sx,sy,3,sx,sy,glowR);
    glow.addColorStop(0,`rgba(255,244,214,${.55 + solar.altitude*.3})`);
    glow.addColorStop(1,"rgba(255,244,214,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(sx,sy,glowR,0,Math.PI*2); ctx.fill();

    ctx.fillStyle = `rgba(255,249,232,${.78 + solar.altitude*.2})`;
    ctx.beginPath(); ctx.arc(sx,sy,15,0,Math.PI*2); ctx.fill();
  } else {
    const moonPhase = .72;
    const mx = W*(.25 + ((world.hour+8)%24)/24*.5);
    const my = H*.22;
    const glow = ctx.createRadialGradient(mx,my,2,mx,my,78);
    glow.addColorStop(0,"rgba(232,237,248,.36)");
    glow.addColorStop(1,"rgba(232,237,248,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(mx,my,78,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = `rgba(238,241,247,${.72*moonPhase})`;
    ctx.beginPath(); ctx.arc(mx,my,13,0,Math.PI*2); ctx.fill();
  }

  if (solar.night > .55 && world.weatherName === "clear") {
    ctx.save();
    for(let i=0;i<110;i++){
      const x=(i*97.31)%W;
      const y=(i*53.71)%(H*.58);
      const tw=.28+.24*Math.sin(frame*.008+i*1.7);
      ctx.fillStyle=`rgba(255,255,255,${tw})`;
      ctx.fillRect(x,y,1.2,1.2);
    }
    ctx.restore();
  }
}
