import{i as c}from"./Dd3TuYoE.js";import{u as Y}from"./DMBSLpA_.js";import{T as G,h as R,g as D,e as H,P as L,M as B,u as U,V as T}from"./DsRhVtIT.js";import{f as W}from"./si6jlswl.js";import{u as E}from"./D9e1apFB.js";import{d as k,t as V,as as q,O as I,ca as z,q as j,B as O,o as K,a as Q,b as $,Q as N,C as F}from"./8gaUAh2V.js";import"./OWhG9hoH.js";const{matches:J}=Y({query:"sm-down"});function Z(){const e=J.value?[{progress:[-2.3,-.6],position:[-3.5,-1,-6.2],rotation:[0,.5,.24]},{progress:[-2,-.6],position:[-1.55,-.7,-4.2],rotation:[0,.34,.24]},{progress:[-.9,-.03],position:[0,.35,1.1],rotation:[-.29,0,-.22]},{progress:[-.2,-.03],position:[1,.35,1.1],rotation:[-.29,-.3,-.22]}]:[{progress:[-3,-.6],position:[-.85,-3.05,-4.2],rotation:[0,0,.24]},{progress:[-2.45,-.6],position:[-.4,-1.3,-2.1],rotation:[0,0,.11]},{progress:[-.9,0],position:[-.05,.25,0],rotation:[0,0,-.2]},{progress:[.65,0],position:[-2.4,1.3,0],rotation:[0,0,-.2]}];return{progress:[c(e.map(o=>o.progress[0])),c(e.map(o=>o.progress[1]))],position:[c(e.map(o=>o.position[0])),c(e.map(o=>o.position[1])),c(e.map(o=>o.position[2]))],rotation:[c(e.map(o=>o.rotation[0])),c(e.map(o=>o.rotation[1])),c(e.map(o=>o.rotation[2]))]}}const oo=`#ifndef PI
#define PI 3.141592653589
#endif

uniform vec2 progress;
uniform float progressScale;
uniform float offset;
uniform float radius;
varying vec2 vUv;

#define WIDTH 1.0
#define HEIGHT 1.18

vec3 getPoint(float radius, float anglePointX, float anglePointY) {
    return vec3(
        cos(anglePointX) * radius,
        sin(anglePointY) * radius,
        cos(anglePointY) * sin(anglePointX) * radius
    );
}

void main() {
    vUv = uv;

    float angleX = WIDTH / radius;
    float angleY = HEIGHT / radius;
    float anglePointX = angleX * (uv.x - 0.5) * 2.0 + offset + progress.x * progressScale;
    float anglePointY = angleY * (uv.y - 0.5) * 2.0 + progress.y * progressScale;

    vec3 point = getPoint(radius, anglePointX, anglePointY);
    vec3 anchor = getPoint(radius, anglePointX, 0.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(point, 1.0);
}
`;function no(e,o,{rotation:t,position:l,scale:m,radius:x,offset:f,progressScale:w,progressUniform:M,alphaUniform:_}={}){return new G().loadAsync(o).then(g=>{const y=new R({side:H,transparent:!0,fragmentShader:W,vertexShader:oo,uniforms:{alpha:_||{value:1},imageTexture:{value:g},progress:M||{value:new D(0,0)},radius:{value:x||1},offset:{value:f||0},progressScale:{value:w||1}}}),d=new L(1,1/220*260,20,20),a=new B(d,y);return a.frustumCulled=!1,l&&a.position.set(l.x,l.y,l.z),t&&a.rotation.set(t.x,t.y,t.z),m&&a.scale.set(m,m,m),e.scene?.add(a),a})}const eo={class:"nexus-section-2-webgl"},S=.4,P=4,to=k({__name:"NexusCardYourCardWebGl",props:{position:{},positionOffset:{}},setup(e){const o=e,t=V("container"),l=q(),m=I(l.x,{inviewElement:t}),x=I(l.y,{inviewElement:t}),{matches:f}=Y({query:"sm-down"}),w=N(()=>o.position),M=N(()=>o.positionOffset),_=I(w,{inviewElement:t}),g=z(),y=[g("/images/nexus-card/your-card/tag-1.png",{width:440,format:"avif"}),g("/images/nexus-card/your-card/tag-2.png",{width:440,format:"avif"}),g("/images/nexus-card/your-card/tag-3.png",{width:440,format:"avif"})];return j(()=>{if(t.value){const d=f.value?[0,0,5.5]:[0,0,5.5],a=[0,0,0],p=Z(),b={value:f.value?0:1},A=function(s,n){s.position.set(p.position[0](n),p.position[1](n),p.position[2](n)),s.rotation.set(p.rotation[0](n),p.rotation[1](n),p.rotation[2](n)),s.userData.progressUniform.value.set(p.progress[0](n),p.progress[1](n))},v=U({container:t.value,camera:{fov:23,far:69,position:d,rotation:[0,0,0],contain:"width"},renderer:{transparent:!0},debug:!1});Promise.all(y.map((s,n)=>{const u=Math.max(0,2-n),i={value:new D(0,0)};return no(v,s,{offset:0,progressScale:1,radius:1.52,position:new T(0,0,0),rotation:new T(0,0,0),scale:.6,progressUniform:i,alphaUniform:b}).then(r=>(r.userData.progressUniform=i,A(r,u),E()?.ready.then(h=>{h.card(r,`Card ${n+1}`),r.userData.pane.addBinding(i,"value",{label:"Progress uniform",min:-3,max:3})}),r))})).then(s=>{v.start();const n=()=>{if(v.camera){const u=d,i=(m.value.value-.5)*S+Math.PI*.5,r=(x.value.value-.5)*S,h=u[0]+P*Math.cos(i),C=u[1]+P*Math.sin(r),X=u[2]+P*Math.sin(i)*Math.cos(r)-P;v.camera.position.set(h,C,X),v.camera.lookAt(a[0],a[1],a[2])}};O([m.value,x.value],n),O([_.value,M],([u,i])=>{b.value=f.value?F(u+i,-1,-.8,0,1,!0):1,s.forEach((r,h)=>{const C=Math.max(0,2-h+u+i);A(r,C)})})}),E()?.ready.then(s=>{s?.grid(10),s?.axis()})}}),(d,a)=>(K(),Q("div",eo,[$("div",{ref_key:"container",ref:t,class:"nexus-section-2-webgl__content"},null,512)]))}}),lo=Object.assign(to,{__name:"NexusCardYourCardWebGl"});export{lo as default};
