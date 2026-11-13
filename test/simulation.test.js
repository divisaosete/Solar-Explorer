import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Vector3} from 'three';
import {planets,angleAt} from '../src/data.js';
import {DEFAULT_SPEED,advanceDays,visualSpinAngle} from '../src/simulation.js';

test('velocidade padrão restaura avanço orbital ilustrativo e pausa',()=>{
 assert.equal(DEFAULT_SPEED,1);
 assert.equal(advanceDays(0,1,DEFAULT_SPEED),2);
 assert.equal(advanceDays(5,10,0),5);
 assert.equal(advanceDays(0,1,2),4);
});
test('giro visual suave completa uma volta em cerca de 126 segundos',()=>{
 assert.ok(Math.abs(visualSpinAngle(10)-.5)<1e-10);
 assert.ok(Math.abs(visualSpinAngle(2*Math.PI/.05))<1e-10);
 assert.equal(visualSpinAngle(0),0);
});
test('inclinação preserva sentido retrógrado de Vênus e Urano',()=>{
 for(const p of planets){
  const axis=new Vector3(0,1,0).applyAxisAngle(new Vector3(0,0,1),p.obliquity*Math.PI/180);
  assert.equal(Math.sign(axis.y),Math.sign(p.rotation),p.name);
 }
});
test('animação ilustrativa depende do tempo decorrido, não do FPS',()=>{
 let coarse=0,fine=0;
 for(let i=0;i<300;i++)coarse=advanceDays(coarse,1/30,DEFAULT_SPEED);
 for(let i=0;i<1200;i++)fine=advanceDays(fine,1/120,DEFAULT_SPEED);
 for(const p of planets)assert.ok(Math.abs(angleAt(coarse,p.year)-angleAt(fine,p.year))<1e-10,p.name);
 assert.ok(Math.abs(visualSpinAngle(300/30)-visualSpinAngle(1200/120))<1e-10);
});
