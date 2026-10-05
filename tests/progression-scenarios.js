// Nível, metas, economia, fiado, especiais raros, calendário e noite.
(() => {
 const results=[],check=(v,m)=>{if(!v)throw Error(m);results.push(m);};
 const random=Math.random;
 const reset=()=>{G=fresh();G.day=2;G.tutorial.guided=false;G.tutorial.complete=true;G.cash=500;G.rep=100;started=true;paused=false;modal=null;phoneOpen=false;AudioEngine.on=false;keys.clear();bannerQueue=[];clearTimeout(bannerTimer);bannerTimer=null;['start','overlay','phone'].forEach(id=>$(id).classList.add('hidden'));};
 const index=id=>PEOPLE.findIndex(p=>p.id===id);
 const shown=text=>$('banner').textContent.includes(text)||bannerQueue.some(b=>b.title.includes(text));
 try{
  // Nível e melhorias
  reset();check(bodegaLevel()===1&&levelInfo().name==='Bodega de esquina','bodega começa no nível 1');
  const cash=G.cash;buyUpgrade('coffee');check(!G.up.coffee&&G.cash===cash,'melhoria de nível 2 bloqueada no nível 1');
  gainXP(300);progressCheck();check(bodegaLevel()===2&&G.levelSeen===2&&shown('Bodega do bairro'),'subir de nível anuncia na tela');
  buyUpgrade('coffee');check(G.up.coffee,'nível 2 libera a cafeteira');
  check(rentForLevel(1)<rentForLevel(7)&&creditLimit(1)<creditLimit(7),'aluguel e limite do fiado crescem com o nível');

  // Despesas e validade
  reset();G.phase='open';G.elapsed=DAY;for(const k in PERISH)G.stock[k]=0;G.stock.salada=12;G.avg.salada=1.5;const before=G.cash;finishDay();closeDialog(true);
  check(G.report.rent===rentForLevel()&&G.report.power>=6&&G.stock.salada===6&&G.report.spoiled===9,'fim do dia cobra aluguel e luz; salada perde metade na virada');
  check(G.cash<=before-G.report.rent-G.report.power+.01,'despesas saem do caixa');
  reset();G.up.freezer=true;G.stock.salada=12;spoilOvernight();check(G.stock.salada===9,'freezer reduz a perda pela metade');
  reset();G.day=1;G.phase='open';G.elapsed=DAY;finishDay();closeDialog(true);check(G.report.rent===0,'primeiro dia sem aluguel');

  // Conquistas
  reset();G.totalServed=100;checkAchievements();check(G.achievements.freguesia&&G.xp>=120,'conquista concede XP');
  checkAchievements();check(Object.keys(G.achievements).length===1||G.achievements.freguesia===2,'conquista não se repete');
  gameGuide();check($('dialogContent').textContent.includes('Freguesia fiel')&&$('dialogContent').textContent.includes('Bodega lendária'),'guia mostra metas e níveis');closeDialog(true);

  // Personagens especiais raros
  reset();G.phase='open';let specials=0;for(let i=0;i<2000;i++)if(isSpecial(pickVisitor()))specials++;
  check(specials>80&&specials<400,'especiais são raros entre os visitantes ('+specials+'/2000)');
  reset();G.phase='open';const mano=index('manolima');  const c=(()=>{const original=pickVisitor;pickVisitor=()=>mano;try{return spawnShop();}finally{pickVisitor=original;}})();
  check(c&&G.metSpecial.manolima===2&&shown('Mano Lima entrou na bodega'),'primeira visita de especial mostra aviso em destaque');
  // Afeto só com especiais; contato com 15
  reset();deliveryConversation(0,{});check(!G.friends[0],'fregueses comuns não somam afeto');
  G.friends[index('badin')]=15;socialCheck();check(hasContact(index('badin'))&&contactPeople().includes(index('badin')),'com 15 de afeto o especial vira contato');
  G.friends[index('badin')]=50;socialCheck();check(decorState().chapeu===true&&G.giftsGiven['badin:50'],'com 50 de afeto chega um presente');
  const giftCash=G.cash;G.giftsGiven={};socialCheck();check(G.cash===giftCash+DECOR.find(d=>d.id==='chapeu').cost,'presente repetido de peça já comprada vira dinheiro');
  phoneOpen=true;phoneTab='contacts';renderPhone();check(document.querySelector('[data-act="invite"]')&&$('phoneContent').textContent.includes('???'),'contatos mostram convites e escondem quem não apareceu');phoneOpen=false;

  // Fiado
  reset();G.phase='open';Math.random=()=>.05;const debtor=index('rosa');const original=pickVisitor;pickVisitor=()=>debtor;const f=spawnShop({pid:'codorna'});pickVisitor=original;Math.random=random;
  check(f.fiado,'freguês comum pode pedir fiado');
  for(let n=0;n<300;n++)customersTick(.05);readyProduct('codorna');const fiadoCash=G.cash;serveShop(f);
  check(G.cash===fiadoCash&&fiadoOpen().length===1&&fiadoTotal()===price('codorna'),'entrega fiado anota no caderninho sem entrar dinheiro');
  phoneOpen=true;phoneTab='fiado';renderPhone();check($('phoneContent').textContent.includes(PEOPLE[debtor].name)&&document.querySelector('[data-act="fiadoCharge"]'),'aba Fiado lista as contas');phoneOpen=false;
  G.day=fiadoOpen()[0].due;Math.random=()=>0;const paidCash=G.cash;processFiado();Math.random=random;
  check(!fiadoOpen().length&&G.cash>paidCash+price('codorna')&&G.fiadoPaid===1,'conta vencida paga com juros de amizade');
  reset();G.fiado=[{id:1,person:0,amount:10,day:2,due:3,status:'open',charged:0}];G.day=9;{let n=0;Math.random=()=>n++%2?0:.99;}processFiado();Math.random=random;check(G.fiado[0].status==='lost'&&G.stats.fiadoLost===10,'conta muito atrasada pode virar calote');
  reset();G.phase='open';Math.random=()=>.05;pickVisitor=()=>index('rosa');const r=spawnShop({pid:'codorna'});pickVisitor=original;for(let n=0;n<300;n++)customersTick(.05);Math.random=()=>.1;refuseFiado();Math.random=random;check(!r.fiado&&r.state==='queue','recusar o fiado pode fazer o freguês pagar à vista');

  // Calendário e eventos
  check(fixedEventFor(7)==='grenal'&&fixedEventFor(5)==='truco'&&EVENTS.farroupilha&&EVENTS.junina&&EVENTS.rodeio,'calendário tem Gre-Nal, truco, Farroupilha, junina e rodeio');
  const sept=Array.from({length:200},(_,i)=>i+1).find(d=>calendar(d).month===8&&calendar(d).weekday===0);check(eventForDay(sept).id==='farroupilha'&&calendar(sept).label.includes('14 de setembro'),'Semana Farroupilha cai em setembro');
  reset();G.event={id:'junina',seen:true,fired:{}};check(nameOf('cachaca')==='Quentão'&&price('cachaca')===8&&itemArtKey('cachaca')==='quentao'&&ITEM_ART.quentao.naturalWidth>0,'na festa junina a cachaça vira quentão');
  // Modo de testes escolhe o evento
  reset();G.testMode=true;G.phase='closed';planDay();check($('testEvent'),'modo de testes mostra a escolha de evento');$('testEvent').value='rodeio';action('chooseTestEvent');check(plannedEvent().id==='rodeio','modo de testes define o evento do próximo dia');closeDialog(true);
  reset();G.phase='closed';planDay();check(!$('testEvent'),'partida normal não escolhe evento');closeDialog(true);

  // Noite
  reset();G.phase='open';G.elapsed=0;check(nightLevel()===0,'tarde sem escuridão');G.elapsed=DAY;check(nightLevel()===1&&gameTimeText()==='23:00','às 23h é noite fechada');
  G.decor.lampiao_esq=true;draw();check(litLamps()===1,'lampião exposto acende à noite');
  // Cavalo removido
  check(!GEAR.horse&&!UPGRADES.some(u=>u.id==='horse')&&typeof horseArt==='undefined','cavalo removido do jogo');
 }finally{Math.random=random;reset();}
 return results;
})()
