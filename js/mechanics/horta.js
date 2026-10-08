// Horta da bodega, na Fronteira: quatro canteiros (alface e trigo) e duas covas para árvore (bergamoteira e araucária).
// Sementes, mudas e adubo vêm do Armazém Querência. Cada planta precisa ser regada uma vez por dia: só cresce no dia
// em que foi regada, e canteiro que passa dois dias sem água seca. O adubo faz crescer o dobro até a colheita.
// A colheita entra direto no estoque da bodega: alface vira salada, trigo vira pão do xis, e as árvores dão
// bergamota e pinhão de tempos em tempos.
'use strict';

const CROPS = {
  alface: { name: 'Alface', seed: 'Semente de alface', seedCost: 2, kind: 'bed', days: 2, good: 'salada', yield: 6 },
  trigo: { name: 'Trigo', seed: 'Semente de trigo', seedCost: 2, kind: 'bed', days: 3, good: 'pao_xis', yield: 8 },
  bergamota: { name: 'Bergamoteira', seed: 'Muda de bergamoteira', seedCost: 18, kind: 'tree', days: 5, every: 2, good: 'bergamota', yield: 3000 },
  araucaria: { name: 'Araucária', seed: 'Muda de araucária', seedCost: 24, kind: 'tree', days: 6, every: 3, good: 'pinhao', yield: 2000 }
};
const ADUBO_COST = 5;
// Canteiros e covas dentro da horta (a horta é de andar por dentro).
const HORTA_PLOTS = [
  { kind: 'bed', x: 612, y: 296, w: 130, h: 34 }, { kind: 'bed', x: 612, y: 356, w: 130, h: 34 },
  { kind: 'bed', x: 612, y: 416, w: 130, h: 34 }, { kind: 'bed', x: 612, y: 476, w: 130, h: 34 },
  { kind: 'tree', x: 772, y: 300, w: 56, h: 40 }, { kind: 'tree', x: 772, y: 440, w: 56, h: 40 }
];
function hortaState(g = G) {
  g.horta ??= { plots: HORTA_PLOTS.map(() => ({ crop: null })), seeds: { alface: 0, trigo: 0, bergamota: 0, araucaria: 0, adubo: 0 } };
  return g.horta;
}
function plotReady(p) { return !!p.crop && p.growth >= CROPS[p.crop].days; }
function plotThirsty(p) { return !!p.crop && !plotReady(p) && p.water !== G.day; }

// Virada do dia: quem foi regado ontem cresce; canteiro sem água por dois dias seca.
function hortaNewDay(prevDay) {
  for (const p of hortaState().plots) {
    if (!p.crop || plotReady(p)) continue;
    const c = CROPS[p.crop];
    if (p.water === prevDay) { p.growth = Math.min(c.days, p.growth + (p.fert ? 2 : 1)); p.dry = 0; }
    else if (c.kind === 'bed' && ++p.dry >= 2) { p.dead = c.name; p.crop = null; }
  }
}

// ---------- Ações ----------
function hortaDo(arg) {
  const [what, a, b] = String(arg).split(':'), st = hortaState(), i = Number(a), p = st.plots[i];
  if (what === 'seed') { hortaBuySeed(a); return; }
  if (!p) return;
  if (what === 'plant') {
    const c = CROPS[b]; if (!c || st.seeds[b] <= 0 || p.crop) return;
    if (c.kind !== HORTA_PLOTS[i].kind) return;
    st.seeds[b]--; Object.assign(p, { crop: b, growth: 0, water: null, fert: false, dry: 0, dead: null });
    AudioEngine.tick(); worldSay(c.name + ' plantad' + (c.kind === 'tree' ? 'a' : 'o') + '. Regue uma vez por dia.');
  } else if (what === 'water') {
    if (!p.crop || p.water === G.day) return;
    p.water = G.day; AudioEngine.gulp(); fxPuffs(HORTA_PLOTS[i].x + HORTA_PLOTS[i].w / 2, HORTA_PLOTS[i].y + 10, 5, 40, '#7ab8e0'); worldSay(CROPS[p.crop].name + ' regad' + (CROPS[p.crop].kind === 'tree' ? 'a' : 'o') + ' hoje.');
  } else if (what === 'fert') {
    if (!p.crop || p.fert || st.seeds.adubo <= 0 || plotReady(p)) return;
    st.seeds.adubo--; p.fert = true; AudioEngine.tick(); worldSay('Adubado: cresce o dobro até a colheita.');
  } else if (what === 'harvest') { hortaHarvest(i); }
  else if (what === 'clear') { Object.assign(p, { crop: null, dead: null }); worldSay('Canteiro limpo.'); }
  save(); if (modal === 'horta') plotMenu(i);
}
function hortaHarvest(i) {
  const p = hortaState().plots[i]; if (!plotReady(p)) return;
  const c = CROPS[p.crop], k = c.good;
  if (!unlocked(k)) { worldSay('Para vender ' + nameOf(k) + ', libere a melhoria no celular. A colheita espera no pé.'); AudioEngine.bad(); return; }
  const room = Math.max(0, stationCapacity(k) - G.stock[k]), qty = Math.min(c.yield, room);
  if (qty <= 0) { worldSay('O estoque de ' + nameOf(k) + ' está cheio. A colheita espera no pé.'); AudioEngine.bad(); return; }
  const units = G.stock[k]; G.avg[k] = (G.avg[k] * units) / (units + qty); G.stock[k] += qty;
  if (c.kind === 'tree') { p.growth = c.days - c.every; p.fert = false; } else Object.assign(p, { crop: null });
  AudioEngine.coins(); worldSay('Colheita: ' + stockText(k, qty) + ' de ' + nameOf(k) + ' no estoque da bodega.' + (qty < c.yield ? ' O resto não coube.' : ''));
}
function hortaBuySeed(key) {
  const st = hortaState(), cost = key === 'adubo' ? ADUBO_COST : CROPS[key]?.seedCost; if (!cost) return;
  if (!hasCash(cost)) { worldSay('Não há dinheiro para isso.'); AudioEngine.bad(); return; }
  spendCash(cost); G.stats.purchases += cost; st.seeds[key] = (st.seeds[key] || 0) + 1; AudioEngine.coins(); save();
  if (modal === 'worldStore') agroShop();
}

// Menu de cada canteiro ou cova: o que tem plantado e o que dá para fazer.
function plotMenu(i) {
  const st = hortaState(), p = st.plots[i], slot = HORTA_PLOTS[i], tree = slot.kind === 'tree', btn = (act, label, ok = true) => `<button class="primary" data-act="hortaDo" data-id="${act}" ${ok ? '' : 'disabled'}>${label}</button>`;
  let body;
  if (!p.crop) {
    const options = Object.entries(CROPS).filter(([, c]) => c.kind === slot.kind);
    body = (p.dead ? `<p>${p.dead} secou por falta de água.</p>` : '') + `<p>${tree ? 'Cova vazia: aqui vai uma árvore.' : 'Canteiro vazio.'} O que plantar?</p><div class="game-menu">` +
      options.map(([k, c]) => btn('plant:' + i + ':' + k, `Plantar ${c.name.toLowerCase()} (${st.seeds[k] || 0} ${tree ? 'muda' : 'semente'}${(st.seeds[k] || 0) === 1 ? '' : 's'})`, st.seeds[k] > 0)).join('') + '</div>' +
      (options.every(([k]) => !st.seeds[k]) ? '<p class="small-note">Sementes e mudas no Armazém Querência, aqui na Fronteira.</p>' : '');
  } else {
    const c = CROPS[p.crop], ready = plotReady(p), left = c.days - p.growth;
    body = `<p><b>${c.name}</b> · ${ready ? 'pronta para colher!' : (left === 1 ? 'falta 1 dia' : 'faltam ' + left + ' dias') + ' regando'}${p.fert ? ' · adubada' : ''}.</p>
      <p>${ready ? 'Rende ' + stockText(c.good, c.yield) + ' de ' + nameOf(c.good) + (tree ? ', e a árvore volta a dar em ' + c.every + ' dias.' : '.') : p.water === G.day ? 'Já foi regada hoje.' : 'Ainda não foi regada hoje.'}</p>
      <div class="game-menu">${ready ? btn('harvest:' + i, 'Colher') : btn('water:' + i, p.water === G.day ? 'Regada hoje ✓' : 'Regar', p.water !== G.day) + btn('fert:' + i, `Adubar (${st.seeds.adubo || 0} adubo)`, !p.fert && st.seeds.adubo > 0)}${tree ? '' : btn('clear:' + i, 'Arrancar')}</div>`;
  }
  openDialog(tree ? 'Pomar da horta' : 'Canteiro ' + (i + 1), body, 'horta');
}

// ---------- Mapa da Fronteira: lugares e desenho ----------
function hortaSpots() {
  const st = hortaState();
  return HORTA_PLOTS.map((s, i) => {
    const p = st.plots[i], c = p.crop && CROPS[p.crop];
    const label = !c ? (s.kind === 'tree' ? 'Cova vazia · plantar árvore' : 'Canteiro vazio · plantar') : plotReady(p) ? c.name + ' · colher' : plotThirsty(p) ? c.name + ' · regar' : c.name + ' · crescendo';
    return { id: 'plot:' + i, x: s.x + s.w / 2, y: s.y + s.h + 14, label, act: () => plotMenu(i) };
  });
}
// O chão da horta fica embaixo de tudo; as plantas entram em camadas, para o peão passar entre elas.
function drawHortaLayers(layers, seen) {
  const h = VILA.horta; if (!seen(h.x + h.w / 2, h.y + h.h / 2, h.w)) return;
  layers.push({ y: h.y - 200, draw: () => { rect(h.x, h.y, h.w, h.h, '#8a6a3e', 4, '#5a3a20'); for (let x = h.x; x <= h.x + h.w; x += 20) rect(x, h.y - 8, 4, 12, '#6a4424'); } });
  const st = hortaState();
  HORTA_PLOTS.forEach((s, i) => {
    const p = st.plots[i];
    layers.push({ y: s.y - 100, draw: () => { const wet = p.crop && p.water === G.day; if (s.kind === 'bed') rect(s.x, s.y, s.w, s.h, p.dead && !p.crop ? '#a8885a' : wet ? '#4a3220' : '#6e4e2e', 8); else ellipse(s.x + s.w / 2, s.y + s.h / 2, s.w / 2, s.h / 2, wet ? '#4a3220' : '#6e4e2e'); } });
    if (p.crop) layers.push({ y: s.y + s.h, draw: () => drawCrop(s, p) });
    if (p.crop && (plotThirsty(p) || plotReady(p))) layers.push({ y: s.y + s.h + 1, draw: () => drawPlotBadge(s, p) });
  });
  const sx = h.x + 205, sy = h.y + 250;
  layers.push({ y: sy, draw: () => { rect(sx - 2, sy - 30, 4, 60, '#5a3a20'); rect(sx - 22, sy - 14, 44, 4, '#5a3a20'); ellipse(sx, sy - 36, 10, 10, '#e8d6a8'); rect(sx - 14, sy - 49, 28, 7, '#3a2a1a'); rect(sx - 8, sy - 58, 16, 10, '#3a2a1a'); rect(sx - 12, sy - 20, 24, 24, '#a83a24', 3); } });
  layers.push({ y: h.y + h.h + 40, draw: () => signBoard(h.x + h.w / 2, h.y + h.h - 4, 140, 'HORTA', 13) });
}
function drawCrop(s, p) {
  const c = CROPS[p.crop], k = Math.min(1, p.growth / c.days), cx = s.x + s.w / 2, base = s.y + s.h - 6;
  if (p.crop === 'alface') for (let n = 0; n < 5; n++) { const x = s.x + 16 + n * 25, r = 4 + k * 9; ellipse(x, base - r, r, r * .8, '#3f8a2a'); ellipse(x, base - r - 1, r * .6, r * .5, '#7ac850'); }
  else if (p.crop === 'trigo') for (let n = 0; n < 9; n++) { const x = s.x + 10 + n * 14, hgt = 8 + k * 26, col = k >= 1 ? '#d8b040' : k > .5 ? '#a8b040' : '#6aa83a'; rect(x, base - hgt, 2, hgt, col); if (k > .5) ellipse(x + 1, base - hgt - 4, 3, 6, col); }
  else {
    const hgt = 30 + k * 80, w = 14 + k * 38; rect(cx - 3, base - hgt * .5, 6, hgt * .5, '#5a3a20');
    if (p.crop === 'bergamota') { ellipse(cx, base - hgt * .6, w, w * .8, '#2f6a2a'); if (plotReady(p)) for (let n = 0; n < 7; n++) ellipse(cx - w * .6 + (n * 17) % (w * 1.2), base - hgt * .7 + (n * 11) % (w * .8), 4, 4, '#f09a2a'); }
    else { for (const [dy, f] of [[.45, 1], [.7, .75], [.92, .5]]) { ctx.fillStyle = '#2f5a2a'; ctx.beginPath(); ctx.ellipse(cx, base - hgt * dy, w * f, 7 + k * 5, 0, 0, Math.PI * 2); ctx.fill(); } if (plotReady(p)) for (let n = 0; n < 3; n++) ellipse(cx - 18 + n * 18, base - hgt * .55, 6, 7, '#8a5a2a'); }
  }
}
// Gota azul: precisa regar hoje. Cesto: pronta para colher.
function drawPlotBadge(s, p) {
  const bed = s.kind === 'bed', x = bed ? s.x + s.w + 15 : s.x + s.w / 2, y = (bed ? s.y + s.h / 2 : s.y - 120) + Math.sin(frameClock * 4) * 3;
  rect(x - 14, y - 14, 28, 28, '#fff8e6', 14, '#8a6a3a');
  if (plotReady(p)) { rect(x - 8, y - 2, 16, 9, '#a8743a', 3); ctx.strokeStyle = '#a8743a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 2, 7, Math.PI, 0); ctx.stroke(); ellipse(x - 3, y - 4, 3, 3, '#e8b040'); ellipse(x + 3, y - 5, 3, 3, '#7ac850'); }
  else { ctx.fillStyle = '#3a8ad0'; ctx.beginPath(); ctx.moveTo(x, y - 9); ctx.quadraticCurveTo(x + 8, y + 2, x, y + 8); ctx.quadraticCurveTo(x - 8, y + 2, x, y - 9); ctx.fill(); }
}
// Cartões das sementes, mudas e adubo no Armazém Querência.
function hortaSeedCards() {
  const st = hortaState(), card = (key, name, cost, note, ok = true, why = '') => `<div class="supply"><span class="icon">${key === 'adubo' ? '🧪' : CROPS[key].kind === 'tree' ? '🌳' : '🌱'}</span><div><b>${name}</b><p>${note} · você tem ${st.seeds[key] || 0}</p></div><button class="primary" data-act="hortaDo" data-id="seed:${key}" ${ok && hasCash(cost) ? '' : 'disabled'}>${ok ? 'Comprar · ' + money(cost) : why}</button></div>`;
  return Object.entries(CROPS).map(([k, c]) => card(k, c.seed, c.seedCost, (c.kind === 'tree' ? 'Árvore: dá ' + stockText(c.good, c.yield) + ' a cada ' + c.every + ' dias' : 'Pronta em ' + c.days + ' dias: ' + stockText(c.good, c.yield) + ' de ' + nameOf(c.good).toLowerCase()), unlocked(c.good), 'Libere ' + nameOf(c.good) + ' no celular')).join('') +
    card('adubo', 'Adubo orgânico', ADUBO_COST, 'Cresce o dobro até a colheita');
}
