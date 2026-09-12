// Motor de Otimização de Carga Máxima para Contrabandistas de Caerleon
// Resolve o problema de otimização (Bounded Multidimensional Knapsack)
// Restrições: Orçamento de Prata (Silver) & Capacidade de Peso (Montaria + Bolsa)
// Objetivo: Maximizar o Lucro Líquido Real no Black Market

import { TRANSPORT_MOUNTS, BAGS_CATALOG } from '../data/itemsCatalog.js';

/**
 * Executa a otimização de carga baseada nas cotações e equipamentos do jogador
 * @param {Array} opportunities - Lista de oportunidades calculadas com unitProfit > 0
 * @param {Object} config - Configurações do usuário
 * @returns {Object} Plano de compra otimizado e métricas completas
 */
export function optimizeCargoLoadout(opportunities, config = {}) {
  const {
    budget = 1_000_000,
    mountId = 'armored_horse_t5',
    bagId = 'bag_t5',
    safetyMarginPercent = 0.05, // 5% de margem de folga para não correr risco de lentidão
    maxItemDiversity = 8,       // Máximo de itens diferentes para manter a compra ágil
    strategy = 'balanced',      // 'balanced' | 'fast_sale' | 'max_profit' | 'high_mobility'
    onlyHighDemand = false
  } = config;

  const mount = TRANSPORT_MOUNTS.find(m => m.id === mountId) || TRANSPORT_MOUNTS[0];
  const bag = BAGS_CATALOG.find(b => b.id === bagId) || BAGS_CATALOG[0];

  const totalMaxLoadKg = mount.maxLoadKg + bag.bonusKg;
  const effectiveMargin = strategy === 'high_mobility' ? 0.15 : safetyMarginPercent;
  const targetMaxWeightKg = totalMaxLoadKg * (1 - effectiveMargin);

  // Filtrar itens lucrativos e válidos
  const candidates = opportunities
    .filter(op => {
      if (onlyHighDemand && !op.isHighDemand) return false;
      return op.unitProfit > 0 && op.buyPrice > 0 && op.buyPrice <= budget && (op.unitWeight || 2.0) <= targetMaxWeightKg;
    })
    .map(op => {
      const weight = op.unitWeight || 2.0;
      const profitPerKg = op.unitProfit / weight;
      const roi = op.roiPercent;

      // Score adaptativo:
      // Se a montaria tem pouca carga (ex: cavalo/cervo), valoriza mais o lucro por kg
      // Se a montaria tem carga gigante (ex: boi), valoriza mais o retorno sobre o capital (ROI)
      const weightFactor = totalMaxLoadKg < 1000 ? 0.7 : 0.4;
      const baseScore = (roi * (1 - weightFactor)) + (profitPerKg * weightFactor);

      // Multiplicador de Demanda e Liquidez (Giro Rápido no BM e Caerleon)
      let demandMultiplier = 1.0;
      if (op.demandLevel === 'ultra') {
        demandMultiplier = strategy === 'fast_sale' ? 3.0 : 1.35;
      } else if (op.demandLevel === 'high') {
        demandMultiplier = strategy === 'fast_sale' ? 1.8 : 1.15;
      } else {
        demandMultiplier = strategy === 'fast_sale' ? 0.3 : 0.95;
      }

      const score = baseScore * demandMultiplier;

      return {
        ...op,
        unitWeight: weight,
        profitPerKg,
        score
      };
    });

  // Ordenar por maior eficiência e liquidez
  candidates.sort((a, b) => b.score - a.score);

  // Alocador Guloso com Restrição Dupla (Knapsack Bounded)
  let remainingBudget = budget;
  let remainingWeight = targetMaxWeightKg;
  const allocatedMap = new Map(); // key = op.id + '_' + op.quality

  // Passo 1: Distribuir unidades prioritárias
  for (const item of candidates) {
    if (allocatedMap.size >= maxItemDiversity) break;
    if (remainingBudget < item.buyPrice || remainingWeight < item.unitWeight) continue;

    // Limite de unidades por item:
    // Itens de stack leve (recursos, consumíveis) têm cap maior (150 a 300 un)
    // Equipamentos pesados têm cap menor (15 a 40 un) para não saturar o Black Market
    const isStackable = item.category === 'resources' || item.category === 'consumables';
    const baseCap = isStackable ? 250 : (strategy === 'max_profit' ? 60 : 25);

    // Calcular quantas unidades cabem nas duas restrições simultaneamente
    const maxByBudget = Math.floor(remainingBudget / item.buyPrice);
    const maxByWeight = Math.floor(remainingWeight / item.unitWeight);
    const possibleUnits = Math.min(maxByBudget, maxByWeight, baseCap);

    if (possibleUnits > 0) {
      allocatedMap.set(`${item.id}_${item.quality}`, {
        item,
        units: possibleUnits
      });
      remainingBudget -= possibleUnits * item.buyPrice;
      remainingWeight -= possibleUnits * item.unitWeight;
    }
  }

  // Passo 2: Preenchimento de sobra (fine-tuning) com qualquer item já alocado ou novo item leve
  for (const item of candidates) {
    if (remainingBudget < item.buyPrice || remainingWeight < item.unitWeight) continue;

    const key = `${item.id}_${item.quality}`;
    const current = allocatedMap.get(key);
    const currentUnits = current ? current.units : 0;
    const isStackable = item.category === 'resources' || item.category === 'consumables';
    const maxCap = isStackable ? 500 : (strategy === 'max_profit' ? 100 : 50);
    const canAddByLimit = Math.max(0, maxCap - currentUnits);

    const maxByBudget = Math.floor(remainingBudget / item.buyPrice);
    const maxByWeight = Math.floor(remainingWeight / item.unitWeight);
    const addUnits = Math.min(maxByBudget, maxByWeight, canAddByLimit);

    if (addUnits > 0) {
      if (current) {
        current.units += addUnits;
      } else if (allocatedMap.size < maxItemDiversity) {
        allocatedMap.set(key, { item, units: addUnits });
      } else {
        continue;
      }
      remainingBudget -= addUnits * item.buyPrice;
      remainingWeight -= addUnits * item.unitWeight;
    }
  }

  // Montar o plano de compras e calcular os totais
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

  // Ordenar a lista final por maior lucro gerado
  recommendedItems.sort((a, b) => b.totalNetProfit - a.totalNetProfit);

  const averageRoiPercent = totalInvested > 0 ? (totalNetProfit / totalInvested) * 100 : 0;
  const weightUtilizationPercent = totalMaxLoadKg > 0 ? (totalWeightUsed / totalMaxLoadKg) * 100 : 0;
  const budgetUtilizationPercent = budget > 0 ? (totalInvested / budget) * 100 : 0;

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

    // Itens Recomendados
    recommendedItems,
    itemsCount: recommendedItems.reduce((acc, i) => acc + i.recommendedUnits, 0),
    distinctTypesCount: recommendedItems.length
  };
}
