// Falas do mundo aberto: encontros na estrada, fora da bodega (as falas de balcão ficam em dialogues.js).
// Cada personagem pode prosear até 3 vezes por dia; cada prosa aumenta a amizade.
'use strict';

const WORLD_TALK = {
  valter: [
    { player: 'Bom dia, Valter! Saindo cedo?', reply: 'Fui ver a cerca do fundo, guri. Teu pai e eu fizemos ela com as próprias mãos, faz trinta anos.' },
    { player: 'E aí, vizinho, como tá o potreiro?', reply: 'Verde que dá gosto. Se faltar boi pro costelão, me avisa que eu te arrumo.' },
    { player: 'Vai passar na bodega hoje?', reply: 'Mais tarde. Quero ver se tu aprendeu a fazer o xis igual tua mãe fazia.' },
    { player: 'Que calor, hein, Valter?', reply: 'Calor é desculpa pra tomar tererê, que é coisa de paraguaio. Eu tomo chimarrão quente mesmo.' },
    { player: 'Tá com cara de quem tem causo pra contar.', reply: 'Teu vô uma vez atravessou o rio a cavalo pra buscar uma gaita. Voltou molhado e sem gaita.' }
  ],
  manolima: [
    { player: 'Buenas, Mano Lima!', reply: 'Buenas, vivente! Tô indo atrás de um parceiro pro truco de logo mais.' },
    { player: 'Treinando o truco na estrada?', reply: 'Truco não se treina, se sente. Igual o vento minuano: chega sem avisar.' },
    { player: 'E a gaita, Mano?', reply: 'Afinadinha. Se a bodega encher hoje, eu puxo uma vanera.' },
    { player: 'Vai chover, será?', reply: 'Quero-quero gritando de tarde é chuva na certa. Recolhe a roupa do varal.' },
    { player: 'Tá bonito o dia, hein?', reply: 'Dia bonito é dia de mate na sombra e prosa sem pressa. O resto é invenção da cidade.' }
  ],
  baitaca: [
    { player: 'Opa, Baitaca! Indo pra onde?', reply: 'Lá pras bandas das Missões, vivente. Tem baile no fim de semana e eu sou o cantor.' },
    { player: 'Canta um pedacinho aí!', reply: 'De graça não, que a voz é ferramenta de trabalho. Mas na bodega, com uma canha, quem sabe.' },
    { player: 'Bonita a tua bombacha.', reply: 'Foi a patroa que fez. Bombacha boa é a que aguenta tombo de cavalo e baile até de manhã.' },
    { player: 'Como tá a vida, Baitaca?', reply: 'Simples que nem rancho de barro: pouca coisa, mas tudo no lugar.' },
    { player: 'Viu o rio hoje?', reply: 'O Uruguai tá cheio. Esse rio já viu tropa, balsa e muito contrabandista passar.' }
  ],
  guri: [
    { player: 'E aí, Guri! Vindo da fronteira?', reply: 'Atravessei a ponte pra comprar erva do lado de lá. Castelhano vende mais barato, tchê!' },
    { player: 'Tudo certo lá em Uruguaiana?', reply: 'Tudo certo e tudo quente. Lá o sol frita ovo na calçada e ninguém reclama.' },
    { player: 'Qual a novidade, Guri?', reply: 'A novidade é que não tem novidade. Na fronteira o tempo anda devagar, que nem cusco velho.' },
    { player: 'Vai na bodega hoje?', reply: 'Vou sim. Guarda um xis caprichado que eu chego com fome de fronteira.' },
    { player: 'Bonito o cavalo ali, é teu?', reply: 'É do compadre. Eu só monto em cavalo que não tem pressa.' }
  ],
  badin: [
    { player: 'Bom dia, Badin!', reply: 'Bon giorno, Sadi! Tô vindo da roça. A uva esse ano tá doce que nem a nona.' },
    { player: 'Como tá a vindima?', reply: 'Trabalhosa! Mas a mãe diz que quem colhe uva com pressa faz vinho azedo.' },
    { player: 'O que tem pro almoço?', reply: 'Polenta, galeto e radicci. Na colônia, domingo sem galeto é pecado.' },
    { player: 'Vai pra Erechim hoje?', reply: 'Amanhã. Vou levar salame pro primo, mas metade some no caminho. Fome de viagem.' },
    { player: 'Bonita a casa de pedra.', reply: 'O nono que fez, pedra por pedra. Aguenta inverno, vento e as brigas da família.' }
  ],
  marcio: [
    { player: 'Fala, Márcio! E o Marcelo?', reply: 'Tá lá no campinho treinando falta. Ele acha que é titular da seleção.' },
    { player: 'Vai ter racha no domingo?', reply: 'Vai sim! Solteiros contra casados. Os casados sempre perdem, mas comem melhor depois.' },
    { player: 'Show de bola o campinho!', reply: 'Show de bola mesmo! A gente mesmo pintou as linhas. Tá meio torto, mas tem charme.' },
    { player: 'Bonita a Casona.', reply: 'Embaixo não tem nada, é só pilar. Em cima é nós dois e a bagunça dos dois.' }
  ],
  marcelo: [
    { player: 'Oi, Marcelo! Treinando?', reply: 'Treinando falta! Uma hora a bola entra no ângulo, nem que seja de raspão.' },
    { player: 'Cadê o Márcio?', reply: 'Deve tá dormindo na Casona. Gêmeo é igual, mas a preguiça é só dele.' },
    { player: 'Vai na bodega hoje?', reply: 'Vou! Me vê um refri gelado que futebol dá sede.' },
    { player: 'Quem é o melhor jogador, tu ou o Márcio?', reply: 'Eu, claro. Ele diz que é ele. Por isso a gente joga em times separados.' }
  ],
  gaudencio: [
    { player: 'Buenas, Gaudêncio!', reply: 'Buenas. Tô voltando do campo. Gado não espera ninguém acordar tarde.' },
    { player: 'Que pressa é essa?', reply: 'Pressa nenhuma. Gaúcho anda no passo do cavalo, nem mais rápido nem mais devagar.' },
    { player: 'Como tá a lida?', reply: 'Pesada, mas honesta. Mate cedo, campo o dia inteiro e um trago de noite.' },
    { player: 'Tá frio, hein?', reply: 'Frio é quando o minuano entra por baixo do poncho. Isso aí é só fresquinho.' },
    { player: 'Bonito o teu chapéu.', reply: 'É do tempo do meu pai. Chapéu bom não se compra, se herda.' }
  ],
  mitodosul: [
    { player: 'E aí, Mito! Gravando hoje?', reply: 'Live às oito! Hoje é colheita de soja no Farming Simulator. Passa lá no chat!' },
    { player: 'Viu o jogo do Grêmio?', reply: 'Vi e sofri! Mas gremista sofre e volta, que nem trator velho que pega no tranco.' },
    { player: 'Tu sabe dirigir trator de verdade?', reply: 'No jogo eu sou o maior fazendeiro do Sul. Na vida real, prefiro o controle.' },
    { player: 'Vai na bodega?', reply: 'Só se tiver xis salada! E nada de trago, que eu gravo de cabeça boa.' }
  ],
  dianho: [
    { player: 'Dianho! Que cara séria é essa?', reply: 'Cara de gângster de galpão, vivente. Mas fica tranquilo, hoje eu tô de folga.' },
    { player: 'Indo pra Santa Cruz?', reply: 'Lá é minha terra. Fumo, cuca e Oktoberfest. Mas de chope eu fico longe.' },
    { player: 'Tá precisando de alguma coisa?', reply: 'Um refri gelado e respeito na vizinhança. O resto eu me viro.' },
    { player: 'Como tá a vida?', reply: 'Tranquila. Galpão varrido, cavalo escovado e ninguém me devendo.' }
  ],
  lauro: [
    { player: 'Lauro Boleador! Treinando a mira?', reply: 'Todo dia, Sadi! Bocha é que nem pescaria: quem tem paciência leva.' },
    { player: 'Bonita tua canchinha.', reply: 'Pequena, mas honesta. Aqui eu treino antes de ir arrasar na tua cancha.' },
    { player: 'E o Indavírus, como tá?', reply: 'Escrevendo o jornal dele. Diz que vai me pôr na capa como maior boleador de Indaial.' },
    { player: 'Me ensina mais uma dica de bocha?', reply: 'Olha o bolim, não a bocha. A bocha vai sozinha se o olho estiver certo.' }
  ],
  indavirus: [
    { player: 'E aí, Indavírus! Novidade no jornal?', reply: 'Manchete de hoje: “Bodegueiro do Sul faz o melhor xis da região”. Exclusiva!' },
    { player: 'Tá escrevendo sobre o quê?', reply: 'Sobre a rivalidade entre a bocha do Rio Grande e o bolão de Santa Catarina. Polêmica!' },
    { player: 'O Lauro tá por aí?', reply: 'Tá na canchinha dele, mirando até em latinha. Esse aí não descansa.' },
    { player: 'Me dá uma notícia boa.', reply: 'A cuca da Festa Pomerana saiu do forno agora. Notícia quente!' }
  ],
  peixinhonabrasa: [
    { player: 'Peixinho! Tá assando o quê hoje?', reply: 'Um traíra na brasa, tchê! E uma Kaiser gelada pra acompanhar.' },
    { player: 'Qual o segredo do peixe?', reply: 'Brasa baixa, sal grosso e paciência. Peixe com pressa queima por fora e fica cru por dentro.' },
    { player: 'Saudade de Vera Cruz?', reply: 'Um pouco. Mas peixe na brasa é igual em qualquer lugar onde tenha amigo.' },
    { player: 'Vai passar na bodega?', reply: 'Vou! Me guarda um amendoim que eu levo a história de pescaria.' }
  ],
  loligebien: [
    { player: 'Guten Tag, Loli!', reply: 'Guten Tag! Tô indo pra Festa Pomerana. De tamanco e com sede de chope!' },
    { player: 'Bonito o enxaimel da tua casa.', reply: 'Foi o bisavô que montou, viga por viga. Aqui em Pomerode a gente cuida do que é velho.' },
    { player: 'Já foi na Osterbaum?', reply: 'Todo ano! Pintamos as casquinhas de ovo em família. Dá um trabalho, mas fica lindo.' },
    { player: 'Vai na bodega lá no Sul?', reply: 'Se tiver chope bem tirado, eu atravesso o estado de tamanco!' }
  ],
  jayme: [
    { player: 'Buenas, seu Jayme!', reply: 'Buenas, moço. Ando juntando versos pela estrada, que pajador não para.' },
    { player: 'Faz um verso pra mim?', reply: '“Bodega de chão batido, de mate e de prosa boa: quem entra por um sorriso, sai levando uma copla à toa.”' },
    { player: 'De onde vem tanta poesia?', reply: 'Da Bossoroca, do campo e do silêncio. O pampa ensina quem sabe escutar.' },
    { player: 'O que o senhor acha da vida?', reply: 'A vida é uma tropeada: o importante não é chegar ligeiro, é chegar com a tropa inteira.' }
  ]
};
// Depois das três prosas do dia, o personagem segue o caminho.
const WORLD_TALK_TIRED = ['Já proseamos bastante hoje, vivente. Amanhã tem mais!', 'Agora tenho que seguir caminho. Passa na bodega que a gente continua.', 'Bah, a prosa tá boa, mas o dia não espera. Até amanhã!'];
