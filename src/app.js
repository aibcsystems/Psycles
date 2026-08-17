import { createWorld } from "./core/world.js";
import { clamp, lerp } from "./core/math.js";
import { decodeState, persistState } from "./core/share.js";
import { renderSky, renderCelestials } from "./render/sky.js";
import { createWeatherParticles, renderWeather } from "./render/weather.js";
import { createHorizonParticles, renderHorizon } from "./exhibitions/horizon.js";
import { createForestParticles, renderForest } from "./exhibitions/forest.js";
import { setupUI, setupInteraction } from "./ui/controls.js";
import { createReadout } from "./ui/readout.js";

const canvas=document.querySelector("#scene");
const ctx=canvas.getContext("2d",{alpha:false});

let W=innerWidth,H=innerHeight,DPR=1;
let weatherParticles, horizonParticles, forestParticles;

const state={
  exhibition:"horizon",
  exhibitionName:"Horizon No. 01",
  weather:"clear",
  weatherName:"Clear",
  season:"summer",
  seasonName:"Summer",
  mode:"manual",
  timeOfDay:8,
  _timeOfDay:8
};

// Shared/bookmarked links: values are already whitelisted by decodeState,
// so it's safe to assign them directly.
const shared=decodeState();
if(shared){
  Object.assign(state,shared);
  if(shared.timeOfDay!==undefined) state._timeOfDay=state.timeOfDay;
}

function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  canvas.width=W*DPR;canvas.height=H*DPR;
  canvas.style.width=W+"px";canvas.style.height=H+"px";
  ctx.setTransform(DPR,0,0,DPR,0,0);
  weatherParticles=createWeatherParticles(W,H);
  horizonParticles=createHorizonParticles(W,H);
  forestParticles=createForestParticles(W,H);
}
addEventListener("resize",resize);
resize();

// devicePixelRatio can change without a "resize" event firing — e.g.
// dragging the window between a Retina and standard-DPI monitor, or an
// OS-level zoom change. matchMedia lets us catch that and re-run resize()
// so the canvas stays crisp. The listener re-subscribes itself each time
// since a `resolution` media query only fires once per crossing.
function watchDPR(){
  const mq=matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
  mq.addEventListener("change",()=>{resize();watchDPR();},{once:true});
}
watchDPR();

const readout=createReadout();

function announce(){
  state.exhibitionName=state.exhibition==="horizon"?"Horizon No. 01":"Forest No. 01";
  state.weatherName=state.weather[0].toUpperCase()+state.weather.slice(1);
  state.seasonName=state.season[0].toUpperCase()+state.season.slice(1);
  readout.show(state);
  persistState(state);
}

setupUI(state,announce);
setupInteraction(announce);

function liveHour(){
  const now=new Date();
  return now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
}

let lastFrameTime=performance.now();

function frame(now){
  now = now ?? performance.now();
  // Normalize elapsed time to a 60fps baseline: dtScale is ~1 at 60Hz,
  // ~0.5 at 120Hz, ~2 if a frame took twice as long as expected. Capped
  // so returning from a backgrounded/minimized tab doesn't cause a huge
  // single-frame jump in particle position.
  const dtScale=clamp((now-lastFrameTime)/16.6667,0,3);
  lastFrameTime=now;

  if(state.mode==="live") state.timeOfDay=liveHour();
  state._timeOfDay=lerp(state._timeOfDay,state.timeOfDay,clamp(.045*dtScale,0,1));
  readout.update(state);

  const world=createWorld(state,state._timeOfDay,{W,H});
  world.weatherName=state.weather;
  world.seasonName=state.season;
  world.dtScale=dtScale;

  renderSky(ctx,world,W,H);
  renderCelestials(ctx,world,W,H,now);

  if(state.exhibition==="horizon"){
    renderHorizon(ctx,world,W,H,now/16,horizonParticles);
  }else{
    renderForest(ctx,world,W,H,now/16,forestParticles);
  }

  renderWeather(ctx,world,weatherParticles,W,H,now/16);
  requestAnimationFrame(frame);
}

announce();
frame();
