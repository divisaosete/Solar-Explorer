import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Mesh,SphereGeometry,MeshBasicMaterial,Raycaster,Vector3} from 'three';
import {selectableMeshes} from '../src/interaction.js';
import {SUN_INDEX,sunData} from '../src/sun.js';
test('raycast seleciona o Sol central e continua selecionando planetas',()=>{
 const geometry=new SphereGeometry(1,16,12),material=new MeshBasicMaterial();
 const sun=new Mesh(geometry,material),planet=new Mesh(geometry,material);
 sun.userData.index=SUN_INDEX;planet.userData.index=0;planet.position.x=5;
 sun.updateMatrixWorld();planet.updateMatrixWorld();
 const targets=selectableMeshes(sun,[{mesh:planet}]);
 const ray=new Raycaster(new Vector3(0,0,10),new Vector3(0,0,-1));
 assert.equal(ray.intersectObjects(targets)[0].object.userData.index,SUN_INDEX);
 ray.set(new Vector3(5,0,10),new Vector3(0,0,-1));
 assert.equal(ray.intersectObjects(targets)[0].object.userData.index,0);
 geometry.dispose();material.dispose();
});
test('ficha solar distingue estrela de planeta e explica rotação diferencial',()=>{
 assert.equal(sunData.index,SUN_INDEX);assert.equal(sunData.texture,'sun');
 assert.ok(sunData.diameter>1e6);assert.ok(sunData.history.length>100);
 assert.ok(sunData.stats.some(([key])=>key.includes('polos')));
 assert.ok(sunData.stats.some(([key])=>key.includes('equador')));
});
