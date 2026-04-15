import{d as U,t as V,as as E,O as Y,ca as j,q as F,B as R,o as q,a as Z,b as $,e as C,D as J,n as K,i as x,C as Q,av as O}from"./8gaUAh2V.js";import{T as ee,h as ne,g as W,e as ae,P as te,M as oe,u as ie,V as L}from"./DsRhVtIT.js";import{u as se}from"./DvUndZqG.js";import{u as re}from"./DMBSLpA_.js";import"./OWhG9hoH.js";const le=`#ifndef PI
#define PI 3.141592653589
#endif

uniform vec2 progress;
uniform float progressScale;
uniform float offset;
uniform float radius;
uniform float effect;
varying vec2 vUv;

#define WIDTH 1.0
#define HEIGHT 1.0

vec3 getPoint(float radius, float anglePointX, float anglePointY) {
    return vec3(
        cos(anglePointX) * radius,
        sin(anglePointY) * radius,
        cos(anglePointY) * sin(anglePointX) * radius
    );
}

vec3 rotatePointAroundAnchorZ(vec3 point, vec3 anchor, float angle) {
    // Rotate a point around anchor
    vec3 relativePoint = point - anchor;
    vec3 rotatedPoint = vec3(
        cos(angle) * relativePoint.x - sin(angle) * relativePoint.y,
        sin(angle) * relativePoint.x + cos(angle) * relativePoint.y,
        relativePoint.z
    );
    return rotatedPoint + anchor;
}

vec3 rotatePointAroundAnchorY(vec3 point, vec3 anchor, float angle) {
    // Rotate a point around anchor
    vec3 relativePoint = point - anchor;
    vec3 rotatedPoint = vec3(
        cos(angle) * relativePoint.x - sin(angle) * relativePoint.z,
        relativePoint.y,
        sin(angle) * relativePoint.x + cos(angle) * relativePoint.z
    );
    return rotatedPoint + anchor;
}

void main() {
    vUv = uv;

    float angleX = WIDTH / radius;
    float angleY = HEIGHT / radius;
    float angleBaseX = offset + progress.x * progressScale;
    float angleBaseY = 0.0; //progress.y * progressScale;

    float anglePointX = angleX * (uv.x - 0.5) * 2.0 + angleBaseX;
    float anglePointY = angleY * (uv.y - 0.5) * 2.0 + angleBaseY;

    // Rotate point when effect > 0.0
    vec3 point = getPoint(radius, anglePointX, anglePointY);
    vec3 anchor = getPoint(radius, anglePointX, 0.0);

    // Base point when effect < 1.0
    // Calculate how much we need to move and scale base so that it would match position and size of image with full effect
    // Since we are calculating relative to projection which is "radius" amount away from anchor (0,0,0), we can just use
    // sin and cos to calculate correct scale and position
    float baseDistanceScale = radius * cos(1.0 / radius);
    float baseSizeScale = radius * sin(1.0 / radius);

    // Rotate by 90 degress to match correct orientation
    vec3 pointBase = rotatePointAroundAnchorY(position * baseSizeScale * 2.0, vec3(0.0, 0.0, 0.0), PI / 2.0);

    // Rotate around
    pointBase = rotatePointAroundAnchorY(pointBase + vec3(baseDistanceScale, 0.0, 0.0), vec3(0.0, 0.0, 0.0), angleBaseX);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(mix(pointBase, point, effect), 1.0);
}
`,ce=`varying vec2 vUv;
uniform sampler2D imageTexture;

void main() {
    gl_FragColor = texture2D(imageTexture, vUv);
}
`;function ue(I,y,{rotation:o,position:u,scale:g,radius:T,offset:b,progress:w,progressScale:v,effect:P}={}){return new ee().loadAsync(y).then(_=>{const S=new ne({side:ae,fragmentShader:ce,vertexShader:le,uniforms:{imageTexture:{value:_},radius:T||{value:1},offset:{value:b||0},progressScale:{value:v||1},progress:{value:w||new W(0,0)},effect:P||{value:1}}}),A=new te(1,1,20,20),a=new oe(A,S);return a.frustumCulled=!1,u&&a.position.set(u.x,u.y,u.z),o&&a.rotation.set(o.x,o.y,o.z),g&&a.scale.set(g,g,g),I.scene?.add(a),a})}const ve={class:"landing-9-testimonials-webgl__navigation"},N=4.24,fe=2.07,de=U({__name:"Landing9TestimonialsWebGl",props:{count:{}},setup(I,{expose:y}){const o=I,u=V("container"),g=E(),T=Y(g.x),b=x(!0),w=x(!1),v=x(0),P=Y(v,{precision:.002,time:1e3}),{matches:_}=re({query:"sm-down"}),S=j(),A=new Array(o.count).fill(null).map((t,f)=>S(`/images/landing/9.testimonials/Review-${f+1}.png`,{width:2920,format:"avif"})),a=x(!1),r=x(0);let z=0;se(u,{inertia:!0,dragstart:[({detail:t})=>{t.currentTarget?.closest("a, .btn")||(r.value=z=P.value.value,a.value=!0)}],dragend:[({detail:t})=>{if(a.value){a.value=!1,P.reset(r.value);const f=Math.abs(t.xy[0]-t.start[0])>=10?t.inertia.x:0;let e=0;f?e=f>0?Math.floor(r.value):Math.ceil(r.value):e=r.value%1>.5?Math.ceil(r.value):Math.floor(r.value),v.value=O(e,0,o.count-1)}}],dragmove:[D],keymove:[D]});function D({detail:t}){if(a.value){const f=_.value?window.innerWidth:window.innerWidth/1460*460,e=(t.start[0]-t.xy[0])/f/2+z;e<0?r.value=e/5:e>o.count-1?r.value=(e-o.count+1)/5+o.count-1:r.value=e}}const G=[[-22,-4.1,-29],[-10.6,-2.3,-23],[-3.9,2.5,-17],[0,0,0],[3.9,2.5,-17],[9.2,-1.4,-23],[22,-4.1,-29]],H=[[-.8,0,0],[.4,0,0],[-.6,0,0],[0,0,0],[-.6,0,0],[.4,0,0],[-.8,0,0]];function k(){v.value<o.count-1&&v.value++}function X(){v.value>0&&v.value--}return F(()=>{if(u.value){const t=ie({container:u.value,camera:{fov:_.value?18.5:28,far:69,position:[0,0,4],rotation:[0,0,0]},renderer:{transparent:!0},debug:!1});Promise.all(A.map(async(e,M)=>{const m=new W(0,0),n={value:M===0?0:1},i={value:N};return{card:await ue(t,e,{offset:Math.PI*-.5,progressScale:.87,radius:i,position:new L(0,0,0),rotation:new L(0,0,0),scale:3.2,progress:m,effect:n}),progress:m,effect:n,radius:i}})).then(e=>{function M(n,i){const s=Math.floor(n)+3,c=Math.ceil(n)+3,l=i[s],p=i[c];if(l){if(!p)return i[i.length-1]}else return i[0];const h=n>0?Math.abs(n)%1:1-Math.abs(n)%1,d=Math.sin(h*Math.PI*.5);return[l[0]+(p[0]-l[0])*d,l[1]+(p[1]-l[1])*d,l[2]+(p[2]-l[2])*d]}function m(n,i){e.forEach((s,c)=>{const l=O(n>c?n-c:c-n,0,1),p=i*.2*l,h=c-n-p;if(h<-3||h>3)s.card.visible=!1;else{s.card.visible=!0,s.progress.x=(n-c)*-1;const d=M(h,G);s.card.position.set(d[0],d[1],d[2]);const B=M(h,H);s.card.rotation.set(B[0],B[1],B[2]),s.effect.value=l,s.radius.value=Q(l,0,1,N,fe)}})}m(0,.5),t.start(),R([P.value,a,r,T.value],([n,i,s,c])=>{m(i?s:n,c)})}),R(v,e=>{b.value=e===0,w.value=e===o.count-1})}}),y({next:k,previous:X}),(t,f)=>{const e=J;return q(),Z("div",{ref_key:"container",ref:u,class:K(["landing-9-testimonials-webgl",{"is-dragging":a.value}])},[$("div",ve,[C(e,{variant:"block link accent",icon:"step-back","icon-position":"left",title:"Prev","text-size":"smaller",disabled:b.value,onClick:X},null,8,["disabled"]),C(e,{variant:"block link accent",icon:"step-next","icon-position":"right",title:"Next","text-size":"smaller",disabled:w.value,onClick:k},null,8,["disabled"])])],2)}}}),xe=Object.assign(de,{__name:"Landing9TestimonialsWebGl"});export{xe as default};
