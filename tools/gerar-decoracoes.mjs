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
const quatro = (x, y, s, extra = '') => `<path d="M ${x} ${f(y - s)} Q ${f(x + s * 0.16)} ${f(y - s * 0.16)} ${f(x + s)} ${y} Q ${f(x + s * 0.16)} ${f(y + s * 0.16)} ${x} ${f(y + s)} Q ${f(x - s * 0.16)} ${f(y + s * 0.16)} ${f(x - s)} ${y} Q ${f(x - s * 0.16)} ${f(y - s * 0.16)} ${x} ${f(y - s)} Z" fill="#fff" stroke="none" ${extra}/>`;
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

// ---- Constelação: estrela-guia com órbitas ----
salvar('guia-brilho', `${HALO}<circle cx="200" cy="200" r="130" fill="url(#h)" stroke="none"/>`);
salvar('guia-estrela', quatro(200, 200, 74) + quatro(200, 200, 30, 'transform="rotate(45 200 200)" opacity=".7"'));
salvar('guia-orbita-1', circ(118, 1.2) + quatro(...polar(118, -0.6).map(f), 9) + quatro(...polar(118, 2.4).map(f), 6));
salvar('guia-orbita-2', circ(158, 1, 'stroke-dasharray="3 9"') + `<circle cx="${f(polar(158, 1.2)[0])}" cy="${f(polar(158, 1.2)[1])}" r="5" fill="#fff" stroke="none"/>`);
salvar('guia-orbita-3', circ(192, 0.8, 'stroke-dasharray="1 6"') + quatro(...polar(192, 3.9).map(f), 8) + `<circle cx="${f(polar(192, 5.3)[0])}" cy="${f(polar(192, 5.3)[1])}" r="3" fill="#fff" stroke="none"/>`);

// ---- Observatório e Codex: astrolábio em peças (limbo, rede, círculos e a estrela do centro) ----
{
	let marcas = '';
	for (let g = 0; g < 360; g += 5) { const a = (g * Math.PI) / 180, r1 = g % 30 === 0 ? 176 : g % 15 === 0 ? 184 : 189, [x1, y1] = polar(r1, a), [x2, y2] = polar(194, a); marcas += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width=".9"/>`; }
	salvar('astro-limbo', circ(196, 1.4) + circ(172, 0.8) + marcas);
	let raios = '';
	for (let g = 0; g < 360; g += 30) { const a = (g * Math.PI) / 180, [x1, y1] = polar(60, a), [x2, y2] = polar(150, a); raios += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width=".5" opacity=".7"/>`; }
	salvar('astro-rede', `<ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".8" transform="rotate(-24 200 200)"/><ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".6" transform="rotate(38 200 200)" opacity=".8"/>${raios}`);
	salvar('astro-circulos', circ(150, 0.7, 'stroke-dasharray="2 6"') + circ(104, 1.1) + `<circle cx="${f(polar(104, 0.4)[0])}" cy="${f(polar(104, 0.4)[1])}" r="3.5" fill="#fff" stroke="none"/>`);
	salvar('astro-estrela', `<path d="M200 128 L210 190 L272 200 L210 210 L200 272 L190 210 L128 200 L190 190 Z" fill="#fff" stroke="none"/>` + circ(7, 1.2));
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
	salvar('armilar-eixo', `<line x1="${f(ax[0])}" y1="${f(ax[1])}" x2="${f(ax[2])}" y2="${f(ax[3])}" stroke-width="1.8"/><circle cx="${f(ax[0])}" cy="${f(ax[1])}" r="7" fill="#fff" stroke="none"/><circle cx="${f(ax[2])}" cy="${f(ax[3])}" r="7" fill="#fff" stroke="none"/><circle cx="${c}" cy="${c}" r="46" stroke-width="1.8"/>` + quatro(c, c, 32), vb);
}

// ---- Nebulosa: galáxia espiral (braços que giram, núcleo que pulsa) ----
{
	const bracos = (semente, n, esp, braco) => {
		const r = sorteio(semente);
		let g = '';
		for (let b = 0; b < braco; b++) {
			for (let i = 0; i < n; i++) {
				const t = r() * 3.4, raio = 18 + 52 * t + (r() - 0.5) * esp * (0.4 + t / 3.4), a = t * 1.25 + (b * Math.PI * 2) / braco + (r() - 0.5) * 0.35;
				const [x, y] = polar(raio, a);
				if (raio > 196) continue;
				g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.6 + Math.pow(r(), 3) * 2.6)}" fill="#fff" stroke="none" opacity="${f(0.35 + r() * 0.65)}"/>`;
			}
		}
		return g;
	};
	salvar('espiral-bracos', bracos(41, 260, 30, 2));
	salvar('espiral-poeira', bracos(43, 220, 60, 3));
	salvar('espiral-nucleo', `${HALO}<circle cx="200" cy="200" r="90" fill="url(#h)" stroke="none"/><circle cx="200" cy="200" r="10" fill="#fff" stroke="none"/>`);
}

// ---- Grimório e Holograma: selo rúnico (base que gira e três grupos de runas que cintilam) ----
salvar('selo-base', circ(190, 1) + circ(182, 0.5) + circ(148, 1, 'stroke-dasharray="1 5"') + '<rect x="96" y="96" width="208" height="208" stroke-width=".9"/><rect x="96" y="96" width="208" height="208" stroke-width=".9" transform="rotate(45 200 200)"/>' + circ(70, 0.8));
for (const k of [0, 1, 2]) salvar(`selo-runas-${k + 1}`, anelDeRunas(166, 0.55, k));

// ---- Forja: bigorna com um anel rúnico em volta ----
salvar('forja-bigorna', `<path fill="#fff" stroke="none" d="M 104 178 H 300 C 300 196 284 204 262 206 L 246 214 V 236 H 270 V 256 H 130 V 236 H 154 V 214 L 138 206 C 120 204 96 196 104 178 Z M 104 178 C 80 176 64 168 58 158 C 76 160 96 168 104 178 Z"/>` + `<path d="M 206 160 L 276 104 M 264 92 L 290 122" stroke-width="10" stroke-linecap="round"/>`);
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

// ---- Abissal: água-viva (sino e tentáculos, que se mexem separados; os dois no mesmo quadro, para ficarem alinhados) ----
salvar('medusa-sino', `${HALO}<circle cx="200" cy="150" r="150" fill="url(#h)" stroke="none" opacity=".5"/><path d="M 92 170 Q 92 52 200 52 Q 308 52 308 170 Q 280 186 254 172 Q 228 190 200 174 Q 172 190 146 172 Q 120 186 92 170 Z" fill="#fff" stroke="none" opacity=".75"/><path d="M 120 140 Q 160 90 200 88 Q 240 90 280 140" stroke-width="2" opacity=".6"/><path d="M 150 160 Q 175 120 200 118 Q 225 120 250 160" stroke-width="1.6" opacity=".5"/>`, '0 0 400 600');
{
	let t = '';
	for (const [x, a, l] of [[118, 18, 210], [150, 22, 240], [182, 16, 220], [218, 20, 236], [250, 18, 214], [282, 14, 200]]) t += `<path d="M ${x} 172 q ${a} ${l / 6} 0 ${l / 3} t 0 ${l / 3} t 0 ${l / 3}" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`;
	t += '<path d="M 186 176 q 30 60 0 120 t 6 90" stroke-width="7" stroke-linecap="round" opacity=".45"/><path d="M 214 176 q -30 60 0 120 t -6 90" stroke-width="7" stroke-linecap="round" opacity=".45"/>';
	salvar('medusa-tentaculos', t, '0 0 400 600');}

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
		g += r() < 0.25 ? quatro(x, y, f(s * 3)) : `<circle cx="${x}" cy="${y}" r="${f(s)}" fill="#fff" stroke="none"/>`;
	}
	fs.writeFileSync(`${DIR}/estrelas-${k}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">${g}</svg>\n`);
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
