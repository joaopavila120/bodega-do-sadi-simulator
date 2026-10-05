'use strict';

// O expediente de estreia avança por ações reais, sem relógio ou chegadas aleatórias.
const TUTORIAL_STEPS=[
 {id:'cigarro',title:'Seu primeiro freguês',pid:'cigarro',text:'Pegue um maço na prateleira de cigarros com E. Leve até o balcão de atendimento, embaixo à direita, e aperte E para entregar.'},
 {id:'cerveja',title:'Cerveja na caneca',pid:'cerveja',text:'Vá à torneira de cerveja, ao lado da geladeira. Segure E e solte na faixa verde. Leve a caneca ao balcão e entregue com E.'},
 {id:'xis',title:'Um xis no capricho',pid:'xis_salada',text:'Este freguês espera na mesa 1. Prepare o xis seguindo a dica ao lado: monte, prense e entregue com E perto da mesa.'},
 {id:'upgrade',title:'Sua primeira melhoria é grátis',text:'Vamos fazer uma pausa nas chegadas. Aperte C, abra Melhorias e instale a Mesa de tragos por R$ 0. Ela inclui dez doses. Depois feche o celular com C.'},
 {id:'trago',title:'Inaugure a mesa de tragos',pid:'cachaca',text:'A mesa nova fica abaixo da torneira de cerveja. Segure E para servir a cachaça, solte na faixa verde e entregue ao freguês no balcão.'},
 {id:'erva',title:'Erva no peso certo',pid:'erva',grams:500,text:'O freguês quer 500 g de erva-mate. Vá ao saco de erva nas mercadorias, segure E e solte na faixa verde. Se errar, use Recomeçar. Entregue o pacote no balcão.'},
 {id:'fiado',title:'Pendura no caderninho',pid:'codorna',fiado:true,text:'Este freguês pediu ovos de codorna <b>fiado</b> (📒 no balão). Pegue os ovos na prateleira e entregue no balcão com E: o valor vai para o caderninho, sem entrar no caixa agora. Quem paga em dia traz 10% de juros de amizade; alguns demoram e outros somem. No Celular → Fiado você acompanha, cobra ou perdoa as contas. Para recusar um fiado, aperte X no balcão.'},
 {id:'mate',title:'Uma pausa para o chimarrão',text:'Agora, com as mãos livres, vá à cuia e segure E para tomar mate. Ele dá velocidade por alguns segundos e pode ser tomado sempre que quiser.'},
 {id:'clean',title:'Casa pronta para amanhã',text:'Com as mãos livres, aproxime-se da mesa 1 e segure E para limpar. Depois o primeiro dia termina. Amanhã o movimento e a dificuldade começam a crescer.'}
];
function tutorialActive(){return G.day===1&&G.tutorial.guided&&!G.tutorial.complete;}
function tutorialStep(){return TUTORIAL_STEPS[G.tutorial.step||0];}
function tutorialUpgradeAllowed(id){return !tutorialActive()||tutorialStep()?.id==='upgrade'&&id==='trago';}
function tutorialDelivered(actor,pid){if(!tutorialActive()||actor.id!==G.tutorial.actor||pid!==tutorialStep().pid)return;G.tutorial.delivered=true;save();}
function tutorialAdvance(){G.tutorial.step++;G.tutorial.actor=null;G.tutorial.delivered=false;G.tutorial.introduced=false;save();}
function tutorialTick(){
 if(!tutorialActive()||G.phase!=='open')return;
 const t=G.tutorial,s=tutorialStep();
 if(!s){t.complete=true;save();finishDay();return;}
 // Um freguês termina de sair antes de começar a explicação seguinte.
 if(t.delivered){if(G.shop.length||G.groups.length)return;tutorialAdvance();return;}
 if(!t.introduced){
  if(G.shop.length||G.groups.length||phoneOpen)return;
  t.introduced=true;
  if(s.id==='upgrade')phoneTab='upgrades';
  if(s.id==='mate')t.mate=false;
  if(s.pid){
   let actor;
   if(s.id==='xis')actor=spawnGroup({size:1,targetTable:0,fixedOrders:[s.pid],training:true});
   else actor=spawnShop({pid:s.pid,grams:s.grams,training:true,fiado:!!s.fiado});
   if(!actor){t.introduced=false;return;}
   t.actor=actor.id;
  }
  openDialog('Passo '+(t.step+1)+' de '+TUTORIAL_STEPS.length+' · '+s.title,`<p>${s.text}</p><p>Hoje você aprende no seu ritmo: um freguês por vez, sem prazo para entregar.</p><button class="primary" data-act="close">Vamos lá</button>`,'tutorial');save();return;
 }
 if(s.id==='upgrade'&&G.up.trago&&!phoneOpen||s.id==='mate'&&t.mate||s.id==='clean'&&!G.tables[0].dirty&&!G.tables[0].group)tutorialAdvance();
}
function tutorialXisHint(){
 const press=G.kitchen.press,h=held(),b=G.kitchen.bench.find(Boolean);
 if(h?.pid==='xis_salada'&&h.ready)return 'Leve o xis pronto à mesa 1 e aperte E para servir.';
 if(press)return press.burned?'Queimou! Retire e descarte na lixeira. Você pode preparar outro.':press.ready?'O xis está pronto! Retire da prensa com E e leve à mesa 1.':'Espere a prensa terminar; retire quando dourar para não queimar.';
 if(h?.kind==='assembled')return 'Leve o xis montado à prensa, embaixo à esquerda, e aperte E.';
 if(h?.burned)return 'Leve o ingrediente queimado à lixeira e pegue outro.';
 if(h?.kind==='ingredient')return COOK[h.key]&&!h.ready?'Leve '+nameOf(h.key)+' a uma chapa livre e aperte E. Retire quando estiver pronto.':'Leve '+nameOf(h.key)+' à bancada de montagem e aperte E.';
 if(!b)return 'Pegue pão na primeira caixa da cozinha e coloque na bancada central com E.';
 const parts=benchParts(b);if(matchRecipe(parts))return 'Com as mãos livres, aperte E na bancada para pegar o xis montado.';
 const cooking=G.kitchen.grill.find(Boolean);
 if(cooking)return cooking.burned?'Retire o ingrediente queimado e descarte na lixeira.':cooking.ready?'Retire '+nameOf(cooking.key)+' da chapa e coloque na bancada.':'Espere '+nameOf(cooking.key)+' cozinhar na chapa. Retire assim que ficar pronto.';
 const next=['queijo','salada','burger','ovo'].find(k=>!parts.includes(k));return 'Pegue '+nameOf(next)+'. '+(COOK[next]?'Cozinhe na chapa antes de colocar na bancada.':'Coloque diretamente no pão na bancada com E.');
}
function tutorialHint(){
 if(!tutorialActive())return '<b>Tutorial concluído ✓</b><p>Consulte o Guia para receitas e melhorias.</p>';
 const s=tutorialStep();if(!s)return '<b>Primeiro dia concluído!</b>';
 const text=G.phase==='prep'?'Abra a bodega no botão do menu lateral para receber seu primeiro freguês.':G.tutorial.delivered?'Atendimento concluído! Espere o freguês sair para a próxima etapa.':s.id==='xis'?tutorialXisHint():s.text;
 return '<b>'+(G.tutorial.step+1)+' / '+TUTORIAL_STEPS.length+' · '+s.title+'</b><p>'+text+'</p>';
}
function tutorialWelcome(){openDialog('Dia 1 · Um passo de cada vez','<p>Hoje é sem pressa: um freguês por vez, com as instruções em cada etapa. Amanhã começam os eventos e os pedidos com prazo.</p><button class="primary" data-act="close">Preparar para abrir</button>','welcome');}
