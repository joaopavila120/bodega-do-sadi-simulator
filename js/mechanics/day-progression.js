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

// A porta da cancha (fechada, com placa) está pintada no cenário, na parede direita (room2.png).
const CANCHA_DOOR={id:'cancha',x:1485,y:300,w:80,h:80,label:'Porta da cancha de bocha'};
const CANCHA_DOOR_SHAPE=[[1485,181],[1564,207],[1564,372],[1485,324]];
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
function leaveCancha(){if(G.bocce)return;G.atCancha=false;$('bocceScreen').classList.add('hidden');document.body.classList.remove('playing-bocce');closeDialog(true);save();refreshHUD();if(G.phase==='closed'&&G.giftQueue?.length)startGiftVisit();}
function drawCanchaDoor(){
 if(!started||!nearCanchaDoor())return;
 ctx.save();ctx.beginPath();CANCHA_DOOR_SHAPE.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
 ctx.fillStyle='#ffdb6830';ctx.fill();ctx.strokeStyle='#fce497';ctx.lineWidth=3;ctx.stroke();ctx.restore();
 rect(1440,140,170,30,'#2b1c10e6',7,'#fce497');txt('Aperte E para entrar',1525,155,14,'#fff4c4');
}

function updateContextActions(){
 const n=nearest(),table=nearTrucoTable();
 $('enterCanchaButton').classList.toggle('hidden',!nearCanchaDoor()||!!G.task);
 $('playTrucoButton').classList.toggle('hidden',!table||!!G.task);
 $('playTrucoButton').disabled=!!table?.fight;
 $('refuseFiadoButton').classList.toggle('hidden',!fiadoFirst()||!!G.task);
 $('hint').classList.toggle('hidden',!!(G.lasso||G.bocce||scene)||nearShopDoor()&&!G.task||!G.task&&!n&&!nearCanchaDoor()&&!nearShopDoor()&&G.day>1);
 const toast=G.toastLesson&&!G.toastLesson.done&&G.toastLesson.actor&&G.day>=G.toastLesson.day;
 $('tutorialHint').classList.toggle('hidden',!toast&&(G.day!==1||!!scene||(phoneOpen&&!tutorialStockMissing().length)||!!G.task||!!G.dialogue));if(toast)$('tutorialHint').textContent='Torrada: pegue um pão de xis e coloque na chapa junto do salame. Use o mesmo espaço, aguarde 6 s, retire e sirva com E.';
 if(G.day===1)setHTML($('tutorialHint'),tutorialHint());
 if((costelaoTutorialActive()||costelaoPrepFirst())&&!scene){$('tutorialHint').classList.remove('hidden');$('tutorialHint').innerHTML=costelaoTutorialHint();}
 else if(!toast&&doorReminder()){$('tutorialHint').classList.remove('hidden');setHTML($('tutorialHint'),doorReminder());}
 $('gameSidebar').classList.toggle('lasso-mode',!!G.lasso);
 $('gameSidebar').classList.toggle('focused-task',['weigh','pour'].includes(G.task?.type)||G.fightTarget!==null);
}




function awardTelevision(){
 if(G.day!==1||G.tv)return false;G.tv=true;G.tvAwardPending=true;return true;
}
// Fim do primeiro dia: o vizinho Valter entra e dá a TV de presente (em cena; sem cenas, num quadro).
function showTelevisionAward(){
 if(scenesEnabled()){playScene('tv',()=>{G.tvAwardPending=false;save();showReport();});return;}
 openDialog('Presente do vizinho: uma TV!',`<div class="rpg-speaker">${portraitHTML(PEOPLE.findIndex(p=>p.id==='valter'),88)}<div><p><b>Valter</b>: “Bodega que se preze precisa passar os Gre-Nal! Me criei junto com o teu pai, guri. Toma essa TV pra começar.”</p><p>Ela fica guardada e vai para a parede nos dias de jogo do Grêmio, do Inter e Gre-Nal.</p></div></div><div class="callout"><b>Amizade rende presente</b><br>Atendendo bem, jogando truco ou bocha com os fregueses conhecidos, a amizade cresce e eles trazem presentes no fim do dia.</div><button class="primary" data-act="tvAwardClose">Ver o resultado do primeiro dia</button>`,'tvAward');
}

// Bodega ou costelão ainda fechados (ou o dia já encerrado): um aviso no alto da tela lembra de ir até a porta.
function doorReminder(){
 if(!started||scene||G.lasso||G.bocce||G.atCancha||G.game||G.task||G.dialogue||tutorialActive()||costelaoPrepFirst()||!['prep','closed'].includes(G.phase))return '';
 if(G.phase==='closed')return '<b>Expediente encerrado</b><p>Vá até a <b>porta</b>, embaixo, e aperte <span class="keycap">E</span> para seguir para o próximo dia.</p>';
 const campo=isCampo();return '<b>'+(campo?'O costelão está fechado':'A bodega está fechada')+'</b><p>Quando estiver pronto, vá até a <b>porta</b>, embaixo, e aperte <span class="keycap">E</span> para abrir'+(campo?' o domingo':'')+'.</p>';
}
