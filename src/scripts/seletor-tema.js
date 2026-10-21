// Aplica o tema visual do livro antes da página aparecer: ?tema= na URL (o link que o mestre manda), depois a última escolha, depois o padrão.
// Depois aplica a paleta de cor do tema: ?cor= na URL, depois a última paleta usada nesse tema, depois a padrão.
// As listas de temas, famílias e paletas são injetadas pelo astro.config.mjs a partir de src/temas.mjs e src/cores.mjs.
(() => {
	const familias = __FAMILIAS_DOS_TEMAS__;
	const cores = __CORES_DOS_TEMAS__;
	const fontes = __FONTES_DOS_TEMAS__;
	const temas = Object.keys(familias);
	// A Carta Celeste virou o modo claro do Astrolábio; links e escolhas antigas continuam funcionando.
	const apelidos = { carta: 'astrolabio' };
	const busca = new URLSearchParams(location.search);
	let pedido = busca.get('tema');
	if (pedido in apelidos) {
		if (!busca.has('modo')) busca.set('modo', 'claro');
		pedido = apelidos[pedido];
	}
	let salvo = null;
	try {
		salvo = localStorage.getItem('ss-tema');
	} catch {}
	salvo = apelidos[salvo] || salvo;
	let tema = temas.includes(pedido) ? pedido : temas.includes(salvo) ? salvo : temas[0];
	try {
		if (temas.includes(pedido)) localStorage.setItem('ss-tema', tema);
	} catch {}
	document.documentElement.dataset.ssTema = tema;
	document.documentElement.dataset.ssFamilia = familias[tema];
	// Pede de antemão as fontes do título e do texto do tema, para o texto já aparecer na fonte certa.
	for (const f of fontes[tema] || []) document.write(`<link rel="preload" as="font" type="font/woff2" crossorigin href="__BASE__fontes/${f}.woff2">`);
	const paletas = cores[tema] || [];
	const corPedida = busca.get('cor');
	let corSalva = null;
	try {
		corSalva = localStorage.getItem(`ss-cor-${tema}`);
		if (paletas.includes(corPedida)) localStorage.setItem(`ss-cor-${tema}`, corPedida);
	} catch {}
	const cor = paletas.includes(corPedida) ? corPedida : paletas.includes(corSalva) ? corSalva : paletas[0];
	if (cor) document.documentElement.dataset.ssCor = cor;
	// As paletas ficam num arquivo por tema, fora do CSS principal. O document.write deixa o arquivo bloquear a pintura
	// da página, como um <link> escrito no HTML: assim ela já aparece na cor certa, sem piscar na padrão.
	if (cor && cor !== paletas[0]) document.write(`<link rel="stylesheet" href="__BASE__cores/${tema}.css" data-ss-cores="${tema}">`);
	// As peças de ambiente (estrelas que cintilam, partículas que sobem do pé da página e o objeto do canto) ficam num
	// contêiner fixo atrás de todo o conteúdo. São só decoração: o CSS de cada tema decide quais aparecem e como se mexem.
	document.addEventListener('DOMContentLoaded', () => {
		const ambiente = document.createElement('div');
		ambiente.className = 'ss-ambiente';
		ambiente.setAttribute('aria-hidden', 'true');
		ambiente.innerHTML = '<div class="ss-cintilar"><i></i><i></i><i></i></div><div class="ss-subida"><i></i></div><div class="ss-deco"><i></i><i></i><i></i><i></i><i></i></div>';
		document.body.prepend(ambiente);
	});
	const modo = { claro: 'light', escuro: 'dark' }[busca.get('modo')];
	if (modo) {
		try {
			localStorage.setItem('starlight-theme', modo);
		} catch {}
		document.documentElement.dataset.theme = modo;
	}
})();
