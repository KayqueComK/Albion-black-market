// Motor de Otimização de Carga Máxima para Contrabandistas de Caerleon
// Modelo baseado na estratégia real de vídeos e guias de transporte do Albion Online:
// "Diversificação Extrema: 1 a 2 unidades de dezenas de itens diferentes de alta demanda"
// Evita saturar ordens de compra individuais no Black Market e garante venda imediata ao chegar em Caerleon.

import { TRANSPORT_MOUNTS, BAGS_CATALOG } from '../data/itemsCatalog.js';

/**
 * Executa a otimização de carga baseada na estratégia de alta diversificação
 * @param {Array} opportunities - Lista de oportunidades calculadas com unitProfit > 0
 * @param {Object} config - Configurações do usuário
 * @returns {Object} Plano de compra otimizado e métricas completas
 */
export function optimizeCargoLoadout(opportunities, config = {}) {
  const {
    budget = 1_000_000,
    mountId = 'armored_horse_t5',
    bagId = 'bag_t5',
    safetyMarginPercent = 0.05, // 5% de margem de folga de peso
    maxItemDiversity = 35,      // Capacidade para até 35 tipos diferentes de itens
    maxUnitsPerItem = 2,        // 1 a 2 unidades por item (padrão ouro de transportadores de Albion)
    strategy = 'fast_sale',     // 'fast_sale' | 'max_diversity' | 'balanced' | 'max_profit' | 'high_mobility'
    onlyHighDemand = false
  } = config;

  const mount = TRANSPORT_MOUNTS.find(m => m.id === mountId) || TRANSPORT_MOUNTS[0];
  const bag = BAGS_CATALOG.find(b => b.id === bagId) || BAGS_CATALOG[0];

  const totalMaxLoadKg = mount.maxLoadKg + bag.bonusKg;
  const effectiveMargin = strategy === 'high_mobility' ? 0.15 : safetyMarginPercent;
  const targetMaxWeightKg = totalMaxLoadKg * (1 - effectiveMargin);

  // No Albion real, transportadores nunca colocam mais de 8% a 15% do saldo em um único item
  // para não travar a banca inteira em um item luxuoso que demora para ser dropado em masmorras.
  const maxPricePerUnit = budget <= 150_000 
    ? budget 
    : Math.max(35_000, budget * (strategy === 'max_profit' ? 0.35 : 0.09));

  // 1. Filtrar e pontuar candidatos
  const candidates = opportunities
    .filter(op => {
      if (onlyHighDemand && !op.isHighDemand) return false;
      return (
        op.unitProfit > 0 &&
        op.buyPrice > 0 &&
        op.buyPrice <= maxPricePerUnit &&
        (op.unitWeight || 2.0) <= targetMaxWeightKg
      );
    })
    .map(op => {
      const weight = op.unitWeight || 2.0;
      const profitPerKg = op.unitProfit / weight;
      const roi = op.roiPercent;

      // Multiplicador de Demanda (Black Market / Caerleon)
      let demandMultiplier = 1.0;
      if (op.demandLevel === 'ultra') {
        demandMultiplier = strategy === 'fast_sale' ? 3.0 : 1.5;
      } else if (op.demandLevel === 'high') {
        demandMultiplier = strategy === 'fast_sale' ? 1.9 : 1.25;
      } else {
        demandMultiplier = strategy === 'fast_sale' ? 0.5 : 0.95;
      }

      // Bônus para Tiers Meta de Transporte (T4.1, T5.0, T5.1, T6.0)
      // São os itens com maior frequência de drop no mundo aberto e rotação mais veloz no BM
      let tierSweetSpotMultiplier = 1.0;
      if ((op.tier === 4 && op.enchantment > 0) || op.tier === 5 || op.tier === 6) {
        tierSweetSpotMultiplier = 1.3;
      }

      const weightFactor = totalMaxLoadKg < 1000 ? 0.6 : 0.4;
      const baseScore = (roi * (1 - weightFactor)) + (profitPerKg * weightFactor);
      const score = baseScore * demandMultiplier * tierSweetSpotMultiplier;

      return {
        ...op,
        unitWeight: weight,
        profitPerKg,
        score
      };
    });

  // Ordenar por pontuação de rentabilidade e liquidez
  candidates.sort((a, b) => b.score - a.score);

  // 2. Garantir variedade estrutural através das categorias e itens base
  // Transporters experientes levam espadas, machados, arcos, robes, jaquetas, armaduras,
  // elmos, botas, bolsas, capas e consumíveis em vez de 10 variações da mesma arma.
  const diversePool = [];
  const baseCount = new Map();
  const maxVariantsPerBase = strategy === 'max_diversity' ? 1 : 2;

  for (const c of candidates) {
    const currentCount = baseCount.get(c.baseId) || 0;
    if (currentCount < maxVariantsPerBase) {
      baseCount.set(c.baseId, currentCount + 1);
      diversePool.push(c);
    }
  }

  let remainingBudget = budget;
  let remainingWeight = targetMaxWeightKg;
  const allocatedMap = new Map(); // key = op.id + '_' + op.quality

  // PASSO 1 (Cobertura Ampla): Atribuir 1 unidade para cada item diferente
  for (const item of diversePool) {
    if (allocatedMap.size >= maxItemDiversity) break;
    if (remainingBudget < item.buyPrice || remainingWeight < item.unitWeight) continue;

    const key = `${item.id}_${item.quality}`;
    allocatedMap.set(key, { item, units: 1 });
    remainingBudget -= item.buyPrice;
    remainingWeight -= item.unitWeight;
  }

  // PASSO 2 (Reforço Limitado): Adicionar até maxUnitsPerItem (ex: 2x) para os itens já alocados
  if (maxUnitsPerItem > 1) {
    for (const entry of allocatedMap.values()) {
      const item = entry.item;
      const isStackable = item.category === 'resources' || item.category === 'consumables';
      const capForItem = isStackable ? Math.min(25, maxUnitsPerItem * 5) : maxUnitsPerItem;

      while (entry.units < capForItem && remainingBudget >= item.buyPrice && remainingWeight >= item.unitWeight) {
        entry.units += 1;
        remainingBudget -= item.buyPrice;
        remainingWeight -= item.unitWeight;
      }
    }
  }

  // PASSO 3 (Preenchimento de Saldo): Se ainda sobrar capital, alocar novos itens da lista geral
  if (remainingBudget > 5000 && allocatedMap.size < maxItemDiversity) {
    for (const item of candidates) {
      if (allocatedMap.size >= maxItemDiversity) break;
      const key = `${item.id}_${item.quality}`;
      if (allocatedMap.has(key)) continue;

      if (remainingBudget >= item.buyPrice && remainingWeight >= item.unitWeight) {
        allocatedMap.set(key, { item, units: 1 });
        remainingBudget -= item.buyPrice;
        remainingWeight -= item.unitWeight;
      }
    }
  }

  // PASSO 4 (Fine Tuning para Orçamentos Altos): Caso ainda sobre orçamento substantivo
  if (remainingBudget > (budget * 0.15)) {
    for (const entry of allocatedMap.values()) {
      const item = entry.item;
      const isStackable = item.category === 'resources' || item.category === 'consumables';
      const extraCap = isStackable ? 50 : Math.min(6, maxUnitsPerItem * 2);

      while (entry.units < extraCap && remainingBudget >= item.buyPrice && remainingWeight >= item.unitWeight) {
        entry.units += 1;
        remainingBudget -= item.buyPrice;
        remainingWeight -= item.unitWeight;
      }
    }
  }

  // Montar lista final com totais consolidados
  const recommendedItems = [];
  let totalInvested = 0;
  let totalGrossReturn = 0;
  let totalNetReturn = 0;
  let totalNetProfit = 0;
  let totalWeightUsed = 0;

  for (const { item, units } of allocatedMap.values()) {
    if (units <= 0) continue;

    const investment = units * item.buyPrice;
    const grossReturn = units * item.sellPrice;
    const netReturn = units * item.netSellPrice;
    const netProfit = netReturn - investment;
    const itemTotalWeight = units * item.unitWeight;

    totalInvested += investment;
    totalGrossReturn += grossReturn;
    totalNetReturn += netReturn;
    totalNetProfit += netProfit;
    totalWeightUsed += itemTotalWeight;

    recommendedItems.push({
      ...item,
      recommendedUnits: units,
      totalInvestment: investment,
      totalGrossReturn: grossReturn,
      totalNetReturn: netReturn,
      totalNetProfit: netProfit,
      totalWeightKg: itemTotalWeight
    });
  }

  // Ordenar a lista final por maior retorno e lucro
  recommendedItems.sort((a, b) => b.totalNetProfit - a.totalNetProfit);

  const averageRoiPercent = totalInvested > 0 ? (totalNetProfit / totalInvested) * 100 : 0;
  const weightUtilizationPercent = totalMaxLoadKg > 0 ? (totalWeightUsed / totalMaxLoadKg) * 100 : 0;
  const budgetUtilizationPercent = budget > 0 ? (totalInvested / budget) * 100 : 0;
  const distinctTypesCount = recommendedItems.length;
  const itemsCount = recommendedItems.reduce((acc, i) => acc + i.recommendedUnits, 0);
  const averageUnitsPerType = distinctTypesCount > 0 ? (itemsCount / distinctTypesCount).toFixed(1) : '0';

  const marketSaturationRisk = maxUnitsPerItem <= 2 
    ? 'Mínimo (Giro Imediato no BM)' 
    : maxUnitsPerItem <= 3 
      ? 'Baixo (Venda Rápida)' 
      : 'Moderado (Lotes Maiores)';

  return {
    mount,
    bag,
    totalMaxLoadKg,
    targetMaxWeightKg,
    safetyMarginPercent: effectiveMargin,
    totalWeightUsed,
    remainingWeightCapacity: Math.max(0, totalMaxLoadKg - totalWeightUsed),
    weightUtilizationPercent,
    isOverburdened: totalWeightUsed > totalMaxLoadKg,

    // Métricas Financeiras
    budget,
    totalInvested,
    remainingBudget: Math.max(0, budget - totalInvested),
    budgetUtilizationPercent,
    totalGrossReturn,
    totalNetReturn,
    totalNetProfit,
    averageRoiPercent,

    // Métricas de Variedade e Mercado
    distinctTypesCount,
    itemsCount,
    averageUnitsPerType,
    marketSaturationRisk,
    maxUnitsPerItem,

    // Itens Recomendados
    recommendedItems
  };
}
