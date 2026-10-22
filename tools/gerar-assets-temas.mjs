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

// Campos largos, de 1200 px, para o fundo das páginas dos temas Astra: no ladrilho de 600 px o mesmo desenho de estrelas
// voltava a cada 600 px e se via a grade na tela. Mesma densidade, quatro vezes a área; a cor vai na raiz e as estrelas
// vão agrupadas pela opacidade, para o arquivo ficar enxuto.
function campoLargo(nome, { tam = 1200, n, cor, seed, brilho = 0.9 }) {
	const r = rng(seed), grupos = new Map();
	let cruzes = '';
	for (let i = 0; i < n; i++) {
		const x = r() * tam, y = r() * tam;
		const raio = r() < 0.92 ? 0.35 + r() * 0.7 : 1.1 + r() * 0.9;
		const op = Math.round((0.25 + r() * brilho * 0.75) * 10) / 10;
		let e = '';
		for (const dx of [0, -tam, tam]) for (const dy of [0, -tam, tam]) {
			const cx = x + dx, cy = y + dy;
			if (cx < -3 || cx > tam + 3 || cy < -3 || cy > tam + 3) continue;
			e += `<circle cx="${Math.round(cx * 10) / 10}" cy="${Math.round(cy * 10) / 10}" r="${Math.round(raio * 100) / 100}"/>`;
		}
		grupos.set(op, (grupos.get(op) || '') + e);
		if (raio > 1.5) cruzes += `<path d="M${f(x - 4)} ${f(y)}H${f(x + 4)}M${f(x)} ${f(y - 4)}V${f(y + 4)}" opacity="${f(op * 0.6)}"/>`;
	}
	const g = [...grupos].map(([o, e]) => `<g opacity="${o}">${e}</g>`).join('');
	salvar(nome, `<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}" viewBox="0 0 ${tam} ${tam}" fill="${cor}">${g}<g fill="none" stroke="${cor}" stroke-width=".4">${cruzes}</g></svg>`);
}
campoLargo('estrelas-claras-largo.svg', { cor: '#f8f3e7', n: 680, seed: 7 });
campoLargo('estrelas-douradas-largo.svg', { cor: '#e3c38f', n: 440, seed: 21 });
campoLargo('estrelas-tinta-largo.svg', { cor: '#1b2a3e', n: 360, seed: 33, brilho: 0.5 });

// Constelação para títulos e cantos.
function constelacao(nome, cor) {
	const pts = [[10, 60], [62, 34], [118, 48], [170, 18], [226, 40], [282, 22], [340, 52], [392, 30]];
	const linhas = pts.slice(1).map((p, i) => `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${p[0]}" y2="${p[1]}"/>`).join('');
	const nos = pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 1 ? 3 : 1.8}"/>`).join('');
	salvar(nome, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 402 70" fill="${cor}" stroke="${cor}"><g stroke-width=".8" opacity=".55">${linhas}</g><g stroke="none">${nos}</g></svg>`);
}
constelacao('constelacao-dourada.svg', '#e3c38f');
constelacao('constelacao-tinta.svg', '#1b2a3e');

// O astrolábio do Observatório e a volvela do Codex são peças animadas, em máscara branca, de tools/gerar-decoracoes.mjs
// (obs-* e codex-*): cada tema tem o seu desenho, e a cor vem do CSS de cada paleta.

// Grade de HUD: hexágonos finos.
salvar('grade-hex.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="97" viewBox="0 0 56 97" fill="none" stroke="#7ee7ff" stroke-width=".6" opacity=".22">
<path d="M28 0 L56 16.2 V48.5 L28 64.7 L0 48.5 V16.2 Z M28 64.7 V97 M0 97 L0 80.8 L28 97 L56 80.8 V97"/></svg>`);

// Círculo rúnico (o selo do Holograma). As runas são traços, não texto: num SVG usado como imagem, uma fonte com runas
// pode faltar no sistema e virar quadradinhos.
const RUNAS = ['M6 0V34M6 6L18 0M6 14L18 8', 'M4 34V0L16 10V34', 'M6 0V34M6 10L16 17L6 24', 'M6 0V34M6 6L16 12M6 14L16 20', 'M6 34V0L16 8L6 16L16 34', 'M16 4L6 17L16 30', 'M2 2L18 32M18 2L2 32', 'M6 34V0L16 8L6 16', 'M4 0V34M16 0V34M4 12L16 22', 'M10 0V34M4 12L16 22', 'M10 0V34', 'M8 4L2 12L8 20M12 14L18 22L12 30', 'M10 0V34M10 0L16 6M10 34L4 28', 'M4 0V34M4 0L12 8M4 34L12 26', 'M10 0V34M10 12L2 2M10 12L18 2', 'M14 0L4 12L16 22L6 34', 'M10 0V34M10 0L2 10M10 0L18 10', 'M5 0V34M5 0L15 8L5 17L15 26L5 34', 'M3 34V0L10 10L17 0V34', 'M3 34V0L17 14M17 34V0L3 14', 'M6 0V34M6 0L16 10', 'M10 0L18 10L10 20L2 10Z', 'M2 0V34L18 0V34L2 0', 'M10 0L18 10L10 20L2 10ZM2 34L10 20L18 34'];
function selo(nome, cor) {
	let runas = '';
	for (let i = 0; i < 24; i++) {
		const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
		const x = 200 + Math.cos(a) * 166, y = 200 + Math.sin(a) * 166;
		runas += `<path d="${RUNAS[i]}" transform="translate(${f(x)} ${f(y)}) rotate(${f((i / 24) * 360)}) scale(.55) translate(-10 -17)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
	}
	salvar(nome, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" stroke="${cor}">
<circle cx="200" cy="200" r="190" stroke-width="1"/><circle cx="200" cy="200" r="182" stroke-width=".5"/>
<circle cx="200" cy="200" r="148" stroke-width="1" stroke-dasharray="1 5"/>
<rect x="96" y="96" width="208" height="208" stroke-width=".9"/><rect x="96" y="96" width="208" height="208" stroke-width=".9" transform="rotate(45 200 200)"/>
<circle cx="200" cy="200" r="70" stroke-width=".8"/>
<g>${runas}</g></svg>`);
}
selo('selo-ciano.svg', '#7ee7ff');

// Textura de pergaminho (ruído fractal), em tom claro. A região do filtro é o próprio ladrilho (x/y 0, 100%): com a
// sobra padrão de 10%, o "stitch" emendava a região maior e o ladrilho ficava com costura a cada repetição.
salvar('pergaminho.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
<filter id="p" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="9" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 .55  0 0 0 0 .42  0 0 0 0 .25  0 0 0 .11 0"/></filter>
<filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" stitchTiles="stitch"/>
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

console.log('assets gerados em', OUT, fs.readdirSync(OUT).join(', '));

// Os quatro cantos do Grimório, a partir do mesmo desenho.
{
	const base = fs.readFileSync(path.join(OUT, 'canto-ouro.svg'), 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
	const cantos = { se: '', sd: 'translate(120 0) scale(-1 1)', ie: 'translate(0 120) scale(1 -1)', id: 'translate(120 120) scale(-1 -1)' };
	for (const [nome, t] of Object.entries(cantos)) {
		salvar(`canto-ouro-${nome}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="#a87b3a"><g transform="${t}">${base}</g></svg>`);
	}
}

// Couro: ruído escuro e quente para a capa. Ladrilho de 600 px com a região do filtro igual ao ladrilho, como as
// texturas de tools/gerar-ornamentos.mjs: sem costura e sem a mancha larga repetindo em grade.
salvar('couro.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
<filter id="c" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="4" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 .12  0 0 0 0 .07  0 0 0 0 .03  0 0 0 .35 0"/></filter>
<filter id="v" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="12" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 .05  0 0 0 0 .02  0 0 0 0 .01  0 0 0 .5 0"/></filter>
<rect width="100%" height="100%" filter="url(#v)"/><rect width="100%" height="100%" filter="url(#c)"/></svg>`);

// O logo como máscara, para temas que pintam o nome com gradiente (o Grimório o pinta em ouro, sem filtro de cor).
fs.copyFileSync('src/assets/marca/logo-star-stream.svg', path.join(OUT, 'logo-mascara.svg'));

// A névoa da capa da Nebulosa: a galáxia pequena já desfocada e saturada no arquivo. Com o desfoque no CSS, a camada
// (que deriva o tempo todo) era desfocada de novo a cada quadro; assim o navegador só a desloca. No CSS fica só o giro
// de matiz de cada paleta, que é barato.
{
	const { default: sharp } = await import('sharp');
	await sharp('public/galaxia-borrada.webp').blur(8).modulate({ saturation: 1.8 }).webp({ quality: 80 }).toFile(path.join(OUT, 'galaxia-nebulosa.webp'));
}
