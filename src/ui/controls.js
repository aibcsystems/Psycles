import { fmtTime } from "../core/math.js";

export function setupUI(state, onChange) {
  const exhibition=document.querySelector("#exhibition");
  const weather=document.querySelector("#weather");
  const season=document.querySelector("#season");
  const mode=document.querySelector("#mode");
  const slider=document.querySelector("#time-slider");
  const timeValue=document.querySelector("#time-value");

  function sync(){
    exhibition.value=state.exhibition;
    weather.value=state.weather;
    season.value=state.season;
    mode.value=state.mode;
    slider.value=state.timeOfDay;
    slider.disabled=state.mode==="live";
    slider.style.opacity=state.mode==="live" ? .35 : 1;
    timeValue.textContent=fmtTime(state.timeOfDay);
  }

  exhibition.onchange=e=>{state.exhibition=e.target.value;onChange();};
  weather.onchange=e=>{state.weather=e.target.value;onChange();};
  season.onchange=e=>{state.season=e.target.value;onChange();};
  mode.onchange=e=>{state.mode=e.target.value;sync();onChange();};
  slider.oninput=e=>{state.timeOfDay=+e.target.value;sync();onChange();};

  sync();
}

export function setupInteraction(onActivity){
  const controls=document.querySelector("#controls");
  const hint=document.querySelector("#hint");
  let timer;

  function reveal(){
    controls.classList.add("visible");
    hint.classList.add("hidden");
    clearTimeout(timer);
    timer=setTimeout(()=>controls.classList.remove("visible"),3200);
    onActivity?.();
  }

  window.addEventListener("mousemove",reveal,{passive:true});
  window.addEventListener("touchstart",reveal,{passive:true});
  window.addEventListener("keydown",reveal);
  setTimeout(()=>controls.classList.remove("visible"),3200);

  return reveal;
}
