'use strict';

function championshipActive(){return G.event.id==='campeonato'&&G.phase==='open';}
function startTournament(){
 if(!championshipActive()||G.tournament)return;
 // Uma inscrição por lugar disponível na abertura. Não entram reservas durante o dia.
 const tables=availableTables();G.tournament={tables:tables.map(t=>t.id),round:1,nextRotation:G.elapsed+40,rotation:[],pairs:[]};
 for(const t of tables){
  let g=G.groups.find(g=>g.id===t.group&&g.state!=='leave');t.dirty=false;
  if(g){
   if(['seated','chat'].includes(g.state))ensureDiners(g);
   while(g.members.length<4){const person=pickVisitor(g.members);if(person===null)break;g.members.push(person);if(g.diners)g.diners.push({person,orders:tableOrders({...g,person}),delivered:[],patience:ORDER_WAIT,maxPatience:ORDER_WAIT,status:'waiting'});}
   g.size=g.members.length;g.tournament=true;if(g.diners){g.state='seated';syncGroupOrders(g);}
  }else{t.group=null;t.plates=0;g=spawnGroup({size:4,targetTable:t.id,tournament:true});}
  if(!g)continue;
  g.pairs=[G.tournament.pairs.length,G.tournament.pairs.length+1];
  for(let i=0;i<2;i++)G.tournament.pairs.push({id:g.pairs[i],members:g.members.slice(i*2,i*2+2)});
 }
 const groups=G.groups.filter(g=>g.tournament);
 // Salvamentos antigos entram no novo formato sem cancelar pedidos já sentados.
 for(const g of G.groups.filter(g=>!g.tournament&&g.state!=='leave'))departGroup(g);
 for(const c of G.shop){if(c.state==='leave')continue;c.state='leave';c.dest=null;setDestination(c,EXIT);}
 G.tournament.rotation=[...groups.map(g=>g.pairs[0]),...groups.map(g=>g.pairs[1]).reverse()];
 say('Campeonato: '+G.tournament.pairs.length+' duplas inscritas. Elas ficam até fechar e trocam de adversários durante o dia.');save();
}
function tournamentRest(g){g.state='chat';g.chat=8;g.paid=true;syncGroupOrders(g);}
function renewTournamentOrders(g){
 if(G.tournament?.finished){g.chat=999;return;}
 const table=G.tables.find(t=>t.id===g.table);table.dirty=false;table.plates=0;
 seatDiners(g);g.state='seated';g.round++;g.paid=false;
}
function tournamentTick(){
 if(championshipActive()&&!G.tournament)startTournament();
 const tour=G.tournament;if(tour?.finished)return;if(G.elapsed>=DAY-25){finishHouseTournament();return;}if(!championshipActive()||!tour||G.elapsed<tour.nextRotation)return;
 const groups=G.groups.filter(g=>g.tournament);
 if(!groups.length||groups.some(g=>!['seated','chat'].includes(g.state))||G.tables.some(t=>t.fight))return;
 scoreHouseRound();const snapshots=new Map();
 for(const g of groups){ensureDiners(g);g.pairs.forEach((id,i)=>snapshots.set(id,{members:g.members.slice(i*2,i*2+2),diners:g.diners.slice(i*2,i*2+2),positions:[groupSeatPosition(g,i*2),groupSeatPosition(g,i*2+1)]}));}
 // Rodízio circular: parceiros permanecem juntos, adversários mudam a cada rodada.
 const rotation=tour.rotation;rotation.splice(1,0,rotation.pop());
 groups.forEach((g,i)=>{
  const ids=[rotation[i],rotation[rotation.length-1-i]],pairs=ids.map(id=>snapshots.get(id));
  g.pairs=ids;g.members=pairs.flatMap(p=>p.members);g.person=g.members[0];g.diners=pairs.flatMap(p=>p.diners);
  g.travel=pairs.flatMap(p=>p.positions).map((p,index)=>{
   const actor={...p,path:[],dest:null},target=groupSeatPosition({...g,state:'seated'},index);setDestination(actor,target);return actor;
  });
  g.state='tournamentMove';syncGroupOrders(g);
 });
 tour.round++;tour.nextRotation=G.elapsed+40;say('Rodada '+tour.round+': as duplas estão trocando de mesa. Os pedidos em andamento acompanham os fregueses.');save();
}
function moveTournamentGroup(g,dt){
 const finished=g.travel.map(actor=>moveActor(actor,dt)).every(Boolean);
 if(!finished)return;
 delete g.travel;g.state='seated';completeDinerRound(g);
}
function keepTournamentGroup(g,unhappy){
 if(!g.tournament||!championshipActive())return false;
 ensureDiners(g);
 if(unhappy)for(const d of g.diners){if(d.status!=='waiting')continue;G.stats.lost++;G.stats.waste+=d.delivered.reduce((n,i)=>n+i.cost,0);d.delivered=[];d.orders=[];d.status='lost';}
 tournamentRest(g);return true;
}
