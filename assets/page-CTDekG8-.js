import{F as e,N as t,c as n,i as r,m as i,r as a,s as o,t as s}from"./arrow-right-B7JmrYjK.js";import{f as c}from"./index-wn7TJPTZ.js";import{t as l}from"./GuideLink-DlNUOVjv.js";var u=e(t(),1);function d(e,t,n){if(typeof CanvasRenderingContext2D>`u`||typeof ResizeObserver>`u`||typeof IntersectionObserver>`u`)return;let r=e.getContext(`2d`);if(!r)return;let i=document.createElement(`canvas`),a=i.getContext(`2d`);if(!a)return;let o=window.matchMedia(`(prefers-reduced-motion: reduce)`),s=!1,c=!1,l=0,u=-1/0,d=0,f=e.closest(`.landing-demo`),p=0,m=0,h=1/0,g=0,_=[];function v(t){if(n?.(t),!_.length)return;let{width:a,height:o}=e,s=Math.ceil(h*o/m);r.clearRect(0,0,a,o);for(let e of _){if(e.y>=s)break;let n=Math.sin(e.long-t*1.55),a=Math.sin(e.short+t*2.18+.67*n),c=Math.sin(e.fine-t*3.1+1.5*a+.5*n),l=.65*n+.35*a,u=g+e.spread*(.78*l+.24*c+.15*Math.sin(e.long*.57+t*.76)),d=Math.max(0,Math.min(o-e.h,e.y+e.refract*(.61*Math.cos(e.long-t*1.55)+.25*a+.2*c))),f=e.spread*.38*a,p=Math.max(0,c*.75+a*.25),m=e.light*(.8+.2*l)*(1-.73*p*p),h=u-f/2,_=i.width+f;r.globalAlpha=m,r.drawImage(i,0,d,i.width,e.h,h,e.y,_,e.h)}}function y(){if(!t.naturalWidth||!p||!m)return;let n=Math.min(window.devicePixelRatio||1,2,560/p),r=Math.max(1,Math.round(p*n)),o=Math.max(1,Math.round(m*n));if(e.width===r&&e.height===o&&_.length)return;e.width=r,e.height=o,i.width=Math.round(r/1.22),i.height=o,g=(r-i.width)/2,a.setTransform(1,0,0,-1,0,o),a.imageSmoothingQuality=`high`,a.drawImage(t,0,0,i.width,o),_=[];let s=Math.max(1,Math.round(n*.85));for(let e=0;e<o;e+=s){let t=e/o,n=Math.log1p(t*2.8);_.push({y:e,h:Math.min(s,o-e),long:n*16.2,short:n*39.4,fine:n*121,spread:i.width*(.007+.048*t),refract:o*(.003+.024*t),light:.78-.3*t})}v(d),e.dataset.ready=`true`,x()}function b(e){l=0,e-u>=1e3/30-.5&&(Number.isFinite(u)&&(d+=Math.min(e-u,100)/1e3),u=e,v(d)),x()}function x(){c||!s||document.hidden||f.dataset.paused===`true`||o.matches||!_.length&&!n?(cancelAnimationFrame(l),l=0,u=-1/0):l||=requestAnimationFrame(b)}let S=e.closest(`.im-mirror-water`),C=new ResizeObserver(t=>{for(let n of t)n.target===e?(p=n.contentRect.width,m=n.contentRect.height):h=n.contentRect.height;y(),o.matches&&v(0)});C.observe(e),C.observe(S);let w=new IntersectionObserver(([e])=>{s=e.isIntersecting,x()});w.observe(f),t.addEventListener(`load`,y);let T=new MutationObserver(()=>{v(d),x()});return T.observe(f,{attributes:!0,attributeFilter:[`data-paused`,`data-intro`]}),document.addEventListener(`visibilitychange`,x),o.addEventListener(`change`,x),()=>{c=!0,cancelAnimationFrame(l),w.disconnect(),C.disconnect(),T.disconnect(),t.removeEventListener(`load`,y),document.removeEventListener(`visibilitychange`,x),o.removeEventListener(`change`,x)}}var f=`investly-landing-intro-seen`,p=new Set([`im-lead-focus`,`im-ink-reveal`,`im-type-light`,`im-copy-appear`]);function m(e){try{return sessionStorage.getItem(e)}catch{return null}}function h(e,t){try{sessionStorage.setItem(e,t)}catch{}}function g(e){return new Promise(t=>{let n=new Image;n.onerror=t,n.decode||(n.onload=t),n.src=e,n.decode?n.decode().then(t,t):n.complete&&t()})}function _({introVersion:e,assets:t=[],reduced:n=!1}){let r=(0,u.useRef)(null),i=(0,u.useRef)(new Set),[a,o]=(0,u.useState)(!1),[s,c]=(0,u.useState)(()=>n||m(f)===e?`skip`:`play`),[l,d]=(0,u.useState)(()=>!document.hidden),[_,v]=(0,u.useState)(!0),y=JSON.stringify(t),b=a?n?`skip`:s:`hold`,x=!a||n||!l||!_;return(0,u.useEffect)(()=>{let e=!1,t,n=new Promise(e=>{t=window.setTimeout(e,2e3)});return Promise.race([Promise.all(JSON.parse(y).map(g)),n]).then(()=>{clearTimeout(t),e||o(!0)}),()=>{e=!0,clearTimeout(t)}},[y]),(0,u.useEffect)(()=>{let e=()=>d(!document.hidden);return document.addEventListener(`visibilitychange`,e),()=>document.removeEventListener(`visibilitychange`,e)},[]),(0,u.useEffect)(()=>{if(!r.current||typeof IntersectionObserver>`u`)return;let e=new IntersectionObserver(([e])=>v(e.isIntersecting));return e.observe(r.current),()=>e.disconnect()},[]),(0,u.useEffect)(()=>{let e=r.current;if(!e?.getAnimations)return;let t=i.current,o=!a&&!n&&l&&_;function s(){let n=new Set(e.getAnimations({subtree:!0}));for(let e of t)n.has(e)||t.delete(e);for(let e of n){let n=x&&!(o&&p.has(e.animationName));n&&e.playState===`running`?(e.pause(),t.add(e)):!n&&t.has(e)&&(e.playState===`paused`&&e.play(),t.delete(e))}}s(),e.addEventListener(`animationstart`,s);let c=new MutationObserver(s);c.observe(e,{attributes:!0,attributeFilter:[`data-intro`,`data-paused`]});let u=requestAnimationFrame(s);return()=>{cancelAnimationFrame(u),e.removeEventListener(`animationstart`,s),c.disconnect()}},[x,b,a,n,l,_]),{rootRef:r,introState:b,paused:x,finishIntro:(0,u.useCallback)(()=>{s!==`play`||!a||n||(h(f,e),c(`done`))},[s,a,n,e])}}var v=`
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * .5 + .5;
  gl_Position = vec4(a_position, 0., 1.);
}`,y=`
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

const float WATERLINE = .508;

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
vec2 reflectAcrossWaterline(vec2 q) {
  return vec2(q.x, 2. * WATERLINE - q.y);
}
vec2 cloudSample(vec2 q) {
  // Use sky coordinates for both the sky and its mirrored lake image, so
  // distance from the skyline gives each cloud the same wind and billow.
  float wind = .76 + .24 * smoothstep(.0, .32, skyline(q.x) - q.y);
  float billow = .0035 * (sin(q.x * 9. + u_time * .27) - sin(q.x * 9.));
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
  float depth = clamp((sourceUV.y - WATERLINE) / (1. - WATERLINE), 0., 1.);

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
    vec2 cloud = cloudSample(sourceUV);
    // Protect the source position too: moving clouds must never borrow a tree.
    color = mix(color, texture2D(u_photo, cloud).rgb, sky * skyMask(cloud));
  }
  // The photographed waterline is at .508. Reflect a water sample into the
  // sky, move that same cloud, then reflect its sample back into the real
  // lake texture. Only the vertical motion reverses in the reflection;
  // horizontal wind stays in phase while the existing ripples refract it.
  vec2 reflectedSky = reflectAcrossWaterline(sourceUV);
  float reflectedClouds = skyMask(reflectedSky) * water;
  if (reflectedClouds > .001) {
    vec2 cloud = cloudSample(reflectAcrossWaterline(sampleUV));
    vec2 reflectedSample = clamp(reflectAcrossWaterline(cloud), vec2(.001), vec2(.999));
    color = mix(color, texture2D(u_photo, reflectedSample).rgb, reflectedClouds * skyMask(cloud));
  }
  // Slowly changing skylight is reflected across the lake without glitter.
  float daylight = sin(sourceUV.x * 5. - u_time * .09) - sin(sourceUV.x * 5.);
  color *= 1. + daylight * .009 * water;
  color += vec3(.89, .94, .86) * light;
  gl_FragColor = vec4(color, 1.);
}`;function b(e,t){if(typeof WebGLRenderingContext>`u`||typeof ResizeObserver>`u`)return;let n;try{n=e.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,powerPreference:`low-power`})}catch{return}if(!n)return;let r=[];function i(e,t){let i=n.createShader(e);return r.push(i),n.shaderSource(i,t),n.compileShader(i),i}let a=n.createProgram(),o=i(n.VERTEX_SHADER,v),s=i(n.FRAGMENT_SHADER,y);if(n.attachShader(a,o),n.attachShader(a,s),n.linkProgram(a),!n.getProgramParameter(a,n.LINK_STATUS)){r.forEach(e=>n.deleteShader(e)),n.deleteProgram(a);return}n.useProgram(a);let c=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),n.STATIC_DRAW);let l=n.getAttribLocation(a,`a_position`);n.enableVertexAttribArray(l),n.vertexAttribPointer(l,2,n.FLOAT,!1,0,0);let u=Object.fromEntries([`size`,`image`,`time`].map(e=>[e,n.getUniformLocation(a,`u_`+e)])),d=n.createTexture();n.bindTexture(n.TEXTURE_2D,d),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let f=new Image,p=!1,m=!1,h=0;function g(e=h){h=e,!(!p||m||n.isContextLost())&&(n.uniform1f(u.time,e),n.drawArrays(n.TRIANGLES,0,6))}let _=new ResizeObserver(([{contentRect:t}])=>{let r=Math.min(window.devicePixelRatio||1,1.5,720/Math.max(1,t.width));e.width=Math.max(1,Math.round(t.width*r)),e.height=Math.max(1,Math.round(t.height*r)),n.viewport(0,0,e.width,e.height),n.uniform2f(u.size,t.width,t.height),g()});_.observe(e),f.onload=()=>{m||(n.bindTexture(n.TEXTURE_2D,d),n.texImage2D(n.TEXTURE_2D,0,n.RGB,n.RGB,n.UNSIGNED_BYTE,f),n.uniform2f(u.image,f.naturalWidth,f.naturalHeight),p=!0,g(),e.dataset.ready=`true`)},f.src=t;let b=t=>{t.preventDefault(),delete e.dataset.ready};return e.addEventListener(`webglcontextlost`,b),{render:g,destroy(){m=!0,f.onload=null,_.disconnect(),e.removeEventListener(`webglcontextlost`,b),n.deleteTexture(d),n.deleteBuffer(c),r.forEach(e=>n.deleteShader(e)),n.deleteProgram(a)}}}var x=n(),S=`lake-photograph-muted-v2`,C=`/investly-app/art/lake-iphone-current.webp`,w=[`/investly-app/art/landing-petr-ganaj-lake.webp`,C];function T(e){let t=window.matchMedia(`(prefers-reduced-motion: reduce)`);return t.addEventListener(`change`,e),()=>t.removeEventListener(`change`,e)}function E(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function D({currentTarget:e,clientX:t,clientY:n}){let r=e.getBoundingClientRect();e.style.setProperty(`--glass-x`,`${(t-r.left)/r.width*100}%`),e.style.setProperty(`--glass-y`,`${(n-r.top)/r.height*100}%`)}function O(){let e=c(o()),t=e===i.LANDING,{rootRef:n,introState:f,paused:p,finishIntro:m}=_({introVersion:S,assets:w,reduced:(0,u.useSyncExternalStore)(T,E,()=>!0)}),h=(0,u.useRef)(null),g=(0,u.useRef)(null),v=(0,u.useRef)(null);return(0,u.useEffect)(()=>{let e=b(v.current,w[0]),t=d(g.current,h.current,e?.render);return()=>{t?.(),e?.destroy()}},[]),(0,x.jsxs)(`main`,{className:`landing-demo`,ref:n,"data-paused":p,"data-intro":f,children:[(0,x.jsxs)(`div`,{className:`im-page`,children:[(0,x.jsx)(`div`,{className:`im-landscape`,"aria-hidden":`true`,children:(0,x.jsxs)(`div`,{className:`im-camera-shot`,onAnimationEnd:e=>{e.animationName===`im-camera-settle`&&m()},children:[(0,x.jsx)(`canvas`,{className:`im-lake-film`,ref:v}),(0,x.jsx)(`div`,{className:`im-water-reflection`,children:(0,x.jsx)(`span`,{className:`im-lake-wave`})}),(0,x.jsx)(`div`,{className:`im-atmosphere`})]})}),(0,x.jsx)(`header`,{className:`im-header`,children:(0,x.jsx)(r,{className:`im-logo`,linkToLanding:!1})}),(0,x.jsxs)(`section`,{className:`im-hero`,children:[(0,x.jsxs)(`h1`,{"aria-label":`Lær at investere.`,children:[(0,x.jsx)(`span`,{className:`im-title-lead`,children:`Lær at`}),(0,x.jsx)(`span`,{className:`im-signature`,children:(0,x.jsx)(`em`,{className:`im-signature-face`,children:`investere.`})})]}),(0,x.jsxs)(`p`,{className:`im-intro`,children:[`Find din platform. Prøv dit første køb.`,(0,x.jsx)(`br`,{}),`Øv dig uden at bruge rigtige penge.`]})]}),(0,x.jsxs)(`div`,{className:`im-lake-stage`,"aria-hidden":`true`,children:[(0,x.jsx)(`div`,{className:`im-mirror-water`,children:(0,x.jsxs)(`div`,{className:`im-mirror-bed`,children:[(0,x.jsx)(`canvas`,{className:`im-reflection-waves`,ref:g}),(0,x.jsx)(`img`,{className:`im-reflection-still`,src:C,alt:``})]})}),(0,x.jsx)(`div`,{className:`im-rise-window`,children:(0,x.jsx)(`div`,{className:`im-handset-lift`,children:(0,x.jsx)(`img`,{className:`im-handset`,ref:h,src:C,width:`780`,height:`1731`,alt:``,draggable:`false`,fetchPriority:`high`})})})]}),(0,x.jsxs)(l,{className:`im-main-cta guide-glass-action`,href:t?i.MOTIVATION:e,onPointerMove:D,onPointerDown:D,children:[(0,x.jsx)(`span`,{children:t?`Start guiden`:e===i.HOME?`Se dit overblik`:`Fortsæt guiden`}),(0,x.jsx)(s,{size:18,strokeWidth:1.5,"aria-hidden":`true`})]})]}),(0,x.jsx)(a,{})]})}export{O as default};