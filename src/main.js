// Ponto de entrada principal da aplicação Albion Caerleon Smuggler

import { SERVERS } from './services/albionApi.js';
import { createBanditView } from './components/BanditView.js';
import { createMarketCalculatorView } from './components/MarketCalculatorView.js';
import { createCartLoadoutView } from './components/CartLoadoutView.js';
import { createDataClientGuideView } from './components/DataClientGuideView.js';

// Estado Global da Aplicação
const appState = {
  selectedServer: SERVERS[0], // Americas por padrão
  selectedCity: 'Lymhurst',   // Cidade natal do usuário
  budget: 1_000_000,          // 1 Milhão de Prata inicial
  hasPremium: true,           // Status premium
  sellMode: 'instant',        // Venda imediata
  selectedMountId: 'armored_horse_t5',
  cart: [],                   // Itens selecionados para transporte
  currentTab: 'bandit'
};

let activeViewInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  setupClocks();
  setupServerSelector();
  setupTabNavigation();
  updateCartBadge();
  switchTab(appState.currentTab);
});

/**
 * Atualiza os relógios UTC do Albion e Horário Local em tempo real
 */
function setupClocks() {
  const clockUtcEl = document.getElementById('clock-utc');
  const clockLocalEl = document.getElementById('clock-local');

  function update() {
    const now = new Date();

    if (clockUtcEl) {
      clockUtcEl.textContent = now.toUTCString().slice(17, 25);
    }
    if (clockLocalEl) {
      clockLocalEl.textContent = now.toLocaleTimeString('pt-BR');
    }
  }

  update();
  setInterval(update, 1000);
}

/**
 * Gerencia o seletor de servidores (Americas / Europe / Asia)
 */
function setupServerSelector() {
  const selectEl = document.getElementById('header-server-select');
  if (!selectEl) return;

  selectEl.addEventListener('change', (e) => {
    const found = SERVERS.find(s => s.id === e.target.value);
    if (found) {
      appState.selectedServer = found;
      // Recarregar a visualização ativa com o novo servidor
      switchTab(appState.currentTab);
    }
  });
}

/**
 * Gerencia a troca de abas principais
 */
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId && tabId !== appState.currentTab) {
        switchTab(tabId);
      }
    });
  });
}

/**
 * Troca de aba e renderiza o componente correspondente
 */
function switchTab(tabId) {
  appState.currentTab = tabId;

  // Atualizar botões de aba ativos
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const container = document.getElementById('app-view-container');
  if (!container) return;

  // Destruir instância anterior se houver
  if (activeViewInstance && typeof activeViewInstance.destroy === 'function') {
    activeViewInstance.destroy();
  }

  container.innerHTML = '';

  if (tabId === 'bandit') {
    activeViewInstance = createBanditView(container, appState);
  } else if (tabId === 'calculator') {
    activeViewInstance = createMarketCalculatorView(container, appState, (opportunity, qty = 1) => {
      handleAddToCart(opportunity, qty);
    });
  } else if (tabId === 'cart') {
    activeViewInstance = createCartLoadoutView(container, appState, () => {
      updateCartBadge();
    });
  } else if (tabId === 'guide') {
    activeViewInstance = createDataClientGuideView(container);
  }
}

/**
 * Adiciona um item ao carrinho de carga
 */
function handleAddToCart(opportunity, qtyToAdd = 1) {
  const existing = appState.cart.find(item => item.id === opportunity.id && item.quality === opportunity.quality);

  if (existing) {
    existing.qty = (existing.qty || 0) + qtyToAdd;
  } else {
    appState.cart.push({
      ...opportunity,
      qty: qtyToAdd
    });
  }

  updateCartBadge();
}

/**
 * Atualiza o indicador numérico no botão da aba de Carrinho
 */
function updateCartBadge() {
  const badge = document.getElementById('cart-badge-count');
  if (badge) {
    const totalItems = appState.cart.reduce((acc, i) => acc + (i.qty || 1), 0);
    badge.textContent = String(totalItems);
  }
}
