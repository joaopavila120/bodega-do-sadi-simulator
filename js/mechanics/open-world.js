// Mundo aberto: a vila da bodega e as estradas em volta, mapa por mapa.
// Vila: plantação, fogo de chão do costelão, bodega, cancha e potreiro na estrada de cima; a praça com a capela e o
// salão da comunidade no meio; o rio Uruguai na lateral esquerda e embaixo, onde fica a fronteira com o Uruguai.
// Saindo pela direita, a encruzilhada da região central e os outros mapas (open-world-regions.js).
'use strict';

const WORLD_MAPS = {};
let worldOut = null, worldTufts = {};
function worldTestOn() { return true; }
function worldMap() { return WORLD_MAPS[worldOut?.map || 'vila']; }
function worldCanWalk(x, y) { return worldMap().canWalk(x, y); }
function worldNearest() { const p = worldOut; if (!p) return null; let best = null, bd = 90; for (const s of worldMap().spots()) { const d = Math.hypot(s.x - p.x, s.y - p.y); if (d < bd) { bd = d; best = s; } } return best; }
const front = (r, dy = 30) => ({ x: r.x + r.w / 2, y: r.y + r.h + dy });
const hitRect = (rects, x, y) => rects.some(r => x + 12 > r.x && x - 12 < r.x + r.w && y > r.y && y - 10 < r.y + r.h);

// ---------- Entrar, sair e trocar de mapa ----------
// Porta da bodega: escolhe entre sair para o pátio e abrir/fechar o dia.
function doorMenu() {
  openDialog('Porta da bodega', `<p>O que fazer na porta?</p><div class="game-menu"><button class="primary" data-act="goOutside">Sair para o pátio</button><button data-act="doorPhase">${shopDoorLabel()}</button></div>`, 'doorMenu');
}
function goOutside(at) {
  closeDialog(true); if (phoneOpen) togglePhone(false); keys.clear();
  worldOut = { map: 'vila', ...(at || front(VILA.bodega, 70)), dx: 0, dy: 1, walk: false };
  AudioEngine.doorChime(); if (!at) showBanner('Pátio da bodega', G.phase === 'open' ? 'A bodega segue aberta: fregueses podem chegar e esperar no balcão.' : 'À direita, a estrada da colônia; descendo, a praça e a fronteira.', 'info'); refreshHUD();
}
function goInside() {
  worldOut = null; keys.clear(); G.player = { x: ENTRY.x, y: ENTRY.y - 40, dx: 0, dy: -1, walk: false }; AudioEngine.doorChime(); refreshHUD();
  // Presentes que chegaram enquanto o peão estava fora são entregues quando ele volta.
  if (G.phase === 'closed' && G.giftQueue?.length && !G.challengeVisit) startGiftVisit();
}
// Cancha: o botão da cancha leva para o pátio, na frente dela.
function canchaToPatio() { leaveCancha(true); goOutside(front(VILA.cancha, 40)); }
function switchMap(to) { worldOut.map = to.map; worldOut.x = to.x; worldOut.y = to.y; keys.clear(); AudioEngine.swoosh(.04); showBanner(to.title, to.text || '', 'info'); }

function outsideTick(dt) {
  const p = worldOut; let dx = (keys.has('d') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('a') || keys.has('ArrowLeft') ? 1 : 0), dy = (keys.has('s') || keys.has('ArrowDown') ? 1 : 0) - (keys.has('w') || keys.has('ArrowUp') ? 1 : 0);
  const len = Math.hypot(dx, dy); p.walk = !!len; if (!len) return;
  dx /= len; dy /= len; p.dx = dx; p.dy = dy; const step = BASE_SPEED * 1.4 * (1 + movementBonus()) * dt;
  for (let n = 0; n < 4; n++) { const x = p.x + dx * step / 4, y = p.y + dy * step / 4; if (worldCanWalk(x, p.y)) p.x = x; if (worldCanWalk(p.x, y)) p.y = y; }
  const to = worldMap().edge?.(p); if (to) switchMap(to);
}
function outsideInteract() {
  const s = worldNearest(); if (!s) { effect('Chegue mais perto', worldOut.x, worldOut.y - 52); return; }
  if (s.act) s.act(); else if (s.house) houseVisit(s.house); else say(s.text);
}
function houseVisit(id) { const i = PEOPLE.findIndex(p => p.id === id); if (i < 0) return; say(activeUniqueVisitors().has(i) ? PEOPLE[i].name + ' não está em casa: tá lá na bodega.' : 'Casa do ' + PEOPLE[i].name + ': em breve dá pra bater na porta, prosear e levar presente.'); }
function outsideHint() { const s = worldNearest(); return s ? '<strong>E</strong> ' + s.label : worldMap().name + ' · WASD anda'; }

// ---------- Desenho comum ----------
function beginOutside(M) {
  const cw = canvas.clientWidth, ch = canvas.clientHeight, dpr = lightGraphics ? 1 : Math.min(Math.max(devicePixelRatio || 1, innerWidth >= 750 ? 1.5 : 1), 2);
  if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) { canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr); }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#20190f'; ctx.fillRect(0, 0, cw, ch);
  const fitScale = Math.min(cw / W, ch / H), base = camera.fit ? fitScale : Math.min(Math.max(cw / W, ch / H), fitScale * 1.35), scale = base * camera.zoom;
  const viewW = cw / scale, viewH = ch / scale, p = worldOut;
  const cx = viewW < M.W ? clamp(p.x - viewW / 2, 0, M.W - viewW) : -(viewW - M.W) / 2, cy = viewH < M.H ? clamp(p.y - viewH * .6, 0, M.H - viewH) : -(viewH - M.H) / 2;
  ctx.scale(scale, scale); ctx.translate(-cx, -cy);
  return { x: cx, y: cy, w: viewW, h: viewH };
}
function drawOutside() {
  const M = worldMap(), view = beginOutside(M), seen = (x, y, m = 300) => x > view.x - m && x < view.x + view.w + m && y > view.y - m && y < view.y + view.h + m;
  const layers = [];
  M.draw(view, seen, layers);
  layers.push({ y: worldOut.y, draw: () => personDraw(avatarSprite(), worldOut.x, worldOut.y, worldOut.walk, true, worldOut.dx) });
  layers.sort((a, b) => a.y - b.y).forEach(l => l.draw());
  const night = G.phase === 'closed' ? .5 : G.phase === 'open' ? clamp((G.elapsed / DAY - .7) * 1.2, 0, .35) : 0;
  if (night) {
    rect(view.x, view.y, view.w, view.h, `rgba(12,20,52,${night})`);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [x, y] of M.lights?.() || []) if (seen(x, y)) ellipse(x, y, 44, 32, 'rgba(255,190,90,.32)'); ctx.restore();
  }
  const s = worldNearest(); if (s) { ctx.font = 'bold 13px Arial'; const w = ctx.measureText(s.label).width + 44; rect(s.x - w / 2, s.y - 130, w, 26, '#2b1d12dd', 6, '#ffdf91'); rect(s.x - w / 2 + 6, s.y - 126, 18, 18, '#ffdf91', 4, '#614322'); txt('E', s.x - w / 2 + 15, s.y - 117, 12, '#38291b', 'center', 'Arial', false); txt(s.label, s.x + 11, s.y - 117, 13, '#fff0c3', 'center', 'Arial', false); }
  drawFx();
}
// Peças de desenho reaproveitadas pelos mapas.
function grassField(M, view, seen, base = '#6f9a45', tufts = ['#5f8a3a', '#86ad55'], from = 0) {
  rect(view.x, view.y, view.w, view.h, base);
  worldTufts[M.id] ??= Array.from({ length: Math.round(M.W * M.H / 9000) }, (_, i) => [(i * 811) % M.W, (i * 1307) % M.H, i % 3]);
  for (const [x, y, k] of worldTufts[M.id]) if (x > from && seen(x, y, 20)) rect(x, y, 6 + k * 3, 3, k ? tufts[0] : tufts[1], 1);
}
function road(x, y, w, h, color = '#b08a58', edge = '#9a7646') { rect(x, y, w, h, color); if (w > h) { rect(x, y, w, 4, edge); rect(x, y + h - 4, w, 4, edge); } else { rect(x, y, 4, h, edge); rect(x + w - 4, y, 4, h, edge); } }
function signBoard(x, y, w, text, size = 15) { rect(x - w / 2, y, w, size + 16, '#e8d6a8', 4, '#5a3a20'); txt(text, x, y + (size + 16) / 2, size, '#5a2a14', 'center', 'Georgia'); }
function gable(x, y, w, h, color, over = 24) { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x - over, y + h); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w + over, y + h); ctx.closePath(); ctx.fill(); }
function windowPane(x, y, w = 70, h = 56, frame = '#3a2414') { rect(x, y, w, h, '#2a3a44', 2, frame); rect(x + w / 2 - 2, y, 4, h, frame); }
function poly(pts, c) { ctx.fillStyle = c; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); }
function flagRS(x, y, fw = 90, fh = 60) {
  const d = fh * .23; rect(x, y - 200, 6, 210, '#c8c8c0'); ctx.save(); ctx.translate(x + 6, y - 196 + Math.sin(frameClock * 3) * 2);
  poly([[0, 0], [fw * (1 - d / fh), 0], [0, fh - d]], '#2a8a3a'); poly([[0, fh - d], [fw * (1 - d / fh), 0], [fw, 0], [fw, d], [fw * d / fh, fh], [0, fh]], '#d42a2a'); poly([[fw * d / fh, fh], [fw, d], [fw, fh]], '#f0d020'); ctx.restore();
}
function pennants(x0, x1, y, colors) { ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); const n = Math.max(2, Math.round((x1 - x0) / 34)); for (let k = 0; k <= n; k++) { const x = x0 + k * (x1 - x0) / n; poly([[x - 10, y], [x + 10, y], [x, y + 16]], colors[k % colors.length]); } }
function worldHouse(h, name, style = {}) {
  gable(h.x, h.y - 20, h.w, 90, style.roof || '#9a4a32', 18);
  if (style.chimney !== false) rect(h.x + h.w - 60, h.y - 10, 24, 50, '#6a5a4a');
  rect(h.x, h.y + 64, h.w, h.h - 64, style.wall || '#c9b58a', 0, '#5a4a32');
  rect(h.x + h.w / 2 - 22, h.y + h.h - 70, 44, 70, '#6a4424', 2, '#3a2414');
  for (const x of [h.x + 26, h.x + h.w - 76]) windowPane(x, h.y + 96, 50, 40);
  if (name) signBoard(h.x + h.w / 2, h.y + h.h + 6, Math.max(160, h.w - 40), name, 13);
}
function ownerAtDoor(layers, h, id, seen) { const i = PEOPLE.findIndex(p => p.id === id); if (i >= 0 && !activeUniqueVisitors().has(i) && seen(h.x, h.y)) layers.push({ y: h.y + h.h + 70, draw: () => personDraw(PEOPLE[i].sprite, h.x + h.w + 40, h.y + h.h + 70, false, false, -1) }); }
// Araucária, ipê-amarelo, jacarandá e árvore comum.
function drawWorldTree(x, y, kind) {
  ellipse(x, y + 4, 40, 10, '#1c140c44');
  if (kind === 'a') { rect(x - 6, y - 140, 12, 144, '#5a3a20'); for (const [dy, w] of [[-140, 74], [-170, 56], [-196, 38]]) { ctx.fillStyle = '#2f5a2a'; ctx.beginPath(); ctx.ellipse(x, y + dy, w, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#3f7a36'; ctx.beginPath(); ctx.ellipse(x, y + dy - 5, w * .8, 9, 0, 0, Math.PI * 2); ctx.fill(); } return; }
  rect(x - 5, y - 70, 10, 74, '#5a3a20'); const col = kind === 'ipe' ? ['#e8b820', '#f6d64a'] : kind === 'jaca' ? ['#7a5ab0', '#9a7ad0'] : ['#3f7a36', '#5a9a46'];
  ellipse(x, y - 92, 52, 40, col[0]); ellipse(x - 18, y - 104, 26, 20, col[1]); ellipse(x + 20, y - 86, 24, 18, col[1]);
}

// =================== VILA (mapa da bodega) ===================
const VILA = {
  W: 3600, H: 2700, river: 540, border: 2380, roadY: 690, roadH: 90, roadX: 1580,
  horta: { x: 600, y: 260, w: 250, h: 280 }, fogo: { x: 870, y: 250, w: 400, h: 330 }, bodega: { x: 1300, y: 180, w: 640, h: 420 },
  cancha: { x: 2060, y: 240, w: 460, h: 360 }, potreiro: { x: 2640, y: 200, w: 860, h: 440 },
  praca: { x: 1260, y: 1500, w: 720, h: 560 }, capela: { x: 2080, y: 1480, w: 300, h: 300 }, salao: { x: 2460, y: 1580, w: 600, h: 260 },
  houses: [{ id: 'valter', x: 700, y: 1150, w: 260, h: 190, wall: '#c9b58a', roof: '#9a4a32' }, { id: 'lauro', x: 800, y: 1880, w: 260, h: 190, wall: '#a9c0c4', roof: '#6a4a3a' },
    { id: 'manolima', x: 2700, y: 1900, w: 270, h: 190, wall: '#d8c9a2', roof: '#7a3a2a' }, { id: 'guri', x: 3250, y: 1880, w: 250, h: 190, wall: '#e6d2a8', roof: '#5a4a3a' }],
  marco: { x: 1820, y: 2250, w: 40, h: 60 }
};
VILA.coreto = { x: VILA.praca.x + VILA.praca.w / 2 - 90, y: VILA.praca.y + VILA.praca.h / 2 - 90, w: 180, h: 150 };
const VILA_TREES = [[600, 1000, 'a'], [1210, 960, 'a'], [2010, 1000, 'a'], [3520, 820, 'a'], [600, 1760, 'a'], [3450, 1700, 'a'], [2400, 2200, 'a'], [1100, 2230, 'a'],
  [VILA.praca.x + 70, VILA.praca.y + 80, 'ipe'], [VILA.praca.x + VILA.praca.w - 70, VILA.praca.y + 80, 'jaca'], [VILA.praca.x + 70, VILA.praca.y + VILA.praca.h - 60, 'jaca'], [VILA.praca.x + VILA.praca.w - 70, VILA.praca.y + VILA.praca.h - 60, 'ipe']];
const VILA_ROADS = [[VILA.river, VILA.roadY, VILA.W - VILA.river, VILA.roadH], [VILA.roadX, VILA.roadY, 80, VILA.praca.y - VILA.roadY], [VILA.river, 1440, VILA.W - VILA.river, 60], [VILA.river, 2120, VILA.W - VILA.river, 60],
  [VILA.praca.x, VILA.praca.y + VILA.praca.h / 2 - 22, VILA.praca.w, 44], [VILA.roadX, VILA.praca.y, 80, VILA.praca.h], [VILA.roadX, 2180, 80, VILA.border - 2180]];

WORLD_MAPS.vila = {
  id: 'vila', name: 'Vila da bodega', W: VILA.W, H: VILA.H,
  obstacles() { const V = VILA; return [V.bodega, V.cancha, V.horta, { x: V.fogo.x + 50, y: V.fogo.y + 80, w: V.fogo.w - 100, h: V.fogo.h - 150 }, V.potreiro, V.capela, V.salao, V.coreto, V.marco, ...V.houses]; },
  canWalk(x, y) {
    if (y < 130 || x > VILA.W + 20) return false;
    if (y > VILA.border - 20) return false;                          // rio Uruguai embaixo: fronteira com o Uruguai
    const pier = x >= 250 && y >= 890 && y <= 945;
    if (x < VILA.river - 20 && !pier) return false;
    return !hitRect(this.obstacles(), x, y);
  },
  // Pela direita, a encruzilhada da região central (mapa 2).
  edge(p) { if (p.x > VILA.W - 20) return { map: 'encruzilhada', x: 70, y: ENC.roadY + ENC.roadH / 2, title: 'Encruzilhada · região central', text: '↑ Pomerode · → Erechim e a Serra · ↓ Porto Alegre' }; return null; },
  spots() {
    const V = VILA, herd = G.herd || 0;
    return [
      { id: 'door', ...front(V.bodega), label: 'Entrar na bodega', act: goInside },
      { id: 'cancha', ...front(V.cancha), label: 'Entrar na cancha de bocha', act: () => { goInside(); enterCancha(true); } },
      { id: 'horta', ...front(V.horta), label: G.up.bergamota ? 'Horta e pomar de bergamota' : 'Horta e pomar', text: G.up.bergamota ? 'Pomar de bergamota: é dele que sai a bergamota vendida no balcão. Em breve dá para colher na mão.' : 'Horta e pomar da bodega: em breve dá para plantar, regar e colher milho, mandioca e bergamota.' },
      { id: 'fogo', ...front(V.fogo), label: isCampo() ? 'Voltar ao costelão' : 'Fogo de chão do costelão', act: () => { if (isCampo()) goInside(); else say('Fogo de chão: é aqui que sai o costelão de domingo. A carne vem do potreiro, laçada no sábado.'); } },
      { id: 'potreiro', ...front(V.potreiro), label: 'Potreiro · ' + herd + (herd === 1 ? ' boi' : ' bois'), act: () => { if (lassoNeeded()) { goInside(); lassoIntro(); return; } say('Potreiro: ' + herd + (herd === 1 ? ' boi pastando.' : ' bois pastando.') + ' Sábado à noite é dia de laçar para o costelão. Compre bois no celular → Fornecedor → Campo.'); } },
      { id: 'river', x: 470, y: 917, label: 'Trapiche do rio Uruguai', text: 'Rio Uruguai: em breve, pescaria de dourado e jundiá no trapiche.' },
      { id: 'coreto', ...front(V.coreto, 28), label: 'Coreto da praça', text: 'Praça da comunidade: em breve, feirinha de domingo, roda de chimarrão e encontros com os fregueses.' },
      { id: 'capela', ...front(V.capela), label: 'Capela da comunidade', text: 'Capela da comunidade: em breve, a missa de domingo e a festa do padroeiro.' },
      { id: 'salao', ...front(V.salao), label: 'Salão da comunidade', text: 'Salão da comunidade: em breve, baile, jantar de galeto com cuca e campeonato de truco da comunidade.' },
      { id: 'marco', x: V.marco.x + 20, y: V.marco.y - 20, label: 'Marco da fronteira', text: 'Marco da fronteira: do outro lado do rio é o Uruguai. Em breve, a balsa e os fregueses castelhanos.' },
      { id: 'leste', x: V.W - 120, y: V.roadY + V.roadH / 2, label: 'Estrada para a encruzilhada →', text: 'Siga pela direita: a estrada leva à encruzilhada da região central, de onde se vai a Pomerode, a Erechim e a Porto Alegre.' },
      ...V.houses.map(h => ({ id: 'house:' + h.id, ...front(h), label: 'Casa do ' + (PEOPLE.find(p => p.id === h.id)?.name || h.id), house: h.id }))
    ];
  },
  lights() { const V = VILA; return [[V.bodega.x + 100, V.bodega.y + 210], [V.bodega.x + 240, V.bodega.y + 210], [V.bodega.x + V.bodega.w - 220, V.bodega.y + 210], [V.bodega.x + V.bodega.w - 80, V.bodega.y + 210], [V.salao.x + 90, V.salao.y + 150], [V.salao.x + V.salao.w - 90, V.salao.y + 150], [V.capela.x + V.capela.w / 2, V.capela.y + 120], ...V.houses.map(h => [h.x + 50, h.y + 116])]; },
  draw(view, seen, layers) {
    const V = VILA;
    grassField(this, view, seen, '#6f9a45', ['#5f8a3a', '#86ad55'], V.river);
    for (const r of VILA_ROADS) road(...r);
    drawVilaRiver();
    drawWorldPraca();
    const add = (r, fn) => { if (seen(r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h))) layers.push({ y: r.y + r.h, draw: fn }); };
    add(V.bodega, drawWorldBodega); add(V.cancha, drawWorldCancha); add(V.horta, drawWorldHorta); add(V.fogo, drawWorldFogo); add(V.capela, drawWorldCapela); add(V.salao, drawWorldSalao); add(V.coreto, drawWorldCoreto); add(V.marco, drawWorldMarco);
    drawWorldPotreiro(layers, seen);
    for (const h of V.houses) { add(h, () => worldHouse(h, 'Casa do ' + (PEOPLE.find(p => p.id === h.id)?.name || h.id), h)); ownerAtDoor(layers, h, h.id, seen); }
    for (const [x, y, kind] of VILA_TREES) if (seen(x, y)) layers.push({ y, draw: () => drawWorldTree(x, y, kind) });
    if (seen(V.W - 120, V.roadY)) layers.push({ y: V.roadY - 10, draw: () => { rect(V.W - 130, V.roadY - 120, 8, 120, '#5a3a20'); poly([[V.W - 250, V.roadY - 120], [V.W - 70, V.roadY - 120], [V.W - 40, V.roadY - 98], [V.W - 70, V.roadY - 76], [V.W - 250, V.roadY - 76]], '#e8d6a8'); txt('ENCRUZILHADA →', V.W - 150, V.roadY - 98, 13, '#5a2a14', 'center', 'Georgia'); } });
  }
};

// Rio Uruguai: corta a lateral esquerda e a parte de baixo da vila (lá embaixo, a margem é do Uruguai).
function drawVilaRiver() {
  const V = VILA, g = ctx.createLinearGradient(0, 0, V.river, 0); g.addColorStop(0, '#2d5c74'); g.addColorStop(.85, '#3f7c94'); g.addColorStop(1, '#6a9aa4');
  ctx.fillStyle = g; ctx.fillRect(90, 0, V.river - 170, V.H);
  const b = ctx.createLinearGradient(0, V.border, 0, V.H); b.addColorStop(0, '#6a9aa4'); b.addColorStop(.15, '#3f7c94'); b.addColorStop(1, '#2d5c74');
  ctx.fillStyle = b; ctx.fillRect(90, V.border + 40, V.W, V.H - V.border - 130);
  rect(0, 0, 90, V.H, '#4f7a3a'); rect(V.river - 80, 0, 80, V.border + 40, '#d6bf8a'); rect(V.river - 80, V.border - 20, V.W, 60, '#d6bf8a');
  rect(0, V.H - 90, V.W, 90, '#5a8a3e');
  for (let i = 0; i < 46; i++) { const y = (i * 61 + frameClock * 22) % (V.border + 40), x = 130 + (i * 97) % 230; rect(x, y, 34, 3, 'rgba(220,240,245,.35)', 2); }
  for (let i = 0; i < 40; i++) { const x = (i * 97 + frameClock * 22) % V.W, y = V.border + 70 + (i * 37) % (V.H - V.border - 180); rect(x, y, 34, 3, 'rgba(220,240,245,.35)', 2); }
  for (const y of [420, 1500]) { ctx.save(); ctx.translate(290, y); ctx.rotate(-Math.PI / 2); txt('RIO URUGUAI', 0, 0, 30, 'rgba(235,245,250,.55)', 'center', 'Georgia'); ctx.restore(); }
  for (const x of [1000, 2600]) txt('RIO URUGUAI', x, V.border + 140, 30, 'rgba(235,245,250,.55)', 'center', 'Georgia');
  for (const y of [760, 1900]) { ctx.save(); ctx.translate(44, y); ctx.rotate(-Math.PI / 2); txt('margem argentina', 0, 0, 15, 'rgba(240,240,220,.6)'); ctx.restore(); }
  for (const x of [900, 2200, 3200]) txt('URUGUAI · margem uruguaia', x, V.H - 46, 16, 'rgba(240,240,220,.7)', 'center', 'Georgia');
  rect(250, 892, V.river - 250, 50, '#8a5f36', 2, '#5a3a1e'); for (let x = 260; x < V.river; x += 22) rect(x, 892, 2, 50, '#5a3a1e'); for (const x of [254, 340, 420]) rect(x, 940, 8, 26, '#4a3018');
  ctx.fillStyle = '#7a3a24'; ctx.beginPath(); ctx.ellipse(300, 985 + Math.sin(frameClock * 1.5) * 2, 60, 16, 0, 0, Math.PI * 2); ctx.fill(); rect(258, 978, 84, 6, '#a86a3a', 3);
}
// Marco de fronteira na beira do rio.
function drawWorldMarco() {
  const m = VILA.marco, cx = m.x + m.w / 2;
  poly([[m.x, m.y + m.h], [m.x + 8, m.y], [m.x + m.w - 8, m.y], [m.x + m.w, m.y + m.h]], '#ece6d6'); poly([[m.x + 8, m.y], [cx, m.y - 18], [m.x + m.w - 8, m.y]], '#d6cfbd');
  txt('BR', cx, m.y + 18, 11, '#3a3a3a', 'center', 'Arial'); txt('UY', cx, m.y + 40, 11, '#3a3a3a', 'center', 'Arial');
  signBoard(cx, m.y - 70, 230, 'FRONTEIRA BRASIL · URUGUAI', 12);
}
function drawWorldBodega() {
  const b = VILA.bodega, mid = b.x + b.w / 2;
  ctx.fillStyle = '#4a4a44'; ctx.beginPath(); ctx.moveTo(b.x - 30, b.y + 120); ctx.lineTo(mid, b.y - 40); ctx.lineTo(b.x + b.w + 30, b.y + 120); ctx.closePath(); ctx.fill();
  for (let k = 0; k < 12; k++) { ctx.strokeStyle = 'rgba(200,200,190,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mid, b.y - 40); ctx.lineTo(b.x - 30 + k * (b.w + 60) / 11, b.y + 120); ctx.stroke(); }
  rect(b.x, b.y + 110, b.w, b.h - 110, '#8a5a32', 0, '#4a2e18'); for (let x = b.x + 16; x < b.x + b.w; x += 26) rect(x, b.y + 112, 2, b.h - 114, '#6e4424');
  for (const x of [b.x + 60, b.x + 200, b.x + b.w - 260, b.x + b.w - 120]) windowPane(x, b.y + 180, 80, 60);
  rect(mid - 40, b.y + b.h - 110, 80, 110, '#4a2e18', 3, '#2a1a0e'); rect(mid - 3, b.y + b.h - 110, 6, 110, '#2a1a0e');
  signBoard(mid, b.y + 118, 320, (G.bodegaName || 'Bodega do Sadi').toUpperCase(), 18);
  rect(mid + 70, b.y + b.h - 40, 70, 8, '#5a3a20'); rect(mid + 74, b.y + b.h - 34, 6, 34, '#4a2e18'); rect(mid + 130, b.y + b.h - 34, 6, 34, '#4a2e18');
}
function drawWorldCancha() {
  const c = VILA.cancha;
  rect(c.x + 30, c.y + 90, c.w - 60, c.h - 100, '#c0603a', 3, '#7a3a1e'); rect(c.x + 30, c.y + 90, c.w - 60, 14, '#8a5a32');
  for (const [x, y, col] of [[c.x + 160, c.y + 220, '#3a6ad0'], [c.x + 260, c.y + 260, '#d03a3a'], [c.x + 220, c.y + 180, '#f0e8c0']]) ellipse(x, y, 8, 6, col);
  for (const x of [c.x + 20, c.x + c.w / 2 - 6, c.x + c.w - 32]) rect(x, c.y + 70, 12, c.h - 70, '#5a3a20');
  gable(c.x, c.y, c.w, 90, '#7a4a2a', 20); signBoard(c.x + c.w / 2, c.y + 36, 220, 'CANCHA DE BOCHA');
}
function drawWorldHorta() {
  const h = VILA.horta, cropW = h.w * .52;
  rect(h.x, h.y, h.w, h.h, '#7a5a34', 4, '#5a3a20');
  for (let r = 0; r < 4; r++) { const y = h.y + 40 + r * 48; rect(h.x + 14, y, cropW, 20, '#5e4428', 6); for (let x = h.x + 24; x < h.x + 14 + cropW; x += 24) { rect(x, y - 20, 4, 28, '#4f8a2a'); ellipse(x + 2, y - 22, 7, 4, '#6aa83a'); } }
  for (const dy of [60, 150]) { const x = h.x + h.w * .8, y = h.y + dy; rect(x - 4, y, 8, 26, '#5a3a20'); ellipse(x, y - 6, 32, 26, '#2f6a2a'); for (let k = 0; k < 6; k++) ellipse(x - 18 + (k * 15) % 36, y - 16 + (k * 11) % 22, 4, 4, '#f09a2a'); }
  const sx = h.x + h.w * .62, sy = h.y + 196; rect(sx - 2, sy - 30, 4, 60, '#5a3a20'); rect(sx - 24, sy - 14, 48, 4, '#5a3a20'); ellipse(sx, sy - 36, 11, 11, '#e8d6a8'); rect(sx - 15, sy - 50, 30, 7, '#3a2a1a'); rect(sx - 9, sy - 59, 18, 10, '#3a2a1a'); rect(sx - 13, sy - 20, 26, 26, '#a83a24', 3);
  signBoard(h.x + h.w / 2, h.y + h.h - 30, G.up.bergamota ? 200 : 120, G.up.bergamota ? 'HORTA E POMAR' : 'HORTA', 13);
}
function drawWorldFogo() {
  const f = VILA.fogo, c = campoState(), today = isCampo(), lit = today && fireLit(), cx = f.x + f.w / 2, cy = f.y + f.h / 2;
  ellipse(cx, cy + 20, f.w / 2 - 10, f.h / 2 - 30, '#8a6a42'); ellipse(cx, cy, 150, 50, lit ? '#3a1a0a' : '#4a3a2e');
  for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; ellipse(cx + Math.cos(a) * 156, cy + Math.sin(a) * 54, 14, 10, '#8a8a80'); }
  if (lit) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 6; k++) { const x = cx - 120 + k * 48, fl = 16 + Math.sin(frameClock * 9 + k) * 7; ellipse(x, cy - 8, 16, fl, 'rgba(255,140,40,.55)'); } ctx.restore(); }
  for (let i = 0; i < 4; i++) { const x = cx - 135 + i * 90, y = f.y + 40; rect(x - 3, y, 6, 120, '#4a3a2a'); rect(x - 24, y + 18, 48, 4, '#8a8a80'); if (today && c.espetos[i]) rect(x - 18, y + 28, 36, 56, '#a8442a', 6, '#5a2a14'); }
  for (let k = 0; k < 9; k++) ellipse(f.x + 30 + (k % 3) * 20, f.y + f.h - 46 - Math.floor(k / 3) * 15, 11, 8, '#8a5a32');
  signBoard(cx, f.y + f.h - 30, 160, 'COSTELÃO', 13);
}
let worldHerd = null;
function drawWorldPotreiro(layers, seen) {
  const p = VILA.potreiro, herd = Math.min(G.herd || 0, 8), gate = p.x + p.w / 2;
  if (!seen(p.x + p.w / 2, p.y + p.h / 2, p.w)) return;
  layers.push({ y: p.y - 40, draw: () => { rect(p.x, p.y, p.w, p.h, '#7aa64a'); rect(p.x + p.w - 160, p.y + p.h - 70, 120, 30, '#8a7a5a', 4, '#5a3a20'); rect(p.x + p.w - 156, p.y + p.h - 66, 112, 14, '#5aa0c0', 3); } });
  if (!worldHerd || worldHerd.length !== herd) worldHerd = Array.from({ length: herd }, (_, i) => ({ x: p.x + 120 + (i * 173) % (p.w - 240), y: p.y + 140 + (i * 97) % (p.h - 200), coat: i % BOI_COATS.length, dx: i % 2 ? 1 : -1, t: i }));
  for (const b of worldHerd) {
    b.t += 1 / 60; if (b.t > 6) { b.t = 0; b.dx = -b.dx; }
    b.x = clamp(b.x + b.dx * .25, p.x + 60, p.x + p.w - 60);
    layers.push({ y: b.y, draw: () => { ellipse(b.x, b.y + 2, 40, 9, '#1c140c44'); drawBoi(b.coat, Math.floor(frameClock * 3 + b.t) % 2 ? 2 : 0, b.x, b.y, 1.4, b.dx < 0); } });
  }
  layers.push({ y: p.y + 4, draw: () => { for (let x = p.x; x <= p.x + p.w; x += 44) rect(x, p.y - 30, 8, 40, '#6a4424'); rect(p.x, p.y - 22, p.w, 6, '#8a5a32'); } });
  layers.push({ y: p.y + p.h, draw: () => {
    for (let x = p.x; x <= p.x + p.w; x += 44) if (Math.abs(x - gate) > 50) rect(x, p.y + p.h - 30, 8, 40, '#6a4424');
    rect(p.x, p.y + p.h - 22, gate - 50 - p.x, 6, '#8a5a32'); rect(gate + 50, p.y + p.h - 22, p.x + p.w - gate - 50, 6, '#8a5a32'); rect(gate - 50, p.y + p.h - 16, 100, 6, '#a87a42');
    for (const x of [p.x, p.x + p.w]) rect(x - 4, p.y - 30, 8, p.h + 40, '#6a4424');
    signBoard(gate, p.y + p.h + 14, 150, 'POTREIRO', 13);
  } });
}
function drawWorldPraca() {
  const p = VILA.praca;
  rect(p.x, p.y, p.w, p.h, '#7fae52', 8, '#c9b58a'); rect(p.x + p.w / 2 - 22, p.y, 44, p.h, '#d9c49a'); rect(p.x, p.y + p.h / 2 - 22, p.w, 44, '#d9c49a');
  for (const [x, y] of [[p.x + 160, p.y + 120], [p.x + p.w - 160, p.y + 120], [p.x + 160, p.y + p.h - 120], [p.x + p.w - 160, p.y + p.h - 120]]) { ellipse(x, y, 60, 26, '#5e8a3a'); for (let k = 0; k < 8; k++) ellipse(x - 40 + k * 11, y - 4 + (k % 2) * 6, 4, 4, ['#e85a7a', '#f0d040', '#ffffff'][k % 3]); }
  for (const [x, y] of [[p.x + p.w / 2 - 110, p.y + 70], [p.x + p.w / 2 + 50, p.y + 70], [p.x + p.w / 2 - 110, p.y + p.h - 80], [p.x + p.w / 2 + 50, p.y + p.h - 80]]) { rect(x, y, 60, 10, '#8a5a32', 2); rect(x + 4, y + 10, 4, 12, '#4a2e18'); rect(x + 52, y + 10, 4, 12, '#4a2e18'); }
  flagRS(p.x + 250, p.y + p.h / 2 - 30);
  signBoard(p.x + p.w / 2, p.y - 46, 220, 'PRAÇA DA COMUNIDADE', 14);
}
function drawWorldCoreto() {
  const c = VILA.coreto, mid = c.x + c.w / 2;
  ellipse(mid, c.y + c.h - 20, c.w / 2 + 10, 34, '#b8a888');
  for (const x of [c.x + 14, c.x + 58, c.x + c.w - 72, c.x + c.w - 26]) rect(x, c.y + 50, 10, c.h - 70, '#f0ece0');
  rect(c.x + 10, c.y + c.h - 50, c.w - 20, 8, '#f0ece0');
  poly([[c.x - 16, c.y + 56], [mid, c.y - 10], [c.x + c.w + 16, c.y + 56]], '#3a6a5a'); rect(mid - 3, c.y - 30, 6, 22, '#c8a040');
}
// Capela do interior: paredes caiadas, frontão, torre com sino e cruz, porta em arco e telhado de barro.
function drawWorldCapela() {
  const c = VILA.capela, mid = c.x + c.w / 2;
  gable(c.x, c.y + 40, c.w, 90, '#a8442a', 16);
  rect(c.x, c.y + 120, c.w, c.h - 120, '#f2ede0', 0, '#8a8070');
  poly([[c.x + 10, c.y + 124], [mid, c.y + 50], [c.x + c.w - 10, c.y + 124]], '#f2ede0');
  rect(mid - 36, c.y - 50, 72, 110, '#f2ede0', 0, '#8a8070'); gable(mid - 36, c.y - 96, 72, 46, '#a8442a', 8);
  ellipse(mid, c.y - 10, 16, 18, '#3a2a1a'); ellipse(mid, c.y - 4, 9, 11, '#c8a040');
  rect(mid - 3, c.y - 140, 6, 44, '#5a4a3a'); rect(mid - 16, c.y - 126, 32, 6, '#5a4a3a');
  ellipse(mid, c.y + 92, 16, 16, '#6a8ab0'); ellipse(mid, c.y + 92, 10, 10, '#c8d8f0');
  ctx.fillStyle = '#6a4424'; ctx.beginPath(); ctx.moveTo(mid - 34, c.y + c.h); ctx.lineTo(mid - 34, c.y + c.h - 70); ctx.arc(mid, c.y + c.h - 70, 34, Math.PI, 0); ctx.lineTo(mid + 34, c.y + c.h); ctx.closePath(); ctx.fill();
  for (const x of [c.x + 30, c.x + c.w - 60]) { ctx.fillStyle = '#6a8ab0'; ctx.beginPath(); ctx.moveTo(x, c.y + 230); ctx.lineTo(x, c.y + 175); ctx.arc(x + 15, c.y + 175, 15, Math.PI, 0); ctx.lineTo(x + 30, c.y + 230); ctx.closePath(); ctx.fill(); }
  rect(mid - 50, c.y + c.h, 100, 14, '#c8c0b0');
}
// Salão da comunidade: tijolo à vista, telhado de zinco e a faixa da festa do padroeiro.
function drawWorldSalao() {
  const s = VILA.salao;
  gable(s.x, s.y, s.w, 80, '#7a7a72', 18);
  rect(s.x, s.y + 70, s.w, s.h - 70, '#b5623a', 0, '#6a3a20'); for (let y = s.y + 82; y < s.y + s.h; y += 14) rect(s.x + 2, y, s.w - 4, 1, 'rgba(90,40,20,.35)');
  for (const x of [s.x + 50, s.x + 150, s.x + s.w - 230, s.x + s.w - 130]) windowPane(x, s.y + 120, 80, 56);
  rect(s.x + s.w / 2 - 50, s.y + s.h - 90, 100, 90, '#4a2e18', 3, '#2a1a0e'); rect(s.x + s.w / 2 - 2, s.y + s.h - 90, 4, 90, '#2a1a0e');
  signBoard(s.x + s.w / 2, s.y + 78, 280, 'SALÃO DA COMUNIDADE', 14);
  rect(s.x + 40, s.y - 26, s.w - 80, 26, '#f0e0a0', 2, '#a87a2a'); txt('FESTA DO PADROEIRO · GALETO, CUCA E BAILE', s.x + s.w / 2, s.y - 13, 13, '#7a2a14', 'center', 'Georgia');
  pennants(s.x + 40, s.x + s.w - 40, s.y - 46, ['#d42a2a', '#2a7a3a', '#f0d020']);
}
