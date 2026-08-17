export const clamp = (v, lo=0, hi=1) => Math.max(lo, Math.min(hi, v));
export const lerp = (a,b,t) => a + (b-a)*t;
export const smoothstep = (a,b,x) => {
  const t = clamp((x-a)/(b-a));
  return t*t*(3-2*t);
};
export const mix = (a,b,t) => a.map((v,i)=>Math.round(lerp(v,b[i],t)));
export const rgba = (c,a=1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
export const wrap24 = h => ((h % 24) + 24) % 24;
export const fmtTime = h => {
  h = wrap24(h);
  const hh = Math.floor(h);
  const mm = Math.round((h-hh)*60);
  const carry = mm === 60 ? 1 : 0;
  return `${String((hh+carry)%24).padStart(2,"0")}:${String(carry ? 0 : mm).padStart(2,"0")}`;
};
