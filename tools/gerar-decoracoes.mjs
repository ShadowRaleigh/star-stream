// Gera as peças dos objetos de canto, das camadas de cintilação e das partículas que sobem, em public/temas/deco/.
// Todas são máscaras brancas: a cor vem do CSS de cada tema e paleta (animacoes.css). Cada objeto é dividido em peças,
// para cada uma girar, balançar ou cintilar no seu ritmo, sempre como camada que a placa de vídeo só move.
// Uso: node tools/gerar-decoracoes.mjs
import fs from 'node:fs';

const DIR = 'public/temas/deco';
// A pasta não é apagada antes de gerar (o servidor de desenvolvimento ficava alguns instantes sem as peças):
// cada peça é regravada no lugar e, no fim, sai só o que esta geração não gravou.
const INICIO = Date.now() - 1000;
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

// ---- Constelação: duas constelações que se montam traço por traço, o Cisne (canto) e a Lira (segunda decoração),
// vizinhas no céu de verdade. Aqui saem só as estrelas e os halos; os traços são linhas do próprio CSS (animacoes.css),
// que crescem de uma estrela até a outra com scale, e por isso usam os mesmos pontos: quem mudar uma coordenada aqui
// precisa copiar para lá os valores que este bloco imprime no fim. Cada estrela é [x, y, brilho] num quadro de 400. ----
{
	const FIGURAS = {
		// Cisne: o corpo vai da cauda (embaixo à esquerda) até a cabeça, e as asas cruzam o corpo perto do alto.
		ceu: {
			E: [[66, 338, 4.6], [128, 290, 3.6], [190, 238, 4], [250, 182, 6.4], [318, 112, 5.4], [204, 124, 4], [146, 92, 3.4], [300, 238, 4.2], [340, 296, 3.4]],
			tracos: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [3, 7], [7, 8]],
			poeira: 18,
		},
		// Lira: Vega, a estrela forte, e o paralelogramo pendurado embaixo dela.
		ceu2: {
			E: [[132, 74, 7], [206, 54, 3.2], [188, 140, 3.8], [262, 172, 3.6], [236, 322, 4.6], [160, 294, 4.4]],
			tracos: [[0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [5, 2]],
			poeira: 12,
		},
	};
	for (const [nome, { E, tracos, poeira }] of Object.entries(FIGURAS)) {
		salvar(`${nome}-halos`, HALO + E.map(([x, y, s]) => `<circle cx="${x}" cy="${y}" r="${f(s * 5)}" fill="url(#h)" stroke="none"/>`).join(''));
		const r = sorteio(nome.length * 57);
		let fundo = '';
		for (let i = 0; i < poeira; i++) fundo += `<circle cx="${f(30 + r() * 340)}" cy="${f(30 + r() * 340)}" r="${f(0.7 + r() * 1)}" fill="#fff" stroke="none" opacity="${f(0.25 + r() * 0.45)}"/>`;
		salvar(`${nome}-estrelas`, fundo + E.map(([x, y, s]) => `<circle cx="${x}" cy="${y}" r="${f(s * 0.6)}" fill="#fff" stroke="none"/>`).join(''));
		// Geometria de cada traço para o CSS, em porcentagem do quadro: começa e termina um pouco antes das estrelas.
		const css = tracos.map(([i, j]) => {
			const [x1, y1, s1] = E[i], [x2, y2, s2] = E[j], d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d, g1 = s1 + 8, g2 = s2 + 8;
			return `--sx: ${f((x1 + ux * g1) / 4)}%; --sy: ${f((y1 + uy * g1) / 4)}%; --sl: ${f((d - g1 - g2) / 4)}%; --sa: ${Math.round((Math.atan2(uy, ux) * 180) / Math.PI)}deg;`;
		});
		console.log(`${nome}:\n  ${css.join('\n  ')}`);
	}
}

// ---- Ícones dos títulos, desenhados para 24 px (o instrumento inteiro virava mancha): a esfera com a órbita é do
// Astrolábio, o limbo com a estrela fina é do Observatório ----
salvar('icone-astro', '<circle cx="12" cy="12" r="10" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke-width="1.2" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="2.2" fill="#fff" stroke="none"/>', '0 0 24 24');
// O do Observatório é o próprio instrumento em miniatura: o limbo com quatro marcas e a estrela fina no meio.
salvar('icone-observatorio', '<circle cx="12" cy="12" r="10.2" stroke-width="1.4"/><path d="M12 1.8V4M22.2 12H20M12 22.2V20M1.8 12H4" stroke-width="1.4"/><path d="M12 4.4 L12.7 11.3 L17.3 12 L12.7 12.7 L12 19.6 L11.3 12.7 L6.7 12 L11.3 11.3 Z" fill="#fff" stroke="none"/>', '0 0 24 24');

// ---- Observatório: o astrolábio de latão em peças (limbo graduado, rede, círculos, a régua e a estrela do centro) ----
{
	let marcas = '';
	for (let g = 0; g < 360; g += 5) { const a = (g * Math.PI) / 180, r1 = g % 30 === 0 ? 176 : g % 15 === 0 ? 184 : 189, [x1, y1] = polar(r1, a), [x2, y2] = polar(194, a); marcas += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width=".9"/>`; }
	// Entre as marcas de 5 graus, os traços finos de cada grau, como no limbo de um instrumento de verdade.
	let graus = '';
	for (let g = 0; g < 360; g++) { if (g % 5 === 0) continue; const a = (g * Math.PI) / 180, [x1, y1] = polar(191, a), [x2, y2] = polar(194, a); graus += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width=".45"/>`; }
	salvar('obs-limbo', circ(196, 1.4) + circ(172, 0.8) + marcas + graus);
	let raios = '';
	for (let g = 0; g < 360; g += 30) { const a = (g * Math.PI) / 180, [x1, y1] = polar(60, a), [x2, y2] = polar(150, a); raios += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width=".5" opacity=".7"/>`; }
	const rede = `<ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".8" transform="rotate(-24 200 200)"/><ellipse cx="200" cy="200" rx="150" ry="62" stroke-width=".6" transform="rotate(38 200 200)" opacity=".8"/>${raios}`;
	salvar('obs-rede', rede);
	salvar('obs-circulos', circ(150, 0.7, 'stroke-dasharray="2 6"') + circ(104, 1.1) + `<circle cx="${f(polar(104, 0.4)[0])}" cy="${f(polar(104, 0.4)[1])}" r="3.5" fill="#fff" stroke="none"/>`);
	// A régua (alidade) atravessa o instrumento, com as pontas afinadas; o vão do meio deixa a estrela sempre limpa.
	salvar('obs-regua', '<path d="M 24 200 L 44 198.6 L 116 198.9 L 116 201.1 L 44 201.4 Z M 376 200 L 356 198.6 L 284 198.9 L 284 201.1 L 356 201.4 Z" fill="#fff" stroke="none"/><circle cx="116" cy="200" r="2.4" fill="#fff" stroke="none"/><circle cx="284" cy="200" r="2.4" fill="#fff" stroke="none"/>');
	// O centro é a estrela fina de quatro pontas retas, com o anel pequeno em volta do pino. Ela é uma agulha de
	// instrumento: pontas de 80 no eixo norte-sul e de 56 no leste-oeste, e a cintura a só 5 do centro (cerca de 0,09 do
	// comprimento), toda cheia, para ler magrinha mesmo de longe.
	salvar('obs-estrela', '<path d="M200 120 L205 195 L256 200 L205 205 L200 280 L195 205 L144 200 L195 195 Z" fill="#fff" stroke="none"/>' + circ(7, 1.2));
	// No banner, o anel (sem a estrela) em duas peças que giram em sentidos opostos.
	salvar('anel-externo', circ(196, 1.4) + circ(172, 0.8) + marcas + circ(150, 0.7, 'stroke-dasharray="2 6"'));
	salvar('anel-interno', rede + circ(104, 1.1));
}

// ---- Codex: uma volvela, a roda de papel dos livros de astronomia antigos. O anel das doze casas fica parado, o disco
// dos dias gira com a lua, o ponteiro anda por cima, e no centro fica o sol gravado ----
{
	let casas = circ(196, 1.6) + circ(190, 0.6) + circ(164, 1.1);
	for (let k = 0; k < 12; k++) {
		const a = (k * Math.PI) / 6, [x1, y1] = polar(164, a), [x2, y2] = polar(196, a);
		casas += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="1.1"/>`;
		// No meio de cada casa, uma marca de tinta (um ponto com dois menores), no lugar do signo.
		const m = a + Math.PI / 12, [cx, cy] = polar(177, m);
		casas += `<circle cx="${f(cx)}" cy="${f(cy)}" r="3.2" fill="#fff" stroke="none"/>`;
		for (const d of [-0.07, 0.07]) { const [px, py] = polar(177, m + d); casas += `<circle cx="${f(px)}" cy="${f(py)}" r="1.3" fill="#fff" stroke="none"/>`; }
	}
	for (let g = 0; g < 360; g += 2.5) { const a = (g * Math.PI) / 180, [x1, y1] = polar(164, a), [x2, y2] = polar(g % 10 ? 160 : 156, a); casas += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width=".6"/>`; }
	salvar('codex-casas', casas);
	// O disco dos dias: trinta divisões do mês lunar, e a lua crescente presa nele.
	let disco = circ(148, 0.9) + circ(126, 0.7);
	for (let k = 0; k < 30; k++) { const a = (k * Math.PI) / 15, [x1, y1] = polar(126, a), [x2, y2] = polar(k % 5 ? 136 : 148, a); disco += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="${k % 5 ? 0.6 : 1}"/>`; if (k % 5 === 2) { const [px, py] = polar(140, a + Math.PI / 30); disco += `<circle cx="${f(px)}" cy="${f(py)}" r="1.6" fill="#fff" stroke="none"/>`; } }
	const [lx, ly] = polar(96, -0.6);
	disco += `<path d="M ${f(lx)} ${f(ly - 13)} A 13 13 0 1 0 ${f(lx)} ${f(ly + 13)} A 9.5 13 0 1 1 ${f(lx)} ${f(ly - 13)} Z" fill="#fff" stroke="none" transform="rotate(-30 ${f(lx)} ${f(ly)})"/>`;
	salvar('codex-disco', disco);
	// O ponteiro: haste fina com a ponta em folha estreita e o contrapeso redondo do outro lado.
	// Ela começa fora dos raios do sol, para não riscar o centro.
	salvar('codex-ponteiro', '<path d="M 256 199 L 330 199.3 Q 352 194 372 200 Q 352 206 330 200.7 L 256 201 Z" fill="#fff" stroke="none"/><line x1="144" y1="200" x2="122" y2="200" stroke-width="1.4"/><circle cx="116" cy="200" r="6" stroke-width="1.4"/>');
	// O sol gravado: disco, anel e dezesseis raios curtos, alternando os longos e os curtos.
	let sol = '<circle cx="200" cy="200" r="13" fill="#fff" stroke="none"/>' + circ(22, 2);
	for (let k = 0; k < 16; k++) { const a = (k * Math.PI) / 8, [x1, y1] = polar(k % 2 ? 32 : 30, a), [x2, y2] = polar(k % 2 ? 40 : 48, a); sol += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="2"/>`; }
	salvar('codex-sol', sol);
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
	// No centro, a estrela fina de agulha de bússola, com as pontas longas no eixo polar: cada ponta tem uma metade cheia e
	// a outra só no traço, e o pino do meio é um anel pequeno. As mesmas peças montam a esfera da capa (animacoes.css).
	const ponto = (r, g) => { const a = ((g + inc - 90) * Math.PI) / 180; return [f(c + Math.cos(a) * r), f(c + Math.sin(a) * r)]; };
	let cheio = '', contorno = '';
	for (let k = 0; k < 4; k++) {
		const g = k * 90, ponta = ponto(k % 2 ? 26 : 40, g), antes = ponto(5.6, g - 45), depois = ponto(5.6, g + 45);
		cheio += `M ${ponto(4.6, g).join(' ')} L ${ponta.join(' ')} L ${depois.join(' ')} Z `;
		contorno += `M ${antes.join(' ')} L ${ponta.join(' ')} L ${depois.join(' ')} `;
	}
	// A estrela é uma peça à parte, para cintilar e ter a cor de destaque da paleta (na capa, os anéis são da cor da tinta).
	salvar('armilar-agulha', `<path d="${cheio}" fill="#fff" stroke="none"/><path d="${contorno}" stroke-width="1.2"/><circle cx="${c}" cy="${c}" r="3.4" stroke-width="1.4"/>`, vb);
	// O eixo para no anel do centro, para não atravessar a estrela.
	const [e1, e2] = [ponto(46, 180), ponto(46, 0)];
	salvar('armilar-eixo', `<line x1="${f(ax[0])}" y1="${f(ax[1])}" x2="${e1[0]}" y2="${e1[1]}" stroke-width="1.8"/><line x1="${e2[0]}" y1="${e2[1]}" x2="${f(ax[2])}" y2="${f(ax[3])}" stroke-width="1.8"/><circle cx="${f(ax[0])}" cy="${f(ax[1])}" r="7" fill="#fff" stroke="none"/><circle cx="${f(ax[2])}" cy="${f(ax[3])}" r="7" fill="#fff" stroke="none"/><circle cx="${c}" cy="${c}" r="46" stroke-width="1.8"/>`, vb);
	// O pé: o berço que segura o meridiano por baixo, a coluna torneada e a base, para a esfera ficar de pé no canto.
	// Na página o meridiano e o pé ficam parados juntos, numa peça só (a capa usa o meridiano sem o pé).
	salvar('armilar-meridiano-pe', `<circle cx="${c}" cy="${c}" r="${R}" stroke-width="2.2"/><circle cx="${c}" cy="${c}" r="${Ri}" stroke-width="1.3"/>${marcas}<path d="M ${f(c + Math.cos(1.2) * 318)} ${f(c + Math.sin(1.2) * 318)} A 318 318 0 0 1 ${f(c + Math.cos(1.94) * 318)} ${f(c + Math.sin(1.94) * 318)}" stroke-width="5" stroke-linecap="round"/><path d="M 392 716 L 392 744 M 408 716 L 408 744" stroke-width="3"/><ellipse cx="400" cy="748" rx="16" ry="5" fill="#fff" stroke="none"/><path d="M 394 752 L 406 752 Q 414 770 452 784 L 348 784 Q 386 770 394 752 Z" fill="#fff" stroke="none"/><rect x="316" y="786" width="168" height="7" rx="2" fill="#fff" stroke="none"/>`, vb);
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

// ---- Holograma: selo rúnico (base que gira e três grupos de runas que cintilam) ----
salvar('selo-base', circ(190, 1) + circ(182, 0.5) + circ(148, 1, 'stroke-dasharray="1 5"') + '<rect x="96" y="96" width="208" height="208" stroke-width=".9"/><rect x="96" y="96" width="208" height="208" stroke-width=".9" transform="rotate(45 200 200)"/>' + circ(70, 0.8));
for (const k of [0, 1, 2]) salvar(`selo-runas-${k + 1}`, anelDeRunas(166, 0.55, k));

// ---- Grimório: selo alquímico, só dele (o selo rúnico das peças selo-* é do Holograma). Aros finos e um heptagrama
// que giram devagar, os sete planetas em três grupos que cintilam alternados e, no meio, o sol no colo da lua. A capa
// usa as mesmas peças, girando por cima do couro. ----
{
	// Os sete planetas num quadro de 24 x 24 (centro em 12, 12), em traço, sem depender de fonte.
	const PLANETAS = [
		'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.8" fill="#fff" stroke="none"/>',
		'<path d="M15 4.5 A8 8 0 1 0 15 19.5 A9 9 0 0 1 15 4.5 Z"/>',
		'<path d="M8 3 Q12 8 16 3"/><circle cx="12" cy="11" r="4.4"/><path d="M12 15.4 V22.5 M8.8 19.2 H15.2"/>',
		'<circle cx="12" cy="8.5" r="5.4"/><path d="M12 13.9 V22.5 M8.4 18.6 H15.6"/>',
		'<circle cx="10" cy="14" r="5.4"/><path d="M13.8 10.2 L20 4 M14.8 4 H20 V9.2"/>',
		'<path d="M5 8.5 Q5.5 3.6 9.6 4.4 Q13.2 5.6 9.2 11.6 L5 17 H19 M15.4 3.6 V22.5"/>',
		'<path d="M8 2.5 V19.5 M4.8 6.4 H11.4 M8 12 Q11.2 8.4 14.8 10.8 Q17 12.8 14 16.6 Q12 19.2 14.6 21.6"/>',
	];
	const R = 166, N = 7;
	const ang = (k) => (k / N) * Math.PI * 2 - Math.PI / 2;
	// Aros e heptagrama {7/2}: os pontos ficam no aro de 148, ligados de dois em dois (as linhas passam longe do centro).
	const vert = Array.from({ length: N }, (_, k) => polar(148, ang(k)));
	let estrela = '';
	for (let k = 0; k < N; k++) { const [x1, y1] = vert[k], [x2, y2] = vert[(k + 2) % N]; estrela += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="1.1"/>`; }
	const pontas = vert.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.2" fill="#fff" stroke="none"/>`).join('');
	salvar('grimorio-selo-aros', circ(193, 1.8) + circ(186, 0.7) + circ(181, 0.9, 'stroke-dasharray="1.2 5.6"') + circ(148, 1) + circ(141, 0.5) + circ(62, 1.3) + circ(56, 0.5) + estrela + pontas);
	// Os planetas no anel entre 148 e 186, virados para fora, e entre eles um sinal de três pontos; tudo em três grupos.
	const itens = [];
	for (let k = 0; k < N; k++) {
		const [x, y] = polar(R, ang(k));
		itens.push(`<g transform="translate(${f(x)} ${f(y)}) rotate(${f((k / N) * 360)}) scale(1.25) translate(-12 -12)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${PLANETAS[k]}</g>`);
		const [sx, sy] = polar(R, ang(k + 0.5));
		itens.push([[0, -5], [-4.3, 2.5], [4.3, 2.5]].map(([dx, dy]) => `<circle cx="${f(sx + dx)}" cy="${f(sy + dy)}" r="1.7" fill="#fff" stroke="none"/>`).join(''));
	}
	for (const g of [0, 1, 2]) salvar(`grimorio-selo-glifos-${g + 1}`, itens.filter((_, i) => i % 3 === g).join(''));
	// O centro: o sol, com raios curtos, no colo de uma lua crescente; sete estrelinhas em volta, uma por planeta.
	let sol = '<circle cx="200" cy="194" r="12" stroke-width="1.6"/><circle cx="200" cy="194" r="4.5" fill="#fff" stroke="none"/>';
	for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; if (Math.sin(a) > 0.5) continue; sol += `<line x1="${f(200 + Math.cos(a) * 16)}" y1="${f(194 + Math.sin(a) * 16)}" x2="${f(200 + Math.cos(a) * 22)}" y2="${f(194 + Math.sin(a) * 22)}" stroke-width="1.4" stroke-linecap="round"/>`; }
	const lua = '<path d="M174 202 A26 26 0 0 0 226 202 A31 31 0 0 1 174 202 Z" fill="#fff" stroke="none" opacity=".9"/>';
	const estrelinhas = Array.from({ length: N }, (_, k) => { const [x, y] = polar(45, ang(k) + Math.PI / N); return `<circle cx="${f(x)}" cy="${f(y)}" r="1.5" fill="#fff" stroke="none"/>`; }).join('');
	salvar('grimorio-selo-centro', sol + lua + estrelinhas);
}

// Velas que flutuam (segunda decoração do Grimório): o corpo, com a cera escorrida, e a chama com o halo, no mesmo quadro
// de 60 x 200, para as duas peças se alinharem quando uma fica por cima da outra.
{
	const corpo = '<path d="M17 84 Q17 79 22 79 H38 Q43 79 43 84 V192 Q43 196 39 196 H21 Q17 196 17 192 Z" fill="#fff" stroke="none" opacity=".78"/>' +
		// Cera escorrida na borda de cima e um filete de luz no lado da chama.
		'<path d="M17 86 Q20 98 22 86 Q24 112 27 88 Q30 94 32 86 Q35 104 38 87 Q40 92 43 86 V84 H17 Z" fill="#fff" stroke="none"/>' +
		'<path d="M21 92 V186" stroke-width="2" opacity=".55" stroke-linecap="round"/><path d="M30 80 V71" stroke-width="1.8" stroke-linecap="round"/>';
	const chama = '<defs><radialGradient id="h" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>' +
		'<circle cx="30" cy="58" r="30" fill="url(#h)" stroke="none"/>' +
		'<path d="M30 33 C35 45 39 52 38 61 C37 68 34 72 30 72 C26 72 23 68 22 61 C21 52 25 45 30 33 Z" fill="#fff" stroke="none" opacity=".62"/>' +
		'<path d="M30 50 C32.6 56 34 60 33.4 64.5 C33 68 31.6 69.5 30 69.5 C28.4 69.5 27 68 26.6 64.5 C26 60 27.4 56 30 50 Z" fill="#fff" stroke="none"/>';
	salvar('grimorio-vela-corpo', corpo, '0 0 60 200');
	salvar('grimorio-vela-chama', chama, '0 0 60 200');
}

// ---- Forja: a bigorna gravada (parada), um martelo que bate nela de tempos em tempos, a chuva de fagulhas e o clarão
// do golpe, e atrás uma moldura octogonal anã com quatro runas de ligação que esquentam devagar. Tudo no quadro de
// 400 x 400 da bigorna; o golpe acerta a face dela no ponto (212, 178). ----
salvar('forja-bigorna', '<path stroke-width="3" stroke-linejoin="round" d="M 104 178 H 300 C 300 196 284 204 262 206 L 246 214 V 236 H 270 V 256 H 130 V 236 H 154 V 214 L 138 206 C 120 204 96 196 104 178 Z M 104 178 C 80 176 64 168 58 158 C 76 160 96 168 104 178"/><line x1="116" y1="186" x2="288" y2="186" stroke-width="1.4" opacity=".7"/><line x1="154" y1="236" x2="246" y2="236" stroke-width="1.4" opacity=".6"/><path d="M 120 262 H 280" stroke-width="2" opacity=".5" stroke-linecap="round"/>');
{
	// Martelo encantado, desenhado na pose do golpe: o cabo deitado, com o pivô na ponta (352, 152), e a cabeça de pé,
	// com a face de baixo na face da bigorna; uma runa vazada na cabeça. Erguido, ele gira em volta do pivô.
	const cabo = '<path d="M 356 148 Q 360 152 356 156 L 226 155 L 226 149 Z" fill="#fff" stroke="none" opacity=".8"/><circle cx="352" cy="152" r="4.5" fill="#fff" stroke="none"/>';
	const cabeca = '<defs><mask id="runa"><rect width="400" height="400" fill="#fff"/><path d="M 212 138 V 166 M 206 143 L 212 149 L 218 143 M 206 161 L 212 155 L 218 161" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></mask></defs>' +
		'<g mask="url(#runa)"><path d="M 198 130 Q 198 126 202 126 H 222 Q 226 126 226 130 V 174 Q 226 178 222 178 H 202 Q 198 178 198 174 Z" fill="#fff" stroke="none"/></g>' +
		'<rect x="194" y="129" width="36" height="5" rx="1.5" fill="#fff" stroke="none"/><rect x="194" y="170" width="36" height="5" rx="1.5" fill="#fff" stroke="none"/>';
	salvar('forja-martelo', cabo + cabeca);
	// Fagulhas do golpe: riscos curtos saindo do ponto de impacto, mais para cima e para os lados.
	const r = sorteio(4401);
	let fag = '';
	for (let i = 0; i < 22; i++) {
		const a = -Math.PI / 2 + (r() - 0.5) * Math.PI * 1.25, d0 = 16 + r() * 34, l = 5 + r() * 12;
		const [x1, y1] = [212 + Math.cos(a) * d0, 178 + Math.sin(a) * d0], [x2, y2] = [212 + Math.cos(a) * (d0 + l), 178 + Math.sin(a) * (d0 + l)];
		fag += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="${f(1.6 + r() * 1.6)}" stroke-linecap="round" opacity="${f(0.55 + r() * 0.45)}"/>`;
	}
	salvar('forja-faiscas', fag);
	salvar('forja-clarao', `${HALO}<ellipse cx="212" cy="180" rx="92" ry="54" fill="url(#h)" stroke="none"/>`);
	// Moldura octogonal: dois octógonos fazendo uma faixa, com losangos nos vértices.
	const oct = (raio, giro = 22.5) => Array.from({ length: 8 }, (_, k) => polar(raio, ((k * 45 + giro) * Math.PI) / 180).map(f).join(' ')).join(' L ');
	let moldura = `<path d="M ${oct(198)} Z" stroke-width="2.2" stroke-linejoin="round"/><path d="M ${oct(171)} Z" stroke-width="1.2" stroke-linejoin="round"/><path d="M ${oct(150)} Z" stroke-width=".9" stroke-dasharray="3 7" stroke-linejoin="round"/>`;
	for (let k = 0; k < 8; k++) { const [x, y] = polar(184.5, ((k * 45 + 22.5) * Math.PI) / 180); moldura += `<path d="M ${f(x)} ${f(y - 7)} L ${f(x + 7)} ${f(y)} L ${f(x)} ${f(y + 7)} L ${f(x - 7)} ${f(y)} Z" fill="#fff" stroke="none"/>`; }
	salvar('forja-anel', moldura);
	// Runas de ligação (duas runas sobrepostas num traço só) nos quatro lados da faixa, em dois grupos.
	const LIGADAS = ['M10 0V34M10 8L18 2M10 8L2 2M2 22L10 28L18 22', 'M4 0V34M16 0V34M4 10L16 18M4 18L16 26', 'M10 0V34M3 6L17 14M3 14L17 6M4 26H16', 'M6 0V34M6 4L16 10L6 16M6 20L16 28'];
	LIGADAS.forEach((d, k) => {
		const a = ((k * 90 - 90) * Math.PI) / 180, [x, y] = polar(171, a);
		const corpo = `<path d="${d}" transform="translate(${f(x)} ${f(y)}) rotate(${k * 90}) scale(.58) translate(-10 -17)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
		LIGADAS[k] = corpo;
	});
	salvar('forja-runas-1', LIGADAS[0] + LIGADAS[2]);
	salvar('forja-runas-2', LIGADAS[1] + LIGADAS[3]);
}

// ---- Mapa: bússola de marinheiro. O aro graduado fica parado; a rosa dos ventos (o cartão, com as letras) boia no
// líquido e oscila devagar, em dois balanços sobrepostos, sem nunca parar de repente. As pontas são finas e retas,
// como numa carta náutica. ----
{
	let aro = circ(194, 3) + circ(186, 1) + circ(160, 1.2);
	for (let g = 0; g < 360; g += 5) { const a = (g * Math.PI) / 180, [x1, y1] = polar(g % 45 ? 178 : 168, a), [x2, y2] = polar(186, a); aro += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="${g % 45 ? 0.9 : 1.8}"/>`; }
	// A linha de fé: um triângulo pequeno no alto do aro, que marca o rumo do barco.
	aro += '<path d="M 200 4 L 207 18 L 193 18 Z" fill="#fff" stroke="none"/>';
	salvar('bussola-aro', aro);
	// A rosa (tudo dentro do aro de 160, para girar sem bater nas marcas): 4 pontas cardeais longas, 4 colaterais e 8 subcolaterais, cada uma meio cheia e meio vazada, como gravura.
	const ponta = (ang, comp, larg, cheia) => {
		const a = (ang * Math.PI) / 180, [tx, ty] = polar(comp, a), [ex, ey] = polar(larg, a - Math.PI / 2), [dx, dy] = polar(larg, a + Math.PI / 2);
		return `<path d="M 200 200 L ${f(ex)} ${f(ey)} L ${f(tx)} ${f(ty)} Z" ${cheia ? 'fill="#fff" stroke="none"' : 'stroke-width="1.1" stroke-linejoin="round"'}/><path d="M 200 200 L ${f(dx)} ${f(dy)} L ${f(tx)} ${f(ty)} Z" stroke-width="1.1" stroke-linejoin="round"/>`;
	};
	let rosa = circ(154, 1) + circ(149, 0.6, 'stroke-dasharray="2 5"') + circ(30, 1.2);
	for (let k = 0; k < 8; k++) rosa += ponta(22.5 + k * 45, 74, 7, k % 2 === 0);
	for (let k = 0; k < 4; k++) rosa += ponta(45 + k * 90, 94, 10, true);
	for (let k = 0; k < 4; k++) rosa += ponta(-90 + k * 90, 118, 12, true);
	rosa += '<circle cx="200" cy="200" r="7" fill="#fff" stroke="none"/>';
	for (const [l, g] of [['N', -90], ['L', 0], ['S', 90], ['O', 180]]) { const [x, y] = polar(136, (g * Math.PI) / 180); rosa += `<text x="${f(x)}" y="${f(y)}" font-family="Georgia, 'Times New Roman', serif" font-size="21" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#fff" stroke="none">${l}</text>`; }
	salvar('bussola-rosa', rosa);
}

// Serpente do mar (segunda decoração do Mapa): a besta das margens das cartas antigas, em três peças que sobem e descem
// fora de compasso, como se nadasse: a cabeça, o meio do corpo e a cauda, todas no mesmo quadro de 400 x 200, com as
// ondas paradas por cima. As partes só esticam e encolhem em altura a partir da linha d'água (a cabeça também gira um
// pouco no pescoço), então o pé de cada uma nunca sai da água.
{
	// As pernas descem até y = 152, abaixo da linha d'água (130): no CSS cada peça sobe e desce inteira e um recorte parado
	// esconde tudo abaixo da água, então a base nunca aparece, nem quando a corcova sobe.
	const corcova = (cx, l, alt, larg) => `<path d="M ${cx - l} 152 V 130 C ${cx - l} ${130 - alt} ${cx + l} ${130 - alt} ${cx + l} 130 V 152 H ${cx + l - larg} V 130 C ${cx + l - larg} ${130 - alt + larg * 1.2} ${cx - l + larg} ${130 - alt + larg * 1.2} ${cx - l + larg} 130 V 152 Z" fill="#fff" stroke="none"/>`;
	// Cabeça: o pescoço fino sai da água em curva, com espinhos no dorso, focinho comprido e o olho vazado.
	const cabeca = '<path d="M 306 152 L 306 133 C 302 104 308 76 326 60 C 338 49 354 45 368 50 L 389 57 C 395 59 394 65 388 66 L 368 68 C 358 69 350 74 346 82 C 338 96 328 112 326 133 L 326 152 Z M 360 54 m -3.2 0 a 3.2 3.2 0 1 0 6.4 0 a 3.2 3.2 0 1 0 -6.4 0 Z" fill="#fff" stroke="none" fill-rule="evenodd"/>' +
		[[305, 112, -1.1], [307, 96, -1.0], [312, 81, -0.85], [320, 68, -0.65], [331, 57, -0.4]].map(([x, y, a]) => `<path d="M ${x} ${y} L ${f(x + Math.cos(a + Math.PI) * 11)} ${f(y + Math.sin(a + Math.PI) * 11 - 3)} L ${x + 4} ${y - 7} Z" fill="#fff" stroke="none"/>`).join('') +
		'<path d="M 388 64 Q 398 72 393 82" stroke-width="1.6" stroke-linecap="round"/>';
	salvar('mapa-serpente-cabeca', cabeca, '0 0 400 200');
	salvar('mapa-serpente-corpo', corcova(220, 30, 66, 16) + corcova(140, 26, 52, 14), '0 0 400 200');
	salvar('mapa-serpente-cauda', corcova(70, 20, 38, 11) + '<path d="M 50 130 C 40 116 28 112 18 118 L 26 104 L 10 108" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>', '0 0 400 200');
	let ondas = '';
	for (let x = -10; x < 410; x += 26) ondas += `<path d="M ${x} 134 q 6.5 -7 13 0 t 13 0" stroke-width="2.2" stroke-linecap="round"/>`;
	ondas += '<path d="M 30 150 q 10 -6 20 0 t 20 0 M 170 154 q 10 -6 20 0 t 20 0 M 300 150 q 10 -6 20 0 t 20 0" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>';
	salvar('mapa-serpente-ondas', ondas, '0 0 400 200');
}

// ---- Abissal: água-viva da lua, em quatro peças no mesmo quadro de 400 x 600 (alinhadas umas sobre as outras): o sino,
// as gônadas que brilham dentro dele, os braços orais franjados e os tentáculos. Nada de fio de cabelo: os traços finos,
// mexendo devagar, cintilavam no serrilhado dos pixels; aqui tudo é macio (desfocado dentro do próprio SVG, que é
// rasterizado uma vez só) e os tentáculos nascem transparentes na borda do sino, para a emenda entre as peças não
// aparecer quando o sino pulsa. ----
{
	const BORDA = 190, CX = 200;
	const DESFOQUE = '<filter id="d" x="-20%" y="-5%" width="140%" height="110%"><feGaussianBlur stdDeviation=".7"/></filter>';
	// Sino: cúpula com a margem em oito festões, mais densa na borda; canais radiais finos e macios por dentro.
	let margem = '';
	for (let k = 8; k > 0; k--) { const x0 = 100 + (200 * k) / 8, x1 = 100 + (200 * (k - 1)) / 8; margem += ` Q ${f((x0 + x1) / 2)} ${BORDA + 11} ${f(x1)} ${BORDA}`; }
	const sino = `M 100 ${BORDA} C 96 112 140 62 ${CX} 62 C 260 62 304 112 300 ${BORDA}${margem} Z`;
	// Os canais são meridianos da cúpula: a metade direita do contorno, achatada para cada lado, dá a curva do sino.
	let canais = '';
	for (const s of [-0.88, -0.66, -0.42, -0.18, 0.18, 0.42, 0.66, 0.88]) canais += `<path d="M ${CX} 66 C ${f(CX + s * 60)} 66 ${f(CX + s * 104)} 114 ${f(CX + s * 100)} ${BORDA - 2}" stroke-width="1.5" opacity="${f(0.16 + 0.2 * Math.abs(s))}"/>`;
	salvar('medusa-sino', `<defs>${DESFOQUE}<radialGradient id="s" cx="50%" cy="95%" r="90%"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".62" stop-color="#fff" stop-opacity=".34"/><stop offset=".9" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></radialGradient><radialGradient id="h"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><ellipse cx="${CX}" cy="140" rx="170" ry="150" fill="url(#h)" stroke="none" opacity=".7"/><path d="${sino}" fill="url(#s)" stroke="none"/><g filter="url(#d)">${canais}</g>`, '0 0 400 600');
	// Gônadas: quatro anéis em trevo, vistos de lado (achatados), no meio do sino: a marca da água-viva da lua.
	let gon = '';
	for (const [dx, dy] of [[-33, 0], [33, 0], [0, -11], [0, 11]]) gon += `<ellipse cx="${CX + dx}" cy="${148 + dy}" rx="18" ry="9" stroke-width="5.5"/>`;
	salvar('medusa-gonadas', `<defs>${DESFOQUE.replace('.7', '1.6')}</defs><g filter="url(#d)" opacity=".85">${gon}</g>`, '0 0 400 600');
	// Braços orais: quatro fitas que afinam para baixo, com a borda franjada, e somem no fim.
	let bracos = '';
	for (const [lado, fase, comp] of [[-1, 0.4, 250], [-0.4, 2.1, 290], [0.4, 3.7, 270], [1, 5.2, 235]]) {
		const esq = [], dir = [];
		for (let i = 0; i <= 40; i++) {
			const t = i / 40, y = BORDA - 6 + t * comp, xc = CX + lado * (10 + t * 26) + Math.sin(t * 5.5 + fase) * 12 * t;
			const w = 9 * (1 - t * 0.75) + Math.sin(t * 46 + fase) * 2.2 * (1 - t * 0.5);
			esq.push([xc - w, y]); dir.push([xc + w, y]);
		}
		bracos += `<path d="M ${esq.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ')} L ${dir.reverse().map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ')} Z" fill="url(#b)" stroke="none"/>`;
	}
	salvar('medusa-bracos', `<defs>${DESFOQUE}<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".08" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g filter="url(#d)">${bracos}</g>`, '0 0 400 600');
	// Tentáculos: dez, saindo da margem, compridos e ondulados; nascem transparentes e somem no fim.
	let tent = '';
	for (let k = 0; k < 10; k++) {
		const x0 = 108 + (184 * k) / 9, comp = 290 + ((k * 37) % 70), fase = k * 1.7;
		let d = `M ${f(x0)} ${BORDA - 2}`;
		for (let i = 1; i <= 24; i++) { const t = i / 24, y = BORDA - 2 + t * comp, x = x0 + (x0 - CX) * 0.12 * t + Math.sin(t * 7 + fase) * 9 * t; d += ` L ${f(x)} ${f(y)}`; }
		tent += `<path d="${d}" stroke-width="2.4" stroke-linecap="round"/>`;
	}
	salvar('medusa-tentaculos', `<defs>${DESFOQUE}<linearGradient id="t" x1="0" y1="${BORDA}" x2="0" y2="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".07" stop-color="#fff" stop-opacity=".6"/><stop offset=".45" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g filter="url(#d)" stroke="url(#t)">${tent}</g>`, '0 0 400 600');
}

// Algas (segunda decoração do Abissal): três talos compridos de kelp, cada um num quadro de 120 x 600 com a base
// embaixo, para cada um balançar em volta do próprio pé. O talo tem 5 de largura no quadro: na tela, os talos ficam com
// uns 60 px de largura, e o traço sai com uns 2,5 px (mais fino que isso, sumia).
{
	for (const [k, sem] of [[1, 31], [2, 47], [3, 59]]) {
		const r = sorteio(sem), alt = 430 + r() * 130;
		let talo = 'M 60 600', folhas = '';
		const pts = [];
		for (let i = 0; i <= 30; i++) { const t = i / 30, y = 600 - t * alt, x = 60 + Math.sin(t * 4.2 + k) * 12 * t; pts.push([x, y]); talo += ` L ${f(x)} ${f(y)}`; }
		pts.forEach(([x, y], i) => {
			if (i < 2 || i % 2) return;
			const lado = (i / 2) % 2 ? 1 : -1, t = i / 30, l = 62 + r() * 30 - t * 26, a = -Math.PI / 2 + lado * (0.3 + r() * 0.25), larg = 8 + r() * 4;
			const tx = x + Math.cos(a) * l, ty = y + Math.sin(a) * l, nx = -Math.sin(a) * larg, ny = Math.cos(a) * larg, mx = (x + tx) / 2, my = (y + ty) / 2;
			folhas += `<path d="M ${f(x)} ${f(y)} Q ${f(mx + nx)} ${f(my + ny)} ${f(tx)} ${f(ty)} Q ${f(mx - nx * 0.6)} ${f(my - ny * 0.6)} ${f(x)} ${f(y)} Z" fill="#fff" stroke="none" opacity="${f(0.55 + r() * 0.3)}"/>`;
		});
		// Uma bolsa de ar (pneumatocisto) na base de algumas folhas, como no kelp de verdade.
		const [bx, by] = pts[12];
		salvar(`abissal-alga-${k}`, `<defs><filter id="d"><feGaussianBlur stdDeviation=".5"/></filter></defs><g filter="url(#d)"><path d="${talo}" stroke-width="5" stroke-linecap="round" opacity=".9"/>${folhas}<circle cx="${f(bx)}" cy="${f(by)}" r="6" fill="#fff" stroke="none" opacity=".7"/></g>`, '0 0 120 600');
	}
}

// ---- Bosque: um ninho de cogumelos encantados que nasce do musgo, no pé da página. O musgo, os talos e o capim ficam
// parados; os chapéus, em dois grupos, acendem e apagam devagar, cada um com o seu halo; os esporos de luz rondam por
// cima, em três grupos que vagam e piscam no seu ritmo. ----
{
	// [x da base, x do topo, altura do talo, largura do chapéu, grupo de brilho]
	const COGUMELOS = [[150, 138, 186, 104, 0], [222, 230, 124, 76, 1], [106, 96, 62, 46, 1], [270, 276, 70, 50, 0], [306, 314, 38, 30, 1], [182, 186, 34, 26, 0]];
	const BASE = 372;
	let base = '';
	// Musgo: um monte baixo de bordas fofas, com tufos.
	let musgo = `M 30 400 L 30 ${BASE + 10}`;
	for (let x = 30; x <= 370; x += 20) musgo += ` Q ${x + 10} ${f(BASE - 6 - 6 * Math.sin(x / 23) - 10 * Math.exp(-(((x - 200) / 90) ** 2)))} ${x + 20} ${f(BASE + 2 - 3 * Math.cos(x / 17) - 8 * Math.exp(-(((x + 20 - 200) / 90) ** 2)))}`;
	base += `<path d="${musgo} L 390 400 Z" fill="#fff" stroke="none" opacity=".5"/>`;
	const r = sorteio(77);
	// Capim: lâminas finas e curvas saindo do musgo.
	for (let i = 0; i < 26; i++) {
		const x = 40 + r() * 320, h = 16 + r() * 34, inc = (r() - 0.5) * 24;
		base += `<path d="M ${f(x - 2)} ${BASE + 6} Q ${f(x + inc * 0.4)} ${f(BASE - h * 0.5)} ${f(x + inc)} ${f(BASE - h)} Q ${f(x + inc * 0.3 + 1.5)} ${f(BASE - h * 0.45)} ${f(x + 2)} ${BASE + 6} Z" fill="#fff" stroke="none" opacity="${f(0.45 + r() * 0.35)}"/>`;
	}
	// Folhinhas de trevo no musgo, entre os talos.
	for (const [x, y, e] of [[64, BASE - 6, 1], [252, BASE - 10, 0.8], [338, BASE - 4, 0.9], [128, BASE - 2, 0.7]]) {
		for (const a of [-50, 0, 50]) base += `<path d="M ${x} ${y} q ${f(-6 * e)} ${f(-9 * e)} 0 ${f(-14 * e)} q ${f(6 * e)} ${f(5 * e)} 0 ${f(14 * e)} Z" transform="rotate(${a} ${x} ${y})" fill="#fff" stroke="none" opacity=".55"/>`;
	}
	let chapeus = ['', ''], halos = ['', ''];
	for (const [xb, xt, alt, larg, g] of COGUMELOS) {
		const yt = BASE - alt, w = larg / 2, h = larg * 0.5;
		// Talo: afina para cima, com uma curva leve, e a saia (anel) logo abaixo do chapéu.
		const lb = Math.max(5, larg * 0.12), lt = Math.max(3.5, larg * 0.08);
		base += `<path d="M ${f(xb - lb)} ${BASE + 8} Q ${f((xb + xt) / 2 - lb)} ${f(BASE - alt * 0.5)} ${f(xt - lt)} ${f(yt)} L ${f(xt + lt)} ${f(yt)} Q ${f((xb + xt) / 2 + lb)} ${f(BASE - alt * 0.5)} ${f(xb + lb)} ${BASE + 8} Z" fill="#fff" stroke="none" opacity=".7"/>`;
		if (larg > 40) base += `<path d="M ${f(xt - lt * 1.9)} ${f(yt + alt * 0.12)} Q ${f(xt)} ${f(yt + alt * 0.12 + 6)} ${f(xt + lt * 1.9)} ${f(yt + alt * 0.12)}" stroke-width="1.6" opacity=".7"/>`;
		// Lamelas sob o chapéu.
		for (let k = -3; k <= 3; k++) base += `<line x1="${f(xt + k * lt * 0.5)}" y1="${f(yt)}" x2="${f(xt + k * w * 0.27)}" y2="${f(yt - 3)}" stroke-width=".9" opacity=".6"/>`;
		// Chapéu: cúpula com a borda de baixo levemente côncava e pintas vazadas (regra par-ímpar).
		let d = `M ${f(xt - w)} ${f(yt - 2)} C ${f(xt - w)} ${f(yt - h * 1.15)} ${f(xt - w * 0.35)} ${f(yt - h * 1.3)} ${f(xt)} ${f(yt - h * 1.3)} C ${f(xt + w * 0.35)} ${f(yt - h * 1.3)} ${f(xt + w)} ${f(yt - h * 1.15)} ${f(xt + w)} ${f(yt - 2)} Q ${f(xt)} ${f(yt - 8)} ${f(xt - w)} ${f(yt - 2)} Z`;
		const rr = sorteio(Math.round(xb * 7 + alt));
		for (let k = 0; k < Math.round(larg / 18); k++) { const px = xt + (rr() - 0.5) * w * 1.2, py = yt - h * (0.35 + rr() * 0.7), pr = 1.6 + rr() * larg * 0.035; d += ` M ${f(px - pr)} ${f(py)} a ${f(pr)} ${f(pr)} 0 1 0 ${f(pr * 2)} 0 a ${f(pr)} ${f(pr)} 0 1 0 ${f(-pr * 2)} 0 Z`; }
		const giro = f((Math.atan2(xt - xb, alt) * 180) / Math.PI * 0.9);
		// Um reflexo mais claro no alto do chapéu dá volume; o chapéu se inclina junto com o talo.
		chapeus[g] += `<g transform="rotate(${giro} ${f(xt)} ${f(yt)})"><path d="${d}" fill="#fff" fill-rule="evenodd" stroke="none" opacity=".8"/><ellipse cx="${f(xt - w * 0.32)}" cy="${f(yt - h * 0.9)}" rx="${f(w * 0.34)}" ry="${f(h * 0.22)}" transform="rotate(-18 ${f(xt - w * 0.32)} ${f(yt - h * 0.9)})" fill="#fff" stroke="none"/></g>`;
		halos[g] += `<ellipse cx="${f(xt)}" cy="${f(yt - h * 0.6)}" rx="${f(w * 2.1)}" ry="${f(h * 2)}" fill="url(#h)" stroke="none"/>`;
	}
	salvar('bosque-cogumelos-base', base);
	for (const g of [0, 1]) {
		salvar(`bosque-cogumelos-chapeus-${g + 1}`, chapeus[g]);
		salvar(`bosque-cogumelos-halos-${g + 1}`, HALO + halos[g]);
	}
	// Esporos de luz: pontos macios espalhados por cima do ninho, em três grupos.
	const re = sorteio(91);
	for (const g of [0, 1, 2]) {
		let e = '';
		for (let i = 0; i < 5; i++) { const x = 60 + re() * 280, y = 60 + re() * 230, s = 3 + re() * 4; e += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s * 2.6)}" fill="url(#h)" stroke="none"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(s * 0.32)}" fill="#fff" stroke="none"/>`; }
		salvar(`bosque-esporos-${g + 1}`, HALO + e);
	}
}

// ---- Radar: anéis, mira e alvos (o feixe é um gradiente cônico do CSS) ----
{
	let g = circ(70, 1.6) + circ(140, 1.6) + circ(196, 2) + '<line x1="4" y1="200" x2="396" y2="200" stroke-width="1.2"/><line x1="200" y1="4" x2="200" y2="396" stroke-width="1.2"/>';
	for (let a = 0; a < 360; a += 10) { const t = (a * Math.PI) / 180, l = a % 30 ? 8 : 18, [x1, y1] = polar(196 - l, t), [x2, y2] = polar(196, t); g += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="1.6"/>`; }
	salvar('radar-aneis', g);
	salvar('radar-alvos', [[120, 140], [270, 110], [250, 290]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="none"/><circle cx="${x}" cy="${y}" r="13" stroke-width="1.4"/>`).join(''));
}

// ---- Circuito: um processador inteiro perto do canto, com as trilhas saindo pela direita e por baixo da tela (o chip
// não é cortado pela borda; quem continua para fora são os fios). Pulsos de luz correm por algumas trilhas: cada
// máscara chip-dados-* guarda duas, uma para o pulso do ::before e outra para o do ::after (animacoes.css) ----
{
	// Desloca uma polilinha para o lado, com quinas em meia-esquadria (barramento paralelo nas dobras de 45 graus).
	const paralela = (pts, d) => {
		const normal = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [-dy / l, dx / l]; };
		return pts.map((b, i) => {
			const a = pts[i - 1], c = pts[i + 1];
			if (!a || !c) { const n = a ? normal(a, b) : normal(b, c); return [b[0] + n[0] * d, b[1] + n[1] * d]; }
			const n1 = normal(a, b), n2 = normal(b, c), k = 1 + n1[0] * n2[0] + n1[1] * n2[1];
			return [b[0] + ((n1[0] + n2[0]) * d) / k, b[1] + ((n1[1] + n2[1]) * d) / k];
		});
	};
	const linha = (pts) => 'M ' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ');
	const cx = 240, cy = 200, m = 50, ks = [-36, -24, -12, 0, 12, 24, 36];
	const tr = {}, vias = [];
	// Direita: um leque até a borda da tela.
	ks.forEach((o, k) => { const x = cx + m + 10, y2 = cy + o * 1.7; tr[`D${k}`] = [[x, cy + o], [x + 12, cy + o], [x + 12 + Math.abs(o * 0.7), y2], [410, y2]]; });
	// Baixo: outro leque, até a borda de baixo.
	ks.forEach((o, k) => { const y = cy + m + 10, x2 = cx + o * 1.7; tr[`B${k}`] = [[cx + o, y], [cx + o, y + 12], [x2, y + 12 + Math.abs(o * 0.7)], [x2, 410]]; });
	// Cima: sobe, dobra para a direita e também sai pela borda direita.
	const cima = [[cx, cy - m - 10], [cx, cy - m - 34], [cx + 70, cy - m - 104], [410, cy - m - 104]];
	ks.forEach((o, k) => { tr[`C${k}`] = paralela(cima, o); });
	// Esquerda: pinos de teste curtos, cada um numa via, em degraus.
	ks.forEach((o, k) => { const x2 = cx - m - 24 - [8, 22, 8, 30, 8, 22, 8][k]; tr[`E${k}`] = [[cx - m - 10, cy + o], [x2, cy + o]]; vias.push([x2 - 4, cy + o]); });
	let pernas = '';
	for (const o of ks) pernas += `M ${cx + o} ${cy - m - 10} V ${cy - m} M ${cx + o} ${cy + m} V ${cy + m + 10} M ${cx - m - 10} ${cy + o} H ${cx - m} M ${cx + m} ${cy + o} H ${cx + m + 10} `;
	let miolo = '';
	for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) miolo += `<rect x="${cx + i * 13 - 5}" y="${cy - 6 + j * 13 - 5}" width="10" height="10" fill="#fff" stroke="none" opacity="${i || j ? 0.45 : 0.8}"/>`;
	const todas = Object.values(tr).map((t) => `<path d="${linha(t)}"/>`).join('');
	salvar('chip-placa', `<g stroke-width="2" stroke-linejoin="round">${todas}</g>` + vias.map(([x, y]) => `<circle cx="${f(x)}" cy="${y}" r="4" stroke-width="1.8"/>`).join('')
		+ `<path d="${pernas}" stroke-width="3.4"/><rect x="${cx - m}" y="${cy - m}" width="${2 * m}" height="${2 * m}" rx="5" stroke-width="2.6"/><rect x="${cx - m + 6}" y="${cy - m + 6}" width="${2 * m - 12}" height="${2 * m - 12}" rx="3" stroke-width="1" opacity=".5"/>`
		+ `<rect x="${cx - 24}" y="${cy - 30}" width="48" height="48" rx="2" stroke-width="1.6"/>${miolo}<circle cx="${cx - m + 12}" cy="${cy - m + 12}" r="3" fill="#fff" stroke="none"/>`);
	salvar('chip-nucleo', `${HALO}<circle cx="${cx}" cy="${cy - 6}" r="60" fill="url(#h)" stroke="none" opacity=".7"/>`);
	// Os pulsos: nas máscaras de x, a trilha de cima (C) é do ::before e a do leque da direita (D) do ::after; nas de y,
	// a do lado esquerdo do leque de baixo é do ::before e a do lado direito do ::after.
	// O halo é um traço largo desfocado dentro da própria máscara: o desfoque é calculado uma vez, quando o navegador
	// rasteriza a máscara, e não a cada quadro (um drop-shadow no CSS seria refeito o tempo todo).
	const brilho = (w, h) => `<defs><filter id="b" filterUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><feGaussianBlur stdDeviation="3.5"/></filter></defs>`;
	const pulso = (d) => `<g stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke-width="10" opacity=".7" filter="url(#b)"/><path d="${d}" stroke-width="3.2"/></g>`;
	const dados = (a, b) => brilho(400, 400) + pulso(`${linha(tr[a])} ${linha(tr[b])}`);
	salvar('chip-dados-1', dados('C1', 'D4'));
	salvar('chip-dados-2', dados('C5', 'D1'));
	salvar('chip-dados-3', dados('B1', 'B4'));
	salvar('chip-dados-4', dados('B2', 'B6'));
	// Segunda decoração, só na página inicial: um barramento que sobe da borda de baixo pela margem esquerda, passa por
	// um chip de passagem (R7) e termina em vias. Um pulso sobe pela trilha da esquerda e outro pela da direita.
	const bus = [[58, 530], [58, 300], [100, 258], [100, 140]], fins = [120, 150, 104, 136, 160];
	const pistas = [-28, -14, 0, 14, 28].map((d, k) => { const t = paralela(bus, d); t[3][1] = fins[k]; return t; });
	const corte = '<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="520"><rect width="160" height="520" fill="#fff"/><rect x="14" y="390" width="88" height="40" fill="#000"/></mask></defs>';
	let r7 = `<rect x="18" y="392" width="80" height="36" rx="3" stroke-width="2"/><circle cx="26" cy="400" r="2.2" fill="#fff" stroke="none"/>`;
	for (const d of [-28, -14, 0, 14, 28]) r7 += `<path d="M ${58 + d} 382 V 392 M ${58 + d} 428 V 438" stroke-width="3"/>`;
	salvar('chip-barramento', `${corte}<g mask="url(#m)" stroke-width="2" stroke-linejoin="round">${pistas.map((t) => `<path d="${linha(t)}"/>`).join('')}</g>` + pistas.map((t) => `<circle cx="${f(t[3][0])}" cy="${f(t[3][1] - 4)}" r="4" stroke-width="1.8"/>`).join('') + r7, '0 0 160 520');
	salvar('chip-barramento-dados', brilho(160, 520) + `${corte}<g mask="url(#m)">${pulso(`${linha(pistas[0])} ${linha(pistas[4])}`)}</g>`, '0 0 160 520');
}

// ---- Navegação: planeta de pé, com uma órbita inclinada em duas metades: a de trás, tracejada, some atrás do
// planeta; a da frente, contínua, passa por cima dele. O satélite que corre na órbita é desenhado pelo CSS
// (animacoes.css), com a mesma elipse: centro (200, 200), semieixos 150 e 42, inclinada 16 graus. A órbita inteira
// ocupa 72% da largura da peça, para caber na coluna do índice sem sair da tela ----
{
	let p = circ(115, 2.2);
	for (let k = -3; k <= 3; k++) { const y = 200 + k * 29, rx = Math.sqrt(115 * 115 - (k * 29) ** 2); p += `<ellipse cx="200" cy="${y}" rx="${f(rx)}" ry="${f(rx * 0.16)}" stroke-width="1.1" opacity=".7"/>`; }
	for (const k of [1, 2, 3]) p += `<ellipse cx="200" cy="200" rx="${f(115 * Math.cos((k * Math.PI) / 8))}" ry="115" stroke-width="1.1" opacity=".7"/>`;
	salvar('planeta', p);
	const arco = (lado, extra) => `<path d="M 50 200 A 150 42 0 0 ${lado} 350 200" transform="rotate(-16 200 200)" ${extra}/>`;
	salvar('orbita-tras', `<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400"><rect width="400" height="400" fill="#fff"/><circle cx="200" cy="200" r="119" fill="#000"/></mask></defs><g mask="url(#m)">${arco(1, 'stroke-width="1.6" stroke-dasharray="7 8"')}</g>`);
	salvar('orbita-frente', arco(0, 'stroke-width="8" opacity=".18"') + arco(0, 'stroke-width="2.4"'));
	// Segunda decoração, só na página inicial: uma lua pequena na margem esquerda, com a rota tracejada até um ponto
	// de destino; de tempos em tempos uma nave sai da lua e percorre a rota (o movimento é do CSS: a peça "nave" fica
	// no começo da rota, e o CSS a desloca pelo vetor da rota, 45 x −270 de 160 x 440).
	let lua = '<circle cx="62" cy="370" r="34" stroke-width="2"/>';
	for (const k of [-1, 0, 1]) { const y = 370 + k * 13, rx = Math.sqrt(34 * 34 - (k * 13) ** 2); lua += `<ellipse cx="62" cy="${y}" rx="${f(rx)}" ry="${f(rx * 0.18)}" stroke-width="1" opacity=".7"/>`; }
	lua += '<ellipse cx="62" cy="370" rx="14" ry="34" stroke-width="1" opacity=".7"/>';
	salvar('lua', lua, '0 0 160 440');
	salvar('rota', '<path d="M 79 340.6 L 124 70" stroke-width="1.8" stroke-dasharray="2 7" stroke-linecap="round"/><path d="M 124 52 L 132 60 L 124 68 L 116 60 Z" stroke-width="1.8"/><circle cx="124" cy="60" r="16" stroke-width="1" stroke-dasharray="3 4"/>', '0 0 160 440');
	const ang = (Math.atan2(70 - 340.6, 124 - 79) * 180) / Math.PI + 90;
	salvar('nave', `<defs><linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g transform="translate(79 340.6) rotate(${f(ang)})"><rect x="-1.2" y="4" width="2.4" height="26" fill="url(#r)" stroke="none"/><path d="M 0 -8 L 6 6 L 0 2.5 L -6 6 Z" fill="#fff" stroke="none"/></g>`, '0 0 160 440');
}

// ---- Vitral: rosácea gótica. A pedra (aro, doze lancetas, o hexafólio do meio e o óculo) fica parada; o vidro, em três
// grupos (lancetas pares, ímpares e o miolo), acende e apaga devagar em ritmos diferentes, como luz passando atrás. ----
{
	const R1 = 70, R2 = 176, N = 12;
	// Lanceta: um arco ogival entre os raios R1 e R2, apontado para fora.
	const lanceta = (k, enc = 0) => {
		const a = (k / N) * Math.PI * 2 - Math.PI / 2, meia = Math.PI / N - 0.035 - enc / 160;
		const [x1, y1] = polar(R1 + 4 + enc, a - meia * 0.7), [x2, y2] = polar(R1 + 4 + enc, a + meia * 0.7);
		const [o1x, o1y] = polar(R2 - 34, a - meia + enc / 200), [o2x, o2y] = polar(R2 - 34, a + meia - enc / 200), [px, py] = polar(R2 - 2 - enc, a);
		const [c1x, c1y] = polar(R2 - 12, a - meia * 0.85), [c2x, c2y] = polar(R2 - 12, a + meia * 0.85);
		return `M ${f(x1)} ${f(y1)} L ${f(o1x)} ${f(o1y)} Q ${f(c1x)} ${f(c1y)} ${f(px)} ${f(py)} Q ${f(c2x)} ${f(c2y)} ${f(o2x)} ${f(o2y)} L ${f(x2)} ${f(y2)} Z`;
	};
	let pedra = circ(194, 9) + circ(182, 2.5) + circ(R1, 6) + circ(30, 5);
	for (let k = 0; k < N; k++) pedra += `<path d="${lanceta(k)}" stroke-width="5" stroke-linejoin="round"/>`;
	// Hexafólio: seis círculos em volta do óculo; e um trevo pequeno entre cada par de lancetas, junto do aro.
	for (let k = 0; k < 6; k++) { const [x, y] = polar(46, (k / 6) * Math.PI * 2); pedra += `<circle cx="${f(x)}" cy="${f(y)}" r="17" stroke-width="3.5"/>`; }
	for (let k = 0; k < N; k++) { const [x, y] = polar(166, ((k + 0.5) / N) * Math.PI * 2 - Math.PI / 2); pedra += `<circle cx="${f(x)}" cy="${f(y)}" r="8" stroke-width="2.6"/>`; }
	salvar('rosacea-pedra', pedra);
	const vidro = (filtro) => Array.from({ length: N }, (_, k) => k).filter(filtro).map((k) => `<path d="${lanceta(k, 3)}" fill="#fff" stroke="none"/>`).join('');
	salvar('rosacea-vidro-1', vidro((k) => k % 2 === 0));
	salvar('rosacea-vidro-2', vidro((k) => k % 2 === 1));
	let miolo = '<circle cx="200" cy="200" r="27" fill="#fff" stroke="none"/>';
	for (let k = 0; k < 6; k++) { const [x, y] = polar(46, (k / 6) * Math.PI * 2); miolo += `<circle cx="${f(x)}" cy="${f(y)}" r="15" fill="#fff" stroke="none" opacity=".8"/>`; }
	for (let k = 0; k < N; k++) { const [x, y] = polar(166, ((k + 0.5) / N) * Math.PI * 2 - Math.PI / 2); miolo += `<circle cx="${f(x)}" cy="${f(y)}" r="6.5" fill="#fff" stroke="none"/>`; }
	salvar('rosacea-vidro-3', miolo);
}

// Lanceta alta (segunda decoração do Vitral): uma janela estreita de duas lancetas e um óculo, num quadro de 160 x 520,
// com o vidro em dois grupos que acendem alternados, como a rosácea.
{
	const W = 160, H = 520, cx = 80, topo = 30, ombro = 120, base = 500;
	const arco = (x0, x1, t, o) => `M ${x0} ${base} V ${o} Q ${x0} ${t + 14} ${(x0 + x1) / 2} ${t} Q ${x1} ${t + 14} ${x1} ${o} V ${base} Z`;
	let pedra = `<path d="${arco(14, 146, topo, ombro)}" stroke-width="7" stroke-linejoin="round"/><path d="${arco(24, 136, topo + 14, ombro + 4)}" stroke-width="1.6" opacity=".6"/>`;
	pedra += `<line x1="${cx}" y1="196" x2="${cx}" y2="${base}" stroke-width="5"/>`;
	pedra += `<path d="${arco(26, 78, 168, 206)}" stroke-width="4" stroke-linejoin="round"/><path d="${arco(82, 134, 168, 206)}" stroke-width="4" stroke-linejoin="round"/>`;
	pedra += '<circle cx="80" cy="118" r="30" stroke-width="4"/>';
	for (const a of [0, 90, 180, 270]) { const t = (a * Math.PI) / 180; pedra += `<circle cx="${f(80 + Math.cos(t) * 13)}" cy="${f(118 + Math.sin(t) * 13)}" r="13" stroke-width="2.4"/>`; }
	// Barras de chumbo do vidro, de tanto em tanto.
	for (let y = 250; y < base; y += 46) pedra += `<line x1="28" y1="${y}" x2="76" y2="${y + 8}" stroke-width="2" opacity=".7"/><line x1="84" y1="${y + 8}" x2="132" y2="${y}" stroke-width="2" opacity=".7"/>`;
	pedra += `<rect x="4" y="${base}" width="152" height="14" fill="#fff" stroke="none"/>`;
	salvar('vitral-lanceta-pedra', pedra, `0 0 ${W} ${H}`);
	salvar('vitral-lanceta-vidro-1', `<path d="${arco(29, 75, 174, 208)}" fill="#fff" stroke="none"/><circle cx="80" cy="118" r="26" fill="#fff" stroke="none" opacity=".75"/>`, `0 0 ${W} ${H}`);
	salvar('vitral-lanceta-vidro-2', `<path d="${arco(85, 131, 174, 208)}" fill="#fff" stroke="none"/>${[0, 90, 180, 270].map((a) => { const t = (a * Math.PI) / 180; return `<circle cx="${f(80 + Math.cos(t) * 13)}" cy="${f(118 + Math.sin(t) * 13)}" r="10.5" fill="#fff" stroke="none"/>`; }).join('')}`, `0 0 ${W} ${H}`);
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

// ---- Poeira macia em ladrilho quadrado (já desfocada no desenho, sem filtro no navegador). As partículas da fantasia
// agora são os ladrilhos largos fantasia-* (mais abaixo); fica só a poeira, que pode servir a outro tema. ----
for (const [nome, t, n, forma] of [
	['poeira', 300, 14, (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f(4 + r() * 4)}" fill="url(#h)"/>`],
]) {
	const r = sorteio(2000 + t);
	let g = '';
	for (let i = 0; i < n; i++) g += forma(f(10 + r() * (t - 20)), f(10 + r() * (t - 20)), r);
	fs.writeFileSync(`${DIR}/sobe-${nome}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">${HALO}${g}</svg>\n`);
}

// Trepadeira (segunda decoração do Bosque): dois ramos de hera que descem do alto da margem, com campânulas que brilham.
// Cada ramo é uma peça (talo e folhas) num quadro de 160 x 520, com as flores e o halo delas à parte, para pulsar; o
// ramo e o halo dele balançam juntos em volta do ponto onde o ramo se prende, no alto.
{
	const folha = (x, y, ang, e) => `<path d="M 0 0 C -6 -2 -10 -8 -8 -13 C -5 -11 -3 -11 0 -15 C 3 -11 5 -11 8 -13 C 10 -8 6 -2 0 0 Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)}) scale(${f(e)})" fill="#fff" stroke="none"/>`;
	const campanula = (x, y, e) => `<path d="M ${f(x)} ${f(y)} q 2 6 0 10" stroke-width="1.2"/><path d="M -5 0 Q -5.5 7 -8 11 Q 0 9 8 11 Q 5.5 7 5 0 Q 0 -3 -5 0 Z" transform="translate(${f(x)} ${f(y + 10)}) scale(${f(e)})" fill="#fff" stroke="none"/>`;
	const ramo = (x0, comp, fase, sem) => {
		const r = sorteio(sem);
		let talo = `M ${x0} 0`, folhas = '', flores = '', halos = '';
		const pts = [];
		for (let i = 0; i <= 26; i++) { const t = i / 26, y = t * comp, x = x0 + Math.sin(t * 5 + fase) * 14 * (0.3 + t); pts.push([x, y]); talo += ` L ${f(x)} ${f(y)}`; }
		pts.forEach(([x, y], i) => {
			if (i < 2) return;
			const lado = i % 2 ? 1 : -1, e = 0.8 + r() * 0.5 - (i / 26) * 0.2;
			if (i % 2 === 0 || r() < 0.3) folhas += folha(x + lado * 3, y, lado * (60 + r() * 40) + 180, e * 1.15);
			if (i % 6 === 3) { flores += campanula(x - lado * 4, y + 2, 1 + r() * 0.3); halos += `<circle cx="${f(x - lado * 4)}" cy="${f(y + 17)}" r="${f(18 + r() * 6)}" fill="url(#h)" stroke="none"/>`; }
		});
		return { corpo: `<path d="${talo}" stroke-width="2.2" stroke-linecap="round"/>${folhas}`, halos: halos + flores };
	};
	const a = ramo(70, 470, 0.6, 81), b = ramo(108, 300, 2.4, 83);
	salvar('bosque-hera-1', a.corpo, '0 0 160 520');
	salvar('bosque-hera-1-brilho', HALO + a.halos, '0 0 160 520');
	salvar('bosque-hera-2', b.corpo, '0 0 160 520');
	salvar('bosque-hera-2-brilho', HALO + b.halos, '0 0 160 520');
}

// Estandarte anão (segunda decoração da Forja): um pano de rabo de andorinha pendurado numa vara, com borda, losangos e
// uma runa de ligação no meio que esquenta; tudo num quadro de 160 x 520, balançando em volta do gancho, no alto.
{
	let pano = '<path d="M 80 4 L 74 14 H 86 Z" fill="#fff" stroke="none"/><path d="M 80 14 L 22 30 M 80 14 L 138 30" stroke-width="1.4"/>';
	pano += '<rect x="14" y="28" width="132" height="7" rx="3.5" fill="#fff" stroke="none"/><circle cx="12" cy="31.5" r="6" fill="#fff" stroke="none"/><circle cx="148" cy="31.5" r="6" fill="#fff" stroke="none"/>';
	pano += '<path d="M 28 35 H 132 V 450 L 80 410 L 28 450 Z" fill="#fff" fill-opacity=".2" stroke-width="2" stroke-linejoin="round"/>';
	pano += '<path d="M 38 46 H 122 V 430 L 80 398 L 38 430 Z" stroke-width="1" stroke-linejoin="round" opacity=".75"/>';
	for (const y of [70, 340]) pano += [50, 80, 110].map((x) => `<path d="M ${x} ${y - 7} L ${x + 7} ${y} L ${x} ${y + 7} L ${x - 7} ${y} Z" fill="#fff" stroke="none" opacity=".8"/>`).join('');
	pano += '<path d="M 46 96 H 114 M 46 314 H 114" stroke-width="1.2" opacity=".7"/>';
	// Borlas nas duas pontas de baixo.
	for (const x of [28, 132]) pano += `<path d="M ${x} 450 V 462" stroke-width="1.4"/><path d="M ${x - 5} 462 H ${x + 5} L ${x + 3} 488 H ${x - 3} Z" fill="#fff" stroke="none" opacity=".85"/>`;
	salvar('forja-estandarte', pano, '0 0 160 520');
	// A runa do meio, em traço grosso, com o brilho já desenhado em volta.
	const runa = '<path d="M 80 120 V 290 M 80 150 L 112 182 L 80 214 M 80 214 L 48 246 L 80 278 M 52 140 L 80 168 L 108 140" stroke-linecap="round" stroke-linejoin="round"/>';
	salvar('forja-estandarte-runa', `<defs><filter id="b" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="6"/></filter></defs><g stroke-width="9" opacity=".6" filter="url(#b)">${runa}</g><g stroke-width="5">${runa}</g>`, '0 0 160 520');
}

// ---- Partículas da fantasia (página e capa): ladrilhos largos e de proporções diferentes, para nenhum padrão se
// repetir em colunas à vista (o ladrilho quadrado de 300 px mostrava a mesma coluna de bolhas três vezes na tela).
// Cada tema usa duas ou três camadas de ladrilhos diferentes, em velocidades e balanços diferentes. Quem encosta na
// borda é repetido do outro lado, para o ladrilho emendar sem corte. ----
{
	const ladrilho = (nome, w, h, n, forma, semente, margem = 14) => {
		const r = sorteio(semente);
		let g = '';
		for (let i = 0; i < n; i++) {
			const x = r() * w, y = r() * h, desenho = forma(r);
			for (const dx of [0, -w, w]) for (const dy of [0, -h, h]) {
				const cx = x + dx, cy = y + dy;
				if (cx < -margem || cx > w + margem || cy < -margem || cy > h + margem) continue;
				g += `<g transform="translate(${f(cx)} ${f(cy)})">${desenho}</g>`;
			}
		}
		fs.writeFileSync(`${DIR}/${nome}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${HALO}${g}</svg>\n`);
	};
	const mancha = (r0, r1) => (r) => `<circle r="${f(r0 + r() * (r1 - r0))}" fill="url(#h)"/>`;
	// Grimório: poeira dourada fina, em dois tamanhos.
	ladrilho('fantasia-poeira-a', 940, 380, 14, mancha(3.5, 7), 3101);
	ladrilho('fantasia-poeira-b', 700, 560, 9, (r) => `<circle r="${f(6 + r() * 5)}" fill="url(#h)" opacity=".7"/><circle r="1.1" fill="#fff"/>`, 3102);
	// Vitral: luzes coloridas grandes e macias que sobem devagar.
	ladrilho('fantasia-luzes-a', 980, 420, 8, mancha(9, 17), 3201, 20);
	ladrilho('fantasia-luzes-b', 760, 600, 6, mancha(5, 10), 3202, 20);
	// Forja: brasas alongadas (a cauda para baixo, de quem sobe rápido) e fagulhas miúdas.
	ladrilho('fantasia-brasas-a', 900, 320, 16, (r) => `<ellipse rx="${f(2.6 + r() * 1.8)}" ry="${f(6 + r() * 5)}" cy="3" fill="url(#h)"/><circle r="1.3" fill="#fff"/>`, 3301);
	ladrilho('fantasia-brasas-b', 680, 470, 14, (r) => `<circle r="${f(1 + r() * 1.2)}" fill="#fff" opacity="${f(0.5 + r() * 0.5)}"/>`, 3302);
	// Abissal: bolhas de vidro com brilho, pequenas e rápidas numa camada, grandes e lentas na outra.
	const bolha = (s0, s1) => (r) => { const s = s0 + r() * (s1 - s0); return `<circle r="${f(s)}" fill="none" stroke="#fff" stroke-width="1.3" opacity=".8"/><circle cx="${f(-s * 0.38)}" cy="${f(-s * 0.38)}" r="${f(Math.max(0.9, s * 0.24))}" fill="#fff"/>`; };
	ladrilho('fantasia-bolhas-a', 980, 420, 12, bolha(2.5, 5), 3401);
	ladrilho('fantasia-bolhas-b', 740, 600, 7, bolha(5, 10), 3402, 16);
	// Bosque: vaga-lumes que não sobem: vagam e piscam. Três camadas de ladrilho só na horizontal (a altura cobre a faixa).
	ladrilho('fantasia-vagalumes-a', 1080, 640, 7, (r) => `<circle r="${f(9 + r() * 6)}" fill="url(#h)"/><circle r="1.9" fill="#fff"/>`, 3501, 24);
	ladrilho('fantasia-vagalumes-b', 860, 640, 6, (r) => `<circle r="${f(7 + r() * 5)}" fill="url(#h)"/><circle r="1.6" fill="#fff"/>`, 3502, 24);
	ladrilho('fantasia-vagalumes-c', 690, 640, 5, (r) => `<circle r="${f(10 + r() * 6)}" fill="url(#h)" opacity=".8"/><circle r="2" fill="#fff"/>`, 3503, 24);
}

for (const arq of fs.readdirSync(DIR)) if (fs.statSync(`${DIR}/${arq}`).mtimeMs < INICIO) fs.rmSync(`${DIR}/${arq}`);
console.log(fs.readdirSync(DIR).length, 'peças em', DIR);
