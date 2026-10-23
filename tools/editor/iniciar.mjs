// Abre o editor do livro: sobe o astro dev só nesta máquina e abre /__editor no navegador.
import { spawn } from 'node:child_process';

const filho = spawn('npx', ['astro', 'dev'], {
	stdio: 'inherit',
	shell: true,
	env: { ...process.env, EDITOR_DO_LIVRO: '1' },
});
filho.on('exit', (codigo) => process.exit(codigo ?? 0));
