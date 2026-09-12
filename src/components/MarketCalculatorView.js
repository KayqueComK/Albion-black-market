// Componente da Aba: Calculadora de Arbitragem Black Market (Lymhurst -> Caerleon)

import { getExpandedItemIdsList, ITEM_CATEGORIES, QUALITIES } from '../data/itemsCatalog.js';
import { fetchLivePrices, getItemIconUrl, formatSilver, formatDataAge, CITIES } from '../services/albionApi.js';
import { calculateArbitrageOpportunities, calculateTaxRate } from '../services/arbitrageCalculator.js';

export function createMarketCalculatorView(container, state, onAddToCart) {
  let opportunities = [];
  let isLoading = false;
  let rawPrices = [];
  let filterText = '';
  let selectedCategory = 'all';
  let selectedTier = 'all';
  let selectedEnch = 'all';
  let sortBy = 'totalProfit'; // 'totalProfit' | 'unitProfit' | 'roi' | 'buyPrice' | 'freshness'
  let projectionStrategy = 'single'; // 'single' | 'basket'

  async function loadData(forceRefresh = false) {
    isLoading = true;
    render();

    try {
      // Obter os itens do catálogo
      const catalog = getExpandedItemIdsList();
      const uniqueItemIds = [...new Set(catalog.map(i => i.fullId))];

      // Buscar preços na API oficial do Albion Data Project
      rawPrices = await fetchLivePrices(uniqueItemIds, state.selectedCity, state.selectedServer.id);
      recalculate();
    } catch (err) {
      console.error('Erro ao buscar cotações do mercado:', err);
    } finally {
      isLoading = false;
      render();
    }
  }

  function recalculate() {
    const catalog = getExpandedItemIdsList();
    opportunities = calculateArbitrageOpportunities(rawPrices, catalog, {
      budget: state.budget,
      hasPremium: state.hasPremium,
      sellMode: state.sellMode,
      originCity: state.selectedCity,
      category: selectedCategory,
      minRoi: 0,
      minProfit: 0,
      maxDataAgeHours: 72
    });

    sortOpportunities();
  }

  function sortOpportunities() {
    opportunities.sort((a, b) => {
      if (sortBy === 'demand') {
        const scoreA = a.demandLevel === 'ultra' ? 3 : a.demandLevel === 'high' ? 2 : 1;
        const scoreB = b.demandLevel === 'ultra' ? 3 : b.demandLevel === 'high' ? 2 : 1;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return b.totalNetProfit - a.totalNetProfit;
      }
      if (sortBy === 'totalProfit') {
        if (a.canAfford && !b.canAfford) return -1;
        if (!a.canAfford && b.canAfford) return 1;
        return b.totalNetProfit - a.totalNetProfit;
      }
      if (sortBy === 'unitProfit') {
        return b.unitProfit - a.unitProfit;
      }
      if (sortBy === 'roi') {
        return b.roiPercent - a.roiPercent;
      }
      if (sortBy === 'buyPrice') {
        return a.buyPrice - b.buyPrice;
      }
      if (sortBy === 'freshness') {
        return a.freshestAgeHours - b.freshestAgeHours;
      }
      return 0;
    });
  }

  function render() {
    const taxPercent = (calculateTaxRate(state.hasPremium, state.sellMode) * 100).toFixed(1);

    // Filtrar por busca de texto
    const filteredOpportunities = opportunities.filter(op => {
      if (selectedTier !== 'all' && op.tier !== Number(selectedTier)) return false;
      if (selectedEnch !== 'all' && op.enchantment !== Number(selectedEnch)) return false;
      if (!filterText) return true;
      const term = filterText.toLowerCase();
      return (
        op.namePt.toLowerCase().includes(term) ||
        op.nameEn.toLowerCase().includes(term) ||
        op.id.toLowerCase().includes(term)
      );
    });

    // Oportunidades lucrativas acessíveis com o saldo do usuário
    const profitableOps = filteredOpportunities.filter(op => op.unitProfit > 0);
    const affordableOps = profitableOps.filter(op => op.canAfford && op.totalNetProfit > 0);
    const bestOp = affordableOps.length > 0 ? affordableOps[0] : null;

    // Calcular Carteira Mista / Diversificada (Cesta de Itens)
    // Distribui o capital em até 3 itens lucrativos distintos para não saturar o Black Market
    const basketCandidates = [];
    const seenBases = new Set();
    for (const op of affordableOps) {
      if (!seenBases.has(op.baseId)) {
        seenBases.add(op.baseId);
        basketCandidates.push(op);
        if (basketCandidates.length >= 3) break;
      }
    }
    if (basketCandidates.length === 0 && affordableOps.length > 0) {
      basketCandidates.push(affordableOps[0]);
    }

    let basketItems = [];
    let basketTotalInvestment = 0;
    let basketTotalGrossReturn = 0;
    let basketTotalNetReturn = 0;
    let basketTotalNetProfit = 0;
    let basketTotalWeightKg = 0;

    if (basketCandidates.length > 0) {
      const budgetPerItem = Math.floor(state.budget / basketCandidates.length);
      for (const item of basketCandidates) {
        const units = Math.floor(budgetPerItem / item.buyPrice);
        if (units > 0) {
          const inv = units * item.buyPrice;
          const grossRet = units * item.sellPrice;
          const netRet = units * item.netSellPrice;
          const netProf = netRet - inv;
          const weight = units * (item.unitWeight || 2.0);
          basketItems.push({
            ...item,
            allocatedUnits: units,
            allocatedInvestment: inv,
            allocatedGrossReturn: grossRet,
            allocatedNetReturn: netRet,
            allocatedNetProfit: netProf,
            allocatedWeightKg: weight
          });
          basketTotalInvestment += inv;
          basketTotalGrossReturn += grossRet;
          basketTotalNetReturn += netRet;
          basketTotalNetProfit += netProf;
          basketTotalWeightKg += weight;
        }
      }
    }

    const basketRoiPercent = basketTotalInvestment > 0 
      ? (basketTotalNetProfit / basketTotalInvestment) * 100 
      : 0;

    // Métricas ativas conforme a estratégia de projeção selecionada
    const isBasket = projectionStrategy === 'basket' && basketItems.length > 0;
    const activeInvestment = isBasket ? basketTotalInvestment : (bestOp ? bestOp.totalInvestment : state.budget);
    const activeGrossReturn = isBasket ? basketTotalGrossReturn : (bestOp ? bestOp.totalGrossReturn : 0);
    const activeNetReturn = isBasket ? basketTotalNetReturn : (bestOp ? bestOp.totalNetReturn : 0);
    const activeNetProfit = isBasket ? basketTotalNetProfit : (bestOp ? bestOp.totalNetProfit : 0);
    const activeRoiPercent = isBasket ? basketRoiPercent : (bestOp ? bestOp.roiPercent : 0);
    const activeTotalWeight = isBasket ? basketTotalWeightKg : (bestOp ? bestOp.totalWeightKg : 0);

    container.innerHTML = `
      <div class="market-dashboard">
        <!-- Barra de Parâmetros de Investimento -->
        <div class="investment-control-panel">
          <div class="panel-header">
            <div class="header-titles">
              <h2 class="panel-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                Parâmetros de Investimento & Margem
              </h2>
              <p class="panel-sub">Defina seu capital disponível para ver a estimativa exata de retorno e quanto de lucro você terá</p>
            </div>
            
            <button class="btn btn-primary" id="btn-refresh-prices" ${isLoading ? 'disabled' : ''}>
              <svg class="${isLoading ? 'spin' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              ${isLoading ? 'Buscando Preços na API...' : 'Atualizar Cotações'}
            </button>
          </div>

          <div class="controls-grid">
            <!-- Saldo para Investir -->
            <div class="control-group budget-group">
              <label class="control-label" for="input-budget">
                Saldo Disponível para Investir (Silver):
              </label>
              <div class="input-with-symbol">
                <span class="currency-symbol">⚔️</span>
                <input 
                  type="number" 
                  id="input-budget" 
                  class="input-field" 
                  value="${state.budget}" 
                  step="50000"
                  min="1000"
                />
              </div>
              <div class="budget-presets">
                <button class="preset-pill ${state.budget === 500_000 ? 'active' : ''}" data-budget="500000">500k</button>
                <button class="preset-pill ${state.budget === 1_000_000 ? 'active' : ''}" data-budget="1000000">1M</button>
                <button class="preset-pill ${state.budget === 2_500_000 ? 'active' : ''}" data-budget="2500000">2.5M</button>
                <button class="preset-pill ${state.budget === 5_000_000 ? 'active' : ''}" data-budget="5000000">5M</button>
                <button class="preset-pill ${state.budget === 10_000_000 ? 'active' : ''}" data-budget="10000000">10M</button>
                <button class="preset-pill ${state.budget === 25_000_000 ? 'active' : ''}" data-budget="25000000">25M</button>
              </div>
            </div>

            <!-- Cidade de Origem & Modo de Venda -->
            <div class="control-group">
              <label class="control-label" for="select-origin-city">Comprar na Cidade:</label>
              <select id="select-origin-city" class="select-field">
                ${CITIES.map(c => `
                  <option value="${c.id}" ${c.id === state.selectedCity ? 'selected' : ''}>
                    ${c.name}
                  </option>
                `).join('')}
              </select>

              <label class="control-label mt-2" for="select-sell-mode">Modo de Venda no Black Market:</label>
              <select id="select-sell-mode" class="select-field">
                <option value="instant" ${state.sellMode === 'instant' ? 'selected' : ''}>
                  Venda Imediata (Buy Order) - Sem espera
                </option>
                <option value="order" ${state.sellMode === 'order' ? 'selected' : ''}>
                  Ordem de Venda (Sell Order) - Maior lucro
                </option>
              </select>
            </div>

            <!-- Status Premium & Resumo de Taxa -->
            <div class="control-group tax-info-card">
              <div class="toggle-premium-box">
                <label class="checkbox-container">
                  <input type="checkbox" id="check-premium" ${state.hasPremium ? 'checked' : ''} />
                  <span class="checkmark"></span>
                  <span class="checkbox-label">Status Premium Ativo no Personagem</span>
                </label>
              </div>

              <div class="tax-summary-box">
                <div class="tax-row">
                  <span>Taxa Aplicada no BM:</span>
                  <strong class="highlight-gold">${taxPercent}%</strong>
                </div>
                <div class="tax-details">
                  ${state.sellMode === 'instant' 
                    ? `(4% imposto com premium / 8% sem premium. Sem taxa de montagem)` 
                    : `(4% imposto + 2.5% montagem de ordem com premium)`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estimativa Consolidada de Retorno e Lucro pelo Total Investido -->
        <div class="investment-projection-card">
          <div class="projection-header">
            <div class="projection-titles">
              <div class="projection-badge-row">
                <span class="badge-tag">PROJEÇÃO FINANCEIRA DO SEU CAPITAL</span>
                <span class="badge-city">${state.selectedCity} ➔ Black Market (Caerleon)</span>
              </div>
              <h3 class="projection-main-title">
                Estimativa para ${formatSilver(state.budget)} Prata Investidos
              </h3>
              <p class="projection-sub">
                Veja o total investido, o retorno bruto, retorno líquido já descontada a taxa do BM (${taxPercent}%) e o lucro limpo no seu bolso.
              </p>
            </div>

            <div class="projection-strategy-toggle">
              <button 
                class="strategy-tab-btn ${projectionStrategy === 'single' ? 'active' : ''}" 
                id="tab-strat-single"
                title="Focar todo o capital no item que dá o maior lucro líquido total"
              >
                🎯 Foco Máximo (${bestOp ? bestOp.namePt.slice(0, 16) : 'Melhor Item'})
              </button>
              <button 
                class="strategy-tab-btn ${projectionStrategy === 'basket' ? 'active' : ''}" 
                id="tab-strat-basket"
                title="Dividir o capital entre até 3 itens lucrativos para reduzir risco de saturação no Black Market"
              >
                🛡️ Carga Diversificada (${basketItems.length} tipos)
              </button>
            </div>
          </div>

          <div class="projection-metrics-grid">
            <div class="proj-metric-item">
              <span class="proj-metric-label">Total Investido (Compra)</span>
              <div class="proj-metric-val text-silver">
                ${formatSilver(activeInvestment)}
              </div>
              <span class="proj-metric-desc">
                ${isBasket 
                  ? `Distribuído em ${basketItems.reduce((acc, i) => acc + i.allocatedUnits, 0)} unidades de ${basketItems.length} tipos` 
                  : (bestOp ? `Comprando ${bestOp.maxUnits}x em ${state.selectedCity}` : 'Defina seu saldo')}
              </span>
            </div>

            <div class="proj-metric-item">
              <span class="proj-metric-label">Retorno Bruto em Caerleon</span>
              <div class="proj-metric-val text-gold">
                ${formatSilver(activeGrossReturn)}
              </div>
              <span class="proj-metric-desc">Valor total das vendas brutas no Black Market</span>
            </div>

            <div class="proj-metric-item">
              <span class="proj-metric-label">Retorno Líquido na Conta</span>
              <div class="proj-metric-val text-gold">
                ${formatSilver(activeNetReturn)}
              </div>
              <span class="proj-metric-desc">Já deduzida a taxa de ${taxPercent}% do BM</span>
            </div>

            <div class="proj-metric-item highlight-profit-box">
              <span class="proj-metric-label">LUCRO LÍQUIDO NO BOLSO</span>
              <div class="proj-metric-val text-emerald">
                +${formatSilver(activeNetProfit)}
              </div>
              <span class="proj-metric-desc badge-roi-highlight">
                +${activeRoiPercent.toFixed(1)}% de Retorno Líquido (ROI)
              </span>
            </div>
          </div>

          ${bestOp ? `
            <div class="projection-strategy-details">
              ${!isBasket ? `
                <div class="single-strategy-callout">
                  <div class="callout-item-preview">
                    <img class="callout-thumb" src="${getItemIconUrl(bestOp.id, bestOp.quality)}" alt="${bestOp.namePt}" />
                    <div class="callout-info">
                      <div class="callout-item-title">
                        <strong>${bestOp.namePt}</strong>
                        <span class="tier-badge">T${bestOp.tier}${bestOp.enchantment > 0 ? '.' + bestOp.enchantment : ''}</span>
                      </div>
                      <div class="callout-breakdown">
                        <span>Investimento: <strong>${formatSilver(bestOp.totalInvestment)}</strong> (${bestOp.maxUnits}x a ${formatSilver(bestOp.buyPrice)})</span>
                        <span class="dot-sep">•</span>
                        <span>Retorno BM: <strong>${formatSilver(bestOp.totalNetReturn)}</strong></span>
                        <span class="dot-sep">•</span>
                        <span>Lucro Limpo: <strong class="text-emerald">+${formatSilver(bestOp.totalNetProfit)}</strong> (+${bestOp.roiPercent.toFixed(1)}%)</span>
                        <span class="dot-sep">•</span>
                        <span>Peso Total: <strong>${bestOp.totalWeightKg.toFixed(1)} kg</strong></span>
                      </div>
                    </div>
                  </div>
                  <div class="callout-action-btns">
                    <button class="btn btn-primary btn-sm" id="btn-load-best-single">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                      Carregar no Carrinho (${bestOp.maxUnits}x)
                    </button>
                    <button class="btn btn-secondary btn-sm btn-copy-name" data-copy="${bestOp.namePt}">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      Copiar Nome
                    </button>
                  </div>
                </div>
              ` : `
                <div class="basket-strategy-callout">
                  <div class="basket-items-list">
                    ${basketItems.map(bItem => `
                      <div class="basket-item-chip">
                        <img class="chip-thumb" src="${getItemIconUrl(bItem.id, bItem.quality)}" alt="${bItem.namePt}" />
                        <div class="chip-info">
                          <span class="chip-name"><strong>${bItem.allocatedUnits}x</strong> ${bItem.namePt}</span>
                          <span class="chip-meta">Investe: ${formatSilver(bItem.allocatedInvestment)} ➔ Lucro: <strong class="text-emerald">+${formatSilver(bItem.allocatedNetProfit)}</strong> (+${bItem.roiPercent.toFixed(1)}%)</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                  <div class="basket-action-btns">
                    <button class="btn btn-primary btn-sm" id="btn-load-diversified-basket">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                      Carregar Cesta Completa (${basketItems.length} tipos)
                    </button>
                  </div>
                </div>
              `}
            </div>
          ` : `
            <div class="projection-empty-notice">
              <span>💡 Ajuste seu saldo de investimento ou clique em "Atualizar Cotações" para calcular a melhor estimativa de retorno e lucro.</span>
            </div>
          `}
        </div>

        <!-- Filtros Rápidos & Busca -->
        <div class="market-filters-bar">
          <div class="search-input-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              id="filter-search" 
              class="input-search" 
              placeholder="Buscar item (ex: Bolsa, Espada, Jaqueta, T4, T5...)" 
              value="${filterText}"
            />
          </div>

          <!-- Filtro de Categoria -->
          <div class="category-pills-row">
            ${ITEM_CATEGORIES.map(cat => `
              <button class="filter-pill ${selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                ${cat.name}
              </button>
            `).join('')}
          </div>

          <!-- Filtros de Tier e Ordenação -->
          <div class="filters-aux-row">
            <div class="select-inline">
              <label>Tier:</label>
              <select id="select-tier" class="select-small">
                <option value="all" ${selectedTier === 'all' ? 'selected' : ''}>Todos os Tiers</option>
                <option value="4" ${selectedTier === '4' ? 'selected' : ''}>Tier 4</option>
                <option value="5" ${selectedTier === '5' ? 'selected' : ''}>Tier 5</option>
                <option value="6" ${selectedTier === '6' ? 'selected' : ''}>Tier 6</option>
                <option value="7" ${selectedTier === '7' ? 'selected' : ''}>Tier 7</option>
                <option value="8" ${selectedTier === '8' ? 'selected' : ''}>Tier 8</option>
              </select>
            </div>

            <div class="select-inline">
              <label>Encantamento:</label>
              <select id="select-ench" class="select-small">
                <option value="all" ${selectedEnch === 'all' ? 'selected' : ''}>Todos</option>
                <option value="0" ${selectedEnch === '0' ? 'selected' : ''}>.0 Comum</option>
                <option value="1" ${selectedEnch === '1' ? 'selected' : ''}>.1 Incomum</option>
                <option value="2" ${selectedEnch === '2' ? 'selected' : ''}>.2 Raro</option>
                <option value="3" ${selectedEnch === '3' ? 'selected' : ''}>.3 Excepcional</option>
              </select>
            </div>

            <div class="select-inline">
              <label>Ordenar Por:</label>
              <select id="select-sort" class="select-small">
                <option value="demand" ${sortBy === 'demand' ? 'selected' : ''}>🔥 Alta Demanda / Giro Rápido</option>
                <option value="totalProfit" ${sortBy === 'totalProfit' ? 'selected' : ''}>Maior Lucro com Orçamento</option>
                <option value="unitProfit" ${sortBy === 'unitProfit' ? 'selected' : ''}>Maior Lucro por Unidade</option>
                <option value="roi" ${sortBy === 'roi' ? 'selected' : ''}>Maior Retorno (% ROI)</option>
                <option value="buyPrice" ${sortBy === 'buyPrice' ? 'selected' : ''}>Menor Preço de Compra</option>
                <option value="freshness" ${sortBy === 'freshness' ? 'selected' : ''}>Preço Mais Recente</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tabela de Oportunidades de Arbitragem -->
        <div class="table-container">
          ${isLoading ? `
            <div class="loading-state">
              <div class="spinner-large"></div>
              <h3>Consultando APIs do Albion Data Project em tempo real...</h3>
              <p>Analisando centenas de ordens em ${state.selectedCity} e em Caerleon...</p>
            </div>
          ` : filteredOpportunities.length === 0 ? `
            <div class="empty-state">
              <h3>Nenhuma oportunidade lucrativa encontrada com os filtros atuais</h3>
              <p>Tente aumentar o orçamento, selecionar 'Todas as Categorias', alternar o modo de venda ou clicar em "Atualizar Cotações".</p>
            </div>
          ` : `
            <table class="arbitrage-table">
              <thead>
                <tr>
                  <th>Item / Qualidade</th>
                  <th>Compra (${state.selectedCity})</th>
                  <th>Venda em Caerleon</th>
                  <th>Lucro Líquido Unit.</th>
                  <th>Retorno (% ROI)</th>
                  <th class="col-budget">Com Seu Orçamento (${formatSilver(state.budget)})</th>
                  <th>Idade do Preço</th>
                  <th class="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                ${filteredOpportunities.map((op, idx) => {
                  const qualityObj = QUALITIES.find(q => q.id === op.quality) || QUALITIES[0];
                  const iconUrl = getItemIconUrl(op.id, op.quality);

                  return `
                    <tr class="item-row ${op.unitProfit > 0 ? 'profitable' : 'unprofitable'}">
                      <td class="cell-item">
                        <img class="item-thumb" src="${iconUrl}" alt="${op.namePt}" loading="lazy" />
                        <div class="item-info">
                          <span class="item-name">${op.namePt}</span>
                          <div class="item-badges">
                            <span class="tier-badge">T${op.tier}${op.enchantment > 0 ? '.' + op.enchantment : ''}</span>
                            <span class="quality-badge" style="color: ${qualityObj.color}; border-color: ${qualityObj.color}44">
                              ${qualityObj.name}
                            </span>
                            ${op.demandLevel === 'ultra' ? `
                              <span class="demand-pill ultra" title="${op.demandReason}">⚡ Giro Imediato</span>
                            ` : op.demandLevel === 'high' ? `
                              <span class="demand-pill high" title="${op.demandReason}">🔥 Alta Demanda</span>
                            ` : ''}
                            <span class="dest-market-tag ${op.targetMarket || 'black_market'}">
                              ${op.targetMarketBadge || '🏴 Black Market'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td class="cell-price buy-price">
                        <span class="price-val">${formatSilver(op.buyPrice)}</span>
                        <span class="price-sub">unitário</span>
                      </td>

                      <td class="cell-price sell-price">
                        <span class="price-val">${formatSilver(op.sellPrice)}</span>
                        <span class="price-sub">Líq: ${formatSilver(op.netSellPrice)}</span>
                      </td>

                      <td class="cell-profit">
                        <span class="profit-val ${op.unitProfit > 0 ? 'positive' : 'negative'}">
                          ${op.unitProfit > 0 ? '+' : ''}${formatSilver(op.unitProfit)}
                        </span>
                      </td>

                      <td class="cell-roi">
                        <span class="roi-val ${op.roiPercent >= 30 ? 'high-roi' : op.roiPercent > 0 ? 'positive-roi' : 'negative-roi'}">
                          ${op.roiPercent.toFixed(1)}%
                        </span>
                      </td>

                      <td class="cell-budget-calc">
                        ${op.canAfford ? `
                          <div class="budget-calc-box">
                            <div class="calc-row-top">
                              <span class="units-pill">Compre <strong>${op.maxUnits}x</strong></span>
                              <span class="calc-investment">Investe: <strong>${formatSilver(op.totalInvestment)}</strong></span>
                            </div>
                            <div class="calc-row-return">
                              <span class="calc-label">Retorno Líquido:</span>
                              <strong class="text-gold">${formatSilver(op.totalNetReturn)}</strong>
                            </div>
                            <div class="calc-row-profit">
                              <span class="calc-label">Lucro Líquido:</span>
                              <strong class="profit-highlight">+${formatSilver(op.totalNetProfit)}</strong>
                              <span class="roi-mini">(+${op.roiPercent.toFixed(1)}%)</span>
                            </div>
                            <div class="calc-weight-mini">
                              <span>⚖️ Peso: ${op.totalWeightKg.toFixed(1)} kg</span>
                            </div>
                          </div>
                        ` : `
                          <div class="budget-calc-insufficient">
                            <span class="badge-insufficient">Saldo Insuficiente</span>
                            <span class="insufficient-desc">Item custa ${formatSilver(op.buyPrice)}</span>
                          </div>
                        `}
                      </td>

                      <td class="cell-age">
                        <span class="age-badge ${op.freshestAgeHours <= 2 ? 'fresh' : op.freshestAgeHours <= 12 ? 'medium' : 'old'}">
                          ${formatDataAge(op.bmDate)}
                        </span>
                      </td>

                      <td class="cell-actions text-right">
                        <button class="btn-icon btn-copy-name" data-copy="${op.namePt}" title="Copiar Nome do Item para colar no jogo">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </button>
                        <button class="btn-add-cart" data-idx="${idx}" title="Adicionar ao Carrinho de Transporte">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                          + Carga
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `;

    attachEvents(filteredOpportunities, bestOp, basketItems, basketTotalNetProfit);
  }

  function attachEvents(currentOpportunities, bestOp, basketItems, basketTotalNetProfit) {
    // Atualizar Cotações
    const btnRefresh = document.getElementById('btn-refresh-prices');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => loadData(true));
    }

    // Alternar Estratégia de Projeção (Single vs Basket)
    const btnStratSingle = document.getElementById('tab-strat-single');
    if (btnStratSingle) {
      btnStratSingle.addEventListener('click', () => {
        projectionStrategy = 'single';
        render();
      });
    }

    const btnStratBasket = document.getElementById('tab-strat-basket');
    if (btnStratBasket) {
      btnStratBasket.addEventListener('click', () => {
        projectionStrategy = 'basket';
        render();
      });
    }

    // Carregar Melhor Item Único no Carrinho
    const btnLoadBestSingle = document.getElementById('btn-load-best-single');
    if (btnLoadBestSingle && bestOp) {
      btnLoadBestSingle.addEventListener('click', () => {
        if (onAddToCart) {
          onAddToCart(bestOp, bestOp.maxUnits);
          showToast(`Carregado no Carrinho: ${bestOp.maxUnits}x ${bestOp.namePt} (Lucro estimado: +${formatSilver(bestOp.totalNetProfit)})`);
        }
      });
    }

    // Carregar Cesta Diversificada no Carrinho
    const btnLoadBasket = document.getElementById('btn-load-diversified-basket');
    if (btnLoadBasket && basketItems && basketItems.length > 0) {
      btnLoadBasket.addEventListener('click', () => {
        if (onAddToCart) {
          for (const item of basketItems) {
            onAddToCart(item, item.allocatedUnits);
          }
          showToast(`Cesta carregada no Carrinho! Lucro total estimado: +${formatSilver(basketTotalNetProfit)}`);
        }
      });
    }

    // Input de Orçamento
    const inputBudget = document.getElementById('input-budget');
    if (inputBudget) {
      inputBudget.addEventListener('change', (e) => {
        const val = Number(e.target.value);
        if (!isNaN(val) && val >= 0) {
          state.budget = val;
          recalculate();
          render();
        }
      });
    }

    // Pílulas de Presets de Orçamento
    document.querySelectorAll('.preset-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = Number(pill.getAttribute('data-budget'));
        state.budget = val;
        recalculate();
        render();
      });
    });

    // Seletor de Cidade de Origem
    const selectCity = document.getElementById('select-origin-city');
    if (selectCity) {
      selectCity.addEventListener('change', (e) => {
        state.selectedCity = e.target.value;
        loadData(true);
      });
    }

    // Seletor de Modo de Venda
    const selectSellMode = document.getElementById('select-sell-mode');
    if (selectSellMode) {
      selectSellMode.addEventListener('change', (e) => {
        state.sellMode = e.target.value;
        recalculate();
        render();
      });
    }

    // Checkbox Premium
    const checkPremium = document.getElementById('check-premium');
    if (checkPremium) {
      checkPremium.addEventListener('change', (e) => {
        state.hasPremium = e.target.checked;
        recalculate();
        render();
      });
    }

    // Busca de texto
    const searchInput = document.getElementById('filter-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterText = e.target.value;
        render();
      });
    }

    // Filtro de Categoria
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        selectedCategory = pill.getAttribute('data-cat');
        recalculate();
        render();
      });
    });

    // Filtro de Tier
    const selectTier = document.getElementById('select-tier');
    if (selectTier) {
      selectTier.addEventListener('change', (e) => {
        selectedTier = e.target.value;
        render();
      });
    }

    // Filtro de Encantamento
    const selectEnch = document.getElementById('select-ench');
    if (selectEnch) {
      selectEnch.addEventListener('change', (e) => {
        selectedEnch = e.target.value;
        render();
      });
    }

    // Ordenação
    const selectSort = document.getElementById('select-sort');
    if (selectSort) {
      selectSort.addEventListener('change', (e) => {
        sortBy = e.target.value;
        sortOpportunities();
        render();
      });
    }

    // Copiar Nome do Item
    document.querySelectorAll('.btn-copy-name').forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy');
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copiado para a área de transferência: "${textToCopy}"`);
        });
      });
    });

    // Adicionar ao Carrinho de Transporte (1 unidade da linha)
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        const op = currentOpportunities[idx];
        if (op && onAddToCart) {
          onAddToCart(op, 1);
          showToast(`+1 un. de ${op.namePt} adicionada ao Carrinho!`);
        }
      });
    });
  }

  function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
  }

  // Carregamento inicial
  loadData();

  return {
    reload: () => loadData(true)
  };
}
