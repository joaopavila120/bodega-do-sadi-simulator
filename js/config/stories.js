// Causos, histórias e diálogos dos fregueses da bodega
'use strict';

const STORIES=[
 {title:'A hospitalidade e a erva-mate',affinity:12,source:'https://www.saudadesdaquerencia.org.br/wp-content/uploads/2022/05/Mitos-e-lendas-do-sul.pdf',text:'Conta uma lenda guarani que um pai e sua filha acolheram um viajante. Em agradecimento, receberam a erva-mate, que devolveu o ânimo ao velho. Por isso digo: cuia boa combina com porta aberta e gente bem recebida.'},
 {title:'A gralha e os pinheiros',affinity:12,source:'https://www.saudadesdaquerencia.org.br/wp-content/uploads/2022/05/Mitos-e-lendas-do-sul.pdf',text:'Lá pelas serras do Sul, contam da gralha que ganhou a cor do céu por ajudar a espalhar pinheiros. Ela enterra pinhões, esquece alguns e deixa uma floresta de lembrança. Até esquecimento pode dar bom fruto, tchê.'},
 {title:'O causo do peixe grande',affinity:12,text:'Pesquei um peixe tão grande que precisei de duas fotografias pra mostrar inteiro. O compadre perguntou se era verdade. Disse que não: eram três fotografias, mas uma molhou!'},
 {title:'O guardião do campo',affinity:25,source:'https://www.culturagaucha.com.br/paginas/cultura/lendas.html',text:'Meu avô contava do Boitatá, a serpente luminosa que protege o campo de quem destrói a natureza. Lenda ou assombração, a lição ficava: respeita o mato e não brinca com fogo, vivente.'},
 {title:'A cuia que não acabava',affinity:25,text:'O compadre fez um mate tão topetudo que o primeiro gole foi ontem e o ronco da bomba só veio hoje. Disse que não era exagero: tinha botado o relógio pra descansar junto da chaleira.'},
 {title:'O achado e o agradecimento',affinity:45,source:'https://www.culturagaucha.com.br/paginas/cultura/lendas.html',text:'Quando alguém perdia um pertence, a vó lembrava do Negrinho do Pastoreio. Na tradição, uma vela acompanha o pedido de ajuda. Ela sempre completava: achou o que perdeu? Então não esquece de agradecer.'},
 {title:'O cavalo e a pressa',affinity:45,text:'Meu cavalo era tão ligeiro que chegava na venda antes de eu decidir o pedido. Só tinha um defeito: voltava com fiado no meu nome. Desde então mando a lista por escrito!'}
];

const PROSE = `
Como foi a pescaria, tchê?|Voltei com três peixes e quinze histórias. Se vender as histórias, pago a isca.
O peixe era grande mesmo?|Era tão comprido que o retrato teve de sair deitado. A régua ficou com vergonha.
Trouxe alguma novidade do rio?|O peixe roubou minha isca de novo. Já considero cliente: come bem e nunca paga.
E aquela vara de pescar nova?|Excelente! Não peguei nada, mas agora passo vergonha com equipamento profissional.
Tá esperando alguém?|Meu compadre disse que vinha cedo. Pelo visto, cedo na semana que vem.
O cavalo ficou lá fora?|Ficou. Se alguém perguntar, ele só aceita carinho; o fiado é comigo.
Teu cavalo é manso?|Tão manso que pede licença pro capim antes de pastar. Só não gosta de segunda-feira.
Veio ligeiro hoje!|Meu cavalo ouviu falar em torrada. Descobri que ele corre melhor por salame que por cenoura.
Como tá o potreiro?|O portão não fecha, mas o cavalo também não foge. Acho que temos um acordo verbal.
Achou a ferradura perdida?|Achei. Agora falta convencer o cavalo de que três botas e um chinelo não combinam.
O mate tá no ponto?|Tá tão bom que a bomba ronca e eu respondo. Já virou conversa de família.
Vai mais uma água?|Vai. Mas devagar, que minha língua ainda tá negociando com a última.
Quem preparou essa erva?|Eu. Fiz um morro tão bonito que o compadre quis comprar o terreno.
Por que trouxe duas cuias?|Uma pra dividir e outra pra explicar que eu vim pra ficar um pouquinho mais.
Essa térmica conserva bem?|Conserva até segredo. Só abre quando a roda merece.
O mate ficou amargo?|Amargo é olhar a conta depois de dizer «hoje é por minha conta».
Tá quieto hoje, vivente.|Tô ouvindo a chaleira. É a única aqui que avisa antes de perder a paciência.
Essa bomba é nova?|Era. Emprestei pro compadre e voltou com mais histórias que eu.
Já tomou mate lá fora?|Tentei, mas o vento levou a erva. O pátio agora tá mais disposto que eu.
Quanto mate tu toma por dia?|Depende de quem pergunta. Pro médico é pouco; pra quem aquece a água, é uma barbaridade.
Como vai a horta?|O espantalho tá fazendo amizade com os passarinhos. Vou ter de trocar o funcionário.
Colheu bergamota?|Colhi três sacolas. Uma chegou em casa; as outras foram pedágio de vizinho.
O milho cresceu bem?|Cresceu tanto que pedi informação pra achar o outro lado da horta.
E os pepinos da conserva?|Tão descansando no vidro. Trabalharam uma vida inteira pra terminar de férias no vinagre.
Trouxe salame da colônia?|Trouxe, mas o caminho foi comprido e a faca muito bem afiada. Sobrou a lembrança.
Teu pomar dá muita fruta?|Dá fruta e reunião de família. Basta amadurecer que aparece parente de longe.
O galo anda cantando cedo?|Às quatro. Pedi pra atrasar o relógio, mas ele disse que o sol é problema meu.
Como estão as galinhas?|Uma botou no chapéu do compadre. Finalmente ele tirou alguma ideia da cabeça.
Deu trabalho plantar pinheiro?|Plantei com toda paciência. Quem tem pressa planta conversa, que cresce na hora.
O cachorro tá cuidando da casa?|Tá. Latindo pra folha e fazendo festa pro entregador. Cada um escolhe suas prioridades.
Trouxe a gaita hoje?|Trouxe. Mas deixei no carro até descobrir se a turma veio pra dançar ou pra descansar.
Tu toca de ouvido?|De ouvido eu escuto. Pra tocar ainda preciso bastante dos dedos.
Como foi o baile?|Dancei tão bem que me deram espaço. Agora não sei se era admiração ou prevenção.
Aprendeu o passo novo?|Aprendi a pedir desculpa quando piso no pé. O resto vem com a prática.
Vai ter música no domingo?|Se o violeiro chegar e o gato deixar. Os dois disputam a mesma cadeira.
Tua gaita tá afinada?|Uma metade tá. A outra gosta de ter opinião própria.
Quem ganhou o concurso de dança?|Meu compadre. Tropeçou tão bonito que o júri pensou que era passo de encerramento.
Foi a pé pro fandango?|Fui. A volta foi de orgulho ferido: a bota abriu antes da pista.
Tu sabe cantar essa?|Sei o começo e invento o resto. Funciona melhor quando todo mundo canta junto.
O rádio pega bem lá em casa?|Pega música, jogo e a furadeira do vizinho. Programação bastante variada.
Como foi a partida de ontem?|Meu time perdeu por detalhe: o outro fez os gols.
Tá ouvindo o campeonato?|Tô. O narrador gritou tanto que o cachorro foi procurar a bola no pátio.
Hoje teu time vai ganhar?|Claro! Antes do apito eu nunca errei esse palpite.
Cadê tua camiseta do time?|Lavando. Depois daquele jogo, precisava tirar o sofrimento do tecido.
Quem é o craque da várzea?|O dono da bola. Se botar no banco, termina o campeonato.
Tu ainda joga de goleiro?|Só quando o gol é pequeno e a bola vem devagar. Estou administrando a carreira.
Foi pênalti ou não foi?|Depende de quem paga a próxima rodada. Minha análise é muito criteriosa.
O juiz apitou demais?|Até o bem-te-vi pediu silêncio. Achei que ia acabar o fôlego antes do jogo.
E o treino da gurizada?|Foi ótimo. Metade jogou bola, metade discutiu se aquela pedra era a trave.
O placar foi justo?|Justo era acabar antes do segundo gol. Mas ninguém consultou minha proposta.
Vai encarar um truco?|Vou, mas já aviso: minha cara é de blefe mesmo quando a carta é boa.
Veio com sorte hoje?|Vim com um baralho. A sorte disse que ia direto pra outra mesa.
Tá escondendo o jogo?|Tô escondendo a vergonha. O jogo todo mundo já entendeu.
Teu parceiro joga bem?|Joga. O problema é que nunca descobrimos se estamos no mesmo time.
Por que tu gritou seis?|Porque três não convenceu ninguém. Agora tô tentando me convencer também.
Quem embaralhou essas cartas?|Não sei, mas misturou minha sorte com a do vizinho e entregou tudo pra ele.
Essa mão tá boa?|Boa pra segurar a caneca. Pra carta ainda tô avaliando.
Tá nervoso com a partida?|Que nada. Esse tremor é meu braço comemorando antecipadamente.
Quer trocar de cadeira?|Quero. Já troquei de parceiro e de desculpa; só falta testar o mobiliário.
Qual teu segredo no truco?|Nunca explicar a derrota enquanto a comida ainda tá chegando.
Como anda a estrada?|Tem um buraco que já reconhece meu carro. Acho que vai pedir carona qualquer dia.
Pegou chuva no caminho?|Peguei. Tanta que cheguei mais lavado que minha roupa de domingo.
O vento tá forte hoje?|Passei de chapéu e voltei de penteado novo. O chapéu seguiu viagem sozinho.
Tá frio lá fora?|Tá um frio que até o cusco sentou em cima do próprio rabo e chamou de cobertor.
O sol resolveu aparecer?|Apareceu só pra conferir o serviço e já foi embora. Deve trabalhar por empreitada.
Essa neblina demora a passar?|Hoje não vi nem minha pressa. Vou aproveitar e pedir com calma.
Trouxe guarda-chuva?|Trouxe, mas ele prefere abrir quando já cheguei no telhado.
Molhou a bota?|Molhou. Agora cada passo vem com acompanhamento de percussão.
Vai melhorar o tempo?|Meu joelho disse que sim. O outro discordou. Vou aguardar a votação.
Que calorão, hein?|O banco da praça tá cobrando couvert de chapa quente. Fiquei em pé por economia.
Como vai a obra da varanda?|A madeira chegou. Agora falta chegar a coragem de começar.
Arrumou a cerca?|Arrumei um lado. O outro ficou pra manter a tradição do mutirão.
Teu relógio parou?|Parou. Pela primeira vez não tô atrasado: o horário é que não chegou.
Tá trabalhando muito?|Tanto que meu descanso já pediu férias de mim.
Consertou a bicicleta?|Consertei a buzina. Os freios ficaram pra depois, mas agora o povo sabe que eu venho.
Como vai o trator velho?|Pega na primeira... conversa. Depois ainda precisa convencer o motor.
Quem te ensinou marcenaria?|Meu tio. Disse pra medir duas vezes; eu medi três e cortei do lado errado.
A porta continua rangendo?|Continua. É o alarme da casa, só que instalado pela idade.
Achou aquela chave inglesa?|Achei no lugar mais improvável: onde eu tinha guardado.
Conseguiu terminar cedo?|Terminei cedo de prometer. O serviço ficou pro resto do dia.
Tá de olho na torrada?|Tô escutando. Se estalar bonito, meu estômago já bate palma.
Esse xis mata a fome?|Mata e ainda manda flores. É um serviço completo.
Quer dividir o petisco?|Quero. Tu divide em dois e eu escolho a metade com mais salame.
O cheiro da prensa tá bom?|Tá anunciando o cardápio na rua. Se cobrar propaganda, paga o aluguel.
Vai só um cafezinho?|Só um. Mas se a xícara for pequena, a matemática muda.
O café ficou forte?|Forte nada: ele mesmo carregou a xícara até a mesa.
Quer o pão mais tostado?|Quero douradinho. Não precisa contar a história dele pelo carvão.
Tu gosta de pinhão?|Gosto. É o único lanche em que a conversa dura mais porque todo mundo tá descascando.
Bergamota depois do almoço?|Claro. Perfuma a mão e avisa a sala inteira que eu já fiz a sobremesa.
Como ficou a conserva?|Ficou no ponto. O pepino tá mais arrumado dentro do vidro que eu em dia de festa.
Quem contou esse causo?|O compadre. Se ele disser que foi ontem, confere se ontem existiu daquele jeito.
Trouxe alguma fofoca boa?|Só informação comunitária. Fofoca é quando vem sem data e sem testemunha.
Tu conhece todo mundo aqui?|Conheço. O difícil é lembrar quem ainda não ouviu a mesma história.
O vizinho continua curioso?|Perguntou onde eu ia. Disse «na frente». Ele quis saber de quem.
Tua família vem domingo?|Vem. Já contei as cadeiras, agora falta contar os convidados que aparecem sem avisar.
O compadre pagou o fiado?|Pagou uma visita. O dinheiro ficou prometido pra próxima modalidade.
Tá economizando pra quê?|Pra parar de dizer que tô economizando. É um plano de longo prazo.
O celular novo é bom?|Muito. Ele sabe a previsão, o caminho e meus horários. Só não sabe onde deixei os óculos.
Mandou o áudio no grupo?|Mandei. Dois minutos de silêncio e um «bah» no fim. Chamaram de podcast.
Quem organizou a festa?|Todo mundo opinou. Quem lavou a louça ainda tá procurando os organizadores.
Tu chegou antes da hora!|É estratégia. Escolho a cadeira que range menos e escuto o começo dos causos.
Essa bodega tá ficando bonita?|Tá. Quando eu entro pra comprar uma coisa, lembro de quatro motivos pra ficar.
Como foi a visita na cidade?|Boa. Mas perguntei «qual o causo?» e me mandaram tirar senha.
Tu tá com uma cara de sono.|Sonhei que tava trabalhando. Acordei cansado e ainda não recebi a diária.
Quem faz a melhor torrada?|Eu ia dizer minha tia, mas ela não tá ouvindo. Capricha que o título tá em disputa.
Tem algum conselho pro balcão?|Nunca diga «é rapidinho» pra quem tá com fome. O relógio dessa gente corre a cavalo.
Por que tu trouxe um caderno?|Pra anotar os causos. Minha memória só guarda a parte em que eu saio bonito.
Hoje a prosa tá rendendo.|Tá. Se conversa desse troco, eu saía daqui com dinheiro pra outra rodada.
Tu sempre senta no mesmo lugar?|Sim. A cadeira já conhece minhas histórias e nunca me interrompe.
Mais alguma coisa antes de ir?|Uma boa desculpa pra explicar por que o «já volto» durou a tarde inteira.
`.trim().split('\n').map((line,id)=>{const [player,reply]=line.split('|');return{id:'prose:'+id,player,reply};});
