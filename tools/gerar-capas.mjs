// Gera as capas desenhadas em SVG (Planisfério do Clássico, Armilar do Astrolábio, as quatro sci-fi e as de fantasia) e as marcas d'água do sci-fi,
// inclusive nas paletas de cor de src/cores.mjs.
// Uso: node tools/gerar-capas.mjs
import fs from 'node:fs';
import { CORES } from '../src/cores.mjs';
import { arteFantasia, capaAstra, capaScifi, mistura, ornamentoFantasia } from './paletas.mjs';

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
	// Contatos.
	for (const [x, y, nome, cor] of [[1440, 96, 'NAVE-03', p.linha], [330, 420, 'BOIA 7', p.linha], [1580, 390, '? SEM ID', p.brilho], [250, 110, 'ESTAÇÃO K', p.linha]]) {
		g += `<circle cx="${x}" cy="${y}" r="4" fill="${cor}"/><circle cx="${x}" cy="${y}" r="12" fill="none" stroke="${cor}" stroke-width="1" opacity=".6"/>`;
		g += `<line x1="${x + 12}" y1="${y - 8}" x2="${x + 34}" y2="${y - 22}" stroke="${cor}" stroke-width="1" opacity=".7"/>` + texto(x + 38, y - 24, nome, cor, 13, 'letter-spacing="1"');
	}
	g += texto(40, 496, 'VARREDURA ATIVA · ALCANCE 40 UA', p.fraca, 13, 'letter-spacing="2"') + texto(W - 40, 496, '4 CONTATOS', p.fraca, 13, 'text-anchor="end" letter-spacing="2"');
	return g;
}

// 3. Circuito: trilhas de placa saindo das bordas, com chips e pulsos de dados correndo por alguns ciclos
// (uma animação sem fim dentro do SVG redesenharia a capa a cada quadro, para sempre).
function circuito(p) {
	let g = fundoLinear(p) + grade(p, 24, 0.07);
	g += `<style>.pulso{stroke-dasharray:8 340;animation:corre 3.2s linear 6}@keyframes corre{to{stroke-dashoffset:-348}}@media (prefers-reduced-motion: reduce){.pulso{animation:none}}</style>`;
	const r = sorteio(131);
	let trilhas = '', pulsos = '', pads = '';
	// Trilhas: saem de uma borda, andam reto, dobram a 45 graus e param antes da área do nome.
	for (let i = 0; i < 26; i++) {
		const esq = i % 2 === 0, y0 = 26 + r() * (H - 52), dir = esq ? 1 : -1;
		const x0 = esq ? -10 : W + 10, x1 = esq ? 60 + r() * 220 : W - 60 - r() * 220;
		const sobe = y0 < H / 2 ? 1 : -1, d = 20 + r() * 70;
		const x2 = x1 + dir * d, y2 = y0 + sobe * d * (r() < 0.5 ? 1 : -1);
		const x3 = esq ? Math.min(x2 + 60 + r() * 260, 520) : Math.max(x2 - 60 - r() * 260, W - 520);
		const caminho = `M ${f(x0)} ${f(y0)} L ${f(x1)} ${f(y0)} L ${f(x2)} ${f(y2)} L ${f(x3)} ${f(y2)}`;
		trilhas += `<path d="${caminho}"/>`;
		if (i % 3 === 0) pulsos += `<path class="pulso" d="${caminho}" style="animation-delay:-${f(r() * 3)}s"/>`;
		pads += `<circle cx="${f(x3)}" cy="${f(y2)}" r="4.5" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.6"/>`;
	}
	g += `<g fill="none" stroke="${p.linha}" stroke-width="7" opacity=".08">${trilhas}</g>`;
	g += `<g fill="none" stroke="${p.linha}" stroke-width="1.6" opacity=".7">${trilhas}</g>`;
	g += `<g fill="none" stroke="${p.brilho}" stroke-width="3" stroke-linecap="round">${pulsos}</g>` + pads;
	// Chips.
	for (const [x, y, w, h, rot] of [[150, 190, 110, 70, 'ÉTER-9'], [1540, 300, 120, 74, 'NÚCLEO'], [330, 60, 70, 44, 'R7'], [1380, 420, 76, 46, 'S2']]) {
		g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.6"/>`;
		for (let k = 8; k < w - 4; k += 12) g += `<line x1="${x + k}" y1="${y - 7}" x2="${x + k}" y2="${y}" stroke="${p.linha}" stroke-width="2"/><line x1="${x + k}" y1="${y + h}" x2="${x + k}" y2="${y + h + 7}" stroke="${p.linha}" stroke-width="2"/>`;
		g += texto(x + w / 2, y + h / 2 + 5, rot, p.linha, 13, 'text-anchor="middle" letter-spacing="2"');
	}
	return g;
}

// 4. Navegação: um planeta em malha de arame no canto, a órbita e a rota até o destino marcado.
function navegacao(p) {
	const px = 250, py = 560, pr = 330;
	let g = fundoLinear(p);
	g += estrelas(p, 300, 151, (x, y) => Math.hypot(x - px, y - py) < pr + 10);
	g += `<defs><radialGradient id="atm" cx="${f(px / W * 100)}%" cy="100%" r="35%"><stop offset="0" stop-color="${p.linha}" stop-opacity=".22"/><stop offset="1" stop-color="${p.linha}" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#atm)"/>`;
	// Planeta: paralelos e meridianos.
	g += `<circle cx="${px}" cy="${py}" r="${pr}" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="2"/>`;
	g += `<g fill="none" stroke="${p.linha}" stroke-width="1" opacity=".55" transform="rotate(-18 ${px} ${py})">`;
	for (let k = -4; k <= 4; k++) { const yy = py + (k * pr) / 5, rx = Math.sqrt(pr * pr - ((k * pr) / 5) ** 2); g += `<ellipse cx="${px}" cy="${f(yy)}" rx="${f(rx)}" ry="${f(rx * 0.16)}"/>`; }
	for (let k = 1; k <= 5; k++) g += `<ellipse cx="${px}" cy="${py}" rx="${f(pr * Math.cos((k * Math.PI) / 12))}" ry="${pr}"/>`;
	g += '</g>';
	// Órbita e satélites.
	g += `<ellipse cx="${px}" cy="${py}" rx="${pr + 260}" ry="${pr * 0.42}" transform="rotate(-18 ${px} ${py})" fill="none" stroke="${p.linha}" stroke-width="1.2" stroke-dasharray="10 8" opacity=".6"/>`;
	// Rota curva até o destino.
	const dx = 1560, dy = 120;
	g += `<path d="M ${px + 160} ${py - 300} C 700 120, 1200 40, ${dx} ${dy}" fill="none" stroke="${p.brilho}" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round"/>`;
	g += `<circle cx="${dx}" cy="${dy}" r="8" fill="none" stroke="${p.brilho}" stroke-width="2"/><circle cx="${dx}" cy="${dy}" r="22" fill="none" stroke="${p.brilho}" stroke-width="1" opacity=".6"/><circle cx="${dx}" cy="${dy}" r="38" fill="none" stroke="${p.brilho}" stroke-width=".8" opacity=".35" stroke-dasharray="4 6"/>`;
	g += texto(dx + 48, dy - 6, 'DESTINO', p.brilho, 14, 'letter-spacing="3" font-weight="700"') + texto(dx + 48, dy + 14, 'MOGAR · 3,2 UA', p.fraca, 13, 'letter-spacing="1"');
	// Pontos de passagem na rota.
	for (const [x, y, n] of [[700, 152, 'PP-1'], [1180, 66, 'PP-2']]) g += `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="none" stroke="${p.linha}" stroke-width="1.6" transform="rotate(45 ${x} ${y})"/>` + texto(x, y - 14, n, p.fraca, 12, 'text-anchor="middle"');
	// Painel de dados à direita, embaixo.
	const linhas = ['ÓRBITA ESTÁVEL', 'Δv 0,84 km/s', 'CHEGADA T+06:12', 'ÉTER 72%'];
	g += `<rect x="${W - 300}" y="${H - 150}" width="250" height="110" fill="${p.fundo[1]}" fill-opacity=".6" stroke="${p.linha}" stroke-width="1.2"/>`;
	linhas.forEach((l, i) => (g += texto(W - 284, H - 120 + i * 24, l, i === 0 ? p.linha : p.fraca, 13, 'letter-spacing="1"')));
	g += canto(W - 300, H - 150, 1, 1, 16, p.brilho, 2.4);
	return g;
}

// Fantasia: capas únicas (o tema é o mesmo no claro e no escuro). O centro fica livre para o nome.

// Bosque Feérico: clareira ao luar, com galhos em arco, folhas, lua crescente e vaga-lumes.
function bosque(p) {
	let g = `<defs><radialGradient id="ceu" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".6" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></radialGradient>
	<radialGradient id="lua"><stop offset="0" stop-color="${p.brilho}" stop-opacity=".5"/><stop offset="1" stop-color="${p.brilho}" stop-opacity="0"/></radialGradient>
	<radialGradient id="vaga"><stop offset="0" stop-color="${p.vaga}" stop-opacity="1"/><stop offset=".3" stop-color="${p.vaga}" stop-opacity=".5"/><stop offset="1" stop-color="${p.vaga}" stop-opacity="0"/></radialGradient></defs>
	<rect width="${W}" height="${H}" fill="url(#ceu)"/>`;
	g += estrelas(p, 160, 201, (x, y) => y > 300);
	// Lua crescente com halo.
	g += `<circle cx="1480" cy="110" r="150" fill="url(#lua)"/><path d="M 1480 50 A 60 60 0 1 0 1480 170 A 46 46 0 1 1 1480 50 Z" fill="${p.brilho}" opacity=".9"/>`;
	// Galhos em arco saindo dos cantos de baixo, com folhas ao longo.
	const r = sorteio(211);
	const galho = (pts, larg) => {
		const [a, b, c, d] = pts;
		let s = `<path d="M ${a[0]} ${a[1]} C ${b[0]} ${b[1]}, ${c[0]} ${c[1]}, ${d[0]} ${d[1]}" fill="none" stroke="${p.linha}" stroke-width="${larg}" stroke-linecap="round"/>`;
		for (let k = 1; k < 48; k++) {
			const t = k / 48, u = 1 - t;
			const x = u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0];
			const y = u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1];
			const ang = r() * 360, tam = 14 + r() * 18 * (1 - t * 0.5);
			s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(tam)}" ry="${f(tam * 0.38)}" transform="rotate(${f(ang)} ${f(x)} ${f(y)})" fill="${r() < 0.3 ? p.folha2 : p.folha}" opacity="${f(0.55 + r() * 0.4)}"/>`;
		}
		return s;
	};
	g += galho([[-20, 540], [120, 260], [260, 60], [700, 20]], 12);
	g += galho([[1820, 540], [1680, 300], [1600, 40], [1100, 18]], 12);
	g += galho([[-20, 420], [80, 330], [160, 250], [300, 200]], 4);
	g += galho([[1820, 440], [1720, 360], [1650, 300], [1520, 270]], 4);
	// Trepadeiras pendendo.
	for (const [x, y0, l] of [[380, 40, 150], [520, 24, 90], [1290, 26, 120], [1420, 40, 80]]) {
		g += `<path d="M ${x} ${y0} q 10 ${l / 3} 0 ${(2 * l) / 3} t 0 ${l / 3}" fill="none" stroke="${p.linha}" stroke-width="1.6" opacity=".7"/>`;
		for (let k = 1; k <= 4; k++) g += `<ellipse cx="${x + (k % 2 ? 6 : -6)}" cy="${f(y0 + (l * k) / 5)}" rx="6" ry="2.6" transform="rotate(${k % 2 ? 30 : -30} ${x} ${f(y0 + (l * k) / 5)})" fill="${p.folha}" opacity=".7"/>`;
	}
	// Grama na base.
	for (let x = -10; x < W + 10; x += 9) { const h = 14 + r() * 30; g += `<path d="M ${f(x)} ${H} q ${f(r() * 8 - 4)} ${f(-h / 2)} ${f(r() * 10 - 5)} ${f(-h)}" stroke="${p.folha2}" stroke-width="2" fill="none" opacity=".55"/>`; }
	// Vaga-lumes.
	for (let i = 0; i < 46; i++) { const x = r() * W, y = 60 + r() * (H - 100); if (x > 520 && x < 1280 && y > 160 && y < 360) continue; const s = 6 + r() * 12; g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s)}" fill="url(#vaga)"/>`; }
	return g;
}

// Vitral: parede de pedra no escuro com janelas góticas de vidraças em losango; a do meio, atrás do nome, quase apagada.
function vitral(p) {
	let g = `<defs><linearGradient id="parede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset="1" stop-color="${p.fundo[1]}"/></linearGradient>
	<linearGradient id="feixe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.luz}" stop-opacity=".13"/><stop offset="1" stop-color="${p.luz}" stop-opacity="0"/></linearGradient></defs>
	<rect width="${W}" height="${H}" fill="url(#parede)"/>`;
	// Juntas da cantaria.
	g += `<g stroke="${p.junta}" stroke-width="1.5" opacity=".5">`;
	for (let y = 52, k = 0; y < H; y += 52, k++) { g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`; for (let x = k % 2 ? 0 : 60; x < W; x += 120) g += `<line x1="${x}" y1="${y - 52}" x2="${x}" y2="${y}"/>`; }
	g += '</g>';
	const janelas = [[150, 0], [450, 1], [900, 2], [1350, 1], [1650, 0]];
	const larg = 150, alto = 380, base = 470;
	for (const [cx, cor] of janelas) {
		const meio = cx === 900, x0 = cx - larg / 2, x1 = cx + larg / 2, topo = base - alto;
		const arco = `M ${x0} ${base} V ${topo + larg * 0.55} Q ${x0} ${topo} ${cx} ${topo - 30} Q ${x1} ${topo} ${x1} ${topo + larg * 0.55} V ${base} Z`;
		const id = `j${cx}`;
		g += `<defs><clipPath id="${id}"><path d="${arco}"/></clipPath><radialGradient id="v${cx}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="${p.vidros[cor][0]}"/><stop offset="1" stop-color="${p.vidros[cor][1]}"/></radialGradient></defs>`;
		// Feixe de luz descendo da janela.
		if (!meio) g += `<path d="M ${x0} ${base - 40} L ${x1} ${base - 40} L ${x1 + 160} ${H + 10} L ${x0 + 60} ${H + 10} Z" fill="url(#feixe)"/>`;
		g += `<g clip-path="url(#${id})" opacity="${meio ? 0.22 : 0.92}"><rect x="${x0}" y="${topo - 40}" width="${larg}" height="${alto + 50}" fill="url(#v${cx})"/>`;
		// Vidraças em losango (chumbo).
		g += `<g stroke="${p.chumbo}" stroke-width="2.4" fill="none">`;
		for (let d = -alto; d < alto + larg; d += 26) { g += `<line x1="${x0}" y1="${topo - 40 + d}" x2="${x1}" y2="${topo - 40 + d + larg * 0.9}"/><line x1="${x1}" y1="${topo - 40 + d}" x2="${x0}" y2="${topo - 40 + d + larg * 0.9}"/>`; }
		g += `</g><line x1="${cx}" y1="${topo - 40}" x2="${cx}" y2="${base}" stroke="${p.chumbo}" stroke-width="7"/></g>`;
		// Moldura de pedra e o óculo trifólio por cima.
		g += `<path d="${arco}" fill="none" stroke="${p.pedra}" stroke-width="10"/><path d="${arco}" fill="none" stroke="${p.prata}" stroke-width="1.2" opacity=".5"/>`;
		if (!meio) {
			g += `<g transform="translate(${cx} ${topo - 66})">`;
			for (const a of [0, 120, 240]) g += `<circle cx="0" cy="-9" r="9" transform="rotate(${a})" fill="${p.vidros[(cor + 1) % 3][0]}" stroke="${p.pedra}" stroke-width="3" opacity=".85"/>`;
			g += '</g>';
		}
	}
	g += `<rect x="0" y="${base}" width="${W}" height="${H - base}" fill="${p.fundo[1]}"/><line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="${p.pedra}" stroke-width="6"/>`;
	return g;
}

// Mapa do Aventureiro: um mapa desenhado à mão, com mar, costas, montanhas, florestas, rosa dos ventos e a rota até o X.
function mapa(p) {
	const r = sorteio(501);
	let g = `<defs><radialGradient id="papel" cx="50%" cy="50%" r="75%"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".75" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></radialGradient></defs>
	<rect width="${W}" height="${H}" fill="url(#papel)"/>`;
	// Costas: uma terra de cada lado, com o contorno recortado e suavizado.
	const costa = (xBase, lado) => {
		const pts = [];
		for (let y = -20; y <= H + 20; y += 18) pts.push([xBase + Math.sin(y / 55) * 34 + Math.sin(y / 19) * 12 + (r() - 0.5) * 16, y]);
		let d = `M ${lado < 0 ? -20 : W + 20} -20 L ${f(pts[0][0])} ${pts[0][1]}`;
		for (let i = 1; i < pts.length - 1; i++) d += ` Q ${f(pts[i][0])} ${pts[i][1]} ${f((pts[i][0] + pts[i + 1][0]) / 2)} ${(pts[i][1] + pts[i + 1][1]) / 2}`;
		return d + ` L ${lado < 0 ? -20 : W + 20} ${H + 20} Z`;
	};
	const terras = [costa(390, -1), costa(1410, 1)];
	// Ondas de mar desenhadas no meio.
	for (let i = 0; i < 60; i++) { const x = 440 + r() * 920, y = 30 + r() * 460; if (x > 560 && x < 1240 && y > 170 && y < 350) continue; g += `<path d="M ${f(x)} ${f(y)} q 8 -6 16 0 t 16 0" fill="none" stroke="${p.mar}" stroke-width="1.6" opacity=".6"/>`; }
	for (const d of terras) g += `<path d="${d}" fill="${p.terra}" stroke="${p.tinta}" stroke-width="2.4"/><path d="${d}" fill="none" stroke="${p.mar}" stroke-width="10" opacity=".18"/>`;
	// Montanhas e florestas nas terras.
	const montanha = (x, y, s) => `<path d="M ${x - 22 * s} ${y} L ${x} ${y - 30 * s} L ${x + 22 * s} ${y}" fill="${p.fundo[0]}" stroke="${p.tinta}" stroke-width="1.8"/><path d="M ${x} ${y - 30 * s} L ${x + 6 * s} ${y}" stroke="${p.tinta}" stroke-width="1" opacity=".6"/>`;
	const arvore = (x, y) => `<circle cx="${x}" cy="${y - 7}" r="6.5" fill="${p.floresta}" stroke="${p.tinta}" stroke-width="1.2"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 5}" stroke="${p.tinta}" stroke-width="1.2"/>`;
	for (const [x, y, s] of [[120, 120, 1.2], [160, 130, 0.9], [90, 150, 0.8], [210, 100, 1], [1560, 120, 1.1], [1610, 140, 1.3], [1660, 118, 0.9], [1520, 150, 0.8]]) g += montanha(x, y, s);
	for (let i = 0; i < 26; i++) g += arvore(f(60 + r() * 250), f(300 + r() * 160));
	for (let i = 0; i < 22; i++) g += arvore(f(1520 + r() * 230), f(300 + r() * 170));
	// Rota pontilhada até o X.
	g += `<path d="M 230 250 C 420 170, 640 120, 900 110 S 1350 160, 1600 260" fill="none" stroke="${p.rota}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>`;
	g += `<circle cx="230" cy="250" r="7" fill="${p.rota}"/><g stroke="${p.rota}" stroke-width="5" stroke-linecap="round"><line x1="1588" y1="248" x2="1612" y2="272"/><line x1="1612" y1="248" x2="1588" y2="272"/></g>`;
	// A rosa dos ventos é uma camada à parte (rosaDosVentos), que gira por cima da capa.
	// Um navio e uma serpente marinha.
	g += `<g transform="translate(560 420)" stroke="${p.tinta}" stroke-width="1.6" fill="${p.fundo[0]}"><path d="M -26 0 Q 0 14 26 0 Z"/><line x1="0" y1="0" x2="0" y2="-34"/><path d="M 2 -32 Q 20 -20 2 -6 Z"/></g>`;
	g += `<path d="M 1120 470 q 14 -26 28 0 q 14 26 28 0 q 14 -26 28 0" fill="none" stroke="${p.mar}" stroke-width="5" stroke-linecap="round"/><circle cx="1200" cy="462" r="3" fill="${p.tinta}"/>`;
	// Borda de mapa com graus.
	g += `<rect x="12" y="12" width="${W - 24}" height="${H - 24}" fill="none" stroke="${p.tinta}" stroke-width="2"/><rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="${p.tinta}" stroke-width=".8"/>`;
	for (let x = 22; x < W - 22; x += 60) g += `<rect x="${x}" y="12" width="30" height="10" fill="${p.tinta}" opacity=".8"/><rect x="${x}" y="${H - 22}" width="30" height="10" fill="${p.tinta}" opacity=".8"/>`;
	// Um véu claro atrás do nome.
	g += `<defs><radialGradient id="veu"><stop offset="0" stop-color="${p.fundo[0]}" stop-opacity=".85"/><stop offset="1" stop-color="${p.fundo[0]}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${W / 2}" cy="${H / 2}" rx="520" ry="150" fill="url(#veu)"/>`;
	return g;
}

// Abissal: o fundo do mar, com raios de luz vindos da superfície, algas, bolhas e águas-vivas brilhando.
function abissal(p) {
	const r = sorteio(601);
	let g = `<defs><linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".55" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></linearGradient>
	<linearGradient id="raio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.luz}" stop-opacity=".22"/><stop offset="1" stop-color="${p.luz}" stop-opacity="0"/></linearGradient>
	<radialGradient id="brilho"><stop offset="0" stop-color="${p.medusa}" stop-opacity=".55"/><stop offset="1" stop-color="${p.medusa}" stop-opacity="0"/></radialGradient></defs>
	<rect width="${W}" height="${H}" fill="url(#agua)"/>`;
	// Raios de luz.
	for (const [x, w, inc] of [[260, 90, 120], [520, 60, 160], [820, 120, 140], [1120, 70, 180], [1420, 100, 150], [1640, 60, 120]]) g += `<path d="M ${x} -10 L ${x + w} -10 L ${x + w + inc} ${H} L ${x + inc - 40} ${H} Z" fill="url(#raio)"/>`;
	// Algas dos dois lados.
	const alga = (x, alt, fase) => {
		let d = `M ${x} ${H + 10}`;
		for (let y = H + 10, k = 0; y > H - alt; y -= 20, k++) d += ` Q ${f(x + Math.sin(k + fase) * 22)} ${y - 10} ${f(x + Math.sin(k + 1 + fase) * 10)} ${y - 20}`;
		return `<path d="${d}" fill="none" stroke="${p.alga}" stroke-width="${f(6 + r() * 6)}" stroke-linecap="round" opacity="${f(0.6 + r() * 0.35)}"/>`;
	};
	for (let i = 0; i < 14; i++) g += alga(f(10 + r() * 380), 160 + r() * 260, r() * 6);
	for (let i = 0; i < 14; i++) g += alga(f(1410 + r() * 380), 160 + r() * 260, r() * 6);
	// Areia e corais no fundo.
	g += `<path d="M -10 ${H - 26} Q 400 ${H - 46} 900 ${H - 30} T 1810 ${H - 34} V ${H + 10} H -10 Z" fill="${p.areia}"/>`;
	for (const [x, s] of [[460, 1], [1330, 1.2], [1260, 0.7]]) g += `<g transform="translate(${x} ${H - 30}) scale(${s})" stroke="${p.coral}" stroke-width="6" stroke-linecap="round" fill="none"><path d="M 0 0 V -40 M 0 -22 L -16 -40 M 0 -30 L 14 -50 M -16 -40 V -54 M 14 -50 L 22 -60"/></g>`;
	// Águas-vivas.
	for (const [x, y, s] of [[250, 140, 1], [1560, 110, 1.2], [1470, 260, 0.7]]) {
		g += `<circle cx="${x}" cy="${y}" r="${70 * s}" fill="url(#brilho)"/><g transform="translate(${x} ${y}) scale(${s})"><path d="M -30 0 Q -30 -34 0 -34 Q 30 -34 30 0 Q 15 6 0 0 Q -15 6 -30 0 Z" fill="${p.medusa}" opacity=".75"/>`;
		for (const tx of [-20, -8, 4, 16]) g += `<path d="M ${tx} 2 q 6 18 0 34 t 0 34" fill="none" stroke="${p.medusa}" stroke-width="2" opacity=".6"/>`;
		g += '</g>';
	}
	// Bolhas subindo.
	for (let i = 0; i < 70; i++) { const x = r() * W, y = r() * H; if (x > 520 && x < 1280 && y > 150 && y < 370) continue; g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.5 + r() * 5)}" fill="none" stroke="${p.luz}" stroke-width="1.2" opacity="${f(0.25 + r() * 0.45)}"/>`; }
	return g;
}

// Forja Rúnica: pedra escura, faixas de runas acesas em brasa em cima e embaixo, e fagulhas subindo.
const RUNAS = ['M6 0V34M6 6L18 0M6 14L18 8', 'M4 34V0L16 10V34', 'M6 0V34M6 10L16 17L6 24', 'M6 0V34M6 6L16 12M6 14L16 20', 'M6 34V0L16 8L6 16L16 34', 'M16 4L6 17L16 30', 'M2 2L18 32M18 2L2 32', 'M6 34V0L16 8L6 16', 'M4 0V34M16 0V34M4 12L16 22', 'M10 0V34M4 12L16 22', 'M10 0V34', 'M8 4L2 12L8 20M12 14L18 22L12 30', 'M10 0V34M10 0L16 6M10 34L4 28', 'M10 0V34M10 12L2 2M10 12L18 2', 'M14 0L4 12L16 22L6 34', 'M10 0V34M10 0L2 10M10 0L18 10', 'M5 0V34M5 0L15 8L5 17L15 26L5 34', 'M3 34V0L10 10L17 0V34', 'M3 34V0L17 14M17 34V0L3 14', 'M6 0V34M6 0L16 10', 'M10 0L18 10L10 20L2 10Z', 'M2 0V34L18 0V34L2 0'];
function forja(p) {
	const r = sorteio(401);
	let g = `<defs><radialGradient id="pedra" cx="50%" cy="40%" r="80%"><stop offset="0" stop-color="${p.fundo[0]}"/><stop offset=".7" stop-color="${p.fundo[1]}"/><stop offset="1" stop-color="${p.fundo[2]}"/></radialGradient>
	<radialGradient id="brasa" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="${p.brasa}" stop-opacity=".55"/><stop offset=".5" stop-color="${p.brasa}" stop-opacity=".12"/><stop offset="1" stop-color="${p.brasa}" stop-opacity="0"/></radialGradient>
	<filter id="acesa" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
	<rect width="${W}" height="${H}" fill="url(#pedra)"/><rect width="${W}" height="${H}" fill="url(#brasa)"/>`;
	// Blocos de pedra: juntas irregulares.
	g += `<g stroke="${p.junta}" stroke-width="2" fill="none" opacity=".6">`;
	for (let y = 120; y < 420; y += 75) { g += `<line x1="0" y1="${y}" x2="${W}" y2="${y + (r() - 0.5) * 6}"/>`; for (let x = (y / 75) % 2 ? 0 : 110; x < W; x += 220) g += `<line x1="${f(x + r() * 20)}" y1="${y}" x2="${f(x + r() * 20)}" y2="${y + 75}"/>`; }
	g += '</g>';
	// Faixas de runas.
	for (const y of [26, H - 86]) {
		g += `<rect x="-4" y="${y}" width="${W + 8}" height="60" fill="${p.fundo[2]}" stroke="${p.linha}" stroke-width="2"/><line x1="0" y1="${y + 6}" x2="${W}" y2="${y + 6}" stroke="${p.linha}" stroke-width="1" opacity=".6"/><line x1="0" y1="${y + 54}" x2="${W}" y2="${y + 54}" stroke="${p.linha}" stroke-width="1" opacity=".6"/>`;
		g += `<g fill="none" stroke="${p.brasa}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#acesa)">`;
		for (let x = 30, k = 0; x < W - 20; x += 44, k++) {
			if (k % 9 === 8) { g += `</g><circle cx="${x + 10}" cy="${y + 30}" r="4" fill="${p.linha}"/><g fill="none" stroke="${p.brasa}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#acesa)">`; continue; }
			g += `<path transform="translate(${x} ${y + 13})" d="${RUNAS[Math.floor(r() * RUNAS.length)]}" opacity="${f(0.7 + r() * 0.3)}"/>`;
		}
		g += '</g>';
	}
	// Fagulhas subindo, mais densas embaixo, longe do centro.
	for (let i = 0; i < 120; i++) {
		const x = r() * W, y = 100 + Math.pow(r(), 0.6) * (H - 190);
		if (x > 520 && x < 1280 && y > 150 && y < 370) continue;
		const s = f(1 + r() * 2.6);
		g += `<circle cx="${f(x)}" cy="${f(y)}" r="${s}" fill="${r() < 0.3 ? p.brilho : p.brasa}" opacity="${f(0.35 + r() * 0.6)}"/>`;
	}
	return g;
}

// Rosa dos ventos do Mapa, centrada na origem: vai num arquivo à parte, que gira por cima da capa.
function rosaDosVentos(p) {
	let g = `<circle r="44" fill="${p.fundo[0]}" fill-opacity=".55" stroke="${p.tinta}" stroke-width="1.4"/><circle r="36" fill="none" stroke="${p.tinta}" stroke-width=".8"/>`;
	for (const a of [0, 90, 180, 270]) g += `<path d="M 0 -58 L 7 -7 L 0 0 Z" transform="rotate(${a})" fill="${p.tinta}"/><path d="M 0 -58 L -7 -7 L 0 0 Z" transform="rotate(${a})" fill="${p.fundo[0]}" stroke="${p.tinta}" stroke-width="1"/>`;
	for (const a of [45, 135, 225, 315]) g += `<path d="M 0 -34 L 5 -5 L 0 0 L -5 -5 Z" transform="rotate(${a})" fill="${p.mar}" opacity=".8"/>`;
	return g + `<text y="-64" font-family="Georgia, serif" font-size="16" text-anchor="middle" fill="${p.tinta}">N</text>`;
}

// Esfera armilar grande, deslocada para a direita. A esfera vai num arquivo à parte (esferaArmilar), que balança por cima.
const ESFERA = { cx: 1390, cy: 262 };
function armilar(p) {
	const { cx } = ESFERA;
	let g = fundo(p, 'f');
	g += `<defs><radialGradient id="halo" cx="${f(cx / W * 100)}%" cy="50%" r="30%"><stop offset="0" stop-color="${p.brilho}" stop-opacity=".22"/><stop offset="1" stop-color="${p.brilho}" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#halo)"/>`;
	g += estrelas(p, 380, 41);
	[[80, 80, 2, 1], [260, 360, 0, 0.9], [760, 410, 3, 0.8]].forEach(([x, y, i, e], k) => (g += constelacao(p, FIGURAS[i], x, y, e, 51 + k)));
	return g;
}

function esferaArmilar(p) {
	const { cx, cy } = ESFERA, R = 300, Ri = R - 24;
	const anel = (rx, ry, rot, larg, op) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" stroke-width="${larg}" opacity="${op}"/>`;
	let g = `<g fill="none" stroke="${p.linha}">`;
	// Meridiano: aro duplo graduado.
	g += `<circle cx="${cx}" cy="${cy}" r="${R}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${Ri}" stroke-width="1.2"/>`;
	for (let a = 0; a < 360; a += 2.5) {
		const t = (a * Math.PI) / 180, longo = a % 15 === 0;
		g += `<line x1="${f(cx + Math.cos(t) * R)}" y1="${f(cy + Math.sin(t) * R)}" x2="${f(cx + Math.cos(t) * (R - (longo ? 24 : 10)))}" y2="${f(cy + Math.sin(t) * (R - (longo ? 24 : 10)))}" stroke-width="${longo ? 1.3 : 0.7}"/>`;
	}
	// Horizonte, equador, eclíptica (faixa dupla), trópicos e colúria.
	g += anel(R + 46, 74, 0, 2, 0.9) + anel(R + 34, 64, 0, 0.9, 0.7);
	g += anel(Ri, Ri * 0.36, -23.5, 1.6, 0.9);
	g += anel(Ri, Ri * 0.5, 18, 1.4, 0.85) + anel(Ri - 16, (Ri - 16) * 0.5, 18, 0.9, 0.7);
	for (const s of [-1, 1]) {
		const t = (-23.5 * Math.PI) / 180, d = s * Ri * 0.42;
		g += `<ellipse cx="${f(cx - Math.sin(t) * d)}" cy="${f(cy + Math.cos(t) * d)}" rx="${f(Ri * 0.9)}" ry="${f(Ri * 0.9 * 0.36)}" transform="rotate(-23.5 ${f(cx - Math.sin(t) * d)} ${f(cy + Math.cos(t) * d)})" stroke-width=".9" opacity=".55"/>`;
	}
	g += anel(Ri * 0.34, Ri, -23.5, 1.1, 0.7);
	// Eixo polar com os remates.
	const t = (-23.5 * Math.PI) / 180, L = R + 70;
	const ax = [cx - Math.sin(t) * L, cy + Math.cos(t) * L, cx + Math.sin(t) * L, cy - Math.cos(t) * L];
	g += `<line x1="${f(ax[0])}" y1="${f(ax[1])}" x2="${f(ax[2])}" y2="${f(ax[3])}" stroke-width="1.6"/>`;
	g += '</g>';
	g += `<circle cx="${f(ax[2])}" cy="${f(ax[3])}" r="6" fill="${p.linha}"/><circle cx="${f(ax[0])}" cy="${f(ax[1])}" r="6" fill="${p.linha}"/>`;
	// Globo central com uma estrela de quatro pontas.
	g += `<circle cx="${cx}" cy="${cy}" r="44" fill="${p.fundo[1]}" stroke="${p.linha}" stroke-width="1.6"/>`;
	g += `<path d="M ${cx} ${cy - 30} Q ${cx + 5} ${cy - 5} ${cx + 30} ${cy} Q ${cx + 5} ${cy + 5} ${cx} ${cy + 30} Q ${cx - 5} ${cy + 5} ${cx - 30} ${cy} Q ${cx - 5} ${cy - 5} ${cx} ${cy - 30} Z" fill="${p.brilho}"/>`;
	return g;
}

// Constelação: um rio de estrelas (o "Star Stream") cruza o céu em curva, com o brilho dourado no meio, constelações
// nos cantos e estrelas de quatro pontas como a do logo. O centro fica limpo para o nome.
function rio(p) {
	const r = sorteio(701);
	const curva = (t) => [-120 + 2040 * t, 300 - 185 * Math.sin(Math.PI * (t - 0.5)) + 42 * Math.sin(4 * Math.PI * t)];
	let d = '';
	for (let t = 0; t <= 1.0001; t += 0.02) { const [x, y] = curva(t); d += `${d ? ' L' : 'M'} ${f(x)} ${f(y)}`; }
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
	// As estrelas do rio: mais densas no meio da faixa, da cor violeta no começo ao ouro e ao marfim no fim.
	const cor = (t) => (t < 0.5 ? mistura(p.violeta, p.acento, t * 2) : mistura(p.acento, p.marfim, (t - 0.5) * 2));
	for (let i = 0; i < 2600; i++) {
		const t = r(), [x, y] = curva(t);
		const gauss = (r() + r() + r() - 1.5) / 1.5, larg = 70 * (0.55 + 0.45 * Math.abs(Math.sin(Math.PI * t)));
		const yy = y + gauss * larg, xx = x + (r() - 0.5) * 24;
		const raio = 0.5 + Math.pow(r(), 3) * 2.2;
		g += `<circle cx="${f(xx)}" cy="${f(yy)}" r="${f(raio)}" fill="${cor(t)}" opacity="${f(0.3 + r() * 0.65)}"/>`;
	}
	// Nós de luz ao longo do rio.
	for (let i = 0; i < 26; i++) {
		const t = 0.04 + r() * 0.92, [x, y] = curva(t), yy = y + (r() - 0.5) * 50;
		if (x > 560 && x < 1240 && yy > 170 && yy < 360) continue;
		g += `<circle cx="${f(x)}" cy="${f(yy)}" r="${f(6 + r() * 8)}" fill="url(#faisca)"/><circle cx="${f(x)}" cy="${f(yy)}" r="${f(1.4 + r())}" fill="${p.marfim}"/>`;
	}
	// Constelações nos cantos.
	[[70, 50, 0, 1.15], [1500, 360, 1, 1.1], [1180, 40, 2, 0.95], [150, 380, 3, 0.9]].forEach(([x, y, i, e], k) => (g += constelacao({ linha: p.acento }, FIGURAS[i], x, y, e, 711 + k)));
	// Estrelas de quatro pontas, como a do logo.
	const quatro = (x, y, s) => `<circle cx="${x}" cy="${y}" r="${f(s * 2.4)}" fill="url(#faisca)"/><path d="M ${x} ${f(y - s)} Q ${f(x + s * 0.16)} ${f(y - s * 0.16)} ${f(x + s)} ${y} Q ${f(x + s * 0.16)} ${f(y + s * 0.16)} ${x} ${f(y + s)} Q ${f(x - s * 0.16)} ${f(y + s * 0.16)} ${f(x - s)} ${y} Q ${f(x - s * 0.16)} ${f(y - s * 0.16)} ${x} ${f(y - s)} Z" fill="${p.marfim}"/>`;
	for (const [x, y, s] of [[300, 120, 16], [520, 440, 11], [1320, 420, 13], [1620, 90, 20], [1050, 70, 9], [80, 260, 10], [1740, 300, 12]]) g += quatro(x, y, s);
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
// Cada capa sai com o nome do tema e do modo: capa-<tema>-<modo>.svg. A esfera do Astrolábio e a rosa dos ventos do Mapa
// saem em arquivos à parte (esfera-*.svg e rosa-*.svg), porque se mexem por cima da capa.
for (const [nome, paleta] of SAIDAS) {
	const p = PALETAS[paleta];
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${ARTES[nome](p)}</svg>
`;
	fs.writeFileSync(`public/temas/capa-${paleta}.svg`, svg);
	if (nome === 'armilar') fs.writeFileSync(`public/temas/esfera-${paleta}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ESFERA.cx - 400} ${ESFERA.cy - 400} 800 800">${esferaArmilar(p)}</svg>\n`);
	if (nome === 'mapa') fs.writeFileSync(`public/temas/rosa-${paleta}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-82 -82 164 164">${rosaDosVentos(p)}</svg>\n`);
	console.log(nome, paleta, svg.length);
}

// Máscaras de partículas para as animações (brancas: a cor vem do CSS de cada tema e paleta). Cada uma é um ladrilho
// que se repete sem emenda, para a camada poder deslizar em loop só com transform.
const PARTICULAS = {
	poeira: { t: 320, n: 26, forma: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f(0.6 + r() * 1.5)}" opacity="${f(0.35 + r() * 0.65)}"/>` },
	vagalumes: { t: 420, n: 9, forma: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f(5 + r() * 5)}" fill="url(#halo)"/><circle cx="${x}" cy="${y}" r="1.6"/>` },
	brasas: { t: 300, n: 18, forma: (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${f(0.8 + r() * 1.2)}" ry="${f(2 + r() * 3)}" opacity="${f(0.45 + r() * 0.55)}"/>` },
	bolhas: { t: 340, n: 12, forma: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f(2 + r() * 5)}" fill="none" stroke="#fff" stroke-width="1.2" opacity="${f(0.45 + r() * 0.5)}"/>` },
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

// O selo da capa do Grimório, no metal de cada paleta.
const seloDourado = fs.readFileSync('public/temas/selo-dourado.svg', 'utf8');
for (const cor of CORES.grimorio.slice(1)) fs.writeFileSync(`public/temas/selo-grimorio-${cor}.svg`, seloDourado.split('#d9b47a').join(ornamentoFantasia('grimorio', cor).canto));

// Observatório e Codex: o anel do astrolábio e as estrelas da capa, recoloridos em cada paleta.
const pecas = Object.fromEntries(['astrolabio-anel-dourado', 'astrolabio-anel-tinta', 'estrelas-douradas', 'estrelas-tinta'].map((n) => [n, fs.readFileSync(`public/temas/${n}.svg`, 'utf8')]));
const recolorir = (peca, de, para, arquivo) => fs.writeFileSync(`public/temas/${arquivo}.svg`, pecas[peca].split(de).join(para));
for (const cor of CORES.observatorio.slice(1)) {
	const e = capaAstra('observatorio', cor, 'escuro'), cl = capaAstra('observatorio', cor, 'claro');
	recolorir('astrolabio-anel-dourado', '#d9b47a', e.anel, `anel-observatorio-${cor}-escuro`);
	recolorir('astrolabio-anel-tinta', '#1b2a3e', cl.anel, `anel-observatorio-${cor}-claro`);
	recolorir('estrelas-douradas', '#e3c38f', e.estrelas, `estrelas-observatorio-${cor}`);
}
for (const cor of CORES.codex.slice(1)) {
	const e = capaAstra('codex', cor, 'escuro'), cl = capaAstra('codex', cor, 'claro');
	recolorir('astrolabio-anel-dourado', '#d9b47a', e.anel, `anel-codex-${cor}-escuro`);
	recolorir('astrolabio-anel-tinta', '#1b2a3e', cl.anel, `anel-codex-${cor}-claro`);
	recolorir('estrelas-douradas', '#e3c38f', e.estrelas, `estrelas-codex-${cor}-escuro`);
	recolorir('estrelas-tinta', '#1b2a3e', cl.estrelas, `estrelas-codex-${cor}-claro`);
}
