import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSelectionGesture} from '../src/interaction.js';
const point=(id,x=0,y=0,button=0)=>({pointerId:id,clientX:x,clientY:y,button});
test('clique e toque simples permitem seleção',()=>{
 const g=createSelectionGesture();g.down(point(1));assert.equal(g.up(point(1,2,1)),true);
});
test('arrastar e voltar ao início não seleciona',()=>{
 const g=createSelectionGesture();g.down(point(1));g.move(point(1,50));g.move(point(1));assert.equal(g.up(point(1)),false);
});
test('pinça não se converte em clique ao soltar os dedos',()=>{
 const g=createSelectionGesture();g.down(point(1));g.down(point(2));assert.equal(g.up(point(2)),false);assert.equal(g.up(point(1)),false);
 g.down(point(3));assert.equal(g.up(point(3)),true);
});
test('botão direito e gestos cancelados não selecionam',()=>{
 const g=createSelectionGesture();g.down(point(1,0,0,2));assert.equal(g.up(point(1)),false);
 g.down(point(2));g.cancel(point(2));assert.equal(g.up(point(2)),false);
});
