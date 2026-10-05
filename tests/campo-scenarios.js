// Costelão de domingo, maionese, laçada de sábado e rebanho.
(() => {
 const results=[],check=(v,m)=>{if(!v)throw Error(m);results.push(m);};
 const random=Math.random;
 const reset=()=>{G=fresh();G.xp=99999;G.levelSeen=7;G.tutorial.guided=false;G.tutorial.complete=true;G.cash=2000;G.rep=100;started=true;paused=false;modal=null;phoneOpen=false;AudioEngine.on=false;keys.clear();bannerQueue=[];['start','overlay','phone','weighUI','mixUI','lassoUI'].forEach(id=>$(id).classList.add('hidden'));};
 const sunday=()=>{reset();G.day=3;G.event={id:'costelao',seen:true,fired:{}};G.phase='prep';G.costelaoTaught=true;G.stock.costela_crua=9;G.avg.costela_crua=40;campoState().fuel=100;};
 const roast=()=>{for(let t=0;t<COOK_SIDE+.2;t+=.05){campoState().fuel=100;campoTick(.05);}};
 const chop=()=>{use('lenha');for(let k=0;k<CHOP_HITS;k++){keys.add('e');holdTick(.05);for(let t=0;t<CHOP_TIME*.7;t+=.05)holdTick(.05);keys.delete('e');holdTick(.05);}};
 const approach=id=>{const f=furniture().find(f=>f.id===id);if(!f)throw Error('Ausente: '+id);for(let x=f.x-60;x<=f.x+f.w+60;x+=6)for(let y=f.y-60;y<=f.y+f.h+60;y+=6){if(!canWalk(x,y)||distRect({x,y},f)>45)continue;G.player={x,y,dx:1,dy:0};if(nearest()?.id===id)return;}throw Error('Inacessível: '+id);};
 const use=id=>{approach(id);interact();};
 const tick=(s,fn)=>{for(let t=0;t<s;t+=.05)fn(.05);};
 const weigh=()=>{approach('tabua');interact();keys.add('e');holdTick(G.task.requested/G.task.maxWeight*2.5);keys.delete('e');finishWeigh();};
 const mayo=()=>{use('bin:ovo');use('maionese');use('bin:azeite');use('maionese');interact();for(let i=0;i<14;i++)mixKey(i%2?'a':'e');};
 try{
  reset();check(calendar(1).name==='Sexta'&&eventForDay(3).id==='costelao','o jogo começa na sexta e o costelão é no domingo (dia 3)');
  sunday();check(isCampo()&&furniture()===CAMPO_FIXED&&!availableTables().length,'domingo troca para o cenário aberto, sem mesas');
  for(const f of CAMPO_FIXED)if(f.id!=='fogo')approach(f.id);check(true,'todas as estações do campo são alcançáveis');
  check(['costela_crua','costela_assada','costela','maionese','azeite','costela_queimada'].every(k=>ITEM_ART[k].naturalWidth>0)&&CAMPO_ART.every(([im])=>im.naturalWidth>0),'sprites do costelão carregam');
  // espeto: pôr, assar, virar, retirar
  use('costela_crua');check(held()?.key==='costela_crua'&&G.stock.costela_crua===8,'pega a manta crua');
  use('espeto:0');const e=campoState().espetos[0];check(e&&!held()&&e.fire===0,'manta vai para o espeto');
  roast();check(e.heat[0]>=1&&e.heat[1]===0,'só o lado virado para o fogo assa');
  interact();check(e.fire===1,'E vira a manta');roast();check(espetoReady(e),'os dois lados no ponto deixam a costela pronta');
  interact();check(held()?.key==='costela_assada'&&held().ready&&held().perfect&&!campoState().espetos[0],'retira a costela no ponto');
  use('tabua');check(G.stock.costela===MANTA_GRAMS&&!held(),'tábua recebe 2 kg de costela');
  // queimar
  use('costela_crua');use('espeto:1');for(let t=0;t<COOK_SIDE*BURN_AT+.3;t+=.05){campoState().fuel=100;campoTick(.05);}check(campoState().espetos[1].burned,'esquecer a manta no fogo queima');
  interact();check(held()?.burned&&itemArtKey('costela_assada',held())==='costela_queimada','costela queimada sai para a lixeira');use('trash');check(!held(),'lixeira recebe a costela queimada');
  // lenha: o fogo gasta e sem lenha a costela quase não assa
  campoState().fuel=0;use('costela_crua');use('espeto:2');const slow=campoState().espetos[2];for(let t=0;t<COOK_SIDE;t+=.05)campoTick(.05);check(slow.heat[0]<.15,'sem lenha a costela quase não assa');
  use('lenha');check(G.task?.type==='chop'&&!$('chopUI').classList.contains('hidden'),'cepo abre o minijogo do machado');
  keys.add('e');holdTick(.05);for(let t=0;t<CHOP_TIME*.3;t+=.05)holdTick(.05);keys.delete('e');holdTick(.05);check(G.task.hits===0,'golpe fraco não conta');
  for(let k=0;k<CHOP_HITS;k++){keys.add('e');holdTick(.05);for(let t=0;t<CHOP_TIME*.7;t+=.05)holdTick(.05);keys.delete('e');holdTick(.05);}
  check(!G.task&&held()?.key==='lenha'&&ITEM_ART.lenha.naturalWidth>0,'três golpes na faixa verde racham a lenha');
  use('fogo');check(!held()&&campoState().fuel===LENHA_FUEL,'lenha rachada aviva o fogo');
  campoState().espetos[2]=null;G.stock.costela_crua++;campoState().fuel=100;
  // venda por peso
  G.phase='open';const c=spawnShop({pid:'costela',grams:1000,fiado:false});for(let n=0;n<300;n++)customersTick(.05);
  approach('tabua');interact();check(G.task?.type==='weigh'&&G.task.key==='costela','segurar E na tábua corta a costela');
  keys.add('e');holdTick(G.task.requested/G.task.maxWeight*2.5);keys.delete('e');finishWeigh();check(held()?.pid==='costela'&&held().weight>900,'pesa a costela pedida');
  const cash=G.cash;use('service');check(G.cash>cash&&G.costelaSold>=900&&c.state==='leave','costela vendida por peso no balcão');
  // maionese
  use('bin:ovo');use('maionese');use('bin:azeite');use('maionese');const b=campoState().bowl;check(b.ovo&&b.azeite,'ovo e azeite vão para a tigela');
  interact();check(G.task?.type==='mix'&&!$('mixUI').classList.contains('hidden'),'tigela cheia começa a bater');
  mixKey('d');check(G.task.progress===0,'só A e E batem a maionese');for(let i=0;i<14;i++)mixKey('e');
  check(!G.task&&G.stock.maionese===3&&!b.ovo,'apertar E (ou A) repetidamente dá o ponto: 3 porções');
  interact();check(held()?.pid==='maionese','pega uma porção de maionese');G.hands=[null,null];
  // mantas do açougue, mais caras
  const before=G.cash,mantas=G.stock.costela_crua;phoneCat='Campo';phoneTab='supplier';phoneOpen=true;renderPhone();check(document.querySelector('[data-act="buyManta"]'),'fornecedor vende mantas avulsas');phoneOpen=false;
  buyManta();deliveryTick(8.1);check(G.cash===before-MANTA_BUY_COST&&G.stock.costela_crua===mantas+1&&MANTA_BUY_COST>BOI_COST/MANTAS_PER_BOI*2,'manta do açougue chega sem laçar, bem mais cara');
  // clientes do campo
  check(['costela','maionese','refri'].includes(campoOrder())&&!spawnGroup(),'no campo só chegam fregueses ao balcão: costela, maionese ou refri');
  // tutorial do primeiro costelão
  reset();G.day=3;G.event={id:'costelao',seen:true,fired:{}};G.phase='prep';G.stock.costela_crua=0;openDay();
  check(modal==='costelao'&&costelaoTutorialActive()&&G.stock.costela_crua>=2,'primeiro costelão abre com tutorial e mantas de treino');closeDialog(true);
  simulate(1);check(!G.shop.length,'no tutorial ninguém chega antes da hora');
  use('costela_crua');use('espeto:0');check(costelaoStep().id==='lenha'&&campoState().fuel<30,'etapa: lenha no fogo');chop();use('fogo');check(costelaoStep().id==='virar','etapa: virar');
  approach('espeto:0');roast();interact();check(costelaoStep().id==='retirar','etapa: retirar');
  roast();interact();check(costelaoStep().id==='tabua','etapa: tábua');use('tabua');check(costelaoStep().id==='cortar','etapa: cortar');
  simulate(.05);const first=G.shop[0];check(first?.pid==='costela'&&first.grams===500&&first.training,'primeiro freguês pede 500 g sem prazo');
  for(let n=0;n<300;n++)customersTick(.05);weigh();use('service');
  check(costelaoStep().id==='maionese','etapa: maionese');mayo();
  check(costelaoStep().id==='servir','etapa: servir maionese');simulate(.05);for(let n=0;n<300;n++)customersTick(.05);use('maionese');use('service');
  check(!costelaoTutorialActive()&&G.costelaoTaught,'tutorial do costelão concluído');
  // laçada de sábado
  reset();G.day=2;G.phase='closed';G.event={id:'normal',seen:true,fired:{}};G.report={};nextDay();check(modal==='lassoIntro','sábado exige a laçada antes do próximo dia');
  action('lassoStart');const L=G.lasso;check(L&&L.bois.length===5&&isCampo()&&!$('lassoUI').classList.contains('hidden'),'campo com o rebanho para laçar');
  finishLasso();check(G.lasso,'não termina com menos de 3 bois');
  for(let k=0;k<3;k++){
   const boi=L.bois.find(b=>b.state==='free');G.player={x:boi.x-200,y:boi.y+40,dx:1,dy:0};L.fx=1;L.fy=0;lassoCharge();
   let best=0,bd=1e9;for(let t=0;t<1.4;t+=.01){L.charge=t;const a=lassoAim(),d=Math.hypot(a.x-boi.x,a.y-(boi.y-28));if(d<bd){bd=d;best=t;}}L.charge=best;
   for(const other of L.bois)if(other!==boi&&other.state==='free'){other.x=1300;other.y=860;}boi.speed=0;boi.dx=boi.dy=0;boi.t=99;lassoRelease();for(let t=0;t<1;t+=.05){boi.t=99;lassoTick(.05);}
  }
  check(L.caught===3,'laçar três bois soltando o laço sobre eles');
  const day=G.day,stock=G.stock.costela_crua;finishLasso();check(!G.lasso&&G.herd===2&&G.stock.costela_crua===stock+9&&G.lassoDay===day,'três bois viram 9 mantas e saem do rebanho');
  check(modal==='planning','depois da laçada aparece a previsão de amanhã');action('chooseEvent','automatic');check(G.day===3&&G.event.id==='costelao','e o dia seguinte é o domingo de costelão');
  reset();G.herd=1;G.day=2;G.phase='closed';nextDay();check(modal==='lassoIntro'&&$('dialogContent').textContent.includes('Comprar bois'),'rebanho pequeno pede compra de bois');
  buyBoi();buyBoi();check(G.herd===3&&G.cash===2000-2*BOI_COST,'compra de bois no celular');closeDialog(true);
  phoneCat='Campo';phoneTab='supplier';phoneOpen=true;renderPhone();check(document.querySelector('[data-act="buyBoi"]'),'fornecedor tem a categoria Campo com bois');phoneOpen=false;
  // mate sem reposição no campo
  sunday();approach('mate');keys.add('e');interact();tick(1.2,holdTick);keys.clear();check(G.boost>0,'campo tem estação de mate, sem reposição de erva');
  save();check(readSave().herd===G.herd&&readSave().version===15,'rebanho e campo persistem no salvamento');
 }finally{Math.random=random;keys.clear();if(G)G.lasso=null;$('lassoUI').classList.add('hidden');reset();}
 return results;
})()
