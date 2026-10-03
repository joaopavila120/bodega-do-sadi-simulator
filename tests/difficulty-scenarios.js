(() => {
 const results=[],check=(v,label)=>{if(!v)throw Error(label);results.push(label);};
 const reset=()=>{G=fresh();started=true;paused=false;modal=null;phoneOpen=false;keys.clear();G.spawnShop=G.spawnGroup=999;AudioEngine.on=false;['start','overlay','phone','bocceScreen'].forEach(id=>$(id).classList.add('hidden'));document.body.classList.remove('playing-bocce');};
 const advance=seconds=>{for(let n=0;n<seconds;n+=.05)customersTick(.05);};
 reset();check(G.event.id==='normal'&&!fightsAllowed(),'primeiro dia sempre tranquilo e sem brigas');
 for(const day of [1,2,3,4,5,7]){
  G.day=day;const sizes=new Set(),items=new Set();for(let i=0;i<300;i++){const size=restaurantGroupSize(0);sizes.add(size);const orders=tableOrders({table:0,person:0,size:1});items.add(orders.length);if(size>difficulty().maxGroup||orders.length>difficulty().maxItems)throw Error('Limite da dificuldade violado');}
  check(sizes.has(difficulty().maxGroup)&&items.has(difficulty().maxItems),'grupos e pedidos crescem nos limites do dia '+day);
 }
 reset();G.phase='open';const diners=spawnGroup({size:2});advance(12);check(diners.table===0,'clientes comuns usam restaurante e deixam a mesa fixa para o truco');
 G.day=2;G.elapsed=100;const crew=spawnGroup({size:2});advance(12);check(crew.table===1&&crew.state==='seated','mesa de truco recebe a fila comum');
 check(!triggerFight(G.tables[1]),'truco normal do início não provoca briga');
 G.day=2;G.event.id='campeonato';check(triggerFight(G.tables[1]),'campeonato permite brigas antes do nível avançado');G.tables[1].fight=null;
 G.event.id='normal';G.day=5;check(triggerFight(G.tables[1]),'dia 5 libera brigas no truco comum');G.tables[1].fight=null;
 const modes=G.tables.map(t=>t.mode).join();toggleTable(1);check(G.tables.map(t=>t.mode).join()===modes,'troca manual de mesas permanece desativada');
 reset();let previous=G.event.id;const draws=[];for(let day=2;day<80;day++){const e=eventForDay(day,G);if(e.id===previous)throw Error('Evento repetido em dias seguidos');draws.push(e.id);G.event=e;previous=e.id;}
 check(new Set(draws.slice(0,Object.keys(EVENTS).length)).size===Object.keys(EVENTS).length,'sorteio percorre os eventos sem sequência fixa nem repetição consecutiva');
 G.phase='closed';const next=plannedEvent();planDay();closeDialog(true);check(plannedEvent().id===next.id&&readSave().nextEvent.id===next.id,'consultar ou recarregar a previsão não sorteia outro evento');
 reset();finishDay();check(G.tv&&G.tvAwardPending&&modal==='tvAward'&&$('dialogContent').textContent.includes('sorteio do comércio local'),'TV anunciada ao concluir o primeiro dia');
 save();check(readSave().tvAwardPending,'anúncio pendente da TV sobrevive ao salvamento');action('tvAwardClose');check(modal==='report'&&!G.tvAwardPending,'anúncio da TV conduz ao relatório sem prêmio duplicado');nextDay('automatic');closeDialog(true);check(G.day===2&&G.tv,'segundo dia mantém a TV e começa a nova progressão');

 G.day=2;G.player={x:510,y:585,dx:1,dy:0};refreshHUD();check($('tutorialHint').classList.contains('hidden')&&!$('hint').textContent.includes('WASD'),'dicas gerais e tutorial desaparecem depois do primeiro dia');
 G.mateHerb=0;G.mateEmptyNotified=false;notifyEmptyMate();check($('toasts').textContent.includes('Acabou seu mate, traga mais erva para sua cuia.'),'aviso de cuia vazia usa a orientação solicitada');
 refreshHUD();check($('refillMateContext').classList.contains('hidden')&&!$('mateStock'),'refil não ocupa a interface longe da erva');
 G.player={x:919,y:303,dx:0,dy:-1};refreshHUD();check(!$('refillMateContext').classList.contains('hidden')&&$('hint').textContent.includes('Encher sua cuia de erva'),'F aparece somente ao chegar perto da erva');const stock=G.stock.erva;refillMate();check(G.mateHerb===500&&G.stock.erva===stock-500&&!G.mateEmptyNotified,'refil contextual consome estoque e rearma aviso');
 check(!document.querySelector('[data-act="map"]')&&!document.querySelector('[data-act="tableMode"]')&&!$('combo')&&!$('tableOrders'),'mapa, troca de mesa, combo e lista lateral foram removidos');
 check(!$('gameSidebar').querySelector('[data-act="rooms"]')&&$('phone').querySelector('[data-act="rooms"]'),'trocar cenário fica exclusivamente no celular');
 check(getComputedStyle($('gameSidebar')).overflowY==='hidden'&&$('dayNotice').textContent.split('\n').length===2,'faixa lateral fixa e cabeçalho do dia em duas linhas');
 check(itemArtKey('xis_salada',{kind:'assembled'})==='xis_montado'&&itemArtKey('xis_salada',{ready:true})==='xis_prensado'&&xisArt('xis_montado')!==xisArt('xis_prensado'),'xis muda de desenho entre montagem e prensa');
 const originalBar=bar;try{
  for(const type of ['mate','clean']){let bars=0;bar=(...args)=>{bars++;originalBar(...args);};G.task={type,target:type==='mate'?'mate':'table:1',time:.5};G.boost=5;if(type==='clean')G.tables[1].dirty=true;draw();check(bars===1,'somente uma barra de ação durante '+type);}
 }finally{bar=originalBar;G.task=null;G.boost=0;G.tables[1].dirty=false;}
 G.player={x:510,y:585,dx:1,dy:0};joinSeatedTruco();check(!modal,'truco não inicia longe da mesa');G.player={x:1145,y:445,dx:0,dy:-1};refreshHUD();check(!$('playTrucoButton').classList.contains('hidden'),'jogar truco aparece perto da mesa fixa');joinSeatedTruco();check(modal==='cards','mesa vazia também oferece partida contextual');closeDialog(true);
 G.player={x:510,y:585,dx:1,dy:0};enterCancha();check(!G.atCancha,'entrada na cancha exige proximidade da porta');
 G.player={x:1220,y:735,dx:1,dy:0};check(canWalk(G.player.x,G.player.y),'porta da cancha é alcançável');interact();
 check(G.atCancha&&!G.bocce&&!$('canchaLobby').classList.contains('hidden')&&$('bocceButton').getBoundingClientRect().width>0,'porta abre a cancha antes de oferecer jogar bocha');
 const before=G.elapsed;G.phase='open';simulate(2);check(G.elapsed===before,'visita à cancha também pausa o atendimento');
 bocceMenu();$('bocceWager').value='0';startBocceGame();check(!!G.bocce&&$('canchaLobby').classList.contains('hidden'),'partida inicia a partir da cancha');
 settleBocce(1);leaveBocce();check(G.atCancha&&!G.bocce&&!$('canchaLobby').classList.contains('hidden'),'terminar a bocha volta à cancha');leaveCancha();check(!G.atCancha&&G.phase==='open'&&G.elapsed===before,'porta de volta preserva o expediente');
 reset();return results;
})()
