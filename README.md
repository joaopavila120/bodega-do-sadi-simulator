# Bodega Do Sadi Simulator

Jogo 2D de cozinha, atendimento e convivência numa bodega gaúcha.

Abra `bodega-do-interior.html` no navegador. O jogo funciona offline: arte, logo e músicas estão incorporados ao HTML. O nome do arquivo e as chaves de salvamento foram mantidos para preservar a continuidade das partidas anteriores.

- WASD/setas: andar; E: pegar, preparar ou servir; Q: soltar.
- C: fornecedor e melhorias; I: conversar; T: converter mesa livre.
- Y: jogar truco com um freguês sentado; o atendimento pausa durante a partida.
- 1/2: espaços da bandeja; R: retirar ingrediente; Esc: fechar ou pausar.
- A versão de testes tem dinheiro infinito, reputação inicial 100 e salvamento separado.

As apostas usam o dinheiro do jogo: entrada de R$ 5, 10, 25, 50 ou 100, ou partida sem aposta. Vitória retorna o dobro; derrota ou desistência perde a entrada.

## Arquivos

- `bodega-do-interior.html`: jogo completo e executável.
- `1.mp3` e `2.mp3`: músicas fornecidas pelo usuário, também incorporadas ao jogo.
- `assets/bodega-do-sadi-logo-original.jpg`: logo original fornecido pelo usuário.
- `assets/bodega-do-sadi-logo.png`: versão com transparência, usada na abertura, no cabeçalho e no ícone da página.

## Preparação do logo

Ferramenta: `image_gen.imagegen`, modo integrado de edição. Entrada: `Gemini_Generated_Image_l5qv0rl5qv0rl5qv.jpg`. A versão original foi preservada. A saída transparente foi inspecionada antes de integrar o logo.

Prompt utilizado:

> Use case: background-extraction. Input image is the exact edit target: the supplied Bodega do Sadi Simulator logo. Remove ONLY the gray and white checkerboard background outside the emblem and in the small cutouts around the lettering. Output a genuinely transparent PNG with alpha, not a checkerboard pattern. Keep the entire original logo: rope border, dark green oval, illustrated gaucho raising a mate, bodega interior, exact lettering 'Bodega do Sadi' and 'Simulator'. Preserve the original artwork, colors, character face, pose, typography, proportions, pixel-art details and layout as faithfully as possible. No redesign, no new elements, no new text. Frame the complete logo centered on a square 1536 x 1536 transparent canvas, fitted closely with approximately 3% transparent padding, no clipping of the rope or letters. The only intended change is extraction of the existing logo from its checkerboard background.

Os créditos da arte do cenário e as fontes dos causos também estão na ajuda do jogo.
