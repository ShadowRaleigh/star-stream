// Mede no Firefox (WebDriver BiDi) o intervalo entre quadros de uma página: animação que pesa no Firefox aparece como
// intervalo mediano o dobro do normal (quadros perdidos, movimento aos trancos), mesmo quando no Chrome ela roda lisa.
// Uso: [TEMA=constelacao] [MODO=escuro] [PAGINA=arquetipos/vanguarda/] node tools/medir-quadros-firefox.mjs <rótulo> [css extra] [sim|nao]
//   o terceiro argumento diz se roda sem janela ("sim", padrão, sem placa de vídeo) ou com janela ("nao", com a placa de
//   vídeo, que é a medida que vale; abre uma janela do Firefox por alguns segundos, com perfil temporário).
// Precisa do servidor de desenvolvimento em http://localhost:4321/star-stream/.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const [, , rotulo = 'atual', css = '', headless = 'sim'] = process.argv;
const FF = 'C:/Program Files/Mozilla Firefox/firefox.exe';
const PORTA = 20000 + Math.floor(Math.random() * 20000);
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-medida-'));
const ff = spawn(FF, [...(headless === 'sim' ? ['--headless'] : []), '--no-remote', '-profile', perfil, `--remote-debugging-port=${PORTA}`, '--width=1440', '--height=900'], { stdio: 'ignore' });
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
await bidi('browsingContext.setViewport', { context: ctx, viewport: { width: 1440, height: 900 } });
await bidi('browsingContext.navigate', { context: ctx, url: `http://localhost:4321/star-stream/${process.env.PAGINA || ''}?tema=${process.env.TEMA || 'constelacao'}&modo=${process.env.MODO || 'escuro'}`, wait: 'complete' });
await pausa(4000);
const avalia = async (expression) => (await bidi('script.evaluate', { expression, target: { context: ctx }, awaitPromise: true, resultOwnership: 'none' })).result?.result?.value;
if (css) await avalia(`document.head.insertAdjacentHTML('beforeend', '<style>' + ${JSON.stringify(css)} + '</style>'); 1`);
await avalia('window.scrollTo(0, 0); 1');
await pausa(1500);
const medida = await avalia(`new Promise((ok) => {
	const ts = [];
	const passo = (t) => {
		ts.push(t);
		if (ts.length < 240) return requestAnimationFrame(passo);
		const d = ts.slice(1).map((v, i) => v - ts[i]).sort((x, y) => x - y);
		ok(JSON.stringify({ media: +(d.reduce((s, v) => s + v, 0) / d.length).toFixed(1), p50: +d[Math.floor(d.length / 2)].toFixed(1), p95: +d[Math.floor(d.length * 0.95)].toFixed(1), max: +d[d.length - 1].toFixed(1) }));
	};
	requestAnimationFrame(passo);
})`);
console.log(rotulo, 'intervalo entre quadros (ms):', medida);
await bidi('browser.close', {});
await pausa(500);
try { ff.kill(); } catch {}
await pausa(500);
try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {}
