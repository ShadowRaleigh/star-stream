// Gera o CSS das paletas de cor de cada tema, um arquivo por tema em public/cores/<tema>.css, a partir de src/cores.mjs.
// Os arquivos ficam fora do CSS principal: o navegador só baixa as paletas do tema em uso, e só quando a paleta não é a padrão
// (a padrão já está no arquivo do tema). Quem carrega é src/scripts/seletor-tema.js e o seletor de cor.
// Uso: node tools/gerar-cores.mjs (depois, node tools/gerar-ornamentos.mjs e node tools/gerar-capas.mjs para as imagens).
import fs from 'node:fs';
import { CORES, PALETAS_ASTRA, PALETAS_FANTASIA } from '../src/cores.mjs';
import { varsAstra, varsFantasia, varsScifi } from './paletas.mjs';

const bloco = (seletor, vars) => `${seletor}{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')}}\n`;
const cabecalho = '/* Gerado por tools/gerar-cores.mjs a partir de src/cores.mjs. Não edite à mão. */\n';

fs.rmSync('public/cores', { recursive: true, force: true });
fs.mkdirSync('public/cores', { recursive: true });
const gravar = (tema, css) => {
	fs.writeFileSync(`public/cores/${tema}.css`, cabecalho + css);
	console.log(`public/cores/${tema}.css`, css.length);
};

// Sci-fi: um bloco para o escuro e outro para o claro.
for (const tema of ['holograma', 'radar', 'circuito', 'navegacao']) {
	let css = '';
	for (const cor of CORES[tema].slice(1)) {
		const s = `:root[data-ss-tema='${tema}'][data-ss-cor='${cor}']`;
		css += bloco(s, varsScifi(tema, cor, 'escuro')) + bloco(`${s}[data-theme='light']`, varsScifi(tema, cor, 'claro'));
	}
	gravar(tema, css);
}

// Fantasia: o mesmo visual no claro e no escuro. [data-ss-familia] só sobe a especificidade acima da do arquivo do tema,
// que também vale para o modo claro.
for (const tema of Object.keys(PALETAS_FANTASIA)) {
	let css = '';
	for (const cor of CORES[tema].slice(1)) {
		const { vars, varsFora, capa } = varsFantasia(tema, cor);
		const s = `[data-ss-tema='${tema}'][data-ss-cor='${cor}']`;
		css += bloco(`:root${s}[data-ss-familia]`, vars);
		css += bloco(`${s} :is(header.header, .sidebar-pane, .right-sidebar, starlight-menu-button, mobile-starlight-toc)`, varsFora);
		if (capa) css += bloco(`${s} .ss-capa`, { 'background-image': `url('/star-stream/temas/${capa}.svg')` });
	}
	gravar(tema, css);
}

// Astra: um bloco para o escuro e outro para o claro, e as regras de capa de cada modo.
for (const tema of Object.keys(PALETAS_ASTRA)) {
	let css = '';
	for (const cor of CORES[tema].slice(1)) {
		const s = `[data-ss-tema='${tema}'][data-ss-cor='${cor}']`;
		for (const modo of ['escuro', 'claro']) {
			const m = modo === 'claro' ? "[data-theme='light']" : '';
			const { vars, regras } = varsAstra(tema, cor, modo);
			css += bloco(`:root${s}${m}`, vars);
			for (const [seletor, props] of regras) css += bloco(`${s}${m} ${seletor}`, props);
		}
	}
	gravar(tema, css);
}
