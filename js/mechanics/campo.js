// Costelão de domingo (cenário aberto, fogo de chão, maionese) e laçada de sábado.
'use strict';

const CAMPO_IMG='assets/images/campo/';
function campoImage(file){const image=new Image();image.src=CAMPO_IMG+file;return image;}
const campoArt=campoImage('campo.png'),fogoArt=campoImage('fogo.png'),espetoArt=campoImage('espeto.png'),boisArt=campoImage('bois.png'),lenhaArt=campoImage('lenha.png');
const CAMPO_ART=[[campoArt,'campo.png'],[fogoArt,'fogo.png'],[espetoArt,'espeto.png'],[boisArt,'bois.png'],[lenhaArt,'lenha.png']];
const BOI_COATS=['angus','colorado','holandes','hereford','charoles','crioulo'],BOI_W=72,BOI_H=52,ESPETO_W=44,ESPETO_H=96;
const BOI_COST=120,MANTAS_PER_BOI=3,MANTA_GRAMS=2000,MIN_LASSO=3,MANTA_BUY_COST=95;
// Cada lado da manta leva COOK_SIDE s (com o fogo forte) para chegar ao ponto; passa do ponto e queima em BURN_AT.
const COOK_SIDE=18,BURN_AT=1.8,PERFECT_MAX=1.35,ESPETO_SCALE=1.95;
// O fogo de chão gasta lenha: sem lenha sobram só brasas e a costela quase não assa.
const FUEL_START=70,FUEL_BURN=.7,LENHA_FUEL=35,CHOP_HITS=3,CHOP_TIME=1.1,CHOP_ZONE=[.62,.84];
function fireFuel(){return campoState().fuel;}
function fireHeat(){const f=fireFuel();return f<=0?.1:.35+.65*Math.min(1,f/50);}

function isCampo(state=G){return state?.event?.id==='costelao'||!!state?.lasso;}
function campoState(state=G){state.campo??={espetos:[null,null,null,null],bowl:{ovo:false,azeite:false,cost:0},tutorial:null,fuel:FUEL_START};state.campo.fuel??=FUEL_START;state.campo.espetos??=[null,null,null,null];state.campo.bowl??={ovo:false,azeite:false,cost:0};return state.campo;}

// Fogo ao fundo, espetos plantados na frente dele, mesas de apoio à direita.
const CAMPO_FIXED=[
 {id:'fogo',x:290,y:455,w:470,h:110,label:'Fogo de chão'},
 {id:'espeto:0',x:318,y:548,w:72,h:112,label:'Espeto 1'},{id:'espeto:1',x:428,y:548,w:72,h:112,label:'Espeto 2'},
 {id:'espeto:2',x:538,y:548,w:72,h:112,label:'Espeto 3'},{id:'espeto:3',x:648,y:548,w:72,h:112,label:'Espeto 4'},
 {id:'costela_crua',x:110,y:560,w:100,h:62,label:'Mantas de costela crua'},
 {id:'lenha',x:96,y:688,w:124,h:78,label:'Pilha de lenha e cepo'},
 {id:'lenha',x:96,y:688,w:124,h:78,label:'Pilha de lenha e cepo'},
 {id:'tabua',x:820,y:560,w:100,h:62,label:'Tábua de corte'},
 {id:'maionese',x:958,y:560,w:86,h:62,label:'Tigela da maionese'},
 {id:'bin:ovo',x:1066,y:560,w:72,h:57,label:'Ovos'},{id:'bin:azeite',x:1150,y:560,w:72,h:57,label:'Óleo vegetal'},
 {id:'bottle:refri',x:1262,y:530,w:62,h:88,label:'Caixa térmica · refrigerante'},
 {id:'mate',x:860,y:740,w:66,h:54,label:'Chimarrão · segure E'},
 {id:'service',x:1150,y:770,w:200,h:55,label:'Balcão do costelão'},
 {id:'trash',x:50,y:815,w:48,h:52,label:'Lixeira'}
];

// ---------- Espetos ----------
function espetoReady(e){return e&&!e.burned&&e.heat[0]>=1&&e.heat[1]>=1;}
function campoTick(dt){
 if(!isCampo()||G.lasso)return;
 const c=campoState(),before=c.fuel;
 c.fuel=Math.max(0,c.fuel-FUEL_BURN*dt);
 if(before>=25&&c.fuel<25){AudioEngine.warning();effect('O fogo está baixando: traga lenha!',525,430,'#ffc875');}
 if(before>0&&c.fuel<=0){effect('Só brasa: a costela quase não assa',525,430,'#ff9a70');}
 const heat=fireHeat();
 c.espetos.forEach((e,i)=>{
  if(!e||e.burned)return;
  const s=e.fire;e.heat[s]+=dt*heat/COOK_SIDE;
  if(e.heat[s]>=1&&!e.doneSide?.[s]){e.doneSide??=[false,false];e.doneSide[s]=true;AudioEngine.ready();effect(espetoReady(e)?'No ponto! Retire com E':'Lado pronto · vire com E',354+i*110,520,'#d9ffa3');}
  if(e.heat[s]>=1.45&&!e.warned?.[s]){e.warned??=[false,false];e.warned[s]=true;AudioEngine.warning();effect('Vai queimar!',354+i*110,520,'#ffc875');}
  if(e.heat[s]>=BURN_AT){e.burned=true;AudioEngine.bad();effect('Queimou!',354+i*110,520,'#ff9872');}
 });
}
function useEspeto(i){
 const c=campoState(),e=c.espetos[i],h=held();
 if(!e){
  if(h?.key!=='costela_crua'){say(h?'No espeto vai a manta de costela crua.':'Pegue uma manta de costela crua na mesa ao lado do fogo.');return;}
  takeHeld();c.espetos[i]={heat:[0,0],fire:0,burned:false,cost:h.cost,turns:0};AudioEngine.sizzle();costelaoTutorialEvent('espeto');save();return;
 }
 if(e.burned){if(!freeHand()){say('Libere as mãos para tirar a costela queimada.');return;}putHeld({id:G.next++,kind:'ingredient',key:'costela_assada',cost:e.cost,burned:true,ready:false});c.espetos[i]=null;say('Queimou: leve à lixeira.');save();return;}
 if(espetoReady(e)){
  if(!freeHand()){say('Libere as mãos para retirar a costela.');return;}
  putHeld({id:G.next++,kind:'ingredient',key:'costela_assada',cost:e.cost,ready:true,perfect:Math.max(...e.heat)<PERFECT_MAX});
  c.espetos[i]=null;AudioEngine.glass();effect('Costela no ponto!',G.player.x,G.player.y-100,'#e1ff9e');costelaoTutorialEvent('retirar');save();return;
 }
 // Virar: o lado que estava no fogo vem para a frente.
 const wasDone=e.heat[e.fire]>=1;e.fire=1-e.fire;e.turns++;AudioEngine.sizzle();effect('Virou!',G.player.x,G.player.y-100);
 if(wasDone)costelaoTutorialEvent('virar');save();
}

// ---------- Tábua, mantas e maionese ----------
function useCostelaCrua(){if(!freeHand()){say('Libere as mãos para pegar a manta.');return;}const item=consumeStock('costela_crua');if(!item){say('Acabaram as mantas. Os bois são laçados no sábado.');return;}putHeld(item);AudioEngine.tick();save();}
function useTabua(){
 const h=held();
 if(h?.key==='costela_assada'){
  if(h.burned){say('Costela queimada vai para a lixeira.');return;}
  takeHeld();const units=G.stock.costela;G.avg.costela=(G.avg.costela*units+h.cost)/(units+MANTA_GRAMS);G.stock.costela+=MANTA_GRAMS;
  effect('+2 kg de costela na tábua',G.player.x,G.player.y-100,'#f6e4a8');AudioEngine.chop();costelaoTutorialEvent('tabua');save();return;
 }
 if(h){say('Traga a costela assada do espeto ou venha com as mãos livres para cortar.');return;}
 if(G.stock.costela<=0){say('A tábua está vazia: retire uma costela no ponto do espeto.');return;}
 startWeigh('costela','tabua');
}
function useMaionese(){
 const b=campoState().bowl,h=held();
 if(h){
  if(h.key==='ovo'&&!h.ready&&!h.burned){if(b.ovo){say('O ovo já está na tigela. Agora o óleo.');return;}takeHeld();b.ovo=true;b.cost+=h.cost;AudioEngine.tick();save();return;}
  if(h.key==='azeite'){if(b.azeite){say('O óleo já está na tigela. Agora o ovo.');return;}takeHeld();b.azeite=true;b.cost+=h.cost;AudioEngine.tick();save();return;}
  say('Na tigela vão ovo e óleo.');return;
 }
 if(b.ovo&&b.azeite){startMix();return;}
 if(G.stock.maionese>0){readyProduct('maionese');return;}
 say(b.ovo||b.azeite?'Falta '+(b.ovo?'o óleo':'o ovo')+' na tigela.':'Traga um ovo e o óleo para a tigela.');
}
function startMix(){G.task={type:'mix',target:'maionese',progress:0,last:null,time:0};$('mixUI').classList.remove('hidden');updateMixUI();}
// Depois de começar com E, cada toque em A ou E bate a maionese.
function mixKey(k){
 const t=G.task;if(t?.type!=='mix')return;if(!['a','e'].includes(k))return;
 t.progress+=.075;t.last=k;AudioEngine.noise(.05,.12,1600);
 if(t.progress>=1)finishMix();else updateMixUI();
}
function mixTick(dt){const t=G.task;if(t?.type!=='mix')return;t.time+=dt;t.progress=Math.max(0,t.progress-.1*dt);updateMixUI();}
function updateMixUI(){const t=G.task;if(t?.type!=='mix')return;$('mixFill').style.width=Math.round(t.progress*100)+'%';$('mixStatus').textContent=t.progress<.3?'Aperte A e E repetidamente':t.progress<.75?'Está engrossando… continue!':'Quase no ponto!';}
function finishMix(){
 const b=campoState().bowl,n=3,units=G.stock.maionese;
 G.avg.maionese=(G.avg.maionese*units+b.cost)/(units+n);G.stock.maionese+=n;b.ovo=b.azeite=false;b.cost=0;
 G.task=null;$('mixUI').classList.add('hidden');AudioEngine.scaleDone();effect('Maionese pronta · 3 porções',G.player.x,G.player.y-100,'#fff2b0');costelaoTutorialEvent('maionese');save();
}
function cancelMix(){if(G.task?.type!=='mix')return;G.task=null;$('mixUI').classList.add('hidden');say('Ovo e óleo continuam na tigela.');}

// ---------- Lenha: rachar no cepo (3 golpes no ponto) e levar ao fogo ----------
function startChop(){if(!freeHand()){say('Libere as mãos para pegar o machado.');return;}G.task={type:'chop',target:'lenha',time:0,hits:0,swinging:false};$('chopUI').classList.remove('hidden');updateChopUI();}
function chopTick(dt,holding,n){
 const t=G.task;if(phoneOpen||!n||n.id!=='lenha'){abortChop();return;}
 if(holding){t.swinging=true;t.time+=dt;if(t.time/CHOP_TIME>1.25)chopRelease();}
 else if(t.swinging)chopRelease();
 updateChopUI();
}
function chopRelease(){
 const t=G.task;if(t?.type!=='chop'||!t.swinging)return;
 const fill=t.time/CHOP_TIME,good=fill>=CHOP_ZONE[0]&&fill<=CHOP_ZONE[1];t.swinging=false;t.time=0;
 if(good){t.hits++;AudioEngine.chop();burst(G.player.x+30,G.player.y-40);effect('Toc! '+t.hits+'/'+CHOP_HITS,G.player.x,G.player.y-110,'#e1ff9e');}
 else{AudioEngine.bad();effect(fill<CHOP_ZONE[0]?'Golpe fraco':'Passou do ponto',G.player.x,G.player.y-110,'#ffc0a0');}
 if(t.hits>=CHOP_HITS){G.task=null;$('chopUI').classList.add('hidden');putHeld({id:G.next++,kind:'ingredient',key:'lenha',cost:0,ready:true});AudioEngine.ready();effect('Lenha rachada! Leve ao fogo',G.player.x,G.player.y-130,'#fff2b0');save();return;}
 updateChopUI();
}
function abortChop(){if(G.task?.type!=='chop')return;G.task=null;$('chopUI').classList.add('hidden');}
function updateChopUI(){const t=G.task;if(t?.type!=='chop')return;$('chopTitle').textContent='Rachando lenha · golpe '+Math.min(CHOP_HITS,t.hits+1)+' de '+CHOP_HITS;$('chopFill').style.width=Math.min(100,t.time/CHOP_TIME*100)+'%';}
function feedFire(){const c=campoState();takeHeld();c.fuel=Math.min(100,c.fuel+LENHA_FUEL);AudioEngine.sizzle();burst(525,500);effect('Fogo avivado · '+Math.round(c.fuel)+'%',525,430,'#ffd56a');costelaoTutorialEvent('lenha');save();}
function buyManta(){if(!hasCash(MANTA_BUY_COST)){say('Uma manta do açougue custa '+money(MANTA_BUY_COST)+'.');AudioEngine.bad();return;}spendCash(MANTA_BUY_COST);G.stats.purchases+=MANTA_BUY_COST;G.deliveries.push({id:G.next++,key:'costela_crua',qty:1,cost:MANTA_BUY_COST,left:8,total:8});AudioEngine.phone();say('Manta encomendada no açougue: chega em 8 s.');save();if(phoneOpen)renderPhone();}

// ---------- Lenha: rachar no cepo (3 golpes no ponto) e levar ao fogo ----------
function startChop(){if(!freeHand()){say('Libere as mãos para pegar o machado.');return;}G.task={type:'chop',target:'lenha',time:0,hits:0,swinging:false};$('chopUI').classList.remove('hidden');updateChopUI();}
function chopTick(dt,holding,n){
 const t=G.task;if(phoneOpen||!n||n.id!=='lenha'){abortChop();return;}
 if(holding){t.swinging=true;t.time+=dt;if(t.time/CHOP_TIME>1.25)chopRelease();}
 else if(t.swinging)chopRelease();
 updateChopUI();
}
function chopRelease(){
 const t=G.task;if(t?.type!=='chop'||!t.swinging)return;
 const fill=t.time/CHOP_TIME,good=fill>=CHOP_ZONE[0]&&fill<=CHOP_ZONE[1];t.swinging=false;t.time=0;
 if(good){t.hits++;AudioEngine.chop();burst(G.player.x+30,G.player.y-40);effect('Toc! '+t.hits+'/'+CHOP_HITS,G.player.x,G.player.y-110,'#e1ff9e');}
 else{AudioEngine.bad();effect(fill<CHOP_ZONE[0]?'Golpe fraco':'Passou do ponto',G.player.x,G.player.y-110,'#ffc0a0');}
 if(t.hits>=CHOP_HITS){G.task=null;$('chopUI').classList.add('hidden');putHeld({id:G.next++,kind:'ingredient',key:'lenha',cost:0,ready:true});AudioEngine.ready();effect('Lenha rachada! Leve ao fogo',G.player.x,G.player.y-130,'#fff2b0');save();return;}
 updateChopUI();
}
function abortChop(){if(G.task?.type!=='chop')return;G.task=null;$('chopUI').classList.add('hidden');}
function updateChopUI(){const t=G.task;if(t?.type!=='chop')return;$('chopTitle').textContent='Rachando lenha · golpe '+Math.min(CHOP_HITS,t.hits+1)+' de '+CHOP_HITS;$('chopFill').style.width=Math.min(100,t.time/CHOP_TIME*100)+'%';}
function feedFire(){const c=campoState();takeHeld();c.fuel=Math.min(100,c.fuel+LENHA_FUEL);AudioEngine.sizzle();burst(525,500);effect('Fogo avivado · '+Math.round(c.fuel)+'%',525,430,'#ffd56a');costelaoTutorialEvent('lenha');save();}
function buyManta(){if(!hasCash(MANTA_BUY_COST)){say('Uma manta do açougue custa '+money(MANTA_BUY_COST)+'.');AudioEngine.bad();return;}spendCash(MANTA_BUY_COST);G.stats.purchases+=MANTA_BUY_COST;G.deliveries.push({id:G.next++,key:'costela_crua',qty:1,cost:MANTA_BUY_COST,left:8,total:8});AudioEngine.phone();say('Manta encomendada no açougue: chega em 8 s.');save();if(phoneOpen)renderPhone();}

function campoInteract(n){
 if(!isCampo())return false;const[id,arg]=n.id.split(':');
 if(id==='espeto'){useEspeto(Number(arg));return true;}
 if(id==='costela_crua'){useCostelaCrua();return true;}
 if(id==='tabua'){useTabua();return true;}
 if(id==='maionese'){useMaionese();return true;}
 if(id==='lenha'){startChop();return true;}
 if(id==='fogo'){if(held()?.key==='lenha'){feedFire();return true;}say('O fogo é alimentado com lenha rachada no cepo. As mantas vão nos espetos.');return true;}
 return false;
}
function campoHint(n){
 if(!isCampo()||!n?.id)return null;const[id,arg]=n.id.split(':');
 if(id==='espeto'){const e=campoState().espetos[Number(arg)];if(!e)return '<strong>E</strong> colocar manta de costela crua';if(e.burned)return '<strong>E</strong> retirar costela queimada';if(espetoReady(e))return '<strong>E</strong> retirar a costela no ponto';return '<strong>E</strong> virar a manta · lado no fogo: '+Math.round(Math.min(1,e.heat[e.fire])*100)+'%';}
 if(id==='costela_crua')return '<strong>E</strong> pegar manta crua · '+G.stock.costela_crua+' mantas';
 if(id==='tabua'){const c=G.shop.find(c=>c.state==='queue'&&c.pid==='costela');return held()?.key==='costela_assada'?'<strong>E</strong> apoiar a costela na tábua':'<strong>Segure E</strong> cortar '+(c?formatWeight(c.grams):'costela')+' · '+formatWeight(G.stock.costela)+' na tábua';}
 if(id==='maionese'){const b=campoState().bowl;return b.ovo&&b.azeite?'<strong>E</strong> bater a maionese (depois A e E repetidamente)':G.stock.maionese>0&&!held()?'<strong>E</strong> pegar maionese · '+G.stock.maionese+' porções':'Tigela: '+(b.ovo?'ovo ✓':'falta ovo')+' · '+(b.azeite?'óleo ✓':'falta óleo');}
 if(id==='fogo')return held()?.key==='lenha'?'<strong>E</strong> colocar lenha no fogo':'Fogo de chão · '+Math.round(fireFuel())+'% de lenha'+(fireFuel()<25?' · traga lenha!':'');
 if(id==='lenha')return '<strong>E</strong> rachar lenha · segure e solte na faixa verde · '+CHOP_HITS+' golpes';
 return null;
}
function campoOrder(){
 const options=[];
 if(G.stock.costela_crua>0||G.stock.costela>0||campoState().espetos.some(Boolean))options.push(['costela',.62]);
 if(G.stock.maionese>0||G.stock.ovo>0&&G.stock.azeite>0)options.push(['maionese',.24]);
 if(G.stock.refri>0)options.push(['refri',.14]);
 if(!options.length)return null;let r=Math.random()*options.reduce((n,o)=>n+o[1],0);
 for(const[k,w]of options){if((r-=w)<=0)return k;}return options[0][0];
}

// ---------- Desenho do campo ----------
const HERD=Array.from({length:9},(_,i)=>({x:90+i*170+(i%2)*40,y:394+(i%3)*9,coat:i%6,dir:i%2?1:-1,speed:6+(i%4)*3,graze:i%3===0}));
function drawBoi(coat,frame,x,y,scale=1.6,flip=false,alpha=1){
 if(!boisArt.complete||!boisArt.naturalWidth)return;const w=BOI_W*scale,h=BOI_H*scale;
 ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;ctx.translate(x,y);if(flip)ctx.scale(-1,1);
 ctx.drawImage(boisArt,frame*BOI_W,coat*BOI_H,BOI_W,BOI_H,-w/2,-h+4,w,h);ctx.restore();
}
function drawCampoBackground(){
 if(campoArt.complete&&campoArt.naturalWidth){ctx.imageSmoothingEnabled=false;ctx.drawImage(campoArt,0,0,W,H);ctx.imageSmoothingEnabled=true;}else rect(0,0,W,H,'#6ca040');
 // Rebanho pastando atrás da cerca
 for(const c of HERD){
  if(!c.graze){c.x+=c.dir*c.speed*(frameClock-(c.clock??frameClock));if(c.x<40||c.x>W-40){c.dir*=-1;c.x=clamp(c.x,40,W-40);}}
  c.clock=frameClock;if(Math.sin(frameClock*.2+c.x)>.92)c.graze=!c.graze;
  drawBoi(c.coat,c.graze?2:Math.floor(frameClock*2+c.x)%2,c.x,c.y,.75,c.dir<0);
 }
 if(!G.lasso){rect(ENTRY.x-70,H-25,139,23,'#624c2e',3,'#ae9253');txt('COSTELÃO',ENTRY.x,H-14,11,'#f0d088');}
}
function drawEspetoCell(cell,x,y,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(espetoArt,cell*ESPETO_W,0,ESPETO_W,ESPETO_H,x,y,ESPETO_W*ESPETO_SCALE,ESPETO_H*ESPETO_SCALE);ctx.restore();}
function drawCampoStation(f){
 if(!isCampo())return false;const{x,y,w,h}=f,[id,arg]=f.id.split(':');
 if(id==='fogo'){
  const fuel=fireFuel(),row=fuel>40?0:fuel>0?1:2,frame=Math.floor(frameClock*7)%4;ctx.save();ctx.imageSmoothingEnabled=false;
  if(fogoArt.complete&&fogoArt.naturalWidth)ctx.drawImage(fogoArt,frame*150,row*70,150,70,x-5,y-112,480,224);ctx.restore();
  rect(x+w/2-70,y-118,140,12,'#2a1d12',5,'#d2b982');rect(x+w/2-68,y-116,136*fuel/100,8,fuel<25?'#e0603a':'#f0a030',3);txt('Lenha '+Math.round(fuel)+'%',x+w/2,y-131,12,fuel<25?'#ffb08a':'#fff0c3');
  ctx.save();ctx.globalCompositeOperation='lighter';const fl=(.35+.65*Math.min(1,fuel/50))*(1+Math.sin(frameClock*9)*.06);const g=ctx.createRadialGradient(x+w/2,y+40,10,x+w/2,y+40,300*fl);g.addColorStop(0,'rgba(255,140,40,.22)');g.addColorStop(1,'rgba(255,140,40,0)');ctx.fillStyle=g;ctx.fillRect(x-200,y-260,w+400,520);ctx.restore();
  return true;
 }
 if(id==='espeto'){
  const e=campoState().espetos[Number(arg)],px=x+w/2-ESPETO_W*ESPETO_SCALE/2,py=y+h-ESPETO_H*ESPETO_SCALE+8;
  ellipse(x+w/2,y+h+2,26,7,'#24180c55');
  if(!e){drawEspetoCell(0,px,py);return true;}
  const front=1-e.fire,kind=front===0?0:1;
  if(e.burned)drawEspetoCell(5+kind,px,py);
  else{drawEspetoCell(1+kind,px,py);drawEspetoCell(3+kind,px,py,clamp(e.heat[front],0,1));if(e.heat[front]>1.25)drawEspetoCell(5+kind,px,py,clamp((e.heat[front]-1.25)/.55,0,1));}
  // Barras dos dois lados: verde = no ponto; vermelho = passando
  for(let s=0;s<2;s++){const v=e.heat[s],bx=x+4,by=y+h+8+s*10;rect(bx,by,w-8,7,'#2a1d12',3,'#d2b982');rect(bx+2,by+2,(w-12)*clamp(v/BURN_AT,0,1),3,v>=1.45?'#e0603a':v>=1?'#9ccc5a':'#e8b65d',1);rect(bx+2+(w-12)/BURN_AT,by,1,7,'#fff2c0');}
  txt(e.burned?'Queimou':espetoReady(e)?'Pronto ✓':e.heat[e.fire]>=1?'Vire!':'Assando',x+w/2,y-8,12,e.burned?'#ff9a70':espetoReady(e)?'#e2ffa8':e.heat[e.fire]>=1?'#ffd56a':'#fff0c3');
  if(!e.burned&&!espetoReady(e))for(let k=0;k<3;k++){const p=(frameClock*.5+k*.33)%1;ellipse(x+w/2+Math.sin(p*7+k)*8,y+20-p*50,4+p*5,5+p*6,`rgba(230,220,200,${.3*(1-p)})`);}
  return true;
 }
 if(id==='lenha'){ctx.save();ctx.imageSmoothingEnabled=false;if(lenhaArt.complete&&lenhaArt.naturalWidth)ctx.drawImage(lenhaArt,x-22,y+h-124,168,126);ctx.restore();if(G.task?.type==='chop')bar(x,y-24,w,G.task.hits/CHOP_HITS,'#e8b65d');return true;}
 if(id==='lenha'){ctx.save();ctx.imageSmoothingEnabled=false;if(lenhaArt.complete&&lenhaArt.naturalWidth)ctx.drawImage(lenhaArt,x-22,y+h-124,168,126);ctx.restore();if(G.task?.type==='chop')bar(x,y-24,w,G.task.hits/CHOP_HITS,'#e8b65d');return true;}
 if(id==='costela_crua'){counter(f,'wood');ctx.save();if(!G.stock.costela_crua)ctx.globalAlpha=.25;food('costela_crua',x+w/2,y+18,62);ctx.restore();rect(x+w/2-22,y+h-10,44,17,'#382e1f',3,'#b99250');txt(G.stock.costela_crua,x+w/2,y+h-1,13,G.stock.costela_crua?'#ffe4a9':'#ffad83');return true;}
 if(id==='tabua'){counter(f,'wood');ellipse(x+w/2,y+20,44,16,'#b8803e');ellipse(x+w/2,y+18,40,13,'#d4a058');if(G.stock.costela>0)food('costela',x+w/2,y+14,56);txt(formatWeight(G.stock.costela),x+w/2,y+h-8,12,'#fff0c3');if(G.task?.type==='weigh'&&G.task.target==='tabua')bar(x,y-14,w,G.task.grams/G.task.requested);return true;}
 if(id==='maionese'){
  const b=campoState().bowl;counter(f,'wood');ellipse(x+w/2,y+20,30,14,'#d8dde0');ellipse(x+w/2,y+17,26,10,'#eef2f2');
  if(b.ovo)ellipse(x+w/2-7,y+17,7,5,'#f2c23a');if(b.azeite)ellipse(x+w/2+7,y+18,8,4,'#c8b42a');
  if(G.task?.type==='mix'){ellipse(x+w/2,y+17,24,9,`rgb(${248-G.task.progress*20},${226+G.task.progress*10},${150+G.task.progress*40})`);ctx.save();ctx.translate(x+w/2,y+10);ctx.rotate(Math.sin(frameClock*18)*.5);rect(-2,-28,4,28,'#a8aeb4',2);ctx.restore();}
  else if(G.stock.maionese>0&&!b.ovo&&!b.azeite)food('maionese',x+w/2,y+14,46);
  txt(G.stock.maionese+' porç.',x+w/2,y+h-8,12,'#fff0c3');return true;
 }
 if(id==='bottle'){
  ellipse(x+w/2,y+h+6,w*.6,9,'#22180b55');rect(x,y+10,w,h-10,'#3a7ab8',6,'#1e4a78');rect(x+3,y+14,w-6,h-24,'#5a9ad0',4);rect(x-2,y,w+4,16,'#f2f4f2',5,'#9aa4aa');rect(x+w/2-10,y+5,20,4,'#9aa4aa',2);
  ctx.save();if(!G.stock.refri)ctx.globalAlpha=.25;food('refri',x+w/2,y+44,34);ctx.restore();rect(x+10,y+h-14,w-20,18,'#263425',3,'#c7b875');txt(G.stock.refri,x+w/2,y+h-5,13,'#fff0b8');return true;
 }
 return false;
}

// ---------- Tutorial do primeiro costelão ----------
const COSTELAO_STEPS=[
 {id:'espeto',title:'Costela no espeto',text:'Pegue uma manta de costela crua na mesa à esquerda do fogo e coloque num espeto com E.'},
 {id:'lenha',title:'Lenha no fogo',text:'O fogo está fraco e sem lenha a costela quase não assa. Vá ao cepo ao lado da pilha de lenha, segure E e solte na faixa verde três vezes. Depois leve a lenha rachada ao fogo e aperte E.'},
 {id:'virar',title:'Vire a manta',text:'Só o lado virado para o fogo assa. A barra de cima é a carne; a de baixo, o osso. Quando o lado no fogo ficar verde, aperte E no espeto para virar.'},
 {id:'retirar',title:'No ponto: retire',text:'Com os dois lados no ponto, aperte E para retirar. Não demore: passando da marca, queima.'},
 {id:'tabua',title:'Para a tábua',text:'Leve a costela assada à tábua de corte e aperte E. Cada manta rende 2 kg.'},
 {id:'cortar',title:'Corte no peso',text:'Chegou o primeiro freguês. Segure E na tábua, solte no peso pedido e entregue no balcão.'},
 {id:'maionese',title:'Maionese da casa',text:'Leve um ovo e o óleo até a tigela. Depois aperte E uma vez e bata apertando A e E repetidamente até dar o ponto.'},
 {id:'servir',title:'Maionese no balcão',text:'Pegue uma porção na tigela com E e entregue ao freguês no balcão.'}
];
function costelaoTutorial(){return campoState().tutorial;}
function costelaoTutorialActive(){const t=costelaoTutorial();return isCampo()&&!G.lasso&&!!t&&!t.done&&G.phase==='open';}
function costelaoStep(){return COSTELAO_STEPS[costelaoTutorial()?.step||0];}
function costelaoTutorialEvent(id){const t=costelaoTutorial();if(!costelaoTutorialActive()||costelaoStep()?.id!==id)return;costelaoAdvance();}
function costelaoAdvance(){const t=costelaoTutorial();t.step++;t.actor=null;if(t.step>=COSTELAO_STEPS.length){t.done=true;G.costelaoTaught=true;showBanner('Costelão liberado!','Agora a freguesia chega à vontade. Bom domingo!','level');}save();}
function costelaoTutorialTick(){
 const t=costelaoTutorial(),s=costelaoStep();if(!s)return;
 if(['cortar','servir'].includes(s.id)&&!t.actor&&!G.shop.some(c=>c.state==='queue')){
  const c=spawnShop(s.id==='cortar'?{pid:'costela',grams:500,training:true}:{pid:'maionese',training:true});if(c)t.actor=c.id;
 }
}
function costelaoTutorialDelivered(c){const t=costelaoTutorial();if(costelaoTutorialActive()&&c.id===t.actor){t.actor=null;costelaoAdvance();}}
function costelaoTutorialHint(){const t=costelaoTutorial(),s=costelaoStep();return s?'<b>Costelão '+(t.step+1)+' / '+COSTELAO_STEPS.length+' · '+s.title+'</b><p>'+s.text+'</p>':'';}
function costelaoWelcome(){
 const first=!G.costelaoTaught;
 if(first){campoState().tutorial={step:0,done:false,actor:null};campoState().fuel=22;if(G.stock.costela_crua<2){G.stock.costela_crua=2;G.avg.costela_crua=BOI_COST/MANTAS_PER_BOI;}}
 openDialog(first?'Primeiro costelão de domingo!':'Domingo de costelão',`<div class="event-card"><span class="event-symbol">🔥</span><div><h3>Fogo de chão aceso no campo</h3><p>Hoje a bodega vai para fora: costela no fogo de chão, maionese caseira e chimarrão. A freguesia vem comprar costela por peso.</p></div></div><div class="callout"><b>Como funciona</b><br>Manta crua no espeto · mantenha o fogo com lenha rachada no cepo · vire quando o lado no fogo ficar verde · com os dois lados no ponto, retire e leve à tábua · segure E para cortar no peso pedido. Maionese: ovo + óleo na tigela, E para começar e depois A e E repetidamente.</div><p>${first?'Hoje vamos passo a passo: os fregueses só chegam quando você estiver pronto.':'Mantas no estoque: <b>'+G.stock.costela_crua+'</b> · costela na tábua: <b>'+formatWeight(G.stock.costela)+'</b>. Faltou carne? Celular → Fornecedor → Campo.'}</p><button class="primary" data-act="close">Acender o fogo</button>`,'costelao');
}

// ---------- Laçada de sábado ----------
function lassoNeeded(){return G.phase==='closed'&&calendar().weekday===5&&G.lassoDay!==G.day&&!tutorialActive();}
function lassoIntro(){
 const herd=G.herd||0,need=Math.min(MIN_LASSO,herd);
 openDialog(G.lassoTaught?'Laçada de sábado':'Hora de laçar os bois!',`<p>Amanhã tem costelão. Vá ao campo e lace <b>pelo menos ${MIN_LASSO} bois</b> do teu rebanho: cada boi rende ${MANTAS_PER_BOI} mantas de costela.</p><div class="callout"><b>Como laçar</b><br>WASD anda pelo campo · <b>segure E</b> (ou Espaço) para girar o laço: o alvo vai e volta · <b>solte</b> quando o círculo estiver em cima de um boi. Chegar muito perto espanta o gado.</div><p>Rebanho: <b>${herd} bois</b>${herd<MIN_LASSO?' · faltam bois! Compre no celular (Fornecedor → Campo).':''}</p><div class="actions"><button class="primary" data-act="lassoStart" ${herd<1?'disabled':''}>Ir ao campo laçar</button>${herd<MIN_LASSO?'<button data-act="lassoBuy">Comprar bois</button>':''}${herd<1&&!hasCash(BOI_COST)?'<button data-act="lassoSkip">Sem bois nem dinheiro · pular</button>':''}</div>`,'lassoIntro');
}
function buyBoi(){if(!hasCash(BOI_COST)){say('Um boi custa '+money(BOI_COST)+'.');AudioEngine.bad();return;}spendCash(BOI_COST);G.stats.purchases+=BOI_COST;G.herd=(G.herd||0)+1;AudioEngine.heart();say('Boi comprado! Rebanho: '+G.herd+'.');save();if(phoneOpen)renderPhone();else if(modal==='lassoIntro')lassoIntro();}
function startLasso(){
 if(!G.herd){lassoIntro();return;}closeDialog(true);if(phoneOpen)togglePhone(false);
 const n=Math.min(G.herd,8),bois=Array.from({length:n},(_,i)=>({id:i,coat:Math.floor(Math.random()*BOI_COATS.length),x:420+Math.random()*900,y:480+Math.random()*330,dx:Math.random()<.5?-1:1,dy:0,state:'free',t:Math.random()*3,speed:40}));
 G.lasso={bois,caught:0,need:Math.min(MIN_LASSO,G.herd),charge:0,charging:false,throw:null,saved:{...G.player},fx:1,fy:0,time:0};
 G.player={x:220,y:700,dx:1,dy:0,walk:false};$('lassoUI').classList.remove('hidden');updateLassoUI();
 if(!G.lassoTaught)showBanner('Gire o laço segurando E','Solte quando o círculo estiver sobre um boi.','info');
 save();
}
const CURRAL={x:1360,y:470,w:200,h:190};
function lassoTick(dt){
 const L=G.lasso;if(!L||modal||paused)return;L.time+=dt;for(const e of sparks)e.life-=dt;sparks=sparks.filter(e=>e.life>0);
 let dx=(keys.has('d')||keys.has('ArrowRight')?1:0)-(keys.has('a')||keys.has('ArrowLeft')?1:0),dy=(keys.has('s')||keys.has('ArrowDown')?1:0)-(keys.has('w')||keys.has('ArrowUp')?1:0);const len=Math.hypot(dx,dy);
 G.player.walk=!!len&&!L.charging;
 if(len&&!L.throw){dx/=len;dy/=len;L.fx=dx;L.fy=dy;G.player.dx=dx;G.player.dy=dy;const sp=L.charging?90:230;G.player.x=clamp(G.player.x+dx*sp*dt,60,1340);G.player.y=clamp(G.player.y+dy*sp*dt,450,870);}
 if(L.charging){L.charge+=dt;}
 for(const b of L.bois){
  if(b.state==='caught'){const tx=CURRAL.x+40+(b.id%4)*40,ty=CURRAL.y+60+Math.floor(b.id/4)*60,d=Math.hypot(tx-b.x,ty-b.y);if(d<4){b.state='pen';continue;}b.dx=(tx-b.x)/d;b.x+=b.dx*70*dt;b.y+=(ty-b.y)/d*70*dt;continue;}
  if(b.state!=='free')continue;
  const pd=Math.hypot(b.x-G.player.x,b.y-G.player.y);
  if(pd<170){const k=1/Math.max(pd,1);b.dx=(b.x-G.player.x)*k;b.dy=(b.y-G.player.y)*k;b.speed=135;b.t=1.2;}
  else{b.t-=dt;if(b.t<=0){b.t=2+Math.random()*3;const a=Math.random()*Math.PI*2,go=Math.random()<.6;b.dx=go?Math.cos(a):0;b.dy=go?Math.sin(a)*.5:0;b.speed=go?38:0;}}
  b.x+=b.dx*b.speed*dt;b.y+=b.dy*b.speed*dt;
  if(b.x<80||b.x>1320){b.dx*=-1;b.x=clamp(b.x,80,1320);}if(b.y<470||b.y>860){b.dy*=-1;b.y=clamp(b.y,470,860);}
 }
 if(L.throw){
  const t=L.throw;t.time+=dt;
  if(t.time>=t.total&&!t.done){
   t.done=true;const hit=L.bois.filter(b=>b.state==='free').map(b=>({b,d:Math.hypot(b.x-t.tx,b.y-28-t.ty)})).filter(o=>o.d<52).sort((a,b)=>a.d-b.d)[0];
   if(hit){hit.b.state='caught';L.caught++;AudioEngine.heart();AudioEngine.moo(.11,fxRand(.85,1.1));burst(hit.b.x,hit.b.y-40,'leaf');effect('Laçou! '+L.caught+'/'+L.need,hit.b.x,hit.b.y-90,'#e1ff9e');gainXP(8);}
   else{AudioEngine.bad();effect('Errou o laço',t.tx,t.ty-20,'#ffc0a0');}
   updateLassoUI();save();
  }
  if(t.time>=t.total+.35)L.throw=null;
 }
}
function lassoCharge(){const L=G.lasso;if(!L||L.throw||L.charging)return;L.charging=true;L.charge=0;}
function lassoAim(){const L=G.lasso,p=.5-.5*Math.cos(L.charge*Math.PI*1.4),dist=110+p*380;return {x:clamp(G.player.x+L.fx*dist,40,W-40),y:clamp(G.player.y-40+L.fy*dist,430,880),p};}
function lassoRelease(){const L=G.lasso;if(!L?.charging)return;L.charging=false;const a=lassoAim();L.throw={sx:G.player.x,sy:G.player.y-110,tx:a.x,ty:a.y,time:0,total:.32+a.p*.25};AudioEngine.noise(.25,.1,900);}
function lassoKeyDown(e){
 const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','e'].includes(key))e.preventDefault();
 if(key==='Escape'){pauseGame('Laçada pausada.');return;}
 if((key==='e'||key===' ')&&!e.repeat){lassoCharge();return;}
 keys.add(key);
}
function lassoKeyUp(e){const key=e.key.length===1?e.key.toLowerCase():e.key;keys.delete(key);if(key==='e'||key===' ')lassoRelease();}
function updateLassoUI(){const L=G.lasso;if(!L)return;$('lassoCount').textContent=L.caught+' / '+L.need+' bois laçados';$('lassoHerd').textContent='Rebanho no campo: '+L.bois.filter(b=>b.state==='free').length;$('lassoFinish').disabled=L.caught<L.need;$('lassoFinish').textContent=L.caught<L.need?'Lace pelo menos '+L.need:'Levar '+L.caught+' bois para o costelão';}
function finishLasso(){
 const L=G.lasso;if(!L||L.caught<L.need)return;
 const mantas=L.caught*MANTAS_PER_BOI,units=G.stock.costela_crua;
 G.avg.costela_crua=(G.avg.costela_crua*units+L.caught*BOI_COST)/(units+mantas);G.stock.costela_crua+=mantas;G.herd-=L.caught;G.bullsLassoed=(G.bullsLassoed||0)+L.caught;
 G.player={...L.saved};G.lasso=null;G.lassoDay=G.day;G.lassoTaught=true;keys.clear();$('lassoUI').classList.add('hidden');
 showBanner(L.caught+' bois laçados!',mantas+' mantas de costela prontas para o costelão de amanhã.','gift');save();refreshHUD();nextDay();
}
function skipLasso(){G.lassoDay=G.day;closeDialog(true);say('Sem bois, o costelão de amanhã fica só com o que sobrou no estoque.');nextDay();}
function drawLasso(){
 const L=G.lasso;beginWorld();drawCampoBackground();
 // curral
 const c=CURRAL;rect(c.x,c.y+c.h-8,c.w,10,'#5a3a20');for(let k=0;k<=5;k++){wood(c.x+k*(c.w/5)-4,c.y,9,c.h,true);}for(const y of [c.y+30,c.y+90,c.y+150])wood(c.x,y,c.w,9);txt('CURRAL',c.x+c.w/2,c.y-12,13,'#fff0c3');
 const layers=L.bois.map(b=>({y:b.y,draw:()=>{ellipse(b.x,b.y+2,40,9,'#1c140c44');drawBoi(b.coat,b.state==='free'&&b.speed===0?2:Math.floor(L.time*(b.speed>60?9:4)+b.id)%2,b.x,b.y,1.6,b.dx<0);if(b.state==='caught'){ctx.strokeStyle='#d8b878';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(b.x+(b.dx<0?-40:40),b.y-60,12,6,0,0,Math.PI*2);ctx.stroke();}}}));
 layers.push({y:G.player.y,draw:()=>personDraw(avatarSprite(),G.player.x,G.player.y,G.player.walk,true,G.player.dx)});
 layers.sort((a,b)=>a.y-b.y).forEach(l=>l.draw());
 ctx.strokeStyle='#e8cc8a';ctx.lineWidth=3;
 if(L.charging){const a=lassoAim(),ang=L.time*14;ctx.beginPath();ctx.ellipse(G.player.x+Math.cos(ang)*8,G.player.y-132,30,10,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([8,8]);ctx.strokeStyle='#fff4c488';ctx.beginPath();ctx.moveTo(G.player.x,G.player.y-60);ctx.lineTo(a.x,a.y);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#ffe28a';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(a.x,a.y,52,20,0,0,Math.PI*2);ctx.stroke();}
 if(L.throw){const t=L.throw,k=clamp(t.time/t.total,0,1),x=t.sx+(t.tx-t.sx)*k,y=t.sy+(t.ty-t.sy)*k-Math.sin(k*Math.PI)*90;ctx.beginPath();ctx.moveTo(G.player.x,G.player.y-80);ctx.quadraticCurveTo((G.player.x+x)/2,Math.min(y,G.player.y)-60,x,y);ctx.stroke();ctx.beginPath();ctx.ellipse(x,y,34*(.5+k*.5),12*(.5+k*.5),0,0,Math.PI*2);ctx.stroke();}
 for(const e of sparks){ctx.globalAlpha=Math.min(1,e.life);txt(e.text,e.x,e.y-(2.2-e.life)*16,15,e.color);}ctx.globalAlpha=1;
 ctx.setTransform(1,0,0,1,0,0);
}
function campoSupplierHTML(){return `<div class="supply"><span class="icon"><span class="pixel-item boi-icon" aria-hidden="true"></span></span><div><b>Boi para o costelão</b><p>Rebanho: <b>${G.herd||0} bois</b><br>Cada boi laçado no sábado rende ${MANTAS_PER_BOI} mantas (${formatWeight(MANTAS_PER_BOI*MANTA_GRAMS)}).</p></div><button class="primary" data-act="buyBoi" ${hasCash(BOI_COST)?'':'disabled'}>Comprar · ${money(BOI_COST)}</button></div><div class="supply"><span class="icon">${itemIconHTML('costela_crua')}</span><div><b>Manta do açougue</b><p>Para quando faltar carne no costelão. Chega em 8 s, mas custa bem mais que laçar: ${money(MANTA_BUY_COST)} contra ${money(BOI_COST/MANTAS_PER_BOI)}.</p></div><button class="primary" data-act="buyManta" ${hasCash(MANTA_BUY_COST)?'':'disabled'}>Comprar · ${money(MANTA_BUY_COST)}</button></div><div class="supply"><span class="icon">${itemIconHTML('costela_crua')}</span><div><b>No estoque</b><p>${G.stock.costela_crua} mantas cruas · ${formatWeight(G.stock.costela)} na tábua · ${G.stock.maionese} maioneses</p></div></div>`;}
