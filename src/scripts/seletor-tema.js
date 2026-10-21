// Aplica o tema visual do livro antes da página aparecer: ?tema= na URL (o link que o mestre manda), depois a última escolha, depois o padrão.
(() => {
	const temas = ['constelacao', 'observatorio', 'holograma', 'nebulosa', 'codex', 'grimorio', 'astrolabio', 'carta'];
	const busca = new URLSearchParams(location.search);
	const pedido = busca.get('tema');
	let salvo = null;
	try {
		salvo = localStorage.getItem('ss-tema');
	} catch {}
	let tema = temas.includes(pedido) ? pedido : temas.includes(salvo) ? salvo : temas[0];
	try {
		if (temas.includes(pedido)) localStorage.setItem('ss-tema', tema);
	} catch {}
	document.documentElement.dataset.ssTema = tema;
	const modo = { claro: 'light', escuro: 'dark' }[busca.get('modo')];
	if (modo) {
		try {
			localStorage.setItem('starlight-theme', modo);
		} catch {}
		document.documentElement.dataset.theme = modo;
	}
})();
