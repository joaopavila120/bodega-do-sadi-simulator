// Regiões em volta da vila.
// Mapa 2 · Encruzilhada: a região central do Rio Grande (Santa Maria, coração do Rio Grande): coxilhas, figueira,
// eucaliptos, arroio com ponte, estação e trilho do trem. Só estrada de terra, com as placas no meio:
//   para cima começam as casas alemãs e, ao fundo, o caminho para Pomerode (E abre o mapa de Pomerode);
//   para a direita, vinhais e o trilho do trem até o caminho para Erechim e a Serra (E abre o mapa);
//   para baixo, rumo a Porto Alegre (E abre o mapa).
'use strict';

// ---------- Peças comuns das regiões ----------
function drawRail(x0, x1, y) { for (let x = x0; x < x1; x += 22) rect(x, y - 6, 12, 26, '#6a4a2a', 1); rect(x0, y, x1 - x0, 4, '#8a8a90'); rect(x0, y + 12, x1 - x0, 4, '#8a8a90'); }
// Maria Fumaça: passa de tempos em tempos pelo trilho, soltando fumaça.
function trainX(x0, x1, speed, phase) { const span = x1 - x0 + 1400; return x0 - 700 + ((frameClock * speed + phase) % span); }
function drawTrain(x, y) {
  for (let k = 0; k < 2; k++) { const cx = x - 210 - k * 190; rect(cx, y - 70, 170, 62, k ? '#7a2a1a' : '#8a3a24', 4, '#3a1a10'); for (let w = 0; w < 4; w++) windowPane(cx + 14 + w * 38, y - 60, 26, 22, '#3a1a10'); for (const wx of [cx + 30, cx + 140]) ellipse(wx, y - 4, 13, 13, '#2a2a2a'); }
  rect(x - 150, y - 76, 120, 70, '#1e1e22', 6); rect(x - 40, y - 100, 50, 94, '#2a2a30', 4); rect(x - 46, y - 108, 62, 10, '#7a2a1a'); rect(x - 140, y - 110, 18, 36, '#1e1e22'); rect(x - 146, y - 116, 30, 8, '#3a3a40');
  rect(x - 154, y - 30, 160, 8, '#c8a040'); for (const wx of [x - 128, x - 92, x - 56]) { ellipse(wx, y - 4, 16, 16, '#a82a1a'); ellipse(wx, y - 4, 6, 6, '#2a2a2a'); }
  for (let k = 0; k < 5; k++) { const a = (frameClock * 1.2 + k * .2) % 1; ellipse(x - 131 + a * 70, y - 120 - a * 90, 10 + a * 26, 8 + a * 18, `rgba(235,235,230,${.6 * (1 - a)})`); }
}
function drawVineyard(p, rows) {
  rect(p.x, p.y, p.w, p.h, '#8a6a3a', 4); const gap = p.h / rows;
  for (let r = 0; r < rows; r++) { const y = p.y + gap * r + gap * .62; for (let x = p.x + 16; x < p.x + p.w - 10; x += 46) rect(x, y - 30, 5, 34, '#5a3a20'); rect(p.x + 10, y - 30, p.w - 20, 3, '#6a5a4a');
    for (let x = p.x + 18; x < p.x + p.w - 14; x += 22) { ellipse(x, y - 34, 13, 9, '#3f7a2a'); if ((x + r) % 3 === 0) { ellipse(x - 2, y - 24, 4, 5, '#5a2a6a'); ellipse(x + 3, y - 22, 4, 5, '#6a3a7a'); } } }
}
// Capitel: capelinha de beira de estrada, erguida por promessa.
function drawCapitel(c) {
  const mid = c.x + c.w / 2; rect(c.x + 8, c.y + 30, c.w - 16, c.h - 30, '#f2ede0', 2, '#8a8070'); gable(c.x + 4, c.y + 6, c.w - 8, 30, '#a8442a', 6);
  rect(mid - 3, c.y - 16, 6, 22, '#5a4a3a'); rect(mid - 9, c.y - 10, 18, 4, '#5a4a3a');
  ctx.fillStyle = '#4a6a9a'; ctx.beginPath(); ctx.moveTo(mid - 14, c.y + c.h - 10); ctx.lineTo(mid - 14, c.y + 52); ctx.arc(mid, c.y + 52, 14, Math.PI, 0); ctx.lineTo(mid + 14, c.y + c.h - 10); ctx.closePath(); ctx.fill();
  ellipse(mid, c.y + 60, 5, 8, '#f0e0b0'); for (const dx of [-26, 22]) { ellipse(mid + dx, c.y + c.h - 4, 6, 6, '#e85a7a'); ellipse(mid + dx + 6, c.y + c.h - 2, 5, 5, '#f0d040'); }
}
function drawStoneHouse(h, name) {
  gable(h.x, h.y - 10, h.w, 80, '#8a4a32', 18);
  rect(h.x, h.y + 66, h.w, h.h - 66, '#9a948a', 0, '#5a5248');
  for (let y = h.y + 70; y < h.y + h.h - 4; y += 16) for (let x = h.x + ((y / 16) % 2 ? 0 : 14); x < h.x + h.w - 8; x += 28) rect(x + 2, y + 2, 24, 12, ['#a8a298', '#8e887e', '#b4aea4'][(x + y) % 3], 3);
  rect(h.x + h.w / 2 - 24, h.y + h.h - 76, 48, 76, '#5a3a20', 2, '#2a1a0e'); for (const x of [h.x + 28, h.x + h.w - 78]) { windowPane(x, h.y + 100, 50, 44, '#5a3a20'); rect(x - 8, h.y + 100, 8, 44, '#3a6a3a'); rect(x + 50, h.y + 100, 8, 44, '#3a6a3a'); }
  if (name) signBoard(h.x + h.w / 2, h.y + h.h + 6, h.w - 30, name, 13);
}
function wineBarrels(x, y) { for (let k = 0; k < 3; k++) { ellipse(x + k * 44, y, 24, 30, '#7a4a2a'); for (const dy of [-12, 12]) rect(x + k * 44 - 24, y + dy, 48, 4, '#4a4a44'); } }
// Enxaimel: paredes claras com a estrutura de madeira escura aparente e floreiras nas janelas.
function drawEnxaimel(h, name) {
  gable(h.x, h.y - 30, h.w, 100, '#8a3a24', 16);
  rect(h.x, h.y + 64, h.w, h.h - 64, '#f4f0e6', 0, '#3a2414');
  const beam = '#3a2414', midY = h.y + 64 + (h.h - 64) / 2; rect(h.x, h.y + 64, h.w, 6, beam); rect(h.x, h.y + h.h - 6, h.w, 6, beam); rect(h.x, midY - 3, h.w, 6, beam);
  for (let x = h.x; x <= h.x + h.w - 6; x += h.w / 5) rect(x, h.y + 64, 6, h.h - 64, beam);
  ctx.strokeStyle = beam; ctx.lineWidth = 5; for (let k = 0; k < 5; k += 2) { const x = h.x + k * h.w / 5; ctx.beginPath(); ctx.moveTo(x + 4, midY); ctx.lineTo(x + h.w / 5, h.y + 66); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 4, h.y + h.h - 4); ctx.lineTo(x + h.w / 5, midY); ctx.stroke(); }
  rect(h.x + h.w / 2 - 20, h.y + h.h - 64, 40, 64, '#6a3a20', 2, beam);
  for (const x of [h.x + 22, h.x + h.w - 66]) { windowPane(x, h.y + 84, 44, 34, beam); rect(x - 2, h.y + 118, 48, 8, '#7a4a2a'); for (let k = 0; k < 5; k++) ellipse(x + 4 + k * 10, h.y + 116, 5, 5, ['#e8304a', '#f8f0f0', '#e8304a', '#f0c040', '#e8304a'][k]); }
  if (name) signBoard(h.x + h.w / 2, h.y + h.h + 6, h.w - 30, name, 13);
}
function drawLuterana(l) {
  const mid = l.x + l.w / 2;
  gable(l.x, l.y + 50, l.w, 80, '#4a4a4a', 12); rect(l.x, l.y + 120, l.w, l.h - 120, '#f4f2ec', 0, '#8a8a80');
  rect(mid - 28, l.y - 40, 56, 160, '#f4f2ec', 0, '#8a8a80'); poly([[mid - 32, l.y - 40], [mid, l.y - 170], [mid + 32, l.y - 40]], '#3a4a5a');
  rect(mid - 2, l.y - 200, 4, 34, '#c8a040'); ellipse(mid, l.y - 10, 12, 14, '#3a2a1a');
  rect(mid - 24, l.y + l.h - 70, 48, 70, '#5a3a20', 2); for (const x of [l.x + 24, l.x + l.w - 54]) poly([[x, l.y + 250], [x, l.y + 190], [x + 15, l.y + 172], [x + 30, l.y + 190], [x + 30, l.y + 250]], '#7a9ac8');
}
function drawBolao(b) {
  rect(b.x, b.y + 40, b.w, b.h - 40, '#c8a870', 2, '#5a3a20'); rect(b.x + 20, b.y + 70, b.w - 60, 30, '#e8d8b0', 2, '#a88a50');
  for (let k = 0; k < 9; k++) ellipse(b.x + b.w - 30 + (k % 3) * 8 - 8, b.y + 76 + Math.floor(k / 3) * 9, 3, 5, '#f8f4ec'); ellipse(b.x + 60, b.y + 85, 9, 9, '#3a2a1a');
  rect(b.x - 10, b.y, b.w + 20, 44, '#6a3a24', 3); for (const x of [b.x, b.x + b.w / 2, b.x + b.w - 8]) rect(x, b.y + 40, 8, b.h - 40, '#4a2e18');
  signBoard(b.x + b.w / 2, b.y + 8, 220, 'CANCHA DE BOLÃO', 13);
}
function drawPavilion(k, text, colors) {
  for (let x = k.x; x < k.x + k.w; x += 38) poly([[x, k.y + 60], [x + 19, k.y], [x + 38, k.y + 60]], (x / 38) % 2 ? '#f4f0e6' : '#c83a2a');
  for (const x of [k.x + 6, k.x + k.w - 12]) rect(x, k.y + 56, 8, k.h - 56, '#5a3a20');
  rect(k.x + 30, k.y + k.h - 60, k.w - 60, 12, '#8a5a32'); rect(k.x + 30, k.y + k.h - 30, k.w - 60, 10, '#7a4a2a');
  ellipse(k.x + k.w - 40, k.y + k.h - 40, 20, 26, '#8a5a32'); rect(k.x + k.w - 60, k.y + k.h - 52, 40, 4, '#4a4a44');
  rect(k.x + 30, k.y + 66, k.w - 60, 26, '#f4ecd8', 3, '#5a3a20'); txt(text, k.x + k.w / 2, k.y + 79, 12, '#7a1a1a', 'center', 'Georgia');
  pennants(k.x, k.x + k.w, k.y + 58, colors);
}
function drawPortal(cx, y, text, colors, wall, enx = false) {
  rect(cx - 150, y - 150, 28, 150, wall, 2, '#5a4a3a'); rect(cx + 122, y - 150, 28, 150, wall, 2, '#5a4a3a');
  rect(cx - 170, y - 190, 340, 46, wall, 4, '#5a4a3a'); if (enx) for (let k = 0; k < 6; k++) { rect(cx - 160 + k * 58, y - 188, 6, 42, '#4a2e18'); ctx.strokeStyle = '#4a2e18'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - 154 + k * 58, y - 186); ctx.lineTo(cx - 106 + k * 58, y - 148); ctx.stroke(); }
  rect(cx - 130, y - 182, 260, 30, '#f4ecd8', 3); txt(text, cx, y - 167, 15, '#5a2a14', 'center', 'Georgia');
  gable(cx - 170, y - 236, 340, 46, enx ? '#8a3a24' : '#a8442a', 10); pennants(cx - 150, cx + 150, y - 140, colors);
}
function signArm(x, y, text, dir, w = 190) { const x0 = dir > 0 ? x : x - w; poly(dir > 0 ? [[x0, y], [x0 + w - 20, y], [x0 + w, y + 13], [x0 + w - 20, y + 26], [x0, y + 26]] : [[x0 + 20, y], [x0 + w, y], [x0 + w, y + 26], [x0 + 20, y + 26], [x0, y + 13]], '#e8d6a8'); txt(text, x0 + w / 2, y + 13, 12, '#5a2a14', 'center', 'Georgia'); }
function drawFigueira(x, y) { ellipse(x, y + 6, 150, 34, '#1c140c44'); rect(x - 22, y - 120, 44, 126, '#5a4030'); for (const [dx, dy, r] of [[0, -170, 150], [-110, -140, 90], [110, -140, 90], [-50, -230, 90], [60, -230, 90]]) ellipse(x + dx, y + dy, r, r * .62, '#2f5a2a'); for (const [dx, dy, r] of [[-30, -200, 70], [70, -170, 60]]) ellipse(x + dx, y + dy, r, r * .6, '#3f7a36'); }
function drawEucalipto(x, y) { ellipse(x, y + 3, 22, 6, '#1c140c44'); rect(x - 4, y - 190, 8, 194, '#d8d0c0'); ellipse(x, y - 200, 26, 70, '#4a7a5a'); ellipse(x + 6, y - 230, 18, 40, '#5a8a6a'); }
function drawArroio(M, y, bridgeX) {
  const g = ctx.createLinearGradient(0, y, 0, y + 60); g.addColorStop(0, '#5a8aa0'); g.addColorStop(1, '#3a6a84'); ctx.fillStyle = g; ctx.fillRect(0, y, M.W, 60);
  for (let i = 0; i < 24; i++) { const x = (i * 131 + frameClock * 30) % M.W; rect(x, y + 14 + (i * 13) % 34, 28, 3, 'rgba(220,240,245,.4)', 2); }
  rect(bridgeX - 70, y - 8, 140, 76, '#8a5f36', 2, '#5a3a1e'); for (let x = bridgeX - 64; x < bridgeX + 70; x += 18) rect(x, y - 8, 2, 76, '#5a3a1e'); rect(bridgeX - 74, y - 14, 6, 88, '#4a3018'); rect(bridgeX + 68, y - 14, 6, 88, '#4a3018');
}
function drawFanHouse(f) {
  worldHouse(f, f.label || null, { wall: '#e0d6c4', roof: '#7a4a3a' });
  const x = f.x + f.w - 66, y = f.y + 98;
  if (f.team === 'gremio') { rect(x, y, 46, 36, '#2a6ac8'); rect(x, y + 12, 46, 6, '#1a1a1a'); rect(x, y + 20, 46, 6, '#f4f4f4'); } else { rect(x, y, 46, 36, '#d42a2a'); rect(x + 18, y + 10, 10, 10, '#f4f4f4'); }
}
// Mapa de região: cada um com tamanho, obstáculos, lugares para o E, desenho e as saídas.
function regionMap(def) { return { W: def.W, H: def.H, ...def, canWalk(x, y) { if (x < -30 || y < -30 || x > def.W + 30 || y > def.H + 30) return false; if (def.blocked?.(x, y)) return false; return !hitRect(def.obstacles, x, y); } }; }
function goRegion(map, x, y, title, text) { switchMap({ map, x, y, title, text }); }

// =================== MAPA 2 · ENCRUZILHADA (região central) ===================
const ENC = { W: 2400, H: 2000, roadY: 940, roadH: 90, roadX: 1160, roadW: 80, arroio: 1520, rail: 1062,
  houses: [{ id: 'jayme', x: 260, y: 300, w: 260, h: 190, wall: '#e8dcc0', roof: '#a8844a', label: 'Casa do Jayme Caetano Braun' }, { id: 'baitaca', x: 520, y: 1160, w: 260, h: 190, wall: '#efe6d2', roof: '#b89a58', label: 'Rancho do Baitaca' },
    { id: 'gaudencio', x: 300, y: 1660, w: 260, h: 190, wall: '#efe6d2', roof: '#b89a58', label: 'Rancho do Gaudêncio' }],
  dianho: { x: 1340, y: 360, w: 260, h: 190 }, enx2: { x: 820, y: 170, w: 230, h: 170 }, estacao: { x: 1330, y: 1110, w: 250, h: 150 },
  vines: [{ x: 1700, y: 700, w: 560, h: 200 }, { x: 1700, y: 1160, w: 560, h: 280 }],
  fans: [{ x: 1340, y: 1650, w: 240, h: 180, team: 'gremio' }, { x: 820, y: 1650, w: 240, h: 180, team: 'inter' }]
};
ENC.obstacles = [...ENC.houses, ENC.dianho, ENC.enx2, ENC.estacao, ...ENC.vines, ...ENC.fans, { x: 560, y: 610, w: 80, h: 50 }];
WORLD_MAPS.encruzilhada = regionMap({
  id: 'encruzilhada', name: 'Encruzilhada · região central', W: ENC.W, H: ENC.H, obstacles: ENC.obstacles,
  blocked(x, y) { return y > ENC.arroio - 10 && y < ENC.arroio + 64 && Math.abs(x - (ENC.roadX + ENC.roadW / 2)) > 60; },
  edge(p) { if (p.x < 10) return { map: 'vila', x: VILA.W - 70, y: VILA.roadY + VILA.roadH / 2, title: 'Vila da bodega', text: 'De volta à vila: a bodega fica na estrada de cima.' }; return null; },
  spots() { const E = ENC, cx = E.roadX + E.roadW / 2, cy = E.roadY + E.roadH / 2; return [
    ...E.houses.map(h => ({ id: 'house:' + h.id, ...front(h), label: h.label, house: h.id })),
    { id: 'house:dianho', ...front(E.dianho), label: 'Casa do Dianho', house: 'dianho' },
    { id: 'placa', x: cx + 110, y: E.roadY - 14, label: 'Placas da encruzilhada', text: 'Santa Maria, coração do Rio Grande. ↑ Pomerode · → Erechim e a Serra · ↓ Porto Alegre · ← a vila da bodega.' },
    { id: 'estacao', ...front(E.estacao), label: 'Estação do trem', text: 'Estação do trem: Santa Maria cresceu com a ferrovia, entroncamento dos trilhos do Rio Grande.' },
    { id: 'figueira', x: 600, y: 690, label: 'Figueira', text: 'Figueira velha da coxilha: sombra para a tropa descansar e para um chimarrão.' },
    { id: 'pomerode', x: cx, y: 150, label: 'Caminho para Pomerode', act: () => goRegion('pomerode', POM.W / 2, POM.H - 140, 'Pomerode', 'A cidade das casas em enxaimel, no Vale Europeu de Santa Catarina.') },
    { id: 'erechim', x: E.W - 90, y: cy, label: 'Caminho para Erechim e a Serra', act: () => goRegion('erechim', 140, ERE.roadY + ERE.roadH / 2, 'Erechim e Serra Gaúcha', 'Colônia italiana: vinhos, galeto, polenta e a Maria Fumaça.') },
    { id: 'poa', x: cx, y: E.H - 70, label: 'Caminho para Porto Alegre', act: () => goRegion('poa', POA.roadX + POA.roadW / 2, 140, 'Porto Alegre', 'A capital: Grêmio, Inter, o Laçador e o pôr do sol no Guaíba.') }
  ]; },
  lights() { return [...ENC.houses.map(h => [h.x + 50, h.y + 116]), [ENC.dianho.x + 50, ENC.dianho.y + 110], [ENC.estacao.x + 120, ENC.estacao.y + 90]]; },
  draw(view, seen, layers) {
    const E = ENC, cx = E.roadX + E.roadW / 2;
    grassField(this, view, seen, '#78a04a', ['#68903e', '#8cb45a']);
    for (const [x, y, rx] of [[500, 500, 520], [1900, 380, 460], [600, 1350, 420], [1900, 1800, 480]]) if (seen(x, y, rx)) ellipse(x, y, rx, rx * .3, 'rgba(140,170,80,.35)');   // coxilhas
    // ao fundo, a estrada para Pomerode some na mata
    rect(0, 0, E.W, 110, '#2f5a2a'); for (let x = 0; x < E.W; x += 70) ellipse(x + 35, 110, 50, 30, '#3a6a32');
    road(0, E.roadY, E.W, E.roadH); road(E.roadX, 0, E.roadW, E.H);
    poly([[cx - 40, 110], [cx + 40, 110], [cx + 16, 0], [cx - 16, 0]], '#b08a58');
    rect(E.roadX, E.H - 150, E.roadW, 150, '#5a5a58'); for (let y = E.H - 140; y < E.H; y += 40) rect(cx - 3, y, 6, 20, '#e8c840');
    drawArroio(this, E.arroio, cx);
    drawRail(0, E.W, E.rail);
    const add = (r, fn) => { if (seen(r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h))) layers.push({ y: r.y + r.h, draw: fn }); };
    for (const h of E.houses) { add(h, () => worldHouse(h, h.label, h)); ownerAtDoor(layers, h, h.id, seen); }
    add(E.dianho, () => drawEnxaimel(E.dianho, 'Casa do Dianho')); ownerAtDoor(layers, E.dianho, 'dianho', seen); add(E.enx2, () => drawEnxaimel(E.enx2));
    add(E.estacao, () => { const s = E.estacao; gable(s.x, s.y + 10, s.w, 50, '#7a3a24', 16); rect(s.x, s.y + 56, s.w, s.h - 56, '#e8d8b8', 0, '#6a5a3a'); for (const x of [s.x + 20, s.x + s.w - 70]) windowPane(x, s.y + 74, 50, 40); rect(s.x + s.w / 2 - 20, s.y + s.h - 60, 40, 60, '#6a4424'); signBoard(s.x + s.w / 2, s.y + 20, 180, 'ESTAÇÃO', 13); });
    for (const v of E.vines) add(v, () => drawVineyard(v, Math.round(v.h / 60)));
    for (const f of E.fans) add(f, () => drawFanHouse(f));
    layers.push({ y: E.rail + 20, draw: () => drawTrain(trainX(0, E.W, 110, 0), E.rail + 10) });
    if (seen(600, 660)) { layers.push({ y: 660, draw: () => drawFigueira(600, 660) }); for (let k = 0; k < 4; k++) { const bx = 260 + k * 150, by = 760 + (k % 2) * 60; layers.push({ y: by, draw: () => { ellipse(bx, by + 2, 40, 9, '#1c140c44'); drawBoi(k % BOI_COATS.length, Math.floor(frameClock * 2 + k) % 2 ? 2 : 0, bx, by, 1.3, k % 2 === 0); } }); } }
    for (let k = 0; k < 6; k++) { const x = 90 + k * 60, y = 1440; if (seen(x, y)) layers.push({ y, draw: () => drawEucalipto(x, y) }); }
    // placas no meio da encruzilhada
    layers.push({ y: E.roadY - 10, draw: () => { const x = cx + 110, y = E.roadY - 14; rect(x - 4, y - 160, 8, 160, '#5a3a20'); signArm(x, y - 160, '↑ Pomerode', 1); signArm(x, y - 128, 'Erechim · Serra', 1); signArm(x, y - 96, 'Porto Alegre ↓', 1); signArm(x, y - 128, 'Vila da bodega', -1); } });
    layers.push({ y: E.roadY - 40, draw: () => signBoard(780, E.roadY - 100, 330, 'SANTA MARIA · CORAÇÃO DO RIO GRANDE', 12) });
    layers.push({ y: 260, draw: () => signBoard(cx + 150, 200, 150, 'WILLKOMMEN', 13) });
  }
});

// =================== POMERODE ===================
const POM = { W: 3000, H: 2000, roadX: 1460, roadW: 80, streetY: 960, streetH: 80,
  houses: [{ x: 300, y: 650, w: 260, h: 200 }, { x: 700, y: 650, w: 240, h: 200 }, { x: 1700, y: 650, w: 260, h: 200 }, { x: 2060, y: 650, w: 240, h: 200 }, { x: 300, y: 1150, w: 260, h: 200 }, { x: 1700, y: 1180, w: 260, h: 200 }],
  loli: { x: 2100, y: 1160, w: 280, h: 210 }, cafe: { x: 2420, y: 640, w: 320, h: 220 }, luterana: { x: 1100, y: 320, w: 260, h: 300 }, bolao: { x: 2450, y: 1200, w: 420, h: 150 },
  festa: { x: 660, y: 1200, w: 380, h: 170 }, ostern: { x: 1100, y: 1160, w: 260, h: 260 }
};
POM.obstacles = [...POM.houses, POM.loli, POM.cafe, POM.luterana, POM.bolao, POM.festa, { x: POM.ostern.x + 100, y: POM.ostern.y + 100, w: 60, h: 60 }];
WORLD_MAPS.pomerode = regionMap({
  id: 'pomerode', name: 'Pomerode (SC)', W: POM.W, H: POM.H, obstacles: POM.obstacles,
  edge(p) { if (p.y > POM.H - 10) return { map: 'encruzilhada', x: ENC.roadX + ENC.roadW / 2, y: 200, title: 'Encruzilhada', text: 'De volta à região central.' }; return null; },
  spots() { const P = POM; return [
    { id: 'volta', x: P.roadX + P.roadW / 2, y: P.H - 80, label: 'Voltar à encruzilhada', act: () => goRegion('encruzilhada', ENC.roadX + ENC.roadW / 2, 200, 'Encruzilhada', 'De volta à região central.') },
    { id: 'house:loligebien', ...front(P.loli), label: 'Casa do Loli Gebien', house: 'loligebien' },
    { id: 'cafe', ...front(P.cafe), label: 'Café colonial', text: 'Café colonial: cuca, chimia, schmier, linguiça e pão caseiro. Em breve, encomendas para a bodega.' },
    { id: 'luterana', ...front(P.luterana), label: 'Igreja luterana', text: 'Igreja luterana: o culto de domingo e o coral da comunidade.' },
    { id: 'bolao', ...front(P.bolao), label: 'Cancha de bolão', text: 'Cancha de bolão: o boliche dos colonos alemães. Em breve, partidas valendo chope.' },
    { id: 'festa', ...front(P.festa), label: 'Festa Pomerana', text: 'Festa Pomerana: chope, bandinha, marreco recheado e baile, como na Kerb dos colonos.' },
    { id: 'ostern', ...front(P.ostern, 0), label: 'Osterbaum', text: 'Osterbaum: a árvore de Páscoa enfeitada com casquinhas de ovo pintadas, orgulho de Pomerode.' },
    ...P.houses.map((h, i) => ({ id: 'enx' + i, ...front(h), label: 'Casa em enxaimel', text: 'Casa em enxaimel: a estrutura de madeira aparente que os imigrantes da Pomerânia trouxeram.' }))
  ]; },
  lights() { return [...POM.houses.map(h => [h.x + 44, h.y + 100]), [POM.cafe.x + 60, POM.cafe.y + 100], [POM.festa.x + POM.festa.w / 2, POM.festa.y + 90]]; },
  draw(view, seen, layers) {
    const P = POM;
    grassField(this, view, seen, '#5f8a3e', ['#4f7a32', '#76a050']);
    rect(0, 0, P.W, 200, '#2f5a2a'); for (let x = 0; x < P.W; x += 80) { ellipse(x + 40, 200, 56, 34, '#3a6a32'); ellipse(x + 10, 150, 40, 70, '#2a5028'); }
    road(P.roadX, P.streetY, P.roadW, P.H - P.streetY, '#a8a49a', '#8a8680'); road(200, P.streetY, P.W - 400, P.streetH, '#a8a49a', '#8a8680');
    for (let x = 210; x < P.W - 200; x += 30) rect(x, P.streetY + P.streetH / 2 - 2, 16, 4, '#d8d4c8');
    const add = (r, fn) => { if (seen(r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h))) layers.push({ y: r.y + r.h, draw: fn }); };
    for (const h of P.houses) add(h, () => drawEnxaimel(h));
    add(P.loli, () => drawEnxaimel(P.loli, 'Casa do Loli Gebien')); ownerAtDoor(layers, P.loli, 'loligebien', seen);
    add(P.cafe, () => { drawEnxaimel(P.cafe); rect(P.cafe.x + 30, P.cafe.y + 20, P.cafe.w - 60, 28, '#f4ecd8', 3, '#3a2414'); txt('CAFÉ COLONIAL · CUCA E CHIMIA', P.cafe.x + P.cafe.w / 2, P.cafe.y + 34, 12, '#5a2a14', 'center', 'Georgia'); });
    add(P.luterana, () => drawLuterana(P.luterana)); add(P.bolao, () => drawBolao(P.bolao));
    add(P.festa, () => drawPavilion(P.festa, 'FESTA POMERANA · CHOPE E BANDINHA', ['#e8304a', '#f0c040', '#2a7a3a', '#3a6ac8']));
    add({ ...P.ostern, h: P.ostern.h - 100 }, () => { const o = P.ostern, x = o.x + o.w / 2, y = o.y + 160; rect(o.x, o.y + 40, o.w, o.h - 60, '#7fae52', 8, '#c9b58a'); rect(x - 8, y - 140, 16, 150, '#5a3a20'); ellipse(x, y - 170, 90, 70, '#3f7a36'); for (let k = 0; k < 26; k++) ellipse(x - 70 + (k * 37) % 140, y - 220 + (k * 23) % 100, 6, 8, ['#e8304a', '#f0c040', '#3a6ac8', '#e87ad0', '#5ac87a'][k % 5]); });
    for (let k = 0; k < 10; k++) { const x = 260 + k * 250, y = 900; if (seen(x, y)) layers.push({ y, draw: () => { for (let j = 0; j < 4; j++) ellipse(x + j * 14, y, 9, 8, ['#7a9ad8', '#c87ad0', '#f0f0f8', '#7a9ad8'][j]); } }); }   // hortênsias
    layers.push({ y: P.H - 120, draw: () => drawPortal(P.roadX + P.roadW / 2, P.H - 120, 'POMERODE · ROTA DO ENXAIMEL', ['#1a1a1a', '#d42a2a', '#f0c020'], '#f4f0e6', true) });
  }
});

// =================== ERECHIM E SERRA GAÚCHA ===================
const ERE = { W: 3600, H: 2000, roadY: 940, roadH: 90, rail: 1070,
  estacao: { x: 380, y: 1130, w: 320, h: 160 }, badin: { x: 900, y: 600, w: 290, h: 210 }, gemeos: { x: 1420, y: 600, w: 300, h: 200 }, campinho: { x: 1400, y: 1180, w: 620, h: 340 },
  galeteria: { x: 2000, y: 600, w: 340, h: 210 }, vinicola: { x: 820, y: 1170, w: 380, h: 220 }, matriz: { x: 2560, y: 520, w: 300, h: 360 }, castelinho: { x: 3080, y: 560, w: 320, h: 320 },
  praca: { x: 3020, y: 1180, w: 440, h: 300 }, capiteis: [{ x: 2250, y: 1180, w: 70, h: 90 }, { x: 600, y: 600, w: 70, h: 90 }],
  vines: [{ x: 120, y: 560, w: 400, h: 300 }, { x: 2420, y: 1180, w: 480, h: 340 }, { x: 120, y: 1480, w: 520, h: 300 }]
};
ERE.obstacles = [ERE.estacao, ERE.badin, ERE.gemeos, ERE.galeteria, ERE.vinicola, ERE.matriz, ERE.castelinho, ...ERE.capiteis, ...ERE.vines, { x: ERE.praca.x + 190, y: ERE.praca.y + 110, w: 60, h: 60 }];
WORLD_MAPS.erechim = regionMap({
  id: 'erechim', name: 'Erechim e Serra Gaúcha', W: ERE.W, H: ERE.H, obstacles: ERE.obstacles,
  edge(p) { if (p.x < 10) return { map: 'encruzilhada', x: ENC.W - 140, y: ENC.roadY + ENC.roadH / 2, title: 'Encruzilhada', text: 'De volta à região central.' }; return null; },
  spots() { const E = ERE; return [
    { id: 'volta', x: 80, y: E.roadY + E.roadH / 2, label: 'Voltar à encruzilhada', act: () => goRegion('encruzilhada', ENC.W - 140, ENC.roadY + ENC.roadH / 2, 'Encruzilhada', 'De volta à região central.') },
    { id: 'house:badin', ...front(E.badin), label: 'Casa de pedra do Badin', house: 'badin' },
    { id: 'house:marcio', ...front(E.gemeos), label: 'Casa dos gêmeos Márcio e Marcelo', house: 'marcio' },
    { id: 'campinho', x: E.campinho.x + E.campinho.w / 2, y: E.campinho.y - 20, label: 'Campinho · show de bola', text: 'O campinho dos gêmeos: aqui é show de bola. Em breve, um racha no domingo à tarde.' },
    { id: 'estacao', ...front(E.estacao), label: 'Estação da Maria Fumaça', text: 'Maria Fumaça: o trem a vapor que corre entre os parreirais, com apito, vinho e música italiana.' },
    { id: 'galeteria', ...front(E.galeteria), label: 'Galeteria', text: 'Galeteria: galeto al primo canto, polenta frita, radicci e massa. Em breve, receitas novas para a bodega.' },
    { id: 'vinicola', ...front(E.vinicola), label: 'Vinícola da família', text: 'Vinícola da família: vinho colonial e suco de uva. Em breve dá para comprar vinho para a bodega.' },
    { id: 'matriz', ...front(E.matriz), label: 'Igreja matriz', text: 'Igreja matriz com o campanário: a fé que segurou os imigrantes italianos no começo da colônia.' },
    { id: 'castelinho', ...front(E.castelinho), label: 'Castelinho de Erechim', text: 'Castelinho: o prédio de madeira de 1916, onde a Comissão de Terras dividia os lotes para os imigrantes. Fica de frente para a Praça da Bandeira.' },
    { id: 'praca', ...front(E.praca, 0), label: 'Praça da Bandeira', text: 'Praça da Bandeira, no coração de Erechim.' },
    ...E.capiteis.map((c, i) => ({ id: 'capitel' + i, ...front(c, 24), label: 'Capitel', text: 'Capitel de beira de estrada: capelinha erguida por promessa, onde as famílias rezam o terço e pedem chuva para a lavoura.' }))
  ]; },
  lights() { const E = ERE; return [[E.badin.x + 50, E.badin.y + 120], [E.gemeos.x + 50, E.gemeos.y + 116], [E.galeteria.x + 60, E.galeteria.y + 120], [E.castelinho.x + 160, E.castelinho.y + 200], [E.estacao.x + 120, E.estacao.y + 100]]; },
  draw(view, seen, layers) {
    const E = ERE;
    grassField(this, view, seen, '#76984a', ['#668a3e', '#8aac58']);
    for (const [x, y, rx] of [[600, 300, 600], [2000, 250, 700], [3200, 300, 500], [1800, 1800, 700]]) if (seen(x, y, rx)) ellipse(x, y, rx, rx * .3, 'rgba(110,140,70,.4)');   // serra
    road(0, E.roadY, E.W, E.roadH); drawRail(0, E.W, E.rail);
    road(E.castelinho.x + E.castelinho.w / 2 - 40, E.roadY + E.roadH, 80, E.praca.y - E.roadY - E.roadH);
    const add = (r, fn) => { if (seen(r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h))) layers.push({ y: r.y + r.h, draw: fn }); };
    for (const v of E.vines) add(v, () => drawVineyard(v, Math.round(v.h / 60)));
    for (const c of E.capiteis) add(c, () => drawCapitel(c));
    add(E.badin, () => drawStoneHouse(E.badin, 'Casa de pedra do Badin')); ownerAtDoor(layers, E.badin, 'badin', seen);
    add(E.gemeos, () => worldHouse(E.gemeos, 'Casa dos gêmeos Márcio e Marcelo', { wall: '#e8d8b0', roof: '#9a4a32' })); ownerAtDoor(layers, E.gemeos, 'marcio', seen);
    layers.push({ y: E.campinho.y, draw: () => { const c = E.campinho; rect(c.x, c.y, c.w, c.h, '#5aa040', 2, '#f4f4f4'); ctx.strokeStyle = '#f4f4f4'; ctx.lineWidth = 4; ctx.strokeRect(c.x + 10, c.y + 10, c.w - 20, c.h - 20); ctx.beginPath(); ctx.moveTo(c.x + c.w / 2, c.y + 10); ctx.lineTo(c.x + c.w / 2, c.y + c.h - 10); ctx.stroke(); ctx.beginPath(); ctx.arc(c.x + c.w / 2, c.y + c.h / 2, 50, 0, Math.PI * 2); ctx.stroke(); for (const gx of [c.x + 4, c.x + c.w - 16]) rect(gx, c.y + c.h / 2 - 50, 12, 100, 'rgba(255,255,255,.5)', 2, '#f4f4f4'); ellipse(c.x + c.w / 2 + Math.sin(frameClock * 2) * 120, c.y + c.h / 2 + Math.cos(frameClock * 1.3) * 60, 9, 9, '#f8f8f8'); signBoard(c.x + c.w / 2, c.y - 50, 220, 'SHOW DE BOLA', 13); } });
    add(E.galeteria, () => { drawStoneHouse(E.galeteria, null); rect(E.galeteria.x + 20, E.galeteria.y + 70, E.galeteria.w - 40, 26, '#f4ecd8', 3, '#5a3a20'); txt('GALETERIA · GALETO E POLENTA', E.galeteria.x + E.galeteria.w / 2, E.galeteria.y + 83, 12, '#6a1a2a', 'center', 'Georgia'); pennants(E.galeteria.x + 10, E.galeteria.x + E.galeteria.w - 10, E.galeteria.y + 50, ['#2a8a3a', '#f4f4f4', '#d42a2a']); });
    add(E.vinicola, () => { drawStoneHouse(E.vinicola, null); rect(E.vinicola.x + 30, E.vinicola.y + 72, E.vinicola.w - 60, 26, '#f4ecd8', 3, '#5a3a20'); txt('VINÍCOLA DA FAMÍLIA · VINHO COLONIAL', E.vinicola.x + E.vinicola.w / 2, E.vinicola.y + 85, 12, '#6a1a2a', 'center', 'Georgia'); wineBarrels(E.vinicola.x + E.vinicola.w + 40, E.vinicola.y + E.vinicola.h - 20); });
    add(E.estacao, () => { const s = E.estacao; gable(s.x, s.y + 10, s.w, 50, '#7a3a24', 16); rect(s.x, s.y + 56, s.w, s.h - 56, '#f0d8a8', 0, '#6a5a3a'); for (const x of [s.x + 20, s.x + s.w - 70]) windowPane(x, s.y + 74, 50, 40); rect(s.x + s.w / 2 - 20, s.y + s.h - 60, 40, 60, '#6a4424'); signBoard(s.x + s.w / 2, s.y + 20, 220, 'ESTAÇÃO · MARIA FUMAÇA', 12); });
    add(E.matriz, () => { const m = E.matriz, mid = m.x + m.w * .4;
      rect(m.x + m.w - 70, m.y - 90, 70, m.h + 90, '#e8e0cc', 0, '#8a8070'); gable(m.x + m.w - 74, m.y - 140, 78, 50, '#a8442a', 4); ellipse(m.x + m.w - 35, m.y - 50, 14, 16, '#3a2a1a'); ellipse(m.x + m.w - 35, m.y - 44, 8, 10, '#c8a040'); rect(m.x + m.w - 38, m.y - 186, 6, 46, '#5a4a3a'); rect(m.x + m.w - 48, m.y - 172, 26, 5, '#5a4a3a');
      gable(m.x, m.y + 40, m.w - 80, 90, '#a8442a', 14); rect(m.x, m.y + 120, m.w - 80, m.h - 120, '#f2ede0', 0, '#8a8070');
      ctx.fillStyle = '#6a4424'; ctx.beginPath(); ctx.moveTo(mid - 30, m.y + m.h); ctx.lineTo(mid - 30, m.y + m.h - 70); ctx.arc(mid, m.y + m.h - 70, 30, Math.PI, 0); ctx.lineTo(mid + 30, m.y + m.h); ctx.closePath(); ctx.fill(); ellipse(mid, m.y + 100, 18, 18, '#7a5ab0'); ellipse(mid, m.y + 100, 11, 11, '#e8c8f0'); });
    // Castelinho: o prédio de madeira de 1916, com as torrinhas.
    add(E.castelinho, () => { const c = E.castelinho; rect(c.x, c.y + 100, c.w, c.h - 100, '#c8a070', 0, '#5a3a20'); for (let x = c.x + 10; x < c.x + c.w; x += 18) rect(x, c.y + 102, 2, c.h - 104, '#a8804a');
      for (const tx of [c.x - 10, c.x + c.w - 70]) { rect(tx, c.y + 30, 80, c.h - 30, '#d4ac78', 0, '#5a3a20'); poly([[tx - 8, c.y + 34], [tx + 40, c.y - 40], [tx + 88, c.y + 34]], '#6a3a24'); windowPane(tx + 20, c.y + 70, 40, 40); }
      gable(c.x + 60, c.y + 40, c.w - 120, 70, '#7a4a2a', 10); for (const x of [c.x + 90, c.x + c.w - 150]) windowPane(x, c.y + 140, 60, 50); rect(c.x + c.w / 2 - 26, c.y + c.h - 80, 52, 80, '#5a3a20', 2); signBoard(c.x + c.w / 2, c.y + c.h + 6, 200, 'CASTELINHO', 13); });
    layers.push({ y: E.praca.y, draw: () => { const p = E.praca; rect(p.x, p.y, p.w, p.h, '#7fae52', 8, '#c9b58a'); rect(p.x + p.w / 2 - 20, p.y, 40, p.h, '#d9c49a'); flagRS(p.x + p.w / 2 + 40, p.y + 160); signBoard(p.x + p.w / 2, p.y + p.h - 40, 210, 'PRAÇA DA BANDEIRA', 12); } });
    layers.push({ y: E.rail + 20, draw: () => drawTrain(trainX(0, E.W, 120, 900), E.rail + 10) });
    layers.push({ y: E.roadY - 10, draw: () => drawPortal(240, E.roadY - 10, 'ERECHIM · SERRA GAÚCHA', ['#2a8a3a', '#f4f4f4', '#d42a2a'], '#c8b48a') });
  }
});

// =================== PORTO ALEGRE ===================
const POA = { W: 3400, H: 2200, roadX: 1660, roadW: 80, aveY: 880, aveH: 80, guaiba: 1880,
  fans: [{ x: 1100, y: 300, w: 240, h: 180, team: 'gremio' }, { x: 2000, y: 300, w: 240, h: 180, team: 'inter' }, { x: 700, y: 300, w: 240, h: 180, team: 'inter' }],
  mito: { x: 2400, y: 290, w: 260, h: 190 }, arena: { x: 200, y: 1150, w: 560, h: 260 }, beirario: { x: 2600, y: 1150, w: 560, h: 260 },
  mercado: { x: 1000, y: 1160, w: 460, h: 240 }, usina: { x: 2000, y: 1500, w: 320, h: 200 }, lacador: { x: 1670, y: 560, w: 60, h: 70 },
  predios: [{ x: 160, y: 260, w: 260, h: 300 }, { x: 2900, y: 240, w: 300, h: 320 }, { x: 160, y: 1520, w: 300, h: 260 }, { x: 2700, y: 1500, w: 280, h: 280 }]
};
POA.obstacles = [...POA.fans, ...POA.predios, POA.mito, POA.arena, POA.beirario, POA.mercado, POA.usina, POA.lacador];
WORLD_MAPS.poa = regionMap({
  id: 'poa', name: 'Porto Alegre', W: POA.W, H: POA.H, obstacles: POA.obstacles,
  blocked(x, y) { return y > POA.guaiba - 20; },
  edge(p) { if (p.y < 10) return { map: 'encruzilhada', x: ENC.roadX + ENC.roadW / 2, y: ENC.H - 140, title: 'Encruzilhada', text: 'De volta à região central.' }; return null; },
  spots() { const P = POA; return [
    { id: 'volta', x: P.roadX + P.roadW / 2, y: 70, label: 'Voltar à encruzilhada', act: () => goRegion('encruzilhada', ENC.roadX + ENC.roadW / 2, ENC.H - 140, 'Encruzilhada', 'De volta à região central.') },
    { id: 'house:mitodosul', ...front(P.mito), label: 'Casa do Mito do Sul', house: 'mitodosul' },
    ...P.fans.map((f, i) => ({ id: 'fan' + i, ...front(f), label: f.team === 'gremio' ? 'Casa de gremista' : 'Casa de colorado', text: f.team === 'gremio' ? 'Bandeira tricolor na janela: aqui mora gremista. Em dia de Gre-Nal, é freguês certo na bodega.' : 'Bandeira vermelha na janela: aqui mora colorado. Em dia de Gre-Nal, é freguês certo na bodega.' })),
    { id: 'arena', ...front(P.arena), label: 'Estádio do Grêmio', text: 'O estádio tricolor. Nos dias de jogo do Grêmio, a gremistada lota a bodega para ver na TV.' },
    { id: 'beirario', ...front(P.beirario), label: 'Beira-Rio', text: 'O Gigante da Beira-Rio, casa do Inter. Em dia de jogo do Colorado, a bodega enche de vermelho.' },
    { id: 'lacador', ...front(P.lacador, 26), label: 'Estátua do Laçador', text: 'O Laçador, símbolo de Porto Alegre e do gaúcho pilchado.' },
    { id: 'mercado', ...front(P.mercado), label: 'Mercado Público', text: 'Mercado Público: em breve, compras especiais para a bodega, como erva de barbaquá e queijo serrano.' },
    { id: 'usina', ...front(P.usina), label: 'Usina do Gasômetro', text: 'Usina do Gasômetro, na beira do Guaíba: dali se vê o pôr do sol mais bonito de Porto Alegre.' }
  ]; },
  lights() { const P = POA; return [...P.fans.map(f => [f.x + 50, f.y + 116]), [P.mito.x + 50, P.mito.y + 116], [P.mercado.x + P.mercado.w / 2, P.mercado.y + 140]]; },
  draw(view, seen, layers) {
    const P = POA;
    rect(view.x, view.y, view.w, view.h, '#9a9890'); rect(P.roadX - 24, 0, P.roadW + 48, P.guaiba, '#c8c4b8'); rect(0, P.aveY - 24, P.W, P.aveH + 48, '#c8c4b8');
    road(P.roadX, 0, P.roadW, P.guaiba, '#5a5a58', '#3a3a38'); road(0, P.aveY, P.W, P.aveH, '#5a5a58', '#3a3a38');
    for (let y = 10; y < P.guaiba; y += 60) rect(P.roadX + P.roadW / 2 - 3, y, 6, 30, '#e8c840'); for (let x = 20; x < P.W; x += 80) rect(x, P.aveY + P.aveH / 2 - 3, 40, 6, '#e8c840');
    const g = ctx.createLinearGradient(0, P.guaiba, 0, P.H); g.addColorStop(0, '#e8a050'); g.addColorStop(.35, '#c86a4a'); g.addColorStop(1, '#4a3a6a'); ctx.fillStyle = g; ctx.fillRect(0, P.guaiba, P.W, P.H - P.guaiba); rect(0, P.guaiba - 14, P.W, 14, '#8a8a80');
    ellipse(P.W * .62, P.H - 40, 120, 60, 'rgba(255,210,120,.8)'); for (let i = 0; i < 30; i++) { const x = (i * 157 + frameClock * 18) % P.W, y = P.guaiba + 30 + (i * 23) % 220; rect(x, y, 40, 3, 'rgba(255,230,180,.45)', 2); }
    for (const x of [700, 2200]) txt('GUAÍBA', x, P.guaiba + 90, 28, 'rgba(255,245,230,.7)', 'center', 'Georgia');
    const add = (r, fn) => { if (seen(r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h))) layers.push({ y: r.y + r.h, draw: fn }); };
    for (const b of P.predios) add(b, () => { rect(b.x, b.y, b.w, b.h, '#c8c0b0', 2, '#6a6a64'); rect(b.x - 6, b.y - 10, b.w + 12, 14, '#7a7a74'); for (let y = b.y + 20; y < b.y + b.h - 50; y += 44) for (let x = b.x + 18; x < b.x + b.w - 30; x += 52) rect(x, y, 30, 26, '#3a4a5a', 2); rect(b.x + b.w / 2 - 22, b.y + b.h - 50, 44, 50, '#5a4a3a'); });
    for (let x = 120; x < P.W; x += 260) if (Math.abs(x - P.roadX) > 120) for (const y of [P.aveY - 30, P.aveY + P.aveH + 150]) if (seen(x, y)) layers.push({ y, draw: () => drawWorldTree(x, y, 'jaca') });
    for (const f of P.fans) add(f, () => drawFanHouse(f));
    add(P.mito, () => worldHouse(P.mito, 'Casa do Mito do Sul', { wall: '#d8d8d0', roof: '#2a6ac8' })); ownerAtDoor(layers, P.mito, 'mitodosul', seen);
    const stadium = (s, main, second, name) => () => { ellipse(s.x + s.w / 2, s.y + s.h - 40, s.w / 2, 70, '#7a7a74'); rect(s.x, s.y + 60, s.w, s.h - 60, main, 8, '#3a3a3a'); for (let x = s.x + 20; x < s.x + s.w - 10; x += 34) rect(x, s.y + 80, 18, s.h - 120, second, 2); ctx.fillStyle = '#e8e8e4'; ctx.beginPath(); ctx.ellipse(s.x + s.w / 2, s.y + 66, s.w / 2 + 10, 40, 0, Math.PI, 0); ctx.fill(); rect(s.x + s.w / 2 - 110, s.y + s.h - 70, 220, 34, '#f4f4f4', 4, '#3a3a3a'); txt(name, s.x + s.w / 2, s.y + s.h - 53, 20, main, 'center', 'Arial'); };
    add(P.arena, stadium(P.arena, '#2a6ac8', '#1a1a1a', 'ARENA')); add(P.beirario, stadium(P.beirario, '#d42a2a', '#f4f4f4', 'BEIRA-RIO'));
    add(P.mercado, () => { const m = P.mercado; rect(m.x, m.y + 40, m.w, m.h - 40, '#e8c060', 0, '#8a6a2a'); for (const x of [m.x, m.x + m.w - 70]) { rect(x, m.y - 20, 70, m.h + 20, '#f0cc70', 0, '#8a6a2a'); poly([[x - 4, m.y - 20], [x + 35, m.y - 60], [x + 74, m.y - 20]], '#a8442a'); } for (let x = m.x + 90; x < m.x + m.w - 90; x += 56) { ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.moveTo(x, m.y + m.h); ctx.lineTo(x, m.y + 120); ctx.arc(x + 20, m.y + 120, 20, Math.PI, 0); ctx.lineTo(x + 40, m.y + m.h); ctx.closePath(); ctx.fill(); } rect(m.x + m.w / 2 - 110, m.y + 54, 220, 30, '#f8f0d8', 3, '#8a6a2a'); txt('MERCADO PÚBLICO', m.x + m.w / 2, m.y + 69, 15, '#6a3a1a', 'center', 'Georgia'); });
    add(P.usina, () => { const u = P.usina; rect(u.x, u.y + 40, u.w, u.h - 40, '#b86a4a', 0, '#5a3a2a'); for (let y = u.y + 52; y < u.y + u.h; y += 12) rect(u.x + 2, y, u.w - 4, 1, 'rgba(80,30,20,.35)'); for (let x = u.x + 30; x < u.x + u.w - 30; x += 60) windowPane(x, u.y + 80, 40, 60, '#5a3a2a'); rect(u.x + u.w - 60, u.y - 220, 40, 260, '#a85a3a', 0, '#5a3a2a'); rect(u.x + u.w - 66, u.y - 228, 52, 14, '#8a4a2a'); signBoard(u.x + u.w / 2 - 30, u.y + 46, 200, 'USINA DO GASÔMETRO', 12); });
    // O Laçador: o gaúcho pilchado com o laço, no pedestal.
    add(P.lacador, () => { const l = P.lacador, cx = l.x + l.w / 2, b = '#6a5a3a'; ellipse(cx, l.y + l.h - 10, 110, 40, '#7fae52'); rect(l.x - 20, l.y + 20, l.w + 40, l.h - 20, '#c8c0b0', 2, '#8a8070'); rect(l.x - 10, l.y, l.w + 20, 26, '#d8d0c0', 2, '#8a8070');
      rect(cx - 8, l.y - 70, 16, 70, b); rect(cx - 16, l.y - 110, 32, 44, b); ellipse(cx, l.y - 120, 11, 12, b); rect(cx - 22, l.y - 132, 44, 6, b); rect(cx - 12, l.y - 142, 24, 12, b); rect(cx + 14, l.y - 104, 30, 6, b); ctx.strokeStyle = b; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx + 50, l.y - 90, 12, 18, 0, 0, Math.PI * 2); ctx.stroke(); rect(cx - 30, l.y - 100, 14, 40, b); });
    layers.push({ y: 190, draw: () => drawPortal(P.roadX + P.roadW / 2, 190, 'PORTO ALEGRE', ['#2a6ac8', '#d42a2a', '#f4f4f4'], '#e8e4d8') });
  }
});
