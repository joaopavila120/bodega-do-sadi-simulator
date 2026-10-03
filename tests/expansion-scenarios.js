// Exercita progressão, migração e as interações novas no navegador real.
(() => {
  const results=[];
  const check=(v,label)=>{if(!v)throw Error(label);results.push(label);};
  const tick=(seconds,fn)=>{for(let t=0;t<seconds;t+=.05)fn(.05);};
  const reset=()=>{G=fresh();G.tutorial.guided=false;started=true;paused=false;modal=null;phoneOpen=false;keys.clear();G.spawnShop=G.spawnGroup=999;for(const id of ['start','overlay','phone'])$(id).classList.add('hidden');};
  const approach=id=>{const f=furniture().find(f=>f.id===id);for(let x=f.x-50;x<=f.x+f.w+50;x+=8)for(let y=f.y-50;y<=f.y+f.h+50;y+=8)if(canWalk(x,y)){G.player={x,y,dx:1,dy:0};if(nearest()?.id===id)return;}throw Error('Não alcançou '+id);};
  reset();
  check(roomUnlocked(1)&&roomUnlocked(2)&&!roomUnlocked(3),'dois cenários iniciais e terceiro bloqueado');
  G.rep=100;G.cash=10000;
  for(const id of ['coffee','bootsGaucho','mateCuiudo'])buyUpgrade(id);
  check(!roomUnlocked(3),'três melhorias não liberam cenário antes da hora');
  buyUpgrade('tray');buyUpgrade('tray');
  check(improvementCount()===4&&roomUnlocked(3)&&!roomUnlocked(4),'quatro compras únicas desbloqueiam Room 3');
  for(const id of ['pepino','bergamota','amendoim','salame'])buyUpgrade(id);
  check(roomUnlocked(4)&&!roomUnlocked(5),'oito melhorias desbloqueiam Room 4');
  for(const id of ['pinhao','bitter','capacity','bacon'])buyUpgrade(id);
  chooseRoom(5);closeDialog(true);save();
  check(roomUnlocked(5)&&readSave().room===5,'doze melhorias desbloqueiam Room 5 e salvam a escolha');
  G.phase='open';chooseRoom(2);check(G.room===5,'cenário só pode ser trocado fora do expediente');
  for(const room of ROOMS){G.room=room.id;draw();}
  check(roomImages.every(im=>im.naturalWidth>0),'cinco cenários carregam e renderizam');

  reset();takeFromBin('pao_xis');useBench(0);takeFromBin('queijo');useBench(0);
  check(benchParts(G.kitchen.bench[0]).includes('queijo')&&!held(),'queijo entra diretamente no pão');
  takeFromBin('burger');useGrill(0);takeFromBin('ovo');useGrill(1);tick(11.1,kitchenTick);
  useGrill(0);useBench(0);useGrill(1);useBench(0);useBench(0);useBench(0);usePress();tick(6.1,kitchenTick);usePress();
  check(held()?.pid==='xis_salada'&&held().ready,'xis completo usando queijo fora da chapa');
  reset();approach('mate');
  for(let i=0;i<5;i++){keys.add('e');interact();tick(1.15,holdTick);keys.clear();}
  check(G.mateHerb===0&&G.boost===10,'cinco mates esgotam os 500 g');
  interact();check(!G.task,'cuia vazia bloqueia consumo');
  const stock=G.stock.erva;refillMate();check(G.stock.erva===stock,'reabastecer exige proximidade do balcão');
  approach('bag');refillMate();check(G.mateHerb===500&&G.stock.erva===stock-500,'reabastecimento consome 500 g do estoque real');
  G.mateHerb=0;G.stock.erva=70;refillMate();check(G.mateHerb===70&&G.stock.erva===0,'estoque parcial não cria erva');
  approach('mate');interact();check(!G.task,'carga menor que 100 g não dá impulso');
  G.mateHerb=230;save();check(readSave().mateHerb===230,'erva da cuia persiste no salvamento');

  reset();G.phase='open';G.event={id:'chuva',seen:true,fired:{}};
  const rainy=spawnGroup({size:1});tick(12,customersTick);
  check(G.puddles.length>=3&&G.puddles.some(p=>p.y<620),'chuva deixa rastros até a mesa, além da entrada');
  const count=G.puddles.length;tick(3,customersTick);check(G.puddles.length===count,'cliente parado não cria poças continuamente');
  const puddle=G.puddles.find(p=>p.y<620);G.player={x:puddle.x,y:puddle.y,dx:1,dy:0};progressionTick(.05);
  check(G.slow===8,'poça aplica oito segundos de lentidão');
  keys.add('e');interact();tick(.85,holdTick);keys.clear();
  check(!G.puddles.some(p=>p.id===puddle.id)&&G.slow===0,'limpeza remove a poça e a lentidão');

  reset();chooseDayEvent('gremio');check(G.event.id==='normal','eventos de TV bloqueados no primeiro dia');
  G.phase='closed';nextDay('gremio');closeDialog(true);G.event.seen=true;openDay();
  check(G.tv&&G.day===2&&G.event.id==='gremio','TV grátis e futebol liberados após o primeiro dia');
  for(const team of ['gremio','inter']){
    G.event={id:team,seen:true,fired:{}};G.groups=[];G.shop=[];for(const t of G.tables){t.group=null;t.dirty=false;}
    const g=spawnGroup({size:2});spawnShop();
    check(g.members.every(i=>PEOPLE[i].team===team)&&G.shop.every(c=>PEOPLE[c.person].team===team),'só '+team+' chega ao salão e ao balcão no seu evento');
  }
  G.groups=[];G.shop=[];for(const t of G.tables){t.group=null;t.dirty=false;t.mode='restaurant';}
  G.day=5;G.event={id:'grenal',seen:true,fired:{}};const derby=spawnGroup({size:2});tick(12,customersTick);
  check(new Set(derby.members.map(p=>PEOPLE[p].team)).size===2,'Gre-Nal reúne as duas torcidas');
  tick(18.1,footballTick);const table=G.tables[derby.table];
  check(table.fight?.seq.length===10,'Gre-Nal provoca briga também em mesa normal');
  approach('table:'+table.id);beginFight(table);for(const k of [...table.fight.seq])fightKey(k);
  check(!table.fight,'sequência completa separa as torcidas');
  G.elapsed=75;footballTick(.05);check(G.event.fired.halftime&&derby.orders.length>=2,'intervalo da TV provoca mais pedidos');

  reset();G.phase='open';
  const random=Math.random;try{Math.random=()=>.1;const g=spawnGroup({person:8});check(g.size>=2&&g.members[1]===9,'Márcio e Marcelo podem chegar juntos, inclusive em grupo de quatro');G.groups=[];G.tables.forEach(t=>t.group=null);Math.random=()=>.99;const solo=spawnGroup({person:9});check(solo.size===1&&solo.members[0]===9,'a dupla também tem visitas individuais');Math.random=()=>.05;check(!!PEOPLE[pickVisitor()].team,'torcedores podem visitar em dia normal');Math.random=()=>.9;check(!PEOPLE[pickVisitor()].team,'dias normais mantêm fregueses sem time');}finally{Math.random=random;}
  for(const p of [6,7,8,9,10,22]){const line=nextProse(p);check(!!line.reply,'diálogo próprio de '+PEOPLE[p].name);}
  const imported=parseDialogueText('# comentário\n[badin]\nPergunta nova | Resposta nova\n[gremio]\nJogo? | Dá-lhe!');
  check(imported.badin[0].reply==='Resposta nova','arquivo de texto aceita falas por personagem');
  let rejected=false;try{parseDialogueText('[inexistente]\nOi | Tchau');}catch(_){rejected=true;}check(rejected,'texto inválido informa erro sem substituir falas');
  customDialogues=imported;check(nextProse(6).reply==='Resposta nova','fala importada é usada na conversa');customDialogues={};
  const old=fresh();old.version=7;old.day=3;delete old.room;delete old.mateHerb;delete old.tv;old.friends=[4,2,0,0,0,0];old.regulars=[1,2,0,0,0,0];old.groups=[{person:1,size:2,patience:72.5,maxPatience:145}];const migrated=normalizeSave(old);
  check(migrated.friends.length===PEOPLE.length&&migrated.friends[0]===4&&migrated.tv&&migrated.mateHerb===500&&migrated.groups[0].patience===55,'partida antiga preserva afeto e migra tempos, TV e cuia');
  check(ORDER_WAIT===110&&COUNTER_WAIT===95,'pedidos com tempo reduzido');
  reset();return results;
})()
