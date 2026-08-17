import { fmtTime } from "../core/math.js";

export function createReadout(){
  const root=document.querySelector("#readout");
  const time=document.querySelector("#readout-time");
  const meta=document.querySelector("#readout-meta");
  let timer;

  function setText(state){
    time.textContent=fmtTime(state.timeOfDay);
    meta.textContent=`${state.exhibitionName} · ${state.weatherName} · ${state.seasonName}`;
  }

  return {
    // Cheap, safe to call every frame: keeps the displayed time in sync
    // during Live mode without touching visibility/animation state.
    update(state){
      setText(state);
    },
    // Full trigger: updates text and (re)reveals the readout, resetting
    // its auto-hide timer. Use on explicit changes (exhibition/weather/
    // season/mode/time edits) or user activity.
    show(state){
      setText(state);
      root.classList.add("show");
      clearTimeout(timer);
      timer=setTimeout(()=>root.classList.remove("show"),3800);
    }
  };
}
