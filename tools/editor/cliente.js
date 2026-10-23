// Editor do livro, lado do navegador: CodeMirror com o Markdown à esquerda e a página real do site à direita.
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { keymap } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { EditorState, EditorSelection } from '@codemirror/state';
import { startCompletion } from '@codemirror/autocomplete';

const $ = (id) => document.getElementById(id);
const seletor = $('pagina');
const previa = $('previa');
const estado = $('estado');
const btSalvar = $('salvar');
const btDescartar = $('descartar');
const btTabela = $('tabela');
const linkAbrir = $('abrir');

let paginas = [];
let ancoras = []; // [{ arquivo, url, titulo, ancoras: [{ id, texto }] }], para o autocompletar de links
let atual = null; // { arquivo, url, publicado }
let rascunhoPendente = null;
let enviando = Promise.resolve();
let carregando = false; // trocar o texto do editor ao abrir ou descartar não é uma edição
let salvando = false;

async function chamar(acao, dados) {
	const opcoes = { headers: { 'x-editor-do-livro': '1' } };
	let url = `/__editor/api/${acao}`;
	if (dados && acao === 'ler') url += `?arquivo=${encodeURIComponent(dados.arquivo)}`;
	else if (dados) Object.assign(opcoes, { method: 'POST', headers: { ...opcoes.headers, 'content-type': 'application/json' }, body: JSON.stringify(dados) });
	let resposta;
	try {
		resposta = await fetch(url, opcoes);
	} catch {
		throw new Error('O editor perdeu contato com o servidor. Abra de novo pelo "Editar o livro.cmd" (o que você digitou já está salvo no arquivo).');
	}
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
	'.cm-tooltip': { backgroundColor: 'var(--painel)', color: 'var(--texto)', border: '1px solid var(--borda)', borderRadius: '6px', boxShadow: '0 8px 24px rgb(0 0 0 / 0.25)' },
	'.cm-tooltip-autocomplete > ul': { fontFamily: 'system-ui, sans-serif', maxHeight: '18rem' },
	'.cm-tooltip-autocomplete > ul > li': { padding: '0.25rem 0.6rem !important' },
	'.cm-tooltip-autocomplete > ul > li[aria-selected]': { backgroundColor: 'var(--destaque)', color: '#fff' },
	'.cm-completionDetail': { color: 'var(--suave)', fontStyle: 'normal', marginLeft: '0.8em', fontSize: '0.85em' },
	'.cm-tooltip-autocomplete > ul > li[aria-selected] .cm-completionDetail': { color: 'rgb(255 255 255 / 0.8)' },
	'.cm-completionMatchedText': { textDecoration: 'none', fontWeight: '700' },
	'.cm-panels': { backgroundColor: 'var(--painel)', color: 'var(--texto)', borderColor: 'var(--borda)' },
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

// ---------- atalhos de escrita ----------
// Envolve a seleção (ou a palavra do cursor) com a marca; se já estiver envolvida, tira.
function alternarMarca(marca) {
	return (view) => {
		view.dispatch(
			view.state.changeByRange((faixa) => {
				let { from, to } = faixa;
				if (from === to) {
					const palavra = view.state.wordAt(from);
					if (palavra) ({ from, to } = palavra);
				}
				const n = marca.length;
				const antes = view.state.sliceDoc(from - n, from);
				const depois = view.state.sliceDoc(to, to + n);
				if (antes === marca && depois === marca)
					return { changes: [{ from: from - n, to: from }, { from: to, to: to + n }], range: EditorSelection.range(from - n, to - n) };
				return { changes: [{ from, insert: marca }, { from: to, insert: marca }], range: EditorSelection.range(from + n, to + n) };
			}),
		);
		return true;
	};
}

function inserirLink(view) {
	const { from, to } = view.state.selection.main;
	const texto = view.state.sliceDoc(from, to);
	view.dispatch({ changes: { from, to, insert: `[${texto}]()` }, selection: { anchor: from + texto.length + 3 } });
	startCompletion(view);
	return true;
}

// Caminho relativo entre duas páginas do site (as duas terminam em /, como no livro: ../../personagem/stats/).
function caminhoRelativo(de, para) {
	const a = de.split('/').filter(Boolean);
	const b = para.split('/').filter(Boolean);
	let i = 0;
	while (i < a.length && i < b.length && a[i] === b[i]) i++;
	const resto = b.slice(i).join('/');
	return '../'.repeat(a.length - i) + (resto ? `${resto}/` : '') || './';
}

// Autocompletar dentro de ](…): digite parte do nome da página ou da seção e escolha.
function fonteLinks(contexto) {
	const achado = contexto.matchBefore(/\]\([^)\s]*/);
	if (!achado || !atual) return null;
	const opcoes = [];
	for (const p of ancoras) {
		const mesma = p.url === atual.url;
		const base = mesma ? '' : caminhoRelativo(atual.url, p.url);
		if (!mesma) opcoes.push({ label: p.titulo, detail: base, apply: base, type: 'class', boost: 1 });
		for (const a of p.ancoras)
			opcoes.push({ label: `${p.titulo} › ${a.texto}`, detail: `${base}#${a.id}`, apply: `${base}#${a.id}`, type: 'property', boost: mesma ? 2 : 0 });
	}
	return { from: achado.from + 2, options: opcoes, validFor: /^[^)\s]*$/ };
}

const editor = new EditorView({
	parent: $('editor'),
	extensions: [
		basicSetup,
		markdown(),
		syntaxHighlighting(realce),
		EditorView.lineWrapping,
		EditorView.contentAttributes.of({ spellcheck: 'true', lang: 'pt-BR' }),
		EditorState.languageData.of(() => [{ autocomplete: fonteLinks }]),
		tema,
		keymap.of([
			{ key: 'Mod-s', preventDefault: true, run: () => (salvar(), true) },
			{ key: 'Mod-b', run: alternarMarca('**') },
			{ key: 'Mod-i', run: alternarMarca('*') },
			{ key: 'Mod-k', run: inserirLink },
			{ key: 'Mod-p', preventDefault: true, run: () => (abrirSeletor(), true) },
		]),
		EditorView.updateListener.of((u) => {
			if (u.docChanged && atual && !carregando) agendarRascunho();
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

async function abrir(arquivo, ancora = '') {
	if (atual && sujo() && !confirm('Esta página tem alterações não publicadas. Elas continuam salvas no seu computador. Trocar de página mesmo assim?')) {
		seletor.value = atual.arquivo;
		if (decodeURI(previa.contentWindow?.location.pathname ?? '') !== atual.url) previa.src = atual.url;
		return;
	}
	await enviando;
	const pagina = paginas.find((p) => p.arquivo === arquivo) ?? paginas[0];
	const { conteudo, alterado, pendentes } = await chamar('ler', { arquivo: pagina.arquivo });
	atual = { ...pagina, publicado: alterado || pendentes ? null : conteudo };
	carregando = true;
	editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: conteudo }, selection: { anchor: 0 } });
	carregando = false;
	seletor.value = pagina.arquivo;
	linkAbrir.href = `https://star.zennova.art${pagina.url}`;
	rolagemGuardada = null;
	previa.src = pagina.url + ancora;
	history.replaceState(null, '', `?p=${encodeURIComponent(pagina.arquivo)}`);
	try { localStorage.setItem('editor-pagina', pagina.arquivo); } catch {}
	atualizarBotoes(alterado || pendentes);
	mostrar(alterado ? 'Esta página tem alterações ainda não publicadas.' : pendentes ? 'Há uma publicação salva neste computador que ainda não foi enviada. Aperte Ctrl+S para enviar.' : 'Tudo publicado.', pendentes && !alterado ? 'erro' : '');
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
	const conteudo = editor.state.doc.toString();
	// Links para páginas ou seções que não existem: avisa antes de publicar e leva ao primeiro.
	try {
		const { quebrados } = await chamar('conferir', { arquivo: atual.arquivo, conteudo });
		if (quebrados.length) {
			const lista = quebrados.slice(0, 8).map((q) => `• linha ${q.linha}: ${q.link} (${q.motivo})`).join('\n');
			const mais = quebrados.length > 8 ? `\n… e mais ${quebrados.length - 8}.` : '';
			if (!confirm(`${quebrados.length === 1 ? 'Há 1 link quebrado' : `Há ${quebrados.length} links quebrados`}:\n\n${lista}${mais}\n\nPublicar mesmo assim?`)) {
				irParaLinha(quebrados[0].linha);
				mostrar(`Publicação cancelada: ${quebrados.length} link(s) quebrado(s), a começar pela linha ${quebrados[0].linha}.`, 'erro');
				return;
			}
		}
	} catch (e) {
		return mostrar(e.message, 'erro');
	}
	salvando = true;
	atualizarBotoes();
	mostrar('Publicando…');
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
	ancoras = await chamar('ancoras').catch(() => ancoras);
}

function irParaLinha(n) {
	const linha = editor.state.doc.line(Math.min(editor.state.doc.lines, Math.max(1, n)));
	editor.dispatch({ selection: { anchor: linha.from }, effects: EditorView.scrollIntoView(linha.from, { y: 'center' }) });
	editor.focus();
}

function abrirSeletor() {
	seletor.focus();
	try { seletor.showPicker(); } catch {}
}

// O painel de atalhos fecha ao clicar fora dele.
addEventListener('click', (e) => {
	const painel = document.querySelector('.atalhos');
	if (painel.open && !painel.contains(e.target)) painel.open = false;
});

// Ctrl+S e Ctrl+P também funcionam com o foco fora do editor (na lista de páginas, por exemplo).
addEventListener('keydown', (e) => {
	if (!(e.ctrlKey || e.metaKey) || editor.hasFocus) return;
	if (e.key.toLowerCase() === 's') { e.preventDefault(); salvar(); }
	if (e.key.toLowerCase() === 'p') { e.preventDefault(); abrirSeletor(); }
});

btSalvar.addEventListener('click', salvar);
btDescartar.addEventListener('click', async () => {
	if (!confirm('Descartar todas as alterações não publicadas desta página?')) return;
	clearTimeout(rascunhoPendente);
	await enviando;
	const { conteudo } = await chamar('descartar', { arquivo: atual.arquivo });
	atual.publicado = conteudo;
	carregando = true;
	editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: conteudo } });
	carregando = false;
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
let semMenus = false;
try { semMenus = localStorage.getItem('editor-sem-menus') === '1'; } catch {}
const btMenus = $('menus');
btMenus.setAttribute('aria-pressed', String(semMenus));
btMenus.addEventListener('click', () => {
	semMenus = !semMenus;
	btMenus.setAttribute('aria-pressed', String(semMenus));
	docPrevia()?.documentElement.classList.toggle('editor-sem-menus', semMenus);
	try { localStorage.setItem('editor-sem-menus', semMenus ? '1' : '0'); } catch {}
});
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
	// A prévia foi para outra página (menu do site, Ctrl+clique num link): o editor acompanha.
	const caminho = decodeURI(previa.contentWindow.location.pathname);
	if (atual && caminho !== atual.url) {
		const outra = paginas.find((p) => p.url === caminho);
		if (outra) abrir(outra.arquivo, previa.contentWindow.location.hash);
		else previa.src = atual.url;
		return;
	}
	ultimoDestaque = null;
	mapearLinhas(doc);
	const estilo = doc.createElement('style');
	estilo.textContent = `.sl-markdown-content [data-linha]{cursor:text}
.editor-destaque{outline:2px solid #d8a85c;outline-offset:4px;border-radius:3px;transition:outline-color .2s}
html.editor-sem-menus{--sl-sidebar-width:0px}
html.editor-sem-menus :is(.sidebar-pane,.right-sidebar-container,starlight-menu-button){display:none!important}
html.editor-sem-menus .main-frame{padding-inline-start:0!important}`;
	doc.head.append(estilo);
	doc.documentElement.classList.toggle('editor-sem-menus', semMenus);
	if (rolagemGuardada != null) previa.contentWindow.scrollTo(0, rolagemGuardada);
	rolagemGuardada = null;
	doc.addEventListener('click', (e) => {
		const conteudo = e.target.closest?.('.sl-markdown-content');
		if (!conteudo) return;
		const link = e.target.closest('a');
		if (link && (e.ctrlKey || e.metaKey)) {
			// Ctrl+clique: link do livro abre a página no editor; link de fora abre numa aba nova.
			e.preventDefault();
			const destino = new URL(link.href);
			if (destino.origin === location.origin) previa.src = destino.pathname + destino.hash;
			else open(link.href, '_blank', 'noopener');
			return;
		}
		if (link) e.preventDefault();
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

// Enter na grade desce para a célula de baixo (como numa planilha), em vez de quebrar a linha.
gradeTabela.addEventListener('keydown', (e) => {
	if (e.key !== 'Enter') return;
	e.preventDefault();
	const td = e.target.closest('td');
	const abaixo = td?.parentElement.nextElementSibling?.cells[td.cellIndex];
	abaixo?.focus();
});

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
chamar('ancoras').then((lista) => (ancoras = lista)).catch(() => {});
let inicial = new URLSearchParams(location.search).get('p');
try { inicial ??= localStorage.getItem('editor-pagina'); } catch {}
await abrir(paginas.some((p) => p.arquivo === inicial) ? inicial : 'personagem/criacao.md');
