// Seletor de tema visual (ramo de comparação do rework). Lê ?tema= na URL ou o último tema escolhido.
(() => {
	const nomes = {
		atual: 'Atual (publicado)',
		constelacao: '1 · Constelação',
		observatorio: '2 · Observatório',
		holograma: '3 · Holograma Arcano',
		nebulosa: '4 · Nebulosa',
		codex: '5 · Codex Celeste',
		grimorio: 'Extra · Grimório',
	};
	const pedido = new URLSearchParams(location.search).get('tema');
	let tema = pedido || (() => { try { return localStorage.getItem('ss-tema'); } catch { return null; } })() || 'atual';
	if (!(tema in nomes)) tema = 'atual';
	try { if (pedido) localStorage.setItem('ss-tema', tema); } catch {}
	document.documentElement.dataset.ssTema = tema;
	const modo = { claro: 'light', escuro: 'dark' }[new URLSearchParams(location.search).get('modo')];
	if (modo) {
		try { localStorage.setItem('starlight-theme', modo); } catch {}
		document.documentElement.dataset.theme = modo;
	}
	if (new URLSearchParams(location.search).has('captura')) return;
	addEventListener('DOMContentLoaded', () => {
		const s = document.createElement('select');
		s.className = 'ss-seletor-tema';
		s.setAttribute('aria-label', 'Tema visual');
		for (const [v, n] of Object.entries(nomes)) s.append(new Option(n, v, false, v === tema));
		s.addEventListener('change', () => {
			try { localStorage.setItem('ss-tema', s.value); } catch {}
			document.documentElement.dataset.ssTema = s.value;
		});
		document.body.append(s);
	});
})();
