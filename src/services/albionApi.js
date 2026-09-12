// Serviço de comunicação com The Albion Online Data Project API

export const SERVERS = [
  { id: 'americas', name: 'Americas (West)', baseUrl: 'https://west.albion-online-data.com' },
  { id: 'europe', name: 'Europe', baseUrl: 'https://europe.albion-online-data.com' },
  { id: 'asia', name: 'Asia (East)', baseUrl: 'https://east.albion-online-data.com' }
];

export const CITIES = [
  { id: 'Lymhurst', name: 'Lymhurst (Sua Cidade)', isDefault: true, color: '#10b981' },
  { id: 'Fort Sterling', name: 'Fort Sterling', isDefault: false, color: '#f8fafc' },
  { id: 'Thetford', name: 'Thetford', isDefault: false, color: '#a855f7' },
  { id: 'Martlock', name: 'Martlock', isDefault: false, color: '#3b82f6' },
  { id: 'Bridgewatch', name: 'Bridgewatch', isDefault: false, color: '#f97316' },
  { id: 'Caerleon', name: 'Caerleon', isDefault: false, color: '#ef4444' }
];

// Cache em memória: chave = `${server}_${city}_${batchHash}`, valor = { timestamp, data }
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 segundos

/**
 * Obtém a URL do ícone renderizado do item
 */
export function getItemIconUrl(itemId, quality = 1) {
  return `https://render.albiononline.com/v1/item/${itemId}.png?size=64&quality=${quality}`;
}

/**
 * Busca preços em lote na API oficial do Albion Data Project
 * @param {string[]} itemIds - Lista de IDs completos (ex: T4_BAG, T5_MAIN_1H_SWORD@1)
 * @param {string} originCity - Cidade de origem (ex: Lymhurst)
 * @param {string} serverId - ID do servidor ('americas' | 'europe' | 'asia')
 * @returns {Promise<Array>}
 */
export async function fetchLivePrices(itemIds, originCity = 'Lymhurst', serverId = 'americas') {
  if (!itemIds || itemIds.length === 0) return [];

  const server = SERVERS.find(s => s.id === serverId) || SERVERS[0];
  const locations = `${originCity},Black Market`;

  // Divide os itens em lotes menores para não estourar limite de URL (máx ~50 itens por chamada)
  const BATCH_SIZE = 45;
  const batches = [];
  for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
    batches.push(itemIds.slice(i, i + BATCH_SIZE));
  }

  const results = [];

  for (const batch of batches) {
    const cacheKey = `${server.id}_${originCity}_${batch.join(',')}`;
    const cached = cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      results.push(...cached.data);
      continue;
    }

    const url = `${server.baseUrl}/api/v2/stats/prices/${batch.join(',')}.json?locations=${encodeURIComponent(locations)}`;

    try {
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        console.warn(`[Albion API] Falha na requisição: status ${response.status}`);
        continue;
      }

      const data = await response.json();
      cache.set(cacheKey, { timestamp: Date.now(), data });
      results.push(...data);
    } catch (err) {
      console.error('[Albion API Error]', err);
    }
  }

  return results;
}

/**
 * Formata números grandes de Silver para notação amigável (ex: 1.25M, 450k)
 */
export function formatSilver(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  const num = Math.round(value);
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + ' k';
  }
  return num.toLocaleString('pt-BR');
}

/**
 * Formata o tempo decorrido desde a atualização do dado (ex: 'há 12m', 'há 2h')
 */
export function formatDataAge(dateString) {
  if (!dateString || dateString.startsWith('0001')) return 'Sem dados';
  const date = new Date(dateString + 'Z');
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));

  if (diffMinutes < 1) return 'Agora mesmo';
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `há ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `há ${diffDays} d`;
}
