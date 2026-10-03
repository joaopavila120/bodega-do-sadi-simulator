'use strict';
let customDialogues={};
const dialogueKeys=()=>new Set([...PEOPLE.map(p=>p.id),'gremio','inter','todos']);
function parseDialogueText(text){
  const result={},allowed=dialogueKeys();let section=null;
  for(const [index,raw] of text.replace(/^\uFEFF/,'').split(/\r?\n/).entries()){
    const line=raw.trim();if(!line||line.startsWith('#'))continue;
    const heading=line.match(/^\[([\w]+)\]$/);
    if(heading){section=heading[1].toLowerCase();if(!allowed.has(section))throw Error('Personagem desconhecido na linha '+(index+1)+': '+section);result[section]??=[];continue;}
    if(!section)throw Error('Informe [personagem] antes da linha '+(index+1));
    const parts=line.split('|').map(p=>p.trim());
    if(parts.length!==2||parts.some(p=>!p)||line.length>1400)throw Error('Linha '+(index+1)+': use Pergunta | Resposta (até 1400 caracteres).');
    result[section].push({player:parts[0],reply:parts[1]});
  }
  if(!Object.values(result).some(lines=>lines.length))throw Error('Nenhum diálogo encontrado.');
  return result;
}
function personalizedProse(person){const p=PEOPLE[person],key=p.id;const lines=customDialogues[key]?.length?customDialogues[key]:customDialogues[p.dialogueKey]?.length?customDialogues[p.dialogueKey]:DEFAULT_DIALOGUES[key]||DEFAULT_DIALOGUES[p.dialogueKey]||customDialogues.todos;if(!lines?.length)return null;const seen=new Set(G.dialogueSeen),pool=lines.map((l,i)=>({...l,id:'person:'+key+':'+i}));let available=pool.filter(l=>!seen.has(l.id));if(!available.length){G.dialogueSeen=G.dialogueSeen.filter(id=>!id.startsWith('person:'+key+':'));available=pool;}const line=pick(available);G.dialogueSeen.push(line.id);return line;}
// HTTP lê texto puro; file:// usa apenas o comentário da função do TXT.
// O corpo da função nunca é executado, e as falas são exibidas com textContent.
async function restoreDialogues(){
  try {
    let text;
    if(location.protocol==='file:'){
      await new Promise((resolve,reject)=>{
        const script=document.createElement('script');
        script.src='dialogos.txt?v='+Date.now();
        script.onload=resolve;script.onerror=()=>reject(Error('dialogos.txt não encontrado'));
        document.head.append(script);
      });
      if(typeof window.BODEGA_DIALOGUE_SOURCE!=='function')throw Error('Preserve a primeira e a última linha do dialogos.txt');
      text=Function.prototype.toString.call(window.BODEGA_DIALOGUE_SOURCE);
    }else{
      const response=await fetch('dialogos.txt',{cache:'no-store'});
      if(!response.ok)throw Error('Não foi possível ler dialogos.txt');
      text=await response.text();
    }
    customDialogues=parseDialogueText(unwrapDialogueText(text));
  }catch(error){customDialogues={};console.warn('Diálogos padrão em uso:',error.message);say('Diálogos: '+error.message+'. Usando as falas padrão.');}
}
function unwrapDialogueText(text){
  const start=text.indexOf('/*'),end=text.lastIndexOf('*/');
  return start>=0&&end>start?text.slice(start+2,end):text;
}
