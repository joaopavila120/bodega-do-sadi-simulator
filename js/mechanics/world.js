'use strict';

const ROOMS = [
  {id:1,name:'Room 1 · A primeira bodega',file:'room.png',improvements:0,cover:null},
  {id:2,name:'Room 2 · Colônia ensolarada',file:'room2.png',improvements:0,cover:[735,179,91,79]},
  {id:3,name:'Room 3 · Noite no interior',file:'room3.png',improvements:4,cover:[672,215,80,80]},
  {id:4,name:'Room 4 · Refúgio da serra',file:'room4.png',improvements:8,cover:[775,197,94,93]},
  {id:5,name:'Room 5 · Galpão de estância',file:'room5.png',improvements:12,cover:[257,241,69,63]}
];
const roomImages=ROOMS.map(r=>{const im=new Image();im.src='assets/images/'+r.file;return im;});
let selectedStartingRoom=1;
function improvementCount(g=G){return UPGRADES.filter(u=>g.up[u.id]).length;}
function roomUnlocked(id,g=G){const room=ROOMS.find(r=>r.id===Number(id));return !!room&&improvementCount(g)>=room.improvements;}
function roomChoices(initial=false){return ROOMS.map(r=>{const available=initial?r.improvements===0:roomUnlocked(r.id);return `<button class="room-choice ${(initial?selectedStartingRoom:G.room)===r.id?'selected':''}" data-act="${initial?'startRoom':'room'}" data-id="${r.id}" ${available?'':'disabled'}><img src="assets/images/${r.file}" alt=""><b>${r.name}</b><small>${available?'Disponível':r.improvements+' melhorias · '+improvementCount()+'/'+r.improvements}</small></button>`;}).join('');}
function selectStartingRoom(id){if(![1,2].includes(Number(id)))return;selectedStartingRoom=Number(id);$('startingRooms').innerHTML=roomChoices(true);}
function chooseRoom(id){if(!['prep','closed'].includes(G.phase)){say('Troque o cenário antes de abrir ou depois de fechar.');return;}if(!roomUnlocked(id))return;G.room=Number(id);save();roomMenu();}
function roomMenu(){if(G.task||G.game||G.fightTarget!==null){say('Termine a ação atual antes de escolher um cenário.');return;}openDialog('Os cenários da bodega',`<p>${improvementCount()} melhorias compradas. Um novo cenário a cada quatro melhorias; troque antes de abrir ou após fechar.</p><div class="room-grid">${roomChoices()}</div><div class="actions"><button data-act="close">Voltar à bodega</button></div>`,'rooms');}
function announceRoomUnlock(){const n=improvementCount(),r=ROOMS.find(r=>r.improvements===n&&n>0);if(r)say(r.name+' desbloqueada! Escolha em Celular → Trocar cenário antes de abrir.');}

function refillMate(){if(!started||paused||modal||phoneOpen||G.task)return;const bag=FIXED.find(f=>f.id==='bag');if(distRect(G.player,bag)>65){say('Vá ao balcão de erva-mate e aperte F para abastecer a cuia.');return;}if(G.hands.some(Boolean)){say('Apoie os pedidos para abastecer a cuia.');return;}const qty=Math.min(500-G.mateHerb,G.stock.erva);if(qty<=0){say(G.mateHerb>=500?'A cuia já está cheia: 500 g.':'Faltou erva-mate. Peça ao fornecedor.');return;}G.stock.erva-=qty;G.mateHerb+=qty;G.mateEmptyNotified=false;G.stats.cogs+=qty*G.avg.erva;AudioEngine.grain();effect('Cuia: '+G.mateHerb+' / 500 g',G.player.x,G.player.y-95,'#d5ed95');save();refreshHUD();}

function wetFootsteps(actor,distance){if(G.event.id!=='chuva'||actor.state==='leave'||!['open','closing'].includes(G.phase))return;actor.wetDistance=(actor.wetDistance||0)+distance;actor.dripDistance=(actor.dripDistance||0)+distance;if(actor.wetDistance>750||actor.dripDistance<62)return;actor.dripDistance=0;const x=actor.x,y=actor.y;if(G.puddles.length>=24||G.puddles.some(p=>Math.hypot(p.x-x,p.y-y)<30)||!canWalk(x,y))return;G.puddles.push({id:G.next++,x,y,r:18+Math.random()*6});}

function footballUnlocked(day=G.day){return day>=2;}
function isFootball(){return ['gremio','inter','grenal'].includes(G.event.id);}
function isDerbyGroup(g){return G.event.id==='grenal'&&g?.size>1&&new Set(g.members?.map(p=>PEOPLE[p].team)).size>1;}
function footballTick(dt){if(!isFootball()||G.phase!=='open')return;const e=G.event;if(G.elapsed>=75&&!e.fired.halftime){e.fired.halftime=true;for(const g of G.groups.filter(g=>['seated','chat'].includes(g.state))){addDinerRound(g);}say('Intervalo na TV! Sai mais uma rodada para as mesas.');AudioEngine.crowd();}if(fightsAllowed()&&e.id==='grenal')for(const t of availableTables()){const g=G.groups.find(g=>g.id===t.group);if(!g||!isDerbyGroup(g)||!['seated','chat'].includes(g.state)||t.fight||t.fightCooldown)continue;g.derbyAge=(g.derbyAge||0)+dt;if(g.derbyAge>=18){g.derbyAge=0;triggerFight(t);}}}
function drawTelevision(){if(!G.tv)return;wood(943,32,170,111,true);rect(951,39,154,88,'#152d26',4,'#b7a379');if(isFootball()){rect(958,45,140,75,'#487346');rect(961,48,134,69,'#487346',0,'#d9ddbd');ctx.strokeStyle='#d9ddbd';ctx.beginPath();ctx.moveTo(1028,48);ctx.lineTo(1028,117);ctx.stroke();ctx.beginPath();ctx.arc(1028,83,13,0,Math.PI*2);ctx.stroke();for(let i=0;i<6;i++){ellipse(976+i*21,74+Math.sin(frameClock+i)*18,3,5,i%2?'#e34842':'#83c4ec');}txt(G.event.id==='grenal'?'GRE-NAL':G.event.id==='gremio'?'GRÊMIO AO VIVO':'INTER AO VIVO',1028,132,11);}else txt('TV DA BODEGA',1028,82,13,'#d1c799');}
