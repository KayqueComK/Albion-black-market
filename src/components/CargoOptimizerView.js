// Componente da Aba: Estimativa & Otimizador de Carga por Bolsa e Montaria
// Calcula a combinação exata de itens e quantidades para o maior lucro líquido possível
// respeitando estritamente o orçamento e o peso máximo (Montaria + Bolsa)
// Inclui suporte a itens de coleta, recursos refinados, consumíveis e sugestões de alta demanda

import { 
  getExpandedItemIdsList, 
  TRANSPORT_MOUNTS, 
  BAGS_CATALOG, 
  QUALITIES, 
  ITEM_CATEGORIES, 
  HIGH_DEMAND_RECOMMENDATIONS 
} from '../data/itemsCatalog.js';
import { fetchLivePrices, getItemIconUrl, formatSilver, formatDataAge, CITIES } from '../services/albionApi.js';
import { calculateArbitrageOpportunities, calculateTaxRate } from '../services/arbitrageCalculator.js';
import { optimizeCargoLoadout } from '../services/cargoOptimizer.js';

export function createCargoOptimizerView(container, state, onAddToCart) {
  let rawPrices = [];
  let isLoading = false;
  let selectedMountId = state.selectedMountId || 'armored_horse_t5';
  let selectedBagId = state.selectedBagId || 'bag_t5';
  let optimizationStrategy = 'fast_sale'; // 'fast_sale' (default) | 'balanced' | 'max_profit' | 'high_mobility'
  let selectedCategory = 'all';
  let onlyHighDemand = false;

  async function loadData(forceRefresh = false) {
    isLoading = true;
    render();

    try {
      const catalog = getExpandedItemIdsList();
      const uniqueItemIds = [...new Set(catalog.map(i => i.fullId))];
      rawPrices = await fetchLivePrices(uniqueItemIds, state.selectedCity, state.selectedServer.id);
    } catch (err) {
      console.error('Erro ao buscar cotações para o otimizador:', err);
    } finally {
      isLoading = false;
      render();
    }
  }

  function render() {
    const taxPercent = (calculateTaxRate(state.hasPremium, state.sellMode) * 100).toFixed(1);
    const catalog = getExpandedItemIdsList();

    // 1. Calcular oportunidades brutas com base nos preços atuais
    const opportunities = calculateArbitrageOpportunities(rawPrices, catalog, {
      budget: state.budget,
      hasPremium: state.hasPremium,
      sellMode: state.sellMode,
      originCity: state.selectedCity,
      category: selectedCategory,
      onlyHighDemand: onlyHighDemand,
      minRoi: 0,
      minProfit: 0,
      maxDataAgeHours: 72
    });

    // 2. Executar o motor de otimização de carga com as restrições de montaria e bolsa
    const plan = optimizeCargoLoadout(opportunities, {
      budget: state.budget,
      mountId: selectedMountId,
      bagId: selectedBagId,
      safetyMarginPercent: 0.05,
      maxItemDiversity: 8,
      strategy: optimizationStrategy,
      onlyHighDemand: onlyHighDemand
    });

    container.innerHTML = `
      <div class="optimizer-dashboard">
        <!-- Painel de Controle de Parâmetros -->
        <div class="optimizer-control-panel">
          <div class="panel-header">
            <div class="header-titles">
              <span class="badge-tag">ALGORITMO DE CARGA INTELIGENTE</span>
              <h2 class="panel-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                Estimativa de Lucro Máximo por Equipamento
              </h2>
              <p class="panel-sub">
                Informe quanto deseja investir, sua montaria e bolsa. O algoritmo calcula a combinação perfeita de itens e quantidades para o maior retorno líquido sem risco de sobrecarga.
              </p>
            </div>

            <button class="btn btn-primary" id="btn-refresh-optimizer" ${isLoading ? 'disabled' : ''}>
              <svg class="${isLoading ? 'spin' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              ${isLoading ? 'Buscando Cotações...' : 'Atualizar Cotações'}
            </button>
          </div>

          <div class="optimizer-controls-grid">
            <!-- 1. Saldo para Investir -->
            <div class="control-group">
              <label class="control-label" for="opt-input-budget">
                Saldo de Investimento (Silver):
              </label>
              <div class="input-with-symbol">
                <span class="currency-symbol">⚔️</span>
                <input 
                  type="number" 
                  id="opt-input-budget" 
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

            <!-- 2. Equipamentos: Montaria & Bolsa -->
            <div class="control-group gear-group">
              <label class="control-label" for="opt-select-mount">Sua Montaria:</label>
              <select id="opt-select-mount" class="select-field">
                ${TRANSPORT_MOUNTS.map(m => `
                  <option value="${m.id}" ${m.id === selectedMountId ? 'selected' : ''}>
                    ${m.name}
                  </option>
                `).join('')}
              </select>

              <label class="control-label mt-2" for="opt-select-bag">Sua Bolsa Equipada:</label>
              <select id="opt-select-bag" class="select-field">
                ${BAGS_CATALOG.map(b => `
                  <option value="${b.id}" ${b.id === selectedBagId ? 'selected' : ''}>
                    ${b.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- 3. Parâmetros de Mercado & Estratégia -->
            <div class="control-group">
              <label class="control-label" for="opt-select-strategy">Estratégia de Carga:</label>
              <select id="opt-select-strategy" class="select-field">
                <option value="fast_sale" ${optimizationStrategy === 'fast_sale' ? 'selected' : ''}>
                  ⚡ Giro Rápido & Alta Demanda (Itens mais fáceis de vender)
                </option>
                <option value="balanced" ${optimizationStrategy === 'balanced' ? 'selected' : ''}>
                  ⚖️ Equilibrada (Divide em até 8 itens para não saturar o BM)
                </option>
                <option value="max_profit" ${optimizationStrategy === 'max_profit' ? 'selected' : ''}>
                  💎 Lucro Máximo (Concentração nos maiores lucros)
                </option>
                <option value="high_mobility" ${optimizationStrategy === 'high_mobility' ? 'selected' : ''}>
                  🐎 Alta Mobilidade (Deixa 15% de folga de peso para emergências)
                </option>
              </select>

              <label class="control-label mt-2" for="opt-select-category">Filtrar Categoria:</label>
              <select id="opt-select-category" class="select-field">
                ${ITEM_CATEGORIES.map(c => `
                  <option value="${c.id}" ${c.id === selectedCategory ? 'selected' : ''}>
                    ${c.name}
                  </option>
                `).join('')}
              </select>

              <div class="toggle-premium-box mt-2">
                <label class="checkbox-container">
                  <input type="checkbox" id="opt-check-premium" ${state.hasPremium ? 'checked' : ''} />
                  <span class="checkmark"></span>
                  <span class="checkbox-label">Status Premium Ativo (Taxa BM: ${taxPercent}%)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de Sugestões de Alta Demanda & Venda Rápida -->
        <div class="high-demand-showcase">
          <div class="showcase-header">
            <div class="showcase-titles">
              <span class="badge-tag">MERCADO DE CAERLEON & BLACK MARKET</span>
              <h3 class="showcase-title">🔥 Sugestões de Alta Demanda (Itens Mais Fáceis de Vender)</h3>
              <p class="showcase-desc">
                Estes nichos têm liquidez máxima comprovada. O Black Market recompra continuamente mob drops e os jogadores de Caerleon compram insumos e consumíveis diariamente nas Red Zones.
              </p>
            </div>
            ${selectedCategory !== 'all' ? `
              <button class="btn btn-secondary btn-sm" id="btn-reset-category-filter">
                Ver Todas as Categorias
              </button>
            ` : ''}
          </div>

          <div class="showcase-cards-grid">
            ${HIGH_DEMAND_RECOMMENDATIONS.map(sugg => {
              const isActive = selectedCategory === sugg.targetCategory;
              return `
                <div class="sugg-card ${isActive ? 'active-sugg' : ''}">
                  <div class="sugg-card-top">
                    <span class="sugg-icon">${sugg.icon}</span>
                    <span class="sugg-badge ${sugg.liquidityClass}">${sugg.liquidity}</span>
                  </div>
                  <h4 class="sugg-card-title">${sugg.categoryTitle}</h4>
                  <p class="sugg-card-desc">${sugg.description}</p>
                  <div class="sugg-card-meta">
                    <span class="sugg-market-tag">${sugg.sellMarket}</span>
                    <div class="sugg-tags">
                      ${sugg.sampleItems.map(item => `<span class="sugg-item-pill">${item}</span>`).join('')}
                    </div>
                  </div>
                  <button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm btn-filter-sugg" data-category="${sugg.targetCategory}">
                    ${isActive ? '✓ Categoria Ativa' : 'Focar Nesta Categoria'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Medidor Visual de Carga de Peso (Montaria + Bolsa) -->
        <div class="weight-gauge-card">
          <div class="weight-gauge-header">
            <div class="gauge-title-box">
              <span class="gauge-badge">CAPACIDADE TOTAL DE TRANSPORTE</span>
              <h3 class="gauge-main-title">
                ${plan.totalMaxLoadKg} kg Suportados 
                <span class="gauge-sub-breakdown">(Montaria: <strong>${plan.mount.maxLoadKg} kg</strong> + Bolsa: <strong>+${plan.bag.bonusKg} kg</strong>)</span>
              </h3>
            </div>

            <div class="gauge-status-badge ${plan.isOverburdened ? 'status-danger' : plan.weightUtilizationPercent > 90 ? 'status-optimal' : 'status-safe'}">
              ${plan.isOverburdened ? '⚠️ SOBRECARGA DETECTADA' : plan.weightUtilizationPercent > 90 ? '⚡ CARGA OTIMIZADA' : '🛡️ PESO SEGURO'}
            </div>
          </div>

          <!-- Barra de Peso -->
          <div class="weight-bar-track">
            <div 
              class="weight-bar-fill ${plan.isOverburdened ? 'bar-overburden' : plan.weightUtilizationPercent > 90 ? 'bar-optimal' : 'bar-safe'}"
              style="width: ${Math.min(100, plan.weightUtilizationPercent)}%"
            ></div>
          </div>

          <div class="weight-gauge-meta">
            <span>Peso Utilizado: <strong>${plan.totalWeightUsed.toFixed(1)} kg</strong> (${plan.weightUtilizationPercent.toFixed(1)}%)</span>
            <span>Folga de Segurança: <strong>${plan.remainingWeightCapacity.toFixed(1)} kg</strong> livres</span>
            <span>Segurança da Montaria: <strong>${plan.mount.safety}</strong></span>
          </div>
        </div>

        <!-- Painel de Resultados Financeiros -->
        <div class="optimizer-results-hero">
          <div class="results-hero-header">
            <div class="results-titles">
              <span class="badge-tag">PROJEÇÃO FINANCEIRA DO PLANO DE CARGA</span>
              <h3 class="results-main-title">
                Resultado para ${formatSilver(state.budget)} Prata com ${plan.mount.name.split(' (')[0]}
              </h3>
            </div>

            <div class="results-actions">
              <button class="btn btn-primary" id="btn-load-optimized-cart" ${plan.recommendedItems.length === 0 ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                Carregar Carga no Carrinho (${plan.itemsCount} un.)
              </button>
              <button class="btn btn-secondary" id="btn-copy-optimized-checklist" ${plan.recommendedItems.length === 0 ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Copiar Lista de Compras
              </button>
            </div>
          </div>

          <div class="projection-metrics-grid">
            <div class="proj-metric-item">
              <span class="proj-metric-label">Total Investido (Compra)</span>
              <div class="proj-metric-val text-silver">
                ${formatSilver(plan.totalInvested)}
              </div>
              <span class="proj-metric-desc">
                ${plan.budgetUtilizationPercent.toFixed(1)}% do seu capital utilizado (${formatSilver(plan.remainingBudget)} livre)
              </span>
            </div>

            <div class="proj-metric-item">
              <span class="proj-metric-label">Retorno Bruto em Caerleon</span>
              <div class="proj-metric-val text-gold">
                ${formatSilver(plan.totalGrossReturn)}
              </div>
              <span class="proj-metric-desc">Total arrecadado nas vendas (BM e Mercado Real)</span>
            </div>

            <div class="proj-metric-item">
              <span class="proj-metric-label">Retorno Líquido na Conta</span>
              <div class="proj-metric-val text-gold">
                ${formatSilver(plan.totalNetReturn)}
              </div>
              <span class="proj-metric-desc">Já deduzidas as taxas de mercado</span>
            </div>

            <div class="proj-metric-item highlight-profit-box">
              <span class="proj-metric-label">LUCRO LÍQUIDO NO BOLSO</span>
              <div class="proj-metric-val text-emerald">
                +${formatSilver(plan.totalNetProfit)}
              </div>
              <span class="proj-metric-desc badge-roi-highlight">
                +${plan.averageRoiPercent.toFixed(1)}% de Retorno Médio (ROI)
              </span>
            </div>
          </div>
        </div>

        <!-- Tabela da Carga Recomendada (Plano de Compra) -->
        <div class="table-container">
          <div class="table-sub-header">
            <h4 class="table-sub-title">
              Itens Selecionados para Carga Máxima (${plan.distinctTypesCount} tipos • ${plan.itemsCount} unidades totais)
            </h4>
            <span class="table-sub-desc">Compre exatamente estas quantidades em ${state.selectedCity} e viaje com o combo de segurança</span>
          </div>

          ${isLoading ? `
            <div class="loading-state">
              <div class="spinner-large"></div>
              <h3>Consultando APIs do Albion Data Project em tempo real...</h3>
              <p>Otimizando lote de itens com base em seu capital e equipamentos...</p>
            </div>
          ` : plan.recommendedItems.length === 0 ? `
            <div class="empty-state">
              <h3>Nenhum item viável para o saldo ou peso informados</h3>
              <p>Tente aumentar seu saldo de investimento, escolher uma montaria ou bolsa maior, ou clicar em "Atualizar Cotações".</p>
            </div>
          ` : `
            <table class="arbitrage-table">
              <thead>
                <tr>
                  <th>Item / Qualidade</th>
                  <th>Demanda / Destino</th>
                  <th>Quantidade a Comprar</th>
                  <th>Compra Unitária</th>
                  <th>Investimento Total</th>
                  <th>Venda em Caerleon</th>
                  <th>Retorno Líquido</th>
                  <th>Lucro Líquido Real</th>
                  <th>Peso do Lote</th>
                  <th class="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                ${plan.recommendedItems.map((item, idx) => {
                  const qualityObj = QUALITIES.find(q => q.id === item.quality) || QUALITIES[0];
                  const iconUrl = getItemIconUrl(item.id, item.quality);

                  return `
                    <tr class="item-row profitable">
                      <td class="cell-item">
                        <img class="item-thumb" src="${iconUrl}" alt="${item.namePt}" loading="lazy" />
                        <div class="item-info">
                          <span class="item-name">${item.namePt}</span>
                          <div class="item-badges">
                            <span class="tier-badge">T${item.tier}${item.enchantment > 0 ? '.' + item.enchantment : ''}</span>
                            <span class="quality-badge" style="color: ${qualityObj.color}; border-color: ${qualityObj.color}44">
                              ${qualityObj.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td class="cell-demand-destination">
                        <div class="demand-dest-box">
                          ${item.demandLevel === 'ultra' ? `
                            <span class="demand-pill ultra" title="${item.demandReason}">⚡ Giro Imediato</span>
                          ` : item.demandLevel === 'high' ? `
                            <span class="demand-pill high" title="${item.demandReason}">🔥 Alta Demanda</span>
                          ` : `
                            <span class="demand-pill normal">Demanda Regular</span>
                          `}
                          <span class="dest-market-tag ${item.targetMarket || 'black_market'}">
                            ${item.targetMarketBadge || '🏴 Black Market'}
                          </span>
                        </div>
                      </td>

                      <td class="cell-qty-recommended">
                        <span class="recommended-qty-pill">
                          <strong>${item.recommendedUnits}x</strong> un.
                        </span>
                      </td>

                      <td class="cell-price buy-price">
                        <span class="price-val">${formatSilver(item.buyPrice)}</span>
                        <span class="price-sub">unitário</span>
                      </td>

                      <td class="cell-price buy-price">
                        <span class="price-val text-silver"><strong>${formatSilver(item.totalInvestment)}</strong></span>
                      </td>

                      <td class="cell-price sell-price">
                        <span class="price-val">${formatSilver(item.sellPrice)}</span>
                        <span class="price-sub">Líq: ${formatSilver(item.netSellPrice)}</span>
                      </td>

                      <td class="cell-price sell-price">
                        <span class="price-val text-gold"><strong>${formatSilver(item.totalNetReturn)}</strong></span>
                      </td>

                      <td class="cell-profit">
                        <span class="profit-val positive">
                          +${formatSilver(item.totalNetProfit)}
                        </span>
                        <span class="roi-val positive-roi">
                          +${item.roiPercent.toFixed(1)}% ROI
                        </span>
                      </td>

                      <td class="cell-weight-col">
                        <span class="weight-val">⚖️ ${item.totalWeightKg.toFixed(1)} kg</span>
                        <span class="weight-sub">${((item.totalWeightKg / plan.totalMaxLoadKg) * 100).toFixed(1)}% da carga</span>
                      </td>

                      <td class="cell-actions text-right">
                        <button class="btn-icon btn-copy-item-name" data-copy="${item.namePt}" title="Copiar Nome do Item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
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

    attachEvents(plan);
  }

  function attachEvents(plan) {
    // Atualizar Cotações
    const btnRefresh = document.getElementById('btn-refresh-optimizer');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => loadData(true));
    }

    // Input de Orçamento
    const inputBudget = document.getElementById('opt-input-budget');
    if (inputBudget) {
      inputBudget.addEventListener('change', (e) => {
        const val = Number(e.target.value);
        if (!isNaN(val) && val >= 0) {
          state.budget = val;
          render();
        }
      });
    }

    // Presets de Saldo
    document.querySelectorAll('.optimizer-dashboard .preset-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = Number(pill.getAttribute('data-budget'));
        state.budget = val;
        render();
      });
    });

    // Seletor de Montaria
    const selectMount = document.getElementById('opt-select-mount');
    if (selectMount) {
      selectMount.addEventListener('change', (e) => {
        selectedMountId = e.target.value;
        state.selectedMountId = e.target.value;
        render();
      });
    }

    // Seletor de Bolsa
    const selectBag = document.getElementById('opt-select-bag');
    if (selectBag) {
      selectBag.addEventListener('change', (e) => {
        selectedBagId = e.target.value;
        state.selectedBagId = e.target.value;
        render();
      });
    }

    // Seletor de Estratégia
    const selectStrategy = document.getElementById('opt-select-strategy');
    if (selectStrategy) {
      selectStrategy.addEventListener('change', (e) => {
        optimizationStrategy = e.target.value;
        render();
      });
    }

    // Seletor de Categoria
    const selectCategory = document.getElementById('opt-select-category');
    if (selectCategory) {
      selectCategory.addEventListener('change', (e) => {
        selectedCategory = e.target.value;
        onlyHighDemand = selectedCategory === 'high_demand';
        render();
      });
    }

    // Botões dos Cards de Sugestão de Alta Demanda
    document.querySelectorAll('.btn-filter-sugg').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        if (selectedCategory === cat) {
          selectedCategory = 'all';
          onlyHighDemand = false;
        } else {
          selectedCategory = cat;
          onlyHighDemand = false;
        }
        render();
      });
    });

    // Botão Reset de Categoria
    const btnResetCat = document.getElementById('btn-reset-category-filter');
    if (btnResetCat) {
      btnResetCat.addEventListener('click', () => {
        selectedCategory = 'all';
        onlyHighDemand = false;
        render();
      });
    }

    // Checkbox Premium
    const checkPremium = document.getElementById('opt-check-premium');
    if (checkPremium) {
      checkPremium.addEventListener('change', (e) => {
        state.hasPremium = e.target.checked;
        render();
      });
    }

    // Copiar Nome do Item Individual
    document.querySelectorAll('.btn-copy-item-name').forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy');
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copiado: "${textToCopy}"`);
        });
      });
    });

    // Carregar Carga Otimizada no Carrinho
    const btnLoadCart = document.getElementById('btn-load-optimized-cart');
    if (btnLoadCart && plan && plan.recommendedItems.length > 0) {
      btnLoadCart.addEventListener('click', () => {
        if (onAddToCart) {
          for (const item of plan.recommendedItems) {
            onAddToCart(item, item.recommendedUnits);
          }
          showToast(`Carga Otimizada Carregada! ${plan.itemsCount} unidades adicionadas ao Carrinho.`);
        }
      });
    }

    // Copiar Lista de Compras Formatada
    const btnCopyChecklist = document.getElementById('btn-copy-optimized-checklist');
    if (btnCopyChecklist && plan && plan.recommendedItems.length > 0) {
      btnCopyChecklist.addEventListener('click', () => {
        let text = `📦 LISTA DE CARGA OTIMIZADA (Lymhurst -> Caerleon)\n`;
        text += `⚔️ Saldo Investido: ${formatSilver(plan.totalInvested)} / ${formatSilver(plan.budget)}\n`;
        text += `💰 Lucro Líquido Estimado: +${formatSilver(plan.totalNetProfit)} (+${plan.averageRoiPercent.toFixed(1)}% ROI)\n`;
        text += `⚖️ Peso da Carga: ${plan.totalWeightUsed.toFixed(1)} kg / ${plan.totalMaxLoadKg} kg (${plan.mount.name.split(' (')[0]} + ${plan.bag.name})\n`;
        text += `--------------------------------------------------\n`;

        plan.recommendedItems.forEach((item, i) => {
          const dest = item.targetMarketName || 'Black Market';
          text += `${i + 1}. [${item.recommendedUnits}x] ${item.namePt} (${dest}) | Compra: ${formatSilver(item.buyPrice)} un. (Total: ${formatSilver(item.totalInvestment)}) | Lucro: +${formatSilver(item.totalNetProfit)}\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
          showToast('Lista de compras completa copiada para a área de transferência!');
        });
      });
    }
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
    }, 3200);
  }

  // Carregamento inicial
  loadData();

  return {
    reload: () => loadData(true)
  };
}
