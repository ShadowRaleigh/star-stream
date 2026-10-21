# Star Stream: livro de regras

Livro de regras do Star Stream, o RPG de mesa de Shadow Raleigh, publicado como site de documentação.

Este repositório é a **fonte oficial das regras**. O antigo Google Doc "System: Star Stream BETA" (versão 0.9) ficou congelado como arquivo histórico. Toda mudança de regra é feita aqui, num commit.

## Onde fica cada coisa

- `src/content/docs/`: as páginas, em Markdown. A pasta e o nome do arquivo definem o endereço (`personagem/atributos.md` vira `/personagem/atributos/`).
- `astro.config.mjs`: título do site e ordem do menu lateral. Uma página nova só aparece no menu depois de entrar aqui.
- `src/styles/star-stream.css`: cores, fontes e estilo das tabelas.
- `src/assets/`: imagens usadas nas páginas.
- `GUIA_DE_ESTILO.md`: como o texto das regras é escrito.

## Editar

1. Abra o arquivo da página em `src/content/docs/` e edite o Markdown.
2. Para ver o resultado: `npm install` (só na primeira vez) e depois `npm run dev`, e abra `http://localhost:4321/star-stream/`.
3. Faça o commit e envie. O GitHub Actions publica o site sozinho em alguns minutos.

Links entre páginas são relativos, por exemplo `[Atributos](../atributos/)` ou `[Defesas](../stats/#defesas)`. O `npm run build` falha se uma imagem não existir, e depois dele o `npm run check:links` confere todos os links internos e âncoras.

Avisos de seção incompleta:

```md
:::note[Em construção]
Texto do aviso.
:::
```
