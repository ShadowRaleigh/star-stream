// Junta capturas de vários temas num mosaico, para comparar lado a lado.
// Uso: node tools/mosaico-temas.mjs <pasta> <página> <saída.png> [largura de cada quadro] [temas]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [, , pasta, pagina, saida, larguraArg = '720', temasArg] = process.argv;
const temas = (temasArg || 'constelacao,observatorio,holograma,nebulosa,codex,grimorio').split(',');
const largura = Number(larguraArg);
const quadros = [];
for (const t of temas) {
	const f = path.join(pasta, `${t}-${pagina}.png`);
	if (!fs.existsSync(f)) continue;
	quadros.push({ t, buf: await sharp(f).resize({ width: largura }).png().toBuffer() });
}
const metas = await Promise.all(quadros.map((q) => sharp(q.buf).metadata()));
const altura = Math.max(...metas.map((m) => m.height));
const colunas = Math.min(3, quadros.length);
const linhas = Math.ceil(quadros.length / colunas);
const gap = 12;
const rotulo = (txt) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="34"><rect width="100%" height="100%" fill="#000" opacity=".7"/><text x="12" y="23" font-family="Segoe UI, sans-serif" font-size="18" font-weight="700" fill="#fff">${txt}</text></svg>`);
const composicao = [];
quadros.forEach((q, i) => {
	const x = (i % colunas) * (largura + gap);
	const y = Math.floor(i / colunas) * (altura + gap);
	composicao.push({ input: q.buf, left: x, top: y }, { input: rotulo(`${i + 1}. ${q.t}`), left: x, top: y });
});
await sharp({ create: { width: colunas * largura + (colunas - 1) * gap, height: linhas * altura + (linhas - 1) * gap, channels: 3, background: '#222' } })
	.composite(composicao)
	.png()
	.toFile(saida);
console.log('mosaico', saida);
