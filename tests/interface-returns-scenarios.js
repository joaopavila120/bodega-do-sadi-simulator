(() => {
 const results=[],check=(v,label)=>{if(!v)throw Error(label);results.push(label);};
 const reset=()=>{G=fresh();G.xp=99999;G.levelSeen=7;G.contacts=Object.fromEntries([...ALWAYS_TALK].map(id=>[id,1]));started=true;paused=false;modal=null;phoneOpen=false;keys.clear();AudioEngine.on=false;G.tutorial.guided=false;['start','overlay','phone'].forEach(id=>$(id).classList.add('hidden'));};
 const approach=id=>{const f=furniture().find(f=>f.id===id);if(!f)throw Error('Ausente: '+id);
  for(let x=f.x-50;x<f.x+f.w+50;x+=8)for(let y=f.y-50;y<f.y+f.h+50;y+=8){if(!canWalk(x,y)||distRect({x,y},f)>45)continue;G.player={x,y,dx:1,dy:0};if(nearest()?.id===id)return;}throw Error('Inacessível: '+id);
 };
 reset();check($('openButton').closest('#gameSidebar')&&!document.querySelector('.hud #openButton'),'abrir bodega fica no menu lateral');
 check(!$('orderRail')&&$('toasts').closest('#gameSidebar')&&getComputedStyle($('toasts')).position!=='fixed','nenhuma faixa de pedidos ou avisos ocupa o topo');
 $('start').classList.remove('hidden');const logo=$('startLogo');logo.scrollIntoView({block:'center'});const r=logo.getBoundingClientRect();check(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2).closest('#start'),'tela inicial cobre totalmente a interface de gameplay');$('start').classList.add('hidden');
 check(!$('startingCharacter')&&$('avatarPreview'),'tela inicial mostra só o Sadi, sem seleção de personagem');
 for(const day of [2,3,5]){
  const sizes=new Set();for(let i=0;i<90;i++){reset();G.day=day;G.phase='open';G.elapsed=30;const g=spawnGroup({targetTable:1});if(!g||g.size<1||g.size>difficulty().maxGroup)throw Error('Truco fora dos limites');sizes.add(g.size);}
  check(sizes.has(difficulty().maxGroup),'turmas de truco seguem a progressão do dia '+day);
 }
 reset();G.up.tray=true;
 for(const key of ['pao_xis','burger','ovo','queijo','salada','cigarro','codorna','refri','salame','pepino','amendoim']){
  const unlock=GOODS[key].unlock;if(unlock)G.up[unlock]=true;G.stock[key]=4;
  const source=FIXED.find(f=>sourceProduct(f.id)===key).id;approach(source);const before=G.stock[key],cash=G.cash;interact();check(!!held()&&G.stock[key]===before-1,'retirada de '+key);
  check(hintText(nearest()).includes('devolver'),'dica de devolução de '+key);interact();check(!held()&&G.stock[key]===before&&G.cash===cash,'E devolve '+key+' sem cobrar ou duplicar');
 }
 approach('bin:pao_xis');interact();const other=G.stock.queijo;approach('bin:queijo');interact();check(held()?.key==='pao_xis'&&G.stock.queijo===other,'produto só volta à própria origem');approach('bin:pao_xis');interact();
 for(const key of ['erva','pinhao','bergamota']){
  if(GOODS[key].unlock)G.up[GOODS[key].unlock]=true;G.stock[key]=7000;const source=FIXED.find(f=>sourceProduct(f.id)===key).id;approach(source);startWeigh(key,source);const qty=G.task.requested;keys.add('e');holdTick(qty/G.task.maxWeight*2.5);keys.clear();finishWeigh();check(held()?.weight===qty,'pesagem antes de devolver '+key);interact();check(!held()&&Math.abs(G.stock[key]-7000)<.001,'devolução restaura o peso real de '+key);
 }
 reset();G.up.trago=G.up.bitter=G.up.coffee=true;
 for(const [key,source] of [['cerveja','tap:cerveja'],['cachaca','pour'],['bitter','bitter'],['cafe','coffee']]){
  G.stock[key]=3;readyProduct(key);const before=G.stock[key];approach(source);interact();check(held()?.pid===key&&G.stock[key]===before&&!G.task,'não devolve bebida preparada: '+key);takeHeld();
 }
 reset();takeFromBin('burger');useGrill(0);kitchenTick(COOK.burger+.1);useGrill(0);const cooked=held();approach('bin:burger');interact();save();G=readSave();approach('bin:burger');interact();check(held()?.ready&&held().heat===cooked.heat&&held().cost===cooked.cost,'ingrediente cozido devolvido preserva estado e custo ao salvar e retirar');
 held().burned=true;const count=G.stock.burger;interact();check(held().burned&&G.stock.burger===count,'produto queimado não contamina o estoque');takeHeld();
 G.up.tray=true;G.slot=1;approach('shop:cigarro');interact();G.hands[0]={kind:'ingredient',key:'pao_xis',cost:1.5};interact();check(!G.hands[1]&&G.hands[0]?.key==='pao_xis','devolução usa apenas o espaço selecionado da bandeja');G.hands=[null,null];G.slot=0;
 G.player={x:1525,y:432,dx:1,dy:0};refreshHUD();check(!$('enterCanchaButton').classList.contains('hidden')&&$('enterCanchaButton').classList.contains('context-button'),'cancha oferece botão contextual com o estilo dos outros controles');action('cancha');check(G.atCancha,'botão da cancha abre a porta');leaveCancha();
 reset();G.day=7;G.phase='open';G.up.table3=G.up.table4=true;
 for(let id=0;id<4;id++)spawnGroup({size:4,targetTable:id,fixedOrders:Array(12).fill('cerveja')});for(let i=0;i<350;i++)customersTick(.05);
 const bubbles=customerOrderBubbles(),overlap=(a,b)=>a.left<b.left+b.width&&a.left+a.width>b.left&&a.top<b.top+b.height&&a.top+a.height>b.top;
 check(bubbles.length===16&&bubbles.every((b,i)=>b.width<=58&&b.top>=282&&b.top+b.height<b.y&&!bubbles.slice(i+1).some(other=>overlap(b,other))),'balões com pedidos triplos não se sobrepõem nem cobrem cabeça ou mercadorias');
 reset();return results;
})()
