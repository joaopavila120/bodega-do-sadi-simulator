// Sistema de conversa com os fregueses e contação de causos
'use strict';

const ALWAYS_TALK = new Set(['badin','guri','marcio','marcelo','indavirus','lauro','peixinhonabrasa','manolima']);

function deliveryConversation(person,actor,diner=null){
 G.conversations[person]++;G.friends[person]=Math.min(100,(G.friends[person]||0)+3);
 G.dialogueQueue=[];
 // Fregueses comuns falam em 20% das entregas; especiais sempre têm uma fala.
 if(!ALWAYS_TALK.has(PEOPLE[person].id)&&Math.random()>=.2){save();return;}
 const line=nextProse(person);
 G.dialogue={name:PEOPLE[person].name,player:line.player,reply:line.reply,title:line.title||'Prosa de balcão',source:line.source||null,life:15};
 AudioEngine.heart();save();updateDialogue();
}
function advanceDialogue(){G.dialogue=null;G.dialogueQueue=[];updateDialogue();save();}

function updateDialogue(){const d=G.dialogue;$('dialogueUI').classList.toggle('hidden',!d);if(!d)return;$('dialogueName').textContent=d.name+' · '+d.title;$('dialoguePlayer').textContent='Você: '+d.player;$('dialogueReply').textContent=d.reply;$('dialogueSource').innerHTML=d.source?'<a href="'+d.source+'" target="_blank" rel="noopener">Lenda adaptada · fonte</a>':'Diálogo original da bodega';}

function nextProse(person){const personal=personalizedProse(person);if(personal&&(PEOPLE[person].exclusiveVoice||G.friends[person]<12||G.conversations[person]%4!==0))return personal;const seen=new Set(G.dialogueSeen||[]),stories=STORIES.map((s,i)=>({id:'story:'+i,player:'E aquele causo que tu ficou de me contar?',reply:s.text,title:s.title,source:s.source,affinity:s.affinity})).filter(s=>G.friends[person]>=s.affinity);let ordinary=PROSE.filter(s=>!seen.has(s.id)),lore=stories.filter(s=>!seen.has(s.id));if(!ordinary.length&&!lore.length){G.dialogueSeen=[];ordinary=[...PROSE];lore=stories;}const pool=lore.length&&(!ordinary.length||G.conversations[person]%4===0)?lore:ordinary;const line=pick(pool);G.dialogueSeen.push(line.id);return line;}
