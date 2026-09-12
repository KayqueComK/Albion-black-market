// Catálogo de itens do Albion Online para Arbitragem Lymhurst -> Caerleon (Black Market & Mercado Real)
// Inclui Equipamentos Meta, Ferramentas de Coleta, Recursos Refinados e Consumíveis de Alto Valor
// Cada item possui indicação de nível de demanda ('ultra' | 'high' | 'normal') e justificativa tática.

export const ITEM_CATEGORIES = [
  { id: 'all', name: 'Todas as Categorias', icon: 'layers' },
  { id: 'high_demand', name: '🔥 Alta Demanda / Giro Rápido', icon: 'flame' },
  { id: 'gathering_tools', name: '⛏️ Ferramentas de Coleta', icon: 'pickaxe' },
  { id: 'resources', name: '🪵 Recursos Refinados (Lymhurst)', icon: 'box' },
  { id: 'consumables', name: '🧪 Consumíveis & Poções', icon: 'flask' },
  { id: 'weapons', name: 'Armas', icon: 'swords' },
  { id: 'armor_cloth', name: 'Armadura (Tecido)', icon: 'shield' },
  { id: 'armor_leather', name: 'Armadura (Couro)', icon: 'shield' },
  { id: 'armor_plate', name: 'Armadura (Placa)', icon: 'shield' },
  { id: 'accessories', name: 'Bolsas e Capas', icon: 'briefcase' },
  { id: 'gathering_gear', name: 'Trajes de Coleta', icon: 'shirt' },
  { id: 'offhands', name: 'Mão Secundária', icon: 'shield' }
];

export const ITEMS_CATALOG = [
  // --- BOLSAS & CAPAS (GIRO ULTRA RÁPIDO NO BLACK MARKET) ---
  { id: 'BAG', namePt: 'Bolsa', nameEn: 'Bag', category: 'accessories', weight: 1.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: 'Maior rotatividade de compra do BM. Baús de masmorras dropam sem parar.' },
  { id: 'CAPE', namePt: 'Capa Comum', nameEn: 'Cape', category: 'accessories', weight: 1.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: 'Presente em praticamente todas as tabelas de drop de criaturas e baús de Albion.' },

  // --- FERRAMENTAS DE COLETA (MUITO PROCURADAS NO BM E CAERLEON) ---
  { id: '2H_TOOL_PICK', namePt: 'Picareta de Minerador', nameEn: 'Miner Pickaxe', category: 'gathering_tools', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'ultra', demandReason: 'Ferramenta mais negociada. Mineradores compram em Caerleon e o BM recompra continuamente.' },
  { id: '2H_TOOL_WOODAXE', namePt: 'Machado de Lenhador', nameEn: 'Lumberjack Axe', category: 'gathering_tools', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'ultra', demandReason: 'Insumo florestal de Lymhurst de alto valor para levar a Caerleon.' },
  { id: '2H_TOOL_SKINNINGKNIFE', namePt: 'Faca de Esfolador', nameEn: 'Skinning Knife', category: 'gathering_tools', weight: 3.0, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'high', demandReason: 'Usada para caça e esfolamento em estepes e pântanos próximos.' },
  { id: '2H_TOOL_SICKLE', namePt: 'Foice de Colhedor', nameEn: 'Sickle', category: 'gathering_tools', weight: 3.0, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'high', demandReason: 'Ferramenta comum em drops de baús solo e de grupo.' },
  { id: '2H_TOOL_HAMMER', namePt: 'Martelo de Britador', nameEn: 'Stone Hammer', category: 'gathering_tools', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'normal', demandReason: 'Ferramenta de britagem e cantaria.' },
  { id: '2H_TOOL_FISHINGROD', namePt: 'Vara de Pesca', nameEn: 'Fishing Rod', category: 'gathering_tools', weight: 3.0, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'high', demandReason: 'Pescadores de água doce compram em Caerleon para expedições nas Red Zones.' },

  // --- TRAJES DE COLETA ---
  { id: 'ARMOR_GATHERER_WOOD', namePt: 'Traje de Lenhador', nameEn: 'Lumberjack Garb', category: 'gathering_gear', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'high', demandReason: 'Uniforme tradicional com escudo protetor para quem coleta madeira.' },
  { id: 'ARMOR_GATHERER_ORE', namePt: 'Traje de Minerador', nameEn: 'Miner Garb', category: 'gathering_gear', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'high', demandReason: 'Muito valorizado pela habilidade de disparada com escudo em fugas de gankers.' },
  { id: 'ARMOR_GATHERER_HIDE', namePt: 'Traje de Esfolador', nameEn: 'Skinner Garb', category: 'gathering_gear', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'high', demandReason: 'Traje de esfolamento com aumento de rendimento de couro.' },
  { id: 'ARMOR_GATHERER_FIBER', namePt: 'Traje de Colhedor', nameEn: 'Harvester Garb', category: 'gathering_gear', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0], demandLevel: 'normal', demandReason: 'Traje de colheita para biomas pantanosos.' },

  // --- RECURSOS REFINADOS (ARBITRAGEM ROYAL & BLACK MARKET CRAFTING) ---
  { id: 'PLANKS', namePt: 'Tábuas de Madeira', nameEn: 'Planks', category: 'resources', weight: 0.5, tiers: [4, 5, 6, 7], enchantments: [0, 1], demandLevel: 'ultra', demandReason: '⭐ BÔNUS DE LYMHURST: Lymhurst refina madeira mais barato. Artesãos de Caerleon compram para fabricar arcos e cajados do BM!' },
  { id: 'LEATHER', namePt: 'Couro Trabalhado', nameEn: 'Worked Leather', category: 'resources', weight: 0.5, tiers: [4, 5, 6, 7], enchantments: [0, 1], demandLevel: 'ultra', demandReason: 'Insumo central para fabricação de todas as jaquetas de couro e sapatos vendidos no BM.' },
  { id: 'CLOTH', namePt: 'Tecido', nameEn: 'Cloth', category: 'resources', weight: 0.5, tiers: [4, 5, 6, 7], enchantments: [0, 1], demandLevel: 'high', demandReason: 'Insumo básico para robes de pano, capuzes e bolsas.' },
  { id: 'METALBAR', namePt: 'Barra de Metal', nameEn: 'Metal Bar', category: 'resources', weight: 0.6, tiers: [4, 5, 6, 7], enchantments: [0, 1], demandLevel: 'high', demandReason: 'Matéria-prima de armaduras de placas, espadas e martelos.' },
  { id: 'STONEBLOCK', namePt: 'Bloco de Pedra', nameEn: 'Stone Block', category: 'resources', weight: 0.8, tiers: [4, 5, 6, 7], enchantments: [0], demandLevel: 'normal', demandReason: 'Material para manutenção e melhorias de bancadas em Caerleon.' },

  // --- CONSUMÍVEIS, POÇÕES E COMIDAS (ALTA DEMANDA EM CAERLEON) ---
  { id: 'MEAL_PIE', namePt: 'Torta de Porco', nameEn: 'Pork Pie', category: 'consumables', weight: 0.2, tiers: [7], enchantments: [0], demandLevel: 'ultra', demandReason: 'Item obrigatório para contrabandistas e coletores (+30% de capacidade de carga e rendimento).' },
  { id: 'MEAL_OMELETTE', namePt: 'Omelete de Porco', nameEn: 'Pork Omelette', category: 'consumables', weight: 0.2, tiers: [7], enchantments: [0], demandLevel: 'ultra', demandReason: 'Redução de tempo de recarga essencial para gankers e defensores em Caerleon.' },
  { id: 'MEAL_STEW', namePt: 'Ensopado de Carne', nameEn: 'Beef Stew', category: 'consumables', weight: 0.2, tiers: [6, 8], enchantments: [0], demandLevel: 'high', demandReason: 'Bônus de dano direto para quem caça ou luta nas zonas vermelhas.' },
  { id: 'POTION_REVIVE', namePt: 'Poção de Invisibilidade', nameEn: 'Invisibility Potion', category: 'consumables', weight: 0.2, tiers: [4, 6, 8], enchantments: [0], demandLevel: 'ultra', demandReason: '🛡️ ITEM DE SOBREVIVÊNCIA: Venda veloz em Caerleon. Todo transportador e ganker carrega no inventário.' },
  { id: 'POTION_HEAL', namePt: 'Poção de Cura', nameEn: 'Healing Potion', category: 'consumables', weight: 0.2, tiers: [4, 6], enchantments: [0], demandLevel: 'high', demandReason: 'Consumível universal para combate solo e em grupo.' },
  { id: 'POTION_COOLDOWN', namePt: 'Poção de Veneno', nameEn: 'Poison Potion', category: 'consumables', weight: 0.2, tiers: [4, 6], enchantments: [0], demandLevel: 'high', demandReason: 'Usada para desacelerar e desmontar montarias de outros jogadores.' },
  { id: 'POTION_ENERGY', namePt: 'Poção de Energia', nameEn: 'Energy Potion', category: 'consumables', weight: 0.2, tiers: [4, 6], enchantments: [0], demandLevel: 'normal', demandReason: 'Regeneração rápida de mana em masmorras.' },

  // --- ESPADAS ---
  { id: 'MAIN_1H_SWORD', namePt: 'Espada Larga', nameEn: 'Broadsword', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Uma das armas 1H mais populares do jogo para duelos e masmorras corrompidas.' },
  { id: '2H_CLAYMORE', namePt: 'Montante (Claymore)', nameEn: 'Claymore', category: 'weapons', weight: 6.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Excelente para abates rápidos e caça em Red Zone.' },
  { id: '2H_DUALSWORD', namePt: 'Espadas Duplas', nameEn: 'Dual Swords', category: 'weapons', weight: 5.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Meta absoluto de mobilidade e PvE; altíssimo volume de ordens no BM.' },
  { id: 'MAIN_SCIMITAR_MORGANA', namePt: 'Espada Entalhada (Carving)', nameEn: 'Carving Sword', category: 'weapons', weight: 5.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Arma de grupo essencial para redução de resistência mágica e física.' },

  // --- MACHADOS ---
  { id: 'MAIN_AXE', namePt: 'Machado de Batalha', nameEn: 'Battleaxe', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Auto-cura absurda; preferência nacional para masmorras solo.' },
  { id: '2H_AXE', namePt: 'Machadão', nameEn: 'Greataxe', category: 'weapons', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Giro de dano em área muito dropado e consumido.' },
  { id: '2H_HALBERD', namePt: 'Alabarda', nameEn: 'Halberd', category: 'weapons', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Arma de sangramento em área para pequenos grupos.' },

  // --- ARCOS & BESTAS ---
  { id: '2H_BOW', namePt: 'Arco Comum', nameEn: 'Bow', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Arma de iniciante e veterano com DPS contínuo gigantesco; venda garantida no BM.' },
  { id: '2H_WARBOW', namePt: 'Arco de Guerra', nameEn: 'Warbow', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Arco clássico para ganks e emboscadas à distância.' },
  { id: '2H_LONGBOW', namePt: 'Arco Longo', nameEn: 'Longbow', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Chuva de flechas indispensável para masmorras de grupo.' },
  { id: '2H_CROSSBOW', namePt: 'Besta', nameEn: 'Crossbow', category: 'weapons', weight: 5.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Sniper shot com altíssimo dano explosivo.' },
  { id: 'MAIN_1HCROSSBOW', namePt: 'Besta Leve', nameEn: 'Light Crossbow', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Besta de maior DPS em área para masmorras rápidas.' },
  { id: '2H_REPEATINGCROSSBOW', namePt: 'Lançadora de Dardos (Boltcasters)', nameEn: 'Boltcasters', category: 'weapons', weight: 6.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Canalização mortal em alvos isolados.' },

  // --- ADAGAS ---
  { id: 'MAIN_DAGGER', namePt: 'Adaga', nameEn: 'Dagger', category: 'weapons', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Derrete chefes de masmorra em segundos; compras frequentes no BM.' },
  { id: '2H_DAGGERPAIR', namePt: 'Par de Adagas', nameEn: 'Dagger Pair', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Finalização em execução com burst damage.' },
  { id: '2H_CLAWPAIR', namePt: 'Garras', nameEn: 'Claws', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Arma favorita de gankers em zonas vermelhas para aprisionar alvos.' },
  { id: 'MAIN_RAPIER_MORGANA', namePt: 'Sanguinária (Bloodletter)', nameEn: 'Bloodletter', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: 'Mobilidade suprema de corrida dupla usada por coletores e transportadores.' },

  // --- CAJADOS ---
  { id: 'MAIN_NATURESTAFF', namePt: 'Cajado da Natureza', nameEn: 'Nature Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Rei da limpeza solo de masmorras com círculo de cura.' },
  { id: 'MAIN_HOLYSTAFF', namePt: 'Cajado Sagrado', nameEn: 'Holy Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Cura pura necessária em todos os grupos de Caerleon.' },
  { id: 'MAIN_FIRESTAFF', namePt: 'Cajado Ígneo', nameEn: 'Fire Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Dano de queima contínuo de altíssima procura no BM.' },
  { id: 'MAIN_FROSTSTAFF', namePt: 'Cajado de Gelo', nameEn: 'Frost Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Controle de grupo e desaceleração constante.' },
  { id: 'MAIN_CURSEDSTAFF', namePt: 'Cajado Amaldiçoado', nameEn: 'Cursed Staff', category: 'weapons', weight: 4.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Acúmulo de maldição que destrói oponentes 1v1.' },

  // --- MACAS & MARTELOS ---
  { id: 'MAIN_MACE', namePt: 'Maça', nameEn: 'Mace', category: 'weapons', weight: 4.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Atordoamento e controle para ganks e lutas de grupo.' },
  { id: '2H_MACE', namePt: 'Maça Pesada', nameEn: 'Heavy Mace', category: 'weapons', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Silenciamento em área vital para engajar em Red Zone.' },
  { id: '2H_HAMMER', namePt: 'Martelo', nameEn: 'Hammer', category: 'weapons', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'normal', demandReason: 'Controle de área com desaceleração de oponentes.' },

  // --- ARMADURAS DE TECIDO (CLOTH) ---
  { id: 'ARMOR_CLOTH_SET1', namePt: 'Robe do Erudito', nameEn: "Scholar Robe", category: 'armor_cloth', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Velocidade de conjuração muito usada por bestas e magos de fogo.' },
  { id: 'ARMOR_CLOTH_SET2', namePt: 'Robe do Clérigo', nameEn: "Cleric Robe", category: 'armor_cloth', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: '🏆 O robe com escudo invulnerável mais comprado em todo o Black Market.' },
  { id: 'ARMOR_CLOTH_SET3', namePt: 'Robe do Mago', nameEn: "Mage Robe", category: 'armor_cloth', weight: 5.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Bônus de dano bruto supremo e purgação de buffs de gankers.' },
  { id: 'HEAD_CLOTH_SET1', namePt: 'Capuz do Erudito', nameEn: "Scholar Cowl", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: 'Escudo que regenera mana absorvendo dano; uso maciço no BM.' },
  { id: 'HEAD_CLOTH_SET2', namePt: 'Capuz do Clérigo', nameEn: "Cleric Cowl", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Bloco de gelo protetor para salvar em emboscadas.' },
  { id: 'HEAD_CLOTH_SET3', namePt: 'Capuz do Mago', nameEn: "Mage Cowl", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: 'Veneno de cabeça muito usado para infligir dano suplementar.' },
  { id: 'SHOES_CLOTH_SET1', namePt: 'Sandálias do Erudito', nameEn: "Scholar Sandals", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Corrida focada imune a lentidão e recarga de energia.' },
  { id: 'SHOES_CLOTH_SET2', namePt: 'Sandálias do Clérigo', nameEn: "Cleric Sandals", category: 'armor_cloth', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Teleporte curto evasivo.' },

  // --- ARMADURAS DE COURO (LEATHER) ---
  { id: 'ARMOR_LEATHER_SET1', namePt: 'Jaqueta do Mercenário', nameEn: "Mercenary Jacket", category: 'armor_leather', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: '🏆 A jaqueta com auto-cura por golpe mais comprada em todo o jogo.' },
  { id: 'ARMOR_LEATHER_SET2', namePt: 'Jaqueta do Caçador', nameEn: "Hunter Jacket", category: 'armor_leather', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Acelera velocidade de ataque bruscamente para arcos e adagas.' },
  { id: 'ARMOR_LEATHER_SET3', namePt: 'Jaqueta do Assassino', nameEn: "Assassin Jacket", category: 'armor_leather', weight: 6.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Invisibilidade de longa duração vital para sobrevivência e ganks nas Red Zones.' },
  { id: 'HEAD_LEATHER_SET1', namePt: 'Capuz do Mercenário', nameEn: "Mercenary Hood", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Limpeza de efeitos negativos (CC clean).' },
  { id: 'HEAD_LEATHER_SET2', namePt: 'Capuz do Caçador', nameEn: "Hunter Hood", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: 'Reflete 100% do dano sofrido; item obrigatório em PvP 1v1.' },
  { id: 'HEAD_LEATHER_SET3', namePt: 'Capuz do Assassino', nameEn: "Assassin Hood", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Canalização para recarga quase instantânea de habilidades.' },
  { id: 'SHOES_LEATHER_SET1', namePt: 'Sapatos do Mercenário', nameEn: "Mercenary Shoes", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Corrida de aceleração com invisibilidade ou bônus de velocidade.' },
  { id: 'SHOES_LEATHER_SET3', namePt: 'Sapatos do Assassino', nameEn: "Assassin Shoes", category: 'armor_leather', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Salto acrobático imune a dano durante a animação.' },

  // --- ARMADURAS DE PLACA (PLATE) ---
  { id: 'ARMOR_PLATE_SET1', namePt: 'Armadura do Soldado', nameEn: "Soldier Armor", category: 'armor_plate', weight: 9.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'ultra', demandReason: 'Acúmulo de Fúria (+dano e +resistência); a armadura de placa favorita para PvE e PvP.' },
  { id: 'ARMOR_PLATE_SET2', namePt: 'Armadura do Cavaleiro', nameEn: "Knight Armor", category: 'armor_plate', weight: 9.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Muralha de vento que bloqueia passagem de gankers.' },
  { id: 'ARMOR_PLATE_SET3', namePt: 'Armadura do Guardião', nameEn: "Guardian Armor", category: 'armor_plate', weight: 9.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2, 3], demandLevel: 'high', demandReason: 'Reduz dano de inimigos ao redor pela metade.' },
  { id: 'HEAD_PLATE_SET1', namePt: 'Elmo do Soldado', nameEn: "Soldier Helmet", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: 'Escudo de bloco inquebrável por alguns segundos; muito procurado no BM.' },
  { id: 'HEAD_PLATE_SET2', namePt: 'Elmo do Cavaleiro', nameEn: "Knight Helmet", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Imunidade total a empurrões e controle para passar bloqueios.' },
  { id: 'HEAD_PLATE_SET3', namePt: 'Elmo do Guardião', nameEn: "Guardian Helmet", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Escudo protetor que limpa sangramentos e venenos de dano contínuo.' },
  { id: 'SHOES_PLATE_SET1', namePt: 'Botas do Soldado', nameEn: "Soldier Boots", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: '🏆 Disparada de longa distância com cura e velocidade cumulativa; bota mais usada para transporte e fuga.' },
  { id: 'SHOES_PLATE_SET2', namePt: 'Botas do Cavaleiro', nameEn: "Knight Boots", category: 'armor_plate', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Escudo protetor compartilhado com aliados.' },

  // --- MÃO SECUNDÁRIA (OFFHANDS) ---
  { id: 'OFF_SHIELD', namePt: 'Escudo', nameEn: "Shield", category: 'offhands', weight: 3.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Defesa passiva clássica e redução de controle.' },
  { id: 'OFF_TORCH', namePt: 'Tocha', nameEn: "Torch", category: 'offhands', weight: 2.0, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: 'Acelera velocidade de ataque e redução de tempo de recarga; altíssimo volume de compras.' },
  { id: 'OFF_BOOK', namePt: 'Tomo de Feitiços', nameEn: "Tome of Spells", category: 'offhands', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'ultra', demandReason: 'Offhand essencial para curandeiros e magos em geral.' },
  { id: 'OFF_HORN_KEEPER', namePt: 'Chamador da Névoa (Mistcaller)', nameEn: "Mistcaller", category: 'offhands', weight: 2.5, tiers: [4, 5, 6, 7, 8], enchantments: [0, 1, 2], demandLevel: 'high', demandReason: 'Redução pura de recarga muito valorizada.' }
];

export const QUALITIES = [
  { id: 1, name: 'Normal', color: '#94a3b8' },
  { id: 2, name: 'Bom (Good)', color: '#38bdf8' },
  { id: 3, name: 'Excepcional (Outstanding)', color: '#4ade80' },
  { id: 4, name: 'Excelente (Excellent)', color: '#c084fc' },
  { id: 5, name: 'Obra-Prima (Masterpiece)', color: '#f59e0b' }
];

// Bolsas do Albion Online e seus bônus de capacidade de carga (kg)
export const BAGS_CATALOG = [
  { id: 'none', name: 'Sem Bolsa Adicional (Básico)', bonusKg: 0, tier: 0 },
  { id: 'bag_t4', name: 'Bolsa do Adepto T4 (+180 kg)', bonusKg: 180, tier: 4 },
  { id: 'bag_t4_1', name: 'Bolsa do Adepto T4.1 (+220 kg)', bonusKg: 220, tier: 4.1 },
  { id: 'bag_t5', name: 'Bolsa do Perito T5 (+275 kg)', bonusKg: 275, tier: 5 },
  { id: 'bag_t5_1', name: 'Bolsa do Perito T5.1 (+330 kg)', bonusKg: 330, tier: 5.1 },
  { id: 'bag_t6', name: 'Bolsa do Mestre T6 (+410 kg)', bonusKg: 410, tier: 6 },
  { id: 'bag_t6_1', name: 'Bolsa do Mestre T6.1 (+490 kg)', bonusKg: 490, tier: 6.1 },
  { id: 'bag_t7', name: 'Bolsa do Grão-Mestre T7 (+600 kg)', bonusKg: 600, tier: 7 },
  { id: 'bag_t7_1', name: 'Bolsa do Grão-Mestre T7.1 (+720 kg)', bonusKg: 720, tier: 7.1 },
  { id: 'bag_t8', name: 'Bolsa do Ancião T8 (+880 kg)', bonusKg: 880, tier: 8 },
  { id: 'bag_t8_1', name: 'Bolsa do Ancião T8.1 (+1.050 kg)', bonusKg: 1050, tier: 8.1 },
  { id: 'bag_t8_3', name: 'Bolsa do Ancião T8.3 (+1.500 kg)', bonusKg: 1500, tier: 8.3 }
];

// Montarias comuns para transporte e suas capacidades de carga aproximadas (kg)
export const TRANSPORT_MOUNTS = [
  { id: 'armored_horse_t5', name: 'Cavalo Blindado T5 (450 kg)', maxLoadKg: 450, speed: 'Alta', safety: 'Alta (Resistência a dano)', passiveWeight: true, recommended: true },
  { id: 'armored_horse_t6', name: 'Cavalo Blindado T6 (600 kg)', maxLoadKg: 600, speed: 'Alta', safety: 'Alta (Resistência a dano)', passiveWeight: true, recommended: true },
  { id: 'armored_horse_t7', name: 'Cavalo Blindado T7 (800 kg)', maxLoadKg: 800, speed: 'Alta', safety: 'Muito Alta', passiveWeight: true, recommended: true },
  { id: 'armored_horse_t8', name: 'Cavalo Blindado T8 (1.050 kg)', maxLoadKg: 1050, speed: 'Muito Alta', safety: 'Máxima', passiveWeight: true, recommended: true },
  { id: 'stag_t4', name: 'Cervo Gigante T4 (480 kg)', maxLoadKg: 480, speed: 'Muito Alta', safety: 'Média (Foco em agilidade)', passiveWeight: true, recommended: true },
  { id: 'spectral_direboar', name: 'Javali Espectral T7 (1.100 kg)', maxLoadKg: 1100, speed: 'Muito Alta', safety: 'Extrema (Invisibilidade ativa)', passiveWeight: true, recommended: true },
  { id: 'grizzly_bear', name: 'Urso Cinzento T7 (2.100 kg)', maxLoadKg: 2100, speed: 'Média-Rápida', safety: 'Extrema (Habilidade Anti-Slow)', passiveWeight: true, recommended: true },
  { id: 'swamp_salamander', name: 'Salamandra do Pântano T7 (650 kg)', maxLoadKg: 650, speed: 'Constante', safety: 'Alta (100% velocidade em combate)', passiveWeight: true, recommended: true },
  { id: 'ox_t4', name: 'Boi de Transporte T4 (1.000 kg)', maxLoadKg: 1000, speed: 'Lenta', safety: 'Baixa (Perigo fatal se desmontar)', passiveWeight: false, recommended: false },
  { id: 'ox_t5', name: 'Boi de Transporte T5 (1.600 kg)', maxLoadKg: 1600, speed: 'Lenta', safety: 'Baixa (Perigo fatal se desmontar)', passiveWeight: false, recommended: false },
  { id: 'ox_t6', name: 'Boi de Transporte T6 (2.400 kg)', maxLoadKg: 2400, speed: 'Lenta', safety: 'Baixa (Perigo fatal se desmontar)', passiveWeight: false, recommended: false },
  { id: 'ox_t7', name: 'Boi de Transporte T7 (3.500 kg)', maxLoadKg: 3500, speed: 'Lenta', safety: 'Baixa (Perigo fatal se desmontar)', passiveWeight: false, recommended: false },
  { id: 'ox_t8', name: 'Boi de Transporte T8 (5.200 kg)', maxLoadKg: 5200, speed: 'Lenta', safety: 'Baixa (Perigo fatal se desmontar)', passiveWeight: false, recommended: false }
];

// Sugestões Curadas de Alta Demanda e Fácil Venda em Caerleon
export const HIGH_DEMAND_RECOMMENDATIONS = [
  {
    id: 'sugg_bags',
    categoryTitle: 'Bolsas & Capas Comuns (T4 - T6)',
    icon: '🎒',
    liquidity: 'Giro Imediato',
    liquidityClass: 'ultra',
    description: 'Bolsas e capas caem em quase todos os baús de masmorra do mundo. O Black Market compra centenas por hora sem demora.',
    targetCategory: 'accessories',
    sampleItems: ['Bolsa T4.0 / T5.0', 'Capa T4.0 / T5.0'],
    sellMarket: 'Black Market'
  },
  {
    id: 'sugg_tools',
    categoryTitle: 'Ferramentas de Coleta (Picaretas & Machados T4 - T6)',
    icon: '⛏️',
    liquidity: 'Alta Demanda',
    liquidityClass: 'ultra',
    description: 'Picaretas e machados têm saída rápida tanto no Black Market (repondo drops de baús) quanto para coletores nas Red Zones.',
    targetCategory: 'gathering_tools',
    sampleItems: ['Picareta T4-T6', 'Machado de Lenhador T4-T6', 'Faca de Esfolador T4-T6'],
    sellMarket: 'Black Market & Caerleon'
  },
  {
    id: 'sugg_resources',
    categoryTitle: 'Tábuas de Madeira de Lymhurst (T4 - T6)',
    icon: '🪵',
    liquidity: 'Giro Constante',
    liquidityClass: 'high',
    description: 'Lymhurst tem o bônus regional de refino de madeira. Fabricantes de Caerleon compram tábuas para criar arcos e cajados do BM.',
    targetCategory: 'resources',
    sampleItems: ['Tábuas T4', 'Tábuas T4.1', 'Tábuas T5'],
    sellMarket: 'Caerleon (Mercado Real)'
  },
  {
    id: 'sugg_gear',
    categoryTitle: 'Equipamentos Meta PvE/PvP (T4.1 / T5.0 / T6.0)',
    icon: '⚔️',
    liquidity: 'Giro Imediato',
    liquidityClass: 'ultra',
    description: 'Robe do Clérigo, Jaqueta do Mercenário, Botas do Soldado, Espada Larga e Machadão são os itens mais dropados e recomprados pelo BM.',
    targetCategory: 'weapons',
    sampleItems: ['Robe do Clérigo T4.1', 'Jaqueta Mercenário T4.1', 'Botas Soldado T4.1', 'Espadas Duplas T5'],
    sellMarket: 'Black Market'
  },
  {
    id: 'sugg_consumables',
    categoryTitle: 'Tortas de Porco & Poções de Invisibilidade',
    icon: '🧪',
    liquidity: 'Alta Demanda',
    liquidityClass: 'high',
    description: 'Todo contrabandista e ganker que transita em Caerleon consome tortas de carga e poções de fuga. Preço estável e giro veloz.',
    targetCategory: 'consumables',
    sampleItems: ['Torta de Porco T7', 'Poção de Invisibilidade T4/T6', 'Poção de Cura T4/T6'],
    sellMarket: 'Caerleon (Mercado Real)'
  }
];

// Gera a lista expandida de IDs do Albion (ex: T4_BAG, T5_BAG, T4_MAIN_1H_SWORD@1)
export function getExpandedItemIdsList(filters = {}) {
  const result = [];
  const minTier = filters.minTier || 4;
  const maxTier = filters.maxTier || 8;
  const targetCategory = filters.category || 'all';
  const onlyHighDemand = filters.onlyHighDemand || false;

  for (const item of ITEMS_CATALOG) {
    if (targetCategory === 'high_demand') {
      if (item.demandLevel !== 'ultra' && item.demandLevel !== 'high') continue;
    } else if (targetCategory !== 'all' && item.category !== targetCategory) {
      continue;
    }

    if (onlyHighDemand && item.demandLevel !== 'ultra' && item.demandLevel !== 'high') {
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
          demandLevel: item.demandLevel || 'normal',
          demandReason: item.demandReason || '',
          isHighDemand: item.demandLevel === 'ultra' || item.demandLevel === 'high',
          weight: Math.max(0.2, Number((item.weight * (1 + (tier - 4) * 0.1)).toFixed(2)))
        });
      }
    }
  }

  return result;
}
