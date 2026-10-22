// Confere, no site já compilado (dist/), se todo link interno leva a uma página e âncora que existem.
// Uso: npm run build && npm run check:links
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const BASE = '';
const pages = {};
(function walk(dir) {
	for (const f of fs.readdirSync(dir)) {
		const p = path.join(dir, f);
		if (fs.statSync(p).isDirectory()) walk(p);
		else if (f.endsWith('.html')) pages[p] = fs.readFileSync(p, 'utf8');
	}
})(DIST);

const ids = (file) => new Set([...pages[file].matchAll(/ id="([^"]+)"/g)].map((m) => decodeURIComponent(m[1])));
let total = 0;
let quebrados = 0;
for (const [file, html] of Object.entries(pages)) {
	if (file.includes('404')) continue;
	const url = '/' + path.relative(DIST, path.dirname(file)).split(path.sep).join('/') + '/';
	const main = html.split('<main')[1] || '';
	for (const m of main.matchAll(/href="([^"]+)"/g)) {
		const href = m[1].replace(/&amp;/g, '&');
		if (/^(https?:|mailto:)/.test(href)) continue;
		total++;
		const [alvo, ancora] = href.split('#');
		const destino = (alvo === '' ? url : new URL(alvo, 'http://x' + url).pathname).replace(BASE, '');
		const arquivo = path.join(DIST, decodeURIComponent(destino), 'index.html');
		if (!pages[arquivo]) {
			console.log(`página inexistente: ${url} -> ${href}`);
			quebrados++;
		} else if (ancora && !ids(arquivo).has(decodeURIComponent(ancora))) {
			console.log(`âncora inexistente: ${url} -> ${href}`);
			quebrados++;
		}
	}
}
console.log(`${total} links internos, ${quebrados} quebrados.`);
process.exit(quebrados ? 1 : 0);
