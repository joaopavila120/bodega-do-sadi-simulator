// Vida no campo: o inventário do Sadi, as compras nas lojas da Fronteira, o ritmo do dia, o curral (galinhas, codornas e
// bois), a mesa de conservas e o quadro de encomendas dos fregueses especiais.
// Tudo o que se compra ou colhe vai para o inventário; ao entrar na bodega, o que é de balcão é guardado na despensa.
'use strict';

// ---------- Inventário ----------
// Além dos produtos da bodega (GOODS), o inventário leva o que vem cru do campo.
const BAG_RAW = {
  alface: { name: 'Alface', icon: '🥬', to: 'salada', value: 1.2 },
  trigo: { name: 'Trigo', icon: '🌾', to: 'pao_xis', value: 1 },
  pepino_cru: { name: 'Pepino', icon: '🥒', value: .8 },
  ovo_codorna: { name: 'Ovo de codorna', icon: '🥚', value: .4 },
  conserva_pepino: { name: 'Pote de pepino em conserva', icon: '🫙', to: 'pepino', unlock: 'pepino', value: 5 },
  conserva_codorna: { name: 'Pote de ovos de codorna em conserva', icon: '🫙', to: 'codorna', value: 5 },
  vidro: { name: 'Vidro de conserva', icon: '🫙', value: .8 },
  racao: { name: 'Saco de ração', icon: '🌽', value: 3 }
};
function bagState(g = G) { g.bag ??= {}; return g.bag; }
function bagQty(k) { return bagState()[k]?.q || 0; }
function bagName(k) { return BAG_RAW[k]?.name || nameOf(k); }
function bagIcon(k) { return BAG_RAW[k] ? `<span class="bag-emoji">${BAG_RAW[k].icon}</span>` : itemIconHTML(k); }
function bagBulk(k) { return !BAG_RAW[k] && !!bulk(k); }
function bagText(k, q = bagQty(k)) { return bagBulk(k) ? formatWeight(q) : Math.floor(q) + ' un.'; }
// Coloca no inventário (sem limite de carga).
function bagAdd(k, q, cost = 0) { if (!(q > 0)) return 0; const e = bagState()[k] ??= { q: 0, c: 0 }; e.q += q; e.c += cost; return q; }
function bagTake(k, q) { const e = bagState()[k]; if (!e || e.q < q) return false; e.c -= e.c * q / e.q; e.q -= q; if (e.q <= .001) delete bagState()[k]; return true; }
function showBag() {
  const b = bagState(), keys = Object.keys(b);
  openDialog('Inventário do Sadi', `<p>O que é de balcão vai para a despensa quando você entra na bodega.</p>` +
    (keys.length ? `<div class="bag-grid">${keys.map(k => `<div class="bag-item">${bagIcon(k)}<b>${bagText(k)}</b><small>${bagName(k)}</small></div>`).join('')}</div>` : '<p class="small-note">O inventário está vazio.</p>'), 'worldStore');
}
// Ao entrar na bodega: o que é de balcão vai para a despensa (estoque). O que é cru fica no inventário.
function depositBag() {
  const b = bagState(), done = [], kept = [];
  for (const k of Object.keys(b)) {
    const raw = BAG_RAW[k], target = raw ? raw.to : GOODS[k] ? k : null; if (!target) continue;
    if (raw?.unlock && !G.up[raw.unlock]) { G.up[raw.unlock] = true; showBanner(nameOf(target) + ' liberado!', 'A conserva da casa já pode ser vendida no balcão.', 'level'); }
    if (!unlocked(target)) { kept.push(bagName(k)); continue; }
    const e = b[k], room = Math.max(0, stationCapacity(target) - G.stock[target]), q = Math.min(e.q, room); if (q <= 0) continue;
    const cost = e.c * q / e.q, units = G.stock[target]; G.avg[target] = (G.avg[target] * units + cost) / (units + q); G.stock[target] += q;
    bagTake(k, q); done.push(stockText(target, q) + ' ' + nameOf(target).toLowerCase());
  }
  if (done.length) { showBanner('Guardado na despensa', done.slice(0, 4).join(' · ') + (done.length > 4 ? ' e mais ' + (done.length - 4) : ''), 'gift'); AudioEngine.coins(); }
  if (kept.length) say('Ficou no inventário (libere no celular para vender): ' + kept.join(', ') + '.');
  if (done.length) save();
}

// ---------- Lojas da Fronteira ----------
// Atacado (balcão e bebidas), Açougue (carnes), Armazém Querência (agricultura) e Casa do Campeiro (pecuária).
const STORE_GOODS = {
  atacado: ['pao_xis', 'queijo', 'azeite', 'cerveja', 'refri', 'cachaca', 'bitter', 'cafe', 'cigarro', 'codorna', 'amendoim'],
  acougue: ['burger', 'bacon', 'coracao', 'salame'],
  agro: ['erva', 'salada', 'ovo', 'bergamota', 'pinhao']
};
const STORE_INFO = {
  atacado: { name: 'Atacado da Fronteira', text: 'Bebidas, pão, queijo, cigarro e o que mais a bodega vende no balcão.' },
  acougue: { name: 'Açougue da Fronteira', text: 'Carne de primeira: hambúrguer, bacon, coração, salame e manta de costela.' },
  agro: { name: 'Armazém Querência', text: 'Produtos para agricultura: verdura, ovo, erva, sementes, mudas e adubo.' },
  gado: { name: 'Casa do Campeiro', text: 'Produtos para pecuária: animais, ração e equipamento de campo.' }
};
function goodPack(k) { return GOODS[k].pack || 6; }
function goodCard(k) {
  const g = GOODS[k], q = goodPack(k), cost = round(q * g.cost);
  return `<div class="supply"><span class="icon">${itemIconHTML(k)}</span><div><b>${nameOf(k)}</b><p>Bodega: ${stockText(k)} · inventário: ${bagText(k)}</p></div><button class="primary" data-act="storeBuy" data-id="${k}" ${hasCash(cost) ? '' : 'disabled'}>Comprar ${stockText(k, q)} · ${money(cost)}</button></div>`;
}
function extraCard(id, icon, name, note, cost, label, ok = true) { return `<div class="supply"><span class="icon"><span class="bag-emoji">${icon}</span></span><div><b>${name}</b><p>${note}</p></div><button class="primary" data-act="storeExtra" data-id="${id}" ${ok && hasCash(cost) ? '' : 'disabled'}>${label}</button></div>`; }
function storeShop(id) {
  const info = STORE_INFO[id], goods = (STORE_GOODS[id] || []).filter(k => GOODS[k] && unlocked(k));
  let extra = '';
  if (id === 'agro') extra = '<h3>Para a horta · nível ' + hortaLevel() + '</h3><div class="store-list">' + hortaSeedCards() + extraCard('vidro', '🫙', 'Vidros de conserva (4)', 'Para a mesa de conservas da horta', 4, 'Comprar · ' + money(4)) + '</div>' + sellSection();
  if (id === 'acougue') { const left = MANTAS_PER_BOI - mantasToday(); extra = '<h3>Costelão</h3><div class="store-list">' + extraCard('manta', '🥩', 'Manta de costela', 'No costelão vai no máximo a carne de um boi: ' + MANTAS_PER_BOI + ' mantas por domingo', MANTA_BUY_COST, left > 0 ? 'Comprar · ' + money(MANTA_BUY_COST) : 'Limite do domingo', left > 0 && G.costelaoTaught) + '</div>'; }
  if (id === 'gado') extra = campeiroCards();
  openDialog(info.name, `<p>${info.text}</p>` + (goods.length ? `<div class="store-list">${goods.map(goodCard).join('')}</div>` : '') + extra, 'worldStore');
  G.lastStore = id;
}
function refreshStore() { if (modal === 'worldStore' && G.lastStore) storeShop(G.lastStore); }
// Compra no balcão: vai para o inventário.
function storeBuy(k) {
  const g = GOODS[k]; if (!g || !unlocked(k)) return;
  const q = goodPack(k), cost = round(q * g.cost);
  if (!hasCash(cost)) { worldSay('Não há dinheiro para este pacote.'); AudioEngine.bad(); return; }
  spendCash(cost); G.stats.purchases += cost; bagAdd(k, q, cost); AudioEngine.coins(); save(); refreshStore();
}
function storeExtra(id) {
  const buy = (cost, fn) => { if (!hasCash(cost)) { worldSay('Não há dinheiro para isso.'); AudioEngine.bad(); return false; } spendCash(cost); G.stats.purchases += cost; fn(); AudioEngine.coins(); return true; };
  const r = ranchState();
  if (id === 'vidro') buy(4, () => bagAdd('vidro', 4, 4));
  else if (id === 'manta') { if (MANTAS_PER_BOI - mantasToday() > 0) buy(MANTA_BUY_COST, () => bagAdd('costela_crua', 1, MANTA_BUY_COST)); }
  else if (id === 'boi') buyBoi();
  else if (id === 'galinha') { if (r.hens < RANCH_MAX.hens) buy(15, () => r.hens++); }
  else if (id === 'codorna') { if (r.quails < RANCH_MAX.quails) buy(10, () => r.quails++); }
  else if (id === 'racao') buy(6, () => bagAdd('racao', 1, 6));
  else if (['bodoque', 'bootsGaucho', 'bootsBagual'].includes(id)) buyUpgrade(id);
  save(); refreshStore();
}
function campeiroCards() {
  const r = ranchState(), gear = ['bodoque', 'bootsGaucho', 'bootsBagual'].map(id => UPGRADES.find(u => u.id === id)).filter(Boolean);
  const gearCard = u => { const owned = !!G.up[u.id], needs = u.requires && !G.up[u.requires], low = bodegaLevel() < (u.level || 1); return extraCard(u.id, u.id === 'bodoque' ? '🪃' : '🥾', u.name, u.desc, u.cost, owned ? 'Já é seu' : needs ? 'Antes: ' + UPGRADES.find(x => x.id === u.requires).name : low ? 'Bodega nível ' + u.level : 'Comprar · ' + money(u.cost), !owned && !needs && !low); };
  return '<h3>Animais e ração</h3><div class="store-list">' +
    extraCard('boi', '🐂', 'Boi', 'Para a laçada de sábado · rebanho: ' + (G.herd || 0), BOI_COST, 'Comprar · ' + money(BOI_COST)) +
    extraCard('galinha', '🐔', 'Galinha caipira', 'Bota um ovo por dia, se comer · você tem ' + r.hens + '/' + RANCH_MAX.hens, 15, r.hens < RANCH_MAX.hens ? 'Comprar · ' + money(15) : 'Galinheiro cheio', r.hens < RANCH_MAX.hens) +
    extraCard('codorna', '🐦', 'Codorna', 'Bota um ovinho por dia, se comer · você tem ' + r.quails + '/' + RANCH_MAX.quails, 10, r.quails < RANCH_MAX.quails ? 'Comprar · ' + money(10) : 'Codorneira cheia', r.quails < RANCH_MAX.quails) +
    extraCard('racao', '🌽', 'Saco de ração', 'Um saco alimenta o curral inteiro por um dia', 6, 'Comprar · ' + money(6)) +
    '</div><h3>Equipamento</h3><div class="store-list">' + gear.map(gearCard).join('') + '</div>';
}
// Venda no Armazém: o que é colhido ou produzido e está no inventário.
const SELLABLE = ['alface', 'trigo', 'pepino_cru', 'ovo', 'ovo_codorna', 'conserva_pepino', 'conserva_codorna', 'bergamota', 'pinhao', 'erva'];
function sellPrice(k, q) { return round(BAG_RAW[k] ? BAG_RAW[k].value * q : (bagBulk(k) ? q / 1000 * (GOODS[k].price || GOODS[k].cost * 1000) * .6 : (GOODS[k].price || GOODS[k].cost * 2) * .5 * q)); }
function sellSection() {
  const list = SELLABLE.filter(k => bagQty(k) > 0);
  return '<h3>Vender a colheita</h3>' + (list.length ? '<div class="store-list">' + list.map(k => `<div class="supply"><span class="icon">${bagIcon(k)}</span><div><b>${bagName(k)}</b><p>No inventário: ${bagText(k)}</p></div><button class="primary" data-act="storeSell" data-id="${k}">Vender tudo · ${money(sellPrice(k, bagQty(k)))}</button></div>`).join('') + '</div>' : '<p class="small-note">Traga no inventário o que colher na horta e no curral para vender aqui.</p>');
}
function storeSell(k) { const q = bagQty(k); if (!q) return; const v = sellPrice(k, q); bagTake(k, q); G.cash = round(G.cash + v); AudioEngine.coins(); worldSay('Vendeu ' + bagText(k, q) + ' de ' + bagName(k).toLowerCase() + ' por ' + money(v) + '.'); save(); refreshStore(); }
// Celular: no lugar do fornecedor, a lista de compras (o que está acabando e onde comprar).
function physicalShopping() { return !G.testMode; }
function shoppingListHTML() {
  const where = k => Object.entries(STORE_GOODS).find(([, l]) => l.includes(k))?.[0];
  const low = Object.keys(GOODS).filter(k => unlocked(k) && where(k) && G.stock[k] < stationCapacity(k) * .35).sort((a, b) => G.stock[a] / stationCapacity(a) - G.stock[b] / stationCapacity(b));
  return `<div class="phone-note">Tudo se compra nas lojas da Fronteira. Ao voltar, o inventário vai para a despensa.</div>` +
    (low.length ? low.map(k => `<div class="supply"><span class="icon">${itemIconHTML(k)}</span><div><b>${nameOf(k)}</b><p>Bodega: ${stockText(k)} · ${STORE_INFO[where(k)].name}</p></div></div>`).join('') : '<p>Estoque em dia. Nada faltando.</p>');
}

// ---------- Ritmo do dia ----------
// A manhã (antes de abrir) corre das 6h ao meio-dia: horta, curral, compras e prosa. Às 9h, aviso para abrir; se a
// bodega continuar fechada ao meio-dia, a freguesia vai embora: perde reputação e o evento do dia.
const MORNING_RATE = 1.5;   // minutos de jogo por segundo
function morningActive() { return G.phase === 'prep' && !tutorialActive() && !G.testMode; }
function ruralTick(dt) {
  if (!morningActive()) return;
  const before = G.morning || 0; G.morning = Math.min(7 * 60, before + dt * MORNING_RATE);
  if (before < 180 && G.morning >= 180) { showBanner('9h · Hora de abrir a bodega', 'Abra até o meio-dia, ou a freguesia vai embora e o evento do dia se perde.', 'info', { world: true }); AudioEngine.tick(); }
  if (before < 360 && G.morning >= 360 && G.event.id !== 'costelao') {
    repChange(-4); const lost = G.event.id !== 'normal' && G.event.id !== 'costelao' ? eventInfo().name : null;
    if (lost) G.event = { id: 'normal', seen: true, fired: {}, lost: true };
    showBanner('Meio-dia e a bodega fechada!', 'A freguesia foi embora (−4 de reputação)' + (lost ? ' e o dia de ' + lost + ' se perdeu.' : '.'), 'bad', { world: true }); AudioEngine.bad(); save();
  }
}
function morningMinutes() { return 6 * 60 + (G.morning || 0); }
// Ao abrir: aviso das plantas sem água.
function ruralOnOpen() {
  G.openAt = morningActive() ? morningMinutes() : null;
  if (hortaCells().some(cellThirsty)) showBanner('As plantas ainda não foram regadas hoje', 'Passe na horta com o regador antes que sequem.', 'info');
}
function ruralNewDay(prevDay) { G.morning = 0; G.openAt = null; if (!G.testMode) hortaPests(); ranchNewDay(prevDay); ordersNewDay(); }
// Ícone no topo: estado da horta e do curral, de qualquer lugar.
function updateFarmStatus() {
  const el = $('farmStatus'); if (!el) return;
  const cells = hortaCells(), thirsty = cells.filter(cellThirsty).length, ready = cells.filter(cellReady).length, eggs = ranchState().nests.ovo + ranchState().nests.ovo_codorna, orders = (G.orders || []).length;
  const parts = [thirsty && '💧' + thirsty, ready && '🧺' + ready, eggs && '🥚' + eggs, orders && '📋' + orders].filter(Boolean);
  el.classList.toggle('hidden', !parts.length); setHTML(el, parts.join(' '));
  el.title = [thirsty && thirsty + ' planta(s) com sede', ready && ready + ' pronta(s) para colher', eggs && eggs + ' ovo(s) no curral', orders && orders + ' encomenda(s) no quadro'].filter(Boolean).join(' · ');
}

// ---------- Curral: bois, galinhas e codornas ----------
const RANCH_MAX = { hens: 8, quails: 10 };
function ranchState(g = G) { g.ranch ??= { hens: 2, quails: 2, fedDay: null, nests: { ovo: 0, ovo_codorna: 0 } }; g.ranch.nests ??= { ovo: 0, ovo_codorna: 0 }; return g.ranch; }
// Bicho que comeu ontem bota hoje.
function ranchNewDay(prevDay) { const r = ranchState(); if (r.fedDay === prevDay) { r.nests.ovo = Math.min(30, r.nests.ovo + r.hens); r.nests.ovo_codorna = Math.min(40, r.nests.ovo_codorna + r.quails); } }
const RANCH = { W: 1600, H: 1000, gate: 800, pasture: { x: 160, y: 220, w: 1280, h: 340 }, coop: { x: 220, y: 640, w: 300, h: 180 }, quail: { x: 1080, y: 660, w: 240, h: 150 }, cocho: { x: 700, y: 650, w: 200, h: 50 } };
let curralBirds = null;
WORLD_MAPS.curral = {
  id: 'curral', name: 'Curral da bodega', W: RANCH.W, H: RANCH.H,
  spawn() { return { x: RANCH.gate, y: RANCH.H - 110 }; },
  canWalk(x, y) {
    if (x < 110 || x > RANCH.W - 110 || y < 580) return false;
    if (y > RANCH.H - 90 && (Math.abs(x - RANCH.gate) > 50 || y > RANCH.H - 20)) return false;
    return !hitRect([RANCH.coop, RANCH.quail, RANCH.cocho], x, y);
  },
  edge(p) { if (p.y > RANCH.H - 60) return { ...worldOut.back, title: '' }; return null; },
  spots() {
    const r = ranchState(), C = RANCH;
    return [
      { id: 'cocho', ...front(C.cocho, 26), label: r.fedDay === G.day ? 'Cocho · bichos já comeram hoje' : 'Cocho · dar ração (' + bagQty('racao') + ' saco' + (bagQty('racao') === 1 ? '' : 's') + ')', act: feedRanch },
      { id: 'ninhos', ...front(C.coop, 26), label: 'Ninhos das galinhas · ' + r.nests.ovo + ' ovo' + (r.nests.ovo === 1 ? '' : 's'), act: () => collectEggs('ovo') },
      { id: 'codorneira', ...front(C.quail, 26), label: 'Codorneira · ' + r.nests.ovo_codorna + ' ovinho' + (r.nests.ovo_codorna === 1 ? '' : 's'), act: () => collectEggs('ovo_codorna') },
      { id: 'pasto', x: C.pasture.x + C.pasture.w / 2, y: C.pasture.y + C.pasture.h + 30, label: 'Pasto · ' + (G.herd || 0) + ' boi' + ((G.herd || 0) === 1 ? '' : 's'), text: 'O rebanho pastando. Sábado à noite é dia de laçar para o costelão.' }
    ];
  },
  draw(view, seen, layers) {
    const C = RANCH, r = ranchState(), p = C.pasture;
    grassField(this, view, seen, '#6f9a45', ['#5f8a3a', '#86ad55']);
    rect(p.x, p.y, p.w, p.h, '#7aa64a'); for (let x = p.x; x <= p.x + p.w; x += 44) { rect(x, p.y - 30, 8, 40, '#6a4424'); rect(x, p.y + p.h - 30, 8, 40, '#6a4424'); } rect(p.x, p.y - 22, p.w, 6, '#8a5a32'); rect(p.x, p.y + p.h - 22, p.w, 6, '#8a5a32');
    for (let x = 100; x <= C.W - 100; x += 40) if (Math.abs(x - C.gate) > 60) rect(x, C.H - 96, 6, 36, '#6a4424');
    rect(100, C.H - 86, C.gate - 160, 6, '#8a5a32'); rect(C.gate + 60, C.H - 86, C.W - 160 - C.gate, 6, '#8a5a32');
    // bois no pasto
    const herd = Math.min(G.herd || 0, 10);
    for (let i = 0; i < herd; i++) { const bx = p.x + 120 + ((i * 211 + frameClock * 8 * (i % 2 ? 1 : -1)) % (p.w - 240) + (p.w - 240)) % (p.w - 240), by = p.y + 120 + (i * 67) % (p.h - 160); layers.push({ y: by, draw: () => { ellipse(bx, by + 2, 40, 9, '#1c140c44'); drawBoi(i % BOI_COATS.length, Math.floor(frameClock * 2 + i) % 2 ? 2 : 0, bx, by, 1.4, i % 2 === 0); } }); }
    // galinheiro e codorneira
    layers.push({ y: C.coop.y + C.coop.h, draw: () => { const c = C.coop; gable(c.x, c.y - 10, c.w, 70, '#8a3a24', 12); rect(c.x, c.y + 54, c.w, c.h - 54, '#c8a870', 0, '#6a4a2a'); for (let x = c.x + 10; x < c.x + c.w; x += 18) rect(x, c.y + 56, 2, c.h - 58, '#a8884a'); rect(c.x + c.w / 2 - 22, c.y + c.h - 56, 44, 56, '#5a3a20', 2); for (let k = 0; k < Math.min(r.nests.ovo, 6); k++) ellipse(c.x + 40 + k * 14, c.y + c.h - 14, 6, 7, '#f4ecd8'); signBoard(c.x + c.w / 2, c.y + 60, 160, 'GALINHEIRO', 12); } });
    layers.push({ y: C.quail.y + C.quail.h, draw: () => { const q = C.quail; rect(q.x, q.y + 30, q.w, q.h - 30, '#8a6a3a', 4, '#4a3018'); for (let x = q.x + 8; x < q.x + q.w; x += 12) rect(x, q.y + 34, 1, q.h - 38, 'rgba(220,220,210,.6)'); rect(q.x - 6, q.y + 20, q.w + 12, 14, '#6a4424'); for (let k = 0; k < Math.min(r.nests.ovo_codorna, 8); k++) ellipse(q.x + 30 + k * 18, q.y + q.h - 12, 4, 5, '#e8dcc0'); signBoard(q.x + q.w / 2, q.y + 2, 150, 'CODORNEIRA', 12); } });
    layers.push({ y: C.cocho.y + C.cocho.h, draw: () => { const c = C.cocho; rect(c.x, c.y, c.w, c.h, '#7a5a34', 6, '#4a3018'); rect(c.x + 8, c.y + 6, c.w - 16, 18, r.fedDay === G.day ? '#e8c060' : '#4a3018', 4); signBoard(c.x + c.w / 2, c.y + c.h + 4, 100, 'COCHO', 11); } });
    // galinhas e codornas ciscando no terreiro
    if (!curralBirds || curralBirds.hens !== r.hens || curralBirds.quails !== r.quails) curralBirds = { hens: r.hens, quails: r.quails, list: [...Array(r.hens)].map((_, i) => ({ k: 'hen', x: 300 + i * 70, y: 870 - (i % 3) * 30, t: i })).concat([...Array(r.quails)].map((_, i) => ({ k: 'quail', x: 1000 + i * 40, y: 880 - (i % 2) * 20, t: i * 2 }))) };
    for (const b of curralBirds.list) { b.t += 1 / 60; const peck = Math.sin(b.t * 3) > .7; if (!peck) b.x += Math.sin(b.t * .7) * .6; layers.push({ y: b.y, draw: () => drawBird(b, peck) }); }
  }
};
function drawBird(b, peck) {
  const s = b.k === 'hen' ? 1 : .78, x = b.x, y = b.y, dir = Math.cos(b.t * .7) > 0 ? 1 : -1;
  ellipse(x, y + 2, 14 * s, 4 * s, '#1c140c44'); ellipse(x, y - 12 * s, 14 * s, 11 * s, b.k === 'hen' ? '#f4ece0' : '#8a6a4a');
  if (b.k === 'quail') for (let k = 0; k < 4; k++) ellipse(x - 6 + k * 4, y - 12 * s + (k % 2) * 3, 1.5, 1.5, '#3a2a1a');
  const hx = x + dir * 11 * s, hy = y - (peck ? 10 : 22) * s; ellipse(hx, hy, 6 * s, 6 * s, b.k === 'hen' ? '#f4ece0' : '#8a6a4a');
  if (b.k === 'hen') rect(hx - 2, hy - 9 * s, 4, 5, '#d42a2a', 2); rect(hx + dir * 5 * s - 2, hy - 1, 5, 3, '#e8b040', 1);
  rect(x - 3, y - 2, 2, 4, '#e8b040'); rect(x + 2, y - 2, 2, 4, '#e8b040');
}
function feedRanch() {
  const r = ranchState();
  if (r.fedDay === G.day) { worldSay('Os bichos já comeram hoje.'); return; }
  if (!bagTake('racao', 1)) { worldSay('Sem ração no inventário: compre na Casa do Campeiro.'); AudioEngine.bad(); return; }
  r.fedDay = G.day; AudioEngine.grain?.(); worldSay('Ração no cocho: amanhã tem ovo nos ninhos.'); save();
}
function collectEggs(k) {
  const r = ranchState(), n = r.nests[k]; if (!n) { worldSay(k === 'ovo' ? 'Nenhum ovo nos ninhos. Galinha só bota se comer no dia anterior.' : 'Nenhum ovinho na codorneira hoje.'); return; }
  const got = bagAdd(k, n); r.nests[k] -= got;
  AudioEngine.tick(); worldSay('Recolheu ' + got + (k === 'ovo' ? ' ovo' + (got > 1 ? 's' : '') : ' ovinho' + (got > 1 ? 's' : '') + ' de codorna') + '.'); save();
}

// ---------- Mesa de conservas (no galpão da horta) ----------
const CONSERVAS = [
  { id: 'pepino', name: 'Compota de pepino', needs: { pepino_cru: 3, vidro: 1 }, out: 'conserva_pepino', n: 3, note: '3 pepinos + 1 vidro → 3 potes' },
  { id: 'codorna', name: 'Ovos de codorna em conserva', needs: { ovo_codorna: 6, vidro: 1 }, out: 'conserva_codorna', n: 3, note: '6 ovinhos + 1 vidro → 3 potes' }
];
function conservasMenu() {
  openDialog('Mesa de conservas', '<p>Vinagre, sal e ervas da casa: o que sai da horta e do curral vira conserva para o balcão. Vidros no Armazém Querência.</p><div class="store-list">' +
    CONSERVAS.map(c => { const ok = Object.entries(c.needs).every(([k, q]) => bagQty(k) >= q); return `<div class="supply"><span class="icon"><span class="bag-emoji">🫙</span></span><div><b>${c.name}</b><p>${c.note} · no inventário: ${Object.keys(c.needs).map(k => bagText(k) + ' ' + bagName(k).toLowerCase()).join(', ')}</p></div><button class="primary" data-act="makeConserva" data-id="${c.id}" ${ok ? '' : 'disabled'}>Fazer</button></div>`; }).join('') + '</div>', 'worldStore');
}
function makeConserva(id) {
  const c = CONSERVAS.find(x => x.id === id); if (!c || !Object.entries(c.needs).every(([k, q]) => bagQty(k) >= q)) return;
  for (const [k, q] of Object.entries(c.needs)) bagTake(k, q);
  bagAdd(c.out, c.n); AudioEngine.glass(); worldSay(c.name + ': ' + c.n + ' potes prontos no inventário.'); save(); conservasMenu();
}

// ---------- Quadro de encomendas ----------
// Os fregueses especiais pedem o que sai da horta e do curral. Entregar dá dinheiro, amizade e às vezes um presente.
const ORDER_ITEMS = {
  alface: { q: [3, 5], why: 'pra salada do almoço' }, trigo: { q: [3, 6], why: 'pra fazer pão caseiro' },
  ovo: { q: [4, 8], why: 'pra fazer cuca', ok: () => ranchState().hens > 0 }, ovo_codorna: { q: [6, 10], why: 'pra um petisco', ok: () => ranchState().quails > 0 },
  erva: { q: [1000, 1000], why: 'erva da casa pro chimarrão' }, bergamota: { q: [2000, 3000], why: 'pra levar pros netos' }, pinhao: { q: [1000, 2000], why: 'pra cozinhar no fogão a lenha' },
  pepino_cru: { q: [3, 6], why: 'pra salada', ok: () => hortaLevel() >= 3 }, conserva_pepino: { q: [2, 3], why: 'pra festa da comunidade', ok: () => hortaLevel() >= 3 },
  conserva_codorna: { q: [2, 3], why: 'pro jogo de truco', ok: () => ranchState().quails > 0 }
};
function orderPeople() { const met = PEOPLE.map((p, i) => i).filter(i => isSpecial(i) && G.metSpecial?.[PEOPLE[i].id]); return met.length ? met : ['valter', 'badin', 'gaudencio', 'lauro', 'manolima'].map(id => PEOPLE.findIndex(p => p.id === id)).filter(i => i >= 0 && isSpecial(i)); }
function ordersNewDay() {
  G.orders = (G.orders || []).filter(o => o.due >= G.day);
  const pool = Object.entries(ORDER_ITEMS).filter(([, d]) => !d.ok || d.ok()).map(([k]) => k);
  while (G.orders.length < 3 && pool.length) {
    const item = pick(pool), d = ORDER_ITEMS[item], q = d.q[0] + Math.floor(Math.random() * (d.q[1] - d.q[0] + 1)), person = pick(orderPeople());
    if (G.orders.some(o => o.person === person)) { if (G.orders.length >= orderPeople().length) break; continue; }
    const base = BAG_RAW[item] ? BAG_RAW[item].value * q : sellPrice(item, q) / .6;
    G.orders.push({ id: G.next++, person, item, q, reward: round(Math.max(8, base * 1.8 + 4)), due: G.day + 2 });
    if (G.orders.length >= 2 && Math.random() < .4) break;
  }
}
function ordersBoard() {
  if (!G.orders) ordersNewDay();
  const list = G.orders;
  openDialog('Quadro de encomendas', '<p>Pedidos dos fregueses para a horta e o curral. Traga no inventário e entregue aqui.</p>' + (list.length ? '<div class="store-list">' + list.map(o => { const i = o.person, left = o.due - G.day, ok = bagQty(o.item) >= o.q; return `<div class="supply"><span class="icon">${portraitHTML(i, 48)}</span><div><b>${PEOPLE[i].name}</b><p>“${bagText(o.item, o.q)} de ${bagName(o.item).toLowerCase()}, ${ORDER_ITEMS[o.item].why}.” · paga ${money(o.reward)} · ${left <= 0 ? 'último dia' : 'faltam ' + (left + 1) + ' dias'}</p></div><button class="primary" data-act="deliverOrder" data-id="${o.id}" ${ok ? '' : 'disabled'}>${ok ? 'Entregar' : 'No inventário: ' + bagText(o.item)}</button></div>`; }).join('') + '</div>' : '<p class="small-note">Nenhuma encomenda por enquanto. Amanhã cedo aparecem pedidos novos.</p>'), 'worldStore');
}
function deliverOrder(id) {
  const o = (G.orders || []).find(x => x.id === Number(id)); if (!o || !bagTake(o.item, o.q)) return;
  G.orders = G.orders.filter(x => x !== o); G.cash = round(G.cash + o.reward); addFriendship(o.person, 6); gainXP(6); AudioEngine.coins();
  let gift = ''; if (Math.random() < .3) { const k = pick(['alface', 'trigo', 'adubo']); hortaState().seeds[k] += k === 'adubo' ? 2 : 3; gift = ' De presente: ' + (k === 'adubo' ? '2 adubos' : '3 sementes de ' + CROPS[k].name.toLowerCase()) + '!'; }
  showBanner('Encomenda entregue a ' + PEOPLE[o.person].name, money(o.reward) + ' · +amizade.' + gift, 'gift', { world: true }); save(); ordersBoard();
}
