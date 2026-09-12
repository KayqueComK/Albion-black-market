// Catálogo de itens de alta demanda no Black Market de Caerleon
// Cada item contém o ID base, nomes em PT/EN, categoria, tiers disponíveis, encantamentos e peso em kg.

export const ITEM_CATEGORIES = [
  { id: 'all', name: 'Todas as Categorias', icon: 'layers' },
  { id: 'weapons', name: 'Armas', icon: 'swords' },
  { id: 'armor_cloth', name: 'Armadura (Tecido)', icon: 'shield' },
  { id: 'armor_leather', name: 'Armadura (Couro)', icon: 'shield' },
  { id: 'armor_plate', name: 'Armadura (Placa)', icon: 'shield' },
  { id: 'accessories', name: 'Bolsas e Capas', icon: 'briefcase' },
  { id: 'offhands', name: 'Mão Secundária', icon: 'shield' }
];

export const ITEMS_CATALOG = [
  // --- BOLSAS & CAPAS ---
  { id: 'BAG', namePt: 'Bolsa', nameEn: 'Bag', category: 'accessories', weight: 1.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'CAPE', namePt: 'Capa Comum', nameEn: 'Cape', category: 'accessories', weight: 1.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },

  // --- ESPADAS ---
  { id: 'MAIN_1H_SWORD', namePt: 'Espada Larga', nameEn: 'Broadsword', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_CLAYMORE', namePt: 'Montante (Claymore)', nameEn: 'Claymore', category: 'weapons', weight: 6.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_DUALSWORD', namePt: 'Espadas Duplas', nameEn: 'Dual Swords', category: 'weapons', weight: 5.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'MAIN_SCIMITAR_MORGANA', namePt: 'Espada Entalhada (Carving)', nameEn: 'Carving Sword', category: 'weapons', weight: 5.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },

  // --- MACHADOS ---
  { id: 'MAIN_AXE', namePt: 'Machado de Batalha', nameEn: 'Battleaxe', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_AXE', namePt: 'Machadão', nameEn: 'Greataxe', category: 'weapons', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_HALBERD', namePt: 'Alabarda', nameEn: 'Halberd', category: 'weapons', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },

  // --- ARCOS & BESTAS ---
  { id: '2H_BOW', namePt: 'Arco Comum', nameEn: 'Bow', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_WARBOW', namePt: 'Arco de Guerra', nameEn: 'Warbow', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_LONGBOW', namePt: 'Arco Longo', nameEn: 'Longbow', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_CROSSBOW', namePt: 'Besta', nameEn: 'Crossbow', category: 'weapons', weight: 5.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'MAIN_1HCROSSBOW', namePt: 'Besta Leve', nameEn: 'Light Crossbow', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_REPEATINGCROSSBOW', namePt: 'Lançadora de Dardos (Boltcasters)', nameEn: 'Boltcasters', category: 'weapons', weight: 6.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },

  // --- ADAGAS ---
  { id: 'MAIN_DAGGER', namePt: 'Adaga', nameEn: 'Dagger', category: 'weapons', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_DAGGERPAIR', namePt: 'Par de Adagas', nameEn: 'Dagger Pair', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_CLAWPAIR', namePt: 'Garras', nameEn: 'Claws', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'MAIN_RAPIER_MORGANA', namePt: 'Sanguinária (Bloodletter)', nameEn: 'Bloodletter', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },

  // --- CAJADOS (NATUREZA, SAGRADO, FOGO, GELO) ---
  { id: 'MAIN_NATURESTAFF', namePt: 'Cajado da Natureza', nameEn: 'Nature Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'MAIN_HOLYSTAFF', namePt: 'Cajado Sagrado', nameEn: 'Holy Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'MAIN_FIRESTAFF', namePt: 'Cajado Ígneo', nameEn: 'Fire Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'MAIN_FROSTSTAFF', namePt: 'Cajado de Gelo', nameEn: 'Frost Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'MAIN_CURSEDSTAFF', namePt: 'Cajado Amaldiçoado', nameEn: 'Cursed Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },

  // --- MACAS & MARTELOS ---
  { id: 'MAIN_MACE', namePt: 'Maça', nameEn: 'Mace', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_MACE', namePt: 'Maça Pesada', nameEn: 'Heavy Mace', category: 'weapons', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: '2H_HAMMER', namePt: 'Martelo', nameEn: 'Hammer', category: 'weapons', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },

  // --- ARMADURAS DE TECIDO (CLOTH) ---
  { id: 'ARMOR_CLOTH_SET1', namePt: 'Robe do Erudito', nameEn: "Scholar Robe", category: 'armor_cloth', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'ARMOR_CLOTH_SET2', namePt: 'Robe do Clérigo', nameEn: "Cleric Robe", category: 'armor_cloth', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'ARMOR_CLOTH_SET3', namePt: 'Robe do Mago', nameEn: "Mage Robe", category: 'armor_cloth', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'HEAD_CLOTH_SET1', namePt: 'Capuz do Erudito', nameEn: "Scholar Cowl", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'HEAD_CLOTH_SET2', namePt: 'Capuz do Clérigo', nameEn: "Cleric Cowl", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'HEAD_CLOTH_SET3', namePt: 'Capuz do Mago', nameEn: "Mage Cowl", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'SHOES_CLOTH_SET1', namePt: 'Sandálias do Erudito', nameEn: "Scholar Sandals", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'SHOES_CLOTH_SET2', namePt: 'Sandálias do Clérigo', nameEn: "Cleric Sandals", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },

  // --- ARMADURAS DE COURO (LEATHER) ---
  { id: 'ARMOR_LEATHER_SET1', namePt: 'Jaqueta do Mercenário', nameEn: "Mercenary Jacket", category: 'armor_leather', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'ARMOR_LEATHER_SET2', namePt: 'Jaqueta do Caçador', nameEn: "Hunter Jacket", category: 'armor_leather', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'ARMOR_LEATHER_SET3', namePt: 'Jaqueta do Assassino', nameEn: "Assassin Jacket", category: 'armor_leather', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'HEAD_LEATHER_SET1', namePt: 'Capuz do Mercenário', nameEn: "Mercenary Hood", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'HEAD_LEATHER_SET2', namePt: 'Capuz do Caçador', nameEn: "Hunter Hood", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'HEAD_LEATHER_SET3', namePt: 'Capuz do Assassino', nameEn: "Assassin Hood", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'SHOES_LEATHER_SET1', namePt: 'Sapatos do Mercenário', nameEn: "Mercenary Shoes", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'SHOES_LEATHER_SET3', namePt: 'Sapatos do Assassino', nameEn: "Assassin Shoes", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },

  // --- ARMADURAS DE PLACA (PLATE) ---
  { id: 'ARMOR_PLATE_SET1', namePt: 'Armadura do Soldado', nameEn: "Soldier Armor", category: 'armor_plate', weight: 9.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'ARMOR_PLATE_SET2', namePt: 'Armadura do Cavaleiro', nameEn: "Knight Armor", category: 'armor_plate', weight: 9.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'ARMOR_PLATE_SET3', namePt: 'Armadura do Guardião', nameEn: "Guardian Armor", category: 'armor_plate', weight: 9.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3] },
  { id: 'HEAD_PLATE_SET1', namePt: 'Elmo do Soldado', nameEn: "Soldier Helmet", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'HEAD_PLATE_SET2', namePt: 'Elmo do Cavaleiro', nameEn: "Knight Helmet", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'HEAD_PLATE_SET3', namePt: 'Elmo do Guardião', nameEn: "Guardian Helmet", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'SHOES_PLATE_SET1', namePt: 'Botas do Soldado', nameEn: "Soldier Boots", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'SHOES_PLATE_SET2', namePt: 'Botas do Cavaleiro', nameEn: "Knight Boots", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },

  // --- MÃO SECUNDÁRIA (OFFHANDS) ---
  { id: 'OFF_SHIELD', namePt: 'Escudo', nameEn: "Shield", category: 'offhands', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'OFF_TORCH', namePt: 'Tocha', nameEn: "Torch", category: 'offhands', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'OFF_BOOK', namePt: 'Tomo de Feitiços', nameEn: "Tome of Spells", category: 'offhands', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] },
  { id: 'OFF_HORN_KEEPER', namePt: 'Chamador da Névoa (Mistcaller)', nameEn: "Mistcaller", category: 'offhands', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2] }
];

export const QUALITIES = [
  { id: 1, name: 'Normal', color: '#94a3b8' },
  { id: 2, name: 'Bom (Good)', color: '#38bdf8' },
  { id: 3, name: 'Excepcional (Outstanding)', color: '#4ade80' },
  { id: 4, name: 'Excelente (Excellent)', color: '#c084fc' },
  { id: 5, name: 'Obra-Prima (Masterpiece)', color: '#f59e0b' }
];

// Montarias comuns para transporte e suas capacidades de carga aproximadas (kg)
export const TRANSPORT_MOUNTS = [
  { id: 'armored_horse_t5', name: 'Cavalo Blindado T5', maxLoadKg: 450, speed: 'Alta', safety: 'Alta (Resistência a dano)', recommended: true },
  { id: 'ox_t5', name: 'Boi de Transporte T5', maxLoadKg: 1600, speed: 'Lenta', safety: 'Média (Perigoso se descer do boi)', recommended: false },
  { id: 'ox_t6', name: 'Boi de Transporte T6', maxLoadKg: 2400, speed: 'Lenta', safety: 'Média', recommended: false },
  { id: 'grizzly_bear', name: 'Urso Cinzento T7 (Grizzly Bear)', maxLoadKg: 2100, speed: 'Média-Rápida', safety: 'Extrema (Habilidade Anti-Slow)', recommended: true },
  { id: 'spectral_direboar', name: 'Javali Espectral T7', maxLoadKg: 1100, speed: 'Muito Alta', safety: 'Extrema (Invisibilidade ativa)', recommended: true }
];

// Gera a lista expandida de IDs do Albion (ex: T4_BAG, T5_BAG, T4_MAIN_1H_SWORD@1)
export function getExpandedItemIdsList(filters = {}) {
  const result = [];
  const minTier = filters.minTier || 4;
  const maxTier = filters.maxTier || 8;
  const targetCategory = filters.category || 'all';

  for (const item of ITEMS_CATALOG) {
    if (targetCategory !== 'all' && item.category !== targetCategory) {
      continue;
    }

    for (const tier of item.tiers) {
      if (tier < minTier || tier > maxTier) continue;

      for (const ench of item.enchantments) {
        if (filters.enchantment !== undefined && filters.enchantment !== null && filters.enchantment !== 'all') {
          if (ench !== Number(filters.enchantment)) continue;
        }

        const baseId = `T${tier}_${item.id}`;
        const fullId = ench > 0 ? `${baseId}@${ench}` : baseId;

        result.push({
          fullId,
          baseId,
          tier,
          enchantment: ench,
          namePt: ench > 0 ? `${item.namePt} T${tier}.${ench}` : `${item.namePt} T${tier}`,
          nameEn: ench > 0 ? `${item.nameEn} T${tier}.${ench}` : `${item.nameEn} T${tier}`,
          category: item.category,
          weight: item.weight * (1 + tier * 0.1)
        });
      }
    }
  }

  return result;
}
