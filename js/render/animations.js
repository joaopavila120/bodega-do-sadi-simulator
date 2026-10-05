// Animações leves: briga nas mesas, reações dos clientes, poeira dos passos, brasas e sino da porta.
// As partículas ficam fora do salvamento e têm limite fixo para não pesar o jogo.
'use strict';

const FX_MAX = 280;
let fx = [], fxDust = 0, fxEmber = 0;
const fxSeen = new Set();
const fxRand = (a, b) => a + Math.random() * (b - a);

function fxAdd(type, x, y, o = {}) {
  if (fx.length >= FX_MAX) fx.shift();
  const life = o.life ?? 1;
  fx.push({ type, x, y, vx: o.vx ?? 0, vy: o.vy ?? 0, g: o.g ?? 0, drag: o.drag ?? 0, life, total: life,
    size: o.size ?? 10, rot: o.rot ?? fxRand(0, 6.3), vr: o.vr ?? 0, color: o.color, key: o.key, text: o.text, floor: o.floor });
}

// ---------- Efeitos prontos ----------
function fxPuffs(x, y, n = 8, spread = 120, color) {
  for (let i = 0; i < n; i++) { const a = Math.PI * 2 * i / n + fxRand(-.3, .3), v = fxRand(.5, 1) * spread;
    fxAdd('puff', x, y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v * .55 - 20, drag: 3.2, life: fxRand(.6, 1), size: fxRand(12, 20), color }); }
}
function fxShatter(x, y, n = 10) {
  for (let i = 0; i < n; i++) fxAdd('shard', x, y, { vx: fxRand(-170, 170), vy: fxRand(-220, -80), g: 640, life: fxRand(.6, 1), size: fxRand(4, 8), vr: fxRand(-14, 14), floor: y + fxRand(6, 26) });
}
function fxHearts(x, y, n = 3) { for (let i = 0; i < n; i++) fxAdd('heart', x + fxRand(-22, 22), y + fxRand(-8, 8), { vx: fxRand(-12, 12), vy: fxRand(-60, -38), life: fxRand(1.1, 1.6), size: fxRand(7, 10) }); }
function fxAnger(x, y) { fxAdd('anger', x + fxRand(-10, 10), y, { vy: -18, life: 1.1, size: 11 }); }
function fxStars(x, y, n = 5) { for (let i = 0; i < n; i++) fxAdd('star', x, y, { vx: fxRand(-120, 120), vy: fxRand(-180, -70), g: 300, life: fxRand(.6, .9), size: fxRand(5, 8), vr: fxRand(-9, 9) }); }

// Briga: começa com estardalhaço, termina em paz ou em louça quebrada.
function fxFightStart(t) { const cx = t.x + t.w / 2, cy = t.y + t.h / 2; fxPuffs(cx, cy - 10, 10, 150); fxStars(cx, cy - 40, 6); }
function fxFightStep(t, good) {
  const cx = t.x + t.w / 2, cy = t.y + t.h / 2 - 20;
  if (good) { fxPuffs(cx + fxRand(-40, 40), cy, 3, 70); fxAdd('star', cx + fxRand(-30, 30), cy - 30, { vy: -90, g: 120, life: .5, size: 6, vr: 8 }); }
  else fxAnger(G.player.x + 16, G.player.y - 135);
}
function fxFightEnd(t, success, people = []) {
  const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
  fxPuffs(cx, cy - 10, 14, 190);
  if (success) { for (const p of people) fxHearts(p.x, p.y - 120, 2); fxStars(cx, cy - 50, 4); }
  else { fxAdd('crash', cx, cy - 40, { life: 1.1, size: 46, text: 'CRASH!' }); fxShatter(cx - 25, cy + 10, 9); fxShatter(cx + 25, cy + 14, 9); for (const p of people) fxAnger(p.x, p.y - 130); }
}

// ---------- Atualização ----------
function fxTick(dt) {
  for (const p of fx) {
    p.life -= dt; p.vy += p.g * dt;
    if (p.drag) { const k = Math.max(0, 1 - p.drag * dt); p.vx *= k; p.vy *= k; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    if (p.floor !== undefined && p.y >= p.floor && p.vy > 0) {
      if (p.type === 'cup') { p.life = 0; fxShatter(p.x, p.floor, 6); fxPuffs(p.x, p.floor, 3, 50, '#cdb894'); }
      else { p.y = p.floor; p.vy *= -.25; p.vx *= .5; p.vr *= .4; }
    }
  }
  fx = fx.filter(p => p.life > 0);
  brawlTick(dt); walkDust(dt); fryingSpatter(dt); campoEmbers(dt); doorBell();
}

function brawlTick(dt) {
  for (const t of G.tables) {
    const f = t.fight; if (!f) continue;
    f.throwClock = (f.throwClock ?? .3) - dt; if (f.throwClock > 0) continue;
    const urgency = 1 - f.left / f.total; f.throwClock = fxRand(.35, .8) - urgency * .2;
    const cx = t.x + t.w / 2, cy = t.y + t.h / 2 - 20, roll = Math.random();
    const o = { vx: fxRand(-190, 190), vy: fxRand(-300, -170), g: 680, life: 2, vr: fxRand(-10, 10), floor: t.y + t.h + fxRand(14, 60) };
    if (roll < .35) fxAdd('card', cx, cy, o);
    else if (roll < .6) fxAdd('cup', cx, cy, { ...o, key: pick(['cerveja', 'cachaca', 'refri']), size: 24 });
    else if (roll < .8) fxAnger(cx + fxRand(-t.w / 2, t.w / 2), cy - fxRand(70, 110));
    else fxPuffs(cx + fxRand(-50, 50), cy + fxRand(-10, 20), 3, 90);
  }
}

function walkDust(dt) {
  const p = G.player; if (!p.walk) { fxDust = 0; return; }
  fxDust -= dt; if (fxDust > 0) return; fxDust = G.boost > 0 ? .09 : .15;
  if (G.slow > 0) { for (let i = 0; i < 2; i++) fxAdd('drop', p.x + fxRand(-10, 10), p.y - 2, { vx: fxRand(-40, 40), vy: fxRand(-90, -50), g: 380, life: .45, size: 2.4, floor: p.y + 2 }); return; }
  fxAdd('dust', p.x + fxRand(-9, 9) - p.dx * 10, p.y - 1, { vx: -p.dx * 22 + fxRand(-8, 8), vy: fxRand(-14, -6), drag: 2, life: .5, size: fxRand(4, 6), color: isCampo() ? '#9c8a52' : '#8c6a45' });
}

// Gordura pulando da chapa enquanto a carne e o ovo fritam.
let fxFry = 0;
function fryingSpatter(dt) {
  if (isCampo()) return; fxFry -= dt; if (fxFry > 0) return; fxFry = .09;
  G.kitchen.grill.forEach((item, j) => {
    if (!item || item.waitingToast || Math.random() > .55) return; const f = FIXED.find(f => f.id === 'grill:' + j); if (!f) return;
    const x = f.x + f.w / 2 + fxRand(-22, 22), y = f.y + 26;
    fxAdd(item.burned ? 'puff' : 'spatter', x, y, item.burned ? { vy: -30, life: .9, size: 7, color: '#3a332b', drag: 1 } : { vx: fxRand(-50, 50), vy: fxRand(-120, -60), g: 520, life: .35, size: 1.8, floor: y + 4 });
  });
}

// Brasas sobem do fogo de chão enquanto ainda há lenha.
function campoEmbers(dt) {
  if (!isCampo() || G.lasso) return; const fuel = campoState().fuel ?? 0; if (fuel <= 0) return;
  fxEmber -= dt; if (fxEmber > 0) return; fxEmber = fuel > 25 ? .08 : .22;
  fxAdd('ember', fxRand(310, 740), fxRand(470, 520), { vx: fxRand(-14, 14), vy: fxRand(-80, -45), life: fxRand(.8, 1.5), size: fxRand(2.6, 4.2) });
}

// O sino da porta toca quando entra alguém.
function doorBell() {
  const fresh = [...G.shop.map(c => 's' + c.id), ...G.groups.map(g => 'g' + g.id)];
  for (const id of fresh) {
    if (fxSeen.has(id)) continue; fxSeen.add(id);
    const c = id[0] === 's' ? G.shop.find(c => 's' + c.id === id) : G.groups.find(g => 'g' + g.id === id);
    if (c && Math.hypot(c.x - ENTRY.x, c.y - ENTRY.y) < 90 && !isCampo()) fxAdd('ring', ENTRY.x, ENTRY.y - 150, { life: .9, size: 18 });
  }
  if (fxSeen.size > 400) fxSeen.clear();
}

// ---------- Pessoas brigando ----------
// Na briga, todos da mesa levantam, se sacodem e pulam virados para o centro.
function fightPose(t, x, y, j) {
  if (!t?.fight) return null;
  const cx = t.x + t.w / 2, k = 1 + (1 - t.fight.left / t.fight.total) * .6;
  return { x: x + Math.sin(frameClock * 19 + j * 2.1) * 4 * k, y: y - Math.abs(Math.sin(frameClock * 9 + j * 1.7)) * 11 * k, dx: cx >= x ? 1 : -1 };
}

// Nuvem de pancadaria sobre a mesa, com punhos, estrelas e a provocação.
function drawBrawl(t) {
  const f = t.fight; if (!f) return;
  const cx = t.x + t.w / 2, cy = t.y + t.h * .62, k = 1 - f.left / f.total, rx = t.w * .3 + k * 10, ry = 20 + k * 5, n = 8;
  const puffs = [];
  for (let i = 0; i < n; i++) { const a = Math.PI * 2 * i / n + frameClock * 2.6; puffs.push([cx + Math.cos(a) * rx * (.9 + .12 * Math.sin(frameClock * 7 + i)), cy + Math.sin(a) * ry, 17 + 4 * Math.sin(frameClock * 11 + i * 1.9)]); }
  for (const [x, y, r] of puffs) ellipse(x, y, r + 3, r * .82 + 3, '#4d3b29');
  ellipse(cx, cy, rx + 3, ry + 3, '#4d3b29');
  for (const [x, y, r] of puffs) ellipse(x, y, r, r * .82, '#efe5ca');
  ellipse(cx, cy, rx, ry, '#efe5ca');
  for (let i = 0; i < 5; i++) ellipse(cx + Math.sin(frameClock * 5 + i * 3) * rx * .7, cy + Math.cos(frameClock * 6 + i * 2) * ry * .5, 7, 5, '#d9ccab');
  // punhos e botas aparecendo na fumaceira
  for (let i = 0; i < 3; i++) {
    const a = frameClock * 7.5 + i * 2.1, out = .75 + .45 * Math.abs(Math.sin(frameClock * 13 + i * 4)), x = cx + Math.cos(a) * (rx + 14) * out, y = cy + Math.sin(a) * (ry + 10) * out;
    if (i === 2) { rect(x - 8, y - 4, 16, 9, '#4a3222', 4, '#2b1d14'); continue; }
    ellipse(x, y, 7, 6, '#d9a272'); ctx.strokeStyle = '#5a3a24'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 7, 6, 0, 0, Math.PI * 2); ctx.stroke();
  }
  for (let i = 0; i < 3; i++) { const a = frameClock * 4 + i * 2.09; txt('★', cx + Math.cos(a) * rx, cy - ry - 8 + Math.sin(a) * 7, 14, '#ffd75e'); }
  // a provocação aparece em balão de tempos em tempos
  if (f.taunt && (f.age % 6) < 3.2) {
    ctx.font = 'bold 13px Arial'; const w = ctx.measureText(f.taunt).width + 22, bx = clamp(cx, w / 2 + 6, W - w / 2 - 6), by = t.y - 150;
    rect(bx - w / 2, by - 15, w, 30, '#fff4d4', 8, '#6b4a26');
    ctx.fillStyle = '#fff4d4'; ctx.beginPath(); ctx.moveTo(bx - 7, by + 14); ctx.lineTo(bx, by + 24); ctx.lineTo(bx + 7, by + 14); ctx.fill();
    txt(f.taunt, bx, by, 13, '#4b2c18', 'center', 'Arial', false);
  }
}

// Reticências de conversa nas mesas que estão proseando.
function drawChatDots(g, x, y, j) {
  if (g.state !== 'chat' || g.size < 1) return;
  if (Math.floor(frameClock / 2.4 + g.id) % g.size !== j) return;
  rect(x - 22, y - 160, 44, 22, '#fff4d4', 9, '#7a5a35');
  for (let i = 0; i < 3; i++) ellipse(x - 11 + i * 11, y - 149 - Math.max(0, Math.sin(frameClock * 6 - i * .8)) * 3, 3, 3, '#6b4a26');
}

// ---------- Desenho das partículas ----------
function fxHeart(x, y, s, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y + s * .9);
  ctx.bezierCurveTo(x - s * 1.6, y - s * .1, x - s * .7, y - s * 1.3, x, y - s * .4);
  ctx.bezierCurveTo(x + s * .7, y - s * 1.3, x + s * 1.6, y - s * .1, x, y + s * .9); ctx.fill();
}
function fxAngerMark(x, y, s) {
  ctx.strokeStyle = '#d8362b'; ctx.lineWidth = Math.max(2, s * .28); ctx.lineCap = 'round';
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.beginPath(); ctx.moveTo(x + sx * s * .25, y + sy * s); ctx.quadraticCurveTo(x + sx * s * .25, y + sy * s * .25, x + sx * s, y + sy * s * .25); ctx.stroke(); }
  ctx.lineCap = 'butt';
}
function fxStar(s, color) {
  ctx.fillStyle = color; ctx.beginPath();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? s * .45 : s, a = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  ctx.closePath(); ctx.fill();
}

function drawFx() {
  for (const p of fx) {
    const age = 1 - p.life / p.total, fade = Math.min(1, p.life / (p.total * .35));
    switch (p.type) {
      case 'puff': ctx.globalAlpha = .75 * fade; ellipse(p.x, p.y, p.size * (1 + age * 1.3), p.size * (.8 + age), p.color || '#ece2c6'); break;
      case 'dust': ctx.globalAlpha = .45 * fade; ellipse(p.x, p.y, p.size * (1 + age), p.size * (.55 + age * .5), p.color); break;
      case 'drop': ctx.globalAlpha = .85 * fade; ellipse(p.x, p.y, p.size, p.size * 1.3, '#b9def0'); break;
      case 'spatter': ctx.globalAlpha = fade; rect(p.x, p.y, p.size, p.size, '#fff2b0'); break;
      case 'ember': ctx.globalAlpha = fade * (.6 + .4 * Math.sin(p.life * 30)); rect(p.x, p.y, p.size, p.size, age < .4 ? '#ffe08a' : '#ff8a3a'); break;
      case 'heart': ctx.globalAlpha = fade; fxHeart(p.x, p.y, p.size, '#4a1a16'); fxHeart(p.x, p.y - 1, p.size * .82, '#e8564d'); break;
      case 'anger': ctx.globalAlpha = fade; fxAngerMark(p.x, p.y, p.size * (.85 + .25 * Math.abs(Math.sin(age * 18)))); break;
      case 'ring': {
        ctx.globalAlpha = fade; ctx.strokeStyle = '#ffe9a8'; ctx.lineWidth = 2.5;
        for (let i = 0; i < 2; i++) { const r = p.size * (.6 + age * 1.2) + i * 9; ctx.beginPath(); ctx.arc(p.x, p.y, r, Math.PI * 1.15, Math.PI * 1.45); ctx.stroke(); ctx.beginPath(); ctx.arc(p.x, p.y, r, -Math.PI * .45, -Math.PI * .15); ctx.stroke(); }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(age * 30) * .35 * (1 - age)); ctx.fillStyle = '#e2b347'; ctx.strokeStyle = '#6b4a1c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-11, 8); ctx.quadraticCurveTo(-10, -12, 0, -12); ctx.quadraticCurveTo(10, -12, 11, 8); ctx.closePath(); ctx.fill(); ctx.stroke(); rect(-13, 6, 26, 5, '#c9952f', 2, '#6b4a1c'); ellipse(0, 14, 3.5, 3.5, '#6b4a1c'); rect(-2, -16, 4, 5, '#6b4a1c', 1); ctx.restore(); break;
      }
      case 'crash': {
        ctx.globalAlpha = fade; const s = p.size * (age < .15 ? age / .15 : 1);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(-.12); ctx.beginPath();
        for (let i = 0; i < 16; i++) { const r = i % 2 ? s * .62 : s, a = i * Math.PI / 8; ctx.lineTo(Math.cos(a) * r * 1.45, Math.sin(a) * r); }
        ctx.closePath(); ctx.fillStyle = '#ffd34f'; ctx.fill(); ctx.strokeStyle = '#7a2a12'; ctx.lineWidth = 3; ctx.stroke();
        txt(p.text, 0, 0, Math.max(8, s * .42), '#b8331c', 'center', 'Arial', true); ctx.restore(); break;
      }
      default: {
        ctx.globalAlpha = fade; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        if (p.type === 'star') fxStar(p.size, '#ffd75e');
        else if (p.type === 'shard') { ctx.fillStyle = '#d7eef2'; ctx.strokeStyle = '#6d8f95'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -p.size); ctx.lineTo(p.size * .7, p.size * .6); ctx.lineTo(-p.size * .5, p.size * .4); ctx.closePath(); ctx.fill(); ctx.stroke(); }
        else if (p.type === 'card') { rect(-7, -10, 14, 20, '#f4e3b3', 2, '#8f7a4c'); txt(['♠', '♥', '♣', '♦'][Math.floor(p.total * 10) % 4], 0, 0, 10, '#9a3b2a', 'center', 'Arial', false); }
        else if (p.type === 'cup') food(p.key, 0, 0, p.size);
        ctx.restore();
      }
    }
  }
  ctx.globalAlpha = 1;
}
