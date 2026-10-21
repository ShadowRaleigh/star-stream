// Filma as animações de um tema: tira vários quadros de uma região da página ao longo do tempo e monta duas imagens,
// para conferir animação em movimento (captura parada não mostra tremor, piscar, salto nem emenda de ladrilho).
//   <saída>-quadros.jpg  os quadros lado a lado, em ordem, com o tempo de cada um;
//   <saída>-movimento.jpg o que mudou entre os quadros (claro = mexeu muito). Linha clara onde nada deveria se mexer
//                         denuncia piscar; o desenho de cada peça mostra se ela se move do jeito pretendido.
// Uso: node tools/filmar-tema.mjs <tema> [opções]
//   --pagina inicio|arquetipo|historico|tabela   (padrão: inicio)
//   --modo escuro|claro                          (padrão: escuro)
//   --cor <paleta>                               (padrão: a primeira do tema)
//   --regiao capa|canto|tela|x,y,largura,altura  (padrão: capa; canto = 640 x 520 do canto de baixo à direita)
//   --quadros 12   --intervalo 500 (ms)   --largura 1440   --altura 900   --celular (390 x 844, com toque)
//   --saida <caminho sem extensão>              (padrão: filmes/<tema>-<regiao>)
// Precisa do servidor de desenvolvimento em http://localhost:4321/star-stream/.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = 'http://localhost:4321/star-stream/';
const PAGINAS = { inicio: '', arquetipo: 'arquetipos/vanguarda/', historico: 'historicos/netrunner/', tabela: 'personagem/estilos-de-combate/', dano: 'combate/ataque-e-dano/' };

const args = process.argv.slice(2);
const tema = args[0];
if (!tema || tema.startsWith('--')) throw new Error('Informe o tema: node tools/filmar-tema.mjs <tema> [opções]');
const opc = (nome, padrao) => { const i = args.indexOf(`--${nome}`); return i < 0 ? padrao : args[i + 1]; };
const celular = args.includes('--celular');
const pagina = opc('pagina', 'inicio'), modo = opc('modo', 'escuro'), cor = opc('cor', ''), regiao = opc('regiao', 'capa');
const quadros = Number(opc('quadros', 12)), intervalo = Number(opc('intervalo', 500));
const largura = celular ? 390 : Number(opc('largura', 1440)), altura = celular ? 844 : Number(opc('altura', 900));
const saida = opc('saida', `filmes/${tema}-${regiao.replace(/,/g, '_')}${celular ? '-celular' : ''}`);
const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));

const PORTA = 9335 + Math.floor(Math.random() * 400);
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-filme-'));
const edge = spawn(EDGE, ['--headless=new', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${perfil}`, `--remote-debugging-port=${PORTA}`, 'about:blank'], { stdio: 'ignore' });
let alvo;
for (let i = 0; i < 60 && !alvo; i++) {
	try { alvo = (await (await fetch(`http://127.0.0.1:${PORTA}/json/list`)).json()).find((t) => t.type === 'page'); } catch {}
	if (!alvo) await pausa(250);
}
if (!alvo) throw new Error('O Edge não abriu a porta de depuração.');
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
await new Promise((ok) => ws.addEventListener('open', ok, { once: true }));
let proximo = 0;
const pendentes = new Map(), eventos = new Map();
ws.addEventListener('message', (m) => {
	const d = JSON.parse(m.data);
	if (d.id && pendentes.has(d.id)) { pendentes.get(d.id)(d.result ?? d.error); pendentes.delete(d.id); }
	else if (d.method && eventos.has(d.method)) { eventos.get(d.method)(); eventos.delete(d.method); }
});
const cdp = (method, params = {}) => new Promise((ok) => { const id = ++proximo; pendentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const quando = (method) => new Promise((ok) => eventos.set(method, ok));

try {
	await cdp('Page.enable');
	await cdp('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: 1, mobile: celular });
	await cdp('Emulation.setTouchEmulationEnabled', { enabled: celular, maxTouchPoints: celular ? 5 : 0 });
	const url = `${BASE}${PAGINAS[pagina] ?? pagina}?tema=${tema}&modo=${modo}${cor ? `&cor=${cor}` : ''}`;
	const carregou = quando('Page.loadEventFired');
	await cdp('Page.navigate', { url });
	await Promise.race([carregou, pausa(15000)]);
	await pausa(1500);

	// A região: a capa da página inicial, o canto de baixo à direita da tela, a tela toda ou um retângulo dado.
	let clip;
	if (regiao === 'capa') {
		const r = await cdp('Runtime.evaluate', { expression: 'JSON.stringify((() => { const e = document.querySelector(".ss-capa"); e.scrollIntoView({ block: "center" }); const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; })())', returnByValue: true });
		const [x, y, w, h] = JSON.parse(r.result.value);
		await pausa(300);
		clip = { x: Math.max(0, x - 8), y: Math.max(0, y - 8), width: w + 16, height: h + 16, scale: 1 };
	} else if (regiao === 'canto') clip = { x: largura - Math.min(640, largura), y: altura - Math.min(520, altura), width: Math.min(640, largura), height: Math.min(520, altura), scale: 1 };
	else if (regiao === 'tela') clip = { x: 0, y: 0, width: largura, height: altura, scale: 1 };
	else { const [x, y, w, h] = regiao.split(',').map(Number); clip = { x, y, width: w, height: h, scale: 1 }; }
	clip = Object.fromEntries(Object.entries(clip).map(([k, v]) => [k, Math.round(v)]));

	const imgs = [], tempos = [];
	const inicio = Date.now();
	for (let i = 0; i < quadros; i++) {
		const alvoT = inicio + i * intervalo;
		if (Date.now() < alvoT) await pausa(alvoT - Date.now());
		tempos.push(((Date.now() - inicio) / 1000).toFixed(1));
		const { data } = await cdp('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: false });
		imgs.push(Buffer.from(data, 'base64'));
	}

	// Folha de quadros: até 3 por linha, cada um reduzido para caber em 600 px de largura, com o tempo em cima.
	const larg = Math.min(600, clip.width), alt = Math.round((clip.height * larg) / clip.width), cols = Math.min(3, quadros), lins = Math.ceil(quadros / cols), faixa = 22;
	const pecas = [];
	for (const [i, img] of imgs.entries()) {
		const x = (i % cols) * (larg + 6), y = Math.floor(i / cols) * (alt + faixa + 6);
		pecas.push({ input: await sharp(img).resize(larg, alt).png().toBuffer(), left: x, top: y + faixa });
		pecas.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${larg}" height="${faixa}"><text x="4" y="16" font-family="Consolas, monospace" font-size="14" fill="#fff">${tema} · ${tempos[i]} s</text></svg>`), left: x, top: y });
	}
	fs.mkdirSync(path.dirname(path.resolve(saida)), { recursive: true });
	await sharp({ create: { width: cols * (larg + 6), height: lins * (alt + faixa + 6), channels: 3, background: '#202020' } }).composite(pecas).jpeg({ quality: 84 }).toFile(`${saida}-quadros.jpg`);

	// Mapa de movimento: a maior diferença de cada pixel entre quadros seguidos, ampliada para ficar visível.
	const crus = await Promise.all(imgs.map((b) => sharp(b).removeAlpha().raw().toBuffer({ resolveWithObject: true })));
	const { width: W, height: H } = crus[0].info, mov = Buffer.alloc(W * H);
	for (let k = 1; k < crus.length; k++) {
		const a = crus[k - 1].data, b = crus[k].data;
		for (let p = 0; p < W * H; p++) { const d = Math.max(Math.abs(a[p * 3] - b[p * 3]), Math.abs(a[p * 3 + 1] - b[p * 3 + 1]), Math.abs(a[p * 3 + 2] - b[p * 3 + 2])); if (d > mov[p]) mov[p] = d; }
	}
	for (let p = 0; p < mov.length; p++) mov[p] = Math.min(255, mov[p] * 4);
	await sharp(mov, { raw: { width: W, height: H, channels: 1 } }).resize(Math.min(1200, W)).jpeg({ quality: 84 }).toFile(`${saida}-movimento.jpg`);
	console.log(`${saida}-quadros.jpg\n${saida}-movimento.jpg`);
} finally {
	cdp('Browser.close');
	await pausa(300);
	ws.close();
	edge.kill();
	await pausa(300);
	try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}
}
