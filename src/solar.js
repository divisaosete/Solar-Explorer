import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {planets,dimensions,angleAt} from './data.js';
import {DEFAULT_SPEED,advanceDays,visualSpinAngle} from './simulation.js';
import {createSelectionGesture,selectableMeshes} from './interaction.js';
import {SUN_INDEX,sunData} from './sun.js';

export function createSolar(host,onSelect,onTime){
 const renderer=new T.WebGLRenderer({antialias:true});
 renderer.setClearColor(0x000000);renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 host.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,1,.01,50000);
 const controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=true;controls.minDistance=1;controls.maxDistance=180;controls.maxPolarAngle=Math.PI*.94;
 scene.add(new T.AmbientLight(0xc7d4ed,.22));
 scene.add(new T.PointLight(0xfff2db,3.8,0,0));
 let low=matchMedia('(max-width:760px)').matches||(navigator.hardwareConcurrency||4)<=4;
 let geometry=new T.SphereGeometry(1,low?32:64,low?24:48);
 let disposed=false,proportional=false,playing=true,speed=DEFAULT_SPEED,days=0,visualSeconds=0;
 let last=performance.now(),raf,selected=null,transition=null,labels=true;
 const loader=new T.TextureLoader(),ownedTextures=new Set();
 const asset=name=>`${import.meta.env.BASE_URL}textures/${name}.jpg`;
 let textureWarning;
 function loadMap(name,apply,color=true){
  const map=loader.load(asset(name),loaded=>{if(disposed){loaded.dispose();return;}apply(loaded);},undefined,()=>{
   if(disposed||textureWarning)return;
   textureWarning=document.createElement('span');textureWarning.className='texture-warning';
   textureWarning.textContent='Alguns mapas não carregaram. Exibindo materiais alternativos.';textureWarning.setAttribute('role','status');host.append(textureWarning);
  });
  if(color)map.colorSpace=T.SRGBColorSpace;
  map.anisotropy=Math.min(low?2:4,renderer.capabilities.getMaxAnisotropy());ownedTextures.add(map);return map;
 }
 const sun=new T.Mesh(geometry,new T.MeshBasicMaterial({color:0xffffff}));sun.scale.setScalar(3.2);sun.userData.index=SUN_INDEX;sun.rotation.z=T.MathUtils.degToRad(7.25);scene.add(sun);
 loadMap('sun',map=>{sun.material.map=map;sun.material.needsUpdate=true;});
 const sunLabel=document.createElement('span');sunLabel.className='label';sunLabel.textContent='Sol';host.append(sunLabel);
 const haloCanvas=document.createElement('canvas');haloCanvas.width=128;haloCanvas.height=128;
 const hc=haloCanvas.getContext('2d'),glow=hc.createRadialGradient(64,64,12,64,64,64);
 glow.addColorStop(0,'rgba(255,227,158,.5)');glow.addColorStop(.35,'rgba(255,190,77,.15)');glow.addColorStop(1,'rgba(255,160,60,0)');hc.fillStyle=glow;hc.fillRect(0,0,128,128);
 const haloTexture=new T.CanvasTexture(haloCanvas);ownedTextures.add(haloTexture);
 const halo=new T.Sprite(new T.SpriteMaterial({map:haloTexture,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));halo.scale.set(15,15,1);scene.add(halo);
 let seed=72;const rand=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
 const starCount=3600,stars=new Float32Array(starCount*3),starColors=new Float32Array(starCount*3);
 for(let i=0;i<starCount;i++){
  const theta=rand()*Math.PI*2,u=rand()*2-1,r=12000+rand()*4000,b=.2+Math.pow(rand(),3)*.8;
  stars[i*3]=r*Math.sqrt(1-u*u)*Math.cos(theta);stars[i*3+1]=r*u;stars[i*3+2]=r*Math.sqrt(1-u*u)*Math.sin(theta);
  starColors.set([b*(.85+rand()*.15),b*(.88+rand()*.12),b],i*3);
 }
 const starGeo=new T.BufferGeometry();starGeo.setAttribute('position',new T.BufferAttribute(stars,3));starGeo.setAttribute('color',new T.BufferAttribute(starColors,3));
 const starField=new T.Points(starGeo,new T.PointsMaterial({vertexColors:true,size:1.1,sizeAttenuation:false,toneMapped:false,depthWrite:false}));starField.frustumCulled=false;scene.add(starField);
 function fallback(p){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle=p.color;ctx.fillRect(0,0,256,128);
  for(let j=0;j<90;j++){ctx.fillStyle=j%2?'rgba(255,255,255,.08)':'rgba(0,0,0,.1)';ctx.beginPath();ctx.ellipse(rand()*256,rand()*128,2+rand()*12,1+rand()*3,0,0,Math.PI*2);ctx.fill();}
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;ownedTextures.add(map);return map;
 }
 function ringMaterial(){
  const data=new Uint8Array(512*4);
  for(let i=0;i<512;i++){const cassini=i>315&&i<341;const fade=i<25?i/25:i>490?(512-i)/22:1;const band=.65+Math.sin(i*.43)*.17+Math.sin(i*1.27)*.1;data.set([202,184,145,cassini?8:Math.round(220*fade*band)],i*4);}
  const map=new T.DataTexture(data,512,1);map.colorSpace=T.SRGBColorSpace;map.needsUpdate=true;ownedTextures.add(map);
  return new T.MeshStandardMaterial({map,side:T.DoubleSide,transparent:true,depthWrite:false,roughness:1});
 }
 const bodies=planets.map(p=>{
  const group=new T.Group(),material=new T.MeshStandardMaterial({map:fallback(p),roughness:1});
  const mesh=new T.Mesh(geometry,material);mesh.userData.index=p.index;group.rotation.z=T.MathUtils.degToRad(p.obliquity);group.add(mesh);scene.add(group);
  loadMap(p.texture,map=>{material.map=map;material.needsUpdate=true;});
  let clouds;
  if(p.index===2){
   clouds=new T.Mesh(geometry,new T.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.55,depthWrite:false,roughness:1}));clouds.scale.setScalar(1.009);clouds.visible=false;group.add(clouds);
   loadMap('earth_clouds',map=>{clouds.material.alphaMap=map;clouds.material.needsUpdate=true;clouds.visible=true;},false);
   const atmosphere=new T.Mesh(geometry,new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.BackSide,blending:T.AdditiveBlending,uniforms:{},vertexShader:'varying vec3 vNormal; varying vec3 vView; void main(){vec4 mv=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',fragmentShader:'varying vec3 vNormal;varying vec3 vView;void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),3.0);gl_FragColor=vec4(0.15,0.42,0.85,rim*0.35);}'}));atmosphere.scale.setScalar(1.035);group.add(atmosphere);
  }
  if(p.index===5){
   const ringGeo=new T.RingGeometry(1.28,2.25,128);const pos=ringGeo.attributes.position,uv=ringGeo.attributes.uv;
   for(let i=0;i<pos.count;i++)uv.setXY(i,(Math.hypot(pos.getX(i),pos.getY(i))-1.28)/(.97),.5);
   const ring=new T.Mesh(ringGeo,ringMaterial());ring.rotation.x=-Math.PI/2;group.add(ring);
  }
  const points=Array.from({length:181},(_,i)=>new T.Vector3(Math.cos(i/180*Math.PI*2),0,Math.sin(i/180*Math.PI*2)));
  const orbit=new T.LineLoop(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:p.color,transparent:true,opacity:.27}));scene.add(orbit);
  const label=document.createElement('span');label.className='label';label.textContent=p.name;host.append(label);
  return {p,group,mesh,orbit,label,clouds};
 });
 const highlight=new T.Mesh(new T.RingGeometry(1.28,1.31,64),new T.MeshBasicMaterial({color:0xf2cc83,side:T.DoubleSide,toneMapped:false}));scene.add(highlight);highlight.visible=false;
 function positions(){sun.rotation.y=visualSpinAngle(visualSeconds);for(const b of bodies){const d=dimensions(b.p,proportional),a=angleAt(days,b.p.year,b.p.index*.8);b.group.scale.setScalar(d.radius);b.group.position.set(Math.cos(a)*d.distance,0,-Math.sin(a)*d.distance);b.orbit.scale.setScalar(d.distance);b.mesh.rotation.y=visualSpinAngle(visualSeconds);if(b.clouds)b.clouds.rotation.y=visualSpinAngle(visualSeconds)*1.06;}}
 function overview(){transition={target:new T.Vector3(),offset:new T.Vector3(0,proportional?8500:64,proportional?11000:76)};}
 // A seleção altera só o destaque. Câmera e alvo permanecem intocados.
 function select(i){selected=i;highlight.visible=i!==null;}
 positions();camera.position.set(0,64,76);controls.update();
 function quality(value){
  low=value==='low'||value==='auto'&&(matchMedia('(max-width:760px)').matches||(navigator.hardwareConcurrency||4)<=4);
  renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.75));starGeo.setDrawRange(0,low?2000:starCount);
  const old=geometry;geometry=new T.SphereGeometry(1,low?32:64,low?24:48);sun.geometry=geometry;
  for(const b of bodies)b.group.traverse(o=>{if(o.isMesh&&o.geometry===old)o.geometry=geometry;});old.dispose();resize();
 }
 function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(host);quality('auto');
 const ray=new T.Raycaster(),pointer=new T.Vector2(),gesture=createSelectionGesture();
 function pointerDown(e){gesture.down(e);}function pointerMove(e){gesture.move(e);}function pointerCancel(e){gesture.cancel(e);}
 function pointerUp(e){if(!gesture.up(e))return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(selectableMeshes(sun,bodies))[0];if(hit){select(hit.object.userData.index);onSelect(hit.object.userData.index);}}
 renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointermove',pointerMove);renderer.domElement.addEventListener('pointerup',pointerUp);renderer.domElement.addEventListener('pointercancel',pointerCancel);
 controls.addEventListener('start',()=>transition=null);
 function frame(now){
  if(disposed||document.hidden)return;raf=requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.1);last=now;
  if(playing){days=advanceDays(days,dt,speed);visualSeconds+=dt*speed;}positions();
  if(transition){const alpha=matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt*6);controls.target.lerp(transition.target,alpha);camera.position.lerp(transition.target.clone().add(transition.offset),alpha);if(camera.position.distanceTo(transition.offset)<transition.offset.length()*.002)transition=null;}
  controls.update();
  if(!transition){const bounded=controls.target.clone().clampLength(0,dimensions(planets[7],proportional).distance*1.25);camera.position.add(bounded.clone().sub(controls.target));controls.target.copy(bounded);}
  camera.updateMatrixWorld();
  // O campo de estrelas acompanha apenas a posição da câmera: fundo distante.
  starField.position.copy(camera.position);
  if(selected!==null){const b=selected===SUN_INDEX?sun:bodies[selected].group;highlight.position.copy(b.position);highlight.scale.setScalar(selected===SUN_INDEX?sun.scale.x:dimensions(bodies[selected].p,proportional).radius);highlight.quaternion.copy(camera.quaternion);}
  for(const b of bodies){const v=b.group.position.clone().project(camera);b.label.hidden=!labels||v.z>1||v.z< -1||Math.abs(v.x)>1||Math.abs(v.y)>1;b.label.classList.toggle('selected',selected===b.p.index);b.label.style.left=(v.x*.5+.5)*host.clientWidth+8+'px';b.label.style.top=(-v.y*.5+.5)*host.clientHeight+'px';}
  const solarScreen=sun.position.clone().project(camera);sunLabel.hidden=!labels||solarScreen.z>1||solarScreen.z< -1||Math.abs(solarScreen.x)>1||Math.abs(solarScreen.y)>1;sunLabel.classList.toggle('selected',selected===SUN_INDEX);sunLabel.style.left=(solarScreen.x*.5+.5)*host.clientWidth+10+'px';sunLabel.style.top=(-solarScreen.y*.5+.5)*host.clientHeight+'px';
  renderer.render(scene,camera);onTime(days);
 }
 function visibility(){cancelAnimationFrame(raf);last=performance.now();if(!document.hidden&&!disposed)raf=requestAnimationFrame(frame);}
 document.addEventListener('visibilitychange',visibility);if(!document.hidden)raf=requestAnimationFrame(frame);
 return {select,overview,quality,setPlaying:v=>playing=v,setSpeed:v=>speed=v,showOrbits:v=>bodies.forEach(b=>b.orbit.visible=v),showLabels:v=>labels=v,
  setScale:v=>{proportional=v;const solarRadius=v?sunData.diameter/2/149600000*200:3.2;sun.scale.setScalar(solarRadius);halo.scale.set(solarRadius*4.7,solarRadius*4.7,1);controls.minDistance=v?.00001:1;controls.maxDistance=v?20000:180;camera.near=v?.000001:.01;camera.updateProjectionMatrix();positions();overview();},
  reset:()=>{days=0;visualSeconds=0;positions();overview();},
  zoom:factor=>{transition=null;const offset=camera.position.clone().sub(controls.target).multiplyScalar(factor);offset.clampLength(controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(offset);},
  dispose:()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',visibility);controls.dispose();const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});materials.forEach(m=>m.dispose());ownedTextures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());renderer.dispose();bodies.forEach(b=>b.label.remove());sunLabel.remove();textureWarning?.remove();renderer.domElement.remove();}
 };
}
