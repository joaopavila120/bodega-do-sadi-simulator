// Gestão de clientes, fila do balcão, ocupação de mesas e pedidos
'use strict';

function availableTables(){return G.tables.filter(t=>!t.unlock||G.up[t.unlock]);}

function queueSpot(index,shop=false){return shop?{x:1250-index*72,y:868}:{x:880,y:830-index*60};}

function resetQueuePaths(){let i=0;for(const g of G.groups.filter(g=>g.state==='wait'))setDestination(g,queueSpot(i++));G.shop.filter(c=>c.state==='queue').forEach((c,j)=>setDestination(c,queueSpot(j,true)));}

function arrivalInterval(kind){const shop=kind==='shop',e=G.event.id;let n=shop?(G.day===1?27:19):(G.day===1?65:57);if(e==='chuva')n*=.78;if(isFootball())n*=shop?.9:.72;if(e==='feira')n*=shop?.7:1.4;if(e==='truco')n*=shop?1.1:.8;if(e==='campeonato')n*=shop?1.15:.48;if(e==='geada')n*=shop?1.05:.85;if(e==='baile')n*=G.elapsed<75?.63:2.4;if(e==='farroupilha')n*=shop?.8:.75;if(e==='junina')n*=shop?.8:.85;if(e==='rodeio')n*=shop?1.1:.6;return n;}

function spawnShop(options={}){if(championshipActive())return;if(G.phase!=='open'||G.shop.filter(c=>c.state==='queue').length>=(G.day===1?2:4))return;const choices=Object.keys(GOODS).filter(k=>(GOODS[k].cat==='Balcão'||k==='cafe')&&orderable(k,bulk(k)?bulk(k).weights[0]:1));if(!choices.length&&!options.pid)return;let person=pickVisitor();if(person===null)return;if(options.pid==='cigarro'&&specialOpponent(person))person=pick(visitorPool(isFootball()&&G.event.id!=='grenal'?G.event.id:null).filter(i=>!specialOpponent(i)&&visitorAvailable(i)));if(person===undefined)return;const allowedChoices=choices.filter(k=>k!=='cigarro'||!specialOpponent(person));if(!allowedChoices.length&&!options.pid)return;const habit=PEOPLE[person].retailFav;const festive=G.event.id==='junina'&&allowedChoices.includes('pinhao')&&Math.random()<.5?'pinhao':G.event.id==='farroupilha'&&allowedChoices.includes('erva')&&Math.random()<.4?'erva':null;let key=options.pid||festive||(G.elapsed<50&&allowedChoices.includes('cigarro')&&(G.shopVisits===0||Math.random()<.7)?'cigarro':allowedChoices.includes(habit)&&Math.random()<.3?habit:pick(allowedChoices));const weights=bulk(key)?.weights.filter(n=>orderable(key,n));if(weights&&!weights.length)return;const grams=options.grams??(weights?pick(weights):null);const customer={id:G.next++,person,pid:key,grams,challenge:grams?makeChallenge(grams):null,x:ENTRY.x,y:ENTRY.y,path:[],dest:null,state:'queue',patience:COUNTER_WAIT,maxPatience:COUNTER_WAIT,training:!!options.training,fiado:!options.training&&wantsFiado(person)};G.shop.push(customer);G.shopVisits++;resetQueuePaths();announceArrivals([person]);return customer;}

function serveShop(c){if(c!==G.shop.find(x=>x.state==='queue'))return;const i=held();if(!validForDelivery(i))return;if(i.pid!==c.pid){say('O pedido é '+nameOf(c.pid)+'.');return;}if(bulk(c.pid)&&Math.abs((i.weight||bulk(c.pid).unit)-c.grams)>weightTolerance(c.grams,c.challenge)){say('Este pedido quer '+formatWeight(c.grams)+'. Pese o pacote na faixa indicada.');AudioEngine.bad();return;}takeHeld();G.tutorial.shop=true;if(c.fiado&&fiadoTotal()+salePrice(i)>creditLimit()){c.fiado=false;say('Caderninho no limite: '+PEOPLE[c.person].name+' pagou à vista.');}pay([i],c.person,c.patience/c.maxPatience,true,c.x,c.y,c.fiado);deliveryConversation(c.person,c);tutorialDelivered(c,i.pid);c.state='leave';c.dest=null;setDestination(c,EXIT);resetQueuePaths();save();}

function spawnGroup(options={}){
 if(championshipActive()&&G.tournament&&!options.tournament)return null;
 if(G.phase!=='open'||!options.dailyTruco&&G.groups.filter(g=>g.state!=='leave').length>=availableTables().length+(G.day===1?1:3))return null;
 const requested=options.members?.[0]??options.person,person=requested!==undefined&&visitorAvailable(requested)?requested:pickVisitor();if(person===null)return null;
 const size=clamp(options.size??Math.max(G.event.id==='campeonato'?2:1,restaurantGroupSize(person)),1,4);
 let members=groupMembers(person,size);
 if(options.members){members=[];for(let i=0;i<size;i++){const candidate=options.members[i];members.push(visitorAvailable(candidate,members)?candidate:pickVisitor(members));}}
 const g={id:G.next++,x:ENTRY.x,y:ENTRY.y,path:[],dest:null,state:'wait',table:null,reserved:false,orders:[],delivered:[],patience:ORDER_WAIT,maxPatience:ORDER_WAIT,waitLeft:110,age:0,chat:0,round:0,paid:false,...options,person:members[0],size:members.length,members};
 G.groups.push(g);assignTables();announceArrivals(members);return g;
}

function assignTables(){for(const g of G.groups.filter(g=>g.state==='wait')){const t=availableTables().sort((a,b)=>(a.seatings||0)-(b.seatings||0)).find(t=>!t.group&&!t.dirty&&!t.fight&&t.seats>=g.size&&(g.targetTable===undefined||t.id===g.targetTable));if(!t)continue;t.seatings=(t.seatings||0)+1;t.group=g.id;g.table=t.id;g.state='walkTable';g.reserved=true;setDestination(g,{x:t.x+t.w/2,y:t.y+t.h+39});}resetQueuePaths();}

function tableOrders(g){
 if(g.fixedOrders){const a=g.fixedOrders;delete g.fixedOrders;return [...a];}
 const table=G.tables.find(t=>t.id===g.table),drinks=drinkPool(),snacks=snackPool(),d=difficulty(),cards=G.event.id==='campeonato';
 const recipes=Object.keys(RECIPES).filter(k=>!RECIPES[k].unlock||G.up[RECIPES[k].unlock]);
 let first;if(cards)first=pick(Math.random()<.5&&snacks.length?snacks:alcoholPool());

 else if(G.event.id==='junina'&&unlocked('cachaca')&&Math.random()<.45)first='cachaca';
 else if(G.event.id==='rodeio'&&Math.random()<.5)first=pick(['cerveja','xis_salada']);
 else if(G.event.id==='farroupilha'&&Math.random()<.35)first=pick(alcoholPool());
 else first=Math.random()<.35?pick(recipes):snacks.length&&Math.random()<.35?pick(snacks):pick(drinks);
 const orders=[first];if(d.maxItems>=2&&Math.random()<(G.day<5?.35:.75))orders.push(pick(cards?alcoholPool():drinks));
 if(d.maxItems===3&&Math.random()<.35&&snacks.length)orders.push(pick(snacks));return orders;
}

function customersTick(dt){for(const c of G.shop){if(c.state==='queue'){moveActor(c,dt);c.patience-=(c.training?0:dt)*(c===G.shop.find(x=>x.state==='queue')?1:.45);if(c.patience<=0){c.state='leave';c.dest=null;setDestination(c,EXIT);G.rep=clamp(G.rep-1,0,100);G.stats.lost++;resetQueuePaths();}}else moveActor(c,dt,132);}G.shop=G.shop.filter(c=>c.state!=='leave'||c.path.length);resetQueuePaths();
 for(const g of [...G.groups]){g.age+=dt;if(G.tables.find(t=>t.id===g.table)?.fight)continue;if(g.state==='tournamentMove'){moveTournamentGroup(g,dt);}else if(g.state==='wait'){moveActor(g,dt);g.waitLeft-=(g.training?0:dt)*.45;if(g.waitLeft<=0)departGroup(g,true);}else if(g.state==='walkTable'){if(moveActor(g,dt)){g.state='seated';seatDiners(g);g.seatedAt=G.elapsed;if(!G.tutorial.tableTip){G.tutorial.tableTip=true;say('Cada lugar tem seu pedido e seu prazo nos balões sobre os fregueses. Sirva com E.');}}}else if(g.state==='seated'){tickDiners(g,dt);}else if(g.state==='chat'){g.chat-=dt;if(g.chat<=0){if(g.tournament&&championshipActive()){renewTournamentOrders(g);continue;}if(G.day>=3&&g.round===0&&G.phase==='open'&&G.elapsed-(g.seatedAt||0)<85&&Math.random()<.3){addDinerRound(g);effect('Mais uma rodada!',g.x,g.y-70);}else departGroup(g);}}else moveActor(g,dt,126);}
 G.groups=G.groups.filter(g=>g.state!=='leave'||g.path.length);assignTables();

}

function departGroup(g,unhappy=false){if(keepTournamentGroup(g,unhappy))return;const table=G.tables.find(t=>t.id===g.table);if(table?.fight){table.fight=null;if(G.fightTarget===table.id)G.fightTarget=null;updateFightUI();}if(table&&table.group===g.id){table.group=null;table.dirty=table.plates>0;if(table.dirty&&!G.tutorial.cleanTip){G.tutorial.cleanTip=true;say('Mesa suja: aproxime-se com as mãos livres e segure E para limpar.');}g.reserved=false;}if(unhappy){if(g.diners)syncGroupOrders(g);G.stats.lost+=g.diners?g.diners.filter(d=>d.status==='waiting').length:1;G.rep=clamp(G.rep-1.5,0,100);G.stats.waste+=g.delivered.reduce((n,i)=>n+i.cost,0);g.delivered=[];effect('Até outra hora…',g.x,g.y-70,'#e7b097');}g.table=null;g.state='leave';g.dest=null;setDestination(g,EXIT);assignTables();}

function clearUnserved(){let waste=0;for(const i of [...G.hands,...G.kitchen.grill,...G.kitchen.parking,G.kitchen.press,...G.floor.map(f=>f.item)])if(i)waste+=i.cost||0;for(const b of G.kitchen.bench)if(b)waste+=b.items.reduce((n,i)=>n+i.cost,0);G.stats.waste+=waste;G.hands=[null,null];G.kitchen={grill:[null,null,null],bench:[null,null],press:null,parking:[null,null]};G.floor=[];}
