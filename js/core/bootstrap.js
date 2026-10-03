// Único ponto de inicialização. Os outros scripts apenas definem dados e funções.
'use strict';

function waitForImage(image, label) {
  return new Promise((resolve, reject) => {
    if (image.complete) {
      if (image.naturalWidth) resolve();
      else reject(new Error('Imagem ausente ou inválida: ' + label));
      return;
    }
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', () => reject(new Error('Não foi possível carregar: ' + label)), { once: true });
  });
}

async function initializeGame() {
  const status = $('startupStatus');
  try {
    if (window.bodegaLoadErrors.length) {
      throw new Error('Scripts ausentes: ' + window.bodegaLoadErrors.join(', '));
    }
    G = fresh();
    try {
      AudioEngine.on = localStorage.getItem('bodega-sound') !== 'false';
      AudioEngine.music = localStorage.getItem('bodega-music') !== 'false';
    } catch (_) { /* O modo sem persistência ainda permite jogar. */ }

    await Promise.all([
      waitForImage(roomArt, ROOM_DATA),
      ...Object.entries(ITEM_ART).map(([key,image])=>waitForImage(image,"assets/images/items/"+key+".png")),
      waitForImage(peopleArt, PEOPLE_DATA),
      waitForImage(furnitureArt, FURNITURE_DATA),
      waitForImage(horseArt, HORSE_DATA),
      waitForImage(bocceArt, 'assets/images/bocha.png'),
      waitForImage($('startLogo'), 'assets/images/logo.png'),
      ...roomImages.map((im,i)=>waitForImage(im,ROOMS[i].file)),
      ...Object.entries(CHARACTER_ART).map(([name,im])=>waitForImage(im,name+'.png'))
    ]);

    await restoreDialogues();
    selectStartingRoom(1);initializeCharacterChoice();
    refreshHUD();
    draw();
    $('continue').disabled = !readSave();
    document.querySelector('#start [data-act="new"]').disabled = false;
    document.querySelector('#start [data-act="test"]').disabled = false;
    status.classList.add('hidden');
    document.documentElement.dataset.gameReady = 'true';
    lastFrame = performance.now();
    requestAnimationFrame(frame);
  } catch (error) {
    console.error('Falha ao iniciar a bodega:', error);
    document.documentElement.dataset.gameReady = 'error';
    status.textContent = 'Não foi possível iniciar o jogo. ' + error.message + ' Mantenha as pastas js, css e assets junto do HTML e recarregue a página.';
  }
}

initializeGame();
