import{g as _,u as U,h as b,i as B,e as O,P as h,M as w}from"./DsRhVtIT.js";import{e as A,a as j}from"./xAAeZd5K.js";import{d as z,t as p,as as C,O as f,B as m,z as L,A as G,q as I,o as T,a as D,b as g,Q as V,C as r}from"./8gaUAh2V.js";import{u as k}from"./DMBSLpA_.js";import"./OWhG9hoH.js";const N=`#ifndef PI
#define PI 3.141592653589
#endif

#define BUBBLE_AMOUNT 0.2
#define BUBBLE_RADIUS 0.9

uniform vec2 mousePos;
uniform float progressStart;
uniform float progressEnd;
uniform float radius;
varying vec2 vUv;


float scaleValue(float value, float valueMin, float valueMax, float targetMin, float targetMax) {
    return clamp(targetMin + (value - valueMin) / (valueMax - valueMin) * (targetMax - targetMin), min(targetMin, targetMax), max(targetMin, targetMax));
}

vec4 bend(vec4 coords, float progressStart, float progressEnd) {
    vec4 bentCoords = coords;
    float yAnimationOffset = 0.25;

    // Include Y into the progress
    float adjustedProgress = progressStart + (1.0 - coords.y) * yAnimationOffset;

    if (progressStart > 0.5) {
        float endProgressStart = scaleValue(progressStart, 0.5, 1.0, 0.0, 1.0);
        adjustedProgress = progressStart * endProgressStart + adjustedProgress * (1.0 - endProgressStart);
    }

    float angle = (1.0 - adjustedProgress) * PI;
    float zOffset = (2.0 - cos(angle) * 2.0);

    #if USE_MOUSE
        float yOffset = (1.0 - progressStart) * 0.25 + progressEnd * 2.25;
    #else
        float yOffset = (1.0 - progressStart) * 0.55 + progressEnd * 2.25;
    #endif

    bentCoords.y = bentCoords.y * cos(angle) + yOffset;
    bentCoords.z = bentCoords.z * sin(angle) - zOffset;

    return bentCoords;
}

void main() {
    vUv = uv;

    // Progress effect
    vec4 bentPosition = bend(vec4(position, 1.0), progressStart, progressEnd);

    // Mouse effect
    vec4 pos = modelViewMatrix * bentPosition;
    vec4 posScreen = projectionMatrix * pos;
    vec3 posScreenNormalized = posScreen.xyz / posScreen.w;

    #if USE_MOUSE
        float mouseDistance = length(mousePos.xy - posScreenNormalized.xy);
        float displacementStrength = 1.0 - smoothstep(0.0, BUBBLE_RADIUS, mouseDistance);
        float displacement = displacementStrength * BUBBLE_AMOUNT;

        pos.z += displacement;
    #endif

    gl_Position = projectionMatrix * pos;
}
`,R=`varying vec2 vUv;
uniform sampler2D imageTexture;

void main() {
    gl_FragColor = texture2D(imageTexture, vUv);
}
`,W={ref:"video",crossOrigin:"anonymous",autoplay:"",loop:"",muted:"",playsinline:"",style:{display:"none"}},Y=1/460*540,q=z({__name:"Landing2GetSeenWebGl",setup(X){const s=p("container"),a=p("video"),v=V(()=>s.value&&s.value.closest(".js-get-seen-section")||".js-get-seen-section"),{matches:i}=k({query:"sm-down"}),l=C(s),S=f(l.x,{lerp:.2}),M=f(l.y,{lerp:.2}),c={value:new _(.5,.5)};i.value||m([S.value,M.value],([n,e])=>{const t=n*2-1,o=e*2-1;c.value.set(t,o*-1)});const{svh:y}=L(),E=G(v),d={value:0},u={value:0};return m([E.position.top,y],([n,e])=>{const t=r(n/(e*100),.75,0,0,1,!0),o=r(n/(e*100),0,-2,0,1,!0),P=A(o),x=j(t-o);d.value=r(x,0,1,-.25,1),u.value=P}),I(()=>{if(s.value){const n=U({container:s.value,camera:{fov:28,near:0,far:200,position:[0,-.048,2.04],rotation:[0,0,0]},renderer:{transparent:!0}});if(a.value){a.value.play();const e=new b({side:O,fragmentShader:R,vertexShader:N,uniforms:{imageTexture:{value:new B(a.value)},mousePos:c,progressStart:d,progressEnd:u},defines:{USE_MOUSE:i.value?0:1}}),t=new h(1,Y,20,20),o=new w(t,e);n.scene?.add(o)}n.start()}}),(n,e)=>(T(),D("div",{ref_key:"container",ref:s,class:"landing-2-get-seen-webgl"},[g("video",W,[...e[0]||(e[0]=[g("source",{src:"/uploads/fa_homepage_comp.mp4",type:"video/mp4"},null,-1)])],512)],512))}}),Z=Object.assign(q,{__name:"Landing2GetSeenWebGl"});export{Z as default};
