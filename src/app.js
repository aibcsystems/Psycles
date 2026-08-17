import { createWorld } from "./core/world.js";
import { clamp, lerp } from "./core/math.js";
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

const readout=createReadout();

function announce(){
  state.exhibitionName=state.exhibition==="horizon"?"Horizon No. 01":"Forest No. 01";
  state.weatherName=state.weather[0].toUpperCase()+state.weather.slice(1);
  state.seasonName=state.season[0].toUpperCase()+state.season.slice(1);
  readout.show(state);
}

setupUI(state,announce);
setupInteraction();

function liveHour(){
  const now=new Date();
  return now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
}

function frame(){
  if(state.mode==="live"){
    const live=liveHour();

    if(Math.floor(live*60)!==Math.floor(state.timeOfDay*60)){
      state.timeOfDay=live;
      announce();
    }else{
      state.timeOfDay=live;
    }
  }

  state._timeOfDay=lerp(state._timeOfDay,state.timeOfDay,.045);

  const world=createWorld(state,state._timeOfDay,{W,H});

  const world=createWorld(state,state._timeOfDay,{W,H});
  world.weatherName=state.weather;
  world.seasonName=state.season;

  renderSky(ctx,world,W,H);
  renderCelestials(ctx,world,W,H,performance.now());

  if(state.exhibition==="horizon"){
    renderHorizon(ctx,world,W,H,performance.now()/16,horizonParticles);
  }else{
    renderForest(ctx,world,W,H,performance.now()/16,forestParticles);
  }

  renderWeather(ctx,world,weatherParticles,W,H,performance.now()/16);
  requestAnimationFrame(frame);
}

announce();
frame();
