// Motor de cálculo de arbitragem entre Lymhurst e Black Market de Caerleon

/**
 * Calcula as taxas do mercado do Albion Online
 * @param {boolean} hasPremium - Jogador possui status Premium ativo
 * @param {'instant' | 'order'} sellMode - Venda Imediata para Buy Order ou Colocação de Sell Order
 * @returns {number} Taxa em decimal (ex: 0.04 = 4%)
 */
export function calculateTaxRate(hasPremium = true, sellMode = 'instant') {
  // Imposto sobre transação: 4% com premium, 8% sem premium
  const transactionTax = hasPremium ? 0.04 : 0.08;
  // Taxa de montagem de ordem (setup fee): 2.5% (apenas se for ordem de venda)
  const setupFee = sellMode === 'order' ? 0.025 : 0.0;
  return transactionTax + setupFee;
}

/**
 * Processa os dados brutos da API e catálogo para encontrar oportunidades de lucro
 * @param {Array} rawPriceData - Dados retornados pela API do Albion
 * @param {Array} catalogItems - Lista de itens expandidos do catálogo
 * @param {Object} options - Parâmetros do usuário (orçamento, premium, filtros)
 * @returns {Array} Lista de oportunidades ordenadas e calculadas
 */
export function calculateArbitrageOpportunities(rawPriceData, catalogItems, options = {}) {
  const {
    budget = 1_000_000,
    hasPremium = true,
    sellMode = 'instant', // 'instant' (buy_price_max) ou 'order' (sell_price_min)
    originCity = 'Lymhurst',
    minRoi = 0,
    minProfit = 0,
    maxDataAgeHours = 72,
    category = 'all',
    onlyHighDemand = false,
    minTier = 4,
    maxTier = 8
  } = options;

  const taxRate = calculateTaxRate(hasPremium, sellMode);

  // Mapear preços da cidade de origem, Black Market e Caerleon Royal Market
  // Chave: `${item_id}_${quality}`
  const originPrices = new Map();
  const bmPrices = new Map();
  const caerleonPrices = new Map();

  for (const row of rawPriceData) {
    const key = `${row.item_id}_${row.quality}`;
    const cityLower = (row.city || '').toLowerCase();
    if (cityLower === originCity.toLowerCase()) {
      originPrices.set(key, row);
    } else if (cityLower === 'black market') {
      bmPrices.set(key, row);
    } else if (cityLower === 'caerleon') {
      caerleonPrices.set(key, row);
    }
  }

  const opportunities = [];

  for (const item of catalogItems) {
    // Filtros de categoria e tier
    if (category === 'high_demand') {
      if (item.demandLevel !== 'ultra' && item.demandLevel !== 'high') continue;
    } else if (category !== 'all' && item.category !== category) {
      continue;
    }

    if (onlyHighDemand && item.demandLevel !== 'ultra' && item.demandLevel !== 'high') {
      continue;
    }

    if (item.tier < minTier || item.tier > maxTier) continue;

    // Testar as qualidades (1 a 5)
    for (let quality = 1; quality <= 5; quality++) {
      const key = `${item.fullId}_${quality}`;
      const originData = originPrices.get(key);
      const bmData = bmPrices.get(key);
      const caerleonData = caerleonPrices.get(key);

      if (!originData) continue;

      // Preço de compra na cidade de origem: menor preço de venda disponível
      const buyPrice = originData.sell_price_min;
      if (!buyPrice || buyPrice <= 0) continue;

      // Determinar o melhor mercado de destino entre Black Market e Caerleon Royal Market
      let targetMarket = null;
      let sellPrice = 0;
      let targetDate = null;

      const bmSellPrice = sellMode === 'instant' ? (bmData?.buy_price_max || 0) : (bmData?.sell_price_min || 0);
      const caerleonSellPrice = sellMode === 'instant' ? (caerleonData?.buy_price_max || 0) : (caerleonData?.sell_price_min || 0);

      if (bmSellPrice > 0 && caerleonSellPrice > 0) {
        if (bmSellPrice >= caerleonSellPrice) {
          targetMarket = 'black_market';
          sellPrice = bmSellPrice;
          targetDate = sellMode === 'instant' ? bmData.buy_price_max_date : bmData.sell_price_min_date;
        } else {
          targetMarket = 'caerleon';
          sellPrice = caerleonSellPrice;
          targetDate = sellMode === 'instant' ? caerleonData.buy_price_max_date : caerleonData.sell_price_min_date;
        }
      } else if (bmSellPrice > 0) {
        targetMarket = 'black_market';
        sellPrice = bmSellPrice;
        targetDate = sellMode === 'instant' ? bmData.buy_price_max_date : bmData.sell_price_min_date;
      } else if (caerleonSellPrice > 0) {
        targetMarket = 'caerleon';
        sellPrice = caerleonSellPrice;
        targetDate = sellMode === 'instant' ? caerleonData.buy_price_max_date : caerleonData.sell_price_min_date;
      }

      if (!targetMarket || sellPrice <= 0) continue;

      // Verificar idade do dado (em horas)
      const originDate = originData.sell_price_min_date;
      const targetAgeHours = getAgeInHours(targetDate);
      const originAgeHours = getAgeInHours(originDate);

      if (targetAgeHours > maxDataAgeHours || originAgeHours > maxDataAgeHours) {
        continue;
      }

      // Cálculos financeiros por unidade
      const netSellPrice = sellPrice * (1 - taxRate);
      const unitProfit = netSellPrice - buyPrice;
      const roiPercent = (unitProfit / buyPrice) * 100;

      // Filtro de rentabilidade
      if (unitProfit < minProfit || roiPercent < minRoi) continue;

      // Cálculo com base no orçamento do usuário
      const canAfford = budget >= buyPrice;
      const maxUnits = canAfford ? Math.floor(budget / buyPrice) : 0;
      const totalInvestment = maxUnits * buyPrice;
      const totalGrossReturn = maxUnits * sellPrice;
      const totalNetReturn = maxUnits * netSellPrice;
      const totalNetProfit = maxUnits * unitProfit;
      const totalWeightKg = maxUnits * (item.weight || 2.0);

      const targetMarketName = targetMarket === 'black_market' ? 'Black Market' : 'Caerleon (Mercado Real)';
      const targetMarketBadge = targetMarket === 'black_market' ? '🏴 Black Market' : '🏛️ Caerleon Real';

      opportunities.push({
        id: item.fullId,
        baseId: item.baseId,
        tier: item.tier,
        enchantment: item.enchantment,
        quality,
        namePt: item.namePt,
        nameEn: item.nameEn,
        category: item.category,
        unitWeight: item.weight,
        demandLevel: item.demandLevel || 'normal',
        demandReason: item.demandReason || '',
        isHighDemand: item.demandLevel === 'ultra' || item.demandLevel === 'high',

        // Destino
        targetMarket,
        targetMarketName,
        targetMarketBadge,

        // Preços
        buyPrice,
        sellPrice,
        sellMode,
        taxRate,
        taxAmount: sellPrice * taxRate,
        netSellPrice,
        unitProfit,
        roiPercent,

        // Cálculos com Orçamento
        canAfford,
        maxUnits,
        totalInvestment,
        totalGrossReturn,
        totalNetReturn,
        totalNetProfit,
        totalWeightKg,

        // Metadados de data
        originDate,
        targetDate,
        originAgeHours,
        targetAgeHours,
        freshestAgeHours: Math.max(originAgeHours, targetAgeHours)
      });
    }
  }

  // Ordenar por maior lucro total possível com o orçamento, ou maior lucro unitário
  opportunities.sort((a, b) => {
    if (a.canAfford && !b.canAfford) return -1;
    if (!a.canAfford && b.canAfford) return 1;
    if (a.totalNetProfit !== b.totalNetProfit) {
      return b.totalNetProfit - a.totalNetProfit;
    }
    return b.roiPercent - a.roiPercent;
  });

  return opportunities;
}

function getAgeInHours(dateString) {
  if (!dateString || dateString.startsWith('0001')) return 999;
  const date = new Date(dateString + 'Z');
  return (Date.now() - date.getTime()) / (1000 * 60 * 60);
}
