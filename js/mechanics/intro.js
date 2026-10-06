// Introdução da história ao começar um jogo novo: o galpão herdado, vazio, e o sonho da bodega.
// Funciona como um curta: o Sadi entra, conta a história em caixas de diálogo, a tela corta para
// "algumas semanas depois" e a bodega aparece montada, estação por estação. Pode ser pulada.
'use strict';

const INTRO_LINES = [
  'Herdei esse galpão do meu velho vô, que foi pra outra morada.',
  'Esse galpão foi de tudo: construíram na época das tropeadas, depois virou CTG… e agora tá abandonado.',
  'Vou revitalizar e realizar meu sonho: abrir minha própria bodega!'
];
const INTRO_LAST = 'Dizem que por aqui passa gente conhecida: o Mano Lima, o Lauro Boleador, o Indavirus… Se eu tratar bem, viram amigos e até trazem presente.';
const INTRO_SPOT = { x: 800, y: 640 };
let introScene = null;

function startIntro() {
  introScene = { phase: 'walk', t: 0, line: -1, x: ENTRY.x, y: ENTRY.y, built: 0 };
  G.player = { ...G.player, x: ENTRY.x, y: ENTRY.y, dx: 0, dy: -1, walk: true };
  document.body.classList.add('intro-playing'); $('introSkip').classList.remove('hidden');
}
function introSay(text) {
  showRpgBox('introTalk', { portrait: portraitFromSprite(avatarSprite(), 104), name: PEOPLE.find(p => p.id === G.avatarId)?.name || 'Sadi', player: '', reply: text });
}
function introNext() {
  const s = introScene; if (!s) return;
  if (rpgTyping('introTalk')) { finishRpgTyping('introTalk'); return; }
  if (s.phase === 'talk') {
    if (s.line < INTRO_LINES.length - 1) { s.line++; introSay(INTRO_LINES[s.line]); }
    else { showRpgBox('introTalk', null); s.phase = 'cut'; s.t = 0; }
  } else if (s.phase === 'talk2') endIntro();
}
function skipIntro() { if (introScene) endIntro(); return true; }
function endIntro() {
  introScene = null; showRpgBox('introTalk', null);
  document.body.classList.remove('intro-playing'); $('introSkip').classList.add('hidden');
  AudioEngine.loop('wind', 0, { type: 'bandpass', freq: 500, q: .5 });
  G.player = { ...G.player, x: 520, y: 720, dx: 0, dy: 1, walk: false };
  save(); welcome();
}
function introKey(e) {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (['e', ' ', 'Enter'].includes(key)) { e.preventDefault(); if (!e.repeat) introNext(); }
  else if (key === 'Escape') skipIntro();
}

function introTick(dt) {
  const s = introScene; s.t += dt;
  AudioEngine.loop('wind', ['walk', 'talk', 'cut'].includes(s.phase) ? .03 : 0, { type: 'bandpass', freq: 500, q: .5 });
  if (s.phase === 'walk') {
    const d = Math.hypot(INTRO_SPOT.x - s.x, INTRO_SPOT.y - s.y);
    if (s.t > .8 && d > 3) { const k = Math.min(d, 150 * dt); s.x += (INTRO_SPOT.x - s.x) / d * k; s.y += (INTRO_SPOT.y - s.y) / d * k; G.player.dx = INTRO_SPOT.x < s.x ? -1 : 1; }
    G.player.walk = d > 3 && s.t > .8;
    if (d <= 3 && s.t > 1.2) { s.phase = 'talk'; s.line = 0; G.player.walk = false; G.player.dy = 1; introSay(INTRO_LINES[0]); }
  } else if (s.phase === 'cut' && s.t > 1) { s.phase = 'later'; s.t = 0; }
  else if (s.phase === 'later' && s.t > 1.8) { s.phase = 'build'; s.t = 0; G.player = { ...G.player, x: INTRO_SPOT.x, y: INTRO_SPOT.y, walk: false, dy: 1 }; }
  else if (s.phase === 'build') {
    // as estações aparecem uma a uma, com poeira e martelada
    const list = furniture(), due = Math.min(list.length, Math.floor((s.t - .6) / .12));
    while (s.built < due) { const f = list[s.built++]; fxPuffs(f.x + f.w / 2, f.y + f.h / 2, 5, 90, '#e8dcc0'); if (s.built % 3 === 1) AudioEngine.thud(); }
    fxTick(dt);
    if (s.built >= list.length && s.t > .6 + list.length * .12 + .8) { s.phase = 'talk2'; AudioEngine.ready(); introSay(INTRO_LAST); }
  } else if (s.phase === 'talk2') fxTick(dt);
}

// Galpão abandonado: só o chão, poeira no ar e a luz entrando pela janela.
function drawIntroEmpty() {
  const s = introScene; beginWorld();
  if (roomArt.complete && roomArt.naturalWidth) { ctx.imageSmoothingEnabled = false; ctx.drawImage(roomArt, 0, 0, W, H); ctx.imageSmoothingEnabled = true; }
  rect(0, 0, W, H, 'rgba(40,28,16,.38)');
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) {
    const x0 = roomX(1110 + i * 110), x1 = x0 + roomX(70);
    ctx.fillStyle = `rgba(255,226,160,${.07 + .02 * Math.sin(frameClock * .7 + i)})`;
    ctx.beginPath(); ctx.moveTo(x0, roomY(130)); ctx.lineTo(x1, roomY(130)); ctx.lineTo(x1 - 260, H); ctx.lineTo(x0 - 330, H); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  for (let i = 0; i < 46; i++) { const x = (i * 137.3 + frameClock * (6 + i % 5)) % W, y = (i * 71.9 + Math.sin(frameClock * .6 + i) * 30 + 900) % H; ellipse(x, y, 1.6, 1.6, `rgba(255,236,190,${.25 + .2 * Math.sin(frameClock * 2 + i)})`); }
  ctx.strokeStyle = 'rgba(230,225,210,.25)'; ctx.lineWidth = 1;
  for (const [cx, cy, sx] of [[0, 0, 1], [W, 0, -1]]) for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.arc(cx, cy, k * 22, sx > 0 ? 0 : Math.PI / 2, sx > 0 ? Math.PI / 2 : Math.PI); ctx.stroke(); }
  personDraw(avatarSprite(), s.x, s.y, G.player.walk, true, G.player.dx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
function drawIntro() {
  const s = introScene, cw = canvas.width, ch = canvas.height;
  if (s.phase === 'later') { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch); ctx.globalAlpha = clamp(Math.min(s.t / .5, (1.8 - s.t) / .5), 0, 1); ctx.fillStyle = '#f1e6c8'; ctx.font = `italic ${Math.round(ch / 20)}px Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Algumas semanas depois…', cw / 2, ch / 2); ctx.globalAlpha = 1; }
  else if (['build', 'talk2'].includes(s.phase)) { draw(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (s.phase === 'build' && s.t < .6) { ctx.fillStyle = `rgba(0,0,0,${1 - s.t / .6})`; ctx.fillRect(0, 0, cw, ch); } }
  else { drawIntroEmpty(); const fade = s.phase === 'walk' ? Math.max(0, 1 - s.t / 1) : s.phase === 'cut' ? Math.min(1, s.t / 1) : 0; if (fade) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, cw, ch); } }
  // faixas de cinema
  const bar = Math.round(ch * .07); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, bar); ctx.fillRect(0, ch - bar, cw, bar);
}
