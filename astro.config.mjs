// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://shadowraleigh.github.io',
	base: '/star-stream',
	integrations: [
		starlight({
			title: 'Star Stream',
			description: 'Livro de regras do Star Stream, o RPG de mesa de Shadow Raleigh.',
			defaultLocale: 'root',
			locales: { root: { label: 'Português', lang: 'pt-BR' } },
			logo: {
				dark: './src/assets/marca/logo-star-stream.svg',
				light: './src/assets/marca/logo-star-stream-escuro.svg',
				alt: 'Star Stream',
				replacesTitle: true,
			},
			customCss: ['./src/styles/star-stream.css'],
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
					items: [{ label: 'Funcionamento', slug: 'habilidades' }, 'habilidades/criacao'],
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
