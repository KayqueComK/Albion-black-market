// Rastreador do Assalto dos Bandidos (Bandit Assault) e Conselheiro Tático de Transporte

const STORAGE_KEY = 'albion_bandit_last_event_v1';

// Parâmetros médios do evento de Albion Online
export const BANDIT_CONFIG = {
  durationMinutes: 50,         // Duração aproximada do assalto
  minCooldownMinutes: 240,     // 4h de cooldown mínimo
  expectedCooldownMinutes: 285,// 4h45m (tempo médio esperado de intervalo)
  maxCooldownMinutes: 330,     // 5h30m (janela máxima esperada)
  warningWindowMinutes: 15     // Aviso prévio de 15min do jogo
};

export const TRANSPORT_STATUSES = {
  ACTIVE: {
    id: 'ACTIVE',
    label: 'ASSALTO ATIVO - JANELA DE OURO!',
    badgeClass: 'status-active',
    riskLevel: 'Mínimo com a Zerg',
    riskColor: '#10b981',
    recommendation: 'Junte-se à Zerg da Facção de Lymhurst! As forças de Lymhurst estão avançando em massa pelas zonas vermelhas até Caerleon. Qualquer ganker solitário ou grupo hostil é esmagado pelo blob aliado. Melhor momento do jogo para transportar!',
    icon: 'shield-check'
  },
  POST_ASSAULT: {
    id: 'POST_ASSAULT',
    label: 'JANELA PÓS-ASSALTO (DESMOBILIZAÇÃO)',
    badgeClass: 'status-post',
    riskLevel: 'Moderado',
    riskColor: '#38bdf8',
    recommendation: 'O evento acabou há poucos minutos. Os postos avançados foram capturados e a maioria dos jogadores de PvP está retornando. É viável transportar com montarias velozes (Cavalo Blindado ou Javali), mas fique atento a emboscadas isoladas.',
    icon: 'wind'
  },
  HIGH_DANGER: {
    id: 'HIGH_DANGER',
    label: 'ZONA DE ALTO RISCO (ENTRESSAFRA)',
    badgeClass: 'status-danger',
    riskLevel: 'Crítico / Muito Alto',
    riskColor: '#ef4444',
    recommendation: 'PERIGO MÁXIMO! Zonas vermelhas (Creag Garr, Willow Wood, Runnel Sink) altamente visadas por gankers com garras e cajados duplos caçando transportadores. NÃO transporte solo com carga pesada. Fique em Lymhurst preparando seus itens.',
    icon: 'skull'
  },
  PREPARING: {
    id: 'PREPARING',
    label: 'JANELA DE PREPARAÇÃO (EM BREVE)',
    badgeClass: 'status-prep',
    riskLevel: 'Atenção / Pré-Evento',
    riskColor: '#f59e0b',
    recommendation: 'A janela de recarga atingiu o tempo mínimo. O aviso de 15 minutos pode surgir no jogo a qualquer instante! Compre seus itens no mercado de Lymhurst, guarde no inventário e equipe sua montaria para sair assim que o aviso soar.',
    icon: 'clock'
  },
  WARNING_15MIN: {
    id: 'WARNING_15MIN',
    label: 'AVISO DE 15 MINUTOS NO JOGO!',
    badgeClass: 'status-warning',
    riskLevel: 'Baixo se sincronizado',
    riskColor: '#eab308',
    recommendation: 'O aviso oficial de 15 minutos foi emitido pelo jogo! Dirija-se imediatamente à saída do portal de Lymhurst com sua montaria e aguarde os comandantes da facção darem a chamada de marcha.',
    icon: 'bell'
  }
};

/**
 * Obtém a data/hora do último assalto registrado
 */
export function getLastBanditEvent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        timestamp: Number(data.timestamp),
        type: data.type || 'start',
        server: data.server || 'americas'
      };
    }
  } catch (e) {
    console.error('Erro ao ler último assalto do storage', e);
  }

  // Se não houver registro anterior, define uma estimativa inicial de 3h atrás
  const fallback = Date.now() - (3 * 60 * 60 * 1000);
  return { timestamp: fallback, type: 'start', server: 'americas' };
}

/**
 * Salva um novo registro do assalto dos bandidos
 */
export function recordBanditEvent(type = 'start', server = 'americas', customTimestamp = null) {
  const timestamp = customTimestamp || Date.now();
  const data = { timestamp, type, server };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

/**
 * Avalia o estado atual do evento com base no tempo decorrido
 */
export function evaluateBanditStatus(lastEventTimestamp, now = Date.now()) {
  const elapsedMs = now - lastEventTimestamp;
  const elapsedMinutes = elapsedMs / (60 * 1000);

  // 1. Durante o assalto (0 a 50 min)
  if (elapsedMinutes >= 0 && elapsedMinutes < BANDIT_CONFIG.durationMinutes) {
    const remainingActiveMinutes = Math.max(0, Math.round(BANDIT_CONFIG.durationMinutes - elapsedMinutes));
    return {
      status: TRANSPORT_STATUSES.ACTIVE,
      timeRemainingMinutes: remainingActiveMinutes,
      isLive: true,
      phase: 'live'
    };
  }

  // 2. Imediatamente após o assalto (50 a 80 min)
  if (elapsedMinutes >= BANDIT_CONFIG.durationMinutes && elapsedMinutes < BANDIT_CONFIG.durationMinutes + 30) {
    const remainingTransitionMinutes = Math.max(0, Math.round((BANDIT_CONFIG.durationMinutes + 30) - elapsedMinutes));
    return {
      status: TRANSPORT_STATUSES.POST_ASSAULT,
      timeRemainingMinutes: remainingTransitionMinutes,
      isLive: false,
      phase: 'post'
    };
  }

  // Tempo decorrido desde o término do evento
  const minutesSinceEnd = elapsedMinutes - BANDIT_CONFIG.durationMinutes;

  // 3. Janela de preparação (quando está entre 4h e 5h após o evento)
  if (elapsedMinutes >= BANDIT_CONFIG.minCooldownMinutes && elapsedMinutes < BANDIT_CONFIG.maxCooldownMinutes) {
    const expectedRemaining = Math.max(0, Math.round(BANDIT_CONFIG.expectedCooldownMinutes - elapsedMinutes));
    return {
      status: TRANSPORT_STATUSES.PREPARING,
      timeRemainingMinutes: expectedRemaining,
      isLive: false,
      phase: 'prep'
    };
  }

  // 4. Se passou do tempo máximo previsto, a qualquer segundo o evento estoura
  if (elapsedMinutes >= BANDIT_CONFIG.maxCooldownMinutes) {
    return {
      status: TRANSPORT_STATUSES.WARNING_15MIN,
      timeRemainingMinutes: 0,
      isLive: false,
      phase: 'imminent'
    };
  }

  // 5. Zona de alto perigo / cooldown padrão
  const minutesToMin = Math.max(0, Math.round(BANDIT_CONFIG.minCooldownMinutes - elapsedMinutes));
  return {
    status: TRANSPORT_STATUSES.HIGH_DANGER,
    timeRemainingMinutes: minutesToMin,
    isLive: false,
    phase: 'cooldown'
  };
}

/**
 * Toca um alerta sonoro suave (Campainha de alerta tático) via Web Audio API
 */
export function playTacticalAlertSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Primeiro tom
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // Segundo tom (mais agudo e triunfante)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.7);
  } catch (e) {
    console.warn('Audio não suportado ou bloqueado pelo navegador', e);
  }
}
