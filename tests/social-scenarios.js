(() => {
 const results=[],check=(v,label)=>{if(!v)throw Error(label);results.push(label);};
 const reset=()=>{G=fresh();started=true;paused=false;modal=null;phoneOpen=false;keys.clear();G.spawnShop=G.spawnGroup=999;AudioEngine.on=false;['start','overlay','phone'].forEach(id=>$(id).classList.add('hidden'));};
 const index=id=>PEOPLE.findIndex(p=>p.id===id);
 reset();
 check(['indavirus','lauro','peixinhonabrasa','manolima'].every(id=>index(id)>=0&&CHARACTER_ART[PEOPLE[index(id)].sprite.file].naturalWidth>0),'quatro novos personagens carregam suas artes');
 check($('startingCharacter').options.length===9&&[...$('startingCharacter').options].every(o=>o.value==='sadi'||selectableCharacters().some(p=>p.id===o.value)),'seleção contém apenas Sadi e os oito personagens especiais');
 $('startingCharacter').value='indavirus';$('startingName').value='Bodega do teste';
 const confirmBefore=window.confirm;try{window.confirm=()=>true;startGame(true);}finally{window.confirm=confirmBefore;}
 check(G.avatarId==='indavirus'&&G.bodegaName==='Bodega do teste'&&modal==='welcome','novo jogo aplica personagem, nome e apresenta o guia');
 check($('dialogTitle').textContent.includes('Um passo de cada vez')&&$('dialogContent').textContent.includes('um freguês por vez'),'boas-vindas apresentam tutorial sequencial');gameGuide();check(['Bocha','Truco','Contatos','4, 8 e 12'].every(text=>$('dialogContent').textContent.includes(text)),'guia apresenta lazer, contatos e caminho de progressão');
 closeDialog(true);G.phase='open';
 check(!visitorAvailable(index('indavirus')),'personagem único escolhido pelo jogador não chega como cliente');
 const lauro=spawnGroup({person:index('lauro'),size:4});
 check(!lauro.members.includes(index('indavirus'))&&lauro.size===4,'parceiro indisponível não é duplicado ao formar quatro pessoas');
 const repeated=spawnGroup({members:Array(4).fill(index('lauro')),size:4});
 const all=[...lauro.members,...repeated.members];check(all.filter(i=>i===index('lauro')).length===1,'nem pedidos explícitos de grupo duplicam freguês único');
 reset();G.phase='open';const pair=spawnGroup({person:index('indavirus'),size:2});
 check(pair.members[1]===index('lauro'),'Indavirus e Lauro formam dupla quando disponíveis');
 reset();G.phase='open';
 for(let trial=0;trial<80;trial++){
  G.groups=[];G.shop=[];G.tables.forEach(t=>{t.group=null;t.dirty=false;});
  for(let i=0;i<3;i++){spawnGroup({size:4});spawnShop();}
  const visitors=[...G.groups.flatMap(g=>g.members),...G.shop.map(c=>c.person)].filter(i=>PEOPLE[i].unique);
  if(new Set(visitors).size!==visitors.length)throw Error('Freguês único duplicado em visita '+trial);
 }
 check(true,'80 lotes de chegadas respeitam exclusividade entre fila, balcão e mesas');
 reset();G.phase='open';const repeatAllowed=spawnGroup({members:[0,0,0,0],size:4});check(repeatAllowed.members.every(i=>i===0),'personagens comuns podem repetir');
 reset();G.phase='open';const group=spawnGroup({members:[0,1,2,3],size:4,fixedOrders:['refri','codorna','cachaca','cerveja','refri']});
 for(let t=0;t<12;t+=.05)customersTick(.05);
 check(group.state==='seated'&&group.diners.length===4&&G.tables[group.table].seats===4&&new Set(group.diners.map(d=>d.person)).size===4,'grupo de quatro chega e cada lugar recebe seu próprio pedido');
 check(group.diners[0].orders.length===2&&group.diners.every(d=>d.maxPatience===ORDER_WAIT),'pedidos maiores mantêm prazo individual normal');
 const item=pid=>({kind:'product',pid,ready:true,cost:GOODS[pid].cost});
 const balance=G.cash;group.diners[0].patience=50;group.diners[1].patience=20;
 G.hands[0]=item('refri');interactTable(group.table);
 check(G.cash===balance&&group.diners[0].orders.length===1&&group.diners[1].patience===20,'entrega parcial não paga nem renova cronômetro dos outros');
 G.hands[0]=item('refri');interactTable(group.table);
 check(G.cash>balance&&G.regulars[0]===1&&G.regulars[1]===0&&group.state==='seated','completar um pedido paga só aquele freguês enquanto a mesa segue ativa');
 group.diners[1].patience=.1;group.diners[2].patience=60;tickDiners(group,.2);
 check(group.diners[1].status==='lost'&&group.diners[2].status==='waiting'&&group.state==='seated'&&G.stats.lost===1,'desistência individual preserva o atendimento dos outros três');
 const remaining=group.diners[2].patience;addDinerRound(group);
 check(group.diners[2].patience===remaining&&group.diners[0].patience===ORDER_WAIT&&group.diners[1].status==='lost','rodada extra conserva prazos pendentes e não reativa desistência');
 refreshHUD();draw();check(!$('tableOrders')&&group.diners.length===4,'pedidos individuais ficam no cenário, sem lista lateral');
 save();const saved=readSave();check(saved.groups[0].diners[2].patience===remaining&&saved.groups[0].diners[1].status==='lost','salvamento mantém pedidos e cronômetros individuais');
 reset();G.phase='open';const truco=spawnGroup({size:4,targetTable:1});for(let t=0;t<12;t+=.05)customersTick(.05);
 check(truco.orders.length===4&&truco.orders.every(k=>GOODS[k]||RECIPES[k]),'mesa de truco usa pedidos individuais do cardápio comum');
 reset();G.up.horse=true;G.up.bootsBagual=true;G.gear='horse';const migrated=normalizeSave(JSON.parse(JSON.stringify(G)));
 check(migrated.gear==='bootsBagual'&&migrated.up.horse,'montaria antiga fica guardada e equipa botas ao migrar');
 G=migrated;const cash=G.cash;buyUpgrade('horse');equipGear('horse');check(G.gear==='bootsBagual'&&G.cash===cash,'cavalo não pode ser comprado nem equipado');
 G.gear='horse';check(movementBonus()===0,'montaria inativa não concede velocidade');G.gear='feet';
 phoneTab='contacts';renderPhone();check($('phoneContent').textContent.includes('Contatos da bodega')&&document.querySelectorAll('[data-contact]').length===PEOPLE.length,'aba Contatos lista retratos, afeto e preferências');
 phoneTab='upgrades';renderPhone();check(!$('phoneContent').querySelector('.contact-card')&&$('phoneContent').querySelectorAll('.upgrade-category').length===4,'melhorias separadas em categorias sem relações');
 for(const id of ['indavirus','lauro','peixinhonabrasa']){const p=index(id);G.friends[p]=100;G.conversations[p]=4;check(!!personalizedProse(p)&&nextProse(p).id?.includes(id),'voz própria permanece com afinidade alta: '+id);}
 const mano=index('manolima');for(let i=0;i<16;i++){G.conversations[mano]=i;G.friends[mano]=100;const line=nextProse(mano);if(!/baia/i.test(line.reply)||!/lobisome do Arvoredo/i.test(line.reply))throw Error('Mano perdeu a voz própria');}check(true,'Mano mantém falas da baia e do lobisome sem cair nas genéricas');
 for(const phase of ['prep','open','closing','closed']){
  reset();G.phase=phase;G.elapsed=30;G.report=phase==='closed'?{...G.stats,end:G.cash,profit:0}:null;
  cardsMenu();check(modal==='cards','truco disponível em '+phase);$('trucoWager').value='0';startTruco();
  const before=G.elapsed;simulate(1);check(!!G.game&&G.elapsed===before,'truco pausa atendimento em '+phase);
  G.game.phase='over';G.game.wagerSettled=true;leaveCards();check(G.phase===phase&&!G.game,'truco retorna à mesma fase '+phase);closeDialog(true);
  bocceMenu();$('bocceWager').value='0';startBocceGame();simulate(1);check(!!G.bocce&&G.elapsed===before,'bocha disponível e pausa em '+phase);
  settleBocce(1);leaveBocce();check(!G.bocce&&G.phase===phase&&(phase==='closed'?modal==='report':modal===null),'bocha retorna sem encerrar o dia em '+phase);closeDialog(true);
 }
 reset();return results;
})()
