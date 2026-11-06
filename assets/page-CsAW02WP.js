import{D as e,E as t,N as n,R as r,S as i,d as a,v as o,z as s}from"./index-DxZhP81x.js";import{t as c}from"./GuideLink-Cv805r5d.js";var l=s(r(),1);function u(e,t,n){if(typeof CanvasRenderingContext2D>`u`||typeof ResizeObserver>`u`||typeof IntersectionObserver>`u`)return;let r=e.getContext(`2d`);if(!r)return;let i=document.createElement(`canvas`),a=i.getContext(`2d`);if(!a)return;let o=window.matchMedia(`(prefers-reduced-motion: reduce)`),s=!1,c=!1,l=0,u=-1/0,d=0,f=e.closest(`.landing-demo`),p=0,m=0,h=1/0,g=0,_=[];function v(t){if(n?.(t),!_.length)return;let{width:a,height:o}=e,s=Math.ceil(h*o/m);r.clearRect(0,0,a,o);for(let e of _){if(e.y>=s)break;let n=Math.sin(e.long-t*1.55),a=Math.sin(e.short+t*2.18+.67*n),c=Math.sin(e.fine-t*3.1+1.5*a+.5*n),l=.65*n+.35*a,u=g+e.spread*(.78*l+.24*c+.15*Math.sin(e.long*.57+t*.76)),d=Math.max(0,Math.min(o-e.h,e.y+e.refract*(.61*Math.cos(e.long-t*1.55)+.25*a+.2*c))),f=e.spread*.38*a,p=Math.max(0,c*.75+a*.25),m=e.light*(.8+.2*l)*(1-.73*p*p),h=u-f/2,_=i.width+f;r.globalAlpha=m,r.drawImage(i,0,d,i.width,e.h,h,e.y,_,e.h)}}function y(){if(!t.naturalWidth||!p||!m)return;let n=Math.min(window.devicePixelRatio||1,2,560/p),r=Math.max(1,Math.round(p*n)),o=Math.max(1,Math.round(m*n));if(e.width===r&&e.height===o&&_.length)return;e.width=r,e.height=o,i.width=Math.round(r/1.22),i.height=o,g=(r-i.width)/2,a.setTransform(1,0,0,-1,0,o),a.imageSmoothingQuality=`high`,a.drawImage(t,0,0,i.width,o),_=[];let s=Math.max(1,Math.round(n*.85));for(let e=0;e<o;e+=s){let t=e/o,n=Math.log1p(t*2.8);_.push({y:e,h:Math.min(s,o-e),long:n*16.2,short:n*39.4,fine:n*121,spread:i.width*(.007+.048*t),refract:o*(.003+.024*t),light:.78-.3*t})}v(d),e.dataset.ready=`true`,x()}function b(e){l=0,e-u>=1e3/30-.5&&(Number.isFinite(u)&&(d+=Math.min(e-u,100)/1e3),u=e,v(d)),x()}function x(){c||!s||document.hidden||f.dataset.paused===`true`||o.matches||!_.length&&!n?(cancelAnimationFrame(l),l=0,u=-1/0):l||=requestAnimationFrame(b)}let S=e.closest(`.im-mirror-water`),C=new ResizeObserver(t=>{for(let n of t)n.target===e?(p=n.contentRect.width,m=n.contentRect.height):h=n.contentRect.height;y(),o.matches&&v(0)});C.observe(e),C.observe(S);let w=new IntersectionObserver(([e])=>{s=e.isIntersecting,x()});w.observe(f),t.addEventListener(`load`,y);let T=new MutationObserver(()=>{v(d),x()});return T.observe(f,{attributes:!0,attributeFilter:[`data-paused`,`data-intro`]}),document.addEventListener(`visibilitychange`,x),o.addEventListener(`change`,x),()=>{c=!0,cancelAnimationFrame(l),w.disconnect(),C.disconnect(),T.disconnect(),t.removeEventListener(`load`,y),document.removeEventListener(`visibilitychange`,x),o.removeEventListener(`change`,x)}}var d=`investly-landing-intro-seen`,f=new Set([`im-lead-focus`,`im-ink-reveal`,`im-type-light`,`im-copy-appear`]);function p(e){try{return sessionStorage.getItem(e)}catch{return null}}function m(e,t){try{sessionStorage.setItem(e,t)}catch{}}function h(e){return new Promise(t=>{let n=new Image;n.onerror=t,n.decode||(n.onload=t),n.src=e,n.decode?n.decode().then(t,t):n.complete&&t()})}function g({introVersion:e,assets:t=[],reduced:n=!1}){let r=(0,l.useRef)(null),i=(0,l.useRef)(new Set),[a,o]=(0,l.useState)(!1),[s,c]=(0,l.useState)(()=>n||p(d)===e?`skip`:`play`),[u,g]=(0,l.useState)(()=>!document.hidden),[_,v]=(0,l.useState)(!0),y=JSON.stringify(t),b=a?n?`skip`:s:`hold`,x=!a||n||!u||!_;return(0,l.useEffect)(()=>{let e=!1,t,n=new Promise(e=>{t=window.setTimeout(e,2e3)});return Promise.race([Promise.all(JSON.parse(y).map(h)),n]).then(()=>{clearTimeout(t),e||o(!0)}),()=>{e=!0,clearTimeout(t)}},[y]),(0,l.useEffect)(()=>{let e=()=>g(!document.hidden);return document.addEventListener(`visibilitychange`,e),()=>document.removeEventListener(`visibilitychange`,e)},[]),(0,l.useEffect)(()=>{if(!r.current||typeof IntersectionObserver>`u`)return;let e=new IntersectionObserver(([e])=>v(e.isIntersecting));return e.observe(r.current),()=>e.disconnect()},[]),(0,l.useEffect)(()=>{let e=r.current;if(!e?.getAnimations)return;let t=i.current,o=!a&&!n&&u&&_;function s(){let n=new Set(e.getAnimations({subtree:!0}));for(let e of t)n.has(e)||t.delete(e);for(let e of n){let n=x&&!(o&&f.has(e.animationName));n&&e.playState===`running`?(e.pause(),t.add(e)):!n&&t.has(e)&&(e.playState===`paused`&&e.play(),t.delete(e))}}s(),e.addEventListener(`animationstart`,s);let c=new MutationObserver(s);c.observe(e,{attributes:!0,attributeFilter:[`data-intro`,`data-paused`]});let l=requestAnimationFrame(s);return()=>{cancelAnimationFrame(l),e.removeEventListener(`animationstart`,s),c.disconnect()}},[x,b,a,n,u,_]),{rootRef:r,introState:b,paused:x,finishIntro:(0,l.useCallback)(()=>{s!==`play`||!a||n||(m(d,e),c(`done`))},[s,a,n,e])}}var _=`
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * .5 + .5;
  gl_Position = vec4(a_position, 0., 1.);
}`,v=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_photo;
uniform vec2 u_size;
uniform vec2 u_image;
uniform float u_time;
varying vec2 v_uv;

// Source-photo skyline: keep the photographed trees anchored in place.
float skyline(float x) {
  if (x < .10) return mix(.393, .407, x / .10);
  if (x < .15) return mix(.407, .420, (x - .10) / .05);
  if (x < .24) return mix(.420, .375, (x - .15) / .09);
  if (x < .30) return mix(.375, .392, (x - .24) / .06);
  if (x < .35) return mix(.392, .432, (x - .30) / .05);
  if (x < .43) return mix(.432, .425, (x - .35) / .08);
  if (x < .48) return mix(.425, .438, (x - .43) / .05);
  if (x < .60) return mix(.438, .424, (x - .48) / .12);
  if (x < .68) return mix(.424, .430, (x - .60) / .08);
  if (x < .80) return mix(.430, .425, (x - .68) / .12);
  if (x < .90) return mix(.425, .404, (x - .80) / .10);
  if (x < .94) return mix(.404, .425, (x - .90) / .04);
  return mix(.425, .409, (x - .94) / .06);
}
float skyMask(vec2 q) {
  float edge = skyline(q.x);
  return 1. - smoothstep(edge - .022, edge - .006, q.y);
}
vec2 cloudSample(vec2 q, float wind, float billow) {
  q.x += u_time * .0085 * wind;
  // Mirrored overscan avoids stretched texture edges in wider viewports.
  q.x = 1. - abs(1. - mod(q.x, 2.));
  q.y = clamp(q.y + billow, .001, .999);
  return q;
}

void main() {
  vec2 uv = vec2(v_uv.x, 1. - v_uv.y);
  // Locate the shore in the photograph, independent of the viewport crop.
  float scale = max(u_size.x / u_image.x, u_size.y / u_image.y);
  vec2 visible = u_size / (u_image * scale);
  vec2 cropped = 1. - visible;
  vec2 sourceUV = uv * visible + cropped * vec2(.6, .4);
  float sky = skyMask(sourceUV);
  // Leave the small reeds above the near-shore water undistorted.
  float water = smoothstep(.545, .565, sourceUV.y);
  float depth = clamp((sourceUV.y - .508) / .492, 0., 1.);

  // Waves spread in perspective: compact near the bank, broader close up.
  float distance = log(1. + depth * 6.);
  float broadPhase = distance * 24. - u_time * 1.05 + .55 * sin(sourceUV.x * 15. + u_time * .12);
  float finePhase = distance * 71. + sourceUV.x * 25. - u_time * 1.9;
  float crossPhase = distance * 114. - sourceUV.x * 38. + u_time * 2.35;
  float swell = sin(broadPhase);
  float ripples = .7 * sin(finePhase) + .3 * sin(crossPhase);
  float amplitude = .28 + depth * .72;
  // Preserve the real photograph's fine ripples instead of bending its
  // reflected tree trunks and clouds into broad artificial waves.
  vec2 bend = vec2(
    (.0028 * swell + .00065 * ripples) * amplitude,
    (.0014 * swell + .00045 * ripples) * amplitude
  ) * water;
  float light = (.016 * cos(broadPhase) + .007 * cos(finePhase)) * water * amplitude;

  vec2 sampleUV = clamp(sourceUV + bend, vec2(.001), vec2(.999));
  vec3 color = texture2D(u_photo, sampleUV).rgb;
  if (sky > .001) {
    // Advect a single crisp cloud texture without reversing or double exposure.
    // Slower low clouds and a soft vertical flow give the banks depth.
    float wind = .76 + .24 * smoothstep(.0, .32, skyline(sourceUV.x) - sourceUV.y);
    float billow = .0035 * (sin(sourceUV.x * 9. + u_time * .27) - sin(sourceUV.x * 9.));
    vec2 cloud = cloudSample(sourceUV, wind, billow);
    // Protect the source position too: moving clouds must never borrow a tree.
    color = mix(color, texture2D(u_photo, cloud).rgb, sky * skyMask(cloud));
  }
  // Slowly changing skylight is reflected across the lake without glitter.
  float daylight = sin(sourceUV.x * 5. - u_time * .09) - sin(sourceUV.x * 5.);
  color *= 1. + daylight * .009 * water;
  color += vec3(.89, .94, .86) * light;
  gl_FragColor = vec4(color, 1.);
}`;function y(e,t){if(typeof WebGLRenderingContext>`u`||typeof ResizeObserver>`u`)return;let n;try{n=e.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,powerPreference:`low-power`})}catch{return}if(!n)return;let r=[];function i(e,t){let i=n.createShader(e);return r.push(i),n.shaderSource(i,t),n.compileShader(i),i}let a=n.createProgram(),o=i(n.VERTEX_SHADER,_),s=i(n.FRAGMENT_SHADER,v);if(n.attachShader(a,o),n.attachShader(a,s),n.linkProgram(a),!n.getProgramParameter(a,n.LINK_STATUS)){r.forEach(e=>n.deleteShader(e)),n.deleteProgram(a);return}n.useProgram(a);let c=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),n.STATIC_DRAW);let l=n.getAttribLocation(a,`a_position`);n.enableVertexAttribArray(l),n.vertexAttribPointer(l,2,n.FLOAT,!1,0,0);let u=Object.fromEntries([`size`,`image`,`time`].map(e=>[e,n.getUniformLocation(a,`u_`+e)])),d=n.createTexture();n.bindTexture(n.TEXTURE_2D,d),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let f=new Image,p=!1,m=!1,h=0;function g(e=h){h=e,!(!p||m||n.isContextLost())&&(n.uniform1f(u.time,e),n.drawArrays(n.TRIANGLES,0,6))}let y=new ResizeObserver(([{contentRect:t}])=>{let r=Math.min(window.devicePixelRatio||1,1.5,720/Math.max(1,t.width));e.width=Math.max(1,Math.round(t.width*r)),e.height=Math.max(1,Math.round(t.height*r)),n.viewport(0,0,e.width,e.height),n.uniform2f(u.size,t.width,t.height),g()});y.observe(e),f.onload=()=>{m||(n.bindTexture(n.TEXTURE_2D,d),n.texImage2D(n.TEXTURE_2D,0,n.RGB,n.RGB,n.UNSIGNED_BYTE,f),n.uniform2f(u.image,f.naturalWidth,f.naturalHeight),p=!0,g(),e.dataset.ready=`true`)},f.src=t;let b=t=>{t.preventDefault(),delete e.dataset.ready};return e.addEventListener(`webglcontextlost`,b),{render:g,destroy(){m=!0,f.onload=null,y.disconnect(),e.removeEventListener(`webglcontextlost`,b),n.deleteTexture(d),n.deleteBuffer(c),r.forEach(e=>n.deleteShader(e)),n.deleteProgram(a)}}}var b=e(),x=`lake-photograph-muted-v2`,S=`/investly-app/art/lake-iphone.webp`,C=[`/investly-app/art/landing-petr-ganaj-lake.webp`,S];function w(e){let t=window.matchMedia(`(prefers-reduced-motion: reduce)`);return t.addEventListener(`change`,e),()=>t.removeEventListener(`change`,e)}function T(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function E({currentTarget:e,clientX:t,clientY:n}){let r=e.getBoundingClientRect();e.style.setProperty(`--glass-x`,`${(t-r.left)/r.width*100}%`),e.style.setProperty(`--glass-y`,`${(n-r.top)/r.height*100}%`)}function D(){let e=a(t()),r=e===n.LANDING,{rootRef:s,introState:d,paused:f,finishIntro:p}=g({introVersion:x,assets:C,reduced:(0,l.useSyncExternalStore)(w,T,()=>!0)}),m=(0,l.useRef)(null),h=(0,l.useRef)(null),_=(0,l.useRef)(null);return(0,l.useEffect)(()=>{let e=y(_.current,C[0]),t=u(h.current,m.current,e?.render);return()=>{t?.(),e?.destroy()}},[]),(0,b.jsx)(`main`,{className:`landing-demo`,ref:s,"data-paused":f,"data-intro":d,children:(0,b.jsxs)(`div`,{className:`im-page`,children:[(0,b.jsx)(`div`,{className:`im-landscape`,"aria-hidden":`true`,children:(0,b.jsxs)(`div`,{className:`im-camera-shot`,onAnimationEnd:e=>{e.animationName===`im-camera-settle`&&p()},children:[(0,b.jsx)(`canvas`,{className:`im-lake-film`,ref:_}),(0,b.jsx)(`div`,{className:`im-water-reflection`,children:(0,b.jsx)(`span`,{className:`im-lake-wave`})}),(0,b.jsx)(`div`,{className:`im-atmosphere`})]})}),(0,b.jsx)(`header`,{className:`im-header`,children:(0,b.jsx)(i,{className:`im-logo`,linkToLanding:!1})}),(0,b.jsxs)(`section`,{className:`im-hero`,children:[(0,b.jsxs)(`h1`,{"aria-label":`Lær at investere.`,children:[(0,b.jsx)(`span`,{className:`im-title-lead`,children:`Lær at`}),(0,b.jsx)(`span`,{className:`im-signature`,children:(0,b.jsx)(`em`,{className:`im-signature-face`,children:`investere.`})})]}),(0,b.jsxs)(`p`,{className:`im-intro`,children:[`Find din platform. Prøv dit første køb.`,(0,b.jsx)(`br`,{}),`Øv dig uden at bruge rigtige penge.`]})]}),(0,b.jsxs)(`div`,{className:`im-lake-stage`,"aria-hidden":`true`,children:[(0,b.jsx)(`div`,{className:`im-mirror-water`,children:(0,b.jsxs)(`div`,{className:`im-mirror-bed`,children:[(0,b.jsx)(`canvas`,{className:`im-reflection-waves`,ref:h}),(0,b.jsx)(`img`,{className:`im-reflection-still`,src:S,alt:``})]})}),(0,b.jsx)(`div`,{className:`im-rise-window`,children:(0,b.jsx)(`div`,{className:`im-handset-lift`,children:(0,b.jsx)(`img`,{className:`im-handset`,ref:m,src:S,width:`780`,height:`1731`,alt:``,draggable:`false`,fetchPriority:`high`})})})]}),(0,b.jsxs)(c,{className:`im-main-cta guide-glass-action`,href:r?n.MOTIVATION:e,onPointerMove:E,onPointerDown:E,children:[(0,b.jsx)(`span`,{children:r?`Start guiden`:e===n.HOME?`Se dit overblik`:`Fortsæt guiden`}),(0,b.jsx)(o,{size:18,strokeWidth:1.5,"aria-hidden":`true`})]})]})})}export{D as default};