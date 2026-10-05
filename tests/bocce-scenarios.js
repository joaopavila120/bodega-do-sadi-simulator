(() => {
 const results=[],check=(v,label)=>{if(!v)throw Error(label);results.push(label);};
 const step=(seconds)=>{for(let t=0;t<seconds;t+=1/60)bocceTick(1/60);};
 const reset=()=>{G=fresh();G.xp=99999;G.levelSeen=7;G.contacts=Object.fromEntries([...ALWAYS_TALK].map(id=>[id,1]));started=true;paused=false;modal=null;phoneOpen=false;keys.clear();AudioEngine.on=false;G.cash=500;['start','overlay'].forEach(id=>$(id).classList.add('hidden'));};
 const begin=(wager=25,level='normal')=>{G.phase='closed';G.report={...G.stats,end:G.cash,profit:0};bocceMenu();$('bocceWager').value=String(wager);$('bocceLevel').value=level;startBocceGame();};
 reset();bocceMenu();check(!G.bocce&&modal==='bocceSetup','bocha disponível antes de abrir a bodega');closeDialog(true);
 begin();check(G.bocce.wager===25&&G.cash===475&&G.stats.bocceStakes===25,'aposta da bocha sai do caixa uma única vez');
 startBocceGame();check(G.cash===475,'duplo clique não desconta outra aposta');
 step(1.25);check(G.bocce.phase==='direction'&&G.bocce.balls[0].y>=175&&G.bocce.balls[0].y<=325,'bolim lançado automaticamente na região distante');
 const x=G.bocce.playerX;keys.add('d');step(.3);keys.clear();check(G.bocce.playerX>x,'posição de lançamento responde ao movimento');
 const clock=G.elapsed,chefX=G.player.x,stock=G.stock.erva;keys.add('d');simulate(.1);keys.clear();check(G.player.x===chefX&&G.elapsed===clock&&G.stock.erva===stock,'bodega fica congelada enquanto joga bocha');
 confirmBocce();const angle=G.bocce.angle;keys.add('a');const frozenX=G.bocce.playerX;step(.4);keys.clear();
 check(G.bocce.phase==='power'&&G.bocce.angle===angle&&G.bocce.playerX===frozenX&&G.bocce.power>0,'direção travada antes da escolha da força');
 const power=G.bocce.power;step(.7);check(G.bocce.power!==power,'barra de força oscila automaticamente');
 confirmBocce();check(G.bocce.used[0]===1&&G.bocce.phase==='rolling','segundo comando lança apenas uma bocha');
 confirmBocce();check(G.bocce.used[0]===1,'clique durante rolamento não gasta outra bocha');
 const moving=JSON.stringify(G.bocce.balls);save();const saved=readSave();
 check(saved.bocce.used[0]===1&&saved.bocce.wager===25&&JSON.stringify(saved.bocce.balls)===moving&&saved.bocce.paused,'salvamento preserva aposta, posição e velocidade das bolas');
 toggleBoccePause(true);const before=JSON.stringify(G.bocce.balls);step(1);check(JSON.stringify(G.bocce.balls)===before,'pausa congela a física da bocha');toggleBoccePause(false);
 let limit=0;while(G.bocce.used[1]===0&&limit++<2000)bocceTick(1/60);
 check(G.bocce.used[1]===1&&G.bocce.used[0]===1,'IA lança depois do jogador');
 const a={x:300,y:400,vx:0,vy:-250,r:12,mass:1},ball={x:300,y:379,vx:0,vy:0,r:12,mass:1};handleBocceCollision(a,ball);
 check(ball.vy<0&&bocceDistance(a,ball)>=24,'colisão transfere velocidade e separa bochas');
 const jack={x:300,y:383,vx:0,vy:0,r:7,mass:.5},shot={x:300,y:400,vx:0,vy:-300,r:12,mass:1};handleBocceCollision(shot,jack);
 check(jack.vy<0&&bocceDistance(shot,jack)>=19,'batida também desloca o bolim');
 let score=calculateBocceRoundScore([{owner:-1,x:0,y:0},{owner:0,x:34,y:0},{owner:0,x:51,y:0},{owner:1,x:72,y:0}]);
 check(score.winner===0&&score.points===2,'pontuação: duas azuis mais próximas dão dois pontos');
 score=calculateBocceRoundScore([{owner:-1,x:0,y:0},{owner:0,x:40,y:0},{owner:1,x:-40,y:0}]);
 check(score.winner===null&&score.points===0,'empate exato não dá pontos');
 check(bocceSpeed(.8)-bocceSpeed(.6)>bocceSpeed(.4)-bocceSpeed(.2),'força tem resposta não linear');
 check(projectBocce(300,1000).scale>projectBocce(300,200).scale,'perspectiva reduz bolas no fundo');
 // Completa uma rodada com física real: cada lado usa exatamente quatro bolas.
 G.bocce.phase='between';G.bocce.round=0;startNextBocceRound();step(1.3);
 for(let ticks=0;ticks<15000&&!['between','over'].includes(G.bocce.phase);ticks++){
   if(G.bocce.phase==='direction'){const b=G.bocce,j=b.balls[0];b.playerX=300;b.angle=Math.atan2(j.x-300,BOCCE.launchY-j.y);confirmBocce();b.power=boccePowerForDistance(Math.hypot(j.x-300,BOCCE.launchY-j.y));confirmBocce();}
   bocceTick(1/60);
 }
 check(G.bocce.used.every(n=>n===4)&&G.bocce.balls.length===9&&G.bocce.phase==='between','rodada completa alterna oito lançamentos e mede o resultado');
 check(G.bocce.score.reduce((a,b)=>a+b,0)<=4,'somente um lado pontua por rodada');
 const balance=G.cash;G.bocce.score=[5,0];G.bocce.phase='rolling';G.bocce.balls=[{owner:-1,x:300,y:200},...[0,1].flatMap(owner=>[0,1,2,3].map(i=>({owner,x:300+20+i*20+owner*100,y:200})))];finishBocceRound();
 check(G.bocce.phase==='over'&&G.bocce.score[0]>=6,'atingir seis pontos encerra a partida automaticamente');
 settleBocce(0);check(G.cash===balance+50&&G.stats.bocceReturns===50&&G.report.end===G.cash,'vitória paga o dobro uma vez e atualiza o relatório');
 const settled=readSave();G=settled;settleBocce(0);check(G.cash===balance+50,'recarregar uma vitória não duplica prêmio');
 leaveBocce();check(!G.bocce&&G.phase==='closed'&&modal==='report','retorno ao caixa preserva o fim do dia');closeDialog(true);
 begin(10);settleBocce(1);check(G.cash===balance+40&&G.stats.bocceReturns===50,'derrota perde somente a entrada');leaveBocce();closeDialog(true);
 begin(0,'easy');check(G.bocce.wager===0&&G.bocce.level==='easy','treino sem aposta funciona');settleBocce(1);leaveBocce();closeDialog(true);
 begin(5);const cashBeforeExit=G.cash,confirmBefore=window.confirm;try{window.confirm=()=>false;leaveBocce();check(!!G.bocce&&!G.bocce.settled,'cancelar desistência mantém a partida');window.confirm=()=>true;leaveBocce();check(!G.bocce&&G.cash===cashBeforeExit,'desistência perde a entrada, sem segunda cobrança');}finally{window.confirm=confirmBefore;}closeDialog(true);
 check(BOCCE_LEVELS.easy.angle>BOCCE_LEVELS.normal.angle&&BOCCE_LEVELS.normal.angle>BOCCE_LEVELS.hard.angle,'três dificuldades regulam a precisão da IA');
 reset();begin(25);step(1.3);return results;
})()
