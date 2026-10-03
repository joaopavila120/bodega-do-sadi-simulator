// PNGs compartilhados pelo cenário, pedidos, bandeja e catálogo do celular.
'use strict';
const ITEM_SPRITE_KEYS = ['erva','pao_xis','burger','burger_pronto','ovo','ovo_pronto','queijo','salada','bacon','coracao','refri','cerveja','cachaca','cigarro','cigarro_py','codorna','pepino','salame','amendoim','pinhao','bergamota','cafe','bitter','torrada','xis_montado','xis_prensado','mate','wait'];
const ITEM_ART = Object.fromEntries(ITEM_SPRITE_KEYS.map(key => {
  const image = new Image();
  image.src = 'assets/images/items/' + key + '.png';
  return [key, image];
}));

function itemArtKey(key, item) {
  if (key?.startsWith('xis_') && !['xis_montado','xis_prensado'].includes(key)) return item && !item.ready ? 'xis_montado' : 'xis_prensado';
  if (key === 'cigarro' && G?.up.cigarro_py) return 'cigarro_py';
  if (item?.ready && ['burger','ovo'].includes(key)) return key + '_pronto';
  return key;
}

function itemFilter(item) {
  if (item?.spoiled) return 'grayscale(.8) brightness(.65)';
  if (item?.burned) return 'brightness(.32)';
  if (item?.ready && ['bacon','coracao'].includes(item.key)) return 'saturate(.8) brightness(.72)';
  return 'none';
}

function itemIconHTML(key, item=null) {
  const artKey = itemArtKey(key,item);
  if (!ITEM_ART[artKey]) return '';
  const badge = key === 'xis_bacon' ? 'bacon' : key === 'xis_coracao' ? 'coracao' : item?.cheese ? 'queijo' : null;
  return `<span class="pixel-item" aria-hidden="true"><img src="assets/images/items/${artKey}.png" alt="" draggable="false" style="filter:${itemFilter(item)}">${badge?`<img class="pixel-item-extra" src="assets/images/items/${badge}.png" alt="" draggable="false">`:''}</span>`;
}

function food(key,x,y,size=40,item=null) {
  const image = ITEM_ART[itemArtKey(key,item)];
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.filter = itemFilter(item);
  if (image?.complete && image.naturalWidth) {
    const scale = size / Math.max(image.naturalWidth,image.naturalHeight);
    const w=image.naturalWidth*scale,h=image.naturalHeight*scale;
    ctx.drawImage(image,Math.round(x-w/2),Math.round(y-h/2),w,h);
  }
  ctx.restore();
  if (key==='xis_bacon'||key==='xis_coracao') food(key==='xis_bacon'?'bacon':'coracao',x+size*.31,y+size*.25,size*.48);
  if (item?.cheese) food('queijo',x,y-4,size*.62);
  if (item?.spoiled) {
    ctx.save();ctx.strokeStyle='#d4ce72';ctx.lineWidth=2;
    for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(x-10+k*10,y-18);ctx.bezierCurveTo(x-18+k*10,y-25,x+k*10,y-29,x-10+k*10,y-35);ctx.stroke();}
    ctx.restore();
  }
}
