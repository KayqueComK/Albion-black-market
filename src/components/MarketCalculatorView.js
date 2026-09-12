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
              <p class="panel-sub">Defina seu capital disponível para ver o retorno exato e quantas unidades comprar</p>
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
              <p>Analisando centenas de ordens em ${state.selectedCity} e no Black Market de Caerleon...</p>
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
                  <th>Venda (${state.sellMode === 'instant' ? 'Ordem Compra BM' : 'Ordem Venda BM'})</th>
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
                          <div class="budget-units">
                            <span class="units-count">Compre <strong>${op.maxUnits}x</strong></span>
                            <span class="units-cost">Custo: ${formatSilver(op.totalInvestment)}</span>
                          </div>
                          <div class="budget-profit">
                            <span class="total-profit-highlight">
                              +${formatSilver(op.totalNetProfit)}
                            </span>
                            <span class="total-weight">Peso: ${op.totalWeightKg.toFixed(1)} kg</span>
                          </div>
                        ` : `
                          <span class="badge-insufficient">Custa mais que o seu saldo</span>
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

    attachEvents(filteredOpportunities);
  }

  function attachEvents(currentOpportunities) {
    // Atualizar Cotações
    const btnRefresh = document.getElementById('btn-refresh-prices');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => loadData(true));
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

    // Adicionar ao Carrinho de Transporte
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        const op = currentOpportunities[idx];
        if (op && onAddToCart) {
          onAddToCart(op);
          showToast(`Adicionado ao Carrinho: ${op.namePt}`);
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
