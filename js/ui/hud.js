// Atualização da HUD, textos informativos (toast), efeitos de partículas e dinheiro
'use strict';

function refreshHUD(){
 $('bodegaBrand').textContent=G.bodegaName||'Bodega Do Sadi';const sec=Math.ceil(Math.max(0,DAY-G.elapsed));
 $('cash').textContent=walletText();$('clock').textContent=tutorialActive()?'Tutorial':String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');$('reputation').textContent=Math.round(G.rep);
 $('soundButton').textContent=AudioEngine.on?'♫':'♪';$('soundButton').setAttribute('aria-label',AudioEngine.on?'Desligar som':'Ligar som');
 $('dayNotice').textContent='DIA '+G.day+'\n'+eventInfo().icon+' '+eventInfo().name;
 updatePaymentFeedback();$('openButton').textContent=tutorialActive()&&G.phase==='open'?'Dia de aprendizado':{prep:'Abrir bodega',open:'Fechar portas',closing:'Encerrar dia',closed:'Próximo dia'}[G.phase];
 $('hands').innerHTML=G.hands.slice(0,G.up.tray?2:1).map((i,n)=>`<button class="hand-slot ${G.slot===n?'active':''}" data-act="slot" data-id="${n}" aria-label="Espaço ${n+1}: ${i?itemLabel(i):'vazio'}" title="${i?itemLabel(i):'Mãos livres'}"><span class="number">${n+1}</span>${i?`<span class="item-icon">${itemIconHTML(i.pid||i.key,i)}</span><small>${i.spoiled?'ESTRAGADO':i.burned?'QUEIMADO':i.kind==='assembled'?'PRENSAR':i.kind==='ingredient'&&COOK[i.key]?(i.ready?'PRONTO':'CRU'):bulk(i.pid)?formatWeight(i.weight||bulk(i.pid).unit):'NA MÃO'}</small>`:'<span style="font-size:23px;color:#e2c797">✋</span><small>LIVRE</small>'}</button>`).join('');
 $('hint').innerHTML=hintText(nearest());updateDialogue();updateFightUI();updateContextActions();
}

function say(text){const e=document.createElement('div');e.className='toast';e.textContent=text;e.title=text;$('toasts').replaceChildren(e);setTimeout(()=>e.remove(),5000);}

function effect(text,x,y,color='#fce59e'){sparks.push({text,x,y,life:2.2,color});}

function burst(x,y,type='spark'){for(let i=0;i<7;i++)G.visual.push({x,y,dx:(Math.random()-.5)*80,dy:-20-Math.random()*40,life:.7+Math.random()*.4,total:1,type});}
