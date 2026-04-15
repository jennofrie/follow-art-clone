import{M as y,I as U,D as W,R as V,H as $,a as S,L as A,b as w,c as X,C as q,V as Y,u as L,d as T,e as F,f as Z,S as J,P as O}from"./DsRhVtIT.js";import{d as K,G as Q,t as ee,as as te,O as ae,ca as ne,q as oe,B as k,o as re,a as se,b as B,r as ie,k as ce}from"./8gaUAh2V.js";import{u as le}from"./DMBSLpA_.js";import"./OWhG9hoH.js";const m=4,d=1024,f=4;function fe(s=1){const n=new Uint16Array(d*f*s*m),e=new W(n,d,f*s,V,$);return e.wrapS=S,e.wrapY=S,e.magFilter=A,e.minFilter=A,e.needsUpdate=!0,e}function ue(s,n,e=0){const o=Math.floor(d*(f/4));n.arcLengthDivisions=o/2,n.updateArcLengths();const l=n.getSpacedPoints(o),i=n.computeFrenetFrames(o,!0);for(let a=0;a<o;a++){const c=Math.floor(a/d),r=a%d;let t=l[a];x(s,r,t.x,t.y,t.z,0+c+f*e),t=i.tangents[a],x(s,r,t.x,t.y,t.z,1+c+f*e),t=i.normals[a],x(s,r,t.x,t.y,t.z,2+c+f*e),t=i.binormals[a],x(s,r,t.x,t.y,t.z,3+c+f*e)}s.needsUpdate=!0}function x(s,n,e,o,l,i){const a=s.image,{data:c}=a,r=m*d*i;c[n*m+r+0]=w.toHalfFloat(e),c[n*m+r+1]=w.toHalfFloat(o),c[n*m+r+2]=w.toHalfFloat(l),c[n*m+r+3]=w.toHalfFloat(1)}function me(s){return{spineTexture:{value:s},pathOffset:{type:"f",value:0},pathSegment:{type:"f",value:1},spineOffset:{type:"f",value:161},spineLength:{type:"f",value:400},flow:{type:"i",value:1}}}function D(s,n,e=1){s.__ok||(s.__ok=!0,s.onBeforeCompile=o=>{if(o.__modified)return;o.__modified=!0,Object.assign(o.uniforms,n);const l=`
		uniform sampler2D spineTexture;
		uniform float pathOffset;
		uniform float pathSegment;
		uniform float spineOffset;
		uniform float spineLength;
		uniform int flow;

		float textureLayers = ${f*e}.;
		float textureStacks = ${f/4}.;

		${o.vertexShader}
		`.replace("#include <beginnormal_vertex>","").replace("#include <defaultnormal_vertex>","").replace("#include <begin_vertex>","").replace(/void\s*main\s*\(\)\s*\{/,`
void main() {
#include <beginnormal_vertex>

vec4 worldPos = modelMatrix * vec4(position, 1.);

bool bend = flow > 0;
float xWeight = bend ? 0. : 1.;

#ifdef USE_INSTANCING
float pathOffsetFromInstanceMatrix = instanceMatrix[3][2];
float spineLengthFromInstanceMatrix = instanceMatrix[3][0];
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLengthFromInstanceMatrix : 0.;
float mt = (spinePortion * pathSegment + pathOffset + pathOffsetFromInstanceMatrix)*textureStacks;
#else
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLength : 0.;
float mt = (spinePortion * pathSegment + pathOffset)*textureStacks;
#endif

mt = mod(mt, textureStacks);
float rowOffset = floor(mt);

#ifdef USE_INSTANCING
rowOffset += instanceMatrix[3][1] * ${f}.;
#endif

vec3 spinePos = texture2D(spineTexture, vec2(mt, (0. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 a =        texture2D(spineTexture, vec2(mt, (1. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 b =        texture2D(spineTexture, vec2(mt, (2. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 c =        texture2D(spineTexture, vec2(mt, (3. + rowOffset + 0.5) / textureLayers)).xyz;
mat3 basis = mat3(a, b, c);

vec3 transformed = basis
	* vec3(worldPos.x * xWeight, worldPos.y * 1., worldPos.z * 1.)
	+ spinePos;

vec3 transformedNormal = normalMatrix * (basis * objectNormal);
			`).replace("#include <project_vertex>",`vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
				gl_Position = projectionMatrix * mvPosition;`);o.vertexShader=l})}class E{constructor(n,e=1){const o=n.clone(),l=fe(e),i=me(l);o.traverse(function(a){if(a instanceof y||a instanceof U)if(Array.isArray(a.material)){const c=[];for(const r of a.material){const t=r.clone();D(t,i,e),c.push(t)}a.material=c}else a.material=a.material.clone(),D(a.material,i,e)}),this.curveArray=new Array(e),this.curveLengthArray=new Array(e),this.object3D=o,this.splineTexture=l,this.uniforms=i}updateCurve(n,e){if(n>=this.curveArray.length)throw Error("Flow: Index out of range.");const o=e.getLength();this.uniforms.spineLength.value=o,this.curveLengthArray[n]=o,this.curveArray[n]=e,ue(this.splineTexture,e,n)}moveAlongCurve(n){this.uniforms.pathOffset.value+=n}}new X;class de extends q{options;constructor(){super(),this.options={scale:15}}getPoint(n,e=new Y){const o=this.options.scale;return e.set(Math.cos(n*Math.PI*2)*o,0,Math.sin(n*Math.PI*2)*o)}}const pe={class:"landing-1-intro-webgl"},ge=["data-preload-event"],ve=K({__name:"Landing1IntroWebGl",setup(s){const n=Q(),e=ee("container"),o=te(),l=ae(o.x,{inviewElement:e}),{matches:i}=le({query:"sm-down"}),a=ne(),c=[a("/images/landing/1.intro/webgl/card-01.png",{width:1050,format:"avif"}),a("/images/landing/1.intro/webgl/card-02.png",{width:1050,format:"avif"}),a("/images/landing/1.intro/webgl/card-03.png",{width:1050,format:"avif"}),a("/images/landing/1.intro/webgl/card-04.png",{width:1050,format:"avif"}),a("/images/landing/1.intro/webgl/card-05.png",{width:1050,format:"avif"}),a("/images/landing/1.intro/webgl/card-06.png",{width:1050,format:"avif"}),a("/images/landing/1.intro/webgl/card-07.png",{width:1050,format:"avif"}),a("/images/landing/1.intro/webgl/card-08.png",{width:1050,format:"avif"}),a("/images/landing/1.intro/webgl/card-09.png",{width:1050,format:"avif"})];return oe(()=>{if(e.value){const r=L({container:e.value,camera:{fov:28,near:69,far:200,position:[0,-14,-70],rotation:[Math.PI/180*-192,0,Math.PI/180*-25]},renderer:{transparent:!0,autoRender:!1}}),t=L({container:e.value,camera:{fov:28,far:69,position:[0,-14,-70],rotation:[Math.PI/180*-192,0,Math.PI/180*-25]},renderer:{transparent:!0}}),b=()=>{if(r.camera&&t.camera){const p=i.value?-38:-25,u=i.value?-200:-192;r.camera.rotation.z=t.camera.rotation.z=Math.PI/180*p+(l.value.value-.5)*.2,r.camera.rotation.x=t.camera.rotation.x=Math.PI/180*u}},M=()=>{t.camera&&r.camera&&(r.camera.position.x=t.camera.position.x=i.value?4:0,r.camera.position.y=t.camera.position.y=i.value?-17:-14)};k([l.value,i],b),k(i,M),M(),b();const _=new de,P=[],I=[],C=new T({color:new Z("#B05A2E"),side:F});c.forEach((p,u)=>{const g=t.loadTexture(p,j=>{j.colorSpace=J}),z=new T({map:g,side:F}),G=new O(9,12.6,10,1),N=new y(G,z),H=new O(9,12.6,10,1),R=new y(H,C),v=new E(N),h=new E(R);v.updateCurve(0,_),h.updateCurve(0,_),v.moveAlongCurve(u/c.length),h.moveAlongCurve(u/c.length),t.scene?.add(v.object3D),r.scene?.add(h.object3D),P[u]=v,I[u]=h}),t.events?.on("beforeRender",p=>{const u=p.deltaTime*-5e-5;P.forEach(g=>{g.moveAlongCurve(u)}),I.forEach(g=>{g.moveAlongCurve(u)})}),t.events?.on("render",()=>{r.renderer?.render()}),t.start(),r.start()}}),(r,t)=>(re(),se("div",pe,[B("div",null,[ie(r.$slots,"default")]),B("div",{ref_key:"container",ref:e,class:"landing-1-intro-webgl__canvas-wrapper","data-preload-event":ce(n)},null,8,ge)]))}}),be=Object.assign(ve,{__name:"Landing1IntroWebGl"});export{be as default};
