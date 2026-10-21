// Temas visuais do livro, em três famílias. O primeiro é o padrão. Os marcados como "teste" aparecem no seletor como experimentos.
// A família vira o atributo data-ss-familia, que liga a base comum dos temas de fantasia e de sci-fi.
export const FAMILIAS = [
	{ id: 'astra', nome: 'Astra' },
	{ id: 'fantasia', nome: 'Fantasia' },
	{ id: 'scifi', nome: 'Sci-fi' },
];

export const TEMAS = [
	{ id: 'constelacao', nome: 'Constelação', familia: 'astra' },
	{ id: 'classico', nome: 'Clássico', familia: 'astra' },
	{ id: 'observatorio', nome: 'Observatório', familia: 'astra' },
	{ id: 'nebulosa', nome: 'Nebulosa', familia: 'astra' },
	{ id: 'codex', nome: 'Codex Celeste', familia: 'astra' },
	{ id: 'astrolabio', nome: 'Astrolábio', familia: 'astra' },
	{ id: 'grimorio', nome: 'Grimório', familia: 'fantasia' },
	{ id: 'bosque', nome: 'Bosque Feérico', familia: 'fantasia' },
	{ id: 'vitral', nome: 'Vitral', familia: 'fantasia' },
	{ id: 'forja', nome: 'Forja Rúnica', familia: 'fantasia' },
	{ id: 'mapa', nome: 'Mapa do Aventureiro', familia: 'fantasia' },
	{ id: 'abissal', nome: 'Abissal', familia: 'fantasia' },
	{ id: 'holograma', nome: 'Holograma Arcano', familia: 'scifi' },
	{ id: 'radar', nome: 'Radar', familia: 'scifi' },
	{ id: 'circuito', nome: 'Circuito Neon', familia: 'scifi' },
	{ id: 'navegacao', nome: 'Navegação', familia: 'scifi' },
];

// Fontes que cada tema pré-carrega (os arquivos latinos de public/fontes): a do título e a do texto, que aparecem
// em toda página. Pré-carregadas, elas chegam antes do texto ser desenhado, sem atrasar a página nem fazer o texto pular.
const CINZEL = 'cinzel-latin-wght-normal';
const GARAMOND = 'eb-garamond-latin-wght-normal';
export const FONTES_DO_TEMA = {
	constelacao: [CINZEL],
	classico: [CINZEL],
	observatorio: ['cormorant-garamond-latin-600-normal', GARAMOND],
	nebulosa: [CINZEL],
	codex: [CINZEL, GARAMOND],
	astrolabio: ['cormorant-garamond-latin-600-normal', GARAMOND],
	grimorio: ['cinzel-decorative-latin-700-normal', GARAMOND],
	bosque: ['im-fell-english-sc-latin-400-normal', GARAMOND],
	vitral: ['cormorant-unicase-latin-700-normal', GARAMOND],
	forja: ['uncial-antiqua-latin-400-normal', GARAMOND],
	mapa: ['almendra-sc-latin-400-normal', GARAMOND],
	abissal: ['marcellus-sc-latin-400-normal', GARAMOND],
	holograma: ['orbitron-latin-wght-normal', 'jetbrains-mono-latin-wght-normal'],
	radar: ['share-tech-mono-latin-400-normal'],
	circuito: ['chakra-petch-latin-600-normal', 'jetbrains-mono-latin-wght-normal'],
	navegacao: ['exo-2-latin-wght-normal', 'jetbrains-mono-latin-wght-normal'],
};
