# Instruções para agentes

- Este repositório é a fonte oficial das regras do Star Stream. Nunca descreva uma regra de memória: leia a página.
- Texto de regra em pt-BR, seguindo o `GUIA_DE_ESTILO.md` (geração recente do texto: "para", vírgula decimal, "×" e "−" tipográficos, sem travessão).
- Regra nova ou mudança de regra só entra com aprovação do autor. Correção de estrutura, links e formatação pode ser feita direto.
- Antes de concluir, rode `npm run build` e `npm run check:links` (confere todos os links internos e âncoras).
- Servidor de desenvolvimento: `npm run dev` (porta 4321, na raiz: `http://127.0.0.1:4321/`).
- O autor edita pelo editor do livro (`npm run editor`, `tools/editor/`): ele grava a página no disco enquanto o autor digita e, no Ctrl+S, faz o commit "Edita <página>" e o push. Antes de mexer numa página, veja no `git status` se ela tem alterações dele ainda não publicadas e não as sobrescreva.
