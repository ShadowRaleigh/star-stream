// Gera as capas desenhadas em SVG (Planisfério do Clássico, Armilar do Astrolábio, as quatro sci-fi e as de fantasia) e as marcas d'água do sci-fi,
// inclusive nas paletas de cor de src/cores.mjs.
// Uso: node tools/gerar-capas.mjs
import fs from 'node:fs';
import sharp from 'sharp';
import { CORES } from '../src/cores.mjs';
import { arteFantasia, capaAstra, capaScifi, mistura } from './paletas.mjs';

const W = 1800, H = 520;
const PALETAS = {
	constelacao: { fundo: ['#18213c', '#0c1222', '#060914'], acento: '#e3c38f', marfim: '#f8f3e7', violeta: '#8a6ac0', azul: '#3a5a9a' },
	'classico-escuro': { fundo: ['#18213a', '#10172b', '#0c1120'], linha: '#e3b88f', fraca: '#9298aa', estrela: '#f8f3e7', brilho: '#e3b88f' },
	'classico-claro': { fundo: ['#fcf9f1', '#f3ede0', '#e9e1cf'], linha: '#1b2a3e', fraca: '#8a8c93', estrela: '#1b2a3e', brilho: '#6b4a80' },
	'astrolabio-escuro': { fundo: ['#16203a', '#0c1222', '#080b16'], linha: '#e3c38f', fraca: '#9fb0d0', estrela: '#f8f3e7', brilho: '#e3c38f' },
	'astrolabio-claro': { fundo: ['#f7f8f9', '#e6e9ec', '#d5dadf'], linha: '#262c33', fraca: '#8a939c', estrela: '#262c33', brilho: '#2a8a95' },
	'holograma-escuro': { fundo: ['#02070c', '#041019', '#061a26'], linha: '#7ee7ff', fraca: '#3a8aa3', estrela: '#c9f6ff', brilho: '#b48cff' },
	'holograma-claro': { fundo: ['#f7fcfe', '#e8f4f9', '#d4e9f1'], linha: '#0a7a99', fraca: '#7fb2c4', estrela: '#0a7a99', brilho: '#6a3fc4' },
	'radar-escuro': { fundo: ['#020804', '#04110a', '#061a0f'], linha: '#6dff9a', fraca: '#2f7a49', estrela: '#c8ffd8', brilho: '#ffb000' },
	'radar-claro': { fundo: ['#f7fcf8', '#e8f4ec', '#d3e9da'], linha: '#11803f', fraca: '#7fb28f', estrela: '#11803f', brilho: '#a86400' },
	'circuito-escuro': { fundo: ['#09071a', '#0f0c23', '#17132f'], linha: '#a98bff', fraca: '#59498d', estrela: '#efeaff', brilho: '#c4ff4d' },
	'circuito-claro': { fundo: ['#ffffff', '#efebfa', '#e4def7'], linha: '#5b36c9', fraca: '#a996e3', estrela: '#140f2a', brilho: '#4f7a00' },
	'navegacao-escuro': { fundo: ['#0b0d10', '#111418', '#171b20'], linha: '#e9edf2', fraca: '#5c636c', estrela: '#e9edf2', brilho: '#ff8a3d' },
	bosque: { fundo: ['#1d3a26', '#10241a', '#08130c'], linha: '#3a2a1c', fraca: '#4d6b4a', estrela: '#f4eec4', brilho: '#f1e6b0', folha: '#3f7a46', folha2: '#2a5a34', vaga: '#e8f59a' },
	vitral: { fundo: ['#1c1925', '#100e16'], junta: '#07060a', pedra: '#3a3646', prata: '#c9ccd6', chumbo: '#0b0a0f', luz: '#f3e6c4', vidros: [['#b8455a', '#5a1424'], ['#4f74c9', '#1b2d66'], ['#3f9a6a', '#14462c']] },
	mapa: { fundo: ['#f3e8cc', '#e7d6ad', '#cdb581'], tinta: '#3b2a18', mar: '#2f6e8e', terra: '#e2d2a0', floresta: '#7d8a4a', rota: '#a3321f' },
	abissal: { fundo: ['#1d6b78', '#0b3341', '#03121a'], luz: '#c9f3f0', alga: '#0f4a3a', areia: '#0b2a2c', coral: '#c0563f', medusa: '#ffb0c8' },
	forja: { fundo: ['#2a2724', '#1a1918', '#0f0e0d'], linha: '#b87333', junta: '#0a0909', brasa: '#ff6a1f', brilho: '#ffd08a' },
	'navegacao-claro': { fundo: ['#ffffff', '#f1f3f5', '#e2e6ea'], linha: '#2a3038', fraca: '#9aa1a9', estrela: '#2a3038', brilho: '#c2510f' },
};

// Sorteio com semente fixa: as artes saem iguais a cada geração.
function sorteio(semente) {
	let s = semente;
	return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const f = (n) => Math.round(n * 10) / 10;

function fundo(p, id) {
	return `<defs><radialGradient id="${id}" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".6" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}

function estrelas(p, n, semente, evitar) {
	const r = sorteio(semente);
	let out = '';
	for (let i = 0; i < n; i++) {
		const x = r() * W, y = r() * H;
		if (evitar && evitar(x, y)) continue;
		const t = r();
		out += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.5 + t * t * 1.6)}" fill="${p.estrela}" opacity="${f(0.25 + r() * 0.6)}"/>`;
	}
	return out;
}

// Constelações inventadas: pontos relativos e ligações.
const FIGURAS = [
	{ pts: [[0, 40], [38, 22], [80, 30], [118, 6], [150, 26], [132, 62]], lig: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]] },
	{ pts: [[0, 0], [30, 34], [70, 40], [96, 78], [48, 92], [14, 70]], lig: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 1]] },
	{ pts: [[0, 50], [40, 46], [74, 20], [110, 40], [150, 30], [186, 58]], lig: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
	{ pts: [[20, 0], [0, 40], [36, 70], [76, 52], [62, 14]], lig: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
	{ pts: [[0, 0], [26, 24], [60, 30], [92, 22], [60, 64], [64, 100]], lig: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]] },
];

function constelacao(p, fig, x, y, escala, sem) {
	const r = sorteio(sem);
	const pts = fig.pts.map(([a, b]) => [x + a * escala, y + b * escala]);
	let out = `<g stroke="${p.linha}" stroke-width="1" opacity=".55">`;
	for (const [a, b] of fig.lig) out += `<line x1="${f(pts[a][0])}" y1="${f(pts[a][1])}" x2="${f(pts[b][0])}" y2="${f(pts[b][1])}"/>`;
	out += `</g><g fill="${p.linha}">`;
	for (const [a, b] of pts) out += `<circle cx="${f(a)}" cy="${f(b)}" r="${f(1.6 + r() * 2)}"/>`;
	return out + '</g>';
}

// Planisfério: grade cônica de atlas estelar, eclíptica e constelações por toda a largura.
function planisferio(p) {
	const px = W / 2, py = -1500;
	let g = fundo(p, 'f');
	g += estrelas(p, 420, 7);
	g += `<g fill="none" stroke="${p.fraca}" stroke-width=".8" opacity=".45">`;
	for (let raio = 1560; raio <= 2240; raio += 85) g += `<circle cx="${px}" cy="${py}" r="${raio}"/>`;
	for (let a = -36; a <= 36; a += 4) {
		const t = (a * Math.PI) / 180;
		g += `<line x1="${f(px + Math.sin(t) * 1540)}" y1="${f(py + Math.cos(t) * 1540)}" x2="${f(px + Math.sin(t) * 2300)}" y2="${f(py + Math.cos(t) * 2300)}"/>`;
	}
	g += '</g>';
	// Um paralelo e um meridiano principais, mais marcados.
	g += `<g fill="none" stroke="${p.linha}" stroke-width="1.2" opacity=".6"><circle cx="${px}" cy="${py}" r="${1560 + 85 * 4}"/><line x1="${f(px + Math.sin(0.28) * 1540)}" y1="${f(py + Math.cos(0.28) * 1540)}" x2="${f(px + Math.sin(0.28) * 2300)}" y2="${f(py + Math.cos(0.28) * 2300)}"/></g>`;
	// Eclíptica tracejada, com o nome escrito sobre ela.
	let d = 'M -20 ' + f(300);
	for (let x = 0; x <= W + 20; x += 20) d += ` L ${x} ${f(285 + 130 * Math.sin((x / W) * Math.PI * 2 - 0.6))}`;
	g += `<path id="ecl" d="${d}" fill="none" stroke="${p.brilho}" stroke-width="1.4" stroke-dasharray="10 6" opacity=".75"/>`;
	g += `<text font-family="Georgia, serif" font-style="italic" font-size="15" letter-spacing="6" fill="${p.brilho}" opacity=".85"><textPath href="#ecl" startOffset="8%">ECLÍPTICA</textPath></text>`;
	g += `<text font-family="Georgia, serif" font-style="italic" font-size="15" letter-spacing="6" fill="${p.brilho}" opacity=".85"><textPath href="#ecl" startOffset="80%">ECLÍPTICA</textPath></text>`;
	const lugares = [[90, 60, 0, 1.2], [360, 330, 1, 1.1], [1240, 70, 2, 1.1], [1530, 300, 3, 1.3], [200, 400, 4, 0.9], [1380, 400, 4, 1], [560, 40, 3, 0.8]];
	lugares.forEach(([x, y, i, e], k) => (g += constelacao(p, FIGURAS[i], x, y, e, 11 + k)));
	return g;
}

// Holograma (em teste): quatro capas de interface sci-fi. O centro (onde fica o nome) fica sempre livre.
const MONO = "font-family=\"JetBrains Mono, Consolas, monospace\"";
const texto = (x, y, t, cor, tam = 14, extra = '') => `<text x="${f(x)}" y="${f(y)}" ${MONO} font-size="${tam}" fill="${cor}" ${extra}>${t}</text>`;
const fundoLinear = (p) => `<defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".6" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#f)"/>`;
const grade = (p, passo, op) => {
	let g = `<g stroke="${p.fraca}" stroke-width=".6" opacity="${op}">`;
	for (let x = 0; x <= W; x += passo) g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
	for (let y = 0; y <= H; y += passo) g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
	return g + '</g>';
};
const canto = (x, y, sx, sy, l, cor, larg) => `<path d="M ${x} ${y + sy * l} L ${x} ${y} L ${x + sx * l} ${y}" fill="none" stroke="${cor}" stroke-width="${larg}"/>`;

// 1. HUD de nave: réguas de velocidade e altitude, bússola, escada de arfagem e a mira travada no nome.
function hud(p) {
	let g = fundoLinear(p) + grade(p, 40, 0.18);
	g += estrelas(p, 140, 101, (x, y) => x > 380 && x < 1420 && y > 130 && y < 390);
	// Cantos da tela.
	for (const [x, y, sx, sy] of [[28, 28, 1, 1], [W - 28, 28, -1, 1], [28, H - 28, 1, -1], [W - 28, H - 28, -1, -1]]) g += canto(x, y, sx, sy, 90, p.linha, 3);
	// Réguas laterais.
	for (const [x, lado, rot, valor] of [[90, 1, 'VEL', '0247'], [W - 90, -1, 'ALT', '1880']]) {
		g += `<line x1="${x}" y1="80" x2="${x}" y2="440" stroke="${p.linha}" stroke-width="1.4" opacity=".7"/>`;
		for (let i = 0; i <= 30; i++) {
			const y = 80 + i * 12, longo = i % 5 === 0;
			g += `<line x1="${x}" y1="${y}" x2="${x + lado * (longo ? 18 : 9)}" y2="${y}" stroke="${p.linha}" stroke-width="1" opacity=".7"/>`;
			if (longo && i !== 15) g += texto(x + lado * 26, y + 5, String(300 - i * 4), p.fraca, 13, lado < 0 ? 'text-anchor="end"' : '');
		}
		const bx = lado > 0 ? x + 22 : x - 92;
		g += `<rect x="${bx}" y="246" width="70" height="28" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.6"/>` + texto(bx + 35, 266, valor, p.linha, 16, 'text-anchor="middle" font-weight="700"');
		g += texto(x, 66, rot, p.fraca, 13, 'text-anchor="middle" letter-spacing="3"');
	}
	// Bússola no topo.
	g += `<line x1="600" y1="44" x2="1200" y2="44" stroke="${p.linha}" stroke-width="1.2" opacity=".7"/>`;
	for (let i = 0; i <= 40; i++) {
		const x = 600 + i * 15, longo = i % 5 === 0;
		g += `<line x1="${x}" y1="44" x2="${x}" y2="${44 + (longo ? 14 : 7)}" stroke="${p.linha}" stroke-width="1" opacity=".7"/>`;
		if (longo) g += texto(x, 76, String((340 + i * 2) % 360).padStart(3, '0'), p.fraca, 12, 'text-anchor="middle"');
	}
	g += `<path d="M 900 30 L 893 18 L 907 18 Z" fill="${p.brilho}"/>`;
	// Escada de arfagem acima e abaixo do nome.
	for (const [y, n] of [[118, '+10'], [402, '−10']]) {
		g += `<g stroke="${p.linha}" stroke-width="1.4" opacity=".6"><line x1="640" y1="${y}" x2="820" y2="${y}" stroke-dasharray="${n.startsWith('+') ? 'none' : '12 8'}"/><line x1="980" y1="${y}" x2="1160" y2="${y}" stroke-dasharray="${n.startsWith('+') ? 'none' : '12 8'}"/></g>`;
		g += texto(612, y + 5, n, p.fraca, 13, 'text-anchor="end"') + texto(1188, y + 5, n, p.fraca, 13);
	}
	// Mira travada em volta do nome.
	for (const [x, y, sx, sy] of [[440, 148, 1, 1], [1360, 148, -1, 1], [440, 372, 1, -1], [1360, 372, -1, -1]]) g += canto(x, y, sx, sy, 34, p.brilho, 2.4);
	g += texto(1360, 138, 'ALVO TRAVADO ◆ 0,98', p.brilho, 13, 'text-anchor="end" letter-spacing="2"');
	// Linha de estado e barras de energia.
	g += texto(900, 490, 'SETOR 7G-ALFA   ·   SINC 98,4%   ·   ÉTER ESTÁVEL   ·   T+00:42:17', p.fraca, 14, 'text-anchor="middle" letter-spacing="2"');
	for (let i = 0; i < 12; i++) {
		g += `<rect x="${150 + i * 14}" y="474" width="10" height="18" fill="${p.linha}" opacity="${i < 9 ? 0.75 : 0.18}"/>`;
		g += `<rect x="${W - 160 - i * 14}" y="474" width="10" height="18" fill="${i < 4 ? p.brilho : p.linha}" opacity="${i < 7 ? 0.75 : 0.18}"/>`;
	}
	return g;
}

// 2. Radar: anéis de alcance, rumos e contatos. O feixe que gira é uma camada CSS por cima (radar.css),
// porque animar dentro do SVG obriga o navegador a redesenhar a capa inteira a cada quadro.
function radar(p) {
	const cx = W / 2, cy = 260;
	let g = fundoLinear(p);
	g += `<defs><radialGradient id="limpo"><stop offset="0" stop-color="${p.fundo[1]}" stop-opacity=".9"/><stop offset="1" stop-color="${p.fundo[1]}" stop-opacity="0"/></radialGradient>
</defs>`;
	g += estrelas(p, 160, 113);
	g += `<g fill="none" stroke="${p.linha}">`;
	for (const [r, op] of [[140, 0.25], [260, 0.4], [380, 0.5], [500, 0.6], [640, 0.35], [800, 0.25]]) g += `<circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="1.1" opacity="${op}"/>`;
	g += `<line x1="0" y1="${cy}" x2="${W}" y2="${cy}" stroke-width=".8" opacity=".3"/><line x1="${cx}" y1="0" x2="${cx}" y2="${H}" stroke-width=".8" opacity=".3"/>`;
	for (const a of [45, 135]) { const t = (a * Math.PI) / 180; g += `<line x1="${f(cx - Math.cos(t) * 900)}" y1="${f(cy - Math.sin(t) * 900)}" x2="${f(cx + Math.cos(t) * 900)}" y2="${f(cy + Math.sin(t) * 900)}" stroke-width=".6" opacity=".2" stroke-dasharray="4 10"/>`; }
	g += '</g>';
	// Rumos no anel de 500.
	for (let a = 0; a < 360; a += 5) {
		const t = ((a - 90) * Math.PI) / 180, longo = a % 30 === 0;
		const x1 = cx + Math.cos(t) * 500, y1 = cy + Math.sin(t) * 500, x2 = cx + Math.cos(t) * (500 + (longo ? 16 : 7)), y2 = cy + Math.sin(t) * (500 + (longo ? 16 : 7));
		if (y1 < -20 || y1 > H + 20) continue;
		g += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${p.linha}" stroke-width="1" opacity=".7"/>`;
		if (longo) g += texto(cx + Math.cos(t) * 540, cy + Math.sin(t) * 540 + 5, String(a).padStart(3, '0'), p.fraca, 13, 'text-anchor="middle"');
	}
	g += `<ellipse cx="${cx}" cy="${cy}" rx="520" ry="140" fill="url(#limpo)"/>`;
	// Contatos. No celular a capa mostra só a faixa de x 270 a 1530: cada contato fica inteiro dentro dela ou fora dela,
	// para nenhum nome aparecer cortado na borda.
	for (const [x, y, nome, cor] of [[1400, 96, 'NAVE-03', p.linha], [330, 420, 'BOIA 7', p.linha], [1580, 390, '? SEM ID', p.brilho], [300, 110, 'ESTAÇÃO K', p.linha]]) {
		g += `<circle cx="${x}" cy="${y}" r="4" fill="${cor}"/><circle cx="${x}" cy="${y}" r="12" fill="none" stroke="${cor}" stroke-width="1" opacity=".6"/>`;
		g += `<line x1="${x + 12}" y1="${y - 8}" x2="${x + 34}" y2="${y - 22}" stroke="${cor}" stroke-width="1" opacity=".7"/>` + texto(x + 38, y - 24, nome, cor, 13, 'letter-spacing="1"');
	}
	g += texto(40, 496, 'VARREDURA ATIVA · ALCANCE 40 UA', p.fraca, 13, 'letter-spacing="2"') + texto(W - 40, 496, '4 CONTATOS', p.fraca, 13, 'text-anchor="end" letter-spacing="2"');
	return g;
}

// 3. Circuito: uma placa de verdade. Dois processadores, o ÉTER-9 à esquerda e o NÚCLEO à direita, ligados por dois
// barramentos que passam por cima e por baixo do nome; cada um tem as trilhas que saem pelas bordas, e o NÚCLEO
// acende quatro LEDs e alimenta o S2. As trilhas só andam reto ou a 45 graus, nunca se cruzam e nunca voltam para trás
// no eixo x: assim um pulso de luz que atravessa a capa de lado a lado (camadas camada-circuito-pulso-*.svg, animadas em
// animacoes.css) corre por cada trilha como energia pelo fio, inclusive nas dobras.

// Desloca uma polilinha para o lado (pela normal de cada trecho), com quinas em meia-esquadria: um barramento de trilhas
// paralelas faz as dobras de 45 graus sem mudar a distância entre elas.
function paralela(pts, d) {
	const normal = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [-dy / l, dx / l]; };
	return pts.map((b, i) => {
		const a = pts[i - 1], c = pts[i + 1];
		if (!a || !c) { const n = a ? normal(a, b) : normal(b, c); return [b[0] + n[0] * d, b[1] + n[1] * d]; }
		const n1 = normal(a, b), n2 = normal(b, c), k = 1 + n1[0] * n2[0] + n1[1] * n2[1];
		return [b[0] + ((n1[0] + n2[0]) * d) / k, b[1] + ((n1[1] + n2[1]) * d) / k];
	});
}
const polilinha = (pts) => 'M ' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ');

// Processador de quatro lados (QFP): n pinos por lado, a cada passo. Guarda a ponta de cada pino, onde a trilha começa.
function qfp(cx, cy, lado, n, passo) {
	const m = lado / 2, ks = Array.from({ length: n }, (_, k) => (k - (n - 1) / 2) * passo);
	return { cx, cy, lado, m,
		cima: ks.map((o) => [cx + o, cy - m - 10]), baixo: ks.map((o) => [cx + o, cy + m + 10]),
		esq: ks.map((o) => [cx - m - 10, cy + o]), dir: ks.map((o) => [cx + m + 10, cy + o]) };
}
// O ÉTER-9 e o NÚCLEO ficam fora da faixa que o celular mostra (x de 270 a 1530): lá a capa recorta as laterais, e um
// processador cortado ao meio parecia quebrado. No celular aparecem só os barramentos em volta do nome.
const ETER = qfp(190, 262, 120, 7, 14);
const NUCLEO = qfp(1620, 262, 140, 9, 14);
const S2 = { cx: 1716, cy: 478, w: 64, h: 28 };

const PLACA = (() => {
	const trilhas = {}, vias = [];
	// ÉTER-9, lado esquerdo: um leque que abre até a borda.
	ETER.esq.forEach(([x, y], k) => {
		const y2 = ETER.cy + (y - ETER.cy) * 2.2, d = Math.abs(y2 - y);
		trilhas[`LF${k}`] = [[x, y], [x - 14, y], [x - 14 - d, y2], [-10, y2]];
	});
	// ÉTER-9, de cima e de baixo: sobem (descem), dobram para a esquerda e saem pela borda; algumas param numa via.
	const fimLateral = [-10, 34, -10, 62, -10, 20, -10];
	const cimaE = [[ETER.cx, ETER.cima[0][1]], [ETER.cx, 166], [ETER.cx - 84, 82], [-10, 82]];
	const baixoE = [[ETER.cx, ETER.baixo[0][1]], [ETER.cx, 358], [ETER.cx - 84, 442], [-10, 442]];
	for (const [lado, base, nome] of [['cima', cimaE, 'TL'], ['baixo', baixoE, 'BL']]) {
		ETER[lado].forEach(([x], k) => {
			const pts = paralela(base, lado === 'cima' ? x - ETER.cx : ETER.cx - x);
			pts[3][0] = fimLateral[k];
			if (fimLateral[k] > 0) vias.push([fimLateral[k] - 5, pts[3][1]]);
			trilhas[`${nome}${k}`] = pts;
		});
	}
	// Barramentos ÉTER-9 → NÚCLEO, um por cima e outro por baixo do nome.
	const xn = NUCLEO.esq[0][0];
	const barCima = [[ETER.dir[0][0], 234], [278, 234], [454, 58], [1306, 58], [1482, 234], [xn, 234]];
	const barBaixo = [[ETER.dir[0][0], 290], [278, 290], [450, 462], [1310, 462], [1482, 290], [xn, 290]];
	[-14, 0, 14].forEach((d, k) => { trilhas[`TB${k}`] = paralela(barCima, d); trilhas[`BB${k}`] = paralela(barBaixo, d); });
	// O pino do meio de cada lado vai até uma via de teste, antes do nome.
	trilhas.SE = [[ETER.dir[0][0], 262], [326, 262]];
	trilhas.SD = [[xn, 262], [1474, 262]];
	vias.push([331, 262], [1469, 262]);
	// NÚCLEO, lado direito: leque até o conector da borda.
	NUCLEO.dir.forEach(([x, y], k) => {
		const y2 = NUCLEO.cy + (y - NUCLEO.cy) * 1.8, d = Math.abs(y2 - y);
		trilhas[`NF${k}`] = [[x, y], [x + 12, y], [x + 12 + d, y2], [1772, y2]];
	});
	// NÚCLEO, de cima: os quatro da esquerda acendem os LEDs; os cinco da direita sobem e saem pela borda.
	const leds = [[1585, NUCLEO.cima[0][1]], [1585, 160], [1545, 120], [1497, 120]];
	const cimaN = [[NUCLEO.cx, NUCLEO.cima[0][1]], [NUCLEO.cx, 146], [NUCLEO.cx + 76, 70], [1810, 70]];
	NUCLEO.cima.forEach(([x], k) => {
		if (k >= 4) { trilhas[`NT${k}`] = paralela(cimaN, x - NUCLEO.cx); return; }
		// Os LEDs ficam desencontrados, um mais à esquerda que o outro, para caberem sem encostar.
		const pts = paralela(leds, x - 1585);
		pts[3][0] = k % 2 ? 1471 : 1497;
		trilhas[`NL${k}`] = pts;
	});
	// NÚCLEO, de baixo: os cinco da esquerda param em vias de teste, os quatro da direita descem até o S2.
	NUCLEO.baixo.forEach(([x, y], k) => {
		if (k < 5) { const fundo = [372, 392, 412, 392, 372][k]; trilhas[`NB${k}`] = [[x, y], [x, fundo]]; vias.push([x, fundo + 5]); return; }
		const alvo = S2.cx - 21 + (k - 5) * 14, d = alvo - x;
		trilhas[`NS${k}`] = [[x, y], [x, 380], [x + d, 380 + d], [alvo, S2.cy - S2.h / 2 - 9]];
	});
	// O S2 desce até a borda de baixo.
	for (let k = 0; k < 4; k++) trilhas[`SB${k}`] = [[S2.cx - 21 + k * 14, S2.cy + S2.h / 2 + 9], [S2.cx - 21 + k * 14, 530]];
	return { trilhas, vias };
})();

// Pulsos: cada camada guarda trilhas de cima do nome (o pulso do ::before) e de baixo (o do ::after). Numa mesma metade,
// as trilhas de uma camada não dividem a mesma faixa de x, para o pulso passar por uma de cada vez, como um dado que
// entra num processador e sai do outro lado; as trilhas paralelas do mesmo barramento ficam em camadas diferentes.
const PULSOS = [
	['TL1', 'TB0', 'NT5', 'BL2', 'BB1', 'NS6'],
	['LF0', 'TB1', 'NF1', 'LF5', 'BB2', 'NF6'],
	['TL4', 'TB2', 'NT7', 'BL5', 'BB0', 'NF8'],
	['LF2', 'NL1', 'NF3', 'LF4', 'NS5'],
	['TL6', 'NT8', 'BL0', 'NF7'],
	['TL2', 'NL3', 'NF0', 'LF6', 'NS8'],
];
// Corpos de peças por onde a trilha passa por baixo: o pulso some ali e reaparece do outro lado.
const RESISTORES = [0, 2, 4, 6].map((k) => [36, PLACA.trilhas[`LF${k}`][3][1]]);

function chipDesenho(c, p, rotulo, miolo) {
	let pernas = '';
	for (const [x, y] of c.cima) pernas += `M ${f(x)} ${f(y)} V ${f(c.cy - c.m)} `;
	for (const [x, y] of c.baixo) pernas += `M ${f(x)} ${f(y)} V ${f(c.cy + c.m)} `;
	for (const [x, y] of c.esq) pernas += `M ${f(x)} ${f(y)} H ${f(c.cx - c.m)} `;
	for (const [x, y] of c.dir) pernas += `M ${f(x)} ${f(y)} H ${f(c.cx + c.m)} `;
	const { cx, cy, m, lado } = c, d = lado * 0.5, dy = cy - 8;
	let g = `<path d="${pernas}" stroke="${p.linha}" stroke-width="3.6" fill="none"/>`;
	g += `<rect x="${cx - m}" y="${cy - m}" width="${lado}" height="${lado}" rx="5" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="2"/>`;
	g += `<rect x="${cx - m + 6}" y="${cy - m + 6}" width="${lado - 12}" height="${lado - 12}" rx="3" fill="none" stroke="${p.linha}" stroke-width=".8" opacity=".4"/>`;
	g += `<rect x="${f(cx - d / 2)}" y="${f(dy - d / 2)}" width="${f(d)}" height="${f(d)}" rx="2" fill="${p.linha}" fill-opacity=".1" stroke="${p.linha}" stroke-width="1.3" opacity=".85"/>`;
	if (miolo === 'cristal') {
		const r = d * 0.36;
		g += `<path d="M ${cx} ${f(dy - r)} L ${f(cx + r * 0.8)} ${dy} L ${cx} ${f(dy + r)} L ${f(cx - r * 0.8)} ${dy} Z M ${cx} ${f(dy - r)} V ${f(dy + r)} M ${f(cx - r * 0.8)} ${dy} H ${f(cx + r * 0.8)}" fill="none" stroke="${p.linha}" stroke-width="1.2" opacity=".75"/>`;
	} else {
		const t = d / 4.2;
		for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) g += `<rect x="${f(cx + i * t * 1.35 - t / 2)}" y="${f(dy + j * t * 1.35 - t / 2)}" width="${f(t)}" height="${f(t)}" fill="${p.linha}" opacity="${i === 0 && j === 0 ? 0.7 : 0.35}"/>`;
	}
	g += `<circle cx="${cx - m + 14}" cy="${cy - m + 14}" r="3.2" fill="${p.linha}" opacity=".8"/>`;
	g += texto(cx, cy + m - 12, rotulo, p.linha, 13, 'text-anchor="middle" letter-spacing="2"');
	return g;
}
// Peça SMD de dois terminais (resistor, capacitor), deitada ou em pé.
const smd = (p, x, y, deitada = true, comp = 24, larg = 10) => {
	const [w, h] = deitada ? [comp, larg] : [larg, comp], pw = deitada ? 6 : larg, ph = deitada ? larg : 6;
	return `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="1.5" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.2"/>`
		+ `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${pw}" height="${ph}" fill="${p.linha}" opacity=".7"/><rect x="${f(x + w / 2 - pw)}" y="${f(y + h / 2 - ph)}" width="${pw}" height="${ph}" fill="${p.linha}" opacity=".7"/>`;
};
const LEDS = [0, 1, 2, 3].map((k) => [k % 2 ? 1462 : 1488, PLACA.trilhas[`NL${k}`][3][1]]);

function circuito(p) {
	let g = fundoLinear(p) + grade(p, 24, 0.07);
	const todas = Object.values(PLACA.trilhas).map((t) => `<path d="${polilinha(t)}"/>`).join('');
	g += `<g fill="none" stroke="${p.linha}" stroke-width="7" opacity=".07" stroke-linejoin="round">${todas}</g>`;
	g += `<g fill="none" stroke="${p.linha}" stroke-width="1.7" opacity=".75" stroke-linejoin="round">${todas}</g>`;
	for (const [x, y] of PLACA.vias) g += `<circle cx="${x}" cy="${f(y)}" r="5" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.8"/>`;
	// Conector de borda à direita: os dedos onde chega o leque do NÚCLEO.
	for (let k = 0; k < 9; k++) { const y = PLACA.trilhas[`NF${k}`][3][1]; g += `<rect x="1772" y="${f(y - 7)}" width="40" height="14" rx="2" fill="${p.linha}" fill-opacity=".22" stroke="${p.linha}" stroke-width="1.4"/>`; }
	for (const [x, y] of RESISTORES) g += smd(p, x, y);
	// Capacitores de desacoplamento junto dos processadores e o cristal do ÉTER-9, todos fora da faixa do celular
	// (uma peça cortada pela borda da capa parecia quebrada).
	g += smd(p, 246, 162, false, 20, 9) + smd(p, 260, 162, false, 20, 9) + smd(p, 1548, 370, false, 20, 9) + smd(p, 1548, 396, false, 20, 9);
	g += `<rect x="244" y="346" width="16" height="38" rx="8" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.4"/><rect x="248" y="352" width="8" height="26" rx="4" fill="none" stroke="${p.linha}" stroke-width=".8" opacity=".6"/>` + texto(252, 400, 'XT1', p.linha, 11, 'text-anchor="middle" opacity=".7"');
	// LEDs de atividade do NÚCLEO (o brilho que pisca é uma camada por cima).
	for (const [x, y] of LEDS) g += `<rect x="${x - 9}" y="${f(y - 6)}" width="18" height="12" rx="2" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.3"/><circle cx="${x}" cy="${f(y)}" r="2.6" fill="${p.linha}" opacity=".45"/>`;
	g += chipDesenho(ETER, p, 'ÉTER-9', 'cristal') + chipDesenho(NUCLEO, p, 'NÚCLEO', 'nucleos');
	// S2: um chip pequeno de oito pinos.
	let pinos = '';
	for (let k = 0; k < 4; k++) { const x = S2.cx - 21 + k * 14; pinos += `M ${x} ${S2.cy - S2.h / 2 - 9} V ${S2.cy - S2.h / 2} M ${x} ${S2.cy + S2.h / 2} V ${S2.cy + S2.h / 2 + 9} `; }
	g += `<path d="${pinos}" stroke="${p.linha}" stroke-width="3.4"/><rect x="${S2.cx - S2.w / 2}" y="${S2.cy - S2.h / 2}" width="${S2.w}" height="${S2.h}" rx="3" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.8"/>` + texto(S2.cx, S2.cy + 4.5, 'S2', p.linha, 12, 'text-anchor="middle" letter-spacing="2"');
	return g;
}

// Máscaras dos pulsos: as trilhas de cada camada mais grossas, com um halo desfocado (o desfoque é calculado uma vez,
// quando o navegador rasteriza a máscara), e um recorte onde passam sob uma peça.
function circuitoPulso(k) {
	const nomes = PULSOS[k];
	const recortes = RESISTORES.map(([x, y]) => `<rect x="${x - 12}" y="${f(y - 6)}" width="24" height="12" fill="#000"/>`).join('');
	const d = nomes.map((n) => polilinha(PLACA.trilhas[n])).join(' ');
	return `<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${recortes}</mask><filter id="b" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feGaussianBlur stdDeviation="4"/></filter></defs><g mask="url(#m)" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke-width="12" opacity=".6" filter="url(#b)"/><path d="${d}" stroke-width="3.6"/></g>`;
}
// Brilho dos LEDs, em dois grupos que piscam em ritmos diferentes.
function circuitoLeds(grupo) {
	return `<defs><radialGradient id="h"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>` + LEDS.filter((_, k) => k % 2 === grupo).map(([x, y]) => `<circle cx="${x}" cy="${f(y)}" r="16" fill="url(#h)" stroke="none"/><circle cx="${x}" cy="${f(y)}" r="3.2" fill="#fff" stroke="none"/>`).join('');
}

// 4. Navegação: um planeta em malha de arame no canto, a órbita em volta dele e a rota até o destino marcado.
// A órbita é uma elipse inclinada em duas metades: a de trás, tracejada e fraca, passa por trás do planeta (o disco
// dele a cobre); a da frente, contínua e com brilho, passa por cima. O satélite que percorre a órbita é uma camada do
// CSS (animacoes.css), com os números de ORBITA_CAPA: se a órbita mudar aqui, rode o gerador e copie os valores que
// ele mostra para lá.
const ORBITA_CAPA = { cx: 170, cy: 360, a: 320, b: 90, inclinacao: 10, raio: 210 };
function navegacao(p) {
	const { cx: px, cy: py, raio: pr, a, b, inclinacao } = ORBITA_CAPA;
	let g = fundoLinear(p);
	// Grade de coordenadas da carta de navegação, com marcas nas interseções.
	g += `<g stroke="${p.fraca}" stroke-width=".8" opacity=".16">`;
	for (let x = 90; x < W; x += 90) g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
	for (let y = 70; y < H; y += 90) g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
	g += `</g><g stroke="${p.linha}" stroke-width="1" opacity=".35">`;
	for (let x = 90; x < W; x += 180) for (let y = 70; y < H; y += 180) g += `<path d="M ${x - 5} ${y} H ${x + 5} M ${x} ${y - 5} V ${y + 5}"/>`;
	g += '</g>';
	g += estrelas(p, 300, 151, (x, y) => Math.hypot(x - px, y - py) < pr + 10);
	g += `<defs><radialGradient id="atm" cx="${f((px / W) * 100)}%" cy="100%" r="35%"><stop offset="0" stop-color="${p.linha}" stop-opacity=".22"/><stop offset="1" stop-color="${p.linha}" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#atm)"/>`;
	// Metade de trás da órbita (desenhada antes do planeta, que a cobre onde passa por trás).
	const orbita = (lado, extra) => `<path d="M ${f(px - a)} ${py} A ${a} ${b} 0 0 ${lado} ${f(px + a)} ${py}" transform="rotate(${inclinacao} ${px} ${py})" fill="none" ${extra}/>`;
	g += orbita(1, `stroke="${p.linha}" stroke-width="1.4" stroke-dasharray="6 8" opacity=".45"`);
	// Planeta: paralelos e meridianos.
	g += `<circle cx="${px}" cy="${py}" r="${pr}" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="2"/>`;
	g += `<g fill="none" stroke="${p.linha}" stroke-width="1" opacity=".55" transform="rotate(-18 ${px} ${py})">`;
	for (let k = -4; k <= 4; k++) { const yy = py + (k * pr) / 5, rx = Math.sqrt(pr * pr - ((k * pr) / 5) ** 2); g += `<ellipse cx="${px}" cy="${f(yy)}" rx="${f(rx)}" ry="${f(rx * 0.16)}"/>`; }
	for (let k = 1; k <= 5; k++) g += `<ellipse cx="${px}" cy="${py}" rx="${f(pr * Math.cos((k * Math.PI) / 12))}" ry="${pr}"/>`;
	g += '</g>';
	// Volume: o lado longe da luz escurece, e a borda iluminada ganha um brilho fino de atmosfera.
	g += `<defs><radialGradient id="sombra" cx="72%" cy="18%" r="95%"><stop offset=".35" stop-color="${p.fundo[2]}" stop-opacity="0"/><stop offset="1" stop-color="${p.fundo[2]}" stop-opacity=".75"/></radialGradient></defs><circle cx="${px}" cy="${py}" r="${pr}" fill="url(#sombra)"/><circle cx="${px}" cy="${py}" r="${pr + 5}" fill="none" stroke="${p.linha}" stroke-width="8" opacity=".08"/>`;
	// Metade da frente da órbita, por cima do planeta: um halo largo e o traço firme.
	g += orbita(0, `stroke="${p.linha}" stroke-width="9" opacity=".1"`) + orbita(0, `stroke="${p.linha}" stroke-width="2.2" opacity=".9"`);
	// Rota curva até o destino, saindo da borda iluminada do planeta.
	const [r0, r1, r2, r3] = [[px + pr * 0.5, py - pr * 0.87], [520, 50], [1100, 20], [1580, 120]];
	const bezier = (t) => [0, 1].map((i) => (1 - t) ** 3 * r0[i] + 3 * (1 - t) ** 2 * t * r1[i] + 3 * (1 - t) * t * t * r2[i] + t ** 3 * r3[i]);
	const [dx, dy] = r3;
	g += `<path d="M ${f(r0[0])} ${f(r0[1])} C ${r1.join(' ')}, ${r2.join(' ')}, ${dx} ${dy}" fill="none" stroke="${p.brilho}" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round"/>`;
	g += `<circle cx="${dx}" cy="${dy}" r="8" fill="none" stroke="${p.brilho}" stroke-width="2"/><circle cx="${dx}" cy="${dy}" r="22" fill="none" stroke="${p.brilho}" stroke-width="1" opacity=".6"/><circle cx="${dx}" cy="${dy}" r="38" fill="none" stroke="${p.brilho}" stroke-width=".8" opacity=".35" stroke-dasharray="4 6"/>`;
	g += texto(dx + 48, dy - 6, 'DESTINO', p.brilho, 14, 'letter-spacing="3" font-weight="700"') + texto(dx + 48, dy + 14, 'MOGAR · 3,2 UA', p.fraca, 13, 'letter-spacing="1"');
	// Pontos de passagem em cima da rota.
	for (const [t, n] of [[0.3, 'PP-1'], [0.62, 'PP-2']]) { const [x, y] = bezier(t).map(f); g += `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.6" transform="rotate(45 ${x} ${y})"/>` + texto(x, y - 14, n, p.fraca, 12, 'text-anchor="middle"'); }
	// Painel de dados à direita, embaixo. O painel e o destino ficam além da faixa que o celular mostra (x até 1530):
	// cortados pela borda, pareciam quebrados.
	const linhas = ['ÓRBITA ESTÁVEL', 'Δv 0,84 km/s', 'CHEGADA T+06:12', 'ÉTER 72%'];
	g += `<rect x="${W - 260}" y="${H - 150}" width="220" height="110" fill="${p.fundo[1]}" fill-opacity=".6" stroke="${p.linha}" stroke-width="1.2"/>`;
	linhas.forEach((l, i) => (g += texto(W - 244, H - 120 + i * 24, l, i === 0 ? p.linha : p.fraca, 13, 'letter-spacing="1"')));
	g += canto(W - 260, H - 150, 1, 1, 16, p.brilho, 2.4);
	return g;
}

// Fantasia: capas únicas (o tema é o mesmo no claro e no escuro). O centro fica livre para o nome.

// Bosque Feérico: uma clareira ao luar vista da mata. Ao fundo, a linha de árvores distantes sob a névoa; nos lados,
// troncos escuros emoldurando a cena; no chão, samambaias; a lua e os vaga-lumes no meio.
// Folha pontuda: duas curvas que afinam nas pontas.
function folhaPontuda(x, y, ang, comp, larg, cor, op) {
	const tx = x + Math.cos(ang) * comp, ty = y + Math.sin(ang) * comp, nx = -Math.sin(ang) * larg, ny = Math.cos(ang) * larg;
	const mx = x + Math.cos(ang) * comp * 0.45, my = y + Math.sin(ang) * comp * 0.45;
	return `<path d="M ${f(x)} ${f(y)} Q ${f(mx + nx)} ${f(my + ny)} ${f(tx)} ${f(ty)} Q ${f(mx - nx)} ${f(my - ny)} ${f(x)} ${f(y)} Z" fill="${cor}" opacity="${f(op)}"/>`;
}
function bosque(p) {
	const r = sorteio(211);
	const longe = mistura(p.fundo[1], p.brilho, 0.1), meio = mistura(p.fundo[2], p.folha2, 0.35), perto = mistura(p.fundo[2], '#000000', 0.45);
	let g = `<defs><radialGradient id="ceu" cx="62%" cy="18%" r="85%"><stop offset="0" stop-color="${mistura(p.fundo[0], p.brilho, 0.12)}"/><stop offset=".55" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></radialGradient>
	<radialGradient id="lua"><stop offset="0" stop-color="${p.brilho}" stop-opacity=".42"/><stop offset=".4" stop-color="${p.brilho}" stop-opacity=".12"/><stop offset="1" stop-color="${p.brilho}" stop-opacity="0"/></radialGradient>
	<linearGradient id="nevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.brilho}" stop-opacity="0"/><stop offset=".5" stop-color="${p.brilho}" stop-opacity=".1"/><stop offset="1" stop-color="${p.brilho}" stop-opacity="0"/></linearGradient>
	<radialGradient id="vaga"><stop offset="0" stop-color="${p.vaga}" stop-opacity="1"/><stop offset=".3" stop-color="${p.vaga}" stop-opacity=".45"/><stop offset="1" stop-color="${p.vaga}" stop-opacity="0"/></radialGradient>
	<radialGradient id="veu"><stop offset="0" stop-color="${p.fundo[1]}" stop-opacity=".5"/><stop offset="1" stop-color="${p.fundo[1]}" stop-opacity="0"/></radialGradient></defs>
	<rect width="${W}" height="${H}" fill="url(#ceu)"/>`;
	g += estrelas(p, 140, 201, (x, y) => y > 280);
	// Lua cheia baixa, com halo largo.
	g += `<circle cx="1330" cy="120" r="260" fill="url(#lua)"/><circle cx="1330" cy="120" r="34" fill="${p.brilho}" opacity=".92"/>`;
	// Linha de árvores distantes: pinheiros recortados e copas redondas de alturas variadas, sobrepostos, sob a névoa.
	const arvoreLonge = (x, base, alt) => {
		if (r() < 0.65) {
			let d = `M ${f(x)} ${f(base - alt)}`, l = alt * 0.28;
			for (let k = 1; k <= 4; k++) { const y = base - alt + (alt * k) / 4, w = (l * k) / 4 + 2; d += ` L ${f(x + w)} ${f(y)} L ${f(x + w * 0.45)} ${f(y - 2)}`; }
			d += ` L ${f(x - l * 0.45)} ${f(base - 2)}`;
			for (let k = 4; k >= 1; k--) { const y = base - alt + (alt * k) / 4, w = (l * k) / 4 + 2; d += ` L ${f(x - w)} ${f(y)} L ${f(x - w * 0.45)} ${f(y - 2)}`; }
			return `<path d="${d} Z"/>`;
		}
		return `<ellipse cx="${f(x)}" cy="${f(base - alt * 0.55)}" rx="${f(alt * 0.32)}" ry="${f(alt * 0.5)}"/><rect x="${f(x - 2)}" y="${f(base - alt * 0.2)}" width="4" height="${f(alt * 0.2)}"/>`;
	};
	g += `<g fill="${longe}" opacity=".85">`;
	for (let i = 0; i < 150; i++) { const x = r() * (W + 40) - 20, base = 372 + Math.sin(x / 170) * 12; g += arvoreLonge(x, base, 38 + r() * 70 * (0.6 + 0.4 * Math.abs(Math.sin(x / 260)))); }
	g += `</g><rect y="330" width="${W}" height="${H - 330}" fill="${longe}" opacity=".85"/><rect y="250" width="${W}" height="170" fill="url(#nevoa)"/>`;
	// Árvores do meio, mais escuras, só nas laterais.
	const pinheiro = (x, base, alt, cor) => {
		let s = `<rect x="${f(x - 3)}" y="${f(base - alt * 0.25)}" width="6" height="${f(alt * 0.25)}" fill="${cor}"/>`;
		for (let k = 0; k < 5; k++) { const y = base - alt * 0.2 - k * alt * 0.17, l = alt * 0.32 * (1 - k * 0.16); s += `<path d="M ${f(x - l)} ${f(y)} Q ${f(x)} ${f(y - alt * 0.08)} ${f(x + l)} ${f(y)} L ${f(x)} ${f(y - alt * 0.3)} Z" fill="${cor}"/>`; }
		return s;
	};
	for (const [x, alt] of [[230, 230], [330, 190], [420, 150], [1400, 160], [1500, 210], [1610, 240]]) g += pinheiro(x, H - 30, alt, meio);
	// Chão escuro.
	g += `<path d="M -10 ${H - 40} Q 450 ${H - 58} 900 ${H - 44} T 1810 ${H - 50} V ${H + 10} H -10 Z" fill="${perto}"/>`;
	// Troncos da frente emoldurando a cena.
	const tronco = (xf, lado) => {
		// xf é a borda de fora (fora da capa); a borda de dentro afina de 130 px na base para 60 px no alto.
		const xi = (y) => xf + lado * (60 + 70 * (y / H) ** 2 + 8 * Math.sin(y / 37));
		let d = `M ${xf} ${H + 10}`, borda = '';
		for (let y = H + 10; y >= -10; y -= 26) { d += ` L ${f(xi(y))} ${y}`; borda += `${borda ? ' L' : 'M'} ${f(xi(y))} ${y}`; }
		d += ` L ${xf} -10 Z`;
		let casca = '';
		for (let k = 0; k < 9; k++) { const y0 = 40 + k * 52, x = xf + lado * (18 + (k % 3) * 12); casca += `<path d="M ${x} ${y0} q ${lado * 4} 18 0 36" stroke="${mistura(perto, p.brilho, 0.12)}" stroke-width="1.4" fill="none" opacity=".6"/>`; }
		return `<path d="${d}" fill="${perto}"/>${casca}<path d="${borda}" fill="none" stroke="${mistura(perto, p.brilho, 0.3)}" stroke-width="1.6" opacity="${lado < 0 ? 0.7 : 0.3}"/>`;
	};
	g += tronco(-20, 1) + tronco(1820, -1);
	// Samambaias no chão: folíolos pontudos ao longo de uma haste curva.
	const samambaia = (x, y, ang, comp, sem) => {
		const rr = sorteio(sem);
		let s = '';
		for (let k = 0; k < 11; k++) {
			const t = k / 11, a = ang - t * 0.5, px = x + Math.cos(a) * comp * t, py = y + Math.sin(a) * comp * t, l = 22 * (1 - t * 0.8);
			for (const lado of [-1, 1]) s += folhaPontuda(px, py, a + lado * 1.1, l, l * 0.22, p.folha2, 0.7);
		}
		return s + `<path d="M ${x} ${y} Q ${f(x + Math.cos(ang) * comp * 0.5)} ${f(y + Math.sin(ang) * comp * 0.5 - 6)} ${f(x + Math.cos(ang - 0.5) * comp)} ${f(y + Math.sin(ang - 0.5) * comp)}" fill="none" stroke="${p.folha2}" stroke-width="1.4" opacity=".8"/>`;
	};
	for (const [x, ang, comp, sem] of [[110, -1.2, 120, 231], [150, -0.6, 140, 232], [70, -1.9, 110, 233], [300, -1.3, 90, 234], [1700, -1.95, 120, 235], [1660, -2.5, 140, 236], [1740, -1.3, 110, 237], [1520, -1.8, 90, 238]]) g += samambaia(x, H - 34, ang, comp, sem);
	// Os vaga-lumes não ficam pintados aqui: são as camadas de bosqueVagalumes, que vagam e piscam (parados ao lado dos
	// que se mexem, pareciam presos na tela).
	g += `<ellipse cx="${W / 2}" cy="${H / 2}" rx="520" ry="150" fill="url(#veu)"/>`;
	return g;
}
// Vaga-lumes da capa, em três camadas que vagam devagar e piscam cada uma no seu ritmo (subindo em fila, pareciam um
// ladrilho repetido). Ficam fora da área do nome, mais perto do chão e das árvores.
function bosqueVagalumes(k) {
	const r = sorteio(261 + k * 7);
	let g = '<defs><radialGradient id="v"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
	for (let i = 0, n = 0; i < 60 && n < 13; i++) {
		const x = 30 + r() * (W - 60), y = 60 + Math.pow(r(), 0.7) * (H - 110), s = 9 + r() * 9;
		if (x > 500 && x < 1300 && y > 140 && y < 380) continue;
		g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s)}" fill="url(#v)" stroke="none"/><circle cx="${f(x)}" cy="${f(y)}" r="2.8" fill="#fff" stroke="none"/>`;
		n++;
	}
	return g;
}

// Vitral: parede de cantaria no escuro com quatro janelas góticas. Cada janela tem duas lancetas e um óculo com
// quadrifólio no alto, e o vidro é um mosaico de peças irregulares em tons de joia, mais claro onde a luz atravessa.
// O meio fica livre para o nome.
// Mosaico de peças: uma grade irregular (pontos sorteados nas interseções) dividida em quadriláteros.
function mosaico(r, x0, y0, x1, y1, passo, cores, chumbo) {
	const nx = Math.ceil((x1 - x0) / passo), ny = Math.ceil((y1 - y0) / passo), pt = [];
	for (let j = 0; j <= ny; j++) { pt.push([]); for (let i = 0; i <= nx; i++) { const borda = i === 0 || j === 0 || i === nx || j === ny; pt[j].push([x0 + (i * (x1 - x0)) / nx + (borda ? 0 : (r() - 0.5) * passo * 0.55), y0 + (j * (y1 - y0)) / ny + (borda ? 0 : (r() - 0.5) * passo * 0.55)]); } }
	let s = '';
	for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
		const [a, b, c, d] = [pt[j][i], pt[j][i + 1], pt[j + 1][i + 1], pt[j + 1][i]];
		const cor = cores[Math.floor(r() * cores.length)], tom = r();
		s += `<path d="M ${f(a[0])} ${f(a[1])} L ${f(b[0])} ${f(b[1])} L ${f(c[0])} ${f(c[1])} L ${f(d[0])} ${f(d[1])} Z" fill="${tom < 0.3 ? mistura(cor, '#ffffff', 0.18) : tom > 0.8 ? mistura(cor, '#000000', 0.25) : cor}" stroke="${chumbo}" stroke-width="2.6" stroke-linejoin="round"/>`;
	}
	return s;
}
const VITRAL_JANELAS = [112, 326, 1474, 1688], VITRAL_LARG = 156;
function vitral(p) {
	const r = sorteio(301);
	let g = `<defs><linearGradient id="parede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset="1" stop-color="${p.fundo[1]}"/></linearGradient>
	<radialGradient id="brilho" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="${p.luz}" stop-opacity=".45"/><stop offset=".6" stop-color="${p.luz}" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
	<linearGradient id="feixe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.luz}" stop-opacity=".1"/><stop offset="1" stop-color="${p.luz}" stop-opacity="0"/></linearGradient>
	<radialGradient id="veu"><stop offset="0" stop-color="${p.fundo[1]}" stop-opacity=".6"/><stop offset="1" stop-color="${p.fundo[1]}" stop-opacity="0"/></radialGradient></defs>
	<rect width="${W}" height="${H}" fill="url(#parede)"/>`;
	// Cantaria: blocos com leve variação de tom e juntas finas.
	for (let y = 0, k = 0; y < H; y += 46, k++) for (let x = k % 2 ? -55 : 0; x < W; x += 110) g += `<rect x="${x + 1}" y="${y + 1}" width="108" height="44" fill="${mistura(p.fundo[0], r() < 0.5 ? '#000000' : '#ffffff', r() * 0.05)}" opacity=".35"/>`;
	// Cores do vidro: as três da paleta, mais um âmbar tirado da luz.
	const joias = [p.vidros[0][0], p.vidros[1][0], p.vidros[2][0], mistura(p.vidros[0][0], p.luz, 0.55), mistura(p.vidros[1][0], '#000000', 0.25)];
	// As janelas de dentro ficam a uns 15 px do nome na capa do computador (antes o M encostava na janela da direita).
	const larg = VITRAL_LARG, alto = 400, base = 486;
	for (const [k, cx] of VITRAL_JANELAS.entries()) {
		// Cada janela tem uma cor dominante, com toques das outras (sem virar colcha de retalhos).
		const dom = joias[[1, 0, 0, 1][k]], cores = [dom, dom, dom, dom, dom, mistura(dom, '#000000', 0.22), mistura(dom, '#ffffff', 0.12), joias[2], joias[3]];
		const x0 = cx - larg / 2, x1 = cx + larg / 2, topo = base - alto, ombro = topo + larg * 0.62;
		const arco = `M ${x0} ${base} V ${ombro} Q ${x0} ${topo + 14} ${cx} ${topo - 26} Q ${x1} ${topo + 14} ${x1} ${ombro} V ${base} Z`;
		const id = `j${cx}`;
		// Feixe de luz descendo no chão.
		g += `<path d="M ${x0 + 10} ${base - 10} L ${x1 - 10} ${base - 10} L ${x1 + 120} ${H + 10} L ${x0 + 40} ${H + 10} Z" fill="url(#feixe)"/>`;
		// Vidro: mosaico e o brilho por cima, recortados na janela.
		g += `<defs><clipPath id="${id}"><path d="${arco}"/></clipPath></defs><g clip-path="url(#${id})">${mosaico(r, x0, topo - 30, x1, base, 20, cores, p.chumbo)}<rect x="${x0}" y="${topo - 30}" width="${larg}" height="${alto + 30}" fill="url(#brilho)"/></g>`;
		// Rendilhado de pedra: mainel no meio, as duas lancetas e o óculo com quadrifólio.
		const pedra = p.pedra, w = 7;
		g += `<g fill="none" stroke="${pedra}" stroke-linejoin="round">`;
		g += `<line x1="${cx}" y1="${ombro + 34}" x2="${cx}" y2="${base}" stroke-width="${w}"/>`;
		for (const [a, b] of [[x0, cx], [cx, x1]]) { const m = (a + b) / 2; g += `<path d="M ${a} ${ombro + 70} Q ${a} ${ombro + 8} ${m} ${ombro - 10} Q ${b} ${ombro + 8} ${b} ${ombro + 70}" stroke-width="${w - 1}"/>`; }
		const oy = topo + 52, or = 30;
		g += `<circle cx="${cx}" cy="${oy}" r="${or}" stroke-width="${w - 1}"/>`;
		for (const a of [0, 90, 180, 270]) { const t = (a * Math.PI) / 180; g += `<circle cx="${f(cx + Math.cos(t) * or * 0.42)}" cy="${f(oy + Math.sin(t) * or * 0.42)}" r="${f(or * 0.42)}" stroke-width="3"/>`; }
		g += `</g><g clip-path="url(#${id})"><path d="${arco}" fill="none" stroke="${mistura(p.luz, '#b8862b', 0.62)}" stroke-width="34"/><path d="${arco}" fill="none" stroke="${p.chumbo}" stroke-width="34" stroke-dasharray="2 18" opacity=".9"/><path d="${arco}" fill="none" stroke="${p.chumbo}" stroke-width="2.6" transform="translate(${cx} ${(topo + base) / 2}) scale(${f((larg - 34) / larg)} ${f((alto - 20) / alto)}) translate(-${cx} -${(topo + base) / 2})"/></g><path d="${arco}" fill="none" stroke="${pedra}" stroke-width="14"/><path d="${arco}" fill="none" stroke="${p.prata}" stroke-width="1.2" opacity=".35"/>`;
		// Peitoril.
		g += `<rect x="${x0 - 14}" y="${base - 4}" width="${larg + 28}" height="12" fill="${pedra}"/>`;
	}
	g += `<rect x="0" y="${base + 8}" width="${W}" height="${H - base}" fill="${p.fundo[1]}"/>`;
	g += `<ellipse cx="${W / 2}" cy="${H / 2}" rx="480" ry="170" fill="url(#veu)"/>`;
	return g;
}

// Camadas do Vitral (máscaras brancas no quadro da capa, com as mesmas medidas das janelas de vitral()): a luz atrás do
// vidro, em dois grupos de janelas que acendem e apagam fora de compasso, como nuvens passando na frente da lua; o halo
// que essa luz deixa na pedra em volta de cada janela; e o pó suspenso diante delas.
function vitralArco(cx) {
	const larg = VITRAL_LARG, base = 486, topo = base - 400, ombro = topo + larg * 0.62, x0 = cx - larg / 2, x1 = cx + larg / 2;
	return `M ${x0} ${base} V ${f(ombro)} Q ${x0} ${topo + 14} ${cx} ${topo - 26} Q ${x1} ${topo + 14} ${x1} ${f(ombro)} V ${base} Z`;
}
function vitralLuz(grupo) {
	const janelas = VITRAL_JANELAS.filter((_, k) => k % 2 === grupo);
	return '<defs><radialGradient id="l" cx="50%" cy="38%" r="65%"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/></radialGradient></defs>' +
		janelas.map((cx) => `<path d="${vitralArco(cx)}" fill="url(#l)" stroke="none"/>`).join('');
}
function vitralHalo(grupo) {
	const janelas = VITRAL_JANELAS.filter((_, k) => k % 2 === grupo);
	return '<defs><radialGradient id="h"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>' +
		janelas.map((cx) => `<ellipse cx="${cx}" cy="270" rx="150" ry="290" fill="url(#h)" stroke="none"/>`).join('');
}
function vitralPoeira() {
	const r = sorteio(331);
	let g = '<defs><radialGradient id="p"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
	for (const cx of VITRAL_JANELAS) for (let i = 0; i < 9; i++) { const x = cx - 85 + r() * 170, y = 90 + r() * 380, s = 1.6 + r() * 2.6; g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s)}" fill="url(#p)" stroke="none" opacity="${f(0.5 + r() * 0.5)}"/>`; }
	return g;
}

// Mapa do Aventureiro: uma carta de navegação. Duas costas com morros em hachura, florestas, rio e vila; no canal, ilhas
// onde a rota faz escala, passando por trás do nome até o X. As ondas e o barco são camadas à parte (mapaOndas e
// mapaBarco), que se mexem por cima.
const MAPA_ROTA = [[392, 296], [560, 410], [760, 330], [1040, 170], [1250, 360], [1556, 238]];
const MAPA_ILHAS = [[560, 410, 46, 26], [1040, 170, 54, 30], [1250, 360, 40, 24]];
function mapa(p) {
	const r = sorteio(511);
	let g = `<defs><radialGradient id="papel" cx="50%" cy="50%" r="75%"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".75" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></radialGradient></defs>
	<rect width="${W}" height="${H}" fill="url(#papel)"/>`;
	// Contorno recortado de uma costa (lado -1 = esquerda, 1 = direita).
	const costa = (xBase, lado, sem) => {
		const rr = sorteio(sem), pts = [];
		for (let y = -20; y <= H + 20; y += 16) pts.push([xBase + Math.sin(y / 60) * 30 + Math.sin(y / 17) * 10 + (rr() - 0.5) * 14, y]);
		let d = `M ${lado < 0 ? -20 : W + 20} -20 L ${f(pts[0][0])} ${pts[0][1]}`;
		for (let i = 1; i < pts.length - 1; i++) d += ` Q ${f(pts[i][0])} ${pts[i][1]} ${f((pts[i][0] + pts[i + 1][0]) / 2)} ${(pts[i][1] + pts[i + 1][1]) / 2}`;
		return { d: d + ` L ${lado < 0 ? -20 : W + 20} ${H + 20} Z`, pts };
	};
	// Ilha de contorno suave: pontos sorteados em volta do centro, ligados por curvas que passam pelos pontos médios.
	const ilha = ([x, y, rx, ry], sem) => {
		const rr = sorteio(sem), n = 14, pts = [];
		for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2, j = 0.82 + rr() * 0.3; pts.push([x + Math.cos(a) * rx * j, y + Math.sin(a) * ry * j]); }
		const meio = (i) => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2];
		let d = `M ${f(meio(0)[0])} ${f(meio(0)[1])}`;
		for (let k = 1; k <= n; k++) d += ` Q ${f(pts[k % n][0])} ${f(pts[k % n][1])} ${f(meio(k)[0])} ${f(meio(k)[1])}`;
		return d + ' Z';
	};
	const esq = costa(380, -1, 61), dir = costa(1420, 1, 67);
	const terras = [esq.d, dir.d, ...MAPA_ILHAS.map((i, k) => ilha(i, 71 + k))];
	// Linhas de rumo dos portulanos: raios finos saindo de dois pontos do canal.
	for (const [ox, oy] of [[700, 250], [1150, 280]]) for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; g += `<line x1="${ox}" y1="${oy}" x2="${f(ox + Math.cos(a) * 1400)}" y2="${f(oy + Math.sin(a) * 1400)}" stroke="${p.tinta}" stroke-width=".6" opacity=".12"/>`; }
	// Sombreado da costa: linhas paralelas no mar, como nas cartas antigas.
	for (const d of terras) for (const [w, op] of [[22, 0.1], [12, 0.16], [5, 0.24]]) g += `<path d="${d}" fill="none" stroke="${p.mar}" stroke-width="${w}" opacity="${op}"/>`;
	for (const d of terras) g += `<path d="${d}" fill="${p.terra}" stroke="${p.tinta}" stroke-width="2"/>`;
	// Montanhas de carta antiga: pico com crista, o lado da sombra em hachura; cordilheiras desenhadas de trás para a frente.
	const montanha = (x, y, s) => {
		const h = 46 * s, l = 30 * s, px = x + (r() - 0.5) * 6 * s;
		let m = `<path d="M ${f(x - l)} ${y} L ${f(px - 3 * s)} ${f(y - h + 6 * s)} L ${f(px)} ${f(y - h)} L ${f(px + 4 * s)} ${f(y - h + 8 * s)} L ${f(x + l)} ${y} Z" fill="${p.terra}" stroke="none"/>`;
		for (let k = 1; k <= 7; k++) { const tt = k / 8, xx = px + (x + l - px) * tt; m += `<line x1="${f(px + (xx - px) * 0.25)}" y1="${f(y - h + (h * tt) * 0.35 + 4 * s)}" x2="${f(xx - 2)}" y2="${f(y - 1)}" stroke="${p.tinta}" stroke-width=".8" opacity=".55"/>`; }
		m += `<path d="M ${f(x - l)} ${y} L ${f(px - 3 * s)} ${f(y - h + 6 * s)} L ${f(px)} ${f(y - h)} L ${f(px + 4 * s)} ${f(y - h + 8 * s)} L ${f(x + l)} ${y}" fill="none" stroke="${p.tinta}" stroke-width="1.5" stroke-linejoin="round"/>`;
		m += `<path d="M ${f(px)} ${f(y - h)} Q ${f(px - 2 * s)} ${f(y - h * 0.5)} ${f(px + 6 * s)} ${f(y - 4)}" fill="none" stroke="${p.tinta}" stroke-width=".9" opacity=".7"/>`;
		return m;
	};
	const cordilheira = (lista) => lista.sort((m1, m2) => m1[1] - m2[1]).map(([x, y, s]) => montanha(x, y, s)).join('');
	g += cordilheira([[90, 120, 1], [140, 104, 1.35], [196, 126, 1.05], [250, 112, 0.85], [118, 160, 0.9], [176, 172, 1.1], [236, 158, 0.75], [300, 140, 0.7]]);
	g += cordilheira([[1530, 116, 0.9], [1590, 98, 1.3], [1650, 120, 1.1], [1710, 104, 0.95], [1560, 156, 1], [1630, 166, 0.85], [1700, 150, 0.8]]);
	// Florestas: árvores de copa com o lado da sombra marcado, e alguns pinheiros, em grupos densos.
	const floresta = (cx, cy, n, sem, lx = 130, ly = 60) => {
		const rr = sorteio(sem), arv = [];
		for (let i = 0; i < n; i++) arv.push([cx + (rr() - 0.5) * lx, cy + (rr() - 0.5) * ly, rr()]);
		return arv.sort((a1, a2) => a1[1] - a2[1]).map(([x, y, q]) => {
			if (q < 0.3) return `<path d="M ${f(x)} ${f(y - 18)} L ${f(x + 7)} ${f(y)} L ${f(x - 7)} ${f(y)} Z" fill="${p.floresta}" stroke="${p.tinta}" stroke-width="1"/><line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y + 4)}" stroke="${p.tinta}" stroke-width="1"/>`;
			const rr2 = 6 + q * 3;
			return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y + 5)}" stroke="${p.tinta}" stroke-width="1.2"/><circle cx="${f(x)}" cy="${f(y - rr2 + 1)}" r="${f(rr2)}" fill="${p.floresta}" stroke="${p.tinta}" stroke-width="1"/><path d="M ${f(x + rr2 * 0.2)} ${f(y - rr2 * 1.8)} A ${f(rr2)} ${f(rr2)} 0 0 1 ${f(x + rr2 * 0.2)} ${f(y + 0.8)}" fill="none" stroke="${p.tinta}" stroke-width="2.2" opacity=".35"/>`;
		}).join('');
	};
	g += floresta(150, 330, 30, 81) + floresta(250, 440, 16, 82) + floresta(1620, 330, 28, 83) + floresta(1690, 430, 14, 84) + floresta(1050, 168, 4, 85, 50, 16);
	// Rio descendo dos morros até a costa da esquerda, e uma vila na foz.
	g += `<path d="M 175 150 C 200 210, 260 220, 300 260 S 360 290, ${f(esq.pts[20][0])} 300" fill="none" stroke="${p.mar}" stroke-width="2.6" opacity=".8"/>`;
	for (const [x, y] of [[330, 290], [346, 280], [338, 302]]) g += `<rect x="${x}" y="${y}" width="9" height="7" fill="${p.fundo[0]}" stroke="${p.tinta}" stroke-width="1"/><path d="M ${x - 1} ${y} L ${x + 4.5} ${y - 6} L ${x + 10} ${y}" fill="${p.tinta}"/>`;
	// Rota pontilhada com escalas nas ilhas, até o X.
	let d = `M ${MAPA_ROTA[0].join(' ')}`;
	for (let i = 1; i < MAPA_ROTA.length; i++) { const [x0, y0] = MAPA_ROTA[i - 1], [x1, y1] = MAPA_ROTA[i]; d += ` C ${f(x0 + (x1 - x0) * 0.5)} ${y0}, ${f(x0 + (x1 - x0) * 0.5)} ${y1}, ${x1} ${y1}`; }
	g += `<path d="${d}" fill="none" stroke="${p.rota}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>`;
	for (const [x, y] of MAPA_ROTA.slice(1, -1)) g += `<circle cx="${x}" cy="${y}" r="6" fill="${p.fundo[0]}" stroke="${p.rota}" stroke-width="2.4"/>`;
	g += `<circle cx="${MAPA_ROTA[0][0]}" cy="${MAPA_ROTA[0][1]}" r="7" fill="${p.rota}"/>`;
	const [xx, yx] = MAPA_ROTA.at(-1);
	g += `<g stroke="${p.rota}" stroke-width="5" stroke-linecap="round"><line x1="${xx - 12}" y1="${yx - 12}" x2="${xx + 12}" y2="${yx + 12}"/><line x1="${xx + 12}" y1="${yx - 12}" x2="${xx - 12}" y2="${yx + 12}"/></g>`;
	// Borda de mapa com graus.
	g += `<rect x="12" y="12" width="${W - 24}" height="${H - 24}" fill="none" stroke="${p.tinta}" stroke-width="2"/><rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="${p.tinta}" stroke-width=".8"/>`;
	for (let x = 22; x < W - 22; x += 60) g += `<rect x="${x}" y="12" width="30" height="10" fill="${p.tinta}" opacity=".8"/><rect x="${x}" y="${H - 22}" width="30" height="10" fill="${p.tinta}" opacity=".8"/>`;
	// Véu claro atrás do nome.
	g += `<defs><radialGradient id="veu"><stop offset="0" stop-color="${p.fundo[0]}" stop-opacity=".8"/><stop offset="1" stop-color="${p.fundo[0]}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${W / 2}" cy="${H / 2}" rx="500" ry="140" fill="url(#veu)"/>`;
	r();
	return g;
}

// Camadas do Mapa (máscaras brancas, no mesmo quadro da capa): as ondas do canal, em dois grupos que balançam em
// sentidos opostos (o mar todo indo e vindo junto parecia um bloco deslizando), e o barco.
function mapaOndas(grupo) {
	// Ondulações longas e finas, em grupos de dois ou três traços paralelos, como nas cartas antigas.
	const r = sorteio(521);
	let g = '';
	for (let i = 0; i < 22; i++) {
		const x = 450 + r() * 860, y = 50 + r() * 420, n = 2 + Math.floor(r() * 2), l = 40 + r() * 40;
		if (MAPA_ILHAS.some(([ix, iy, rx, ry]) => Math.hypot((x + l / 2 - ix) / (rx + 50), (y - iy) / (ry + 30)) < 1)) continue;
		for (let k = 0; k < n; k++) { const yy = y + k * 6, xx = x + k * 7, ll = l - k * 12, op = f(0.45 + r() * 0.4); if (i % 2 === grupo) g += `<path d="M ${f(xx)} ${f(yy)} q ${f(ll / 4)} -3 ${f(ll / 2)} 0 t ${f(ll / 2)} 0" stroke-width="1.1" stroke-linecap="round" opacity="${op}"/>`; }
	}
	return g;
}
// Uma caravela pequena, em tinta: casco com o castelo de popa, dois mastros com as velas cheias de vento, bandeirola e
// gurupés. A proa aponta para a direita; o CSS a vira na volta. O casco assenta na linha d'água em y = 452.
function mapaBarco() {
	const vela = (x0, x1, topo, base) => { const m = (x0 + x1) / 2, bojo = (x1 - x0) * 0.22; return `<path d="M ${x0} ${topo} Q ${m} ${topo + 5} ${x1} ${topo} Q ${f(x1 + bojo)} ${f((topo + base) / 2)} ${x1} ${base} Q ${m} ${base + 4} ${x0} ${base} Q ${f(x0 + bojo * 0.6)} ${f((topo + base) / 2)} ${x0} ${topo} Z" fill="#fff" fill-opacity=".22" stroke-width="1.6"/>`; };
	return '<g transform="translate(900 452) scale(1.15)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">' +
		'<path d="M -44 -9 L -40 6 Q -8 15 28 8 Q 40 4 48 -7 Q 6 -2 -44 -9 Z" fill="#fff"/><path d="M -44 -9 L -44 -18 L -27 -16 L -27 -6" fill="#fff"/>' +
		'<path d="M -36 1 H 30" stroke-width="1" opacity=".5"/>' +
		'<line x1="-4" y1="-4" x2="-4" y2="-66"/><line x1="24" y1="-3" x2="24" y2="-50"/><line x1="46" y1="-6" x2="64" y2="-16"/>' +
		vela(-22, 12, -60, -18) + vela(12, 36, -46, -16) + '<path d="M 46 -8 L 62 -14 L 50 -26 Z" fill="#fff" fill-opacity=".22" stroke-width="1.3"/>' +
		'<path d="M -4 -66 L 12 -62 L -4 -58 Z" fill="#fff"/>' +
		'<path d="M -58 12 q 8 -5 16 0 t 16 0 M 40 12 q 8 -5 16 0" stroke-width="1.4" opacity=".7"/></g>';
}

// Abissal: o fundo do mar em camadas de profundidade. Raios de luz em leque descendo da superfície, neve marinha, um
// recife distante enevoado, corais ramificados e gorgônias rendadas no meio, e rochas escuras na frente, nos cantos.
// As algas e as três águas-vivas são camadas à parte (abissalAlgas e abissalMedusa), que balançam e flutuam por cima.
// Coral ramificado: cada galho se divide em dois ou três, afinando, como uma árvore.
function coralRamificado(r, x, y, ang, comp, larg, nivel, abertura, afina = 0.7, encurta = 0.75) {
	// Os galhos tendem a voltar para cima, como os corais crescem em direção à luz.
	const a = ang + (-Math.PI / 2 - ang) * 0.18;
	const x2 = x + Math.cos(a) * comp, y2 = y + Math.sin(a) * comp;
	let s = `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="${f(larg)}"/>`;
	if (nivel === 0) return s;
	const filhos = r() < 0.35 ? 3 : 2;
	for (let i = 0; i < filhos; i++) {
		const desvio = (i - (filhos - 1) / 2) * abertura * (0.7 + r() * 0.6);
		s += coralRamificado(r, x2, y2, a + desvio, comp * (encurta - 0.07 + r() * 0.14), larg * afina, nivel - 1, abertura, afina, encurta);
	}
	return s;
}
// Gorgônia: um leque de galhos finos saindo da mesma base.
function gorgonia(r, x, y, s, cor) {
	let g = `<g stroke="${cor}" stroke-linecap="round" fill="none">`;
	for (let k = -3; k <= 3; k++) g += coralRamificado(r, x, y, -Math.PI / 2 + k * 0.3, 26 * s, 3 * s, 5, 0.26, 0.72, 0.82);
	return g + '</g>';
}
function abissal(p) {
	const r = sorteio(601);
	const longe = mistura(p.fundo[1], p.luz, 0.14), meio = mistura(p.fundo[2], p.coral, 0.55), meio2 = mistura(p.fundo[2], mistura(p.coral, p.medusa, 0.45), 0.42), perto = mistura(p.fundo[2], p.fundo[1], 0.25);
	let g = `<defs><linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".5" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></linearGradient>
	<linearGradient id="raio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.luz}" stop-opacity=".16"/><stop offset=".7" stop-color="${p.luz}" stop-opacity=".04"/><stop offset="1" stop-color="${p.luz}" stop-opacity="0"/></linearGradient>
	<radialGradient id="superficie" cx="62%" cy="-10%" r="70%"><stop offset="0" stop-color="${p.luz}" stop-opacity=".28"/><stop offset="1" stop-color="${p.luz}" stop-opacity="0"/></radialGradient>
	<linearGradient id="nevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.fundo[1]}" stop-opacity="0"/><stop offset="1" stop-color="${p.fundo[1]}" stop-opacity=".55"/></linearGradient>
	<radialGradient id="veu"><stop offset="0" stop-color="${p.fundo[1]}" stop-opacity=".55"/><stop offset="1" stop-color="${p.fundo[1]}" stop-opacity="0"/></radialGradient>
	<filter id="difuso" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7"/></filter></defs>
	<rect width="${W}" height="${H}" fill="url(#agua)"/><rect width="${W}" height="${H}" fill="url(#superficie)"/><g filter="url(#difuso)">`;
	// Raios de luz em leque, todos saindo do mesmo ponto acima da superfície.
	const [ox, oy] = [1120, -420];
	for (let i = 0; i < 11; i++) {
		const a = (-0.62 + i * 0.12 + (r() - 0.5) * 0.05) + Math.PI / 2, w = 0.012 + r() * 0.03, L = 1400;
		const p1 = [ox + Math.cos(a - w) * L, oy + Math.sin(a - w) * L], p2 = [ox + Math.cos(a + w) * L, oy + Math.sin(a + w) * L];
		g += `<path d="M ${ox} ${oy} L ${f(p1[0])} ${f(p1[1])} L ${f(p2[0])} ${f(p2[1])} Z" fill="url(#raio)" opacity="${f(0.5 + r() * 0.5)}"/>`;
	}
	g += '</g>';
	// Neve marinha: partículas finas suspensas.
	for (let i = 0; i < 220; i++) { const x = r() * W, y = r() * H; g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.5 + r() * 1.1)}" fill="${p.luz}" opacity="${f(0.08 + r() * 0.25)}"/>`; }
	// Recife distante: uma crista irregular com corais pequenos, apagada pela distância.
	const alturaCrista = (x) => H - 70 - 34 * Math.sin(x / 130) - 18 * Math.sin(x / 47 + 1) + Math.exp(-(((x - 900) / 330) ** 2)) * 46;
	let crista = `M -10 ${H} L -10 ${f(alturaCrista(-10))}`;
	for (let x = 50; x <= W + 70; x += 60) crista += ` Q ${x - 30} ${f(alturaCrista(x - 30) - 8)} ${x} ${f(alturaCrista(x))}`;
	g += `<path d="${crista} L ${W + 70} ${H} Z" fill="${longe}" opacity=".7"/>`;
	g += `<g stroke="${longe}" stroke-linecap="round" fill="none" opacity=".7">`;
	for (let i = 0; i < 26; i++) { const x = r() * W; if (Math.abs(x - 900) < 300) continue; g += coralRamificado(r, x, H - 70 - r() * 30, -Math.PI / 2 + (r() - 0.5) * 0.4, 16 + r() * 14, 4, 3, 0.55); }
	g += `</g><rect y="${H - 200}" width="${W}" height="200" fill="url(#nevoa)"/>`;
	// Meio: corais ramificados e gorgônias rendadas, só nas laterais (o centro fica para o nome).
	const lugares = [[90, 1.15, 'galho'], [190, 1.4, 'leque'], [300, 0.9, 'galho'], [400, 1, 'leque'], [500, 0.7, 'galho'], [1300, 0.75, 'galho'], [1400, 1.1, 'leque'], [1500, 1.2, 'galho'], [1610, 1.45, 'leque'], [1720, 0.95, 'galho']];
	for (const [x, s, tipo] of lugares) {
		const base = H - 26 - r() * 10, cor = r() < 0.5 ? meio : meio2;
		if (tipo === 'galho') g += `<g stroke="${cor}" stroke-linecap="round" fill="none">${coralRamificado(r, x, base, -Math.PI / 2 + (r() - 0.5) * 0.3, 26 * s, 11 * s, 4, 0.7, 0.8, 0.8)}</g>`;
		else g += gorgonia(r, x, base, s, cor);
	}
	// Frente: rochas escuras nos cantos, com anêmonas em tufos finos.
	const rocha = (x0, x1, alt, sem) => {
		const rr = sorteio(sem);
		let topo = '';
		const passo = 40, pts = [];
		for (let x = x0; x <= x1; x += passo) { const t = (x - x0) / (x1 - x0); pts.push([x, H - alt * Math.sin(Math.PI * t) ** 0.5 - rr() * 16]); }
		topo = `M ${pts[0][0]} ${f(pts[0][1])}`;
		for (let i = 1; i < pts.length; i++) topo += ` Q ${f(pts[i - 1][0] + passo / 2)} ${f(Math.min(pts[i - 1][1], pts[i][1]) - 6)} ${pts[i][0]} ${f(pts[i][1])}`;
		return `<path d="M ${x0} ${H + 10} L ${topo.slice(2)} L ${x1} ${H + 10} Z" fill="${perto}"/><path d="${topo}" fill="none" stroke="${mistura(perto, p.luz, 0.25)}" stroke-width="2" opacity=".6"/>`;
	};
	g += rocha(-40, 340, 74, 621) + rocha(1470, 1840, 86, 622);
	for (const [x, y] of [[120, H - 66], [250, H - 58], [1560, H - 76], [1690, H - 70]]) {
		g += `<g stroke="${mistura(p.coral, p.luz, 0.25)}" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".75">`;
		for (let k = 0; k < 9; k++) { const a = -Math.PI / 2 + (k - 4) * 0.2, l = 14 + r() * 8; g += `<path d="M ${x} ${y} q ${f(Math.cos(a) * l * 0.5 + 4)} ${f(Math.sin(a) * l * 0.5)} ${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}"/>`; }
		g += '</g>';
	}
	// Véu atrás do nome.
	g += `<ellipse cx="${W / 2}" cy="${H / 2}" rx="520" ry="150" fill="url(#veu)"/>`;
	return g;
}
// Algas: talos com lâminas pontudas alternadas, saindo das rochas dos cantos, em duas camadas (esquerda e direita) que
// balançam cada uma em volta do próprio pé. Desfocadas de leve no próprio SVG: talo fino balançando cintilava no
// serrilhado dos pixels.
function abissalAlgas(lado) {
	const r = sorteio(611);
	const alga = (x, alt, fase) => {
		let d = `M ${x} ${H + 10}`, folhas = '';
		const pts = [];
		for (let y = H + 10, k = 0; y > H - alt; y -= 18, k++) { const xx = x + Math.sin(k * 0.5 + fase) * 14; pts.push([xx, y]); d += ` L ${f(xx)} ${y}`; }
		pts.forEach(([px, py], k) => {
			if (k < 2 || k % 2) return;
			const lado = (k / 2) % 2 ? 1 : -1, l = 26 + r() * 22, larg = 5 + r() * 4, ang = lado * (0.5 + r() * 0.4) - Math.PI / 2;
			const tx = px + Math.cos(ang) * l, ty = py + Math.sin(ang) * l, nx = -Math.sin(ang) * larg, ny = Math.cos(ang) * larg;
			const mx = (px + tx) / 2, my = (py + ty) / 2;
			folhas += `<path d="M ${f(px)} ${f(py)} Q ${f(mx + nx)} ${f(my + ny)} ${f(tx)} ${f(ty)} Q ${f(mx - nx)} ${f(my - ny)} ${f(px)} ${f(py)} Z" fill="#fff" stroke="none" opacity="${f(0.6 + r() * 0.35)}"/>`;
		});
		return `<path d="${d}" stroke-width="2.8" stroke-linecap="round" opacity=".85"/>${folhas}`;
	};
	let esq = '', dir = '';
	for (let i = 0; i < 7; i++) esq += alga(f(20 + r() * 300), 150 + r() * 230, r() * 6);
	for (let i = 0; i < 7; i++) dir += alga(f(1500 + r() * 290), 150 + r() * 230, r() * 6);
	return `<defs><filter id="d" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".6"/></filter></defs><g filter="url(#d)">${lado ? dir : esq}</g>`;
}
// Três águas-vivas: sino translúcido (mais denso na borda), franja, braços orais ondulados e tentáculos que somem. Os
// tentáculos são macios (desfocados no SVG) e nascem transparentes: fio de cabelo subindo e descendo devagar cintilava.
const MEDUSAS = [[250, 140, 1, 5, 150], [1570, 110, 1.25, 7, 200], [1440, 300, 0.7, 5, 110]];
function abissalMedusa(k) {
	const [x, y, s, nt, ct] = MEDUSAS[k];
	const r = sorteio(640 + k);
	let g = `<defs><radialGradient id="sino" cx="50%" cy="85%" r="85%"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".7" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity=".8"/></radialGradient>
	<linearGradient id="fio" x1="0" y1="0" x2="0" y2="${ct}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".08" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
	<radialGradient id="h"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
	<filter id="m" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation=".8"/></filter></defs>`;
	g += `<circle cx="${x}" cy="${y - 10 * s}" r="${70 * s}" fill="url(#h)" stroke="none"/><g transform="translate(${x} ${y}) scale(${s})"><g filter="url(#m)">`;
	// Tentáculos compridos, ondulando.
	for (let i = 0; i < nt; i++) { const tx = -27 + (54 * i) / (nt - 1), fase = r() * 8 - 4; g += `<path d="M ${f(tx)} 0 q ${f(fase)} ${ct / 4} 0 ${ct / 2} t 0 ${ct / 2}" fill="none" stroke="url(#fio)" stroke-width="1.8"/>`; }
	// Braços orais: fitas onduladas mais grossas no meio.
	for (const bx of [-7, 7]) g += `<path d="M ${bx} 0 q ${bx * 1.6} 16 0 32 t 0 32 t ${bx * 0.6} 20" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".28"/>`;
	g += '</g>';
	// O sino, com a franja da borda e as quatro gônadas.
	g += `<path d="M -32 0 C -34 -30 -20 -44 0 -44 C 20 -44 34 -30 32 0 Q 24 5 16 1 Q 8 6 0 1 Q -8 6 -16 1 Q -24 5 -32 0 Z" fill="url(#sino)" stroke="none"/>`;
	g += `<g filter="url(#m)" opacity=".55">${[[-10, -15], [10, -15], [0, -19], [0, -11]].map(([dx, dy]) => `<ellipse cx="${dx}" cy="${dy}" rx="6" ry="3.2" stroke-width="2"/>`).join('')}</g>`;
	g += '</g>';
	return g;
}

// Forja Rúnica: pedra escura, faixas de runas em cima e embaixo e fagulhas. As runas aparecem apagadas; as acesas são
// uma camada à parte (forjaRunasAcesas), por onde passa a onda de calor. As fagulhas paradas são poucas: as que sobem
// (camadas do CSS) fazem o movimento, e fagulha parada demais parecia poeira.
const RUNAS = ['M6 0V34M6 6L18 0M6 14L18 8', 'M4 34V0L16 10V34', 'M6 0V34M6 10L16 17L6 24', 'M6 0V34M6 6L16 12M6 14L16 20', 'M6 34V0L16 8L6 16L16 34', 'M16 4L6 17L16 30', 'M2 2L18 32M18 2L2 32', 'M6 34V0L16 8L6 16', 'M4 0V34M16 0V34M4 12L16 22', 'M10 0V34M4 12L16 22', 'M10 0V34', 'M8 4L2 12L8 20M12 14L18 22L12 30', 'M10 0V34M10 0L16 6M10 34L4 28', 'M10 0V34M10 12L2 2M10 12L18 2', 'M14 0L4 12L16 22L6 34', 'M10 0V34M10 0L2 10M10 0L18 10', 'M5 0V34M5 0L15 8L5 17L15 26L5 34', 'M3 34V0L10 10L17 0V34', 'M3 34V0L17 14M17 34V0L3 14', 'M6 0V34M6 0L16 10', 'M10 0L18 10L10 20L2 10Z', 'M2 0V34L18 0V34L2 0'];
// As posições e os glifos das runas das faixas, sorteados uma vez só, para a base e as camadas acesas coincidirem.
const FORJA_RUNAS = (() => {
	const r = sorteio(4011), lista = [];
	for (const y of [26, H - 86]) for (let x = 30, k = 0; x < W - 20; x += 44, k++) if (k % 9 !== 8) lista.push([x, y + 13, RUNAS[Math.floor(r() * RUNAS.length)]]);
	return lista;
})();
function forja(p) {
	const r = sorteio(401);
	let g = `<defs><radialGradient id="pedra" cx="50%" cy="40%" r="80%"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".7" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></radialGradient>
	<radialGradient id="brasa" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="${p.brasa}" stop-opacity=".55"/><stop offset=".5" stop-color="${p.brasa}" stop-opacity=".12"/><stop offset="1" stop-color="${p.brasa}" stop-opacity="0"/></radialGradient></defs>
	<rect width="${W}" height="${H}" fill="url(#pedra)"/><rect width="${W}" height="${H}" fill="url(#brasa)"/>`;
	g += `<g stroke="${p.junta}" stroke-width="2" fill="none" opacity=".6">`;
	for (let y = 120; y < 420; y += 75) { g += `<line x1="0" y1="${y}" x2="${W}" y2="${y + (r() - 0.5) * 6}"/>`; for (let x = (y / 75) % 2 ? 0 : 110; x < W; x += 220) g += `<line x1="${f(x + r() * 20)}" y1="${y}" x2="${f(x + r() * 20)}" y2="${y + 75}"/>`; }
	g += '</g>';
	for (const y of [26, H - 86]) {
		g += `<rect x="-4" y="${y}" width="${W + 8}" height="60" fill="${p.fundo[2]}" stroke="${p.linha}" stroke-width="2"/><line x1="0" y1="${y + 6}" x2="${W}" y2="${y + 6}" stroke="${p.linha}" stroke-width="1" opacity=".6"/><line x1="0" y1="${y + 54}" x2="${W}" y2="${y + 54}" stroke="${p.linha}" stroke-width="1" opacity=".6"/>`;
		for (let x = 30, k = 0; x < W - 20; x += 44, k++) if (k % 9 === 8) g += `<circle cx="${x + 10}" cy="${y + 30}" r="4" fill="${p.linha}"/>`;
	}
	// Runas apagadas, como entalhes na pedra.
	g += `<g fill="none" stroke="${p.brasa}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".28">${FORJA_RUNAS.map(([x, y, d]) => `<path transform="translate(${x} ${y})" d="${d}"/>`).join('')}</g>`;
	for (let i = 0; i < 55; i++) {
		const x = r() * W, y = 100 + Math.pow(r(), 0.6) * (H - 190);
		if (x > 520 && x < 1280 && y > 150 && y < 370) continue;
		g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1 + r() * 2.6)}" fill="${r() < 0.3 ? p.brilho : p.brasa}" opacity="${f(0.35 + r() * 0.6)}"/>`;
	}
	return g;
}
// As runas acesas, todas numa camada só, com o brilho em volta já desenhado (desfoque dentro do SVG, rasterizado uma vez:
// o drop-shadow do CSS seria recalculado a cada quadro). No CSS, uma onda de calor corre por elas da esquerda para a
// direita, e só onde ela passa as runas acendem.
function forjaRunasAcesas() {
	const runas = FORJA_RUNAS.map(([x, y, d]) => `<path transform="translate(${x} ${y})" d="${d}"/>`).join('');
	return `<defs><filter id="b" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="4"/></filter></defs><g stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".7" filter="url(#b)">${runas}</g><g stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${runas}</g>`;
}

// Esfera armilar grande, deslocada para a direita. A esfera não está no desenho: ela é montada por cima, na capa, com
// as peças armilar-* de tools/gerar-decoracoes.mjs (animacoes.css), para cada anel balançar no seu ritmo.
const ESFERA = { cx: 1390, cy: 262 };
function armilar(p) {
	const { cx } = ESFERA;
	let g = fundo(p, 'f');
	g += `<defs><radialGradient id="halo" cx="${f(cx / W * 100)}%" cy="50%" r="30%"><stop offset="0" stop-color="${p.brilho}" stop-opacity=".22"/><stop offset="1" stop-color="${p.brilho}" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#halo)"/>`;
	g += estrelas(p, 380, 41);
	[[80, 80, 2, 1], [260, 360, 0, 0.9], [760, 410, 3, 0.8]].forEach(([x, y, i, e], k) => (g += constelacao(p, FIGURAS[i], x, y, e, 51 + k)));
	return g;
}

// Constelação: um rio de estrelas (o "Star Stream") cruza o céu em curva, com o brilho dourado no meio, constelações
// nos cantos e algumas estrelas fortes com raios finos, como numa foto de telescópio. O centro fica limpo para o nome.
const curvaDoRio = (t) => [-120 + 2040 * t, 300 - 185 * Math.sin(Math.PI * (t - 0.5)) + 42 * Math.sin(4 * Math.PI * t)];
const caminhoDoRio = (() => {
	let d = '';
	for (let t = 0; t <= 1.0001; t += 0.02) { const [x, y] = curvaDoRio(t); d += `${d ? ' L' : 'M'} ${f(x)} ${f(y)}`; }
	return d;
})();
function rio(p) {
	const r = sorteio(701);
	const curva = curvaDoRio, d = caminhoDoRio;
	let g = `<defs><radialGradient id="ceu" cx="50%" cy="50%" r="75%"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".6" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></radialGradient>
	<radialGradient id="neb1"><stop offset="0" stop-color="${p.violeta}" stop-opacity=".38"/><stop offset="1" stop-color="${p.violeta}" stop-opacity="0"/></radialGradient>
	<radialGradient id="neb2"><stop offset="0" stop-color="${p.azul}" stop-opacity=".4"/><stop offset="1" stop-color="${p.azul}" stop-opacity="0"/></radialGradient>
	<radialGradient id="neb3"><stop offset="0" stop-color="${p.acento}" stop-opacity=".22"/><stop offset="1" stop-color="${p.acento}" stop-opacity="0"/></radialGradient>
	<radialGradient id="faisca"><stop offset="0" stop-color="${p.marfim}" stop-opacity=".9"/><stop offset=".35" stop-color="${p.acento}" stop-opacity=".35"/><stop offset="1" stop-color="${p.acento}" stop-opacity="0"/></radialGradient>
	<radialGradient id="veu"><stop offset="0" stop-color="${p.fundo[2]}" stop-opacity=".42"/><stop offset="1" stop-color="${p.fundo[2]}" stop-opacity="0"/></radialGradient>
	<linearGradient id="fluxo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p.violeta}"/><stop offset=".5" stop-color="${p.acento}"/><stop offset="1" stop-color="${p.marfim}"/></linearGradient>
	<filter id="nevoa" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="26"/></filter>
	<filter id="nevoa2" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
	<rect width="${W}" height="${H}" fill="url(#ceu)"/>
	<ellipse cx="420" cy="400" rx="620" ry="260" fill="url(#neb1)"/><ellipse cx="1380" cy="120" rx="640" ry="250" fill="url(#neb2)"/><ellipse cx="900" cy="290" rx="700" ry="200" fill="url(#neb3)"/>`;
	g += estrelas({ estrela: p.marfim }, 620, 703);
	// O brilho difuso do rio.
	g += `<path d="${d}" fill="none" stroke="url(#fluxo)" stroke-width="170" opacity=".26" filter="url(#nevoa)"/><path d="${d}" fill="none" stroke="url(#fluxo)" stroke-width="54" opacity=".32" filter="url(#nevoa2)"/>`;
	// O pó fino do rio, que fica parado: mais denso no meio da faixa, da cor violeta no começo ao ouro e ao marfim no fim.
	// É só textura, miúdo e apagado. As estrelas que se veem uma a uma correm por cima, nas camadas da correnteza
	// (rioCorrente), na direção da luz: se elas ficassem gravadas aqui, o rio pareceria parado com a luz passando.
	const cor = (t) => (t < 0.5 ? mistura(p.violeta, p.acento, t * 2) : mistura(p.acento, p.marfim, (t - 0.5) * 2));
	for (let i = 0; i < 2000; i++) {
		const t = r(), [x, y] = curva(t);
		const gauss = (r() + r() + r() - 1.5) / 1.5, larg = 70 * (0.55 + 0.45 * Math.abs(Math.sin(Math.PI * t)));
		const yy = y + gauss * larg, xx = x + (r() - 0.5) * 24;
		const raio = 0.4 + Math.pow(r(), 3) * 1;
		g += `<circle cx="${f(xx)}" cy="${f(yy)}" r="${f(raio)}" fill="${cor(t)}" opacity="${f(0.2 + r() * 0.45)}"/>`;
	}
	// Constelações nos cantos.
	[[70, 50, 0, 1.15], [1500, 360, 1, 1.1], [1180, 40, 2, 0.95], [150, 380, 3, 0.9]].forEach(([x, y, i, e], k) => (g += constelacao({ linha: p.acento }, FIGURAS[i], x, y, e, 711 + k)));
	// Estrelas fortes: núcleo redondo, halo e dois raios finos que somem nas pontas, como numa foto de telescópio.
	g += `<defs><linearGradient id="raioH"><stop offset="0" stop-color="${p.marfim}" stop-opacity="0"/><stop offset=".5" stop-color="${p.marfim}" stop-opacity=".75"/><stop offset="1" stop-color="${p.marfim}" stop-opacity="0"/></linearGradient><linearGradient id="raioV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.marfim}" stop-opacity="0"/><stop offset=".5" stop-color="${p.marfim}" stop-opacity=".75"/><stop offset="1" stop-color="${p.marfim}" stop-opacity="0"/></linearGradient></defs>`;
	const forte = (x, y, s) => `<circle cx="${x}" cy="${y}" r="${f(s * 2.2)}" fill="url(#faisca)"/><rect x="${f(x - s * 3)}" y="${f(y - 0.5)}" width="${f(s * 6)}" height="1" fill="url(#raioH)"/><rect x="${f(x - 0.5)}" y="${f(y - s * 2.2)}" width="1" height="${f(s * 4.4)}" fill="url(#raioV)"/><circle cx="${x}" cy="${y}" r="${f(1.2 + s * 0.12)}" fill="${p.marfim}"/>`;
	for (const [x, y, s] of [[300, 120, 14], [520, 440, 9], [1320, 420, 11], [1620, 90, 16], [1050, 70, 8], [80, 260, 9], [1740, 300, 10]]) g += forte(x, y, s);
	// Véu escuro atrás do nome.
	g += `<ellipse cx="${W / 2}" cy="${H / 2}" rx="560" ry="160" fill="url(#veu)"/>`;
	return g;
}

const SAIDAS = [
	['planisferio', 'classico-escuro'], ['planisferio', 'classico-claro'],
	['armilar', 'astrolabio-escuro'], ['armilar', 'astrolabio-claro'],
	['hud', 'holograma-escuro'], ['hud', 'holograma-claro'],
	['radar', 'radar-escuro'], ['radar', 'radar-claro'],
	['circuito', 'circuito-escuro'], ['circuito', 'circuito-claro'],
	['navegacao', 'navegacao-escuro'], ['navegacao', 'navegacao-claro'],
	['bosque', 'bosque'], ['vitral', 'vitral'], ['forja', 'forja'], ['mapa', 'mapa'], ['abissal', 'abissal'],
	['rio', 'constelacao'],
];
// As paletas de cor do sci-fi: uma capa por paleta e por modo.
const ARTE_SCIFI = { holograma: 'hud', radar: 'radar', circuito: 'circuito', navegacao: 'navegacao' };
for (const [tema, arte] of Object.entries(ARTE_SCIFI)) {
	for (const cor of CORES[tema].slice(1)) {
		for (const modo of ['escuro', 'claro']) {
			PALETAS[`${tema}-${cor}-${modo}`] = capaScifi(tema, cor, modo);
			SAIDAS.push([arte, `${tema}-${cor}-${modo}`]);
		}
	}
}
// As paletas da fantasia: uma capa por paleta (o tema é o mesmo no claro e no escuro). O Grimório monta a capa em CSS.
for (const tema of ['bosque', 'vitral', 'forja', 'mapa', 'abissal']) {
	for (const cor of CORES[tema].slice(1)) {
		PALETAS[`${tema}-${cor}`] = arteFantasia(tema, cor);
		SAIDAS.push([tema, `${tema}-${cor}`]);
	}
}
// As paletas Astra com capa desenhada: o Planisfério do Clássico e a esfera Armilar do Astrolábio.
for (const [tema, arte] of [['classico', 'planisferio'], ['astrolabio', 'armilar']]) {
	for (const cor of CORES[tema].slice(1)) {
		for (const modo of ['escuro', 'claro']) {
			PALETAS[`${tema}-${cor}-${modo}`] = capaAstra(tema, cor, modo);
			SAIDAS.push([arte, `${tema}-${cor}-${modo}`]);
		}
	}
}
// O rio de estrelas do Constelação: a capa é a mesma no claro e no escuro, nas cores escuras de cada paleta.
for (const cor of CORES.constelacao.slice(1)) {
	PALETAS[`constelacao-${cor}`] = capaAstra('constelacao', cor, 'escuro');
	SAIDAS.push(['rio', `constelacao-${cor}`]);
}
const ARTES = { planisferio, armilar, hud, radar, circuito, navegacao, bosque, vitral, forja, mapa, abissal, rio };
// Cada capa sai com o nome do tema e do modo: capa-<tema>-<modo>.svg.
for (const [nome, paleta] of SAIDAS) {
	const p = PALETAS[paleta];
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${ARTES[nome](p)}</svg>
`;
	fs.writeFileSync(`public/temas/capa-${paleta}.svg`, svg);
	console.log(nome, paleta, svg.length);
}

// O rio por onde a luz corre: a mesma faixa do brilho difuso, mais estreita.
function rioFluxo() {
	return `<defs><filter id="b" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="14"/></filter></defs><path d="${caminhoDoRio}" stroke-width="90" stroke-linecap="round" filter="url(#b)"/>`;
}
// O leito do rio: a faixa por onde as estrelas da correnteza aparecem, mais larga que a da luz e com a borda macia (a
// estrela some aos poucos quando sai da faixa). Atrás do nome ela fica bem fraca, para nada correr entre as letras.
function rioLeito() {
	return `<defs><filter id="b" x="-20%" y="-80%" width="140%" height="260%"><feGaussianBlur stdDeviation="22"/></filter><radialGradient id="nome"><stop offset="0" stop-color="#262626"/><stop offset=".6" stop-color="#4d4d4d"/><stop offset="1" stop-color="#fff"/></radialGradient><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><ellipse cx="${W / 2}" cy="${H / 2}" rx="470" ry="150" fill="url(#nome)"/></mask></defs><g mask="url(#m)"><path d="${caminhoDoRio}" stroke-width="118" stroke-linecap="round" filter="url(#b)"/></g>`;
}
// As estrelas da correnteza: três ladrilhos que emendam sem costura (a estrela que passa da borda volta do outro lado),
// do pó miúdo e denso às estrelas fortes com halo. A proporção de cada ladrilho é a inclinação do rio (cerca de 20 graus,
// a dos trechos à vista, que sobem para a direita): no CSS cada um anda exatamente um ladrilho para a direita e um para
// cima, em laço, então as estrelas correm ao longo da faixa, não através dela, e o laço não tem salto. Cada camada tem a
// sua velocidade (as maiores, mais perto, mais rápidas). As estrelas vão agrupadas pela opacidade, para o arquivo ficar
// enxuto.
const RIO_CORRENTE = [
	{ tw: 720, th: 262, n: 1130, semente: 741, raio: (r) => 0.45 + r() * 0.55, op: (r) => 0.4 + r() * 0.6 },
	{ tw: 900, th: 328, n: 384, semente: 743, raio: (r) => 0.8 + Math.pow(r(), 2) * 1, op: (r) => 0.6 + r() * 0.4 },
	{ tw: 1150, th: 419, n: 48, semente: 747, raio: (r) => 1.2 + r() * 0.9, op: () => 1, halo: true },
];
function rioCorrente({ tw, th, n, semente, raio, op, halo }) {
	const r = sorteio(semente), grupos = new Map();
	for (let i = 0; i < n; i++) {
		const x = r() * tw, y = r() * th, s = raio(r), o = Math.round(op(r) * 10) / 10;
		let e = '';
		for (const dx of [0, -tw, tw]) for (const dy of [0, -th, th]) {
			const cx = x + dx, cy = y + dy, borda = halo ? s * 4.5 + 1 : s + 1;
			if (cx < -borda || cx > tw + borda || cy < -borda || cy > th + borda) continue;
			e += (halo ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(s * 4.5)}" fill="url(#h)"/>` : '') + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(s)}"/>`;
		}
		grupos.set(o, (grupos.get(o) || '') + e);
	}
	const g = [...grupos].map(([o, e]) => (o < 1 ? `<g opacity="${o}">${e}</g>` : e)).join('');
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${th}" viewBox="0 0 ${tw} ${th}" fill="#fff"><defs><radialGradient id="h"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>${g}</svg>\n`;
}
// Os ladrilhos saem como imagem rasterizada (WebP sem perda, em resolução dobrada para telas densas), não como SVG: o
// Firefox redesenha o vetor a cada fração de pixel que a camada anda, perdia metade dos quadros e as estrelas andavam
// aos trancos; uma imagem pronta ele só desliza, com interpolação.
for (const [k, c] of RIO_CORRENTE.entries()) {
	await sharp(Buffer.from(rioCorrente(c)), { density: 144 }).resize(c.tw * 2, c.th * 2).webp({ lossless: true }).toFile(`public/temas/camada-constelacao-corrente-${k + 1}.webp`);
	fs.rmSync(`public/temas/camada-constelacao-corrente-${k + 1}.svg`, { force: true });
}

// Camadas que se mexem por cima das capas (máscaras brancas no mesmo quadro de 1800 x 520, recortadas como a capa):
// a cor vem do CSS de cada paleta.
const CAMADAS = {
	'constelacao-fluxo': rioFluxo(),
	'constelacao-leito': rioLeito(),
	'mapa-ondas-1': mapaOndas(0),
	'mapa-ondas-2': mapaOndas(1),
	'mapa-barco': mapaBarco(),
	'abissal-algas-1': abissalAlgas(0),
	'abissal-algas-2': abissalAlgas(1),
	...Object.fromEntries([0, 1, 2].map((k) => [`abissal-medusa-${k + 1}`, abissalMedusa(k)])),
	'forja-runas-acesas': forjaRunasAcesas(),
	...Object.fromEntries([0, 1, 2].map((k) => [`bosque-vagalumes-${k + 1}`, bosqueVagalumes(k)])),
	'vitral-luz-1': vitralLuz(0),
	'vitral-luz-2': vitralLuz(1),
	'vitral-halo-1': vitralHalo(0),
	'vitral-halo-2': vitralHalo(1),
	'vitral-poeira': vitralPoeira(),
	...Object.fromEntries(PULSOS.map((_, k) => [`circuito-pulso-${k + 1}`, circuitoPulso(k)])),
	'circuito-leds-1': circuitoLeds(0),
	'circuito-leds-2': circuitoLeds(1),
};
// As máscaras dos pulsos do Circuito saem como imagem pronta (WebP): têm o halo desfocado dentro do SVG, e o Firefox
// refazia esse desfoque a cada quadro em que a faixa de luz passa por trás delas, perdendo metade dos quadros.
const RASTER = (nome) => nome.startsWith('circuito-pulso-');
for (const [nome, corpo] of Object.entries(CAMADAS)) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#fff">${corpo}</svg>\n`;
	if (!RASTER(nome)) fs.writeFileSync(`public/temas/camada-${nome}.svg`, svg);
	else {
		await sharp(Buffer.from(svg), { density: 72 }).resize(W, H).webp({ quality: 80, alphaQuality: 70 }).toFile(`public/temas/camada-${nome}.webp`);
		fs.rmSync(`public/temas/camada-${nome}.svg`, { force: true });
	}
}

// Máscaras de partículas para as animações (brancas: a cor vem do CSS de cada tema e paleta). Cada uma é um ladrilho
// que se repete sem emenda, para a camada poder deslizar em loop só com transform.
const PARTICULAS = {
	poeira: { t: 320, n: 26, forma: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f(0.6 + r() * 1.5)}" opacity="${f(0.35 + r() * 0.65)}"/>` },
	brilhos: { t: 380, n: 10, forma: (x, y, r) => { const s = f(3 + r() * 5); return `<path d="M ${x} ${f(y - s)} Q ${f(x + s * 0.18)} ${f(y - s * 0.18)} ${f(x + s)} ${y} Q ${f(x + s * 0.18)} ${f(y + s * 0.18)} ${x} ${f(y + s)} Q ${f(x - s * 0.18)} ${f(y + s * 0.18)} ${f(x - s)} ${y} Q ${f(x - s * 0.18)} ${f(y - s * 0.18)} ${x} ${f(y - s)} Z" opacity="${f(0.5 + r() * 0.5)}"/>`; } },
	luzes: { t: 400, n: 10, forma: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f(6 + r() * 10)}" fill="url(#halo)"/>` },
};
for (const [nome, { t, n, forma }] of Object.entries(PARTICULAS)) {
	const r = sorteio(900 + t);
	let g = '';
	for (let i = 0; i < n; i++) {
		const x = f(8 + r() * (t - 16)), y = f(8 + r() * (t - 16));
		g += forma(x, y, r);
	}
	fs.writeFileSync(`public/temas/particulas-${nome}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}" fill="#fff"><defs><radialGradient id="halo"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>${g}</svg>\n`);
}

// Marcas d'água dos temas sci-fi novos, no canto da página, como o selo rúnico do Holograma.
const SELOS = {
	radar(p) {
		let g = '<g fill="none" stroke="' + p.linha + '">';
		for (const r of [70, 140, 210, 280]) g += `<circle cx="300" cy="300" r="${r}" stroke-width="2"/>`;
		g += '<line x1="10" y1="300" x2="590" y2="300" stroke-width="1.5"/><line x1="300" y1="10" x2="300" y2="590" stroke-width="1.5"/>';
		for (let a = 0; a < 360; a += 10) { const t = (a * Math.PI) / 180, l = a % 30 === 0 ? 22 : 10; g += `<line x1="${f(300 + Math.cos(t) * 280)}" y1="${f(300 + Math.sin(t) * 280)}" x2="${f(300 + Math.cos(t) * (280 + l))}" y2="${f(300 + Math.sin(t) * (280 + l))}" stroke-width="2"/>`; }
		return g + `<path d="M 300 300 L 580 300 A 280 280 0 0 0 ${f(300 + Math.cos(-0.7) * 280)} ${f(300 + Math.sin(-0.7) * 280)} Z" fill="${p.linha}" fill-opacity=".25" stroke="none"/></g>`;
	},
	circuito(p) {
		let g = `<g fill="none" stroke="${p.linha}" stroke-width="3"><rect x="200" y="200" width="200" height="200" rx="8"/><rect x="250" y="250" width="100" height="100" rx="4" stroke-width="2"/>`;
		for (let k = 0; k < 7; k++) {
			const c = 222 + k * 26;
			g += `<line x1="${c}" y1="200" x2="${c}" y2="170"/><line x1="${c}" y1="400" x2="${c}" y2="430"/><line x1="200" y1="${c}" x2="170" y2="${c}"/><line x1="400" y1="${c}" x2="430" y2="${c}"/>`;
			const d = 40 + k * 18;
			g += `<path d="M ${c} 170 L ${c} ${150 - d} "/><path d="M 430 ${c} L ${460 + d} ${c}"/><path d="M ${c} 430 L ${c + (k - 3) * 20} ${470 + d}"/><path d="M 170 ${c} L ${140 - d} ${c + (3 - k) * 14}"/>`;
		}
		return g + '</g>';
	},
	navegacao(p) {
		let g = `<g fill="none" stroke="${p.linha}" stroke-width="2.4"><circle cx="300" cy="300" r="200"/>`;
		for (let k = -3; k <= 3; k++) { const y = 300 + k * 50, rx = Math.sqrt(200 * 200 - (k * 50) ** 2); g += `<ellipse cx="300" cy="${y}" rx="${f(rx)}" ry="${f(rx * 0.18)}" stroke-width="1.6"/>`; }
		for (const k of [1, 2, 3]) g += `<ellipse cx="300" cy="300" rx="${f(200 * Math.cos((k * Math.PI) / 8))}" ry="200" stroke-width="1.6"/>`;
		return g + `<ellipse cx="300" cy="300" rx="290" ry="90" transform="rotate(-20 300 300)" stroke-dasharray="14 10"/></g>`;
	},
};
for (const [nome, desenho] of Object.entries(SELOS)) {
	for (const modo of ['escuro', 'claro']) {
		const variantes = [[`${nome}-${modo}`, PALETAS[`${nome}-${modo}`]], ...CORES[nome].slice(1).map((cor) => [`${nome}-${cor}-${modo}`, PALETAS[`${nome}-${cor}-${modo}`]])];
		for (const [arquivo, p] of variantes) fs.writeFileSync(`public/temas/selo-${arquivo}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">${desenho(p)}</svg>
`);
	}
}

// O selo rúnico do Holograma é desenhado à mão (selo-ciano.svg): nas outras paletas, só troca a cor.
const seloRunico = fs.readFileSync('public/temas/selo-ciano.svg', 'utf8');
for (const cor of CORES.holograma.slice(1)) {
	for (const modo of ['escuro', 'claro']) fs.writeFileSync(`public/temas/selo-holograma-${cor}-${modo}.svg`, seloRunico.split('#7ee7ff').join(PALETAS[`holograma-${cor}-${modo}`].linha));
}

// Réguas graduadas da moldura do Planisfério, uma para cada lado: um traço longo a cada cinco.
for (const modo of ['classico-escuro', 'classico-claro', ...CORES.classico.slice(1).flatMap((cor) => [`classico-${cor}-escuro`, `classico-${cor}-claro`])]) {
	const p = PALETAS[modo];
	const lados = { cima: '', baixo: '', esq: '', dir: '' };
	for (let i = 0; i < 5; i++) {
		const x = i * 10 + 0.5, l = i === 0 ? 12 : 6;
		lados.cima += `<line x1="${x}" y1="0" x2="${x}" y2="${l}"/>`;
		lados.baixo += `<line x1="${x}" y1="12" x2="${x}" y2="${12 - l}"/>`;
		lados.esq += `<line x1="0" y1="${x}" x2="${l}" y2="${x}"/>`;
		lados.dir += `<line x1="12" y1="${x}" x2="${12 - l}" y2="${x}"/>`;
	}
	for (const [lado, linhas] of Object.entries(lados)) {
		const [w, h] = lado === 'cima' || lado === 'baixo' ? [50, 12] : [12, 50];
		fs.writeFileSync(`public/temas/regua-${lado}-${modo}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" stroke="${p.linha}" stroke-width="1">${linhas}</svg>
`);
	}
}

// Observatório e Codex: as estrelas da capa, recoloridas em cada paleta. (Os anéis da capa são peças animadas, em
// máscara branca, de tools/gerar-decoracoes.mjs; a cor deles vem do CSS.) O fundo das páginas do Codex usa o campo largo
// de 1200 px (tools/gerar-assets-temas.mjs), também recolorido.
const pecas = Object.fromEntries(['estrelas-douradas', 'estrelas-tinta', 'estrelas-douradas-largo', 'estrelas-tinta-largo'].map((n) => [n, fs.readFileSync(`public/temas/${n}.svg`, 'utf8')]));
const recolorir = (peca, de, para, arquivo) => fs.writeFileSync(`public/temas/${arquivo}.svg`, pecas[peca].split(de).join(para));
for (const cor of CORES.observatorio.slice(1)) {
	const e = capaAstra('observatorio', cor, 'escuro');
	recolorir('estrelas-douradas', '#e3c38f', e.estrelas, `estrelas-observatorio-${cor}`);
}
for (const cor of CORES.codex.slice(1)) {
	const e = capaAstra('codex', cor, 'escuro'), cl = capaAstra('codex', cor, 'claro');
	recolorir('estrelas-douradas', '#e3c38f', e.estrelas, `estrelas-codex-${cor}-escuro`);
	recolorir('estrelas-tinta', '#1b2a3e', cl.estrelas, `estrelas-codex-${cor}-claro`);
	recolorir('estrelas-douradas-largo', '#e3c38f', e.estrelas, `estrelas-codex-${cor}-escuro-largo`);
	recolorir('estrelas-tinta-largo', '#1b2a3e', cl.estrelas, `estrelas-codex-${cor}-claro-largo`);
}
