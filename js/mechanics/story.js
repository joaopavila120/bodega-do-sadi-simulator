// Capítulos da história da bodega: cada nível novo traz uma cena curta no fim do expediente,
// até o final na Bodega lendária, com a foto do vô na parede.
'use strict';

const LEVEL_STORY = {
  2: {
    title: 'A notícia corre',
    steps: () => [
      ...sceneVisitor('valter'),
      { say: 'valter', text: 'Guri, lá na cidade só se fala da tua bodega! Até a mulher da farmácia perguntou do xis.' },
      { say: 'sadi', text: 'Sério, Valter? Começou a vir gente de longe mesmo.' },
      { say: 'valter', text: 'Teu pai ia dizer: “galpão aceso chama gente que nem lampião chama mariposa”.' },
      ...sceneVisitorLeaves('valter')
    ]
  },
  3: {
    title: 'O caderno do vô',
    steps: () => [
      { view: 'bodega' }, { fade: 'in', time: .5 },
      { say: 'sadi', text: 'Arrumando a prateleira, achei um caderno velho do vô, embrulhado num pano.' },
      { overlay: 'note', text: 'Armazém do Seu Sadi · fiado<br>Seu Tonico: 2 kg de erva<br>Dona Zulma: querosene e fumo<br>O Valter: 1 canha (paga quando der)' },
      { say: 'sadi', text: 'O vô também vendia fiado! E o Valter devia uma canha desde aquele tempo… vou cobrar, hehe.' }
    ]
  },
  4: {
    title: 'Baile no galpão',
    steps: () => [
      ...sceneVisitor('manolima'),
      { say: 'manolima', text: 'Vivente, a gauchada quer fazer um baile no galpão, como nos tempos do CTG.' },
      { say: 'sadi', text: 'Aqui na bodega? Seria uma honra, Mano!' },
      { say: 'manolima', text: 'Então tá combinado. Galpão que já foi CTG nunca esquece o som de uma gaita.' },
      ...sceneVisitorLeaves('manolima')
    ]
  },
  5: {
    title: 'Bodega afamada',
    steps: () => [
      ...sceneVisitor('badin'),
      { say: 'badin', text: 'Ô, Sadi! Lá em Erechim a mãe disse que tua bodega é a melhor do interior. E a mãe não elogia nem o padre!' },
      { say: 'sadi', text: 'Bah, Badin, agradece ela por mim.' },
      { say: 'badin', text: 'Agradeço, mas ela mandou avisar: no domingo vem a família inteira. Prepara trinta xis.' },
      ...sceneVisitorLeaves('badin')
    ]
  },
  6: {
    title: 'Referência no interior',
    steps: () => [
      { view: 'black' }, { fade: 'in', time: .2 },
      { overlay: 'news', headline: 'Bodega do galpão vira referência no interior', body: 'O velho galpão das tropeadas, que já foi CTG, voltou a ser ponto de encontro. Fregueses vêm de longe pelo xis, pelo truco e pela prosa. “Foi o que meu vô sonhou”, diz o bodegueiro.' },
      { view: 'bodega' }, { fade: 'in', time: .5 },
      { say: 'sadi', text: 'Primeira página de novo! Se o vô visse isso…' }
    ]
  },
  7: {
    title: 'Bodega lendária',
    steps: () => [
      { view: 'bodega' }, { fade: 'in', time: .6 },
      ...['valter', 'manolima', 'lauro', 'indavirus'].map((id, n) => ({ actor: id, x: ENTRY.x - n * 50, y: ENTRY.y, dx: -1 })),
      { do: () => AudioEngine.doorChime() },
      { walk: ['valter', 'manolima', 'lauro', 'indavirus'], to: [0, 1, 2, 3].map(n => ({ x: clamp(G.player.x + 80 + n * 70, 120, W - 120), y: clamp(G.player.y + (n % 2) * 30, 470, 840) })) },
      { say: 'valter', text: 'Guri, olha esse galpão: cheio de gente, de prosa e de cheiro de xis.' },
      { say: 'manolima', text: 'Bodega lendária, vivente. Já tem até milonga com o teu nome.' },
      { say: 'sadi', text: 'Vocês fizeram isso comigo. Pera aí, deixa eu pendurar uma coisa.' },
      { overlay: 'photo' },
      { say: 'sadi', text: 'Tá cheio de novo, vô. Do jeito que o senhor pediu.' },
      { caption: 'Fim… ou só o começo de muitos causos.', time: 2.6 }
    ]
  }
};

function sceneVisitor(id) {
  return [{ view: 'bodega' }, { actor: id, x: ENTRY.x, y: ENTRY.y, dx: -1 }, { fade: 'in', time: .4 }, { do: () => AudioEngine.doorChime() }, { walk: id, to: { x: clamp(G.player.x + 90, 120, W - 120), y: clamp(G.player.y, 470, 840) } }];
}
function sceneVisitorLeaves(id) { return [{ walk: id, to: { x: ENTRY.x, y: ENTRY.y } }]; }

// Próximo capítulo ainda não visto, um por fim de dia.
function nextLevelStory() { const seen = G.levelStory || 1; return seen < bodegaLevel() ? seen + 1 : null; }
function playLevelStory(after) {
  const level = nextLevelStory(); if (!level) return false;
  const ch = LEVEL_STORY[level], finish = () => { G.levelStory = level; save(); after?.(); };
  if (!ch || !scenesEnabled()) { finish(); return true; }
  playSteps([{ caption: 'Capítulo ' + (level - 1) + ' · ' + ch.title, time: 1.8 }, ...ch.steps()], 'levelStory', finish);
  return true;
}
