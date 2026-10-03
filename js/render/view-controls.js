'use strict';

function updateViewControls() {
  const label=$('viewZoom');
  if(label)label.textContent=Math.round(camera.zoom*100)+'%';
  const full=document.querySelector('[data-act="full"]');
  if(full){full.setAttribute('aria-label',document.fullscreenElement?'Sair da tela cheia':'Tela cheia');full.title=full.getAttribute('aria-label');}
}
document.addEventListener('fullscreenchange',()=>{updateViewControls();if(document.documentElement.dataset.gameReady==='true')draw();});
updateViewControls();
