// Mundo aberto: a Fronteira (mapa 1, onde fica a bodega) e as regiões em volta, mapa por mapa.
// Fronteira: plantação, fogo de chão do costelão, bodega, cancha e potreiro na estrada de cima; agropecuária e loja do
// campo no meio; o rio Uruguai na lateral esquerda e embaixo, onde fica a fronteira com o Uruguai.
// Seguindo a estrada para a direita, a Serra Gaúcha (mapa 2); subindo nela, Santa Catarina (mapa 3) · open-world-regions.js.
'use strict';

const WORLD_MAPS = {};
let worldOut = null, worldTufts = {};
function worldTestOn() { return true; }
function worldMap() { return WORLD_MAPS[worldOut?.map || 'vila']; }
function worldCanWalk(x, y) { return worldMap().canWalk(x, y); }
function worldNearest() { const p = worldOut; if (!p) return null; let best = null, bd = 90; for (const s of [...walkerSpots(), ...worldMap().spots()]) { const d = Math.hypot(s.x - p.x, s.y - p.y); if (d < bd) { bd = d; best = s; } } return best; }
const front = (r, dy = 30) => ({ x: r.x + r.w / 2, y: r.y + r.h + dy });
const hitRect = (rects, x, y) => rects.some(r => x + 12 > r.x && x - 12 < r.x + r.w && y > r.y && y - 10 < r.y + r.h);

// ---------- Entrar, sair e trocar de mapa ----------
// Porta da bodega: escolhe entre sair para o pátio e abrir/fechar o dia.
function doorMenu() {
  openDialog('Porta da bodega', `<p>O que fazer na porta?</p><div class="game-menu"><button class="primary" data-act="goOutside">Sair para o pátio</button><button data-act="doorPhase">${shopDoorLabel()}</button></div>`, 'doorMenu');
}
function goOutside(at) {
  closeDialog(true); if (phoneOpen) togglePhone(false); keys.clear();
  worldOut = { map: 'vila', ...(at || front(VILA.bodega, 70)), dx: 0, dy: 1, walk: false }; worldAway = { lost: G.stats.lost || 0 };
  AudioEngine.doorChime(); if (!at) worldBanner('Pátio da bodega', 'Pela estrada à direita, a Serra Gaúcha; descendo, a fronteira com o Uruguai.'); refreshHUD();
}
function goInside() {
  worldOut = null; showRpgBox('worldTalk', null); keys.clear(); G.player = { x: ENTRY.x, y: ENTRY.y - 40, dx: 0, dy: -1, walk: false }; AudioEngine.doorChime(); refreshHUD();
  // O que aconteceu na bodega enquanto o peão estava fora vira um resumo só na volta.
  const lost = (G.stats.lost || 0) - (worldAway?.lost ?? G.stats.lost ?? 0); worldAway = null;
  if (lost > 0) say('Enquanto você estava fora, ' + lost + (lost > 1 ? ' fregueses foram embora' : ' freguês foi embora') + ' sem atendimento.');
  // Presentes que chegaram enquanto o peão estava fora são entregues quando ele volta.
  if (G.phase === 'closed' && G.giftQueue?.length && !G.challengeVisit) startGiftVisit();
}
// Cancha: o botão da cancha leva para o pátio, na frente dela.
function canchaToPatio() { leaveCancha(true); goOutside(front(VILA.cancha, 40)); }
// Botão na tela dentro da cancha: a única opção é sair para o pátio.
function canchaExit() { if (worldOut?.map !== 'cancha') return; switchMap({ map: 'vila', ...front(VILA.cancha, 40), title: 'Pátio da bodega', text: '' }); refreshHUD(); }
function switchMap(to) {
  worldOut.map = to.map; worldOut.x = to.x; worldOut.y = to.y; worldOut.fired = {}; keys.clear(); showRpgBox('worldTalk', null);
  if (WORLD_MAPS[to.map]?.indoor) AudioEngine.doorChime(); else AudioEngine.swoosh(.04);
  if (to.title) worldBanner(to.title, to.text || ''); WORLD_MAPS[to.map]?.onEnter?.();
}
// Entra numa casa (ou na igreja, no salão): guarda onde estava lá fora para sair pela mesma porta.
function enterInterior(id) { const M = WORLD_MAPS[id]; if (!M) return false; worldOut.back = { map: worldOut.map, x: worldOut.x, y: worldOut.y + 6 }; switchMap({ map: id, ...M.spawn(), title: M.name }); worldOut.dy = -1; return true; }

// ---------- Avisos: os da bodega ficam na bodega ----------
// Fora da bodega, say() e showBanner() da bodega ficam em silêncio; o mundo aberto usa worldSay/worldBanner.
let worldAway = null;
function bodegaNoticeMuted(opts) { return !!worldOut && !opts?.world; }
function worldSay(text) { say(text, { world: true }); }
function worldBanner(title, text) { showBanner(title, text, 'info', { world: true }); }

// ---------- Gente na estrada ----------
// Cada mapa tem seus moradores, que andam pelas ruas quando não estão na bodega. E puxa uma prosa.
let worldWalkers = [], worldWalkersKey = '';
function walkerPos(w) { const a = w.line[w.seg], b = w.line[w.seg + 1]; return { a, b }; }
function spawnWalkers(M) {
  worldWalkersKey = M.id + ':' + G.day; worldWalkers = [];
  const free = (M.residents || []).map(id => PEOPLE.findIndex(p => p.id === id)).filter(i => i >= 0 && !activeUniqueVisitors().has(i) && walkingToday(i));
  for (const i of free.slice(0, 4)) {
    const line = pick(M.walkLines), seg = Math.floor(Math.random() * (line.length - 1)), k = Math.random(), a = line[seg], b = line[seg + 1];
    worldWalkers.push({ person: i, line, seg, dir: 1, x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, wait: Math.random() * 3, dx: 1, walk: false });
  }
}
function walkersTick(dt) {
  const M = worldMap(); if (!M.walkLines) { worldWalkers = []; worldWalkersKey = ''; return; }
  if (worldWalkersKey !== M.id + ':' + G.day) spawnWalkers(M);
  worldWalkers = worldWalkers.filter(w => !activeUniqueVisitors().has(w.person));
  for (const w of worldWalkers) {
    const near = Math.hypot(w.x - worldOut.x, w.y - worldOut.y) < 120 && worldTalkOpen();
    if (w.wait > 0 || near) { w.wait = Math.max(0, w.wait - dt); w.walk = false; if (near) w.dx = worldOut.x > w.x ? 1 : -1; continue; }
    const target = w.line[w.seg + (w.dir > 0 ? 1 : 0)], d = Math.hypot(target[0] - w.x, target[1] - w.y), step = 70 * dt;
    if (d <= step) { w.x = target[0]; w.y = target[1]; w.seg += w.dir; if (w.seg < 0 || w.seg >= w.line.length - 1) { w.dir = -w.dir; w.seg = clamp(w.seg, 0, w.line.length - 2); } if (Math.random() < .4) w.wait = 1 + Math.random() * 3; w.walk = false; continue; }
    w.dx = target[0] > w.x ? 1 : target[0] < w.x ? -1 : w.dx; w.x += (target[0] - w.x) / d * step; w.y += (target[1] - w.y) / d * step; w.walk = true;
  }
}
function walkerSpots() { return worldWalkers.map(w => ({ id: 'walker:' + w.person, x: w.x, y: w.y, label: 'Prosear com ' + PEOPLE[w.person].name, act: () => worldTalk(w) })); }

// Prosa na estrada: primeiro a fala do Sadi, depois a resposta. Até 3 por dia com cada um; cada uma aumenta a amizade.
const WORLD_TALKS_PER_DAY = 3;
let worldTalkAt = null;
function worldTalkOpen() { return !$('worldTalkUI')?.classList.contains('hidden'); }
// Monumentos e lugares históricos: explicação em forma de diálogo, com a lâmpada no lugar do retrato.
function showInfo(title, text) { worldTalkAt = { x: worldOut.x, y: worldOut.y }; showRpgBox('worldTalk', { portrait: '<div class="lamp-portrait" aria-hidden="true">💡</div>', name: 'Você sabia? · ' + title, reply: text }); AudioEngine.tick(); }
// Espaço pula a conversa inteira.
function skipWorldTalk() { showRpgBox('worldTalk', null); }
function worldTalk(w) {
  const i = w.person, id = PEOPLE[i].id, name = PEOPLE[i].name;
  if (G.worldTalks?.day !== G.day) G.worldTalks = { day: G.day, count: {} };
  const home = worldMap().indoor && WORLD_HOME_TALK[id], n = G.worldTalks.count[id] || 0, lines = home || WORLD_TALK[id] || [];
  w.wait = 4; w.dx = worldOut.x > w.x ? 1 : -1; worldTalkAt = { x: w.x, y: w.y };
  if (n >= WORLD_TALKS_PER_DAY || !lines.length) { showRpgBox('worldTalk', { person: i, name, reply: pick(WORLD_TALK_TIRED) }); return; }
  G.worldTalks.count[id] = n + 1;
  const line = lines[(n + G.day * 2) % lines.length];
  showRpgBox('worldTalk', { person: i, name, player: line.player, reply: line.reply });
  addFriendship(i, 2); effect('♥ amizade', w.x, w.y - 160, '#ffb3c8'); AudioEngine.tick(); save();
}
function worldTalkNext() { if (!rpgAdvance('worldTalk')) showRpgBox('worldTalk', null); }

function outsideTick(dt) {
  const p = worldOut; walkersTick(dt);
  if (worldTalkOpen() && worldTalkAt && Math.hypot(worldTalkAt.x - p.x, worldTalkAt.y - p.y) > 240) showRpgBox('worldTalk', null);
  let dx = (keys.has('d') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('a') || keys.has('ArrowLeft') ? 1 : 0), dy = (keys.has('s') || keys.has('ArrowDown') ? 1 : 0) - (keys.has('w') || keys.has('ArrowUp') ? 1 : 0);
  const len = Math.hypot(dx, dy); p.walk = !!len; if (!len) return;
  dx /= len; dy /= len; p.dx = dx; p.dy = dy; const step = BASE_SPEED * 1.4 * (1 + movementBonus()) * dt;
  for (let n = 0; n < 4; n++) { const x = p.x + dx * step / 4, y = p.y + dy * step / 4; if (worldCanWalk(x, p.y)) p.x = x; if (worldCanWalk(p.x, y)) p.y = y; }
  const to = worldMap().edge?.(p); if (to) { switchMap(to); return; }
  worldMap().tick?.(p);
}
function outsideInteract() {
  if (worldTalkOpen()) { worldTalkNext(); return; }
  const s = worldNearest(); if (!s) { effect('Chegue mais perto', worldOut.x, worldOut.y - 52); return; }
  if (s.act) s.act(); else if (s.house) houseVisit(s.house); else if (s.info) showInfo(s.label, s.text); else worldSay(s.text);
}
// A casa só se revela de perto; o morador, se não estiver na bodega, anda pela estrada.
function houseVisit(id) { if (enterInterior('casa:' + id)) return; const i = PEOPLE.findIndex(p => p.id === id); if (i < 0) return; worldSay(activeUniqueVisitors().has(i) ? PEOPLE[i].name + ' não está em casa: tá lá na bodega.' : worldWalkers.some(w => w.person === i) ? PEOPLE[i].name + ' não está em casa: deve estar andando pela estrada.' : 'Casa de ' + PEOPLE[i].name + ': ninguém atendeu. Em breve dá pra bater na porta e levar presente.'); }
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
  for (const w of worldWalkers) if (seen(w.x, w.y)) layers.push({ y: w.y, draw: () => personDraw(PEOPLE[w.person].sprite, w.x, w.y, w.walk, false, w.dx) });
  layers.push({ y: worldOut.y, draw: () => personDraw(avatarSprite(), worldOut.x, worldOut.y, worldOut.walk, true, worldOut.dx) });
  layers.sort((a, b) => a.y - b.y).forEach(l => l.draw());
  const night = G.phase === 'closed' ? .5 : G.phase === 'open' ? clamp((G.elapsed / DAY - .7) * 1.2, 0, .35) : 0;
  if (night && !M.indoor) {
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
// Araucária, ipê-amarelo, jacarandá e árvore comum.
function drawWorldTree(x, y, kind) {
  ellipse(x, y + 4, 40, 10, '#1c140c44');
  if (kind === 'a') { rect(x - 6, y - 140, 12, 144, '#5a3a20'); for (const [dy, w] of [[-140, 74], [-170, 56], [-196, 38]]) { ctx.fillStyle = '#2f5a2a'; ctx.beginPath(); ctx.ellipse(x, y + dy, w, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#3f7a36'; ctx.beginPath(); ctx.ellipse(x, y + dy - 5, w * .8, 9, 0, 0, Math.PI * 2); ctx.fill(); } return; }
  rect(x - 5, y - 70, 10, 74, '#5a3a20'); const col = kind === 'ipe' ? ['#e8b820', '#f6d64a'] : kind === 'jaca' ? ['#7a5ab0', '#9a7ad0'] : ['#3f7a36', '#5a9a46'];
  ellipse(x, y - 92, 52, 40, col[0]); ellipse(x - 18, y - 104, 26, 20, col[1]); ellipse(x + 20, y - 86, 24, 18, col[1]);
}

// =================== MAPA 1 · FRONTEIRA (onde fica a bodega) ===================
// Bodega, cancha de bocha, o Armazém Querência (produtos para agricultura) e a Casa do Campeiro (produtos para pecuária),
// as ruínas das Missões e um pouso de tropeiros.
// Moram aqui o Valter, o Mano Lima, o Baitaca e o Guri, este na beira da fronteira com o Uruguai.
const VILA = {
  W: 3600, H: 2700, river: 540, border: 2380, roadY: 690, roadH: 90, roadX: 1580,
  horta: { x: 600, y: 260, w: 250, h: 280 }, fogo: { x: 870, y: 250, w: 400, h: 330 }, bodega: { x: 1300, y: 180, w: 640, h: 420 },
  cancha: { x: 2060, y: 240, w: 460, h: 360 }, potreiro: { x: 2640, y: 200, w: 860, h: 380 },
  agro: { x: 1720, y: 1080, w: 440, h: 260 }, gado: { x: 2380, y: 1080, w: 440, h: 260 },
  houses: [{ id: 'valter', x: 700, y: 1150, w: 260, h: 190, wall: '#c9b58a', roof: '#9a4a32' }, { id: 'manolima', x: 900, y: 1700, w: 270, h: 190, wall: '#d8c9a2', roof: '#7a3a2a' },
    { id: 'baitaca', x: 2700, y: 1700, w: 260, h: 190, wall: '#efe6d2', roof: '#b89a58' }, { id: 'guri', x: 1900, y: 2110, w: 250, h: 190, wall: '#e6d2a8', roof: '#5a4a3a' }],
  marco: { x: 1500, y: 2250, w: 40, h: 60 },
  missoes: { x: 2940, y: 980, w: 440, h: 300 }, pouso: { x: 2160, y: 1620, w: 340, h: 190 }, estacao: { x: 1720, y: 870, w: 260, h: 130 }
};
VILA.rail = VILA.roadY + 132;   // mesma distância da estrada que o trilho da Serra: os dois se encontram na divisa
const VILA_TREES = [[600, 1000, 'a'], [1210, 960, 'a'], [3480, 1150, 'a'], [600, 1760, 'a'], [3450, 1700, 'a'], [2500, 2200, 'a'], [1100, 2230, 'a'], [3100, 1250, 'a'], [1400, 1250, 'ipe'], [2600, 1560, 'jaca']];
const VILA_ROADS = [[VILA.river, VILA.roadY, VILA.W - VILA.river, VILA.roadH], [VILA.roadX, VILA.roadY, 80, VILA.border - VILA.roadY], [VILA.river, 1440, 3400 - VILA.river, 60]];

WORLD_MAPS.vila = {
  id: 'vila', name: 'Fronteira', W: VILA.W, H: VILA.H,
  residents: ['valter', 'manolima', 'baitaca', 'guri'],
  walkLines: [[[620, 735], [1620, 735], [2600, 735], [3500, 735]], [[1620, 800], [1620, 1470], [1620, 2300]], [[620, 1470], [1620, 1470], [2700, 1470], [3500, 1470]]],
  obstacles() { const V = VILA; return [V.bodega, V.cancha, V.horta, { x: V.fogo.x + 50, y: V.fogo.y + 80, w: V.fogo.w - 100, h: V.fogo.h - 150 }, V.potreiro, V.agro, V.gado, V.marco, { x: V.missoes.x, y: V.missoes.y + 60, w: V.missoes.w, h: V.missoes.h - 60 }, V.pouso, V.estacao, ...V.houses]; },
  canWalk(x, y) {
    if (y < 130 || x > VILA.W + 20) return false;
    if (y > VILA.border - 20) return false;                          // rio Uruguai embaixo: fronteira com o Uruguai
    const pier = x >= 250 && y >= 890 && y <= 945;
    if (x < VILA.river - 20 && !pier) return false;
    if (x > VILA.W - 40 && (y < VILA.roadY || y > VILA.roadY + VILA.roadH)) return false;   // a divisa com a Serra é pela estrada
    return !hitRect(this.obstacles(), x, y);
  },
  // Seguindo a estrada para a direita, passa sozinho para o mapa 2 (Serra Gaúcha).
  edge(p) { if (p.x > VILA.W - 20) return { map: 'serra', x: 70, y: SERRA.roadY + SERRA.roadH / 2, title: 'Serra Gaúcha', text: 'Vinhedos, a Maria Fumaça e a comunidade. Subindo, Santa Catarina.' }; return null; },
  spots() {
    const V = VILA, herd = G.herd || 0;
    return [
      { id: 'door', ...front(V.bodega), label: 'Entrar na bodega', act: goInside },
      { id: 'cancha', ...front(V.cancha), label: 'Entrar na cancha de bocha', act: () => { const was = worldOut; worldOut = null; enterCancha(true); if (!worldOut) worldOut = was; } },
      { id: 'horta', ...front(V.horta), label: G.up.bergamota ? 'Horta e pomar de bergamota' : 'Horta e pomar', text: G.up.bergamota ? 'Pomar de bergamota: é dele que sai a bergamota vendida no balcão. Em breve dá para colher na mão.' : 'Horta e pomar da bodega: em breve dá para plantar, regar e colher. As sementes vêm da agropecuária.' },
      { id: 'fogo', ...front(V.fogo), label: isCampo() ? 'Voltar ao costelão' : 'Fogo de chão do costelão', act: () => { if (isCampo()) goInside(); else worldSay('Fogo de chão: é aqui que sai o costelão de domingo. A carne vem do potreiro, laçada no sábado.'); } },
      { id: 'potreiro', ...front(V.potreiro), label: 'Potreiro · ' + herd + (herd === 1 ? ' boi' : ' bois'), act: () => { if (lassoNeeded()) { goInside(); lassoIntro(); return; } worldSay('Potreiro: ' + herd + (herd === 1 ? ' boi pastando.' : ' bois pastando.') + ' Sábado à noite é dia de laçar para o costelão. Bois novos se compram na Casa do Campeiro.'); } },
      { id: 'agro', ...front(V.agro), label: 'Armazém Querência · produtos para agricultura', text: 'Armazém Querência: sementes, mudas, adubo e ferramentas para a horta. Em breve, a horta da bodega começa por aqui.' },
      { id: 'gado', ...front(V.gado), label: 'Casa do Campeiro · produtos para pecuária', act: campoShop },
      { id: 'missoes', x: V.missoes.x + V.missoes.w / 2, y: V.missoes.y + V.missoes.h + 26, label: 'Ruínas das Missões', info: true, text: 'Missões: entre os séculos XVII e XVIII, padres jesuítas e indígenas guaranis ergueram os Sete Povos das Missões no noroeste do Rio Grande. As ruínas de São Miguel Arcanjo são Patrimônio Mundial da UNESCO.' },
      { id: 'pouso', ...front(V.pouso, 24), label: 'Pouso de tropeiros', info: true, text: 'Tropeirismo: nos séculos XVIII e XIX, os tropeiros levavam tropas de mulas e gado do Rio Grande até Sorocaba, em São Paulo. Nos pousos a tropa descansava; pelo caminho nasceram vilas e se espalharam o charque e o chimarrão.' },
      { id: 'river', x: 470, y: 917, label: 'Trapiche do rio Uruguai', text: 'Rio Uruguai: em breve, pescaria de dourado e jundiá no trapiche.' },
      { id: 'marco', x: V.marco.x + 20, y: V.marco.y - 20, label: 'Marco da fronteira', info: true, text: 'Fronteira gaúcha: o Rio Grande divide rios, coxilhas e até cidades com o Uruguai. Em Santana do Livramento e Rivera, basta atravessar uma rua para mudar de país.' },
      { id: 'estacao', ...front(V.estacao), label: 'Estação da Fronteira', info: true, text: 'Ferrovia: os trilhos levavam gado, charque e passageiros da fronteira até a Serra e a capital. Daqui o trem segue junto da estrada, rumo à Serra Gaúcha.' },
      ...V.houses.map(h => ({ id: 'house:' + h.id, ...front(h), label: 'Casa de ' + (PEOPLE.find(p => p.id === h.id)?.name || h.id), house: h.id }))
    ];
  },
  lights() { const V = VILA; return [[V.bodega.x + 100, V.bodega.y + 210], [V.bodega.x + 240, V.bodega.y + 210], [V.bodega.x + V.bodega.w - 220, V.bodega.y + 210], [V.bodega.x + V.bodega.w - 80, V.bodega.y + 210], [V.agro.x + 90, V.agro.y + 150], [V.gado.x + 90, V.gado.y + 150], ...V.houses.map(h => [h.x + 50, h.y + 116])]; },
  draw(view, seen, layers) {
    const V = VILA;
    grassField(this, view, seen, '#6f9a45', ['#5f8a3a', '#86ad55'], V.river);
    for (const r of VILA_ROADS) road(...r);
    drawVilaRiver();
    const add = (r, fn) => { if (seen(r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h))) layers.push({ y: r.y + r.h, draw: fn }); };
    add(V.bodega, drawWorldBodega); add(V.cancha, drawWorldCancha); add(V.horta, drawWorldHorta); add(V.fogo, drawWorldFogo); add(V.marco, drawWorldMarco);
    add(V.agro, () => drawWorldShop(V.agro, 'ARMAZÉM QUERÊNCIA', 'produtos para agricultura', '#4a7a3a', '#e8e0c8', ['semente', 'regador', 'enxada']));
    add(V.gado, () => drawWorldShop(V.gado, 'CASA DO CAMPEIRO', 'produtos para pecuária', '#8a3a24', '#e8d8b8', ['sal', 'racao', 'arreio']));
    add({ ...V.missoes, h: V.missoes.h + 20 }, drawMissoes); add(V.pouso, drawPouso);
    drawRail(1690, V.W, V.rail); rect(1676, V.rail - 14, 16, 40, '#a83a24', 3);   // fim de linha na estação
    add(V.estacao, () => { const s = V.estacao; gable(s.x, s.y + 10, s.w, 50, '#7a3a24', 16); rect(s.x, s.y + 56, s.w, s.h - 56, '#f0d8a8', 0, '#6a5a3a'); for (const x of [s.x + 20, s.x + s.w - 70]) windowPane(x, s.y + 74, 50, 40); rect(s.x + s.w / 2 - 20, s.y + s.h - 56, 40, 56, '#6a4424'); signBoard(s.x + s.w / 2, s.y + 20, 200, 'ESTAÇÃO DA FRONTEIRA', 12); });
    layers.push({ y: V.rail + 20, draw: () => { ctx.save(); ctx.beginPath(); ctx.rect(1690, 0, V.W, V.H); ctx.clip(); drawTrain(trainX(1690, V.W, 120, 300), V.rail + 10); ctx.restore(); } });
    drawWorldPotreiro(layers, seen);
    for (const h of V.houses) add(h, () => worldHouse(h, null, h));
    for (const [x, y, kind] of VILA_TREES) if (seen(x, y)) layers.push({ y, draw: () => drawWorldTree(x, y, kind) });
    if (seen(V.W - 120, V.roadY)) layers.push({ y: V.roadY - 10, draw: () => { rect(V.W - 130, V.roadY - 66, 8, 66, '#5a3a20'); poly([[V.W - 250, V.roadY - 66], [V.W - 70, V.roadY - 66], [V.W - 40, V.roadY - 44], [V.W - 70, V.roadY - 22], [V.W - 250, V.roadY - 22]], '#e8d6a8'); txt('SERRA GAÚCHA →', V.W - 150, V.roadY - 44, 13, '#5a2a14', 'center', 'Georgia'); } });
  }
};
// Ruínas das Missões: a fachada de pedra vermelha de São Miguel Arcanjo, com os arcos e a torre.
function drawMissoes() {
  const m = VILA.missoes, base = m.y + m.h, stone = '#b8684a', dark = '#8a4a34';
  ellipse(m.x + m.w / 2, base - 6, m.w / 2 + 20, 24, '#9a8a6a');
  rect(m.x + 20, m.y + 90, m.w - 140, m.h - 90, stone, 0, dark); poly([[m.x + 20, m.y + 90], [m.x + 150, m.y + 20], [m.x + 230, m.y + 60], [m.x + m.w - 120, m.y + 90]], stone);
  for (let k = 0; k < 4; k++) { const x = m.x + 44 + k * 66; ctx.fillStyle = '#5a7a4a'; ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x, m.y + 170); ctx.arc(x + 22, m.y + 170, 22, Math.PI, 0); ctx.lineTo(x + 44, base); ctx.closePath(); ctx.fill(); }
  for (let y = m.y + 100; y < base; y += 18) for (let x = m.x + 24 + ((y / 18) % 2) * 14; x < m.x + m.w - 124; x += 28) rect(x, y, 24, 2, 'rgba(90,40,24,.35)');
  rect(m.x + m.w - 110, m.y - 10, 90, m.h + 10, stone, 0, dark); rect(m.x + m.w - 92, m.y + 20, 54, 70, '#5a7a4a'); poly([[m.x + m.w - 110, m.y - 10], [m.x + m.w - 70, m.y - 40], [m.x + m.w - 20, m.y - 10]], dark);
  for (const [dx, dy] of [[30, 40], [180, 70], [300, 110]]) ellipse(m.x + dx, m.y + dy, 18, 10, '#5a8a3a');
  signBoard(m.x + m.w / 2, base + 4, 200, 'RUÍNAS DAS MISSÕES', 12);
}
// Pouso de tropeiros: mangueira de pedra, cocho, a cruz do caminho e as mulas descansando.
function drawPouso() {
  const p = VILA.pouso;
  for (let x = p.x; x < p.x + p.w; x += 22) { ellipse(x + 10, p.y + 12, 13, 10, '#9a9488'); ellipse(x + 10, p.y + p.h - 10, 13, 10, '#9a9488'); }
  for (let y = p.y; y < p.y + p.h; y += 20) { ellipse(p.x + 8, y + 10, 11, 10, '#8e887e'); if (y < p.y + p.h / 2 - 30 || y > p.y + p.h / 2 + 20) ellipse(p.x + p.w - 8, y + 10, 11, 10, '#8e887e'); }
  rect(p.x + 40, p.y + 60, 90, 22, '#7a5a34', 4); rect(p.x + 44, p.y + 64, 82, 10, '#5aa0c0', 3);
  for (const [dx, dy] of [[170, 70], [240, 120]]) { const x = p.x + dx, y = p.y + dy; ellipse(x, y + 4, 30, 7, '#1c140c44'); rect(x - 24, y - 34, 48, 26, '#6a4a34', 10); rect(x + 18, y - 48, 14, 24, '#6a4a34', 6); rect(x + 20, y - 62, 4, 16, '#5a3a24'); rect(x + 26, y - 62, 4, 16, '#5a3a24'); for (const lx of [x - 18, x - 8, x + 8, x + 18]) rect(lx, y - 10, 5, 14, '#4a3424'); }
  rect(p.x + p.w + 20, p.y + 20, 6, 70, '#5a3a20'); rect(p.x + p.w + 6, p.y + 36, 34, 6, '#5a3a20');
  signBoard(p.x + p.w / 2, p.y + p.h + 4, 190, 'POUSO DE TROPEIROS', 12);
}

// Loja de campanha: fachada de tábuas, toldo e mercadoria na calçada.
function drawWorldShop(s, name, sub, awning, wall, goods) {
  gable(s.x, s.y - 10, s.w, 80, '#6a5a4a', 16);
  rect(s.x, s.y + 64, s.w, s.h - 64, wall, 0, '#5a4a32'); for (let x = s.x + 14; x < s.x + s.w; x += 24) rect(x, s.y + 66, 2, s.h - 68, 'rgba(90,70,40,.25)');
  rect(s.x + 20, s.y + 74, s.w - 40, 34, '#f4ecd8', 4, '#5a3a20'); txt(name, s.x + s.w / 2, s.y + 91, 16, '#5a2a14', 'center', 'Georgia');
  for (let k = 0; k < 8; k++) poly([[s.x + 10 + k * (s.w - 20) / 8, s.y + 116], [s.x + 10 + (k + 1) * (s.w - 20) / 8, s.y + 116], [s.x + 10 + (k + .5) * (s.w - 20) / 8, s.y + 140]], k % 2 ? awning : '#f4f0e6');
  for (const x of [s.x + 30, s.x + s.w - 110]) windowPane(x, s.y + 150, 80, 56);
  rect(s.x + s.w / 2 - 30, s.y + s.h - 80, 60, 80, '#5a3a20', 2, '#2a1a0e');
  txt(sub, s.x + s.w / 2, s.y + s.h + 14, 12, '#3a2a1a', 'center', 'Arial');
  goods.forEach((g, i) => { const x = s.x + 30 + i * 52, y = s.y + s.h - 10; if (g === 'semente' || g === 'racao' || g === 'sal') { rect(x - 16, y - 34, 32, 36, g === 'sal' ? '#f0ece0' : g === 'racao' ? '#c8a060' : '#d8c890', 6, '#8a7a5a'); } else if (g === 'regador') { ellipse(x, y - 14, 14, 12, '#5a8ac0'); rect(x + 10, y - 26, 16, 4, '#5a8ac0'); } else if (g === 'enxada') { rect(x - 2, y - 50, 4, 52, '#8a5a32'); rect(x - 12, y - 52, 24, 8, '#7a7a80'); } else if (g === 'arreio') { ctx.strokeStyle = '#6a3a1a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y - 24, 14, 18, 0, 0, Math.PI * 2); ctx.stroke(); } });
}
// Casa do Campeiro (produtos para pecuária): aqui se compra boi para a laçada de sábado.
function campoShop() {
  openDialog('Casa do Campeiro', `<p>Produtos para pecuária: sal mineral, ração, arreios e gado. Rebanho no potreiro: <b>${G.herd || 0}</b>.</p><div class="game-menu"><button class="primary" data-act="buyBoiShop">Comprar um boi · ${money(BOI_COST)}</button><button data-act="close">Só olhando</button></div>`, 'campoShop');
}

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
