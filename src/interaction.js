export const selectableMeshes = (sun,bodies) => [sun,...bodies.map(b=>b.mesh)];

// Evita tratar arraste, botão direito ou pinça como seleção de um planeta.
export function createSelectionGesture(threshold=6) {
  const active=new Set();
  let candidate=null;
  return {
    down(e) {
      active.add(e.pointerId);
      if(active.size!==1||e.button!==0){candidate=null;return;}
      candidate={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
    },
    move(e) {
      if(candidate?.id===e.pointerId&&Math.hypot(e.clientX-candidate.x,e.clientY-candidate.y)>threshold)candidate.moved=true;
    },
    up(e) {
      const clicked=active.size===1&&candidate?.id===e.pointerId&&!candidate.moved&&Math.hypot(e.clientX-candidate.x,e.clientY-candidate.y)<=threshold;
      active.delete(e.pointerId);
      candidate=null;
      return Boolean(clicked);
    },
    cancel(e) {active.delete(e.pointerId);candidate=null;},
  };
}
