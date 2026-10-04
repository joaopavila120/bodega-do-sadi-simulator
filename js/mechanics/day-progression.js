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

const CANCHA_DOOR={id:'cancha',x:1250,y:718,w:25,h:64,label:'Porta da cancha de bocha'};
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
 const x=1234,y=671;wood(x-5,y-7,48,110,true);rect(x,y,40,102,'#281a13',2,'#af8c57');wood(x+3,y+3,31,94);rect(x+8,y+12,21,29,'#365847',2,'#906534');ellipse(x+12,y+66,3,4,'#e1bd64');
 wood(1196,633,80,32);rect(1199,636,74,26,'#e4bd78',3,'#9d6934');txt('CANCHA',1236,643,11,'#57351d','center','Arial',false);txt('DE BOCHA',1236,655,11,'#57351d','center','Arial',false);
}

function updateContextActions(){
 const n=nearest(),table=nearTrucoTable(),refill=nearMateHerb();
 $('enterCanchaButton').classList.toggle('hidden',!nearCanchaDoor()||!!G.task);
 $('playTrucoButton').classList.toggle('hidden',!table||!!G.task);
 $('playTrucoButton').disabled=!!table?.fight;
 $('refillMateContext').classList.toggle('hidden',!refill||!!G.task);
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
 openDialog('Parabéns! Uma TV para sua bodega',`<p>Parabéns, você ganhou um sorteio do comércio local e ganhou uma TV, agora você poderá passar os jogos do Grêmio e do Inter na bodega.</p><p>A partir do dia 2, jogos dos dois times e Gre-Nal entram no sorteio dos eventos.</p><button class="primary" data-act="tvAwardClose">Ver o resultado do primeiro dia</button>`,'tvAward');
}
