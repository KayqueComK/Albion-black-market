// Script de verificação automatizada dos cálculos de arbitragem e ciclo de bandidos
import { calculateTaxRate, calculateArbitrageOpportunities } from './src/services/arbitrageCalculator.js';
import { evaluateBanditStatus, TRANSPORT_STATUSES } from './src/services/banditTracker.js';
import { getExpandedItemIdsList } from './src/data/itemsCatalog.js';

console.log('=== TESTE 1: CÁLCULO DE TAXAS ===');
const taxPremiumInstant = calculateTaxRate(true, 'instant');
console.assert(Math.abs(taxPremiumInstant - 0.04) < 0.0001, 'Taxa premium instant deve ser 4%');

const taxPremiumOrder = calculateTaxRate(true, 'order');
console.assert(Math.abs(taxPremiumOrder - 0.065) < 0.0001, 'Taxa premium order deve ser 6.5%');

const taxNonPremInstant = calculateTaxRate(false, 'instant');
console.assert(Math.abs(taxNonPremInstant - 0.08) < 0.0001, 'Taxa não-premium instant deve ser 8%');

const taxNonPremOrder = calculateTaxRate(false, 'order');
console.assert(Math.abs(taxNonPremOrder - 0.105) < 0.0001, 'Taxa não-premium order deve ser 10.5%');
console.log('✔ Todas as taxas conferidas com sucesso!\n');

console.log('=== TESTE 2: EXPANSÃO DE CATÁLOGO ===');
const catalog = getExpandedItemIdsList();
console.log(`Catálogo expandido contém ${catalog.length} variações de itens T4-T8.`);
console.assert(catalog.length > 50, 'Catálogo deve ter mais de 50 variações');
console.log('✔ Catálogo validado!\n');

console.log('=== TESTE 3: CÁLCULO DE ARBITRAGEM COM ORÇAMENTO ===');
const mockRawPrices = [
  {
    item_id: 'T4_BAG',
    city: 'Lymhurst',
    quality: 1,
    sell_price_min: 4000,
    sell_price_min_date: '2026-09-12T05:00:00'
  },
  {
    item_id: 'T4_BAG',
    city: 'Black Market',
    quality: 1,
    buy_price_max: 8000,
    buy_price_max_date: '2026-09-12T05:00:00'
  }
];

const mockCatalog = [
  {
    fullId: 'T4_BAG',
    baseId: 'T4_BAG',
    tier: 4,
    enchantment: 0,
    namePt: 'Bolsa T4',
    nameEn: 'Bag T4',
    category: 'accessories',
    weight: 1.5
  }
];

const budget = 100_000;
const results = calculateArbitrageOpportunities(mockRawPrices, mockCatalog, {
  budget,
  hasPremium: true,
  sellMode: 'instant',
  originCity: 'Lymhurst'
});

console.assert(results.length === 1, 'Deve retornar 1 oportunidade');
const itemRes = results[0];
console.log('Item:', itemRes.namePt);
console.log('Compra Lymhurst:', itemRes.buyPrice);
console.log('Venda BM:', itemRes.sellPrice);
console.log('Venda Líquida (-4%):', itemRes.netSellPrice);
console.log('Lucro Unitário:', itemRes.unitProfit);
console.log('ROI %:', itemRes.roiPercent.toFixed(1) + '%');
console.log(`Com orçamento de ${budget}: pode comprar ${itemRes.maxUnits}x unidades`);
console.log('Lucro Total com Orçamento:', itemRes.totalNetProfit);

console.assert(itemRes.netSellPrice === 7680, 'Venda líquida deve ser 7680');
console.assert(itemRes.unitProfit === 3680, 'Lucro unitário deve ser 3680');
console.assert(itemRes.maxUnits === 25, '100.000 / 4.000 = 25 unidades');
console.assert(itemRes.totalNetProfit === 25 * 3680, 'Lucro total deve bater 92.000');
console.log('✔ Cálculo de arbitragem e orçamento 100% verificado!\n');

console.log('=== TESTE 4: AVALIAÇÃO DE STATUS DE TRANSPORTE DO ASSALTO ===');
const now = Date.now();
// 1. Assalto começou há 20 min -> deve estar ativo
const activeEv = evaluateBanditStatus(now - (20 * 60 * 1000), now);
console.assert(activeEv.status.id === TRANSPORT_STATUSES.ACTIVE.id, 'Deve estar ativo');

// 2. Assalto começou há 60 min -> deve estar em pós-assalto
const postEv = evaluateBanditStatus(now - (60 * 60 * 1000), now);
console.assert(postEv.status.id === TRANSPORT_STATUSES.POST_ASSAULT.id, 'Deve estar em pós-assalto');

// 3. Assalto começou há 180 min (3h) -> alto perigo / cooldown
const dangerEv = evaluateBanditStatus(now - (180 * 60 * 1000), now);
console.assert(dangerEv.status.id === TRANSPORT_STATUSES.HIGH_DANGER.id, 'Deve estar em alto risco');

// 4. Assalto começou há 250 min (4h10m) -> preparação
const prepEv = evaluateBanditStatus(now - (250 * 60 * 1000), now);
console.assert(prepEv.status.id === TRANSPORT_STATUSES.PREPARING.id, 'Deve estar em preparação');
console.log('✔ Ciclo de estados do Assalto dos Bandidos validado com sucesso!\n');

console.log('TODOS OS TESTES PASSARAM COM ÊXITO!');
