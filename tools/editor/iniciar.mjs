// Abre o editor do livro: traz a versão mais nova do GitHub, sobe o astro dev só nesta máquina e abre /__editor.
import { spawn, spawnSync } from 'node:child_process';

console.log('Buscando a versão mais nova do livro no GitHub...');
const pull = spawnSync('git', ['pull', '--rebase', '--autostash'], { encoding: 'utf8' });
if (pull.status === 0) console.log(pull.stdout.trim() || 'Livro em dia.');
else console.log(`Não deu para atualizar agora (${(pull.stderr || pull.stdout).trim().split('\n')[0]}). O editor abre com a versão deste computador.`);

console.log('\nAbrindo o editor. Deixe esta janela aberta enquanto edita; feche-a para parar.\n');
const filho = spawn('npx', ['astro', 'dev'], {
	stdio: 'inherit',
	shell: true,
	env: { ...process.env, EDITOR_DO_LIVRO: '1' },
});
filho.on('exit', (codigo) => process.exit(codigo ?? 0));
