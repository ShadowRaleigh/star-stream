// Editor do livro, lado do navegador: CodeMirror com o Markdown à esquerda e a página real do site à direita.
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { keymap } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const $ = (id) => document.getElementById(id);
const seletor = $('pagina');
const previa = $('previa');
const estado = $('estado');
const btSalvar = $('salvar');
const btDescartar = $('descartar');
const btTabela = $('tabela');
const linkAbrir = $('abrir');

let paginas = [];
let atual = null; // { arquivo, url, publicado }
let rascunhoPendente = null;
let enviando = Promise.resolve();
let salvando = false;

async function chamar(acao, dados) {
	const opcoes = { headers: { 'x-editor-do-livro': '1' } };
	let url = `/__editor/api/${acao}`;
	if (dados && acao === 'ler') url += `?arquivo=${encodeURIComponent(dados.arquivo)}`;
	else if (dados) Object.assign(opcoes, { method: 'POST', headers: { ...opcoes.headers, 'content-type': 'application/json' }, body: JSON.stringify(dados) });
	const resposta = await fetch(url, opcoes);
	const json = await resposta.json();
	if (!resposta.ok) throw new Error(json.erro || `Erro ${resposta.status}`);
	return json;
}

function mostrar(texto, tipo = '') {
	estado.textContent = texto;
	estado.className = `estado ${tipo}`;
}

const tema = EditorView.theme({
	'&': { backgroundColor: 'var(--painel)', color: 'var(--texto)' },
	'.cm-gutters': { backgroundColor: 'var(--painel)', color: 'var(--suave)', border: 'none' },
	'.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'color-mix(in srgb, var(--destaque) 10%, transparent)' },
	'&.cm-focused .cm-cursor': { borderLeftColor: 'var(--destaque)' },
	'.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: 'color-mix(in srgb, var(--destaque) 28%, transparent) !important' },
});

// Realce pensado para texto de regra: títulos em destaque, negrito e itálico visíveis, marcas e endereços apagados.
const realce = HighlightStyle.define([
	{ tag: tags.heading1, fontWeight: '700', fontSize: '1.25em', color: 'var(--destaque)' },
	{ tag: tags.heading2, fontWeight: '700', fontSize: '1.15em', color: 'var(--destaque)' },
	{ tag: [tags.heading3, tags.heading4, tags.heading5, tags.heading6], fontWeight: '700', color: 'var(--destaque)' },
	{ tag: tags.strong, fontWeight: '700' },
	{ tag: tags.emphasis, fontStyle: 'italic' },
	{ tag: tags.link, color: 'var(--destaque)' },
	{ tag: [tags.url, tags.processingInstruction, tags.meta, tags.contentSeparator, tags.labelName], color: 'var(--suave)', opacity: '0.75' },
	{ tag: [tags.monospace], fontFamily: 'inherit', color: 'var(--destaque)' },
	{ tag: [tags.quote], fontStyle: 'italic', color: 'var(--suave)' },
	{ tag: [tags.angleBracket, tags.tagName, tags.attributeName, tags.attributeValue], color: 'var(--suave)' },
]);

const editor = new EditorView({
	parent: $('editor'),
	extensions: [
		basicSetup,
		markdown(),
		syntaxHighlighting(realce),
		EditorView.lineWrapping,
		tema,
		keymap.of([{ key: 'Mod-s', preventDefault: true, run: () => (salvar(), true) }]),
		EditorView.updateListener.of((u) => {
			if (u.docChanged && atual) agendarRascunho();
			if (u.selectionSet || u.docChanged) aoMoverCursor();
		}),
	],
});

// ---------- páginas ----------
async function carregarLista() {
	paginas = await chamar('paginas');
	const grupos = new Map();
	for (const p of paginas) {
		const g = p.secao || 'Geral';
		if (!grupos.has(g)) grupos.set(g, []);
		grupos.get(g).push(p);
	}
	seletor.innerHTML = '';
	for (const [nome, itens] of grupos) {
		const grupo = document.createElement('optgroup');
		grupo.label = nome.charAt(0).toUpperCase() + nome.slice(1);
		for (const p of itens) {
			const op = document.createElement('option');
			op.value = p.arquivo;
			op.textContent = (p.alterado ? '● ' : '') + p.titulo;
			grupo.append(op);
		}
		seletor.append(grupo);
	}
}

async function abrir(arquivo) {
	if (atual && sujo() && !confirm('Esta página tem alterações não publicadas. Elas continuam salvas no seu computador. Trocar de página mesmo assim?')) {
		seletor.value = atual.arquivo;
		return;
	}
	await enviando;
	const pagina = paginas.find((p) => p.arquivo === arquivo) ?? paginas[0];
	const { conteudo, alterado } = await chamar('ler', { arquivo: pagina.arquivo });
	atual = { ...pagina, publicado: alterado ? null : conteudo };
	editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: conteudo }, selection: { anchor: 0 } });
	seletor.value = pagina.arquivo;
	linkAbrir.href = `https://star.zennova.art${pagina.url}`;
	previa.src = pagina.url;
	history.replaceState(null, '', `?p=${encodeURIComponent(pagina.arquivo)}`);
	try { localStorage.setItem('editor-pagina', pagina.arquivo); } catch {}
	atualizarBotoes(alterado);
	mostrar(alterado ? 'Esta página tem alterações ainda não publicadas.' : 'Tudo publicado.');
}

const sujo = () => atual && atual.publicado !== editor.state.doc.toString();
function atualizarBotoes(forcar) {
	const s = forcar || sujo();
	btSalvar.disabled = !s || salvando;
	btDescartar.disabled = !s || salvando;
	document.title = `${s ? '● ' : ''}${atual?.titulo ?? ''} · Editor do livro`;
}

// ---------- rascunho: grava no disco enquanto você digita, e o site recarrega a prévia ----------
function agendarRascunho() {
	atualizarBotoes();
	mostrar('Alterado, ainda não publicado.');
	clearTimeout(rascunhoPendente);
	rascunhoPendente = setTimeout(() => {
		const dados = { arquivo: atual.arquivo, conteudo: editor.state.doc.toString() };
		guardarRolagem();
		enviando = enviando.then(() => chamar('rascunho', dados)).catch((e) => mostrar(e.message, 'erro'));
	}, 450);
}

async function salvar() {
	if (!atual || salvando || !sujo()) return;
	clearTimeout(rascunhoPendente);
	salvando = true;
	atualizarBotoes();
	mostrar('Publicando…');
	const conteudo = editor.state.doc.toString();
	try {
		await enviando;
		const r = await chamar('salvar', { arquivo: atual.arquivo, conteudo });
		if (r.ok) {
			atual.publicado = conteudo;
			mostrar(r.mensagem, 'ok');
		} else mostrar(r.erro, 'erro');
	} catch (e) {
		mostrar(e.message, 'erro');
	}
	salvando = false;
	atualizarBotoes();
	await carregarLista();
	seletor.value = atual.arquivo;
}

btSalvar.addEventListener('click', salvar);
btDescartar.addEventListener('click', async () => {
	if (!confirm('Descartar todas as alterações não publicadas desta página?')) return;
	clearTimeout(rascunhoPendente);
	await enviando;
	const { conteudo } = await chamar('descartar', { arquivo: atual.arquivo });
	atual.publicado = conteudo;
	editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: conteudo } });
	clearTimeout(rascunhoPendente);
	atualizarBotoes();
	mostrar('Alterações descartadas.');
	await carregarLista();
	seletor.value = atual.arquivo;
});
seletor.addEventListener('change', () => abrir(seletor.value));
addEventListener('beforeunload', (e) => {
	if (sujo()) e.preventDefault();
});

// ---------- prévia: rolagem preservada, clique leva à linha, cursor destaca o bloco ----------
let rolagemGuardada = null;
function guardarRolagem() {
	try { rolagemGuardada = previa.contentWindow.scrollY; } catch {}
}

function docPrevia() {
	try { return previa.contentDocument; } catch { return null; }
}

// Só letras e números, sem espaço, sem marcação e sem o destino dos links: assim o texto da página e o do Markdown se
// comparam direto.
function semMarcacao(texto) {
	return texto
		.replace(/\]\([^)]*\)/g, '')
		.replace(/<[^>]+>/g, '')
		.replace(/[^\p{L}\p{N}]+/gu, '')
		.toLowerCase();
}

// Marca cada bloco da prévia com a linha do Markdown de onde ele veio (data-linha), procurando o começo do texto do
// bloco nas linhas do arquivo, na ordem.
const SELETOR_BLOCOS = ':is(h2,h3,h4,h5,h6,p,li,tr,blockquote,pre,dt,dd,figcaption)';
function mapearLinhas(doc) {
	const linhas = editor.state.doc.toString().split('\n');
	const normal = linhas.map(semMarcacao);
	let inicio = 0;
	if (linhas[0] === '---') {
		inicio = linhas.indexOf('---', 1) + 1;
	}
	let cursor = inicio;
	for (const el of doc.querySelectorAll(`.sl-markdown-content ${SELETOR_BLOCOS}`)) {
		const alvo = semMarcacao(el.textContent).slice(0, 14);
		if (alvo.length < 3) continue;
		for (let n = cursor; n < Math.min(normal.length, cursor + 60); n++) {
			if (normal[n].includes(alvo)) {
				el.dataset.linha = n + 1;
				cursor = n;
				break;
			}
		}
	}
}

previa.addEventListener('load', () => {
	const doc = docPrevia();
	if (!doc) return;
	mapearLinhas(doc);
	const estilo = doc.createElement('style');
	estilo.textContent = `.sl-markdown-content [data-linha]{cursor:text}
.editor-destaque{outline:2px solid #d8a85c;outline-offset:4px;border-radius:3px;transition:outline-color .2s}`;
	doc.head.append(estilo);
	if (rolagemGuardada != null) previa.contentWindow.scrollTo(0, rolagemGuardada);
	rolagemGuardada = null;
	doc.addEventListener('click', (e) => {
		const conteudo = e.target.closest?.('.sl-markdown-content');
		if (!conteudo) return;
		const link = e.target.closest('a');
		if (link && !(e.ctrlKey || e.metaKey)) e.preventDefault(); // Ctrl+clique segue o link
		const bloco = e.target.closest('[data-linha]');
		if (!bloco) return;
		const n = Math.min(editor.state.doc.lines, Math.max(1, Number(bloco.dataset.linha)));
		const linha = editor.state.doc.line(n);
		editor.dispatch({ selection: { anchor: linha.from }, effects: EditorView.scrollIntoView(linha.from, { y: 'center' }) });
		editor.focus();
	}, true);
	aoMoverCursor();
});

let ultimoDestaque = null;
function aoMoverCursor() {
	mostrarBotaoTabela();
	const doc = docPrevia();
	if (!doc) return;
	const linha = editor.state.doc.lineAt(editor.state.selection.main.head).number;
	let melhor = null;
	for (const el of doc.querySelectorAll('.sl-markdown-content [data-linha]')) {
		const n = Number(el.dataset.linha);
		if (n <= linha && (!melhor || n >= Number(melhor.dataset.linha))) melhor = el;
	}
	if (melhor === ultimoDestaque) return;
	ultimoDestaque?.classList.remove('editor-destaque');
	ultimoDestaque = melhor;
	if (!melhor) return;
	melhor.classList.add('editor-destaque');
	const caixa = melhor.getBoundingClientRect();
	const altura = previa.contentWindow.innerHeight;
	if (caixa.top < 60 || caixa.bottom > altura - 20) melhor.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

// ---------- divisor arrastável ----------
const divisor = $('divisor');
const painel = $('editor');
divisor.addEventListener('pointerdown', (e) => {
	divisor.setPointerCapture(e.pointerId);
	previa.style.pointerEvents = 'none';
	const mover = (ev) => (painel.style.width = `${Math.max(280, Math.min(innerWidth - 320, ev.clientX))}px`);
	const soltar = () => {
		divisor.removeEventListener('pointermove', mover);
		previa.style.pointerEvents = '';
		try { localStorage.setItem('editor-largura', painel.style.width); } catch {}
	};
	divisor.addEventListener('pointermove', mover);
	divisor.addEventListener('pointerup', soltar, { once: true });
});
try {
	const largura = localStorage.getItem('editor-largura');
	if (largura) painel.style.width = largura;
} catch {}

// ---------- tabelas em grade ----------
const ehLinhaDeTabela = (texto) => /^\s*\|/.test(texto);

function tabelaNoCursor() {
	const doc = editor.state.doc;
	const atualN = doc.lineAt(editor.state.selection.main.head).number;
	if (!ehLinhaDeTabela(doc.line(atualN).text)) return null;
	let inicio = atualN;
	let fim = atualN;
	while (inicio > 1 && ehLinhaDeTabela(doc.line(inicio - 1).text)) inicio--;
	while (fim < doc.lines && ehLinhaDeTabela(doc.line(fim + 1).text)) fim++;
	if (fim - inicio < 1) return null;
	return { inicio, fim };
}

function mostrarBotaoTabela() {
	btTabela.hidden = !tabelaNoCursor();
}

function celulas(linha) {
	const corpo = linha.trim().replace(/^\|/, '').replace(/\|$/, '');
	const partes = [];
	let atualTexto = '';
	for (let i = 0; i < corpo.length; i++) {
		if (corpo[i] === '\\' && corpo[i + 1] === '|') {
			atualTexto += '\\|';
			i++;
		} else if (corpo[i] === '|') {
			partes.push(atualTexto.trim());
			atualTexto = '';
		} else atualTexto += corpo[i];
	}
	partes.push(atualTexto.trim());
	return partes;
}

let tabelaAberta = null;
const gradeTabela = $('grade-tabela');
const dialogo = $('grade');

btTabela.addEventListener('click', () => {
	const t = tabelaNoCursor();
	if (!t) return;
	const doc = editor.state.doc;
	const linhas = [];
	for (let n = t.inicio; n <= t.fim; n++) linhas.push(doc.line(n).text);
	const alinhamentos = celulas(linhas[1]);
	const dados = [celulas(linhas[0]), ...linhas.slice(2).map(celulas)];
	tabelaAberta = { ...t, alinhamentos };
	desenharGrade(dados);
	dialogo.showModal();
});

function desenharGrade(dados) {
	const colunas = Math.max(...dados.map((l) => l.length));
	gradeTabela.innerHTML = '';
	for (const linha of dados) {
		const tr = gradeTabela.insertRow();
		for (let c = 0; c < colunas; c++) {
			const td = tr.insertCell();
			td.contentEditable = 'plaintext-only';
			td.textContent = (linha[c] ?? '').replaceAll('\\|', '|');
		}
	}
}

function lerGrade() {
	return [...gradeTabela.rows].map((tr) => [...tr.cells].map((td) => td.textContent.replace(/\s*\n\s*/g, ' ').trim().replaceAll('|', '\\|')));
}

dialogo.querySelector('.acoes').addEventListener('click', (e) => {
	const acao = e.target.dataset?.acao;
	if (!acao) return;
	const dados = lerGrade().map((l) => l.map((c) => c.replaceAll('\\|', '|')));
	const foco = document.activeElement?.closest?.('td');
	const linhaFoco = foco ? foco.parentElement.rowIndex : dados.length - 1;
	const colunaFoco = foco ? foco.cellIndex : dados[0].length - 1;
	if (acao === '+linha') dados.splice(Math.max(1, linhaFoco + 1), 0, dados[0].map(() => ''));
	if (acao === '-linha' && dados.length > 2 && linhaFoco > 0) dados.splice(linhaFoco, 1);
	if (acao === '+coluna') {
		dados.forEach((l) => l.splice(colunaFoco + 1, 0, ''));
		tabelaAberta.alinhamentos.splice(colunaFoco + 1, 0, '-----');
	}
	if (acao === '-coluna' && dados[0].length > 1) {
		dados.forEach((l) => l.splice(colunaFoco, 1));
		tabelaAberta.alinhamentos.splice(colunaFoco, 1);
	}
	desenharGrade(dados);
});

dialogo.addEventListener('close', () => {
	if (dialogo.returnValue !== 'ok' || !tabelaAberta) return;
	const dados = lerGrade();
	const colunas = dados[0].length;
	const alinh = Array.from({ length: colunas }, (_, i) => tabelaAberta.alinhamentos[i] || '-----');
	const linha = (cels) => `| ${cels.join(' | ')} |`;
	const texto = [linha(dados[0]), linha(alinh), ...dados.slice(1).map(linha)].join('\n');
	const doc = editor.state.doc;
	editor.dispatch({ changes: { from: doc.line(tabelaAberta.inicio).from, to: doc.line(tabelaAberta.fim).to, insert: texto } });
	tabelaAberta = null;
	editor.focus();
});

// ---------- início ----------
await carregarLista();
let inicial = new URLSearchParams(location.search).get('p');
try { inicial ??= localStorage.getItem('editor-pagina'); } catch {}
await abrir(paginas.some((p) => p.arquivo === inicial) ? inicial : 'personagem/criacao.md');
