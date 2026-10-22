// Captura telas dos temas visuais com o Edge headless, contra o servidor de desenvolvimento.
// Uso: node tools/capturar-temas.mjs <pasta de saída> [temas separados por vírgula] [páginas separadas por vírgula] [alt]
// O Edge é controlado pelo protocolo de depuração (DevTools): cada página é aberta com a tela emulada no tamanho
// certo, inclusive a de celular (a opção --window-size do Edge não encolhe a janela até 390 px e recortava a página).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = 'http://localhost:4321/';
// Porta sorteada: com várias capturas ou filmagens ao mesmo tempo, uma não se conecta ao navegador da outra.
const PORTA = 20000 + Math.floor(Math.random() * 20000);
const [, , saida = 'capturas', temasArg, paginasArg, inverter] = process.argv;

// Modo em que cada tema é capturado por padrão (o argumento "alt" inverte).
const MODOS = { classico: 'escuro', constelacao: 'escuro', observatorio: 'escuro', nebulosa: 'escuro', codex: 'claro', astrolabio: 'escuro', grimorio: 'claro', bosque: 'claro', vitral: 'claro', forja: 'claro', mapa: 'claro', abissal: 'claro', holograma: 'escuro', radar: 'escuro', circuito: 'escuro', navegacao: 'escuro' };
const temas = (temasArg || Object.keys(MODOS).join(',')).split(',');
const PAGINAS = {
	inicio: { url: '', largura: 1440, altura: 1100 },
	arquetipo: { url: 'arquetipos/vanguarda/', largura: 1440, altura: 1100 },
	historico: { url: 'historicos/netrunner/', largura: 1440, altura: 1100 },
	tabela: { url: 'personagem/estilos-de-combate/', largura: 1440, altura: 1100 },
	celular: { url: 'combate/ataque-e-dano/', largura: 390, altura: 844, celular: true },
	'celular-inicio': { url: '', largura: 390, altura: 844, celular: true },
};
const paginas = (paginasArg || Object.keys(PAGINAS).join(',')).split(',');
const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));

const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-temas-'));
const edge = spawn(EDGE, ['--headless=new', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${perfil}`, `--remote-debugging-port=${PORTA}`, 'about:blank'], { stdio: 'ignore' });

// Espera o Edge abrir a porta de depuração e pega a aba em branco.
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
	if (d.id && pendentes.has(d.id)) { pendentes.get(d.id)(d.result); pendentes.delete(d.id); }
	else if (d.method && eventos.has(d.method)) { eventos.get(d.method)(); eventos.delete(d.method); }
});
const cdp = (method, params = {}) => new Promise((ok) => { const id = ++proximo; pendentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const quando = (method) => new Promise((ok) => eventos.set(method, ok));

await cdp('Page.enable');
fs.mkdirSync(saida, { recursive: true });
// As telas de computador vêm antes das de celular: depois que o Edge emula toque, a página continua sem "hover" e os
// ícones de âncora dos títulos apareceriam nas capturas de computador.
const capturas = paginas.flatMap((nome) => temas.map((tema) => [tema, nome])).sort(([, a], [, b]) => Number(Boolean(PAGINAS[a].celular)) - Number(Boolean(PAGINAS[b].celular)));
for (const [tema, nome] of capturas) {
	const p = PAGINAS[nome];
	const cor = process.env.COR;
	const arquivo = path.resolve(saida, `${tema}${cor ? `-${cor}` : ''}-${nome}${inverter ? '-alt' : ''}.png`);
	const url = `${BASE}${p.url}?tema=${tema}&modo=${(MODOS[tema] === 'claro') !== Boolean(inverter) ? 'claro' : 'escuro'}${cor ? `&cor=${cor}` : ''}&captura`;
	await cdp('Emulation.setDeviceMetricsOverride', { width: p.largura, height: p.altura, deviceScaleFactor: 1, mobile: Boolean(p.celular) });
	await cdp('Emulation.setTouchEmulationEnabled', { enabled: Boolean(p.celular), maxTouchPoints: p.celular ? 5 : 0 });
	const carregou = quando('Page.loadEventFired');
	await cdp('Page.navigate', { url });
	await Promise.race([carregou, pausa(15000)]);
	// Tempo para as fontes e as imagens de fundo chegarem.
	await pausa(1200);
	const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
	fs.writeFileSync(arquivo, Buffer.from(data, 'base64'));
	console.log('ok', tema, nome);
}
// O Browser.close não responde (a conexão fecha antes): não espera a resposta.
cdp('Browser.close');
await pausa(300);
ws.close();
edge.kill();
await pausa(500);
try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}
