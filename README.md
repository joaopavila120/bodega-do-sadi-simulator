# Bodega Do Sadi Simulator

Jogo 2D de cozinha, atendimento, truco e causos numa autêntica bodega gaúcha.

## Como Jogar

Basta abrir `index.html` (ou `bodega-do-interior.html`) diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, etc.). Não necessita de servidores, build ou dependências extras — é clicar e jogar!

Baixe ou copie **a pasta completa**: os dois HTMLs precisam das pastas `js/`, `css/` e `assets/` ao lado deles. Os PNGs e MP3s agora são arquivos externos; copiar somente o HTML não leva o jogo inteiro. Ao baixar pelo GitHub, use **Code → Download ZIP** e extraia antes de abrir.

Na abertura, aguarde o carregamento das imagens. Se faltar algum arquivo, a tela inicial informa o caminho que não foi encontrado. O nome antigo do HTML e as chaves de salvamento foram preservados. Para continuar uma partida antiga, abra o mesmo arquivo no mesmo navegador; navegadores podem separar o armazenamento entre arquivos locais e endereços HTTP.

### Controles
- **WASD / Setas**: Andar pelo salão e cozinha
- **E**: Pegar ingrediente, preparar na chapa/bancada, servir balcão ou mesa
- **Q**: Soltar item no chão
- **R**: Retirar ingrediente da bancada
- **1 / 2**: Alternar entre os espaços da bandeja (após desbloquear melhoria)
- **C**: Abrir o Celular (Fornecedor, Melhorias e Contatos)
- **F**: Reabastecer a cuia junto ao balcão de erva-mate, com as mãos livres
- **Y**: Jogar truco perto da mesa fixa de carteado. Com a mesa vazia, E também abre cartas. Cacheta está nesse menu.
- **Esc**: Pausar / Fechar janelas

---

## Cenários, torcida e novos fregueses

Um jogo novo permite escolher **nome da bodega, cenário e personagem jogável**: Sadi, Badin, Guri, Márcio, Marcelo, Indavirus, Lauro, Peixinho na Brasa ou Mano Lima. Os fregueses comuns e torcedores continuam como clientes, mas não aparecem na seleção. A escolha é salva e aparece também na cancha de bocha. A entrada apresenta os recursos disponíveis e o botão **Guia e progresso** reúne atendimento, cozinha, lazer, contatos, eventos e os requisitos dos desbloqueios. O botão **Abrir bodega** fica no menu lateral direito.

**Dificuldade progressiva:** o primeiro dia é guiado, com um freguês por vez. O dia 2 traz uma ou duas pessoas por mesa de restaurante, com um item por freguês. Nos dias 3–4 chegam até três pessoas e pedidos duplos. Do dia 5 em diante vêm grupos de até quatro e podem ocorrer brigas. A partir do dia 7, os pedidos podem ter três itens. Fora do tutorial, cada pessoa mantém seu prazo de 110 s, pagamento e gorjeta independentes. **Balões pequenos sobre cada freguês** mostram seus itens e prazo, mantendo as cabeças e mercadorias visíveis. No balcão, aparece o pedido do primeiro cliente que já chegou, incluindo o peso solicitado. Não há faixa de pedidos no topo. Os avisos ficam na lateral e os pagamentos aparecem junto ao caixa na HUD. Entregar na mesa atende primeiro quem pediu aquele produto e tem menos tempo. Uma desistência não cancela os outros pedidos.

**Mesa de truco:** a mesa 2 recebe a fila comum, com a mesma progressão de grupos, cardápio e permanência das outras mesas. Não existe reserva para uma turma especial nem restrição a álcool/petiscos em dias normais. A diferença é poder jogar truco nela com Y.

**Campeonato de duplas:** na abertura entram exatamente quatro participantes por mesa disponível — duas duplas. O elenco permanece até fechar, sem novas chegadas ao salão ou balcão. As mesmas pessoas fazem pedidos sucessivos de bebidas e petiscos, e o rodízio muda os adversários a cada rodada, mantendo os parceiros juntos. A troca espera terminar uma briga; os fregueses caminham para seus lugares levando pedidos, pagamentos parciais e prazos pendentes. Desistências de pedidos e brigas não expulsam os inscritos. Ao fechar, cessam as rodadas de pedidos e todos saem depois dos últimos atendimentos. Amplie o salão antes da inscrição; novas mesas ficam para o próximo expediente. Rodízio e deslocamentos são salvos.

**Conversa automática:** entregar cada produto inicia uma fala do cliente atendido e concede +3 de afeto, inclusive em pedidos com vários itens. Conversas consecutivas aguardam sua vez, sem apagar a anterior. A entrega incorreta não gera conversa; I e o botão de prosear foram removidos. Três atendimentos completos ainda tornam o cliente freguês da casa, com gorjeta extra.

**Dia 1 é tutorial sequencial:** cigarro → cerveja → xis → celular e melhoria grátis → trago → 500 g de erva → tomar mate → reabastecer a cuia → limpar a mesa. Cada etapa tem sua explicação; o cliente anterior termina de sair antes da próxima chegada. Durante esse dia não há pedidos aleatórios, turma do truco, prazo de entrega nem encerramento pelo relógio. A chapa e a prensa continuam cozinhando e podem queimar; as dicas do xis acompanham montagem, cozimento e entrega.

A **Mesa de tragos começa ausente**. A primeira melhoria, apresentada no celular após o xis, custa **R$ 0** e inclui dez doses de cachaça. As demais melhorias aguardam o fim das lições. A sequência e o cliente atual são salvos. Comece uma nova história para experimentar o tutorial: partidas antigas preservam seus atendimentos, estoque e mesa de tragos. Ao concluir as lições, o primeiro dia termina e um anúncio entrega a TV do sorteio do comércio local. Depois, os eventos são sorteados sem repetir o dia anterior; a previsão fica salva.

**Badin, Márcio, Marcelo, Peixinho na Brasa, Indavirus e Lauro não aparecem duplicados** entre balcão, fila e mesas; a regra inclui o personagem escolhido pelo jogador. Os demais podem repetir. Indavirus e Lauro costumam chegar juntos. Indavirus, Lauro e Peixinho têm prosa ficcional da imigração alemã em Santa Catarina; Mano Lima fala da cadela baia e do lobisome do Arvoredo. Há 48 falas novas editáveis em `[indavirus]`, `[lauro]`, `[peixinhonabrasa]` e `[manolima]` no TXT.

O celular separa **Fornecedor**, **Melhorias** e **Contatos**. As melhorias são agrupadas por cardápio, cozinha, salão e botas/mate. Contatos reúne retratos, afeto, preferências e gorjetas. O **cavalo está temporariamente indisponível**; compras antigas continuam guardadas, mas o salvamento equipa as melhores botas disponíveis e não aplica velocidade de montaria.

Na tela inicial, escolha **Room 1** (`room.png`) ou **Room 2**. As Rooms 3, 4 e 5 são liberadas com **4, 8 e 12 melhorias diferentes compradas** na partida. Use **Celular → Trocar cenário** antes de abrir ou depois de fechar, sem perder estoque, mesas ou progresso. Os cenários usam a mesma disposição das estações e rotas.

A cuia começa com **500 g**, consome **100 g por uso** e mantém a capacidade com as melhorias. Ao esvaziar, aparece “Acabou seu mate, traga mais erva para sua cuia”. Vá ao saco de erva, libere as mãos e use **F · Encher sua cuia de erva**, disponível somente por perto. O refil desconta do estoque. A lateral não mantém medidor ou botão permanente da cuia; beber mate e limpar exibem uma única barra de ação.

Os pedidos das mesas têm **110 segundos**, tanto simples quanto duplos; os do balcão, **95 segundos**. Queijo pode ir diretamente ao pão na bancada, ou continuar sendo derretido na carne. Em dias de chuva, os clientes deixam poças pelo percurso e vão secando após caminhar. A limpeza continua usando E.

**Devolver produtos:** volte à caixa, prateleira, geladeira ou saco de origem e aperte E. A devolução usa somente o espaço selecionado da bandeja, preserva custo e estado dos ingredientes e repõe o peso real dos produtos a granel. Café, cachaça, bitter e cerveja de caneca não podem ser devolvidos. Itens queimados/estragados devem ser descartados; se a estação estiver cheia, use o apoio. A bandeja aparece mais alta, na altura das mãos do personagem.

A TV ganha após o primeiro dia libera **Jogo do Grêmio**, **Jogo do Inter** e **Gre-Nal** no sorteio dos eventos. Nos eventos de um time, só entram seus torcedores; no Gre-Nal, as torcidas se misturam e, a partir do dia 5, podem brigar também nas mesas de restaurante. O intervalo traz outra rodada. Torcedores aparecem ocasionalmente em dias comuns.

Badin, Guri, Márcio e Marcelo têm falas próprias. A dupla costuma chegar junta, mas pode visitar separadamente. Os três arquivos de torcida oferecem seis fregueses cada. As imagens originais ficam preservadas em `assets/images`; os recortes e contornos usados pelo Canvas estão em `js/config/characters.js`.

## Como editar os diálogos

1. Abra **`dialogos.txt`** no Bloco de Notas e salve em UTF-8.
2. Escolha uma seção, como `[badin]`, `[guri]`, `[marcio]` ou `[marcelo]`.
3. Escreva uma conversa por linha, separando pergunta e resposta por `|`:

   ```text
   [badin]
   Como anda a horta? | CUDIO! A alface tá mais bonita que o meu domingo!
   ```

4. Salve o arquivo e **recarregue o jogo com F5**. As falas entram automaticamente.

Não existe botão de importação no jogo. O arquivo `dialogos.txt` é a fonte das falas personalizadas; uma importação antiga guardada no navegador não substitui o texto atual. Preserve a primeira linha (`window.BODEGA_DIALOGUE_SOURCE = function () { /*`) e a última (`*/ };`): elas permitem o carregamento direto por `file://`. Edite apenas as seções entre essas linhas, sem inserir a sequência `*/` nas falas. Por HTTP, o mesmo conteúdo é lido como texto, sem cache. Nenhum arquivo é enviado para a internet.

`[gremio]` e `[inter]` personalizam toda a torcida. Para alguém específico, use `[gremio_1]` até `[gremio_6]`, `[gremio2_1]` até `[gremio2_6]`, ou `[inter_1]` até `[inter_6]`. Os fregueses antigos usam `[lucia]`, `[anselmo]`, `[rosa]`, `[nair]`, `[valter]` e `[arlindo]`. Seções vazias preservam as falas padrão. Linhas começadas com `#` são comentários.

Os personagens do salão ficaram aproximadamente um terço maiores, com amostragem de alta qualidade. O xis montado é alto e claro; pronto na prensa, fica achatado, dourado e marcado pela grelha. A faixa lateral tem 224 px no computador, sem rolagem, com controles discretos; no celular ela fica fixa abaixo do cenário. O celular abre como janela própria. Foram removidos combo, Mapa, troca de mesa e as placas de cozinha, mercadorias, chimarrão, atendimento e limpeza.

## Bocha a qualquer momento

Aproxime-se da **porta no canto inferior direito do salão, com a placa “Cancha de bocha”**, e aperte E. A porta não tem desenhos de bolinhas. Na cancha aparece **Jogar bocha**, antes, durante ou depois do expediente. Não há acesso permanente pelo menu geral. Os personagens da cancha também estão maiores. A bodega fica congelada enquanto você está lá, preservando fase, pedidos, chapa, entregas e brigas. Ao terminar a partida, pode jogar de novo ou voltar pela opção **Voltar à bodega**.

- Partida até **6 pontos**, quatro bochas por pessoa em cada rodada. Os lançamentos se alternam; o primeiro a lançar também alterna entre rodadas.
- O bolim é lançado automaticamente na região distante. **A/D ou ←/→** mudam a posição inicial enquanto a seta oscila.
- **Espaço** trava a direção; outro **Espaço** fixa a força e lança. Os botões e o clique na cancha também funcionam. A indicação pontilhada mostra apenas o início da trajetória.
- Bochas colidem, empurram outras e deslocam o bolim. A força é não linear, com pequena variação e desvio sutil da terra. A perspectiva é apenas visual; as distâncias são medidas no plano da cancha.
- Só o lado com a bola mais próxima pontua: um ponto por bocha mais perto que a melhor do adversário. Empate técnico não dá pontos.
- A IA possui dificuldades **Fácil, Normal e Difícil**, com precisão diferente e batidas ocasionais.
- Apostas: treino grátis ou **R$ 5, 10, 25, 50 e 100** do caixa do jogo. A entrada sai ao começar; vitória devolve o dobro, derrota ou desistência perde a entrada. O saldo aparece separado no relatório do dia.
- **Esc / Pausar** congela a partida. Ao continuar um salvamento, a bocha reabre pausada, preservando placar, bolas, velocidades e aposta. O prêmio só é pago uma vez.

## Estrutura do Projeto

O código foi totalmente modularizado e organizado por responsabilidades em pastas limpas:

```text
jogo-bodega/
├── index.html                   # Ponto de entrada principal do jogo
├── bodega-do-interior.html      # Entrada compatível, sem redirecionar o arquivo antigo
├── README.md                    # Documentação do projeto
├── dialogos.txt                 # Conversas editáveis, carregadas automaticamente
├── css/
│   └── style.css                # Folha de estilos completa (HUD, diálogos, cartas, telas)
├── assets/
│   ├── images/                  # Imagens e spritesheets extraídos do base64
│   │   ├── room.png             # Cenário da bodega
│   │   ├── room2.png ... room5.png # Cenários de progressão
│   │   ├── badin.png / guri.png / marciomarcelo.png # Novos fregueses
│   │   ├── gremio.png / gremio2.png / inter.png # Torcidas
│   │   ├── people.png           # Sprites dos fregueses e cozinheiro
│   │   ├── horse.png            # Sprite do cavalo crioulo
│   │   ├── furniture.png        # Atlas dos móveis e balcões
│   │   ├── logo.png             # Logotipo oficial transparente
│   │   └── favicon.png          # Ícone da página
│   └── audio/                   # Trilha sonora
│       ├── 1.mp3                # Música de preparação / ambiente lento
│       └── 2.mp3                # Música de atendimento agitado
└── js/
    ├── config/                  # Dados estáticos e configurações
    │   ├── constants.js         # Dimensões, posições das estações, mesas e velocidades
    │   ├── items.js             # Catálogo de produtos, receitas, melhorias, eventos e apostas
    │   ├── characters.js        # Identidades, torcidas e recortes dos personagens
    │   ├── dialogues.js         # Falas padrão dos novos fregueses
    │   └── stories.js           # Causos, histórias e repertório de conversas dos fregueses
    ├── core/                    # Lógica central e ciclo de vida
    │   ├── helpers.js           # Funções matemáticas, formatação de moeda e utilitários
    │   ├── state.js             # Estado global (G), salvamento e carregamento
    │   ├── input.js             # Gerenciamento de teclado, toques na tela e cliques
    │   ├── game.js              # Loop principal (requestAnimationFrame), simulação e fases do dia
    │   └── bootstrap.js         # Inicialização única, depois de todos os scripts e imagens
    ├── audio/
    │   └── audio.js             # Motor de áudio WebAudio e sintetizador de efeitos sonoros
    ├── entities/                # Atores do mundo
    │   ├── player.js            # Movimentação do jogador, colisão, cavalo e detecção de proximidade
    │   └── customers.js         # Spawning de clientes, filas, paciência e ocupação de mesas
    ├── mechanics/               # Sistemas de jogabilidade
    │   ├── kitchen.js           # Chapa, prensador de xis, bancadas, balança de secos e preparo
    │   ├── service.js           # Atendimento no balcão, entregas nas mesas e pagamentos
    │   ├── card-game.js         # Minijogos de cartas: Truco Gaúcho, Cacheta, IA e apostas
    │   ├── world.js             # Cenários, reserva de mate, rastros de chuva e futebol
    │   ├── bocce.js             # Física, IA, apostas e interface da bocha
    │   └── fight.js             # Minijogo de contenção de brigas nas mesas (QTE)
    ├── render/                  # Gráficos e desenho
    │   ├── sprites.js           # Desenho de sprites, vetores SVG de comidas, balões e móveis
    │   └── renderer.js          # Renderizador Canvas em camadas, clima (chuva) e feedbacks
    └── ui/                      # Interface e modais
        ├── hud.js               # Atualização da HUD (relógio, caixa, reputação, notificações)
        ├── dialogue.js          # Interface de conversas com fregueses
        ├── custom-dialogues.js  # Leitura automática e validação do TXT
        └── modals.js            # Menus de início, fornecedor, melhorias e telas de ajuda
```

---

## Recursos e Mecânicas
- **Cozinha Dinâmica**: Monte xis, torradas de salame e café quentinho.
- **Balança de Secos**: Pese erva-mate, pinhão e bergamota no ponto exato.
- **Truco Gaúcho & Cacheta**: Truco permite apostar dinheiro do jogo; cacheta é amistosa.
- **Ambiente Vivo**: Histórias e causos autênticos do Rio Grande do Sul contados pelos fregueses.
- **Botas e mate**: Combine velocidade permanente das botas com o impulso temporário do chimarrão. O cavalo está temporariamente indisponível.
- **Salva Automaticamente**: Progresso salvo no `localStorage` do navegador com suporte a modo de testes independente.

## Inicialização e manutenção

Os scripts são JavaScript clássico, carregados em ordem explícita pelos dois HTMLs para permitir uso por `file://`. `state.js` declara o estado, mas não chama `fresh()` durante seu carregamento. Somente `bootstrap.js`, carregado por último, cria o estado, aguarda as imagens, habilita os botões e inicia o loop. Assim, funções como `eventForDay()` já existem quando a primeira partida é criada.

`constants.js` reúne as dimensões lógicas de **1280 × 800**, os tempos de preparo, os identificadores das estações e as posições correspondentes ao cenário. Ao editar o mapa, mantenha desenho, colisões, rotas e identificadores usados nas interações compatíveis. As funções de preço, estoque e desbloqueio ficam em `helpers.js`.

## Verificação automática

Para desenvolvimento, use **Node.js 22 ou superior** e Chrome, Edge ou Chromium instalado:

```sh
node tests/smoke.cjs
```

Não é necessário instalar pacotes npm. Se o navegador estiver em outro local, defina `BROWSER_PATH` com o caminho do executável. Node não é necessário para jogar.

O teste usa um perfil temporário separado e verifica os dois HTMLs por arquivo local e por HTTP, imagens e músicas externas, cliques e teclado, salvamento, cozinha, vendas, fornecedor, melhorias, balança, eventos, brigas, truco e interface móvel. Também simula arquivos ausentes para verificar o aviso de falha na abertura.

`tests/expansion-scenarios.js` cobre os desbloqueios de cenários, queijo direto no pão, reposição e consumo do mate, poças geradas por movimento, torcidas exclusivas, brigas do Gre-Nal, dupla de fregueses e migração dos salvamentos antigos. O teste lê o TXT automaticamente por `file://` e HTTP e verifica a atualização das falas ao recarregar.

`tests/bocce-scenarios.js` verifica lançamentos alternados, uma rodada completa com física, colisões, bolim, força, perspectiva, pontuação, empate, três dificuldades, pausa, salvamento e liquidação das apostas. O teste de navegador exercita ainda os comandos reais e a retomada da bocha após recarregar.

`tests/social-scenarios.js` cobre o elenco novo, escolha de personagem e nome, exclusividade entre filas e mesas, grupos de quatro, pagamentos/desistências individuais, rodadas extras, Contatos, cavalo suspenso, migração de partidas e truco/bocha em todas as fases do dia.

`tests/difficulty-scenarios.js` cobre os limites de grupos e pedidos por dia, ocupação normal da mesa de truco, restrições de brigas, ciclos de eventos, previsão persistente, prêmio da TV, refil contextual, faixa lateral fixa, desenhos do xis, barras únicas e entrada/saída da cancha. A implementação desses sistemas está em `js/mechanics/day-progression.js`.

`tests/tournament-scenarios.js` cobre fila na mesa de truco, cardápio comum, prosa automática em entregas parciais e no balcão, campeonato com duas/três/quatro mesas, parceiros fixos, rodízio com pedidos preservados, persistência durante deslocamentos, reposição de pedidos, brigas, limite de inscritos, fechamento e migração de campeonatos antigos. A implementação está em `js/mechanics/tournament.js`.

`tests/tutorial-scenarios.js` percorre as nove lições usando preparo, pesagem, entregas e compras reais. Verifica a pausa nas chegadas, ausência de prazos, retomada sem duplicar clientes, melhoria gratuita, migração de partidas antigas e transição para o dia 2. O roteiro está em `js/mechanics/tutorial.js`; os balões estão em `js/render/order-bubbles.js`, e os recibos visuais em `js/ui/payment-feedback.js`.

`tests/interface-returns-scenarios.js` verifica a seleção restrita, tela inicial sem faixa sobreposta, controles na lateral, grupos progressivos de truco, 16 balões sem sobreposição e devoluções pela tecla E. Inclui peso real, bebidas excluídas, origem errada, seleção da bandeja e preservação de estado após salvar/recarregar. A lógica de devolução está em `js/mechanics/returns.js`.

Os arquivos `js/config/new-characters.js` e `new-dialogues.js` registram os novos fregueses sem alterar os índices dos personagens antigos. `js/entities/diners.js` controla os pedidos individuais; `js/ui/guide.js` reúne configuração do personagem, retratos, Contatos e explicações da progressão. As imagens originais são preservadas: os recortes de personagens acontecem apenas no Canvas.
