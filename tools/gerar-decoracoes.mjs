// Gera as peças dos objetos de canto, das camadas de cintilação e das partículas que sobem, em public/temas/deco/.
// Todas são máscaras brancas: a cor vem do CSS de cada tema e paleta (animacoes.css). Cada objeto é dividido em peças,
// para cada uma girar, balançar ou cintilar no seu ritmo, sempre como camada que a placa de vídeo só move.
// Uso: node tools/gerar-decoracoes.mjs
import fs from 'node:fs';

const DIR = 'public/temas/deco';
fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });

const f = (n) => Math.round(n * 10) / 10;
function sorteio(semente) {
	let s = semente;
	return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const HALO = '<defs><radialGradient id="h"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
const salvar = (nome, corpo, vb = '0 0 400 400') => fs.writeFileSync(`${DIR}/${nome}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="none" stroke="#fff">${corpo}</svg>\n`);
const circ = (r, w, extra = '') => `<circle cx="200" cy="200" r="${r}" stroke-width="${w}" ${extra}/>`;
const polar = (r, a) => [200 + Math.cos(a) * r, 200 + Math.sin(a) * r];

// Runas do Futhark antigo em traços (24 glifos num quadro de 20 x 34), sem depender de fonte.
const RUNAS = ['M6 0V34M6 6L18 0M6 14L18 8', 'M4 34V0L16 10V34', 'M6 0V34M6 10L16 17L6 24', 'M6 0V34M6 6L16 12M6 14L16 20', 'M6 34V0L16 8L6 16L16 34', 'M16 4L6 17L16 30', 'M2 2L18 32M18 2L2 32', 'M6 34V0L16 8L6 16', 'M4 0V34M16 0V34M4 12L16 22', 'M10 0V34M4 12L16 22', 'M10 0V34', 'M8 4L2 12L8 20M12 14L18 22L12 30', 'M10 0V34M10 0L16 6M10 34L4 28', 'M4 0V34M4 0L12 8M4 34L12 26', 'M10 0V34M10 12L2 2M10 12L18 2', 'M14 0L4 12L16 22L6 34', 'M10 0V34M10 0L2 10M10 0L18 10', 'M5 0V34M5 0L15 8L5 17L15 26L5 34', 'M3 34V0L10 10L17 0V34', 'M3 34V0L17 14M17 34V0L3 14', 'M6 0V34M6 0L16 10', 'M10 0L18 10L10 20L2 10Z', 'M2 0V34L18 0V34L2 0', 'M10 0L18 10L10 20L2 10ZM2 34L10 20L18 34'];
// Anel de runas: as 24 em volta do centro, separadas em três grupos (para cintilarem alternados).
function anelDeRunas(raio, escala, grupo) {
	let g = '';
	for (let i = 0; i < 24; i++) {
		if (grupo !== undefined && i % 3 !== grupo) continue;
		const a = (i / 24) * Math.PI * 2 - Math.PI / 2, [x, y] = polar(raio, a);
		g += `<path d="${RUNAS[i]}" transform="translate(${f(x)} ${f(y)}) rotate(${f((i / 24) * 360)}) scale(${escala}) translate(-10 -17)" stroke-width="${f(2.2 / escala)}" stroke-linecap="round" stroke-linejoin="round"/>`;
	}
	return g;
}

// ---- Constelação: uma constelação que se liga traço por traço (estrelas, halos e três grupos de linhas) ----
{
	const E = [[50, 120, 5], [105, 95, 4], [160, 110, 4.5], [205, 150, 6], [195, 215, 4], [265, 240, 5], [275, 170, 4.5]];
	const LIGACOES = [[[0, 1], [1, 2]], [[2, 3], [3, 4]], [[4, 5], [5, 6], [6, 3]]];
	// Cada traço para um pouco antes da estrela, para não encostar nela.
	const traco = ([i, j]) => {
		const [x1, y1, r1] = E[i], [x2, y2, r2] = E[j], d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d, g1 = r1 + 7, g2 = r2 + 7;
		return `<line x1="${f(x1 + ux * g1)}" y1="${f(y1 + uy * g1)}" x2="${f(x2 - ux * g2)}" y2="${f(y2 - uy * g2)}" stroke-width="1.3" stroke-linecap="round"/>`;
	};
	LIGACOES.forEach((grupo, k) => salvar(`ceu-linhas-${k + 1}`, grupo.map(traco).join('')));
	salvar('ceu-halos', HALO + E.map(([x, y, s]) => `<circle cx="${x}" cy="${y}" r="${f(s * 4.5)}" fill="url(#h)" stroke="none"/>`).join(''));
	const r = sorteio(57);
	let poeira = '';
	for (let i = 0; i < 26; i++) poeira += `<circle cx="${f(20 + r() * 280)}" cy="${f(40 + r() * 250)}" r="${f(0.7 + r() * 1.1)}" fill="#fff" stroke="none" opacity="${f(0.3 + r() * 0.5)}"/>`;
	salvar('ceu-estrelas', poeira + E.map(([x, y, s]) => `<circle cx="${x}" cy="${y}" r="${f(s * 0.55)}" fill="#fff" stroke="none"/>`).join(''));
}

// ---- Ícone dos títulos do Observatório e do Astrolábio, desenhado para 24 px (o astrolábio inteiro virava mancha) ----
salvar('icone-astro', '<circle cx="12" cy="12" r="10" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke-width="1.2" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="2.2" fill="#fff" stroke="none"/>', '0 0 24 24');

// ---- Observatório e Codex: astrolábio em peças (limbo, rede, círculos e a estrela do centro) ----
{
	let marcas = '';
	for (let g = 0; g < 360; g += 5) { const a = (g * Math.PI) / 180, r1 = g % 30 === 0 ? 176 : g % 15 === 0 ? 184 : 189, [x1, y1] = polar(r1, a), [x2, y2] = polar(194, a); marcas += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width=".9"/>`; }
	salvar('astro-limbo', circ(196, 1.4) + circ(172, 0.8) + marcas);
	let raios = '';
	for (let g = 0; g < 360; g += 30) { const a = (g * Math.PI) / 180, [x1, y1] = polar(60, a), [x2, y2] = polar(150, a); raios += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width=".5" opacity=".7"/>`; }
	salvar('astro-rede', `<ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".8" transform="rotate(-24 200 200)"/><ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".6" transform="rotate(38 200 200)" opacity=".8"/>${raios}`);
	salvar('astro-circulos', circ(150, 0.7, 'stroke-dasharray="2 6"') + circ(104, 1.1) + `<circle cx="${f(polar(104, 0.4)[0])}" cy="${f(polar(104, 0.4)[1])}" r="3.5" fill="#fff" stroke="none"/>`);
	// O centro é um sol gravado (disco, anel e raios curtos), não uma estrela de quatro pontas.
	let sol = '<circle cx="200" cy="200" r="13" fill="#fff" stroke="none"/>' + circ(22, 2);
	for (let k = 0; k < 16; k++) { const a = (k * Math.PI) / 8, [x1, y1] = polar(k % 2 ? 32 : 30, a), [x2, y2] = polar(k % 2 ? 40 : 48, a); sol += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="2"/>`; }
	salvar('astro-estrela', sol);
	// No banner, o anel (sem a estrela) em duas peças que giram em sentidos opostos.
	salvar('anel-externo', circ(196, 1.4) + circ(172, 0.8) + marcas + circ(150, 0.7, 'stroke-dasharray="2 6"'));
	salvar('anel-interno', `<ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".8" transform="rotate(-24 200 200)"/><ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".6" transform="rotate(38 200 200)" opacity=".8"/>${raios}` + circ(104, 1.1));
}

// ---- Astrolábio: esfera armilar em peças que balançam em ritmos diferentes ----
{
	const R = 300, Ri = R - 24, c = 400, inc = -23.5;
	const el = (rx, ry, rot, w, op = 1, cx = c, cy = c) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${rot} ${f(cx)} ${f(cy)})" stroke-width="${w}" opacity="${op}"/>`;
	let marcas = '';
	for (let a = 0; a < 360; a += 2.5) { const t = (a * Math.PI) / 180, l = a % 15 === 0 ? 24 : 10; marcas += `<line x1="${f(c + Math.cos(t) * R)}" y1="${f(c + Math.sin(t) * R)}" x2="${f(c + Math.cos(t) * (R - l))}" y2="${f(c + Math.sin(t) * (R - l))}" stroke-width="${a % 15 ? 0.8 : 1.4}"/>`; }
	const vb = '0 0 800 800';
	salvar('armilar-meridiano', `<circle cx="${c}" cy="${c}" r="${R}" stroke-width="2.2"/><circle cx="${c}" cy="${c}" r="${Ri}" stroke-width="1.3"/>${marcas}`, vb);
	salvar('armilar-horizonte', el(R + 46, 74, 0, 2.2) + el(R + 34, 64, 0, 1, 0.7), vb);
	const tr = (s) => { const t = (inc * Math.PI) / 180, d = s * Ri * 0.42; return [c - Math.sin(t) * d, c + Math.cos(t) * d]; };
	salvar('armilar-equador', el(Ri, Ri * 0.36, inc, 1.8) + [-1, 1].map((s) => el(Ri * 0.9, Ri * 0.9 * 0.36, inc, 1, 0.6, ...tr(s))).join('') + el(Ri * 0.34, Ri, inc, 1.2, 0.75), vb);
	salvar('armilar-ecliptica', el(Ri, Ri * 0.5, 18, 1.6) + el(Ri - 16, (Ri - 16) * 0.5, 18, 1, 0.75), vb);
	const t = (inc * Math.PI) / 180, L = R + 70, ax = [c - Math.sin(t) * L, c + Math.cos(t) * L, c + Math.sin(t) * L, c - Math.cos(t) * L];
	salvar('armilar-eixo', `<line x1="${f(ax[0])}" y1="${f(ax[1])}" x2="${f(ax[2])}" y2="${f(ax[3])}" stroke-width="1.8"/><circle cx="${f(ax[0])}" cy="${f(ax[1])}" r="7" fill="#fff" stroke="none"/><circle cx="${f(ax[2])}" cy="${f(ax[3])}" r="7" fill="#fff" stroke="none"/><circle cx="${c}" cy="${c}" r="46" stroke-width="1.8"/><circle cx="${c}" cy="${c}" r="28" stroke-width="2"/><ellipse cx="${c}" cy="${c}" rx="11" ry="28" stroke-width="1.4"/><line x1="${c - 28}" y1="${c}" x2="${c + 28}" y2="${c}" stroke-width="1.4"/>`, vb);
}

// ---- Nebulosa: galáxia espiral (braços que giram, núcleo que pulsa). Os braços são faixas de luz desfocadas ao longo
// de uma espiral, com poucas estrelas por cima: sem a poeira de pontinhos, que parecia sujeira e pesava ----
{
	const espiral = (b, braco, t0, t1) => {
		let d = '';
		for (let t = t0; t <= t1; t += 0.08) { const [x, y] = polar(18 + 52 * t, t * 1.25 + (b * Math.PI * 2) / braco); d += `${d ? ' L' : 'M'} ${f(x)} ${f(y)}`; }
		return d;
	};
	const bracos = (semente, braco, larg, borrao, nEstrelas) => {
		const r = sorteio(semente);
		let g = `<defs><filter id="b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${borrao}"/></filter></defs><g filter="url(#b)" stroke-linecap="round">`;
		// Camadas sobrepostas cada vez mais longas e finas: o braço é largo perto do núcleo e afina até a ponta.
		for (let b = 0; b < braco; b++) for (const [t1, w, op] of [[1.4, 1, 0.35], [2.3, 0.65, 0.35], [3.3, 0.32, 0.45]]) g += `<path d="${espiral(b, braco, 0.1, t1)}" stroke-width="${f(larg * w)}" opacity="${op}"/>`;
		g += '</g>';
		for (let i = 0; i < nEstrelas; i++) {
			const b = Math.floor(r() * braco), t = r() * 3.2, raio = 18 + 52 * t + (r() - 0.5) * larg, [x, y] = polar(raio, t * 1.25 + (b * Math.PI * 2) / braco);
			if (raio < 190) g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + Math.pow(r(), 3) * 2)}" fill="#fff" stroke="none" opacity="${f(0.5 + r() * 0.5)}"/>`;
		}
		return g;
	};
	salvar('espiral-bracos', bracos(41, 2, 34, 9, 40));
	salvar('espiral-poeira', bracos(43, 3, 60, 18, 0));
	salvar('espiral-nucleo', `${HALO}<circle cx="200" cy="200" r="90" fill="url(#h)" stroke="none"/><circle cx="200" cy="200" r="5" fill="#fff" stroke="none"/>`);
}

// ---- Grimório e Holograma: selo rúnico (base que gira e três grupos de runas que cintilam) ----
salvar('selo-base', circ(190, 1) + circ(182, 0.5) + circ(148, 1, 'stroke-dasharray="1 5"') + '<rect x="96" y="96" width="208" height="208" stroke-width=".9"/><rect x="96" y="96" width="208" height="208" stroke-width=".9" transform="rotate(45 200 200)"/>' + circ(70, 0.8));
for (const k of [0, 1, 2]) salvar(`selo-runas-${k + 1}`, anelDeRunas(166, 0.55, k));

// ---- Forja: bigorna com um anel rúnico em volta ----
// A bigorna em traço gravado (chapada parecia ícone): contorno, filete de brilho na face e o chifre.
salvar('forja-bigorna', '<path stroke-width="3" stroke-linejoin="round" d="M 104 178 H 300 C 300 196 284 204 262 206 L 246 214 V 236 H 270 V 256 H 130 V 236 H 154 V 214 L 138 206 C 120 204 96 196 104 178 Z M 104 178 C 80 176 64 168 58 158 C 76 160 96 168 104 178"/><line x1="116" y1="186" x2="288" y2="186" stroke-width="1.4" opacity=".7"/><line x1="154" y1="236" x2="246" y2="236" stroke-width="1.4" opacity=".6"/>');
salvar('forja-anel', circ(192, 1.4) + circ(140, 1.2) + circ(186, 0.6, 'stroke-dasharray="2 6"'));
for (const k of [0, 1, 2]) salvar(`forja-runas-${k + 1}`, anelDeRunas(164, 0.62, k));

// ---- Mapa: bússola (corpo parado e agulha que oscila) ----
{
	let corpo = circ(196, 3) + circ(184, 1) + circ(150, 1.2) + circ(60, 1);
	for (let g = 0; g < 360; g += 5) { const a = (g * Math.PI) / 180, [x1, y1] = polar(g % 45 ? 176 : 164, a), [x2, y2] = polar(184, a); corpo += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="${g % 45 ? 0.8 : 1.6}"/>`; }
	for (const [l, g] of [['N', -90], ['L', 0], ['S', 90], ['O', 180]]) { const [x, y] = polar(122, (g * Math.PI) / 180); corpo += `<text x="${f(x)}" y="${f(y)}" font-family="Georgia, 'Times New Roman', serif" font-size="30" text-anchor="middle" dominant-baseline="central" fill="#fff" stroke="none">${l}</text>`; }
	for (const g of [45, 135, 225, 315]) corpo += `<path d="M 200 200 L ${polar(140, (g * Math.PI) / 180).map(f).join(' ')}" stroke-width=".8" opacity=".6"/>`;
	salvar('bussola-corpo', corpo);
	salvar('bussola-agulha', '<path d="M 200 62 L 214 200 L 200 338 L 186 200 Z" stroke-width="2"/><path d="M 200 62 L 214 200 L 186 200 Z" fill="#fff" stroke="none"/><circle cx="200" cy="200" r="9" fill="#fff" stroke="none"/>');
}

// ---- Abissal: água-viva (sino e tentáculos, que se mexem separados; os dois no mesmo quadro, para ficarem alinhados).
// Sino translúcido, mais denso na borda, e tentáculos finos que somem no fim, como na capa. ----
salvar('medusa-sino', `<defs><radialGradient id="h"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><radialGradient id="sino" cx="50%" cy="90%" r="85%"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".7" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></radialGradient></defs><circle cx="200" cy="140" r="150" fill="url(#h)" stroke="none" opacity=".6"/><path d="M 92 172 C 88 100 130 56 200 56 C 270 56 312 100 308 172 Q 282 184 256 174 Q 228 188 200 176 Q 172 188 144 174 Q 118 184 92 172 Z" fill="url(#sino)" stroke="none"/>`, '0 0 400 600');
{
	let t = '<defs><linearGradient id="fio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
	for (const [x, a, l] of [[112, 14, 330], [140, -10, 380], [168, 12, 350], [232, -12, 360], [260, 10, 390], [288, -14, 320]]) t += `<path d="M ${x} 176 q ${a} ${l / 6} 0 ${l / 3} t 0 ${l / 3} t 0 ${l / 3}" stroke="url(#fio)" stroke-width="1.6"/>`;
	t += '<path d="M 188 178 q 22 50 0 100 t 4 90" stroke-width="4" stroke-linecap="round" opacity=".3"/><path d="M 212 178 q -22 50 0 100 t -4 90" stroke-width="4" stroke-linecap="round" opacity=".3"/>';
	salvar('medusa-tentaculos', t, '0 0 400 600');
}

// ---- Radar: anéis, mira e alvos (o feixe é um gradiente cônico do CSS) ----
{
	let g = circ(70, 1.6) + circ(140, 1.6) + circ(196, 2) + '<line x1="4" y1="200" x2="396" y2="200" stroke-width="1.2"/><line x1="200" y1="4" x2="200" y2="396" stroke-width="1.2"/>';
	for (let a = 0; a < 360; a += 10) { const t = (a * Math.PI) / 180, l = a % 30 ? 8 : 18, [x1, y1] = polar(196 - l, t), [x2, y2] = polar(196, t); g += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="1.6"/>`; }
	salvar('radar-aneis', g);
	salvar('radar-alvos', [[120, 140], [270, 110], [250, 290]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="none"/><circle cx="${x}" cy="${y}" r="13" stroke-width="1.4"/>`).join(''));
}

// ---- Circuito: processador parado, com trilhas e núcleo que pulsam ----
{
	let trilhas = '';
	for (let k = 0; k < 7; k++) {
		const c = 140 + k * 20, d = 10 + k * 8;
		trilhas += `<path d="M ${c} 120 V ${90 - d} M 280 ${c} H ${310 + d} M ${c} 280 L ${c + (k - 3) * 14} ${330 + d} M 120 ${c} L ${90 - d} ${c + (3 - k) * 10}" stroke-width="2.4"/>`;
		trilhas += `<circle cx="${c}" cy="${90 - d}" r="4" fill="#fff" stroke="none"/><circle cx="${310 + d}" cy="${c}" r="4" fill="#fff" stroke="none"/>`;
	}
	let pinos = '';
	for (let k = 0; k < 7; k++) { const c = 140 + k * 20; pinos += `<line x1="${c}" y1="120" x2="${c}" y2="104"/><line x1="${c}" y1="280" x2="${c}" y2="296"/><line x1="120" y1="${c}" x2="104" y2="${c}"/><line x1="280" y1="${c}" x2="296" y2="${c}"/>`; }
	salvar('chip-corpo', `<rect x="120" y="120" width="160" height="160" rx="10" stroke-width="3"/><rect x="150" y="150" width="100" height="100" rx="4" stroke-width="1.6"/><g stroke-width="3">${pinos}</g>${trilhas}`);
	salvar('chip-trilhas', trilhas);
	salvar('chip-nucleo', `${HALO}<circle cx="200" cy="200" r="110" fill="url(#h)" stroke="none" opacity=".6"/><rect x="160" y="160" width="80" height="80" rx="4" fill="#fff" stroke="none" opacity=".85"/>`);
}

// ---- Navegação: planeta de pé e uma órbita com satélite (a órbita gira dentro de um plano achatado) ----
{
	let p = circ(150, 2.4);
	for (let k = -3; k <= 3; k++) { const y = 200 + k * 38, rx = Math.sqrt(150 * 150 - (k * 38) ** 2); p += `<ellipse cx="200" cy="${y}" rx="${f(rx)}" ry="${f(rx * 0.16)}" stroke-width="1.2" opacity=".7"/>`; }
	for (const k of [1, 2, 3]) p += `<ellipse cx="200" cy="200" rx="${f(150 * Math.cos((k * Math.PI) / 8))}" ry="150" stroke-width="1.2" opacity=".7"/>`;
	salvar('planeta', p);
	salvar('orbita', circ(190, 2, 'stroke-dasharray="10 12"') + `<circle cx="390" cy="200" r="9" fill="#fff" stroke="none"/><circle cx="10" cy="200" r="5" fill="#fff" stroke="none" opacity=".7"/>`);
}

// ---- Vitral: rosácea (pedra parada, dois grupos de vidro que acendem alternados) ----
{
	const R = 190, petalas = (grupo) => Array.from({ length: 12 }, (_, k) => k).filter((k) => k % 2 === grupo).map((k) => { const [x, y] = polar(R * 0.62, (k * Math.PI) / 6); return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(R * 0.28)}" fill="#fff" stroke="none"/>`; }).join('');
	let pedra = circ(R + 6, 8) + circ(R * 0.28, 6);
	for (let k = 0; k < 12; k++) { const [x, y] = polar(R * 0.62, (k * Math.PI) / 6); pedra += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(R * 0.28)}" stroke-width="5"/>`; const [a, b] = polar(R, (k * Math.PI) / 6 + Math.PI / 12); pedra += `<line x1="200" y1="200" x2="${f(a)}" y2="${f(b)}" stroke-width="4"/>`; }
	salvar('rosacea-pedra', pedra);
	salvar('rosacea-vidro-1', petalas(0) + `<circle cx="200" cy="200" r="${f(R * 0.26)}" fill="#fff" stroke="none"/>`);
	salvar('rosacea-vidro-2', petalas(1));
}

// ---- Estrelas que cintilam (três camadas esparsas, em ladrilhos de tamanhos diferentes) ----
for (const [k, t, n] of [[1, 290, 9], [2, 410, 12], [3, 530, 14]]) {
	const r = sorteio(1000 + k);
	let g = '';
	for (let i = 0; i < n; i++) {
		const x = f(6 + r() * (t - 12)), y = f(6 + r() * (t - 12)), s = 0.8 + r() * 1.4;
		// Uma em cada quatro é mais forte, com halo; todas redondas, como estrela de verdade.
		g += (r() < 0.25 ? `<circle cx="${x}" cy="${y}" r="${f(s * 5)}" fill="url(#h)" opacity=".6"/>` : '') + `<circle cx="${x}" cy="${y}" r="${f(s)}" fill="#fff" stroke="none"/>`;
	}
	fs.writeFileSync(`${DIR}/estrelas-${k}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">${HALO}${g}</svg>\n`);
}

// ---- Partículas macias que sobem do pé da página (já desfocadas no desenho, sem filtro no navegador) ----
for (const [nome, t, n, forma] of [
	['poeira', 300, 14, (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f(4 + r() * 4)}" fill="url(#h)"/>`],
	['vagalumes', 360, 8, (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f(8 + r() * 6)}" fill="url(#h)"/><circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`],
	['brasas', 280, 12, (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${f(3 + r() * 2)}" ry="${f(6 + r() * 4)}" fill="url(#h)"/><circle cx="${x}" cy="${y}" r="1.4" fill="#fff"/>`],
	['bolhas', 320, 10, (x, y, r) => { const s = f(3 + r() * 6); return `<circle cx="${x}" cy="${y}" r="${s}" fill="none" stroke="#fff" stroke-width="1.4" opacity=".8"/><circle cx="${f(x - s * 0.35)}" cy="${f(y - s * 0.35)}" r="${f(s * 0.25)}" fill="#fff"/>`; }],
	['luzes', 360, 9, (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f(8 + r() * 10)}" fill="url(#h)"/>`],
]) {
	const r = sorteio(2000 + t);
	let g = '';
	for (let i = 0; i < n; i++) g += forma(f(10 + r() * (t - 20)), f(10 + r() * (t - 20)), r);
	fs.writeFileSync(`${DIR}/sobe-${nome}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">${HALO}${g}</svg>\n`);
}

console.log(fs.readdirSync(DIR).length, 'peças em', DIR);
