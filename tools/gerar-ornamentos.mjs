// Gera os ornamentos dos temas de fantasia: textura da capa (material), textura do papel, cantos da página e florão,
// nas cores padrão de cada tema e em cada paleta de src/cores.mjs. Na paleta padrão, o Grimório usa os arquivos originais
// (couro.svg, pergaminho.svg, canto-ouro-*.svg, florao-tinta.svg), que aqui só são recoloridos para as outras paletas.
// Uso: node tools/gerar-ornamentos.mjs
import fs from 'node:fs';
import { CORES } from '../src/cores.mjs';
import { ornamentoFantasia } from './paletas.mjs';

// Ruído em duas camadas, como o couro e o pergaminho do Grimório; as cores mudam por tema.
function ruido(tam, fina, larga) {
	const m = ([r, g, b, a]) => `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 ${a} 0`;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}">
<filter id="v"><feTurbulence type="fractalNoise" baseFrequency="${larga.freq}" numOctaves="3" seed="${larga.semente}" stitchTiles="stitch"/>
<feColorMatrix values="${m(larga.cor)}"/></filter>
<filter id="c"><feTurbulence type="fractalNoise" baseFrequency="${fina.freq}" numOctaves="3" seed="${fina.semente}" stitchTiles="stitch"/>
<feColorMatrix values="${m(fina.cor)}"/></filter>
<rect width="100%" height="100%" filter="url(#v)"/><rect width="100%" height="100%" filter="url(#c)"/></svg>
`;
}

// Cantos: desenhados para o canto superior esquerdo; os outros três são espelhos.
const ESPELHOS = { se: '', sd: 'translate(120 0) scale(-1 1)', ie: 'translate(0 120) scale(1 -1)', id: 'translate(120 120) scale(-1 -1)' };
const CANTOS = {
	// Ramo de trepadeira com folhas e uma flor no vértice.
	bosque: (c) => `<path d="M4 116 V4 H116" stroke-width="1.4"/>
<path d="M10 104 C14 60 30 30 104 10" stroke-width="1.2"/>
${[[22, 70, -60], [34, 46, -40], [52, 30, -25], [76, 18, -12], [16, 88, -75]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="3.6" transform="rotate(${r} ${x} ${y})" fill="${c}" fill-opacity=".35" stroke-width=".8"/>`).join('')}
${[[30, 62, 30], [46, 40, 50], [64, 26, 70]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="3" transform="rotate(${r} ${x} ${y})" fill="${c}" fill-opacity=".25" stroke-width=".7"/>`).join('')}
<g transform="translate(14 14)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6" rx="3" ry="6" transform="rotate(${a})" fill="${c}" fill-opacity=".45" stroke-width=".6"/>`).join('')}<circle r="2.2" fill="${c}"/></g>`,
	// Rendilhado gótico: arco ogival, trifólio e pináculo.
	vitral: (c) => `<path d="M4 116 V4 H116" stroke-width="2"/><path d="M11 116 V11 H116" stroke-width=".7"/>
<path d="M11 78 Q11 30 44 11" stroke-width="1.3"/><path d="M11 78 Q30 40 78 11" stroke-width=".8"/>
<g transform="translate(30 30)" stroke-width="1.1">${[0, 120, 240].map((a) => `<circle cx="0" cy="-6.5" r="6.5" transform="rotate(${a})"/>`).join('')}<circle r="1.8" fill="${c}"/></g>
<circle cx="96" cy="11" r="2.2" fill="${c}"/><circle cx="11" cy="96" r="2.2" fill="${c}"/>`,
	// Mapa: moldura de carta com uma pequena rosa dos ventos no vértice.
	mapa: (c) => `<path d="M4 116 V4 H116" stroke-width="2"/><path d="M10 116 V10 H116" stroke-width=".8"/>
${[22, 46, 70, 94].map((x) => `<rect x="${x}" y="4" width="12" height="6" fill="${c}" stroke="none"/><rect x="4" y="${x}" width="6" height="12" fill="${c}" stroke="none"/>`).join('')}
<g transform="translate(30 30)">${[0, 90, 180, 270].map((a) => `<path d="M0 -16 L3 -3 L0 0 Z" transform="rotate(${a})" fill="${c}" stroke="none"/><path d="M0 -16 L-3 -3 L0 0 Z" transform="rotate(${a})" stroke-width=".6"/>`).join('')}<circle r="9" stroke-width=".6"/></g>`,
	// Abissal: uma onda enrolada e uma pérola no vértice.
	abissal: (c) => `<path d="M4 116 V4 H116" stroke-width="1.6"/>
<path d="M10 100 C10 50 40 20 90 12" stroke-width="1.2"/>
<path d="M18 40 C18 22 36 18 42 28 C48 38 34 44 30 36 C27 30 34 28 35 32" stroke-width="1.4"/>
<path d="M40 70 C52 64 58 56 56 46 M62 30 C70 34 78 32 84 26" stroke-width=".9"/>
<circle cx="14" cy="14" r="6" fill="${c}" fill-opacity=".35" stroke-width="1"/><circle cx="12.5" cy="12.5" r="1.8" fill="#ffffff" stroke="none" opacity=".8"/>`,
	// Cantoneira de ferro rebitada, com um nó angular.
	forja: (c) => `<path d="M4 116 V4 H116" stroke-width="2"/>
<path d="M4 4 H60 L48 16 H16 V48 L4 60 Z" fill="${c}" fill-opacity=".22" stroke-width="1.4"/>
${[[10, 10], [30, 10], [10, 30], [50, 10], [10, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}"/>`).join('')}
<path d="M24 24 L44 24 L44 44 L24 44 Z M34 18 L50 34 L34 50 L18 34 Z" stroke-width="1"/>
<path d="M60 4 L66 10 M4 60 L10 66" stroke-width="1"/>`,
};

const FLOROES = {
	bosque: (c) => `<path d="M0 12 H96 M144 12 H240" stroke-width=".8"/>
${[70, 82, 158, 170].map((x, i) => `<ellipse cx="${x}" cy="${i % 2 ? 15 : 9}" rx="6" ry="2.4" transform="rotate(${i % 2 ? 25 : -25} ${x} ${i % 2 ? 15 : 9})" fill="${c}" fill-opacity=".5"/>`).join('')}
<g transform="translate(120 12)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-5" rx="2.6" ry="5" transform="rotate(${a})" fill="${c}" fill-opacity=".55"/>`).join('')}<circle r="1.8" fill="${c}"/></g>
<path d="M96 12 C104 6 108 6 112 10 M144 12 C136 6 132 6 128 10"/>`,
	vitral: (c) => `<path d="M0 12 H100 M140 12 H240" stroke-width=".8"/>
<g transform="translate(120 12)">${[0, 90, 180, 270].map((a) => `<circle cx="0" cy="-5.5" r="5.5" transform="rotate(${a})"/>`).join('')}<circle r="2" fill="${c}"/></g>
<path d="M100 12 L106 8 L106 16 Z M140 12 L134 8 L134 16 Z" fill="${c}"/>`,
	mapa: (c) => `<path d="M0 12 H104 M136 12 H240" stroke-width=".8" stroke-dasharray="2 5"/>
<g transform="translate(120 12)">${[0, 90, 180, 270].map((a) => `<path d="M0 -11 L2.5 -2.5 L0 0 Z" transform="rotate(${a})" fill="${c}"/><path d="M0 -11 L-2.5 -2.5 L0 0 Z" transform="rotate(${a})"/>`).join('')}</g>
<circle cx="96" cy="12" r="2" fill="${c}"/><path d="M141 8 L149 16 M149 8 L141 16" stroke-width="1.6"/>`,
	abissal: (c) => `<path d="M0 12 Q 12 4 24 12 T 48 12 T 72 12 T 96 12 M144 12 Q 156 4 168 12 T 192 12 T 216 12 T 240 12" stroke-width=".9"/>
<circle cx="120" cy="12" r="6" fill="${c}" fill-opacity=".25"/><circle cx="118" cy="10" r="1.6" fill="${c}"/><circle cx="104" cy="12" r="2" fill="${c}"/><circle cx="136" cy="12" r="2" fill="${c}"/>`,
	forja: (c) => `<path d="M0 12 H98 M142 12 H240" stroke-width="1.2"/>
<path d="M120 2 L130 12 L120 22 L110 12 Z" fill="${c}" fill-opacity=".25"/><path d="M114 6 L126 18 M126 6 L114 18"/>
${[90, 102, 138, 150].map((x) => `<rect x="${x - 2.5}" y="9.5" width="5" height="5" transform="rotate(45 ${x} 12)" fill="${c}"/>`).join('')}`,
};

const TEMAS = {
	bosque: {
		ornamento: '#9fb37a',
		tinta: '#2e4a2c',
		material: { fina: { freq: 0.75, semente: 21, cor: [0.04, 0.1, 0.05, 0.35] }, larga: { freq: 0.014, semente: 8, cor: [0.01, 0.04, 0.02, 0.5] } },
		papel: { fina: { freq: 0.9, semente: 5, cor: [0.18, 0.26, 0.14, 0.07] }, larga: { freq: 0.03, semente: 14, cor: [0.38, 0.48, 0.3, 0.12] } },
	},
	vitral: {
		ornamento: '#9ea3b2',
		tinta: '#3a3548',
		material: { fina: { freq: 0.85, semente: 31, cor: [0.1, 0.1, 0.12, 0.35] }, larga: { freq: 0.01, semente: 17, cor: [0.03, 0.03, 0.05, 0.5] } },
		papel: { fina: { freq: 0.95, semente: 7, cor: [0.25, 0.25, 0.3, 0.06] }, larga: { freq: 0.04, semente: 19, cor: [0.45, 0.44, 0.48, 0.1] } },
	},
	mapa: {
		ornamento: '#6b4c2a',
		tinta: '#3b2a18',
		material: { fina: { freq: 0.6, semente: 51, cor: [0.06, 0.12, 0.13, 0.4] }, larga: { freq: 0.01, semente: 33, cor: [0.02, 0.05, 0.06, 0.5] } },
		papel: { fina: { freq: 0.9, semente: 11, cor: [0.32, 0.24, 0.12, 0.08] }, larga: { freq: 0.025, semente: 37, cor: [0.6, 0.46, 0.24, 0.14] } },
	},
	abissal: {
		ornamento: '#7fb7b3',
		tinta: '#1d4a52',
		material: { fina: { freq: 0.55, semente: 61, cor: [0.02, 0.1, 0.13, 0.4] }, larga: { freq: 0.008, semente: 43, cor: [0.0, 0.05, 0.07, 0.55] } },
		papel: { fina: { freq: 0.95, semente: 13, cor: [0.2, 0.32, 0.34, 0.06] }, larga: { freq: 0.03, semente: 47, cor: [0.4, 0.55, 0.56, 0.1] } },
	},
	forja: {
		ornamento: '#b87333',
		tinta: '#4a3a2c',
		material: { fina: { freq: 0.7, semente: 41, cor: [0.14, 0.11, 0.09, 0.4] }, larga: { freq: 0.016, semente: 23, cor: [0.08, 0.03, 0.01, 0.5] } },
		papel: { fina: { freq: 0.9, semente: 9, cor: [0.28, 0.25, 0.2, 0.08] }, larga: { freq: 0.035, semente: 29, cor: [0.48, 0.44, 0.38, 0.11] } },
	},
};

for (const [tema, t] of Object.entries(TEMAS)) {
	fs.writeFileSync(`public/temas/material-${tema}.svg`, ruido(300, t.material.fina, t.material.larga));
	fs.writeFileSync(`public/temas/papel-${tema}.svg`, ruido(400, t.papel.fina, t.papel.larga));
	for (const [lado, espelho] of Object.entries(ESPELHOS)) {
		fs.writeFileSync(
			`public/temas/canto-${tema}-${lado}.svg`,
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="${t.ornamento}"><g transform="${espelho}">\n${CANTOS[tema](t.ornamento)}\n</g></svg>\n`,
		);
	}
	fs.writeFileSync(`public/temas/florao-${tema}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 24" fill="none" stroke="${t.tinta}" stroke-width="1">\n${FLOROES[tema](t.tinta)}\n</svg>\n`);
	console.log('ok', tema);
}

// Paletas: cantos e florão recoloridos, e uma textura de capa na cor do couro de cada uma.
const cantosGrimorio = Object.fromEntries(Object.keys(ESPELHOS).map((lado) => [lado, fs.readFileSync(`public/temas/canto-ouro-${lado}.svg`, 'utf8')]));
const floraoGrimorio = fs.readFileSync('public/temas/florao-tinta.svg', 'utf8');
for (const tema of ['grimorio', ...Object.keys(TEMAS)]) {
	for (const cor of CORES[tema].slice(1)) {
		const o = ornamentoFantasia(tema, cor);
		fs.writeFileSync(`public/temas/material-${tema}-${cor}.svg`, ruido(300, o.material.fina, o.material.larga));
		for (const [lado, espelho] of Object.entries(ESPELHOS)) {
			const svg = tema === 'grimorio'
				? cantosGrimorio[lado].split('#a87b3a').join(o.canto)
				: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="${o.canto}"><g transform="${espelho}">
${CANTOS[tema](o.canto)}
</g></svg>
`;
			fs.writeFileSync(`public/temas/canto-${tema}-${cor}-${lado}.svg`, svg);
		}
		const florao = tema === 'grimorio'
			? floraoGrimorio.split('#5b3a1e').join(o.florao)
			: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 24" fill="none" stroke="${o.florao}" stroke-width="1">
${FLOROES[tema](o.florao)}
</svg>
`;
		fs.writeFileSync(`public/temas/florao-${tema}-${cor}.svg`, florao);
	}
	console.log('paletas', tema);
}
