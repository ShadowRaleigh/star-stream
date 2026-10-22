// Deriva, das poucas cores de cada paleta (src/cores.mjs), tudo o que ela precisa: as variáveis de CSS e as cores
// dos ornamentos e das capas.
import { MATIZES_SCIFI, PALETAS_ASTRA, PALETAS_FANTASIA } from '../src/cores.mjs';

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const paraHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
export const mistura = (a, b, t) => paraHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
export const rgb = (h) => hex(h).join(' ');

// Cores-base de uma paleta sci-fi num modo: principal, destaque, tinta (texto) e fundo.
export function baseScifi(corId, modo) {
	const m = MATIZES_SCIFI[corId];
	if (modo === 'escuro') {
		const [main, seg] = m.e;
		return { main, seg, tinta: mistura(main, '#ffffff', 0.86), bg: mistura(main, '#030406', 0.955) };
	}
	const [main, seg] = m.c;
	return { main, seg, tinta: mistura(main, '#000000', 0.82), bg: mistura(main, '#ffffff', 0.965) };
}

// Variáveis de CSS de uma paleta sci-fi, no formato que familia-scifi.css espera.
export function varsScifi(tema, corId, modo) {
	const b = baseScifi(corId, modo), claro = modo === 'claro';
	const g = (claro ? [0.08, 0.25, 0.45, 0.65, 0.85, 0.93, 0.96] : [0.12, 0.32, 0.52, 0.72, 0.86, 0.93]).map((t) => mistura(b.tinta, b.bg, t));
	const selo = tema === 'holograma' ? `selo-holograma-${corId}-${modo}` : `selo-${tema}-${corId}-${modo}`;
	return {
		'--ss-ciano': b.main,
		'--ss-violeta': b.seg,
		'--ss-ciano-rgb': rgb(b.main),
		'--ss-violeta-rgb': rgb(b.seg),
		'--ss-painel-rgb': claro ? '255 255 255' : rgb(mistura(b.main, b.bg, 0.92)),
		'--ss-tinta-botao': mistura(b.main, '#000000', 0.88),
		'--ss-selo': `url('/star-stream/temas/${selo}.svg')`,
		'--ss-capa-escuro': `url('/star-stream/temas/capa-${tema}-${corId}-escuro.svg')`,
		'--ss-capa-claro': `url('/star-stream/temas/capa-${tema}-${corId}-claro.svg')`,
		'--sl-color-accent-low': mistura(b.main, b.bg, claro ? 0.85 : 0.8),
		'--sl-color-accent': b.main,
		'--sl-color-accent-high': mistura(b.main, claro ? '#000000' : '#ffffff', 0.55),
		'--sl-color-white': b.tinta,
		...Object.fromEntries(g.map((x, i) => [`--sl-color-gray-${i + 1}`, x])),
		'--sl-color-black': b.bg,
		'--sl-color-bg-nav': `rgb(${rgb(b.bg)} / 0.9)`,
		'--sl-color-bg-sidebar': `rgb(${rgb(b.bg)} / 0.72)`,
		'--sl-color-hairline': `rgb(${rgb(b.main)} / ${claro ? 0.18 : 0.14})`,
		'--sl-color-hairline-light': `rgb(${rgb(b.main)} / ${claro ? 0.3 : 0.26})`,
		'--ss-fundo': claro
			? `linear-gradient(rgb(${rgb(b.main)} / 0.05) 1px, transparent 1px) 0 0 / 32px 32px, linear-gradient(90deg, rgb(${rgb(b.main)} / 0.05) 1px, transparent 1px) 0 0 / 32px 32px, ${b.bg}`
			: `radial-gradient(ellipse 60% 50% at 85% 0%, rgb(${rgb(b.main)} / 0.14), transparent 70%), radial-gradient(ellipse 50% 40% at 5% 100%, rgb(${rgb(b.seg)} / 0.08), transparent 70%), linear-gradient(rgb(${rgb(b.main)} / 0.035) 1px, transparent 1px) 0 0 / 32px 32px, linear-gradient(90deg, rgb(${rgb(b.main)} / 0.035) 1px, transparent 1px) 0 0 / 32px 32px, ${b.bg}`,
		'--ss-tabela-cabecalho': `rgb(${rgb(b.main)} / 0.08)`,
		'--ss-tabela-listra': `rgb(${rgb(b.main)} / 0.03)`,
	};
}

// Cores que as artes de capa e as marcas d'água usam.
export function capaScifi(tema, corId, modo) {
	const b = baseScifi(corId, modo), claro = modo === 'claro';
	const fundo = [claro ? '#ffffff' : b.bg, mistura(b.bg, b.main, claro ? 0.05 : 0.04), mistura(b.bg, b.main, claro ? 0.12 : 0.09)];
	// A Navegação desenha o planeta na cor da tinta e usa a cor principal na rota, como na paleta padrão.
	if (tema === 'navegacao') return { fundo, linha: claro ? b.tinta : mistura(b.main, '#ffffff', 0.85), fraca: mistura(b.tinta, b.bg, 0.55), estrela: b.tinta, brilho: b.main };
	return { fundo, linha: b.main, fraca: mistura(b.main, b.bg, 0.5), estrela: b.tinta, brilho: b.seg };
}

// ---- Família fantasia ----

const MANCHAS_FANTASIA = 'radial-gradient(ellipse 38% 30% at 14% 64%, rgb(0 0 0 / 0.3), transparent 70%), radial-gradient(ellipse 32% 26% at 86% 30%, rgb(0 0 0 / 0.24), transparent 70%), radial-gradient(ellipse 30% 24% at 64% 92%, rgb(0 0 0 / 0.22), transparent 70%)';
const PAPEL_FANTASIA = { grimorio: 'pergaminho', bosque: 'papel-bosque', vitral: 'papel-vitral', forja: 'papel-forja', mapa: 'papel-mapa', abissal: 'papel-abissal' };
const f2 = (n) => Math.round(n * 100) / 100;

// Cores dos ornamentos de uma paleta: cantos (metal), florão (tinta) e a textura da capa de material.
export function ornamentoFantasia(tema, cor) {
	const p = PALETAS_FANTASIA[tema][cor];
	const c = hex(p.couro).map((v) => v / 255);
	return {
		canto: mistura(p.ouro, p.tinta, 0.2),
		florao: mistura(p.tinta, p.rubrica, 0.35),
		material: {
			fina: { freq: 0.8, semente: 4, cor: [...c.map((v) => +(v * 0.85).toFixed(3)), 0.35] },
			larga: { freq: 0.012, semente: 12, cor: [...c.map((v) => +(v * 0.35).toFixed(3)), 0.5] },
		},
	};
}

// Variáveis de CSS de uma paleta de fantasia, no formato que familia-fantasia.css espera.
export function varsFantasia(tema, cor) {
	const p = PALETAS_FANTASIA[tema][cor];
	const arq = (nome) => `url('/star-stream/temas/${nome}.svg')`;
	const couroEscuro = mistura(p.couro, '#000000', 0.35), ouroClaro = mistura(p.ouro, '#ffffff', 0.35);
	const sepia = mistura(p.tinta, p.ouro, 0.5), w = mistura(ouroClaro, '#ffffff', 0.6);
	const acento = (t) => `linear-gradient(180deg, ${mistura(p.rubrica, '#ffffff', 0.08)}, ${mistura(p.rubrica, '#000000', t)})`;
	const pagina = [0, 0.12, 0.35, 0.55, 0.72, 0.82, 0.88].map((t) => mistura(p.tinta, p.papel, t));
	const fora = [0.08, 0.2, 0.38, 0.6, 0.8, 0.9].map((t) => mistura(w, couroEscuro, t));
	const vars = {
		'--ss-ouro': p.ouro,
		'--ss-ouro-rgb': rgb(p.ouro),
		'--ss-ouro-claro': ouroClaro,
		'--ss-rubrica': p.rubrica,
		'--ss-rubrica-rgb': rgb(p.rubrica),
		'--ss-tinta': p.tinta,
		'--ss-tinta-forte': mistura(p.tinta, '#000000', 0.4),
		'--ss-tinta-suave': mistura(p.tinta, p.papel, 0.25),
		'--ss-pergaminho': p.papel,
		'--ss-couro': p.couro,
		'--ss-couro-rgb': rgb(p.couro),
		'--ss-couro-escuro': couroEscuro,
		'--ss-material': arq(`material-${tema}-${cor}`),
		'--ss-capa-fundo': `linear-gradient(180deg, ${mistura(p.couro, '#ffffff', 0.06)}, ${p.couro})`,
		'--ss-papel-textura': arq(PAPEL_FANTASIA[tema]),
		'--ss-papel-claro': mistura(p.papel, '#ffffff', 0.3),
		'--ss-papel-escuro': mistura(p.papel, '#000000', 0.08),
		'--ss-sepia-rgb': rgb(sepia),
		'--ss-realce-rgb': rgb(mistura(p.papel, '#ffffff', 0.7)),
		'--ss-canto-se': arq(`canto-${tema}-${cor}-se`),
		'--ss-canto-sd': arq(`canto-${tema}-${cor}-sd`),
		'--ss-canto-ie': arq(`canto-${tema}-${cor}-ie`),
		'--ss-canto-id': arq(`canto-${tema}-${cor}-id`),
		'--ss-florao': arq(`florao-${tema}-${cor}`),
		'--ss-fita': acento(0.2),
		'--ss-fita-texto': mistura(p.papel, '#ffffff', 0.5),
		'--ss-capitular-1': mistura(p.rubrica, '#ffffff', 0.1),
		'--ss-capitular-2': mistura(p.rubrica, '#000000', 0.3),
		'--ss-botao': acento(0.25),
		'--sl-color-accent-low': mistura(p.rubrica, p.papel, 0.8),
		'--sl-color-accent': p.rubrica,
		'--sl-color-accent-high': mistura(p.rubrica, '#000000', 0.4),
		'--sl-color-white': mistura(p.tinta, '#000000', 0.2),
		...Object.fromEntries(pagina.map((x, i) => [`--sl-color-gray-${i + 1}`, x])),
		'--sl-color-text': p.tinta,
		'--sl-color-text-accent': p.rubrica,
		'--sl-color-hairline': `rgb(${rgb(sepia)} / 0.3)`,
		'--sl-color-hairline-light': `rgb(${rgb(sepia)} / 0.45)`,
		// O fundo leva só o grão em ladrilho; as manchas grandes são gradientes que não se repetem (como nos arquivos dos temas).
		'--ss-fundo': `${arq(`grao-${tema}-${cor}`)} 0 0 / 300px, ${arq(`grao-${tema}-${cor}`)} 137px 61px / 437px, ${MANCHAS_FANTASIA}, radial-gradient(ellipse at 50% 0%, ${mistura(p.couro, '#ffffff', 0.08)}, ${couroEscuro} 70%), ${couroEscuro}`,
		'--ss-tabela-cabecalho': `rgb(${rgb(p.rubrica)} / 0.08)`,
		'--ss-tabela-listra': `rgb(${rgb(sepia)} / 0.06)`,
	};
	// Fora da página (cabeçalho e barras laterais), a tinta clara sobre a capa.
	const varsFora = {
		'--sl-color-white': w,
		...Object.fromEntries(fora.map((x, i) => [`--sl-color-gray-${i + 1}`, x])),
		'--sl-color-black': couroEscuro,
		'--sl-color-text': fora[0],
		'--sl-color-text-accent': ouroClaro,
		'--sl-color-accent': ouroClaro,
		'--sl-color-accent-high': mistura(ouroClaro, '#ffffff', 0.4),
		'--sl-color-accent-low': mistura(p.couro, '#ffffff', 0.1),
		'--sl-color-hairline': `rgb(${rgb(p.ouro)} / 0.25)`,
		'--sl-color-hairline-light': `rgb(${rgb(p.ouro)} / 0.4)`,
	};
	// As partículas das animações (vaga-lumes, brasas, bolhas) e a rosa dos ventos do Mapa, nas cores da paleta.
	const luz = { bosque: p.luz, forja: p.brasa, abissal: p.luzAgua }[tema];
	if (luz) vars['--ss-luz'] = luz;
	if (tema === 'mapa') vars['--ss-mar'] = p.mar;
	if (tema === 'abissal') Object.assign(vars, { '--ss-alga': p.alga, '--ss-medusa': p.medusa });
	// --ss-vitral-parede: a cor do alto da parede da capa, que preenche a faixa de cima quando a capa estreita mostra a arte inteira.
	if (tema === 'vitral') Object.assign(vars, { '--ss-vidro-a': p.vidros[0], '--ss-vidro-b': p.vidros[1], '--ss-vitral-parede': mistura(p.couro, '#ffffff', 0.06) });
	// O Grimório monta a capa com os cantos e o couro (o selo do meio são camadas na cor do metal, em animacoes.css).
	if (tema === 'grimorio') vars['--ss-capa-centro'] = mistura(p.couro, '#ffffff', 0.12);
	return { vars, varsFora, capa: tema === 'grimorio' ? null : `capa-${tema}-${cor}` };
}

// Cores da arte da capa de cada tema de fantasia, nas paletas extras.
export function arteFantasia(tema, cor) {
	const p = PALETAS_FANTASIA[tema][cor];
	const escuro = mistura(p.couro, '#000000', 0.35);
	switch (tema) {
		case 'bosque':
			return { fundo: [mistura(p.couro, p.folha, 0.18), p.couro, escuro], linha: mistura(p.couro, '#000000', 0.2), fraca: mistura(p.folha, p.couro, 0.5), estrela: mistura(p.luz, '#ffffff', 0.5), brilho: mistura(p.luz, '#ffffff', 0.4), folha: p.folha, folha2: mistura(p.folha, '#000000', 0.3), vaga: p.luz };
		case 'vitral':
			return { fundo: [mistura(p.couro, '#ffffff', 0.06), escuro], junta: '#07060a', pedra: mistura(p.couro, '#ffffff', 0.15), prata: mistura(p.ouro, '#ffffff', 0.3), chumbo: '#0b0a0f', luz: mistura(p.papel, '#ffffff', 0.4), vidros: p.vidros.map((v) => [mistura(v, '#ffffff', 0.15), mistura(v, '#000000', 0.55)]) };
		case 'forja':
			return { fundo: [mistura(p.couro, '#ffffff', 0.08), p.couro, escuro], linha: p.ouro, junta: '#0a0909', brasa: p.brasa, brilho: mistura(p.brasa, '#ffffff', 0.5) };
		case 'mapa':
			return { fundo: [mistura(p.papel, '#ffffff', 0.4), p.papel, mistura(p.papel, '#000000', 0.15)], tinta: p.tinta, mar: p.mar, terra: mistura(p.papel, '#000000', 0.06), floresta: p.floresta, rota: p.rota };
		case 'abissal':
			return { fundo: p.agua, luz: p.luzAgua, alga: p.alga, areia: p.areia, coral: p.coral, medusa: p.medusa };
		default:
			return null;
	}
}

// ---- Família Astra ----

// Cores-base de uma paleta Astra num modo. O Codex parte do ouro, da tinta e do papel; o escuro dele sai da tinta.
export function baseAstra(tema, cor, modo) {
	const p = PALETAS_ASTRA[tema][cor];
	if (tema === 'codex') {
		return modo === 'claro'
			? { acento: mistura(p.ouro, '#000000', 0.12), bg: p.papel, tinta: p.tinta, alto: p.tinta }
			: { acento: mistura(p.ouro, '#ffffff', 0.3), bg: mistura(p.tinta, '#000000', 0.55), tinta: mistura(p.papel, '#000000', 0.04), alto: mistura(p.ouro, '#ffffff', 0.6) };
	}
	return { ...(modo === 'claro' ? p.c : p.e) };
}

const arqT = (nome) => `url('/star-stream/temas/${nome}.svg')`;

// Variáveis de CSS de uma paleta Astra num modo, e as regras de capa que não cabem em variáveis.
export function varsAstra(tema, cor, modo) {
	const b = baseAstra(tema, cor, modo), claro = modo === 'claro', p = PALETAS_ASTRA[tema][cor];
	const g = (claro ? [0.08, 0.22, 0.42, 0.62, 0.84, 0.92, 0.95] : [0.08, 0.25, 0.45, 0.65, 0.85, 0.93]).map((t) => mistura(b.tinta, b.bg, t));
	const v = {
		'--sl-color-accent-low': mistura(b.acento, b.bg, 0.82),
		'--sl-color-accent': b.acento,
		'--sl-color-accent-high': b.alto || mistura(b.acento, claro ? '#000000' : '#ffffff', claro ? 0.45 : 0.55),
		'--sl-color-white': b.tinta,
		...Object.fromEntries(g.map((x, i) => [`--sl-color-gray-${i + 1}`, x])),
		'--sl-color-black': b.bg,
		'--sl-color-bg-nav': `rgb(${rgb(b.bg)} / 0.88)`,
		'--sl-color-bg-sidebar': `rgb(${rgb(b.bg)} / 0.6)`,
		'--sl-color-hairline': `rgb(${rgb(b.acento)} / ${claro ? 0.22 : 0.16})`,
		'--sl-color-hairline-light': `rgb(${rgb(b.acento)} / ${claro ? 0.32 : 0.26})`,
		'--ss-tabela-cabecalho': `rgb(${rgb(b.acento)} / 0.1)`,
		'--ss-tabela-listra': `rgb(${rgb(b.tinta)} / 0.03)`,
	};
	const regras = [];
	const ceuEscuro = `radial-gradient(ellipse 80% 50% at 70% -10%, rgb(${rgb(mistura(b.acento, '#6e508c', 0.5))} / 0.22), transparent 70%), radial-gradient(ellipse 60% 40% at 0% 100%, rgb(${rgb(mistura(b.acento, '#284678', 0.6))} / 0.25), transparent 70%), ${arqT('estrelas-claras-largo')} 0 0 / 1200px, ${b.bg}`;
	const ceuClaro = `${arqT('estrelas-tinta-largo')} 0 0 / 1200px, ${b.bg}`;
	switch (tema) {
		case 'constelacao': {
			const e = baseAstra(tema, cor, 'escuro');
			Object.assign(v, {
				'--ss-ouro': b.acento,
				'--ss-ouro-forte': mistura(b.acento, claro ? '#000000' : '#ffffff', 0.3),
				'--ss-ouro-rgb': rgb(e.acento),
				'--ss-cartao-rgb': rgb(mistura(e.bg, e.acento, 0.06)),
				'--ss-botao-1': mistura(e.acento, '#ffffff', 0.45),
				'--ss-botao-2': e.acento,
				'--ss-botao-tinta': mistura(e.acento, '#000000', 0.88),
				'--ss-fundo': claro ? ceuClaro : ceuEscuro,
			});
			regras.push(['.ss-capa', { 'background-image': arqT(`capa-constelacao-${cor}`) }]);
			break;
		}
		case 'classico': {
			v['--ss-fundo'] = claro ? ceuClaro : ceuEscuro;
			const r = (lado) => `${arqT(`regua-${lado}-classico-${cor}-${modo}`)}`;
			regras.push(['.ss-capa', { background: `${r('cima')} left top / auto 12px repeat-x, ${r('baixo')} left bottom / auto 12px repeat-x, ${r('esq')} left top / 12px auto repeat-y, ${r('dir')} right top / 12px auto repeat-y, ${arqT(`capa-classico-${cor}-${modo}`)} center / cover` }]);
			regras.push(['.ss-capa::before', { background: `radial-gradient(ellipse 38% 46% at center, rgb(${rgb(b.bg)} / ${claro ? 0.9 : 0.85}), rgb(${rgb(b.bg)} / 0) 100%)` }]);
			break;
		}
		case 'observatorio': {
			const e = baseAstra(tema, cor, 'escuro');
			Object.assign(v, {
				'--ss-latao': b.acento,
				'--ss-latao-claro': mistura(b.acento, claro ? '#000000' : '#ffffff', claro ? 0.25 : 0.35),
				'--ss-botao-tinta': mistura(b.acento, '#000000', 0.88),
				'--ss-fundo': claro ? b.bg : `radial-gradient(ellipse 70% 60% at 100% 0%, rgb(${rgb(b.acento)} / 0.08), transparent 70%), ${b.bg}`,
				'--ss-capa-estrelas': arqT(`estrelas-observatorio-${cor}`),
				'--ss-capa-1': mistura(e.bg, e.acento, 0.12),
				'--ss-capa-2': mistura(e.bg, e.acento, 0.04),
				'--ss-capa-3': mistura(e.bg, '#000000', 0.2),
				'--ss-capa-metal-rgb': rgb(e.acento),
				'--ss-capa-claro-1': mistura(b.bg, '#ffffff', 0.5),
				'--ss-capa-claro-2': mistura(b.bg, b.acento, 0.18),
			});
			break;
		}
		case 'nebulosa': {
			const e = baseAstra(tema, cor, 'escuro');
			Object.assign(v, {
				'--ss-rosa': b.acento,
				'--ss-pessego': b.pessego,
				'--ss-lilas': b.lilas,
				'--ss-rosa-rgb': rgb(e.acento),
				'--ss-pessego-rgb': rgb(e.pessego),
				'--ss-lilas-rgb': rgb(e.lilas),
				'--ss-noite-rgb': rgb(e.bg),
				'--ss-botao-tinta': mistura(e.acento, '#000000', 0.85),
				'--ss-matiz': e.matiz,
				'--ss-vidro': claro ? `rgb(${rgb(mistura(b.bg, '#ffffff', 0.6))} / 0.72)` : `rgb(${rgb(mistura(b.bg, '#ffffff', 0.04))} / 0.62)`,
				'--sl-color-bg-nav': `rgb(${rgb(b.bg)} / ${claro ? 0.7 : 0.55})`,
				'--sl-color-bg-sidebar': `rgb(${rgb(b.bg)} / ${claro ? 0.55 : 0.45})`,
				'--ss-fundo': [[55, 45, 18, 22, 'lilas', 0.24], [50, 42, 82, 72, 'acento', 0.22], [34, 28, 62, 14, 'pessego', 0.15], [40, 34, 34, 86, 'acento', 0.13], [26, 22, 90, 20, 'lilas', 0.14]].map(([w, h, x, y, cor, op]) => `radial-gradient(ellipse ${w}% ${h}% at ${x}% ${y}%, rgb(${rgb(e[cor])} / ${claro ? f2(op * 0.65) : op}), transparent 70%)`).join(', ') + `, url('/star-stream/temas/${claro ? 'estrelas-tinta-largo' : 'estrelas-claras-largo'}.svg') 0 0 / 1200px, ${b.bg}`,
			});
			break;
		}
		case 'codex': {
			const c = baseAstra(tema, cor, 'claro'), e = baseAstra(tema, cor, 'escuro');
			Object.assign(v, {
				'--ss-ouro': p.ouro,
				'--ss-tinta': p.tinta,
				'--ss-papel': p.papel,
				'--ss-papel-rgb': rgb(p.papel),
				'--ss-noite': e.bg,
				'--ss-noite-rgb': rgb(e.bg),
				'--ss-link-claro': mistura(p.tinta, '#2a5aa0', 0.25),
				'--ss-capa-estrelas-claro': arqT(`estrelas-codex-${cor}-claro`),
				'--ss-capa-estrelas-escuro': arqT(`estrelas-codex-${cor}-escuro`),
				'--ss-fundo': claro ? `${arqT(`estrelas-codex-${cor}-claro-largo`)} 0 0 / 1200px, ${c.bg}` : `${arqT(`estrelas-codex-${cor}-escuro-largo`)} 0 0 / 1200px, ${e.bg}`,
				'--sl-color-bg-nav': b.bg,
				'--sl-color-bg-sidebar': mistura(b.bg, b.tinta, 0.03),
			});
			break;
		}
		case 'astrolabio':
			Object.assign(v, {
				'--ss-latao': b.acento,
				'--ss-latao-claro': mistura(b.acento, claro ? '#000000' : '#ffffff', claro ? 0.3 : 0.35),
				'--ss-botao-tinta': mistura(b.acento, '#000000', 0.88),
				'--ss-fundo': claro ? b.bg : ceuEscuro,
			});
			regras.push(['.ss-capa', { 'background-image': arqT(`capa-astrolabio-${cor}-${modo}`) }]);
			break;
	}
	return { vars: v, regras };
}

// Cores das artes de capa desenhadas (Clássico e Astrolábio) e das peças recoloridas (Observatório e Codex).
export function capaAstra(tema, cor, modo) {
	const b = baseAstra(tema, cor, modo), claro = modo === 'claro';
	const fundo = claro ? [mistura(b.bg, '#ffffff', 0.5), b.bg, mistura(b.bg, b.acento, 0.12)] : [mistura(b.bg, b.acento, 0.1), mistura(b.bg, b.acento, 0.03), mistura(b.bg, '#000000', 0.25)];
	if (tema === 'constelacao') return { fundo: [mistura(b.bg, b.acento, 0.1), mistura(b.bg, '#ffffff', 0.02), mistura(b.bg, '#000000', 0.4)], acento: b.acento, marfim: b.tinta, violeta: mistura(b.acento, '#8a6ac0', 0.55), azul: mistura(b.acento, '#3a5a9a', 0.65) };
	if (tema === 'classico') return { fundo, linha: claro ? b.tinta : b.acento, fraca: mistura(b.tinta, b.bg, 0.5), estrela: b.tinta, brilho: claro ? b.acento : mistura(b.acento, '#ffffff', 0.2) };
	if (tema === 'astrolabio') return { fundo, linha: claro ? b.tinta : b.acento, fraca: mistura(b.tinta, b.bg, 0.45), estrela: b.tinta, brilho: b.acento };
	// Observatório e Codex: só a cor do anel e das estrelas.
	if (tema === 'codex') return { anel: claro ? b.tinta : b.acento, estrelas: claro ? b.tinta : b.acento };
	return { anel: claro ? b.tinta : b.acento, estrelas: b.acento };
}
