// Falas padrão de reserva; para personalizar, edite dialogos.txt e recarregue o jogo.
'use strict';
const DEFAULT_DIALOGUES={
  "badin": [
  {"player": "E aí, Badin?", "reply": "Ô, buenas! Badin, o colono, direto da colônia de Erechim. Vim de carroça de luxo: a caminhonete do cunhado."},
  {"player": "Como começou essa fama?", "reply": "Gravei um áudio falando das coisas de Erechim, mandei no grupo da família e foi parar na rádio. Quando vi, tava sete minutos no ar!"},
  {"player": "Tu não era engenheiro?", "reply": "Era, rapaz! Engenheiro mecânico. Hoje só conserto o humor da colonada. Dá menos graxa e mais risada."},
  {"player": "Como tá a mãe?", "reply": "A mãe tá boa! Ligou três vezes pra saber se eu comi. Na quarta ligação já perguntou se eu tô namorando."},
  {"player": "Vai um xis?", "reply": "Vai, mas capricha! Colono não pede pouco: se sobrar, leva pra casa num pote de margarina."},
  {"player": "E a família?", "reply": "Família de colono é grande! Almoço de domingo começa com dez pessoas e termina com trinta, porque sempre chega mais um primo."},
  {"player": "Tem salame da colônia?", "reply": "Se não tiver, eu trago! Salame da nona é patrimônio da família. Corta fininho que rende mais."},
  {"player": "Já foi pra cidade grande?", "reply": "Fui, até virou filme: um colono na cidade! Lá ninguém dá bom dia pro vizinho. Eu dei bom dia pra prédio inteiro."},
  {"player": "Que história é essa da enchente?", "reply": "Quando o Rio Grande precisou, a colonada se juntou. Teve gente do Brasil inteiro ajudando. Coração de colono é grande, rapaz."},
  {"player": "Vai levar erva?", "reply": "Me pesa bem certinho! A mãe confere na balança da cozinha e, se faltar um grama, eu volto aqui."},
  {"player": "Mais um café?", "reply": "Bota! Café de colono tem que ser passado na hora, com cuca do lado. Café sem cuca é visita sem prosa."},
  {"player": "Qual o segredo do teu humor?", "reply": "É só contar como é a vida na colônia, sem desfazer de ninguém. A colonada se reconhece e ri junto."}
 ],
  "guri": [
  {"player": "E aí, Guri?", "reply": "Mas bah, tchê! Vim de Uruguaiana, da fronteira, só pra ver se o xis daqui é tão taura quanto falam."},
  {"player": "Como tá a fronteira?", "reply": "Tranquila! Atravessei a ponte pra Paso de los Libres, comprei uma erva e voltei. Só se fala de outra coisa!"},
  {"player": "Como tá Uruguaiana?", "reply": "Quente que nem chapa de xis, tchê! Lá o sol nasce já de bombacha."},
  {"player": "Vai um mate?", "reply": "Vai! Mas mate meu dura a tarde inteira, tchê. Separa a térmica grande."},
  {"player": "Vai um xis?", "reply": "Capricha, que gaudério da fronteira não come pouco. Bota tudo que tiver, que se faltar eu reclamo cantando!"},
  {"player": "Que música tu tá cantando?", "reply": "Uma paródia nova, tchê! Pego o sucesso do momento e boto bombacha nele. Até o Canto Alegretense entra no meio."},
  {"player": "Como foi o show?", "reply": "Theatro São Pedro lotado em Porto Alegre! Gaúcho rindo de gaúcho, que é o melhor tipo de riso que tem."},
  {"player": "Tu usa WhatsApp?", "reply": "Uso, mas no meu ritmo. Mando áudio de sete minutos e começo com bom dia, que educação vem antes da tecnologia."},
  {"player": "Mais um mate?", "reply": "Mas bah, sempre! Cuia bem cevada, água no ponto e conversa sem pressa. O resto é modernagem."},
  {"player": "Vai jogar truco?", "reply": "Truco com gaudério da fronteira é perigoso, tchê. Eu já peço o truco olhando pro horizonte, que é pra não entregar a carta."},
  {"player": "Tá pilchado hoje?", "reply": "Sempre! Boina, bigode e lenço no pescoço. Se tirar a boina, ninguém me reconhece."},
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
