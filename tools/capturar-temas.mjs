// Captura telas dos temas visuais com o Edge headless, contra o servidor de desenvolvimento.
// Uso: node tools/capturar-temas.mjs <pasta de saída> [temas separados por vírgula] [páginas separadas por vírgula]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = 'http://localhost:4321/star-stream/';
const [, , saida = 'capturas', temasArg, paginasArg, inverter] = process.argv;

const temas = (temasArg || 'atual,constelacao,observatorio,holograma,nebulosa,codex,grimorio').split(',');
const PAGINAS = {
	inicio: { url: '', tam: '1440,1100' },
	arquetipo: { url: 'arquetipos/vanguarda/', tam: '1440,1100' },
	historico: { url: 'historicos/netrunner/', tam: '1440,1100' },
	tabela: { url: 'personagem/estilos-de-combate/', tam: '1440,1100' },
	celular: { url: 'combate/ataque-e-dano/', tam: '390,844' },
};
const paginas = (paginasArg || Object.keys(PAGINAS).join(',')).split(',');
const MODOS = { constelacao: 'escuro', observatorio: 'escuro', holograma: 'escuro', nebulosa: 'escuro', codex: 'claro', grimorio: 'claro', atual: 'escuro', astrolabio: 'escuro', carta: 'claro' };
const esperar = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

fs.mkdirSync(saida, { recursive: true });
for (const tema of temas) {
	for (const nome of paginas) {
		const p = PAGINAS[nome];
		const arquivo = path.resolve(saida, `${tema}-${nome}${inverter ? '-alt' : ''}.png`);
		// Um perfil novo por captura: com o mesmo perfil, o Edge repassa a URL a uma instância já aberta e não salva nada.
		const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-temas-'));
		fs.rmSync(arquivo, { force: true });
		const url = `${BASE}${p.url}?tema=${tema}&modo=${(MODOS[tema] === 'claro') !== Boolean(inverter) ? 'claro' : 'escuro'}&captura`;
		execFileSync(EDGE, [
			'--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${perfil}`,
			`--window-size=${p.tam}`, '--virtual-time-budget=8000', `--screenshot=${arquivo}`, url,
		], { stdio: 'ignore' });
		const fim = Date.now() + 30000;
		while (!fs.existsSync(arquivo) && Date.now() < fim) esperar(250);
		esperar(400);
		try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}
		console.log(fs.existsSync(arquivo) ? 'ok' : 'FALHOU', tema, nome);
	}
}
