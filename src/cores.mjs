// Paletas de cor dentro de cada tema: o tema cuida da estética, a paleta escolhe as cores.
// A primeira paleta de cada tema é a padrão (as cores do próprio arquivo do tema) e não gera CSS.
// As outras são geradas por tools/gerar-cores.mjs (CSS), tools/gerar-ornamentos.mjs (cantos, florões e texturas)
// e tools/gerar-capas.mjs (capas e marcas d'água).

// Matizes da família sci-fi: a cor principal e a de destaque, no escuro (e) e no claro (c).
export const MATIZES_SCIFI = {
	ciano: { nome: 'Ciano', e: ['#7ee7ff', '#b48cff'], c: ['#0a7a99', '#6a3fc4'] },
	fosforo: { nome: 'Fósforo', e: ['#6dff9a', '#ffb000'], c: ['#11803f', '#a86400'] },
	ultravioleta: { nome: 'Ultravioleta', e: ['#a98bff', '#c4ff4d'], c: ['#5b36c9', '#4f7a00'] },
	sinal: { nome: 'Sinal', e: ['#ff8a3d', '#e9edf2'], c: ['#c2510f', '#2a3038'] },
	neon: { nome: 'Neon', e: ['#ff4fb0', '#ffe45c'], c: ['#b0136e', '#8a6a00'] },
	cobre: { nome: 'Cobre', e: ['#e8925a', '#3fd0c0'], c: ['#b0541e', '#0f7f74'] },
	ambar: { nome: 'Âmbar', e: ['#ffb547', '#f2ede4'], c: ['#a8620a', '#3a3226'] },
	escarlate: { nome: 'Escarlate', e: ['#ff4545', '#bdeeff'], c: ['#b81c22', '#1f6f8a'] },
	gelo: { nome: 'Gelo', e: ['#cfe8ff', '#ff9ec7'], c: ['#2f5f8a', '#b03a72'] },
	dourado: { nome: 'Dourado', e: ['#ffd27a', '#7aa8ff'], c: ['#8a6a10', '#2f4fae'] },
};

// Paletas da família fantasia. Cada uma define a capa de material (couro), o metal dos ornamentos (ouro),
// a tinta, a cor de destaque (rubrica) e o papel; os campos a mais são as cores da arte da capa de cada tema.
// A primeira de cada tema só tem o nome: as cores dela estão no arquivo do tema.
export const PALETAS_FANTASIA = {
	grimorio: {
		couro: { nome: 'Couro e ouro' },
		ebano: { nome: 'Ébano e prata', couro: '#1a1a1f', ouro: '#b8bcc8', tinta: '#1c1d26', rubrica: '#2b3f7a', papel: '#e9e6df' },
		carmesim: { nome: 'Carmesim', couro: '#3a0d10', ouro: '#d4a24a', tinta: '#2a1010', rubrica: '#8f1a1f', papel: '#efdcc4' },
		esmeralda: { nome: 'Esmeralda', couro: '#0f2a1e', ouro: '#c9a55a', tinta: '#18241c', rubrica: '#1f6b45', papel: '#e8e3cc' },
		safira: { nome: 'Safira', couro: '#10203f', ouro: '#c9c2a0', tinta: '#141c2e', rubrica: '#2a4f9a', papel: '#e6e4dc' },
		ametista: { nome: 'Ametista', couro: '#24123a', ouro: '#d4b06a', tinta: '#1e1428', rubrica: '#6a2c8f', papel: '#ece2ea' },
	},
	bosque: {
		musgo: { nome: 'Musgo' },
		outono: { nome: 'Outono', couro: '#2a160c', ouro: '#d9a441', tinta: '#2a1c10', rubrica: '#a3471c', papel: '#f1e6cf', folha: '#c2672a', luz: '#ffd27a' },
		inverno: { nome: 'Inverno', couro: '#14222e', ouro: '#c9d6e3', tinta: '#1a2530', rubrica: '#2f5f7f', papel: '#eef2f4', folha: '#8fb3c4', luz: '#dff4ff' },
		cerejeira: { nome: 'Cerejeira', couro: '#2a1420', ouro: '#e3b8c0', tinta: '#2a1820', rubrica: '#a33a5e', papel: '#f6eaee', folha: '#e6a1b5', luz: '#fff0f5' },
		crepusculo: { nome: 'Crepúsculo', couro: '#1d1430', ouro: '#c8b0e8', tinta: '#1e1828', rubrica: '#6b3fa0', papel: '#efeaf3', folha: '#6f5aa8', luz: '#ffc8f0' },
		dourado: { nome: 'Dourado', couro: '#2a2410', ouro: '#e0c060', tinta: '#262010', rubrica: '#8a6a10', papel: '#f4eed8', folha: '#b89a2e', luz: '#fff2a8' },
	},
	vitral: {
		catedral: { nome: 'Catedral' },
		ambar: { nome: 'Âmbar', couro: '#1e1810', ouro: '#d8b46a', tinta: '#1f1a12', rubrica: '#8a5a10', papel: '#efe9dc', vidros: ['#c98a2a', '#b8455a', '#e0c060'] },
		gelo: { nome: 'Gelo', couro: '#121820', ouro: '#c9d6e3', tinta: '#151c24', rubrica: '#2f5f8a', papel: '#eef1f4', vidros: ['#7fb0d8', '#c9e4f0', '#4f74c9'] },
		ametista: { nome: 'Ametista', couro: '#1a1424', ouro: '#c8b0e8', tinta: '#1a1424', rubrica: '#6a2c8f', papel: '#efeaf3', vidros: ['#8a5ac9', '#c95a9a', '#4f5ac9'] },
		esmeralda: { nome: 'Esmeralda', couro: '#101a14', ouro: '#b8c9a8', tinta: '#121a14', rubrica: '#1f6b45', papel: '#e9eee8', vidros: ['#3f9a6a', '#8ab84a', '#2f8a8a'] },
		rubi: { nome: 'Rubi', couro: '#1c1012', ouro: '#d4a24a', tinta: '#1c1214', rubrica: '#8f1a1f', papel: '#f0e6e2', vidros: ['#b8253a', '#d86a2a', '#7a1a4a'] },
	},
	forja: {
		bronze: { nome: 'Bronze' },
		mithril: { nome: 'Mithril', couro: '#181c22', ouro: '#b8c4d4', tinta: '#1a1e24', rubrica: '#2f6f9a', papel: '#e6e8ea', brasa: '#6ad0ff' },
		ouro: { nome: 'Ouro anão', couro: '#1e1a12', ouro: '#e0b84a', tinta: '#221d14', rubrica: '#a8620a', papel: '#ece4d0', brasa: '#ffc04a' },
		verde: { nome: 'Brasa verde', couro: '#141a16', ouro: '#8fa878', tinta: '#161c18', rubrica: '#3a7a3a', papel: '#e4e8e0', brasa: '#7dff6a' },
		sangue: { nome: 'Sangue', couro: '#1c1010', ouro: '#b06a4a', tinta: '#1e1212', rubrica: '#9a1a1a', papel: '#e8dfd8', brasa: '#ff3a2a' },
		obsidiana: { nome: 'Obsidiana', couro: '#121014', ouro: '#9a7ab8', tinta: '#161218', rubrica: '#6a3a9a', papel: '#e6e2ea', brasa: '#c48aff' },
	},
	mapa: {
		explorador: { nome: 'Explorador' },
		antigo: { nome: 'Antigo', couro: '#2a1e12', ouro: '#a88a5a', tinta: '#3b2a18', rubrica: '#7a3a1a', papel: '#ead9b0', mar: '#6a5a3a', floresta: '#6a6a3a', rota: '#7a2a1a' },
		pirata: { nome: 'Pirata', couro: '#10161e', ouro: '#c9a55a', tinta: '#1e1a14', rubrica: '#8f1a1f', papel: '#e9dcb8', mar: '#1f4a6a', floresta: '#4a6a3a', rota: '#8f1a1f' },
		artico: { nome: 'Ártico', couro: '#142430', ouro: '#9ab0c0', tinta: '#1a2a36', rubrica: '#2f6f9a', papel: '#eef2f2', mar: '#5a9ac0', floresta: '#5a7a6a', rota: '#b03a3a' },
		deserto: { nome: 'Deserto', couro: '#2e1a10', ouro: '#d8a860', tinta: '#3a2414', rubrica: '#b0541e', papel: '#f2e0c0', mar: '#2a8a8a', floresta: '#9a8a3a', rota: '#a3321f' },
		selva: { nome: 'Selva', couro: '#0f2418', ouro: '#c9b06a', tinta: '#1a2a1a', rubrica: '#2f7a4a', papel: '#e8e6c8', mar: '#2a6a7a', floresta: '#3a7a2a', rota: '#b0541e' },
	},
	abissal: {
		abismo: { nome: 'Abismo' },
		recife: { nome: 'Recife', couro: '#062a30', ouro: '#8fd8d0', tinta: '#0e2e36', rubrica: '#c8502e', papel: '#eef6f2', agua: ['#2a9aa8', '#0b4a55', '#03202a'], luzAgua: '#e0fff8', alga: '#1a6a4a', areia: '#0b3a3a', coral: '#ff7a4a', medusa: '#ffd0e8' },
		fossa: { nome: 'Fossa', couro: '#04080e', ouro: '#6a8ab8', tinta: '#0c1424', rubrica: '#3a62c0', papel: '#e8ecf2', agua: ['#1a2a4a', '#0a1424', '#02050a'], luzAgua: '#a8c8ff', alga: '#10283a', areia: '#0a1220', coral: '#6a8ae0', medusa: '#8af0ff' },
		bioluminescente: { nome: 'Bioluminescente', couro: '#050f14', ouro: '#6af0c8', tinta: '#08222a', rubrica: '#1f8a6a', papel: '#e6f2ee', agua: ['#0e3a44', '#062028', '#020a0e'], luzAgua: '#8affd8', alga: '#0a3a30', areia: '#061a1c', coral: '#3affc0', medusa: '#a8ff6a' },
		coral: { nome: 'Coral', couro: '#2a1218', ouro: '#f0b0a0', tinta: '#2a1418', rubrica: '#b03a50', papel: '#f6ece8', agua: ['#5a8aa0', '#2a4a5a', '#10202a'], luzAgua: '#ffe8e0', alga: '#3a5a4a', areia: '#2a2a2a', coral: '#ff6a7a', medusa: '#ffb0c8' },
		kraken: { nome: 'Kraken', couro: '#120a1a', ouro: '#a88ad0', tinta: '#1a1226', rubrica: '#7a3ab0', papel: '#ece8f2', agua: ['#3a2a5a', '#1a1030', '#08040e'], luzAgua: '#e0c8ff', alga: '#2a1a3a', areia: '#140a1c', coral: '#b04ad0', medusa: '#ff8ae0' },
	},
};

// Paletas da família Astra: a cor de destaque (acento), o fundo (bg) e a tinta, no escuro (e) e no claro (c).
// A Nebulosa tem três cores de destaque (acento, pêssego e lilás) e o giro de matiz da galáxia da capa;
// o Codex é definido pelo ouro, pela tinta e pelo papel, e o modo escuro sai deles.
const ASTRA_CEU = {
	prata: { nome: 'Prata', e: { acento: '#d6dce8', bg: '#0b0e16', tinta: '#eef1f6' }, c: { acento: '#4a5a78', bg: '#f4f6f9', tinta: '#141a26' } },
	rosa: { nome: 'Rosa', e: { acento: '#f2b8c6', bg: '#0e0a12', tinta: '#f8eef2' }, c: { acento: '#a3405e', bg: '#faf3f5', tinta: '#24121a' } },
	aurora: { nome: 'Aurora', e: { acento: '#7ff0c8', bg: '#06121a', tinta: '#e8fbf4' }, c: { acento: '#0f7f6a', bg: '#f1faf7', tinta: '#0e2420' } },
	ametista: { nome: 'Ametista', e: { acento: '#c8a8ff', bg: '#0c0a1c', tinta: '#f1ecfb' }, c: { acento: '#6a3fc4', bg: '#f6f3fc', tinta: '#1a1430' } },
	solar: { nome: 'Solar', e: { acento: '#ffb36b', bg: '#120a06', tinta: '#fdf0e6' }, c: { acento: '#b0541e', bg: '#fdf6ef', tinta: '#2a160c' } },
};
export const PALETAS_ASTRA = {
	constelacao: { ouro: { nome: 'Ouro' }, ...ASTRA_CEU },
	classico: {
		pessego: { nome: 'Pêssego' },
		azul: { nome: 'Azul', e: { acento: '#8fb8e3', bg: '#0a1020', tinta: '#eef3fa' }, c: { acento: '#2f5f8a', bg: '#f5f8fb', tinta: '#111c2a' } },
		verde: { nome: 'Verde', e: { acento: '#9fd8a8', bg: '#08140e', tinta: '#eef8f0' }, c: { acento: '#2f7a4a', bg: '#f4f9f5', tinta: '#10201a' } },
		rubi: { nome: 'Rubi', e: { acento: '#e38f9a', bg: '#140a0e', tinta: '#faeef0' }, c: { acento: '#9a2a3a', bg: '#fbf4f5', tinta: '#2a1016' } },
		lavanda: { nome: 'Lavanda', e: { acento: '#c3a8e8', bg: '#0e0a1a', tinta: '#f3eefb' }, c: { acento: '#6b4a9a', bg: '#f7f4fb', tinta: '#1e1630' } },
		areia: { nome: 'Areia', e: { acento: '#e3cf8f', bg: '#12100a', tinta: '#faf6e8' }, c: { acento: '#7a6420', bg: '#faf7ee', tinta: '#26200e' } },
	},
	observatorio: {
		latao: { nome: 'Latão' },
		prata: { nome: 'Prata', e: { acento: '#c9ccd6', bg: '#101113', tinta: '#eceef2' }, c: { acento: '#5a6070', bg: '#f2f2f4', tinta: '#1c1e24' } },
		cobre: { nome: 'Cobre', e: { acento: '#d8875a', bg: '#140e0b', tinta: '#f4e6dc' }, c: { acento: '#9a4a1e', bg: '#f6ece4', tinta: '#2a160c' } },
		patina: { nome: 'Pátina', e: { acento: '#8fc4a8', bg: '#0c1210', tinta: '#e4f2ea' }, c: { acento: '#2f6f52', bg: '#eef4f0', tinta: '#12241c' } },
		aco: { nome: 'Aço', e: { acento: '#8fb0d6', bg: '#0c1014', tinta: '#e6eef6' }, c: { acento: '#2f5480', bg: '#eef2f6', tinta: '#121c28' } },
		rosado: { nome: 'Ouro rosé', e: { acento: '#e0a8a0', bg: '#140e0e', tinta: '#f6e8e6' }, c: { acento: '#9a4a44', bg: '#f8eeec', tinta: '#2a1614' } },
	},
	nebulosa: {
		rosa: { nome: 'Rosa' },
		aurora: { nome: 'Aurora', e: { acento: '#8affc8', pessego: '#7ee7ff', lilas: '#b9a6ff', bg: '#06121a', tinta: '#f0fbf7', matiz: '-110deg' }, c: { acento: '#0f7f5e', pessego: '#0a6a8a', lilas: '#5b46b8', bg: '#eef7f4', tinta: '#0e2420' } },
		oceano: { nome: 'Oceano', e: { acento: '#7ec8ff', pessego: '#8affea', lilas: '#a6b4ff', bg: '#060c1c', tinta: '#eef6ff', matiz: '170deg' }, c: { acento: '#1f5fa8', pessego: '#0f7f74', lilas: '#3a46b8', bg: '#eef3fa', tinta: '#0e1a2c' } },
		fogo: { nome: 'Fogo', e: { acento: '#ffb07a', pessego: '#ffd27a', lilas: '#ff7a8a', bg: '#140806', tinta: '#fff3ea', matiz: '25deg' }, c: { acento: '#b0501e', pessego: '#9a6a10', lilas: '#a82a3a', bg: '#fbf1ea', tinta: '#2a140c' } },
		violeta: { nome: 'Violeta', e: { acento: '#c8a8ff', pessego: '#ff9ee0', lilas: '#8a9aff', bg: '#0e0a1e', tinta: '#f6f0ff', matiz: '-45deg' }, c: { acento: '#6a3fc4', pessego: '#a8407f', lilas: '#3a4ab8', bg: '#f3effb', tinta: '#1e1430' } },
		gelo: { nome: 'Gelo', e: { acento: '#d6ecff', pessego: '#e8f4ff', lilas: '#b8c8ff', bg: '#080c14', tinta: '#f4f8ff', matiz: '200deg' }, c: { acento: '#2f5f8a', pessego: '#4a6a8a', lilas: '#3a4a8a', bg: '#f1f4f8', tinta: '#141c28' } },
	},
	codex: {
		celeste: { nome: 'Celeste' },
		musgo: { nome: 'Musgo', ouro: '#a8823f', tinta: '#1e3a2a', papel: '#f5f2e6' },
		bordo: { nome: 'Bordô', ouro: '#b08a3f', tinta: '#4a1420', papel: '#f7efe8' },
		sepia: { nome: 'Sépia', ouro: '#8a6a30', tinta: '#3a2614', papel: '#f3e8d4' },
		indigo: { nome: 'Índigo', ouro: '#a89a5a', tinta: '#23205a', papel: '#f4f3f8' },
		grafite: { nome: 'Grafite', ouro: '#8a8f98', tinta: '#22252a', papel: '#f6f6f4' },
	},
	astrolabio: {
		ouro: { nome: 'Ouro e ardósia' },
		prata: { nome: 'Prata', e: ASTRA_CEU.prata.e, c: { acento: '#4a5a78', bg: '#eef0f3', tinta: '#15181c' } },
		rosa: { nome: 'Rosa', e: ASTRA_CEU.rosa.e, c: { acento: '#a3405e', bg: '#f3eff0', tinta: '#1c1618' } },
		aurora: { nome: 'Aurora', e: ASTRA_CEU.aurora.e, c: { acento: '#0f7f6a', bg: '#eef2f1', tinta: '#141a18' } },
		ametista: { nome: 'Ametista', e: ASTRA_CEU.ametista.e, c: { acento: '#6a3fc4', bg: '#f0eff3', tinta: '#18161c' } },
		solar: { nome: 'Solar', e: ASTRA_CEU.solar.e, c: { acento: '#b0541e', bg: '#f3f0ee', tinta: '#1c1816' } },
	},
};

// Paletas de cada tema, na ordem do seletor.
export const CORES = {
	holograma: ['ciano', 'dourado', 'escarlate', 'fosforo', 'gelo', 'neon'],
	radar: ['fosforo', 'ambar', 'ciano', 'escarlate', 'gelo', 'ultravioleta'],
	circuito: ['ultravioleta', 'cobre', 'ambar', 'escarlate', 'neon', 'ciano'],
	navegacao: ['sinal', 'ciano', 'dourado', 'escarlate', 'fosforo', 'gelo'],
	...Object.fromEntries(Object.entries(PALETAS_FANTASIA).map(([tema, p]) => [tema, Object.keys(p)])),
	...Object.fromEntries(Object.entries(PALETAS_ASTRA).map(([tema, p]) => [tema, Object.keys(p)])),
};

// Nome de cada paleta, por tema, para o seletor.
export function coresDoTema(tema) {
	return (CORES[tema] || []).map((id) => ({ id, nome: (PALETAS_FANTASIA[tema]?.[id] || PALETAS_ASTRA[tema]?.[id] || MATIZES_SCIFI[id]).nome }));
}
