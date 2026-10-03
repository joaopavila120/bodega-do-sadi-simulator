// Executado pelo smoke.cjs no navegador: verifica os sistemas que dependem entre si.
(() => {
  const results = [];
  const check = (value, label) => { if (!value) throw new Error(label); results.push(label); };
  const advance = (seconds, tick) => { for (let t = 0; t < seconds; t += .05) tick(.05); };
  const approach = id => {
    const f = furniture().find(f => f.id === id);
    if (!f) throw new Error('Estação ausente: ' + id);
    for (let x = f.x - 50; x <= f.x + f.w + 50; x += 8) {
      for (let y = f.y - 50; y <= f.y + f.h + 50; y += 8) {
        if (!canWalk(x, y) || distRect({ x, y }, f) > 45) continue;
        G.player = { x, y, dx: 1, dy: 0 };
        if (nearest()?.id === id) return;
      }
    }
    throw new Error('Estação inacessível: ' + id);
  };
  G = fresh(); G.tutorial.guided=false; started = true; paused = false; modal = null; phoneOpen = false;
  G.spawnShop = G.spawnGroup = 999; AudioEngine.on = false;
  for (const id of ['start', 'overlay', 'phone']) $(id).classList.add('hidden');
  check(unlocked('pao_xis') && unlocked('cigarro') && !unlocked('cafe'), 'produtos básicos disponíveis e melhorias bloqueadas');
  check(availableTables().length === 2 && isTableTruco(G.tables[1]), 'mesas iniciais e progressão mantidas');
  takeFromBin('pao_xis'); useBench(0); useBench(0);
  takeFromBin('burger'); useGrill(0); takeFromBin('queijo'); useGrill(0);
  takeFromBin('ovo'); useGrill(1); advance(11.1, kitchenTick);
  check(G.kitchen.grill[0].ready && G.kitchen.grill[1].ready, 'carne e ovo cozinham no tempo correto');
  useGrill(0); useBench(0); useGrill(1); useBench(0); useBench(0); usePress();
  advance(6.1, kitchenTick); usePress();
  check(held()?.pid === 'xis_salada' && held().ready, 'xis completo da montagem até a prensa');
  G.phase = 'open';
  const group = spawnGroup({ size: 1, fixedOrders: ['xis_salada'] });
  advance(12, customersTick); const balance = G.cash; interactTable(group.table);
  check(!held() && G.cash > balance && group.state === 'chat', 'cliente chega à mesa, recebe o xis e paga');
  spawnShop(); advance(12, customersTick); readyProduct('cigarro'); approach('service');
  const retailBalance = G.cash; interact();
  check(!held() && G.cash > retailBalance, 'balcão comercial acessível e venda de cigarro funcional');
  G.phase = 'prep'; G.rep = 100; G.cash = 10000;
  for (const upgrade of UPGRADES) buyUpgrade(upgrade.id);
  check(G.stock.cafe === 12 && G.up.coffee && G.gear === 'bootsBagual' && !G.up.horse, 'compras e cafeteira disponíveis; montaria permanece indisponível');
  for (const f of furniture()) approach(f.id);
  check(true, 'todas as estações e mesas compradas podem ser alcançadas');
  approach('coffee'); keys.add('e'); interact(); advance(1.45, holdTick); keys.clear();
  check(held()?.pid === 'cafe', 'cafeteira prepara o produto'); G.hands[0] = null;
  takeFromBin('pao_xis'); usePress(); readyProduct('salame'); usePress(); advance(6.1, kitchenTick); usePress();
  check(held()?.pid === 'torrada' && held().ready, 'torrada de pão e salame sem chapa'); G.hands[0] = null;
  approach('shop:bergamota'); keys.add('e'); interact();
  holdTick(G.task.requested / (G.task.maxWeight / 2.5)); keys.clear(); cancelHold();
  check(held()?.pid === 'bergamota' && held().weight > 0, 'pesagem de produto a granel'); G.hands[0] = null;
  const stock = G.stock.burger; orderGoods('burger'); advance(8.1, deliveryTick);
  check(G.stock.burger > stock, 'fornecedor entrega e repõe o estoque');
  check(PROSE.length >= 100 && nextProse(0).reply, 'repertório de diálogos carregado');
  G.phase = 'closed'; nextDay('campeonato'); closeDialog(true); G.event.seen = true; openDay();
  check(availableTables().every(isTableTruco), 'planejamento e campeonato de truco');
  G.spawnShop = G.spawnGroup = 999; G.groups = []; G.shop = [];
  for (const t of G.tables) { t.group = null; t.dirty = false; t.fight = null; }
  const cardGroup = spawnGroup({ size: 2, tournament: true }); advance(12, customersTick);
  const table = G.tables[cardGroup.table]; triggerFight(table); approach('table:' + table.id); beginFight(table);
  for (const key of [...table.fight.seq]) fightKey(key);
  check(!table.fight && G.fightTarget === null, 'briga resolvida com sequência completa');
  save(); const saved = readSave();
  check(saved.up.coffee && saved.gear === 'bootsBagual' && saved.event.id === 'campeonato', 'salvamento preserva equipamentos e evento');
  return results;
})()
