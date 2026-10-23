// Editor do livro: só existe no `astro dev` (nunca no site publicado). Mostra o Markdown de uma página ao lado da página
// real, que se atualiza enquanto você digita, e o Ctrl+S salva, faz o commit e o push.
//
// Segurança: o servidor de desenvolvimento só escuta em 127.0.0.1, a API só aceita pedidos vindos da própria página do
// editor (Host e Origin locais, cabeçalho próprio) e só escreve arquivos .md/.mdx dentro de src/content/docs. O push usa
// as credenciais do Git desta máquina.
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ_REPO = path.resolve('.');
const RAIZ_DOCS = path.resolve('src/content/docs');
const CABECALHO = 'x-editor-do-livro';

export default function editorDoLivro() {
	return {
		name: 'editor-do-livro',
		hooks: {
			'astro:config:setup': ({ command, updateConfig }) => {
				if (command !== 'dev') return;
				const config = { server: { host: '127.0.0.1' } };
				if (process.env.EDITOR_DO_LIVRO) config.server.open = '/__editor';
				updateConfig(config);
			},
			'astro:server:setup': ({ server }) => {
				server.middlewares.use('/__editor/api', (req, res) => {
					api(req, res).catch((erro) => responder(res, 500, { erro: String(erro.message || erro) }));
				});
				// A página do editor sai como HTML puro, sem o cliente de recarga do Vite: quando um .md muda, só a prévia
				// recarrega, e o editor mantém o cursor e o texto. O cliente.js passa pelo Vite (/@fs/) para achar o CodeMirror.
				server.middlewares.use((req, res, next) => {
					if (req.method !== 'GET' || !/^\/__editor\/?(\?|$)/.test(req.url ?? '')) return next();
					if (!local(req.headers.host ?? '')) return responder(res, 403, { erro: 'Pedido recusado.' });
					const cliente = fileURLToPath(new URL('./cliente.js', import.meta.url)).replaceAll('\\', '/');
					const html = fs.readFileSync(new URL('./pagina.html', import.meta.url), 'utf8').replace('__CLIENTE__', `/@fs/${cliente.replace(/^\//, '')}`);
					res.setHeader('Content-Type', 'text/html; charset=utf-8');
					res.setHeader('Cache-Control', 'no-store');
					res.end(html);
				});
			},
		},
	};
}

function responder(res, status, corpo) {
	res.statusCode = status;
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	res.setHeader('Cache-Control', 'no-store');
	res.end(JSON.stringify(corpo));
}

function local(valor) {
	try {
		const { hostname } = new URL(valor.includes('://') ? valor : `http://${valor}`);
		return hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '[::1]';
	} catch {
		return false;
	}
}

async function api(req, res) {
	// Pedidos de fora da máquina, de outro site aberto no navegador ou sem o cabeçalho do editor não passam.
	if (!local(req.headers.host ?? '') || (req.headers.origin && !local(req.headers.origin)) || req.headers[CABECALHO] !== '1')
		return responder(res, 403, { erro: 'Pedido recusado.' });
	const url = new URL(req.url, 'http://local');
	const acao = url.pathname.replace(/^\/+/, '');
	if (req.method === 'GET' && acao === 'paginas') return responder(res, 200, await listarPaginas());
	if (req.method === 'GET' && acao === 'ler') {
		const arquivo = caminhoSeguro(url.searchParams.get('arquivo'));
		return responder(res, 200, { conteudo: fs.readFileSync(arquivo, 'utf8'), alterado: await alterado(arquivo) });
	}
	if (req.method !== 'POST' || !(req.headers['content-type'] ?? '').startsWith('application/json'))
		return responder(res, 405, { erro: 'Método não aceito.' });
	const corpo = JSON.parse(await lerCorpo(req));
	const arquivo = caminhoSeguro(corpo.arquivo);
	if (acao === 'rascunho') {
		escrever(arquivo, corpo.conteudo);
		return responder(res, 200, { ok: true });
	}
	if (acao === 'salvar') {
		escrever(arquivo, corpo.conteudo);
		return responder(res, 200, await publicar(arquivo));
	}
	if (acao === 'descartar') {
		await git(['checkout', '--', relativo(arquivo)]);
		return responder(res, 200, { conteudo: fs.readFileSync(arquivo, 'utf8') });
	}
	return responder(res, 404, { erro: 'Ação desconhecida.' });
}

function lerCorpo(req) {
	return new Promise((ok, falha) => {
		let dados = '';
		req.setEncoding('utf8');
		req.on('data', (parte) => {
			dados += parte;
			if (dados.length > 5e6) falha(new Error('Conteúdo grande demais.'));
		});
		req.on('end', () => ok(dados));
		req.on('error', falha);
	});
}

function caminhoSeguro(arquivo) {
	if (typeof arquivo !== 'string') throw new Error('Arquivo não informado.');
	const completo = path.resolve(RAIZ_DOCS, arquivo);
	if (!completo.startsWith(RAIZ_DOCS + path.sep) || !/\.mdx?$/.test(completo) || !fs.existsSync(completo))
		throw new Error('Arquivo fora do livro.');
	return completo;
}

function escrever(arquivo, conteudo) {
	if (typeof conteudo !== 'string') throw new Error('Conteúdo inválido.');
	if (fs.readFileSync(arquivo, 'utf8') !== conteudo) fs.writeFileSync(arquivo, conteudo);
}

const relativo = (arquivo) => path.relative(RAIZ_REPO, arquivo).replaceAll('\\', '/');

function git(args) {
	return new Promise((ok, falha) =>
		execFile('git', args, { cwd: RAIZ_REPO, windowsHide: true }, (erro, saida, saidaErro) =>
			erro ? falha(new Error((saidaErro || saida || erro.message).trim())) : ok(saida.trim()),
		),
	);
}

async function alterado(arquivo) {
	return (await git(['status', '--porcelain', '--', relativo(arquivo)])) !== '';
}

function titulo(texto, reserva) {
	const linha = texto.match(/^---[\s\S]*?^title:\s*(.+)$/m);
	return linha ? linha[1].trim().replace(/^["']|["']$/g, '') : reserva;
}

async function listarPaginas() {
	const paginas = [];
	const andar = (pasta) => {
		for (const nome of fs.readdirSync(pasta)) {
			const completo = path.join(pasta, nome);
			if (fs.statSync(completo).isDirectory()) andar(completo);
			else if (/\.mdx?$/.test(nome)) {
				const arquivo = path.relative(RAIZ_DOCS, completo).replaceAll('\\', '/');
				const slug = arquivo.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
				paginas.push({
					arquivo,
					titulo: titulo(fs.readFileSync(completo, 'utf8'), slug || 'Início'),
					secao: slug.includes('/') ? slug.split('/')[0] : '',
					url: slug ? `/${slug}/` : '/',
				});
			}
		}
	};
	andar(RAIZ_DOCS);
	const status = await git(['status', '--porcelain', '--', 'src/content/docs']);
	const alterados = new Set(status.split('\n').filter(Boolean).map((l) => l.slice(3).replace(/^src\/content\/docs\//, '')));
	for (const p of paginas) p.alterado = alterados.has(p.arquivo);
	return paginas.sort((a, b) => a.arquivo.localeCompare(b.arquivo, 'pt-BR'));
}

async function publicar(arquivo) {
	const rel = relativo(arquivo);
	if (!(await alterado(arquivo))) return { ok: true, mensagem: 'Nada mudou desde a última publicação.' };
	const nome = titulo(fs.readFileSync(arquivo, 'utf8'), path.basename(rel));
	await git(['add', '--', rel]);
	await git(['commit', '-m', `Edita ${nome}`, '--', rel]);
	const commit = await git(['rev-parse', '--short', 'HEAD']);
	try {
		await git(['pull', '--rebase', '--autostash']);
		await git(['push']);
	} catch (erro) {
		return { ok: false, commit, erro: `O commit ${commit} foi feito, mas o push falhou: ${erro.message}` };
	}
	return { ok: true, commit, mensagem: `Publicado (commit ${commit}). O site atualiza em cerca de 1 minuto.` };
}
