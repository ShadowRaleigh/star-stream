// Copia as fontes dos temas para public/fontes/ e gera src/styles/fontes.css com as declarações @font-face.
// Só entram os arquivos do alfabeto latino (o "latin-ext" só é baixado se a página usar um caractere dele), em WOFF2.
// Com nomes fixos, o script do topo pode pré-carregar as fontes do tema em uso (lista FONTES_DO_TEMA em src/temas.mjs).
// Uso: node tools/copiar-fontes.mjs (depois de instalar ou atualizar um pacote @fontsource).
import fs from 'node:fs';
import path from 'node:path';

// [pacote, arquivo CSS do pacote, nome da família no nosso CSS (quando muda)]
const FONTES = [
	['@fontsource-variable/cinzel', 'index.css', 'Cinzel'],
	['@fontsource-variable/eb-garamond', 'index.css'],
	['@fontsource-variable/eb-garamond', 'wght-italic.css'],
	['@fontsource/cormorant-garamond', '500.css'],
	['@fontsource/cormorant-garamond', '600.css'],
	['@fontsource-variable/orbitron', 'index.css'],
	['@fontsource-variable/jetbrains-mono', 'index.css'],
	['@fontsource/cinzel-decorative', '700.css'],
	['@fontsource/im-fell-english-sc', 'index.css'],
	['@fontsource/almendra-sc', 'index.css'],
	['@fontsource/marcellus-sc', 'index.css'],
	['@fontsource/cormorant-unicase', '500.css'],
	['@fontsource/cormorant-unicase', '700.css'],
	['@fontsource/uncial-antiqua', 'index.css'],
	['@fontsource/share-tech-mono', 'index.css'],
	['@fontsource/chakra-petch', '500.css'],
	['@fontsource/chakra-petch', '600.css'],
	['@fontsource/chakra-petch', '700.css'],
	['@fontsource-variable/exo-2', 'index.css'],
];

const destino = 'public/fontes';
fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });

let css = '/* Gerado por tools/copiar-fontes.mjs. Fontes sob a SIL Open Font License (public/fontes/LICENCAS.md). */\n';
const pacotes = new Set();
for (const [pacote, arquivo, familia] of FONTES) {
	const dir = path.join('node_modules', pacote);
	const fonte = fs.readFileSync(path.join(dir, arquivo), 'utf8');
	for (const bloco of fonte.match(/@font-face\s*\{[^}]*\}/g) || []) {
		const woff2 = bloco.match(/url\(\.\/files\/([^)]+\.woff2)\)/)?.[1];
		if (!woff2 || !/-latin-/.test(woff2)) continue;
		fs.copyFileSync(path.join(dir, 'files', woff2), path.join(destino, woff2));
		let novo = bloco
			.replace(/src:[^;]+;/, `src: url('/fontes/${woff2}') format('${/wght|variations/.test(bloco) ? 'woff2-variations' : 'woff2'}');`)
			.replace(/\n\s*/g, '\n\t')
			.replace(/\n\t\}$/, '\n}');
		if (familia) novo = novo.replace(/font-family:\s*'[^']+'/, `font-family: '${familia}'`);
		css += '\n' + novo + '\n';
	}
	pacotes.add(pacote);
}
fs.writeFileSync('src/styles/fontes.css', css);

// As licenças vão junto com as fontes, como a OFL pede.
let licencas = '# Licenças das fontes\n\nTodas as fontes desta pasta estão sob a SIL Open Font License 1.1. Os textos completos estão nos pacotes de origem:\n\n';
for (const pacote of pacotes) {
	const lic = ['LICENSE', 'LICENSE.md', 'OFL.txt'].map((f) => path.join('node_modules', pacote, f)).find((f) => fs.existsSync(f));
	const nome = pacote.split('/')[1];
	if (lic) fs.copyFileSync(lic, path.join(destino, `LICENCA-${nome}.txt`));
	licencas += `- ${pacote}${lic ? ` (LICENCA-${nome}.txt)` : ''}\n`;
}
fs.writeFileSync(path.join(destino, 'LICENCAS.md'), licencas);
console.log(fs.readdirSync(destino).filter((f) => f.endsWith('.woff2')).length, 'arquivos de fonte;', (css.match(/@font-face/g) || []).length, 'declarações');
