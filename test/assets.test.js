import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {planets} from '../src/data.js';
import {histories,stories} from '../src/content.js';
test('todos os planetas, nuvens e Sol possuem mapas JPEG locais válidos',async()=>{
 for(const name of [...planets.map(p=>p.texture),'sun','earth_clouds']){
  const bytes=await readFile(new URL(`../web/public/textures/${name}.jpg`,import.meta.url));
  assert.ok(bytes.length>1000,name);assert.equal(bytes.readUInt16BE(0),0xffd8,name);
 }
});
test('oito histórias planetárias e quatro temas de exploração possuem fontes',()=>{
 assert.equal(histories.length,8);assert.equal(stories.length,4);
 for(const item of [...histories,...stories]){assert.ok((item.text||item.body).length>100);assert.ok(new URL(item.url).protocol==='https:');}
 assert.equal(new Set(stories.map(s=>s.id)).size,4);
});
