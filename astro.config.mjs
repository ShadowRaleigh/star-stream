// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'node:fs';
import { FONTES_DO_TEMA, TEMAS } from './src/temas.mjs';
import { CORES } from './src/cores.mjs';

// O script do seletor recebe a família e as paletas de cada tema a partir das listas únicas em src/temas.mjs e src/cores.mjs.
const seletorTema = fs
	.readFileSync('./src/scripts/seletor-tema.js', 'utf8')
	.replace('__FAMILIAS_DOS_TEMAS__', JSON.stringify(Object.fromEntries(TEMAS.map((t) => [t.id, t.familia]))))
	.replace('__CORES_DOS_TEMAS__', JSON.stringify(CORES))
	.replace('__FONTES_DOS_TEMAS__', JSON.stringify(FONTES_DO_TEMA))
	.replaceAll('__BASE__', '/star-stream/');

export default defineConfig({
	site: 'https://shadowraleigh.github.io',
	base: '/star-stream',
	devToolbar: { enabled: false },
	integrations: [
		starlight({
			title: 'Star Stream',
			description: 'Livro de regras do Star Stream, o RPG de mesa de Zennova.',
			favicon: '/icone-star-stream.svg',
			head: [
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/star-stream/icone-32.png' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/star-stream/icone-180.png' } },
				{ tag: 'script', content: seletorTema },
			],
			defaultLocale: 'root',
			locales: { root: { label: 'Português', lang: 'pt-BR' } },
			logo: {
				dark: './src/assets/marca/logo-star-stream.svg',
				light: './src/assets/marca/logo-star-stream-escuro.svg',
				alt: 'Star Stream',
				replacesTitle: true,
			},
			components: { ThemeSelect: './src/components/SeletorDeTema.astro' },
			customCss: [
				// Fontes dos temas, só o alfabeto latino, servidas de public/fontes (tools/copiar-fontes.mjs)
				'./src/styles/fontes.css',
				'./src/styles/star-stream.css',
				'./src/styles/temas/comum.css',
				// Astra
				'./src/styles/temas/constelacao.css',
				'./src/styles/temas/observatorio.css',
				'./src/styles/temas/nebulosa.css',
				'./src/styles/temas/codex.css',
				'./src/styles/temas/astrolabio.css',
				// Fantasia: a base da família e as cores de cada tema
				'./src/styles/temas/familia-fantasia.css',
				'./src/styles/temas/grimorio.css',
				'./src/styles/temas/bosque.css',
				'./src/styles/temas/vitral.css',
				'./src/styles/temas/forja.css',
				'./src/styles/temas/mapa.css',
				'./src/styles/temas/abissal.css',
				// Sci-fi: a base da família e as cores de cada tema
				'./src/styles/temas/familia-scifi.css',
				'./src/styles/temas/holograma.css',
				'./src/styles/temas/radar.css',
				'./src/styles/temas/circuito.css',
				'./src/styles/temas/navegacao.css',
				// Capas que não cabem nos arquivos dos temas
				'./src/styles/temas/banners.css',
			],
			lastUpdated: false,
			pagination: true,
			tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
			sidebar: [
				{ label: 'Início', link: '/' },
				{
					label: 'Personagem',
					items: [
						'personagem/criacao',
						'personagem/origens',
						'personagem/atributos',
						'personagem/stats',
						'personagem/pericias',
						'personagem/talentos',
						'personagem/titulos',
						'personagem/estilos-de-combate',
					],
				},
				{
					label: 'Arquétipos',
					items: [
						{ label: 'Visão geral', slug: 'arquetipos' },
						'arquetipos/vanguarda',
						'arquetipos/iniciador',
						'arquetipos/adaptador',
						'arquetipos/artifice',
						'arquetipos/sentinela',
						'arquetipos/vinculador',
						'arquetipos/interventor',
						'arquetipos/projetor',
					],
				},
				{
					label: 'Históricos',
					collapsed: true,
					items: [
						{ label: 'Visão geral', slug: 'historicos' },
						'historicos/ladrao',
						'historicos/espiao',
						'historicos/netrunner',
						'historicos/orador',
						'historicos/comerciante',
						'historicos/arruaceiro',
						'historicos/domador',
						'historicos/explorador',
						'historicos/cacador',
						'historicos/medico',
						'historicos/erudito',
					],
				},
				{
					label: 'Mecânicas Básicas',
					items: [
						'regras/dados',
						{ label: 'Exploração', slug: 'exploracao' },
						'exploracao/party',
						'exploracao/inventario',
						'exploracao/descanso-e-provisoes',
						'exploracao/informacao',
						'exploracao/deslocamento',
						'exploracao/pontos-de-interesse',
						'exploracao/salas-armadilhas-e-quebra-cabecas',
					],
				},
				{
					label: 'Combate',
					items: [
						{ label: 'Estrutura', slug: 'combate' },
						'combate/rodadas-e-acoes',
						'combate/posicionamento',
						'combate/combate-aereo',
						'combate/ataque-e-dano',
						'combate/atributos-em-combate',
						'combate/equipamento',
						'combate/personagens-caidos',
						'combate/efeitos-de-status',
					],
				},
				{
					label: 'Habilidades',
					items: [{ label: 'Funcionamento', slug: 'habilidades' }, 'habilidades/criacao', 'habilidades/capacidades'],
				},
				{
					label: 'Raças',
					items: [
						{ label: 'Visão geral', slug: 'racas' },
						'racas/humanoides',
						'racas/fae',
						'racas/emperor-beasts',
						'racas/fatores',
					],
				},
			],
		}),
	],
});
