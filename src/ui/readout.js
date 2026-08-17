import { fmtTime } from "../core/math.js";

export function createReadout(){
  const root=document.querySelector("#readout");
  const time=document.querySelector("#readout-time");
  const meta=document.querySelector("#readout-meta");
  let timer;

  return {
    show(state){
      time.textContent=fmtTime(state.timeOfDay);
      meta.textContent=`${state.exhibitionName} · ${state.weatherName} · ${state.seasonName}`;
      root.classList.add("show");
      clearTimeout(timer);
      timer=setTimeout(()=>root.classList.remove("show"),3800);
    }
  };
}
