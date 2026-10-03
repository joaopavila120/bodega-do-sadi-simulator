# Sprites dos itens

PNGs com fundo transparente, gerados para Bodega Do Sadi Simulator com a ferramenta integrada `image_gen`.

Cada produto tem um arquivo separado. `burger_pronto.png` e `ovo_pronto.png` são as versões cozidas; `xis_montado.png` e `xis_prensado.png` distinguem as etapas do xis. `cigarro_py.png` aparece após a melhoria do maço. Xis de bacon e de coração recebem o respectivo ingrediente sobre o sprite do xis. A comida queimada ou estragada recebe efeitos na renderização, sem precisar duplicar os arquivos.

O catálogo de imagens e o desenho ficam em `js/render/item-art.js`. O mesmo PNG é usado no cenário, na bandeja, nos balões dos clientes, na mão selecionada e no fornecedor do celular. O carregamento inicial verifica todos os arquivos antes de liberar o jogo. Não é preciso servidor nem instalar dependências.

Abra `catalogo.html` para conferir todos os sprites juntos, inclusive em tamanho pequeno. Os prompts de geração estão em `prompts.md`.
