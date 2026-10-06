// Arcos dos personagens especiais: uma conversa no primeiro atendimento e três capítulos,
// liberados pela amizade (20, 45 e 75). Os capítulos acontecem depois do expediente: o
// personagem entra na bodega e conversa com o Sadi. O último capítulo traz uma recompensa.
// Falas: ['x', texto] é o próprio personagem do arco; 'sadi' é o jogador; outro id é outra pessoa.
'use strict';

const ARC_AT = [20, 45, 75];
const ARCS = {
  manolima: {
    title: 'A milonga da bodega',
    meet: [['x', 'Bodega nova no galpão do velho Sadi? Conheci teu vô, guri: bom de causo e ruim de truco.'], ['sadi', 'O senhor conheceu o vô?'], ['x', 'Tropeamos juntos, vivente. Depois eu te conto… com um trago na mão.']],
    chapters: [
      { title: 'Uma rima pra bodega', lines: [['x', 'Tô compondo uma milonga sobre esse galpão, mas empaquei: o que rima com bodega?'], ['sadi', 'Adega? Sossega? Chega?'], ['x', '“Quem prova o xis do Sadi, sempre chega”… Bah, vivente, tu tem veia de poeta!']] },
      { title: 'O primeiro verso', lines: [['x', 'Escuta o primeiro verso: “No galpão do velho Sadi, a gaita voltou a chorar…”'], ['sadi', 'Bah, Mano, me arrepiou.'], ['x', 'Falta o refrão. Refrão bom nasce de causo verdadeiro. Me conta um teu, que o resto eu invento.']] },
      { title: 'Milonga da Bodega do Sadi', lines: [['x', 'Tocou no rádio de São Borja hoje cedo: “Milonga da Bodega do Sadi”!'], ['sadi', 'Não acredito! Com o nome da bodega?'], ['x', 'E com o nome do teu vô no último verso. Ele ia gostar. Agora a fronteira inteira sabe onde fica o melhor xis.']], reward: { rep: 5, xp: 120, text: 'A milonga tocou no rádio: +5 de reputação.' } }
    ]
  },
  lauro: {
    title: 'Lauro na câmera',
    meet: [['x', 'Opa! Tem cancha de bocha aqui? O Gustavo vai querer filmar, ja.'], ['sadi', 'Tem sim, ali pela porta da direita.'], ['x', 'Só não me deixa encostar em nada, que eu tenho fama de quebrar as coisas.']],
    chapters: [
      { title: 'Nervoso na frente da câmera', lines: [['x', 'O Gustavo quer gravar um vídeo meu jogando bocha na tua cancha.'], ['x', 'Mas é só ligar a câmera que eu esqueço até como segura a bocha, rapaz.'], ['sadi', 'Finge que é só nós dois jogando, Lauro. Esquece o celular.']] },
      { title: 'Não me quebra, Lauro!', lines: [['x', 'Gravamos! Ficou bom… até eu sentar no banquinho da cancha.'], ['sadi', 'E o banquinho?'], ['x', 'Virou lenha pro teu costelão. O Gustavo gritou “não me quebra, Lauro!” e deixou no vídeo, ja.']] },
      { title: 'Nasce o Lauro Boleador', lines: [['x', 'O vídeo passou de cem mil visualizações! O povo me chama de Lauro Boleador agora.'], ['sadi', 'E a cancha da bodega aparecendo no vídeo inteiro!'], ['x', 'Vem gente de Indaial só pra jogar aqui. Pela primeira vez o Gustavo disse que eu tô certo.']], reward: { rep: 4, xp: 100, bocha: 10, text: 'A cancha ficou famosa: +4 de reputação e +10 na fama de bocha.' } }
    ]
  },
  indavirus: {
    title: 'Reportagem do Indavírus',
    meet: [['x', 'Gustavo Pórco, do Jornal Indavírus! Bodega nova em galpão antigo é notícia, ja.'], ['sadi', 'Notícia? Aqui só tem xis e prosa.'], ['x', 'Xis e prosa é a melhor notícia que tem! Volto com a câmera.']],
    chapters: [
      { title: 'A entrevista', lines: [['x', 'Primeira pergunta pro Jornal Indavírus: qual a lenda desse galpão?'], ['sadi', 'Lenda? Foi pouso de tropeiro, depois CTG…'], ['x', 'Tropeiro! Ótimo. Cada galpão tem um causo que o vô jura que é verdade. Eu só filmo e confio.']] },
      { title: 'O fantasma do tropeiro', lines: [['x', 'Saiu a reportagem: “O fantasma do tropeiro que pede xis às três da manhã”!'], ['sadi', 'Gustavo, isso não existe!'], ['x', 'Ainda não. Mas já tem gente vindo de longe pra ver se ele aparece. Notícia boa se espalha, ja.']] },
      { title: 'Bodega no mapa', lines: [['x', 'A reportagem bateu recorde no canal. O povo do Vale agora sabe chegar na tua bodega.'], ['sadi', 'E o fantasma?'], ['x', 'Aposentou. Mas os turistas continuam vindo, e pedindo xis. Às três da manhã não, que tu fecha antes.']], reward: { rep: 5, xp: 100, text: 'A reportagem trouxe turistas: +5 de reputação.' } }
    ]
  },
  badin: {
    title: 'A mãe do Badin',
    meet: [['x', 'Badin, o colono, de Erechim! A mãe mandou perguntar se aqui tem comida de verdade.'], ['sadi', 'Tem xis, codorna, salame…'], ['x', 'Vou dizer que tem. Se ela achar que não, ela vem conferir pessoalmente.']],
    chapters: [
      { title: 'Ligação de Erechim', lines: [['x', 'A mãe ligou. Pra ti. Perguntou se eu tô comendo direito.'], ['sadi', 'Pra mim? Como ela conseguiu o número da bodega?'], ['x', 'Mãe de colono tem rede de contatos maior que a do governo. Diz que eu comi dois xis, por favor.']] },
      { title: 'A receita da nona', lines: [['x', 'Te trouxe a receita do salame da nona. Não conta pra ninguém, que é segredo de família.'], ['sadi', 'Bah, Badin, que honra!'], ['x', 'Honra nada: é pra eu ter onde comer salame bom longe de casa. Colono pensa no futuro.']] },
      { title: 'Almoço de domingo', lines: [['x', 'A família quer fazer o almoço de domingo aqui. Vem a mãe, as tias, os primos…'], ['sadi', 'Quantas pessoas, Badin?'], ['x', 'Começa com dez e termina com trinta, sempre chega mais um primo. E a mãe disse: “Agora sim, comida de verdade!”']], reward: { rep: 4, xp: 100, stock: { salame: 6 }, text: 'A família do Badin aprovou: +4 de reputação e 6 salames da colônia.' } }
    ]
  },
  guri: {
    title: 'Paródia do xis',
    meet: [['x', 'Mas bah, tchê! Vim de Uruguaiana ver se o xis daqui é tão taura quanto falam.'], ['sadi', 'E aí, passou no teste?'], ['x', 'Passou! Agora tenho que achar uma rima pra isso, que gaudério da fronteira tudo vira música.']],
    chapters: [
      { title: 'A paródia nova', lines: [['x', 'Fiz uma paródia sobre o teu xis, tchê! Peguei o sucesso do momento e botei bombacha nele.'], ['sadi', 'Canta um pedaço!'], ['x', '“O xis do Sadi é o amor da minha vida…” Calma, que o refrão ainda tá cru.']] },
      { title: 'O refrão que faltava', lines: [['x', 'Empaquei no refrão. Gaudério da fronteira não pode lançar música pela metade.'], ['sadi', 'E se o refrão for sobre a bodega cheia, com mate e truco?'], ['x', 'Bah, isso! “Na bodega do Sadi tem mate, truco e xis…” Agora sim tem cara de sucesso!']] },
      { title: '“Xis do Sadi”', lines: [['x', 'Gravei! “Xis do Sadi”, paródia oficial. Tocou em tudo que é rádio da fronteira.'], ['sadi', 'Não acredito, Guri!'], ['x', 'Agora vem gente de Uruguaiana provar o tal xis da música. Bah, prepara a chapa!']], reward: { rep: 4, xp: 100, text: 'A paródia fez sucesso na fronteira: +4 de reputação.' } }
    ]
  },
  marciomarcelo: {
    title: 'A carnage na casona',
    members: ['marcio', 'marcelo'],
    meet: [['marcio', 'É o quê? Bodega podre de chique! Show de bola.'], ['marcelo', 'Podre de chique mesmo, Márcio. Tem raineken, é oq?'], ['sadi', 'Tem cerveja bem gelada, sim!'], ['marcio', 'É o quê? Show de bola!']],
    chapters: [
      { title: 'Encomenda de raineken', lines: [['marcio', 'É o quê? Vai ter carnage na casona e a gente quer encomendar raineken.'], ['marcelo', 'Umas par de caixa, é oq? Tamo com os pila.'], ['sadi', 'Pode deixar que eu separo!']] },
      { title: 'O portonzon', lines: [['marcelo', 'O Márcio disse pro vizinho que o portonzon tá à venda!'], ['marcio', 'É mentirada! Eu só disse que era bonito!'], ['sadi', 'Calma, gente, o portão continua de vocês. Bora uma cerveja pra fazer as pazes?'], ['marcelo', 'É o quê? Show de bola.']] },
      { title: 'Convite pra casona', lines: [['marcio', 'É o quê? A carnage foi um sucesso por causa das tuas raineken!'], ['marcelo', 'Trouxemos um presente da bauzona. Podre de chique, é oq?'], ['sadi', 'Bah, obrigado, gurizada!'], ['marcio', 'É o quê? Show de bola!']], reward: { rep: 3, xp: 90, stock: { cerveja: 12 }, text: 'Presente da bauzona: +3 de reputação e 12 cervejas.' } }
    ]
  },
  peixinhonabrasa: {
    title: 'Duelo de brasa',
    meet: [['x', 'Peixinho na brasa, Kaiser na mão, morra de inveja, vagabundo!'], ['sadi', 'Seja bem-vindo à bodega!'], ['x', 'Bem-vindo eu, que o lugar tá bom. Mas o fogo de chão de vocês… vamos ver, ja.']],
    chapters: [
      { title: 'O desafio', lines: [['x', 'Me contaram que teu costelão é bom. Mas o meu peixe na brasa é melhor!'], ['sadi', 'Isso é um desafio?'], ['x', 'É um aviso, seus pela-saco! Um dia eu trago o peixe e a gente vê quem manda no fogo.']] },
      { title: 'O segredo da brasa', lines: [['x', 'Tá, vou te contar o segredo, mas não espalha: brasa forte, sal grosso e paciência.'], ['sadi', 'Só isso?'], ['x', 'E ninguém mexendo no meu fogo! Se mexer, eu fico brabo e a Kaiser esquenta.']] },
      { title: 'Empate no fogo de chão', lines: [['x', 'Provei teu costelão. Tá bom. Tá muito bom. Tá… empatado com o meu peixe.'], ['sadi', 'Empate tá ótimo pra mim!'], ['x', 'Morra de inveja… eu mesmo, vagabundo. Agora vou trazer a turma de Vera Cruz pra comer aqui.']], reward: { rep: 4, xp: 100, text: 'O Peixinho trouxe a turma de Vera Cruz: +4 de reputação.' } }
    ]
  }
};

function arcIdOf(person) { const id = PEOPLE[person]?.id; return ['marcio', 'marcelo'].includes(id) ? 'marciomarcelo' : ARCS[id] ? id : null; }
function arcState(arc) { G.arcs ??= {}; return G.arcs[arc] ??= { met: false, done: [] }; }
function arcMembers(arc) { return (ARCS[arc].members || [arc]).map(id => PEOPLE.findIndex(p => p.id === id)).filter(i => i >= 0); }
function arcFriendship(arc) { return Math.max(...arcMembers(arc).map(i => G.friends[i] || 0)); }
function arcLines(arc, lines) { return lines.map(([who, text]) => ({ say: who === 'x' ? arcMembers(arc)[0] !== undefined ? PEOPLE[arcMembers(arc)[0]].id : who : who, text })); }

// Primeiro atendimento: uma conversa curta, ali mesmo no balcão ou na mesa.
function arcMeet(person) {
  const arc = arcIdOf(person); if (!arc || PEOPLE[person].id === G.avatarId) return false;
  const st = arcState(arc); if (st.met) return false; st.met = G.day;
  if (!scenesEnabled() || G.lasso || G.bocce) return false;
  playSteps([{ view: 'bodega' }, { fade: 'in', time: .2 }, ...arcLines(arc, ARCS[arc].meet)], 'arcMeet');
  return true;
}
// Capítulos liberados pela amizade ficam na fila para o fim do expediente.
function arcCheck() {
  G.arcQueue ??= [];
  for (const arc of Object.keys(ARCS)) {
    const st = arcState(arc); if (!st.met) continue;
    const f = arcFriendship(arc);
    ARC_AT.forEach((at, i) => { if (f >= at && !st.done[i] && !G.arcQueue.some(q => q.arc === arc && q.i === i) && (i === 0 || st.done[i - 1] || G.arcQueue.some(q => q.arc === arc && q.i === i - 1))) G.arcQueue.push({ arc, i }); });
  }
}
function arcReward(arc, i) {
  const r = ARCS[arc].chapters[i].reward; if (!r) return;
  if (r.rep) G.rep = clamp(G.rep + r.rep, 0, 100);
  if (r.xp) gainXP(r.xp);
  if (r.bocha) { const s = sportState().bocha; s.reputation = clamp(s.reputation + r.bocha, 0, 100); }
  for (const [k, n] of Object.entries(r.stock || {})) if (GOODS[k]) G.stock[k] = (G.stock[k] || 0) + n;
  showBanner(ARCS[arc].title + ' · fim', r.text, 'gift');
}
// Depois do expediente: quem tem capítulo novo entra pela porta e conversa.
function playNextArc(after) {
  const q = G.arcQueue?.shift(); if (!q) return false;
  const st = arcState(q.arc), ch = ARCS[q.arc].chapters[q.i], members = arcMembers(q.arc).map(i => PEOPLE[i].id);
  const finish = () => { st.done[q.i] = G.day; arcReward(q.arc, q.i); save(); after?.(); };
  if (!scenesEnabled()) { finish(); return true; }
  const spot = n => ({ x: clamp(G.player.x + 90 + n * 70, 120, W - 120), y: clamp(G.player.y + n * 20, 470, 840) });
  playSteps([
    { caption: ARCS[q.arc].title + ' · ' + (q.i + 1) + '/3 · ' + ch.title, time: 1.8 },
    { view: 'bodega' }, ...members.map((id, n) => ({ actor: id, x: ENTRY.x + n * 40, y: ENTRY.y, dx: -1 })), { fade: 'in', time: .4 },
    { do: () => AudioEngine.doorChime() }, { walk: members, to: members.map((_, n) => spot(n)) },
    ...arcLines(q.arc, ch.lines),
    { walk: members, to: members.map((_, n) => ({ x: ENTRY.x + n * 40, y: ENTRY.y })) }
  ], 'arc', finish);
  return true;
}
// Texto curto para a aba Contatos.
function arcProgressText(person) {
  const arc = arcIdOf(person); if (!arc || !arcState(arc).met) return '';
  const n = arcState(arc).done.filter(Boolean).length;
  return `<small class="arc-progress">📖 ${ARCS[arc].title}: ${n}/3${n < 3 ? ' · próximo com afeto ' + ARC_AT[n] : ' · completa'}</small>`;
}
