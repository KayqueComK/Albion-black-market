// Componente da Aba: Assalto dos Bandidos & Rotas de Transporte Lymhurst -> Caerleon

import {
  getLastBanditEvent,
  recordBanditEvent,
  evaluateBanditStatus,
  playTacticalAlertSound,
  TRANSPORT_STATUSES,
  BANDIT_CONFIG
} from '../services/banditTracker.js';

export function createBanditView(container, state) {
  let timerInterval = null;

  function render() {
    const lastEvent = getLastBanditEvent();
    const evaluation = evaluateBanditStatus(lastEvent.timestamp);
    const status = evaluation.status;

    // Formatar horários
    const lastDate = new Date(lastEvent.timestamp);
    const lastTimeStr = lastDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const lastDateStr = lastDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    // Próxima janela estimada
    const nextWindowMin = new Date(lastEvent.timestamp + (BANDIT_CONFIG.minCooldownMinutes * 60 * 1000));
    const nextWindowExp = new Date(lastEvent.timestamp + (BANDIT_CONFIG.expectedCooldownMinutes * 60 * 1000));
    const nextWindowMax = new Date(lastEvent.timestamp + (BANDIT_CONFIG.maxCooldownMinutes * 60 * 1000));

    const nextTimeMinStr = nextWindowMin.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const nextTimeExpStr = nextWindowExp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const nextTimeMaxStr = nextWindowMax.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    container.innerHTML = `
      <div class="bandit-dashboard">
        <!-- Banner Principal de Status de Transporte -->
        <div class="status-hero-card ${status.badgeClass}">
          <div class="status-hero-top">
            <div class="status-indicator">
              <span class="pulse-dot"></span>
              <span class="status-title-text">${status.label}</span>
            </div>
            <div class="risk-badge" style="background: ${status.riskColor}22; border-color: ${status.riskColor}; color: ${status.riskColor}">
              Risco de Transporte: <strong>${status.riskLevel}</strong>
            </div>
          </div>

          <div class="status-advice-box">
            <div class="advice-header">
              <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span>Diretriz Tática para Lymhurst:</span>
            </div>
            <p class="advice-content">${status.recommendation}</p>
          </div>

          <!-- Cronômetro e Janela Estimada -->
          <div class="timer-countdown-section">
            <div class="countdown-card">
              <span class="countdown-label">
                ${evaluation.isLive ? 'TEMPO RESTANTE DE ASSALTO' : 'TEMPO ATÉ A PRÓXIMA JANELA ESTIMADA'}
              </span>
              <div class="countdown-display" id="bandit-live-timer">
                --:--:--
              </div>
              <span class="countdown-subtext">
                ${evaluation.isLive ? 'Aproveite a escolta dos aliados!' : `Janela provável: entre <strong>${nextTimeMinStr}</strong> e <strong>${nextTimeMaxStr}</strong>`}
              </span>
            </div>

            <div class="event-meta-card">
              <div class="meta-row">
                <span class="meta-title">Último Assalto Registrado:</span>
                <span class="meta-val">${lastDateStr} às ${lastTimeStr}</span>
              </div>
              <div class="meta-row">
                <span class="meta-title">Estimativa Principal:</span>
                <span class="meta-val highlight-gold">${nextTimeExpStr} (~${Math.round(BANDIT_CONFIG.expectedCooldownMinutes / 60)}h intervalo)</span>
              </div>
              <div class="meta-row">
                <span class="meta-title">Servidor Selecionado:</span>
                <span class="meta-val text-capitalize">${state.selectedServer.name}</span>
              </div>
            </div>
          </div>

          <!-- Botões de Ação Rápida -->
          <div class="bandit-actions-bar">
            <button class="btn btn-primary" id="btn-report-bandit-now">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Assalto Começou Agora!
            </button>
            <button class="btn btn-outline" id="btn-report-bandit-ended">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              Terminou Agora
            </button>
            <button class="btn btn-secondary" id="btn-custom-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Ajustar Horário
            </button>
            <button class="btn btn-secondary" id="btn-test-sound">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              Testar Alerta Sonoro
            </button>
          </div>
        </div>

        <!-- Guia de Rota Lymhurst -> Caerleon -->
        <div class="route-guide-section">
          <div class="section-header-box">
            <h2 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              Guia de Rota Estratégica: Lymhurst até Caerleon
            </h2>
            <p class="section-subtitle">Mapas cruzados, estrangulamentos de risco e pontos de emboscada</p>
          </div>

          <div class="route-steps-grid">
            <div class="route-step-card safe-zone">
              <div class="step-badge">1. Ponto de Partida</div>
              <h3 class="step-name">Lymhurst & Birchwood</h3>
              <span class="zone-tag safe">Zona Azul / Amarela</span>
              <p class="step-desc">Saia de Lymhurst com inventário pronto. Se estiver durante o Assalto dos Bandidos, posicione-se próximo à bandeira da Facção para sair com o grupo principal.</p>
            </div>

            <div class="route-step-card danger-zone">
              <div class="step-badge">2. Entrada Zona Vermelha</div>
              <h3 class="step-name">Flynsdell & Willow Wood</h3>
              <span class="zone-tag red">Zona Vermelha</span>
              <p class="step-desc">Primeiro mapa de perigo real. Monitore o número de PKs (bandeiras vermelhas) no canto inferior direito do mini-mapa. Se houver mais de 3 PKs, fique colado na zerg aliada.</p>
            </div>

            <div class="route-step-card critical-zone">
              <div class="step-badge">3. Gargalo Crítico</div>
              <h3 class="step-name">Creag Garr & Runnel Sink</h3>
              <span class="zone-tag deadly">Extremamente Perigoso</span>
              <p class="step-desc">O ponto mais visado por gankers de Caerleon. As pontes e passagens estreitas costumam ter scouts invisíveis. NUNCA ande pela estrada principal — corte pelas bordas e florestas.</p>
            </div>

            <div class="route-step-card goal-zone">
              <div class="step-badge">4. Destino Final</div>
              <h3 class="step-name">Caerleon & Mercado Negro</h3>
              <span class="zone-tag city">Cidade / Sem PvP</span>
              <p class="step-desc">Entre pelo portal leste de Caerleon sob o buff de imunidade de bolha. Desmonte direto no Black Market para vender suas cargas com segurança total!</p>
            </div>
          </div>

          <!-- Dicas de Equipamentos e Montarias -->
          <div class="gear-mounts-grid">
            <div class="tactical-card">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Build Recomendada de Fuga (Sobrevivência)
              </h3>
              <ul class="tactical-list">
                <li><strong>Arma Principal:</strong> Cajado Duplo (Double Bladed Staff) ou Sanguinária (Bloodletter) com Corrida Extra.</li>
                <li><strong>Peitoral:</strong> Jaqueta do Assassino (Habilidade de Invisibilidade para resetar aggro e desorientar gankers).</li>
                <li><strong>Elmo:</strong> Capuz do Mercenário (Limpeza de CC e lentidão) ou Elmo do Guardião.</li>
                <li><strong>Bota:</strong> Botas de Minerador (Fuga extrema em caso de desmontagem de emergência).</li>
                <li><strong>Capa:</strong> Capa de Fort Sterling (Remove automaticamente o primeiro atordoamento/stun).</li>
                <li><strong>Consumível:</strong> Poção de Invisibilidade T4/T6 + Ensopado de Carne T7 (Vida e resistência).</li>
              </ul>
            </div>

            <div class="tactical-card">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                Montarias Recomendadas para Caerleon
              </h3>
              <ul class="tactical-list">
                <li>
                  <span class="mount-name">Cavalo Blindado T5/T7:</span>
                  <span class="mount-desc">Velocidade alta, resistente a dano e difícil de desmontar. Ótimo para cargas leves e médias de alto valor (armas e equipamentos caros).</span>
                </li>
                <li>
                  <span class="mount-name">Javali Espectral T7 (Spectral Direboar):</span>
                  <span class="mount-desc">Possui invisibilidade ativa e capacidade de carga passiva (mesmo desmontado o peso não trava). A escolha de elite dos transportadores.</span>
                </li>
                <li>
                  <span class="mount-name">Urso Cinzento T7 (Grizzly Bear):</span>
                  <span class="mount-desc">Defesa absurda e passiva anti-slow que impede os gankers de te pararem. Ideal para viagens em comboio no Assalto dos Bandidos.</span>
                </li>
                <li>
                  <span class="mount-name text-danger">Boi de Transporte (Evitar se solo):</span>
                  <span class="mount-desc">Muito lento. Se desmontado, você fica com 300% de sobrecarga e morre instantaneamente. Use APENAS se estiver 100% escoltado pela guilda.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
    startCountdown();
  }

  function startCountdown() {
    if (timerInterval) clearInterval(timerInterval);

    const updateTimer = () => {
      const timerEl = document.getElementById('bandit-live-timer');
      if (!timerEl) return;

      const lastEvent = getLastBanditEvent();
      const evaluation = evaluateBanditStatus(lastEvent.timestamp);

      let targetMs;
      if (evaluation.isLive) {
        // Alvo é o fim do assalto
        targetMs = lastEvent.timestamp + (BANDIT_CONFIG.durationMinutes * 60 * 1000);
      } else {
        // Alvo é a estimativa da próxima janela esperada
        targetMs = lastEvent.timestamp + (BANDIT_CONFIG.expectedCooldownMinutes * 60 * 1000);
      }

      const diff = targetMs - Date.now();

      if (diff <= 0 && !evaluation.isLive) {
        timerEl.textContent = 'JANELA ABERTA (A QUALQUER SEGUNDO)';
        timerEl.classList.add('imminent-pulse');
        return;
      }

      timerEl.classList.remove('imminent-pulse');
      const totalSec = Math.max(0, Math.floor(Math.abs(diff) / 1000));
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      const pad = (n) => String(n).padStart(2, '0');
      timerEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function attachEvents() {
    const btnReportNow = document.getElementById('btn-report-bandit-now');
    const btnReportEnded = document.getElementById('btn-report-bandit-ended');
    const btnCustomTime = document.getElementById('btn-custom-time');
    const btnTestSound = document.getElementById('btn-test-sound');

    if (btnReportNow) {
      btnReportNow.addEventListener('click', () => {
        recordBanditEvent('start', state.selectedServer.id, Date.now());
        playTacticalAlertSound();
        render();
      });
    }

    if (btnReportEnded) {
      btnReportEnded.addEventListener('click', () => {
        // Terminou agora significa que começou há 50 min
        const calculatedStart = Date.now() - (BANDIT_CONFIG.durationMinutes * 60 * 1000);
        recordBanditEvent('end', state.selectedServer.id, calculatedStart);
        render();
      });
    }

    if (btnCustomTime) {
      btnCustomTime.addEventListener('click', () => {
        const inputMinutes = prompt(
          'Há quantos minutos atrás o último Assalto dos Bandidos começou?\n(Exemplo: digite 30 se começou há meia hora, ou 120 se faz 2 horas)',
          '60'
        );
        if (inputMinutes !== null && !isNaN(inputMinutes)) {
          const mins = Math.max(0, Number(inputMinutes));
          const customTimestamp = Date.now() - (mins * 60 * 1000);
          recordBanditEvent('custom', state.selectedServer.id, customTimestamp);
          render();
        }
      });
    }

    if (btnTestSound) {
      btnTestSound.addEventListener('click', () => {
        playTacticalAlertSound();
      });
    }
  }

  render();

  return {
    destroy: () => {
      if (timerInterval) clearInterval(timerInterval);
    }
  };
}
