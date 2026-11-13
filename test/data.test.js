import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planets,angleAt,dimensions} from '../src/data.js';
test('oito fichas completas e com identificadores únicos',()=>{
 assert.equal(planets.length,8);assert.equal(new Set(planets.map(p=>p.id)).size,8);
 for(const p of planets){for(const k of ['diameter','mass','gravity','distance','year','day'])assert.ok(Number.isFinite(p[k])&&p[k]>0,`${p.name}: ${k}`);for(const k of ['description','atmosphere','fact'])assert.ok(p[k].length>15);}
 assert.ok(planets[1].rotation<0&&planets[6].rotation<0);
 assert.ok(planets[3].temperature<0);
 assert.equal(planets[2].diameter,6371.0084*2);
 assert.equal(planets[4].diameter,69911*2);
 for(const p of planets)assert.ok(p.diameter<=p.equatorialDiameter,p.name);
});
test('uma órbita completa respeita o período de cada planeta',()=>{
 for(const p of planets)assert.ok(Math.abs(angleAt(p.year,p.year)-2*Math.PI)<1e-12);
 assert.ok(Math.abs(angleAt(100,365.2)-angleAt(40,365.2)-angleAt(60,365.2))<1e-12);
});
test('modo proporcional preserva a razão física entre diâmetro e distância',()=>{
 for(const p of planets){const d=dimensions(p,true);assert.ok(Math.abs(d.radius*2/d.distance-p.diameter/(p.distance*1e6))<1e-12);}
 for(const p of planets){const d=dimensions(p,false);assert.ok(d.radius>0&&d.distance>d.radius);}
});
