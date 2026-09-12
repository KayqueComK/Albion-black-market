// Componente da Aba: Carrinho de Carga & Planejador de Viagem

import { getItemIconUrl, formatSilver } from '../services/albionApi.js';
import { QUALITIES, TRANSPORT_MOUNTS } from '../data/itemsCatalog.js';

export function createCartLoadoutView(container, state, onCartChange) {
  let selectedMountId = state.selectedMountId || 'armored_horse_t5';

  function render() {
    const cart = state.cart || [];
    const selectedMount = TRANSPORT_MOUNTS.find(m => m.id === selectedMountId) || TRANSPORT_MOUNTS[0];

    // Cálculos consolidados
    let totalInvest = 0;
    let totalGrossReturn = 0;
    let totalNetReturn = 0;
    let totalNetProfit = 0;
    let totalWeight = 0;

    for (const item of cart) {
      const qty = item.qty || 1;
      const unitBuy = item.buyPrice || 0;
      const unitSell = item.sellPrice || 0;
      const unitNetSell = item.netSellPrice || 0;
      const unitProfit = item.unitProfit || 0;
      const unitWeight = item.unitWeight || 2.0;

      totalInvest += qty * unitBuy;
      totalGrossReturn += qty * unitSell;
      totalNetReturn += qty * unitNetSell;
      totalNetProfit += qty * unitProfit;
      totalWeight += qty * unitWeight;
    }

    const overallRoi = totalInvest > 0 ? (totalNetProfit / totalInvest) * 100 : 0;
    const loadPercent = selectedMount.maxLoadKg > 0 ? (totalWeight / selectedMount.maxLoadKg) * 100 : 0;
    const isOverburdened = loadPercent > 100;

    container.innerHTML = `
      <div class="cart-dashboard">
        <!-- Resumo Consolidado do Transporte -->
        <div class="cart-summary-grid">
          <div class="summary-metric-card">
            <span class="metric-label">Investimento Total (Lymhurst)</span>
            <div class="metric-value text-silver">
              ${formatSilver(totalInvest)}
            </div>
            <span class="metric-sub">Prata necessária para comprar</span>
          </div>

          <div class="summary-metric-card">
            <span class="metric-label">Retorno Líquido no Black Market</span>
            <div class="metric-value text-gold">
              ${formatSilver(totalNetReturn)}
            </div>
            <span class="metric-sub">Já descontada taxa de ${state.hasPremium ? '4%' : '8%'}</span>
          </div>

          <div class="summary-metric-card highlight-profit">
            <span class="metric-label">Lucro Líquido Projetado</span>
            <div class="metric-value text-emerald">
              +${formatSilver(totalNetProfit)}
            </div>
            <span class="metric-sub">Retorno de +${overallRoi.toFixed(1)}% sobre o capital</span>
          </div>

          <div class="summary-metric-card ${isOverburdened ? 'metric-danger' : ''}">
            <span class="metric-label">Peso Total da Carga</span>
            <div class="metric-value ${isOverburdened ? 'text-danger' : 'text-cyan'}">
              ${totalWeight.toFixed(1)} kg
            </div>
            <span class="metric-sub">${loadPercent.toFixed(1)}% da montaria selecionada</span>
          </div>
        </div>

        <!-- Seletor de Montaria & Barra de Carga -->
        <div class="mount-capacity-panel">
          <div class="mount-capacity-header">
            <div class="mount-choice-box">
              <label for="select-mount" class="control-label">Sua Montaria de Transporte:</label>
              <select id="select-mount" class="select-field">
                ${TRANSPORT_MOUNTS.map(m => `
                  <option value="${m.id}" ${m.id === selectedMountId ? 'selected' : ''}>
                    ${m.name} (Capacidade: ${m.maxLoadKg} kg - Segurança: ${m.safety})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="mount-spec-badges">
              <span class="badge-spec">Velocidade: <strong>${selectedMount.speed}</strong></span>
              <span class="badge-spec">Segurança: <strong>${selectedMount.safety}</strong></span>
            </div>
          </div>

          <!-- Barra de Peso -->
          <div class="weight-bar-container">
            <div class="weight-bar-track">
              <div 
                class="weight-bar-fill ${isOverburdened ? 'bar-overburden' : loadPercent > 80 ? 'bar-warning' : 'bar-safe'}"
                style="width: ${Math.min(100, loadPercent)}%"
              ></div>
            </div>
            <div class="weight-bar-labels">
              <span>0 kg</span>
              <span><strong>${totalWeight.toFixed(1)} kg</strong> de ${selectedMount.maxLoadKg} kg</span>
              <span>${selectedMount.maxLoadKg} kg</span>
            </div>
          </div>

          ${isOverburdened ? `
            <div class="overburden-alert-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <strong>SOBRECARGA DETECTADA!</strong> O peso da carga ultrapassa a capacidade máxima do ${selectedMount.name}. Se você for desmontado nas zonas vermelhas, não conseguirá correr e será morto pelos gankers! Diminua a quantidade de itens.
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Lista de Itens no Carrinho -->
        <div class="cart-items-section">
          <div class="cart-header-row">
            <h3 class="cart-title">
              Itens no Carrinho de Carga (${cart.length} tipo${cart.length !== 1 ? 's' : ''})
            </h3>
            <div class="cart-actions-row">
              <button class="btn btn-secondary btn-sm" id="btn-copy-checklist" ${cart.length === 0 ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Copiar Lista de Compras
              </button>
              <button class="btn btn-outline-danger btn-sm" id="btn-clear-cart" ${cart.length === 0 ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Limpar Carrinho
              </button>
            </div>
          </div>

          ${cart.length === 0 ? `
            <div class="cart-empty-box">
              <h4>Seu carrinho de transporte está vazio</h4>
              <p>Vá até a aba <strong>"Calculadora Black Market"</strong> e clique em <strong>"+ Carga"</strong> nos itens lucrativos que deseja transportar!</p>
            </div>
          ` : `
            <div class="cart-table-wrapper">
              <table class="arbitrage-table cart-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantidade</th>
                    <th>Custo Unit. (Lym)</th>
                    <th>Venda Unit. (BM)</th>
                    <th>Investimento Total</th>
                    <th>Lucro Líquido</th>
                    <th>Peso Total</th>
                    <th class="text-right">Remover</th>
                  </tr>
                </thead>
                <tbody>
                  ${cart.map((item, idx) => {
                    const qualityObj = QUALITIES.find(q => q.id === item.quality) || QUALITIES[0];
                    const iconUrl = getItemIconUrl(item.id, item.quality);
                    const qty = item.qty || 1;
                    const itemInvest = qty * item.buyPrice;
                    const itemProfit = qty * item.unitProfit;
                    const itemWeight = qty * (item.unitWeight || 2.0);

                    return `
                      <tr>
                        <td class="cell-item">
                          <img class="item-thumb" src="${iconUrl}" alt="${item.namePt}" />
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

                        <td class="cell-qty">
                          <div class="qty-stepper">
                            <button class="btn-qty-minus" data-idx="${idx}">-</button>
                            <input 
                              type="number" 
                              class="input-qty" 
                              data-idx="${idx}" 
                              value="${qty}" 
                              min="1" 
                              max="999" 
                            />
                            <button class="btn-qty-plus" data-idx="${idx}">+</button>
                          </div>
                        </td>

                        <td class="cell-price">${formatSilver(item.buyPrice)}</td>
                        <td class="cell-price">${formatSilver(item.sellPrice)}</td>
                        <td class="cell-price text-silver"><strong>${formatSilver(itemInvest)}</strong></td>
                        <td class="cell-profit">
                          <span class="profit-val positive">+${formatSilver(itemProfit)}</span>
                          <span class="price-sub">(${item.roiPercent.toFixed(1)}% ROI)</span>
                        </td>
                        <td class="cell-weight">${itemWeight.toFixed(1)} kg</td>

                        <td class="text-right">
                          <button class="btn-remove-item" data-idx="${idx}" title="Remover item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Troca de Montaria
    const selectMount = document.getElementById('select-mount');
    if (selectMount) {
      selectMount.addEventListener('change', (e) => {
        selectedMountId = e.target.value;
        state.selectedMountId = selectedMountId;
        render();
      });
    }

    // Aumentar Qty
    document.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        if (state.cart[idx]) {
          state.cart[idx].qty = (state.cart[idx].qty || 1) + 1;
          if (onCartChange) onCartChange();
          render();
        }
      });
    });

    // Diminuir Qty
    document.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        if (state.cart[idx]) {
          const current = state.cart[idx].qty || 1;
          if (current > 1) {
            state.cart[idx].qty = current - 1;
          } else {
            state.cart.splice(idx, 1);
          }
          if (onCartChange) onCartChange();
          render();
        }
      });
    });

    // Input manual de Qty
    document.querySelectorAll('.input-qty').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = Number(input.getAttribute('data-idx'));
        const val = Math.max(1, Number(e.target.value) || 1);
        if (state.cart[idx]) {
          state.cart[idx].qty = val;
          if (onCartChange) onCartChange();
          render();
        }
      });
    });

    // Remover Item
    document.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        state.cart.splice(idx, 1);
        if (onCartChange) onCartChange();
        render();
      });
    });

    // Limpar Carrinho
    const btnClear = document.getElementById('btn-clear-cart');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('Deseja realmente limpar todos os itens do carrinho de carga?')) {
          state.cart = [];
          if (onCartChange) onCartChange();
          render();
        }
      });
    }

    // Copiar Checklist de Compras
    const btnCopy = document.getElementById('btn-copy-checklist');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const text = state.cart.map(item => {
          return `• ${item.qty}x ${item.namePt} (Qualidade: ${item.quality}) - Preço Lymhurst: ~${formatSilver(item.buyPrice)}`;
        }).join('\n');

        const fullText = `📦 LISTA DE COMPRAS PARA CAERLEON (Origem: Lymhurst)\n----------------------------------------\n${text}\n----------------------------------------\nInvestimento Total: ${formatSilver(state.cart.reduce((acc, i) => acc + (i.qty * i.buyPrice), 0))} Silver`;

        navigator.clipboard.writeText(fullText).then(() => {
          alert('Lista de compras copiada para a área de transferência!');
        });
      });
    }
  }

  render();

  return {
    render
  };
}
