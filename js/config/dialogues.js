// Falas padrão de reserva; para personalizar, edite dialogos.txt e recarregue o jogo.
'use strict';
const DEFAULT_DIALOGUES={
  "badin": [
    {
      "player": "Como anda a colônia?",
      "reply": "CUDIO! Plantei alface e nasceu visita querendo salame. A terra é generosa demais!"
    },
    {
      "player": "Vai um xis caprichado?",
      "reply": "DIO MADONA! Se vier desse tamanho, vou ter que chamar os primos pra ajudar."
    },
    {
      "player": "E a safra, Badin?",
      "reply": "CUDIO, a uva ficou uma beleza. O problema é o nono contando os cachos todo dia."
    },
    {
      "player": "Hoje tem salame da colônia.",
      "reply": "Dio madona, agora sim! Corta fino que daí eu posso dizer que comi só umas fatias."
    },
    {
      "player": "Tá com pressa?",
      "reply": "Na colônia só se corre atrás de galinha. E geralmente é a galinha que ganha."
    },
    {
      "player": "O que tu trouxe da roça?",
      "reply": "Uma sacola de bergamota e três conselho do nono. A sacola pesava menos."
    },
    {
      "player": "Gostou do atendimento?",
      "reply": "CUDIO, ligeiro assim nem a nona quando percebe que esqueceram o pão no forno!"
    },
    {
      "player": "Mais um café?",
      "reply": "DIO MADONA, bota! Café fraco é água que ouviu falar de café."
    },
    {
      "player": "E o domingo na família?",
      "reply": "Era pra ser almoço de quatro. A nona fez comida pra quarenta, por garantia."
    },
    {
      "player": "Tem causo novo?",
      "reply": "Fui economizar na cerca. As galinha fizeram turismo e agora conhecem a colônia inteira."
    },
    {
      "player": "Como tá o tempo lá fora?",
      "reply": "CUDIO! Saí de casa com sol, peguei chuva e cheguei com vontade de polenta."
    },
    {
      "player": "Vai levar erva?",
      "reply": "Me pesa bem certinho. O nono desconfia até da balança da farmácia."
    }
  ],
  "guri": [
  {"player": "E aí, Guri?", "reply": "Mas bah, tchê! Vim de Uruguaiana, da fronteira, só pra ver se o xis daqui é tão taura quanto falam."},
  {"player": "Como tá a fronteira?", "reply": "Tranquila! Atravessei a ponte pra Paso de los Libres, comprei uma erva e voltei. Só se fala de outra coisa!"},
  {"player": "Cadê o Licurgo?", "reply": "O Licurgo ficou em casa ouvindo música triste. É o único gaúcho emo do Rio Grande, tchê. Mas que falta de opção!"},
  {"player": "E a Silvia Helena?", "reply": "A patroa mandou eu voltar cedo. Eu disse que vinha só tomar um mate… ela já sabe que mate meu dura a tarde inteira."},
  {"player": "Vai um xis?", "reply": "Capricha, que gaudério da fronteira não come pouco. Bota tudo que tiver, que se faltar eu reclamo cantando!"},
  {"player": "Que música tu tá cantando?", "reply": "Uma paródia nova, tchê! Pego o sucesso do momento e boto bombacha nele. Até o Canto Alegretense entra no meio."},
  {"player": "Como foi o show?", "reply": "Theatro São Pedro lotado em Porto Alegre! Gaúcho rindo de gaúcho, que é o melhor tipo de riso que tem."},
  {"player": "Tu usa WhatsApp?", "reply": "Uso, mas no meu ritmo. Mando áudio de sete minutos e começo com bom dia, que educação vem antes da tecnologia."},
  {"player": "Mais um mate?", "reply": "Mas bah, sempre! Cuia bem cevada, água no ponto e conversa sem pressa. O resto é modernagem."},
  {"player": "Vai jogar truco?", "reply": "Truco com gaudério da fronteira é perigoso, tchê. Eu já peço o truco olhando pro horizonte, que é pra não entregar a carta."},
  {"player": "Tá pilchado hoje?", "reply": "Sempre! Boina, bigode e lenço no pescoço. Se tirar a boina, ninguém me reconhece. Nem a Silvia Helena."},
  {"player": "Qual a novidade?", "reply": "A novidade é que não tem novidade! Mas que falta de opção, tchê. Por isso vim pra bodega: aqui sempre tem causo."}
 ],
  "marcio": [
    {
      "player": "E o pedido, Márcio?",
      "reply": "É o quê? Show de bola! Manda um salame pra começar a conversa."
    },
    {
      "player": "O Marcelo vem junto?",
      "reply": "É o quê? Show de bola, vem sim! Só parou pra conversar com outro que também tava atrasado."
    },
    {
      "player": "Gostou do xis?",
      "reply": "É o quê? Show de bola! Esse merece replay antes da segunda mordida."
    },
    {
      "player": "Hoje veio sozinho?",
      "reply": "É o quê? Show de bola! Até sozinho eu guardo assunto pro Marcelo."
    },
    {
      "player": "Vai querer mais uma?",
      "reply": "É o quê? Show de bola! Mas primeiro deixa eu terminar de elogiar a anterior."
    },
    {
      "player": "Tudo certo por aí?",
      "reply": "É o quê? Show de bola! Se melhorar, vou ter que dividir com os amigos."
    },
    {
      "player": "Tem novidade?",
      "reply": "É o quê? Show de bola! Aprendi a chegar cedo, só ainda não botei em prática."
    },
    {
      "player": "E a partida?",
      "reply": "É o quê? Show de bola! Eu entendo mais do petisco do intervalo."
    }
  ],
  "marcelo": [
    {
      "player": "Bem-vindo, Marcelo!",
      "reply": "É o quê? Show de bola! Já pode separar uma cadeira e um causo."
    },
    {
      "player": "Márcio já pediu?",
      "reply": "É o quê? Show de bola! Se ele escolheu, eu elogio. Se faltar comida, eu complemento."
    },
    {
      "player": "O que achou da casa?",
      "reply": "É o quê? Show de bola! Aqui até o relógio devia parar pra prosear."
    },
    {
      "player": "Vai um refrigerante?",
      "reply": "É o quê? Show de bola! Gelado no ponto de arrepiar o bigode de quem tem."
    },
    {
      "player": "Hoje tá quieto?",
      "reply": "É o quê? Show de bola! Tô só juntando assunto pra próxima rodada."
    },
    {
      "player": "Vai de truco?",
      "reply": "É o quê? Show de bola! Minha estratégia é sorrir e torcer pela carta."
    },
    {
      "player": "Chegou sem o Márcio?",
      "reply": "É o quê? Show de bola! Hoje o causo é individual, mas amanhã a dupla volta."
    },
    {
      "player": "Mais salame?",
      "reply": "É o quê? Show de bola! A conversa ainda tem uns três pratos pela frente."
    }
  ],
  "gremio": [
    {
      "player": "Vai começar o jogo!",
      "reply": "Hoje eu só levanto dessa cadeira pra comemorar ou buscar petisco. Dá-lhe, Grêmio!"
    },
    {
      "player": "Tá nervoso?",
      "reply": "Nada! Só mexi o café umas quarenta vezes sem ter colocado açúcar."
    },
    {
      "player": "Vai um xis?",
      "reply": "Capricha no lanche que o placar eu deixo pro Tricolor!"
    },
    {
      "player": "Que lance foi esse?",
      "reply": "Eu vi gol, o juiz viu impedimento e minha caneca quase viu o chão."
    },
    {
      "player": "Como tá a torcida?",
      "reply": "A voz já foi embora no aquecimento. O otimismo continua aqui."
    },
    {
      "player": "Mais uma rodada?",
      "reply": "No intervalo, sim! Durante o jogo eu não largo nem o braço da cadeira."
    },
    {
      "player": "E a prosa hoje?",
      "reply": "Pode falar de tudo. Só não fica na frente da televisão, chê!"
    },
    {
      "player": "Tá boa a TV?",
      "reply": "Uma beleza! Agora consigo discordar do juiz em detalhes."
    }
  ],
  "inter": [
    {
      "player": "Preparado pro jogo?",
      "reply": "Colorado pronto! Já pedi o petisco pra não perder nenhum lance."
    },
    {
      "player": "Tá confiante?",
      "reply": "Confiança eu trouxe de casa. A calma eu esqueci no portão."
    },
    {
      "player": "Vai um trago?",
      "reply": "Depois desse lance, vai uma água primeiro que eu gritei até secar a garganta!"
    },
    {
      "player": "O que achou do primeiro tempo?",
      "reply": "Meu coração correu mais que os pontas. Vamos, Inter!"
    },
    {
      "player": "Sai mais um petisco?",
      "reply": "Sai! Pra cada escanteio eu pego uma codorna. Hoje o prato tá sofrendo."
    },
    {
      "player": "Quem ganha hoje?",
      "reply": "O Inter, se depender de mim. Se depender do meu palpite, melhor não apostar."
    },
    {
      "player": "Como tá a imagem?",
      "reply": "Boa demais. Até a bola parece saber que a gente tá olhando."
    },
    {
      "player": "Tudo tranquilo na mesa?",
      "reply": "Tranquilo, chê. Posso discordar do gremista e dividir o salame. Só o último pedaço complica."
    }
  ]
};
