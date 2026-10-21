// Captura telas dos temas visuais com o Edge headless, contra o servidor de desenvolvimento.
// Uso: node tools/capturar-temas.mjs <pasta de saída> [temas separados por vírgula] [páginas separadas por vírgula]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = 'http://localhost:4321/star-stream/';
const [, , saida = 'capturas', temasArg, paginasArg] = process.argv;

const temas = (temasArg || 'atual,constelacao,observatorio,holograma,nebulosa,codex,grimorio').split(',');
const PAGINAS = {
	inicio: { url: '', tam: '1440,1100' },
	arquetipo: { url: 'arquetipos/vanguarda/', tam: '1440,1100' },
	historico: { url: 'historicos/netrunner/', tam: '1440,1100' },
	tabela: { url: 'personagem/estilos-de-combate/', tam: '1440,1100' },
	celular: { url: 'combate/ataque-e-dano/', tam: '390,844' },
};
const paginas = (paginasArg || Object.keys(PAGINAS).join(',')).split(',');
const MODOS = { constelacao: 'escuro', observatorio: 'escuro', holograma: 'escuro', nebulosa: 'escuro', codex: 'claro', grimorio: 'claro', atual: 'escuro' };

fs.mkdirSync(saida, { recursive: true });
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-temas-'));
for (const tema of temas) {
	for (const nome of paginas) {
		const p = PAGINAS[nome];
		const arquivo = path.resolve(saida, `${tema}-${nome}.png`);
		const url = `${BASE}${p.url}?tema=${tema}&modo=${MODOS[tema] || 'escuro'}&captura`;
		execFileSync(EDGE, [
			'--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${perfil}`,
			`--window-size=${p.tam}`, '--virtual-time-budget=6000', `--screenshot=${arquivo}`, url,
		], { stdio: 'ignore' });
		console.log('ok', tema, nome);
	}
}
fs.rmSync(perfil, { recursive: true, force: true });
