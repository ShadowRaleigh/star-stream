// Mede, na tela de verdade, se uma estrela do rio da Constelação anda em frações de pixel no Firefox: abre o Firefox
// com janela (placa de vídeo), deixa só uma camada de estrelas sobre fundo preto, captura um recorte da tela do
// Windows várias vezes e acompanha o centro de brilho da estrela mais forte. As capturas do próprio navegador não
// servem para isso: o Firefox encaixa camadas em pixels inteiros só na composição que vai para a tela.
// Uso: [FX=0.55] [FY=0.1] node tools/medir-interpolacao-firefox.mjs <rótulo> [css extra] [camada 2|3|7]
//   FX e FY: onde fica o recorte, em fração da largura e da altura da capa. Saída: "quadros parados" alto e passos de
//   ~0,9 px seguidos de zeros = encaixe em pixel (tranco); passos pequenos e contínuos = interpolação certa.
// Abre uma janela do Firefox por alguns segundos, com perfil temporário. Precisa do servidor de desenvolvimento.
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const [, , rotulo = 'atual', cssExtra = '', camada = '7'] = process.argv;
const FF = 'C:/Program Files/Mozilla Firefox/firefox.exe';
const PORTA = 20000 + Math.floor(Math.random() * 20000);
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-tela-'));
const ff = spawn(FF, ['--no-remote', '-profile', perfil, `--remote-debugging-port=${PORTA}`, '--width=1440', '--height=900'], { stdio: 'ignore' });
const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));
let ws;
for (let i = 0; i < 80 && !ws; i++) {
	try {
		const s = new WebSocket(`ws://127.0.0.1:${PORTA}/session`);
		await new Promise((ok, erro) => { s.addEventListener('open', ok, { once: true }); s.addEventListener('error', erro, { once: true }); });
		ws = s;
	} catch { await pausa(250); }
}
let id = 0;
const pend = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } });
const bidi = (method, params = {}) => new Promise((ok) => { const i = ++id; pend.set(i, ok); ws.send(JSON.stringify({ id: i, method, params })); });
await bidi('session.new', { capabilities: {} });
const ctx = (await bidi('browsingContext.getTree', {})).result.contexts[0].context;
// Sem TEMA: o rio da Constelação, isolado. Com TEMA (e PAGINA, REGIAO="x,y" em px da janela): qualquer partícula ou
// objeto que se mexa nessa região, com o CSS extra que vier. EIXO=y mede o passo vertical (partículas que sobem).
const tema = process.env.TEMA;
await bidi('browsingContext.navigate', { context: ctx, url: `http://localhost:4321/star-stream/${process.env.PAGINA || ''}?tema=${tema || 'constelacao'}&modo=${process.env.MODO || 'escuro'}`, wait: 'complete' });
await pausa(3500);
const avalia = async (expression) => (await bidi('script.evaluate', { expression, target: { context: ctx }, awaitPromise: true, resultOwnership: 'none' })).result?.result?.value;
const H = "[data-ss-tema='constelacao'] .ss-capa-camadas i";
const outras = [1, 2, 3, 4, 5, 6, 7].filter((n) => String(n) !== camada).map((n) => `:nth-child(${n})`).join(',');
const css = tema ? cssExtra : `.ss-ambiente{display:none!important} [data-ss-tema='constelacao'] .ss-capa{background:#000!important} [data-ss-tema='constelacao'] .ss-capa::before{display:none!important} ${H}:is(${outras}){display:none!important} .ss-capa img{opacity:0!important} ${H}:nth-child(${camada}){-webkit-mask:none!important;mask:none!important} ${cssExtra}`;
await avalia(`document.head.insertAdjacentHTML('beforeend', '<style>' + ${JSON.stringify(css)} + '</style>'); window.scrollTo(0, 0); 1`);
await pausa(1200);
// Posição da região na tela, em pixels do aparelho.
const [rx, ry] = (process.env.REGIAO || '').split(',').map(Number);
const pos = JSON.parse(await avalia(tema
	? `JSON.stringify({ x: Math.round((mozInnerScreenX + ${rx}) * devicePixelRatio), y: Math.round((mozInnerScreenY + ${ry}) * devicePixelRatio), d: devicePixelRatio })`
	: `JSON.stringify((() => { const b = document.querySelector('.ss-capa').getBoundingClientRect(); const d = devicePixelRatio; return { x: Math.round((mozInnerScreenX + b.x + b.width * ${+(process.env.FX || 0.55)}) * d), y: Math.round((mozInnerScreenY + b.y + b.height * ${+(process.env.FY || 0.1)}) * d), d }; })())`));
const W = 200, Hh = 140, N = 90;
const saida = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-quadros-'));
// Captura com o .NET: N recortes da tela o mais rápido possível, com o instante de cada um.
const ps = `
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap ${W}, ${Hh}
$g = [System.Drawing.Graphics]::FromImage($bmp)
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$tempos = @()
for ($i = 0; $i -lt ${N}; $i++) {
  $g.CopyFromScreen(${pos.x}, ${pos.y}, 0, 0, $bmp.Size)
  $tempos += [int][math]::Round($sw.Elapsed.TotalMilliseconds)
  $bmp.Save("${saida.replace(/\\/g, '\\\\')}\\q$i.bmp")
}
$tempos -join ',' | Out-File -Encoding ascii "${saida.replace(/\\/g, '\\\\')}\\tempos.txt"
`;
execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { stdio: 'ignore' });
const sharp = (await import('sharp')).default;
const tempos = fs.readFileSync(path.join(saida, 'tempos.txt'), 'ascii').trim().split(',').map(Number);
const quadros = [];
for (let i = 0; i < N; i++) quadros.push(await sharp(path.join(saida, `q${i}.bmp`)).greyscale().raw().toBuffer({ resolveWithObject: true }));
const brilho = (q, x, y) => q.data[y * q.info.width + x];
let px = 0, py = 0, melhor = 0;
for (let y = 6; y < Hh - 6; y++) for (let x = 6; x < (tema ? W - 6 : 80); x++) { const v = brilho(quadros[0], x, y); if (v > melhor) { melhor = v; px = x; py = y; } }
const linhas = [];
let cx = px, cy = py;
for (const [k, q] of quadros.entries()) {
	let s = 0, sx = 0, sy = 0;
	for (let y = cy - 5; y <= cy + 5; y++) for (let x = cx - 5; x <= cx + 5; x++) { if (x < 0 || y < 0 || x >= W || y >= Hh) continue; const v = Math.max(0, brilho(q, x, y) - 25); s += v; sx += v * x; sy += v * y; }
	if (!s) break;
	const X = sx / s, Y = sy / s;
	linhas.push([tempos[k], X, Y]);
	cx = Math.round(X); cy = Math.round(Y);
}
const eixo = process.env.EIXO === "y" ? 2 : 1;
const passos = linhas.slice(1).map((l, k) => l[eixo] - linhas[k][eixo]);
const parados = passos.filter((d) => Math.abs(d) < 0.05).length;
const fracoes = new Set(linhas.map(([, x]) => (x % 1).toFixed(1))).size;
console.log(rotulo, `escala ${pos.d}`, 'amostras', linhas.length, 'quadros parados', parados, 'de', passos.length, 'frações distintas', fracoes);
console.log('  passos no eixo:', passos.slice(0, 45).map((d) => d.toFixed(2)).join(' '));
// Desvio da curva: ajusta uma parábola à posição pelo tempo (cobre movimento constante ou com aceleração suave) e mede o
// desvio médio. Encaixe em pixel faz escada (desvio perto de 0,29 px, o de um degrau de 1 px); interpolação certa
// fica colada na curva (perto de 0,1 px, só o ruído da medida).
{
	const ts = linhas.map((l) => l[0] / 1000), ps = linhas.map((l) => l[eixo]), n = ts.length;
	const soma = (f) => ts.reduce((s, t, i) => s + f(t, ps[i]), 0);
	const [s0, s1, s2, s3, s4] = [0, 1, 2, 3, 4].map((k) => soma((t) => t ** k));
	const [b0, b1, b2] = [0, 1, 2].map((k) => soma((t, p) => p * t ** k));
	const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
	const A = [[s0, s1, s2], [s1, s2, s3], [s2, s3, s4]], D = det(A);
	const col = (j, b) => A.map((linha, i) => linha.map((v, k) => (k === j ? b[i] : v)));
	const [c0, c1, c2] = [0, 1, 2].map((j) => det(col(j, [b0, b1, b2])) / D);
	const desvio = Math.sqrt(ts.reduce((s, t, i) => s + (ps[i] - (c0 + c1 * t + c2 * t * t)) ** 2, 0) / n);
	console.log(`  velocidade ~${Math.abs(c1).toFixed(1)} px/s, desvio da curva ${desvio.toFixed(3)} px`);
}
await bidi('browser.close', {});
await pausa(500);
try { ff.kill(); } catch {}
await pausa(500);
for (const p of [perfil, saida]) try { fs.rmSync(p, { recursive: true, force: true }); } catch {}
