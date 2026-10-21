# Star Stream: livro de regras

Livro de regras do Star Stream, o RPG de mesa de Zennova, publicado como site de documentação.

Este repositório é a **fonte oficial das regras**. O antigo Google Doc "System: Star Stream BETA" (versão 0.9) ficou congelado como arquivo histórico. Toda mudança de regra é feita aqui, num commit.

## Onde fica cada coisa

- `src/content/docs/`: as páginas, em Markdown. A pasta e o nome do arquivo definem o endereço (`personagem/atributos.md` vira `/personagem/atributos/`).
- `astro.config.mjs`: título do site e ordem do menu lateral. Uma página nova só aparece no menu depois de entrar aqui.
- `src/styles/star-stream.css` e `src/styles/temas/`: estilos base e os temas visuais (um arquivo por tema; a lista fica em `src/temas.mjs` e em `src/scripts/seletor-tema.js`).
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

## Temas visuais

O livro tem 16 temas visuais em três famílias, e cada tema tem 6 paletas de cor. O tema cuida da estética (estrutura, fontes, ornamentos e capa) e a paleta, das cores. O padrão é o Constelação, e o leitor escolhe tema, paleta e modo claro ou escuro nos seletores do topo da página (no celular, no fim do menu). A escolha fica salva no navegador, e cada tema lembra a última paleta usada.

- **Astra:** `constelacao`, `classico`, `observatorio`, `nebulosa`, `codex` e `astrolabio`.
- **Fantasia:** `grimorio`, `bosque`, `vitral`, `forja`, `mapa` e `abissal`.
- **Sci-fi:** `holograma`, `radar`, `circuito` e `navegacao`.

O mestre pode mandar aos jogadores um link já com o tema e a paleta da campanha, por exemplo `https://shadowraleigh.github.io/star-stream/?tema=grimorio&cor=carmesim`. Os nomes das paletas de cada tema estão em `src/cores.mjs`.

**Onde fica cada coisa:**

- A lista de temas fica em `src/temas.mjs`, e a de paletas em `src/cores.mjs`.
- Os temas de fantasia e de sci-fi compartilham uma base por família (`familia-fantasia.css` e `familia-scifi.css`), e o arquivo de cada tema só define cores, fontes, texturas e capa.
- A paleta padrão de cada tema está no arquivo do tema. As outras ficam em `public/cores/<tema>.css`, fora do CSS principal: o navegador só baixa as do tema em uso, e só quando a paleta escolhida não é a padrão.

**Scripts de geração em `tools/`:** depois de mudar uma paleta, rode-os nesta ordem.

1. `gerar-cores.mjs`: o CSS das paletas.
2. `gerar-ornamentos.mjs`: texturas, cantos e florões da fantasia.
3. `gerar-capas.mjs`: as capas desenhadas, as marcas d'água e as peças recoloridas de cada paleta.

`copiar-fontes.mjs` copia as fontes dos pacotes @fontsource para `public/fontes/` (só o alfabeto latino, com as licenças) e gera `src/styles/fontes.css`; rode-o ao trocar ou atualizar uma fonte. O script do topo pré-carrega as fontes de título e de texto do tema em uso (lista em `src/temas.mjs`).

`gerar-assets-temas.mjs` gera os ornamentos originais (estrelas, constelação, astrolábio, selos, pergaminho, couro, cantos e florões do Grimório).

**Animações:** cada tema tem um movimento de ambiente na página e um na capa, todos em `src/styles/temas/animacoes.css` (partículas em ladrilho que deslizam, peças que giram ou balançam). Só `transform` e `opacity` animam, e quem pede menos movimento no sistema não vê nenhuma.

**Desempenho:** as fontes são só do alfabeto latino e pré-carregadas, a foto da galáxia tem uma versão menor para o celular, o fundo de cada tema fica numa camada fixa (nada de `background-attachment: fixed`), o desfoque de vidro só aparece no cabeçalho do computador, e as animações só giram ou deslocam camadas (`transform`), nunca redesenham as capas. Quem pede menos movimento no sistema não vê animação nenhuma.
