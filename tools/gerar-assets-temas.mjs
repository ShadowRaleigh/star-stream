// Gera os SVGs decorativos dos temas visuais em public/temas/.
// Uso: node tools/gerar-assets-temas.mjs
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/temas';
fs.mkdirSync(OUT, { recursive: true });

// Gerador pseudoaleatório com semente, para o resultado não mudar entre execuções.
function rng(seed) {
	let s = seed >>> 0;
	return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const salvar = (nome, svg) => fs.writeFileSync(path.join(OUT, nome), svg.trim() + '\n');
const f = (n) => Math.round(n * 100) / 100;

// Campo de estrelas que repete sem emenda (as estrelas da borda são repetidas do outro lado).
function campoDeEstrelas(nome, { tam = 600, n = 170, cor = '#f8f3e7', seed = 7, brilho = 0.9 }) {
	const r = rng(seed);
	let estrelas = '';
	for (let i = 0; i < n; i++) {
		const x = r() * tam;
		const y = r() * tam;
		const raio = r() < 0.92 ? 0.35 + r() * 0.7 : 1.1 + r() * 0.9;
		const op = 0.25 + r() * brilho * 0.75;
		for (const dx of [0, -tam, tam]) for (const dy of [0, -tam, tam]) {
			const cx = x + dx, cy = y + dy;
			if (cx < -3 || cx > tam + 3 || cy < -3 || cy > tam + 3) continue;
			estrelas += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(raio)}" fill="${cor}" opacity="${f(op)}"/>`;
		}
		if (raio > 1.5) {
			const c = (dx = 0) => `<path d="M${f(x - 4)} ${f(y)}H${f(x + 4)}M${f(x)} ${f(y - 4)}V${f(y + 4)}" stroke="${cor}" stroke-width=".4" opacity="${f(op * 0.6)}"/>`;
			estrelas += c();
		}
	}
	salvar(nome, `<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}" viewBox="0 0 ${tam} ${tam}">${estrelas}</svg>`);
}
campoDeEstrelas('estrelas-claras.svg', { cor: '#f8f3e7' });
campoDeEstrelas('estrelas-douradas.svg', { cor: '#e3c38f', n: 110, seed: 21 });
campoDeEstrelas('estrelas-tinta.svg', { cor: '#1b2a3e', n: 90, seed: 33, brilho: 0.5 });

// Constelação para títulos e cantos.
function constelacao(nome, cor) {
	const pts = [[10, 60], [62, 34], [118, 48], [170, 18], [226, 40], [282, 22], [340, 52], [392, 30]];
	const linhas = pts.slice(1).map((p, i) => `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${p[0]}" y2="${p[1]}"/>`).join('');
	const nos = pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 1 ? 3 : 1.8}"/>`).join('');
	salvar(nome, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 402 70" fill="${cor}" stroke="${cor}"><g stroke-width=".8" opacity=".55">${linhas}</g><g stroke="none">${nos}</g></svg>`);
}
constelacao('constelacao-dourada.svg', '#e3c38f');
constelacao('constelacao-tinta.svg', '#1b2a3e');

// Astrolábio: anéis concêntricos com marcas de grau e uma estrela de quatro pontas.
function astrolabio(nome, cor) {
	let marcas = '';
	for (let g = 0; g < 360; g += 5) {
		const a = (g * Math.PI) / 180;
		const r1 = g % 30 === 0 ? 176 : g % 15 === 0 ? 184 : 189;
		marcas += `<line x1="${f(200 + Math.cos(a) * r1)}" y1="${f(200 + Math.sin(a) * r1)}" x2="${f(200 + Math.cos(a) * 194)}" y2="${f(200 + Math.sin(a) * 194)}"/>`;
	}
	let raios = '';
	for (let g = 0; g < 360; g += 30) {
		const a = (g * Math.PI) / 180;
		raios += `<line x1="${f(200 + Math.cos(a) * 60)}" y1="${f(200 + Math.sin(a) * 60)}" x2="${f(200 + Math.cos(a) * 150)}" y2="${f(200 + Math.sin(a) * 150)}"/>`;
	}
	salvar(nome, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" stroke="${cor}">
<circle cx="200" cy="200" r="196" stroke-width="1.4"/><circle cx="200" cy="200" r="172" stroke-width=".8"/>
<circle cx="200" cy="200" r="150" stroke-width=".6" stroke-dasharray="2 6"/><circle cx="200" cy="200" r="104" stroke-width="1"/>
<ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".7" transform="rotate(-24 200 200)"/>
<ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".5" transform="rotate(38 200 200)" opacity=".7"/>
<g stroke-width=".9">${marcas}</g><g stroke-width=".5" opacity=".6">${raios}</g>
<path d="M200 128 L210 190 L272 200 L210 210 L200 272 L190 210 L128 200 L190 190 Z" fill="${cor}" stroke="none" opacity=".9"/>
<circle cx="200" cy="200" r="7" fill="none" stroke-width="1.2"/></svg>`);
}
astrolabio('astrolabio-dourado.svg', '#d9b47a');
astrolabio('astrolabio-tinta.svg', '#1b2a3e');

// Grade de HUD: hexágonos finos.
salvar('grade-hex.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="97" viewBox="0 0 56 97" fill="none" stroke="#7ee7ff" stroke-width=".6" opacity=".22">
<path d="M28 0 L56 16.2 V48.5 L28 64.7 L0 48.5 V16.2 Z M28 64.7 V97 M0 97 L0 80.8 L28 97 L56 80.8 V97"/></svg>`);

// Círculo rúnico para o holograma (selo girando no fundo).
function selo(nome, cor) {
	const runas = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
	let txt = '';
	for (let i = 0; i < 24; i++) {
		const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
		const x = 200 + Math.cos(a) * 166, y = 200 + Math.sin(a) * 166;
		txt += `<text x="${f(x)}" y="${f(y)}" transform="rotate(${f((i / 24) * 360)} ${f(x)} ${f(y)})">${runas[i]}</text>`;
	}
	salvar(nome, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" stroke="${cor}">
<circle cx="200" cy="200" r="190" stroke-width="1"/><circle cx="200" cy="200" r="182" stroke-width=".5"/>
<circle cx="200" cy="200" r="148" stroke-width="1" stroke-dasharray="1 5"/>
<rect x="96" y="96" width="208" height="208" stroke-width=".9"/><rect x="96" y="96" width="208" height="208" stroke-width=".9" transform="rotate(45 200 200)"/>
<circle cx="200" cy="200" r="70" stroke-width=".8"/>
<g fill="${cor}" stroke="none" font-family="serif" font-size="20" text-anchor="middle" dominant-baseline="middle">${txt}</g></svg>`);
}
selo('selo-ciano.svg', '#7ee7ff');
selo('selo-dourado.svg', '#d9b47a');

// Textura de pergaminho (ruído fractal), em tom claro.
salvar('pergaminho.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
<filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="9" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 .55  0 0 0 0 .42  0 0 0 0 .25  0 0 0 .11 0"/></filter>
<filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .12  0 0 0 .07 0"/></filter>
<rect width="100%" height="100%" filter="url(#p)"/><rect width="100%" height="100%" filter="url(#g)"/></svg>`);

// Florão para separar seções.
function florao(nome, cor) {
	salvar(nome, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 24" fill="none" stroke="${cor}" stroke-width="1">
<path d="M0 12 H92 M148 12 H240" stroke-width=".8"/><path d="M92 12 C100 4 108 4 112 12 C108 20 100 20 92 12 Z M148 12 C140 4 132 4 128 12 C132 20 140 20 148 12 Z"/>
<path d="M120 2 L124 12 L120 22 L116 12 Z" fill="${cor}"/><circle cx="104" cy="12" r="1.4" fill="${cor}"/><circle cx="136" cy="12" r="1.4" fill="${cor}"/></svg>`);
}
florao('florao-dourado.svg', '#c9a46b');
florao('florao-tinta.svg', '#5b3a1e');

// Canto ornamental (para o Grimório e o Codex).
function canto(nome, cor) {
	salvar(nome, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="${cor}">
<path d="M4 116 V4 H116" stroke-width="1.6"/><path d="M12 116 V12 H116" stroke-width=".6"/>
<path d="M4 4 C30 10 40 20 44 44 C20 40 10 30 4 4 Z" fill="${cor}" fill-opacity=".14" stroke-width=".9"/>
<path d="M24 24 L58 58" stroke-width=".7"/><circle cx="62" cy="62" r="3" fill="${cor}"/>
<path d="M44 12 C52 22 56 18 62 12 M12 44 C22 52 18 56 12 62" stroke-width=".8"/>
<circle cx="76" cy="12" r="1.6" fill="${cor}"/><circle cx="12" cy="76" r="1.6" fill="${cor}"/></svg>`);
}
canto('canto-ouro.svg', '#a87b3a');
canto('canto-ciano.svg', '#7ee7ff');

// Moldura em ângulo para painéis de HUD.
salvar('estrela-4.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="#e3c38f"/></svg>`);

console.log('assets gerados em', OUT, fs.readdirSync(OUT).join(', '));
