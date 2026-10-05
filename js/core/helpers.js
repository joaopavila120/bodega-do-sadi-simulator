// Utilidades, formatação de moeda, cálculos e auxiliares
'use strict';

const $ = id => document.getElementById(id);
const canvas = $('scene');
const ctx = canvas ? canvas.getContext('2d') : null;

const money = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const round = v => Math.round(v * 100) / 100;
// fit=false preenche a área do jogo (sem barras); fit=true mostra a bodega inteira.
const camera = { zoom: 1, fit: false, x: 0, y: 0, scale: 1 };
const held = () => G.hands[G.slot];
const freeHand = () => !held();
const pick = values => values[Math.floor(Math.random() * values.length)];
const unlocked = key => !GOODS[key]?.unlock || !!G.up[GOODS[key].unlock];
const capacity = () => G.up.capacity ? 30 : 18;
const isQuentao = key => key === 'cachaca' && G?.event?.id === 'junina';
const price = key => isQuentao(key) ? 8 : key === 'cigarro' && G.up.cigarro_py ? 18 : RECIPES[key]?.price || GOODS[key]?.price || 0;
const nameOf = key => isQuentao(key) ? 'Quentão' : key === 'cigarro' && G.up.cigarro_py ? 'Cigarro do Paraguai' : RECIPES[key]?.name || GOODS[key]?.name || key;

function bulk(k){return BULK[k]||null;}

function formatWeight(n){return n>=1000?(round(n/1000)).toLocaleString('pt-BR')+' kg':Math.round(n)+' g';}

function stationCapacity(k){return bulk(k)?Math.round(bulk(k).capacity*(G.up.capacity?1.6:1)):capacity();}

function stockText(k,n=G.stock[k]){return bulk(k)?formatWeight(n):Math.floor(n)+' un.';}

function salePrice(i){return bulk(i.pid)?round(price(i.pid)*(i.weight||bulk(i.pid).unit)/bulk(i.pid).unit):price(i.pid);}

function movementBonus(){return GEAR[G.gear]?.bonus||0;}

function mateLevel(){return G.up.mateLendario?3:G.up.mateTopetudo?2:G.up.mateCuiudo?1:0;}

function mateStats(){return MATES[mateLevel()];}

function isTableTruco(t){return t?.mode==='truco';}

function isTrucoNight(){return ['truco','campeonato'].includes(G.event.id);}

function hasCash(amount){return G.testMode||G.cash>=amount;}

function spendCash(amount){if(!G.testMode)G.cash=round(G.cash-amount);}

function walletText(){return G.testMode?'R$ ∞':money(G.cash);}

function alcoholPool(){return ['cerveja','cachaca','bitter'].filter(unlocked);}

function snackPool(){return ['codorna','pepino','salame','amendoim'].filter(k=>unlocked(k)&&orderable(k));}

function drinkPool(){return ['refri','cerveja','cachaca','cafe','bitter'].filter(unlocked);}

function drinksForGroup(g){return G.event.id==='campeonato'?alcoholPool():drinkPool();}

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function deck(spanish=false,copies=1){const a=[];for(let d=0;d<copies;d++)for(let s=0;s<4;s++)for(const r of spanish?[1,2,3,4,5,6,7,10,11,12]:[1,2,3,4,5,6,7,8,9,10,11,12,13])a.push({r,s,uid:`${d}-${s}-${r}`});return shuffle(a);}

function cardName(c,spanish=false){return `${spanish?c.r:({1:'A',11:'J',12:'Q',13:'K'}[c.r]||c.r)} de ${spanish?['espadas','bastos','ouros','copas'][c.s]:['espadas','paus','ouros','copas'][c.s]}`;}

function distRect(p,r){return Math.hypot(p.x-clamp(p.x,r.x,r.x+r.w),p.y-clamp(p.y,r.y,r.y+r.h));}

function itemLabel(i){return nameOf(i.pid||i.key)+(bulk(i.pid)?' · '+formatWeight(i.weight||bulk(i.pid).unit):'')+(i.spoiled?' · estragado':i.burned?' · queimado':i.kind==='ingredient'&&COOK[i.key]?(i.ready?' pronto':' cru'):'');}
