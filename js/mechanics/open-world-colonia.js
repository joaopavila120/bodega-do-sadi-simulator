// Estrada da colônia: o mapa à direita da vila.
// No centro, a campanha (Baitaca, Gaudêncio, Jayme Caetano Braun). Quanto mais à direita, mais italiano, rumo a Erechim:
// parreirais, capitéis de beira de estrada, casa de pedra, cantina e igreja com campanário. Quanto mais ao norte, mais
// alemão, rumo a Pomerode: enxaimel, café colonial, cancha de bolão, igreja luterana e o Kerb. Ao sul, Porto Alegre:
// casas de gremistas e colorados, os estádios, o Laçador, o Mercado Público, a Usina do Gasômetro e o pôr do sol no Guaíba.
'use strict';

const COLONIA = {
  W: 4400, H: 3600, roadY: 1700, roadH: 90, roadX: 1400, roadW: 80, guaiba: 3380,
  houses: [
    { id: 'baitaca', x: 250, y: 1200, w: 260, h: 190, wall: '#efe6d2', roof: '#b89a58', label: 'Rancho do Baitaca' },
    { id: 'jayme', x: 760, y: 1150, w: 260, h: 190, wall: '#e8dcc0', roof: '#a8844a', label: 'Casa do Jayme Caetano Braun' },
    { id: 'gaudencio', x: 300, y: 2050, w: 260, h: 190, wall: '#efe6d2', roof: '#b89a58', label: 'Rancho do Gaudêncio' },
    { id: 'badin', x: 2500, y: 1230, w: 290, h: 210, stone: true, label: 'Casa de pedra do Badin' },
    { id: 'loligebien', x: 900, y: 700, w: 290, h: 210, enx: true, label: 'Casa de Loli Gebien' },
    { id: 'mitodosul', x: 1700, y: 2460, w: 260, h: 190, wall: '#d8d8d0', roof: '#5a5a5a', label: 'Casa do Mito do Sul' },
    { id: 'dianho', x: 880, y: 2560, w: 260, h: 190, wall: '#e0c8b0', roof: '#7a4a3a', label: 'Casa do Dianho' }
  ],
  // italiano (leste)
  cantina: { x: 2760, y: 1900, w: 360, h: 220 }, matriz: { x: 3720, y: 1020, w: 300, h: 360 },
  capiteis: [{ x: 2120, y: 1880, w: 70, h: 90 }, { x: 3520, y: 1950, w: 70, h: 90 }, { x: 4080, y: 1880, w: 70, h: 90 }],
  parreirais: [{ x: 1760, y: 1360, w: 300, h: 200, rows: 3 }, { x: 3080, y: 1180, w: 520, h: 380, rows: 6 }, { x: 3280, y: 1900, w: 220, h: 300, rows: 5 }, { x: 4060, y: 2120, w: 300, h: 300, rows: 5 }],
  // alemão (norte)
  enxaimel: [{ x: 1560, y: 1120, w: 240, h: 180 }, { x: 1580, y: 760, w: 260, h: 190 }, { x: 560, y: 380, w: 240, h: 180 }],
  cafe: { x: 1560, y: 430, w: 320, h: 200 }, bolao: { x: 820, y: 230, w: 440, h: 150 }, luterana: { x: 2040, y: 300, w: 260, h: 300 }, kerb: { x: 1880, y: 760, w: 380, h: 170 },
  // Porto Alegre (sul)
  fans: [{ x: 1560, y: 2140, w: 240, h: 180, team: 'gremio' }, { x: 980, y: 2230, w: 240, h: 180, team: 'inter' }, { x: 2120, y: 2200, w: 240, h: 180, team: 'inter' }],
  arena: { x: 260, y: 2860, w: 560, h: 260 }, beirario: { x: 2900, y: 2860, w: 560, h: 260 }, mercado: { x: 1820, y: 2860, w: 460, h: 240 }, usina: { x: 3700, y: 2920, w: 320, h: 200 },
  lacador: { x: 1410, y: 3010, w: 60, h: 70 }
};
const COLONIA_TREES = [[150, 900, 'a'], [600, 1550, 'a'], [1150, 2000, 'a'], [1900, 1100, 't'], [2300, 2150, 't'], [3000, 1700, 't'], [3900, 1600, 't'], [400, 600, 't'], [1300, 450, 'a'], [2400, 600, 't'], [300, 120, 'a'], [2600, 2500, 't'], [1250, 2700, 't']];
const COLONIA_ROADS = [[0, COLONIA.roadY, COLONIA.W, COLONIA.roadH], [COLONIA.roadX, 0, COLONIA.roadW, COLONIA.guaiba]];

WORLD_MAPS.colonia = {
  id: 'colonia', name: 'Estrada da colônia', W: COLONIA.W, H: COLONIA.H,
  obstacles() { const C = COLONIA; return [...C.houses, C.cantina, C.matriz, ...C.capiteis, ...C.parreirais, ...C.enxaimel, C.cafe, C.bolao, C.luterana, C.kerb, ...C.fans, C.arena, C.beirario, C.mercado, C.usina, C.lacador]; },
  canWalk(x, y) { if (y < 80 || y > COLONIA.guaiba - 20 || x > COLONIA.W - 30 || x < -20) return false; return !hitRect(this.obstacles(), x, y); },
  // Pela esquerda, de volta à vila da bodega.
  edge(p) { if (p.x < 10) return { map: 'vila', x: VILA.W - 70, y: clamp(p.y - (COLONIA.roadY + COLONIA.roadH / 2) + VILA.roadY + VILA.roadH / 2, 700, 2300), title: 'Vila da bodega', text: 'De volta à vila: a bodega fica na estrada de cima.' }; return null; },
  spots() {
    const C = COLONIA;
    return [
      ...C.houses.map(h => ({ id: 'house:' + h.id, ...front(h), label: h.label, house: h.id })),
      { id: 'placa', x: C.roadX + 140, y: C.roadY - 20, label: 'Encruzilhada', text: 'Encruzilhada: ↑ colônia alemã, rumo a Pomerode · → colônia italiana, rumo a Erechim · ↓ Porto Alegre · ← a vila da bodega.' },
      { id: 'cantina', ...front(C.cantina), label: 'Cantina do Nono', text: 'Cantina do Nono: vinho colonial, salame e queijo. Em breve dá para comprar vinho para a bodega.' },
      { id: 'matriz', ...front(C.matriz), label: 'Igreja matriz', text: 'Igreja matriz com o campanário: a fé que segurou os imigrantes italianos no começo da colônia.' },
      ...C.capiteis.map((c, i) => ({ id: 'capitel' + i, ...front(c, 24), label: 'Capitel', text: 'Capitel de beira de estrada: capelinha erguida por promessa, onde as famílias se juntam para rezar o terço e pedir chuva para a lavoura.' })),
      { id: 'parreiral', ...front(C.parreirais[1], 20), label: 'Parreiral', text: 'Parreiral de uva: em breve, a vindima e a uva para o vinho da cantina.' },
      { id: 'erechim', x: C.W - 120, y: C.roadY + C.roadH / 2, label: 'Rumo a Erechim', text: 'A estrada segue para Erechim, colônia de italianos do Vêneto. Em breve, um mapa novo.' },
      { id: 'cafe', ...front(C.cafe), label: 'Café colonial', text: 'Café colonial: cuca, chimia, schmier, linguiça e pão caseiro. Em breve, encomendas para a bodega.' },
      { id: 'bolao', ...front(C.bolao), label: 'Cancha de bolão', text: 'Cancha de bolão: o boliche dos colonos alemães. Em breve, partidas valendo chope.' },
      { id: 'luterana', ...front(C.luterana), label: 'Igreja luterana', text: 'Igreja luterana da colônia alemã: o culto de domingo, o coral e a Kerb da comunidade.' },
      { id: 'kerb', ...front(C.kerb), label: 'Pavilhão da Kerb', text: 'Kerb: a festa da comunidade, com culto, chope, cuca, porco assado e baile de vários dias.' },
      { id: 'pomerode', x: C.roadX + C.roadW / 2, y: 150, label: 'Rumo a Pomerode', text: 'Ao norte, a estrada sobe para Pomerode, a cidade das casas em enxaimel. Em breve, um mapa novo.' },
      ...C.fans.map((f, i) => ({ id: 'fan' + i, ...front(f), label: f.team === 'gremio' ? 'Casa de gremista' : 'Casa de colorado', text: f.team === 'gremio' ? 'Bandeira tricolor na janela: aqui mora gremista. Em dia de Gre-Nal, é freguês certo na bodega.' : 'Bandeira vermelha na janela: aqui mora colorado. Em dia de Gre-Nal, é freguês certo na bodega.' })),
      { id: 'arena', ...front(C.arena), label: 'Estádio do Grêmio', text: 'O estádio tricolor. Nos dias de jogo do Grêmio, a gremistada lota a bodega para ver na TV.' },
      { id: 'beirario', ...front(C.beirario), label: 'Beira-Rio', text: 'O Gigante da Beira-Rio, casa do Inter. Em dia de jogo do Colorado, a bodega enche de vermelho.' },
      { id: 'lacador', ...front(C.lacador, 26), label: 'Estátua do Laçador', text: 'O Laçador, símbolo de Porto Alegre e do gaúcho pilchado.' },
      { id: 'mercado', ...front(C.mercado), label: 'Mercado Público', text: 'Mercado Público: em breve, compras especiais para a bodega, como erva de barbaquá e queijo serrano.' },
      { id: 'usina', ...front(C.usina), label: 'Usina do Gasômetro', text: 'Usina do Gasômetro, na beira do Guaíba: dali se vê o pôr do sol mais bonito de Porto Alegre.' }
    ];
  },
  lights() { const C = COLONIA; return [...C.houses.map(h => [h.x + 50, h.y + 116]), [C.cantina.x + 80, C.cantina.y + 120], [C.cafe.x + 80, C.cafe.y + 110], [C.kerb.x + C.kerb.w / 2, C.kerb.y + 90], [C.mercado.x + C.mercado.w / 2, C.mercado.y + 140]]; },
  draw(view, seen, layers) {
    const C = COLONIA;
    drawColoniaGround(this, view, seen);
    for (const r of COLONIA_ROADS) road(...r);
    // ao sul a estrada vira asfalto, com faixa amarela
    rect(C.roadX, 2700, C.roadW, C.guaiba - 2700, '#5a5a58'); for (let y = 2710; y < C.guaiba; y += 60) rect(C.roadX + C.roadW / 2 - 3, y, 6, 30, '#e8c840');
    road(0, 2780, C.W, 70, '#5a5a58', '#3a3a38'); for (let x = 20; x < C.W; x += 80) rect(x, 2812, 40, 6, '#e8c840');
    drawGuaiba();
    const add = (r, fn) => { if (seen(r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h))) layers.push({ y: r.y + r.h, draw: fn }); };
    for (const h of C.houses) { add(h, () => h.stone ? drawStoneHouse(h, h.label) : h.enx ? drawEnxaimel(h, h.label) : worldHouse(h, h.label, h)); ownerAtDoor(layers, h, h.id, seen); }
    for (const p of C.parreirais) add(p, () => drawParreiral(p));
    for (const c of C.capiteis) add(c, () => drawCapitel(c));
    add(C.cantina, drawCantina); add(C.matriz, drawMatriz);
    for (const e of C.enxaimel) add(e, () => drawEnxaimel(e));
    add(C.cafe, drawCafeColonial); add(C.bolao, drawBolao); add(C.luterana, drawLuterana); add(C.kerb, drawKerb);
    for (const f of C.fans) add(f, () => drawFanHouse(f));
    add(C.arena, () => drawStadium(C.arena, '#2a6ac8', '#1a1a1a', 'ARENA')); add(C.beirario, () => drawStadium(C.beirario, '#d42a2a', '#f4f4f4', 'BEIRA-RIO'));
    add(C.mercado, drawMercado); add(C.usina, drawUsina); add(C.lacador, drawLacador);
    for (const [x, y, kind] of COLONIA_TREES) if (seen(x, y)) layers.push({ y, draw: () => drawWorldTree(x, y, kind) });
    // encruzilhada e portais
    if (seen(C.roadX, C.roadY)) layers.push({ y: C.roadY - 10, draw: drawCrossroadSign });
    if (seen(C.W - 100, C.roadY)) layers.push({ y: C.roadY + C.roadH + 10, draw: () => drawPortal(C.W - 160, C.roadY + C.roadH + 10, 'ERECHIM →', ['#2a8a3a', '#f4f4f4', '#d42a2a'], '#c8b48a') });
    if (seen(C.roadX, 120)) layers.push({ y: 230, draw: () => drawPortal(C.roadX + C.roadW / 2, 230, '↑ POMERODE', ['#1a1a1a', '#d42a2a', '#f0c020'], '#f4f0e6', true) });
  }
};

// Chão: verde no meio, mais escuro e de mato ao norte, coxilhas na serra italiana e cinza urbano ao sul.
function drawColoniaGround(M, view, seen) {
  grassField(M, view, seen, '#6f9a45', ['#5f8a3a', '#86ad55']);
  const C = COLONIA;
  const north = ctx.createLinearGradient(0, 0, 0, 1300); north.addColorStop(0, 'rgba(30,70,30,.45)'); north.addColorStop(1, 'rgba(30,70,30,0)'); ctx.fillStyle = north; ctx.fillRect(0, 0, C.W, 1300);
  for (const [x, y, rx] of [[2600, 1000, 420], [3300, 900, 520], [4000, 1300, 460], [3800, 2400, 520], [2900, 2350, 380]]) if (seen(x, y, rx)) ellipse(x, y, rx, rx * .35, 'rgba(120,150,70,.35)');
  const south = ctx.createLinearGradient(0, 2500, 0, C.guaiba); south.addColorStop(0, 'rgba(110,110,105,0)'); south.addColorStop(.5, 'rgba(110,110,105,.55)'); south.addColorStop(1, 'rgba(120,120,115,.9)'); ctx.fillStyle = south; ctx.fillRect(0, 2500, C.W, C.guaiba - 2500);
}
function drawGuaiba() {
  const C = COLONIA, g = ctx.createLinearGradient(0, C.guaiba, 0, C.H); g.addColorStop(0, '#e8a050'); g.addColorStop(.35, '#c86a4a'); g.addColorStop(1, '#4a3a6a');
  ctx.fillStyle = g; ctx.fillRect(0, C.guaiba, C.W, C.H - C.guaiba); rect(0, C.guaiba - 14, C.W, 14, '#8a8a80');
  ellipse(C.W * .62, C.H - 40, 120, 60, 'rgba(255,210,120,.8)');
  for (let i = 0; i < 30; i++) { const x = (i * 157 + frameClock * 18) % C.W, y = C.guaiba + 30 + (i * 23) % 160; rect(x, y, 40, 3, 'rgba(255,230,180,.45)', 2); }
  for (const x of [700, 2200, 3600]) txt('GUAÍBA · PORTO ALEGRE', x, C.guaiba + 90, 24, 'rgba(255,245,230,.7)', 'center', 'Georgia');
}
function drawCrossroadSign() {
  const C = COLONIA, x = C.roadX + 140, y = C.roadY - 10; rect(x - 4, y - 150, 8, 150, '#5a3a20');
  const arm = (dy, text, dir) => { const w = 170, x0 = dir > 0 ? x : x - w; poly(dir > 0 ? [[x0, y + dy], [x0 + w - 20, y + dy], [x0 + w, y + dy + 13], [x0 + w - 20, y + dy + 26], [x0, y + dy + 26]] : [[x0 + 20, y + dy], [x0 + w, y + dy], [x0 + w, y + dy + 26], [x0 + 20, y + dy + 26], [x0, y + dy + 13]], '#e8d6a8'); txt(text, x0 + w / 2, y + dy + 13, 12, '#5a2a14', 'center', 'Georgia'); };
  arm(-150, '↑ Pomerode', 1); arm(-118, 'Erechim', 1); arm(-86, 'Porto Alegre ↓', 1); arm(-118, 'Vila da bodega', -1);
}
function drawPortal(cx, y, text, colors, wall, enx = false) {
  rect(cx - 150, y - 150, 28, 150, wall, 2, '#5a4a3a'); rect(cx + 122, y - 150, 28, 150, wall, 2, '#5a4a3a');
  rect(cx - 170, y - 190, 340, 46, wall, 4, '#5a4a3a'); if (enx) for (let k = 0; k < 6; k++) { rect(cx - 160 + k * 58, y - 188, 6, 42, '#4a2e18'); ctx.strokeStyle = '#4a2e18'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - 154 + k * 58, y - 186); ctx.lineTo(cx - 106 + k * 58, y - 148); ctx.stroke(); }
  rect(cx - 120, y - 182, 240, 30, '#f4ecd8', 3); txt(text, cx, y - 167, 16, '#5a2a14', 'center', 'Georgia');
  gable(cx - 170, y - 236, 340, 46, enx ? '#8a3a24' : '#a8442a', 10); pennants(cx - 150, cx + 150, y - 140, colors);
}
// ---------- Colônia italiana ----------
function drawParreiral(p) {
  rect(p.x, p.y, p.w, p.h, '#8a6a3a', 4); const gap = p.h / p.rows;
  for (let r = 0; r < p.rows; r++) { const y = p.y + gap * r + gap * .55; for (let x = p.x + 16; x < p.x + p.w - 10; x += 46) rect(x, y - 30, 5, 34, '#5a3a20'); rect(p.x + 10, y - 30, p.w - 20, 3, '#6a5a4a');
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
function drawCantina() {
  const c = COLONIA.cantina; drawStoneHouse(c, null);
  rect(c.x + 30, c.y + 72, c.w - 60, 26, '#f4ecd8', 3, '#5a3a20'); txt('CANTINA DO NONO · VINHO COLONIAL', c.x + c.w / 2, c.y + 85, 12, '#6a1a2a', 'center', 'Georgia');
  pennants(c.x + 10, c.x + c.w - 10, c.y + 50, ['#2a8a3a', '#f4f4f4', '#d42a2a']);
  for (let k = 0; k < 3; k++) { const x = c.x + c.w + 30, y = c.y + c.h - 30 - k * 4; ellipse(x + (k - 1) * 44, y + 10, 24, 30, '#7a4a2a'); for (const dy of [-12, 12]) rect(x + (k - 1) * 44 - 24, y + 10 + dy, 48, 4, '#4a4a44'); }
  rect(c.x - 70, c.y + c.h - 50, 60, 10, '#7a5a34'); ellipse(c.x - 40, c.y + c.h - 54, 10, 12, '#6a1a3a'); ellipse(c.x - 20, c.y + c.h - 52, 6, 6, '#e8d8b0');
}
// Igreja matriz com o campanário separado, como nas colônias italianas.
function drawMatriz() {
  const m = COLONIA.matriz, mid = m.x + m.w * .4;
  rect(m.x + m.w - 70, m.y - 90, 70, m.h + 90, '#e8e0cc', 0, '#8a8070'); gable(m.x + m.w - 74, m.y - 140, 78, 50, '#a8442a', 4); ellipse(m.x + m.w - 35, m.y - 50, 14, 16, '#3a2a1a'); ellipse(m.x + m.w - 35, m.y - 44, 8, 10, '#c8a040');
  rect(m.x + m.w - 38, m.y - 186, 6, 46, '#5a4a3a'); rect(m.x + m.w - 48, m.y - 172, 26, 5, '#5a4a3a');
  gable(m.x, m.y + 40, m.w - 80, 90, '#a8442a', 14); rect(m.x, m.y + 120, m.w - 80, m.h - 120, '#f2ede0', 0, '#8a8070');
  ctx.fillStyle = '#6a4424'; ctx.beginPath(); ctx.moveTo(mid - 30, m.y + m.h); ctx.lineTo(mid - 30, m.y + m.h - 70); ctx.arc(mid, m.y + m.h - 70, 30, Math.PI, 0); ctx.lineTo(mid + 30, m.y + m.h); ctx.closePath(); ctx.fill();
  ellipse(mid, m.y + 100, 18, 18, '#7a5ab0'); ellipse(mid, m.y + 100, 11, 11, '#e8c8f0');
}
// ---------- Colônia alemã ----------
// Enxaimel: paredes claras com a estrutura de madeira escura aparente e floreiras nas janelas.
function drawEnxaimel(h, name) {
  gable(h.x, h.y - 30, h.w, 100, '#8a3a24', 16);
  rect(h.x, h.y + 64, h.w, h.h - 64, '#f4f0e6', 0, '#3a2414');
  const beam = '#3a2414'; rect(h.x, h.y + 64, h.w, 6, beam); rect(h.x, h.y + h.h - 6, h.w, 6, beam);
  const midY = h.y + 64 + (h.h - 64) / 2; rect(h.x, midY - 3, h.w, 6, beam);
  for (let x = h.x; x <= h.x + h.w - 6; x += h.w / 5) rect(x, h.y + 64, 6, h.h - 64, beam);
  ctx.strokeStyle = beam; ctx.lineWidth = 5; for (let k = 0; k < 5; k += 2) { const x = h.x + k * h.w / 5; ctx.beginPath(); ctx.moveTo(x + 4, midY); ctx.lineTo(x + h.w / 5, h.y + 66); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 4, h.y + h.h - 4); ctx.lineTo(x + h.w / 5, midY); ctx.stroke(); }
  rect(h.x + h.w / 2 - 20, h.y + h.h - 64, 40, 64, '#6a3a20', 2, beam);
  for (const x of [h.x + 22, h.x + h.w - 66]) { windowPane(x, h.y + 84, 44, 34, beam); rect(x - 2, h.y + 118, 48, 8, '#7a4a2a'); for (let k = 0; k < 5; k++) ellipse(x + 4 + k * 10, h.y + 116, 5, 5, ['#e8304a', '#f8f0f0', '#e8304a', '#f0c040', '#e8304a'][k]); }
  if (name) signBoard(h.x + h.w / 2, h.y + h.h + 6, h.w - 30, name, 13);
}
function drawCafeColonial() {
  const c = COLONIA.cafe; drawEnxaimel(c, null);
  rect(c.x + 30, c.y + 20, c.w - 60, 28, '#f4ecd8', 3, '#3a2414'); txt('CAFÉ COLONIAL · CUCA E CHIMIA', c.x + c.w / 2, c.y + 34, 12, '#5a2a14', 'center', 'Georgia');
  for (const x of [c.x - 60, c.x + c.w + 20]) { rect(x, c.y + c.h - 30, 44, 8, '#8a5a32'); ellipse(x + 22, c.y + c.h - 36, 14, 6, '#e8c890'); rect(x + 6, c.y + c.h - 22, 4, 22, '#5a3a20'); rect(x + 34, c.y + c.h - 22, 4, 22, '#5a3a20'); }
}
// Cancha de bolão: a pista comprida coberta, com os pinos no fundo.
function drawBolao() {
  const b = COLONIA.bolao; rect(b.x, b.y + 40, b.w, b.h - 40, '#c8a870', 2, '#5a3a20'); rect(b.x + 20, b.y + 70, b.w - 60, 30, '#e8d8b0', 2, '#a88a50');
  for (let k = 0; k < 9; k++) ellipse(b.x + b.w - 30 + (k % 3) * 8 - 8, b.y + 76 + Math.floor(k / 3) * 9, 3, 5, '#f8f4ec'); ellipse(b.x + 60, b.y + 85, 9, 9, '#3a2a1a');
  rect(b.x - 10, b.y, b.w + 20, 44, '#6a3a24', 3); for (const x of [b.x, b.x + b.w / 2, b.x + b.w - 8]) rect(x, b.y + 40, 8, b.h - 40, '#4a2e18');
  signBoard(b.x + b.w / 2, b.y + 8, 220, 'CANCHA DE BOLÃO', 13);
}
// Igreja luterana: branca, com a torre fina e pontuda.
function drawLuterana() {
  const l = COLONIA.luterana, mid = l.x + l.w / 2;
  gable(l.x, l.y + 50, l.w, 80, '#4a4a4a', 12); rect(l.x, l.y + 120, l.w, l.h - 120, '#f4f2ec', 0, '#8a8a80');
  rect(mid - 28, l.y - 40, 56, 160, '#f4f2ec', 0, '#8a8a80'); poly([[mid - 32, l.y - 40], [mid, l.y - 170], [mid + 32, l.y - 40]], '#3a4a5a');
  rect(mid - 2, l.y - 200, 4, 34, '#c8a040'); ellipse(mid, l.y - 10, 12, 14, '#3a2a1a');
  rect(mid - 24, l.y + l.h - 70, 48, 70, '#5a3a20', 2); for (const x of [l.x + 24, l.x + l.w - 54]) { ctx.fillStyle = '#7a9ac8'; ctx.beginPath(); ctx.moveTo(x, l.y + 250); ctx.lineTo(x, l.y + 190); ctx.lineTo(x + 15, l.y + 172); ctx.lineTo(x + 30, l.y + 190); ctx.lineTo(x + 30, l.y + 250); ctx.closePath(); ctx.fill(); }
}
// Pavilhão da Kerb: lona listrada, bandeirinhas, mesas compridas e o barril de chope.
function drawKerb() {
  const k = COLONIA.kerb; for (let x = k.x; x < k.x + k.w; x += 38) poly([[x, k.y + 60], [x + 19, k.y], [x + 38, k.y + 60]], (x / 38) % 2 ? '#f4f0e6' : '#c83a2a');
  for (const x of [k.x + 6, k.x + k.w - 12]) rect(x, k.y + 56, 8, k.h - 56, '#5a3a20');
  rect(k.x + 30, k.y + k.h - 60, k.w - 60, 12, '#8a5a32'); rect(k.x + 30, k.y + k.h - 30, k.w - 60, 10, '#7a4a2a');
  ellipse(k.x + k.w - 40, k.y + k.h - 40, 20, 26, '#8a5a32'); rect(k.x + k.w - 60, k.y + k.h - 52, 40, 4, '#4a4a44');
  rect(k.x + 40, k.y + 66, k.w - 80, 26, '#f4ecd8', 3, '#5a3a20'); txt('KERB · CHOPE, CUCA E BANDINHA', k.x + k.w / 2, k.y + 79, 12, '#7a1a1a', 'center', 'Georgia');
  pennants(k.x, k.x + k.w, k.y + 58, ['#e8304a', '#f0c040', '#2a7a3a', '#3a6ac8']);
}
// ---------- Porto Alegre ----------
function drawFanHouse(f) {
  worldHouse(f, null, { wall: '#e0d6c4', roof: '#7a4a3a' });
  const x = f.x + f.w - 66, y = f.y + 98, gremio = f.team === 'gremio';
  if (gremio) { rect(x, y, 46, 36, '#2a6ac8'); rect(x, y + 12, 46, 6, '#1a1a1a'); rect(x, y + 20, 46, 6, '#f4f4f4'); } else { rect(x, y, 46, 36, '#d42a2a'); rect(x + 18, y + 10, 10, 10, '#f4f4f4'); }
}
function drawStadium(s, main, second, name) {
  ellipse(s.x + s.w / 2, s.y + s.h - 40, s.w / 2, 70, '#8a8a80');
  rect(s.x, s.y + 60, s.w, s.h - 60, main, 8, '#3a3a3a'); for (let x = s.x + 20; x < s.x + s.w - 10; x += 34) rect(x, s.y + 80, 18, s.h - 120, second, 2);
  ctx.fillStyle = '#e8e8e4'; ctx.beginPath(); ctx.ellipse(s.x + s.w / 2, s.y + 66, s.w / 2 + 10, 40, 0, Math.PI, 0); ctx.fill();
  rect(s.x + s.w / 2 - 110, s.y + s.h - 70, 220, 34, '#f4f4f4', 4, '#3a3a3a'); txt(name, s.x + s.w / 2, s.y + s.h - 53, 20, main, 'center', 'Arial');
}
function drawMercado() {
  const m = COLONIA.mercado; rect(m.x, m.y + 40, m.w, m.h - 40, '#e8c060', 0, '#8a6a2a');
  for (const x of [m.x, m.x + m.w - 70]) { rect(x, m.y - 20, 70, m.h + 20, '#f0cc70', 0, '#8a6a2a'); poly([[x - 4, m.y - 20], [x + 35, m.y - 60], [x + 74, m.y - 20]], '#a8442a'); }
  for (let x = m.x + 90; x < m.x + m.w - 90; x += 56) { ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.moveTo(x, m.y + m.h); ctx.lineTo(x, m.y + 120); ctx.arc(x + 20, m.y + 120, 20, Math.PI, 0); ctx.lineTo(x + 40, m.y + m.h); ctx.closePath(); ctx.fill(); }
  rect(m.x + m.w / 2 - 110, m.y + 54, 220, 30, '#f8f0d8', 3, '#8a6a2a'); txt('MERCADO PÚBLICO', m.x + m.w / 2, m.y + 69, 15, '#6a3a1a', 'center', 'Georgia');
}
function drawUsina() {
  const u = COLONIA.usina; rect(u.x, u.y + 40, u.w, u.h - 40, '#b86a4a', 0, '#5a3a2a'); for (let y = u.y + 52; y < u.y + u.h; y += 12) rect(u.x + 2, y, u.w - 4, 1, 'rgba(80,30,20,.35)');
  for (let x = u.x + 30; x < u.x + u.w - 30; x += 60) windowPane(x, u.y + 80, 40, 60, '#5a3a2a');
  rect(u.x + u.w - 60, u.y - 220, 40, 260, '#a85a3a', 0, '#5a3a2a'); rect(u.x + u.w - 66, u.y - 228, 52, 14, '#8a4a2a');
  signBoard(u.x + u.w / 2 - 30, u.y + 46, 200, 'USINA DO GASÔMETRO', 12);
}
// O Laçador: o gaúcho pilchado com o laço, no pedestal.
function drawLacador() {
  const l = COLONIA.lacador, cx = l.x + l.w / 2;
  rect(l.x - 20, l.y + 20, l.w + 40, l.h - 20, '#c8c0b0', 2, '#8a8070'); rect(l.x - 10, l.y, l.w + 20, 26, '#d8d0c0', 2, '#8a8070');
  const b = '#6a5a3a'; rect(cx - 8, l.y - 70, 16, 70, b); rect(cx - 16, l.y - 110, 32, 44, b); ellipse(cx, l.y - 120, 11, 12, b); rect(cx - 22, l.y - 132, 44, 6, b); rect(cx - 12, l.y - 142, 24, 12, b);
  rect(cx + 14, l.y - 104, 30, 6, b); ctx.strokeStyle = b; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx + 50, l.y - 90, 12, 18, 0, 0, Math.PI * 2); ctx.stroke(); rect(cx - 30, l.y - 100, 14, 40, b);
}
