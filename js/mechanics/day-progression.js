'use strict';

function difficulty(day=G.day){return {maxGroup:day<3?2:day<5?3:4,maxItems:day<3?1:day<7?2:3,fights:day>=5,label:day===1?'Tutorial':day<3?'Primeiros fregueses':day<5?'Casa conhecida':day<7?'Casa movimentada':'Bodega cheia'};}
function restaurantGroupSize(person){
 const d=difficulty(),pair=PEOPLE[person].partner&&Math.random()<.8;
 if(d.maxGroup===2)return pair||Math.random()<.55?2:1;
 const r=Math.random();return r<.12?1:r<.43?2:d.maxGroup===3||r<.7?3:4;
}
function fightsAllowed(){return G.day>1&&(G.event.id==='campeonato'||difficulty().fights);}
function fixedTableModes(state=G){for(const t of state.tables){t.mode=t.id===1||state.event.id==='campeonato'&&['open','closing'].includes(state.phase)?'truco':'restaurant';delete t.previousMode;}}


function plannedEvent(){if(!G.nextEvent){G.nextEvent=eventForDay(G.day+1,G);save();}return G.nextEvent;}
function notifyEmptyMate(){if(G.mateHerb<100&&!G.mateEmptyNotified){G.mateEmptyNotified=true;say('Acabou seu mate, traga mais erva para sua cuia.');}}
function nearMateHerb(){return G.mateHerb<500&&distRect(G.player,FIXED.find(f=>f.id==='bag'))<=65;}

// A porta da cancha está pintada no cenário, na parede direita (room2.png).
const CANCHA_DOOR={id:'cancha',x:1485,y:300,w:80,h:80,label:'Porta da cancha de bocha'};
const CANCHA_DOOR_SHAPE=[[1485,161],[1563,185],[1563,372],[1485,324]];
function nearCanchaDoor(){return distRect(G.player,CANCHA_DOOR)<62;}
function nearTrucoTable(){return availableTables().filter(isTableTruco).find(t=>distRect(G.player,t)<65);}
function enterCancha(){
 if(!started||G.task||G.game||G.bocce||!nearCanchaDoor()){say('Vá até a porta à direita do salão para entrar na cancha.');return;}
 if(phoneOpen)togglePhone(false);G.atCancha=true;G.player.walk=false;keys.clear();pointerHold=false;modal=null;paused=false;$('overlay').classList.add('hidden');showCanchaLobby();save();
}
function showCanchaLobby(){
 $('bocceReputation').textContent=sportStanding('bocha');
 $('bocceScreen').classList.remove('hidden');document.body.classList.add('playing-bocce');
 $('canchaLobby').classList.remove('hidden');$('bocceMatchUI').classList.add('hidden');bocceCanvas.focus();drawCanchaLobby();
}
function drawCanchaLobby(){
 const c=bocceContext,cw=bocceCanvas.clientWidth,ch=bocceCanvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
 if(bocceCanvas.width!==Math.round(cw*dpr)||bocceCanvas.height!==Math.round(ch*dpr)){bocceCanvas.width=Math.round(cw*dpr);bocceCanvas.height=Math.round(ch*dpr);}
 c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#20180f';c.fillRect(0,0,cw,ch);
 const scale=Math.min(cw/1672,ch/941);c.translate((cw-1672*scale)/2,(ch-941*scale)/2);c.scale(scale,scale);c.drawImage(bocceArt,0,0,1672,941);
 drawCharacterPortrait(c,avatarSprite(),250,886,240);drawCharacterPortrait(c,PEOPLE[sportPeople()[0]].sprite,1410,820,205);
}
function leaveCancha(){if(G.bocce)return;G.atCancha=false;$('bocceScreen').classList.add('hidden');document.body.classList.remove('playing-bocce');closeDialog(true);save();refreshHUD();}
function drawCanchaDoor(){
 if(!started||!nearCanchaDoor())return;
 ctx.save();ctx.beginPath();CANCHA_DOOR_SHAPE.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
 ctx.fillStyle='#ffdb6830';ctx.fill();ctx.strokeStyle='#fce497';ctx.lineWidth=3;ctx.stroke();ctx.restore();
 txt('E · entrar na cancha',1524,402,13,'#fff4c4');
}

function updateContextActions(){
 const n=nearest(),table=nearTrucoTable(),refill=nearMateHerb();
 $('enterCanchaButton').classList.toggle('hidden',!nearCanchaDoor()||!!G.task);
 $('playTrucoButton').classList.toggle('hidden',!table||!!G.task);
 $('playTrucoButton').disabled=!!table?.fight;
 $('refillMateContext').classList.toggle('hidden',!refill||!!G.task);
 $('refuseFiadoButton').classList.toggle('hidden',!fiadoFirst()||!!G.task);
 $('hint').classList.toggle('hidden',!G.task&&!n&&!refill&&!nearCanchaDoor()&&G.day>1);
 if(refill&&!G.task)$('hint').innerHTML='<strong>F</strong> Encher sua cuia de erva';
 const toast=G.toastLesson&&!G.toastLesson.done&&G.toastLesson.actor&&G.day>=G.toastLesson.day;
 $('tutorialHint').classList.toggle('hidden',!toast&&(G.day!==1||phoneOpen||!!G.task||!!G.dialogue));if(toast)$('tutorialHint').textContent='Torrada: pegue um pão de xis e coloque na chapa junto do salame. Use o mesmo espaço, aguarde 6 s, retire e sirva com E.';
 if(G.day===1)$('tutorialHint').innerHTML=tutorialHint();
 $('gameSidebar').classList.toggle('focused-task',['weigh','pour'].includes(G.task?.type)||G.fightTarget!==null);
}




function awardTelevision(){
 if(G.day!==1||G.tv)return false;G.tv=true;G.tvAwardPending=true;return true;
}
function showTelevisionAward(){
 openDialog('Parabéns! Uma TV para sua bodega',`<p>Parabéns, você ganhou um sorteio do comércio local e ganhou uma TV, agora você poderá passar os jogos do Grêmio e do Inter na bodega.</p><p>Ela fica guardada e vai para a parede só nos dias de jogo.</p><p>A partir do dia 2, jogos dos dois times e Gre-Nal entram no sorteio dos eventos.</p><button class="primary" data-act="tvAwardClose">Ver o resultado do primeiro dia</button>`,'tvAward');
}
