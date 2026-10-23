---
title: "Criação de Habilidades"
---
Ao ganhar **[PH](../#pontos-de-habilidade-ph)**, você pode gastar esses pontos entre sessões para criar habilidades novas ou aprimorar as que já tem.
Criar uma habilidade custa **2 PH**, e você precisa ficar atento a 3 coisas:

* As habilidades têm alguns parâmetros definidos por padrão.

**Exemplo:** habilidades que causam dano ou cura direta têm os dados de dano ou de cura definidos pelo tier, então eles sempre escalam conforme o personagem evolui. Isso quer dizer que você não precisa gastar PH só para impedir que as suas habilidades antigas fiquem inúteis, mas também quer dizer que você não escolhe quanto de dano ou de cura os seus feitiços causam.

* Outros parâmetros da habilidade podem ser escolhidos de uma lista de opções.

**Exemplo:** os efeitos da habilidade são escolhidos entre os que o personagem já desbloqueou nas árvores das **[Capacidades](../capacidades/)** (os efeitos de status que elas aplicam estão em [Efeitos de Status](../../combate/efeitos-de-status/)), e a **[duração](#duração)** sai da tabela mais abaixo. O escopo do que as suas habilidades podem fazer depende das Capacidades do personagem.

* Os Fatores de Custo são taxas aditivas, que multiplicam o custo base da habilidade para chegar ao custo final.

## Estrutura

Uma habilidade pode ter os campos abaixo:

* **Tipo de Sincronia:** define se a habilidade é simples ou especial (ver [Slots de Sincronia](../#slots-de-sincronia)).

* **Tipo de Habilidade:** Suporte, Tática ou Ofensiva.

* **Tipo de Alvo:** se o alvo da habilidade é target, você mesmo (Self) ou em área. Uma habilidade em área sempre afeta o próprio lançador quando ele está dentro da área. Uma habilidade de alvo “1 aliado” pode ter o próprio lançador como alvo; já as condições que citam um aliado (como “um aliado a até 2m”), em geral, não incluem o próprio personagem.

* **Tipo de Ataque:** qual **[Defesa](../../personagem/stats/#defesas)** a habilidade enfrenta quando é usada para atacar alguém (ver [Classificação de Ataques e Defesas associadas](../../combate/ataque-e-dano/#classificação-de-ataques-e-defesas-associadas)).

* **Tipo de Dano:** nas habilidades que causam dano, o [tipo de dano](../../combate/ataque-e-dano/#tipos-de-dano) causado, que define quais [Resistências](../../personagem/stats/#resistências) e [Fraquezas](../../personagem/stats/#fraquezas) se aplicam.

* **Velocidade:** o tempo que a habilidade leva para ser usada (ver [Velocidade](#velocidade)). Se for menor ou igual a 5s, ela pode ser usada como **[Ação Principal](../../combate/rodadas-e-acoes/#ação-principal)**; se for menor ou igual a 2s, como **[Ação Bônus](../../combate/rodadas-e-acoes/#ação-bônus)**. Caso seja maior que 5s, ela precisa ser carregada com a Ação Principal em todas as rodadas, até ser usada automaticamente quando o tempo restante for menor ou igual a 5s (uma habilidade Lenta, de 10s, dispara na 2ª rodada); opcionalmente, caso o tempo restante até ela ficar pronta seja menor ou igual a 2s, ela pode ser ativada como Ação Bônus. Enquanto você estiver carregando uma habilidade, receber dano exige um **[Teste de Concentração](../../personagem/stats/#concentração)** para saber se a habilidade é perdida, com todos os recursos envolvidos. Caso uma rodada se passe sem que você use a Ação Principal para carregá-la ou a Ação Bônus para ativá-la, a habilidade é cancelada, e os recursos não são consumidos.

* **Área:** caso a habilidade seja em área, este campo especifica o formato e o tamanho da área (ver [Área](#área)). Se a habilidade não for em área, o campo não precisa estar presente.

* **Alcance:** a distância máxima entre quem usa a habilidade e o alvo, ou entre quem usa e o epicentro da área (ver [Alcance](#alcance)). O tamanho da área em volta do epicentro é definido pelo campo Área. Se a habilidade for de alvo Self, o campo não precisa estar presente.

* **Efeito:** o que a habilidade faz. É a seção principal da habilidade, que define exatamente o que ela faz e quais fatores afetam o seu funcionamento. Por padrão, se um cenário não for incluído no efeito da habilidade, ela não funciona nesse cenário. Excepcionalmente, o mestre pode sobrescrever essa regra.

* **Duração:** nem toda habilidade tem duração: um dano ou uma cura direta, sem efeito que continue depois, não tem este campo. Caso ela exija ativação constante, dura até a concentração ser interrompida. Caso tenha algum efeito que dure um número específico de rodadas ou de minutos, o campo mostra esses dados ou a duração em minutos (ver [Duração](#duração)).

* **Custo Base:** o custo no recurso principal que você recebe da sua [origem](../../personagem/origens/), a **[Energia](../../personagem/origens/#energia)** (ver [Custo Base](#custo-base)). Nem toda habilidade tem custo: habilidades com circunstâncias especiais, como as de [arquétipo](../../arquetipos/) ou de [histórico](../../historicos/), podem não ter.

* **Fator de Custo:** a soma dos fatores de custo de cada opção de customização escolhida para a habilidade, mais 1.

* **Custo Final:** o valor em Energia efetivamente pago ao usar a habilidade: o custo base vezes o Fator de Custo total.

* **Custo Material:** caso a habilidade tenha algum efeito especial, ela certamente terá um custo material, e o item consumido deve estar descrito aqui (ver [Custo Material](#custo-material)). Caso a habilidade não tenha um custo desses, o campo não precisa estar presente.

* **Condições:** a habilidade pode ter condições específicas para ser ativada, como forma de compensar um efeito mais poderoso ou uma versão mais forte dela. Caso existam, elas ficam neste campo; caso não existam, o campo pode ser omitido.

* **Limite de Usos:** quantas vezes a habilidade pode ser usada e em qual intervalo de tempo (ver [Limite de Usos](#limite-de-usos)). Geralmente, habilidades simples podem ser usadas várias vezes por **[Descanso Curto](../../exploracao/descanso-e-provisoes/#descanso-curto)**, ou até por combate, enquanto habilidades especiais só podem ser usadas algumas vezes por **[Pernoite](../../exploracao/descanso-e-provisoes/#pernoite)** ou por **[Descanso Longo](../../exploracao/descanso-e-provisoes/#descanso-longo)**, mas nem todas as habilidades têm esse tipo de limite. Uma habilidade sem limite de usos é **Ilimitada** e paga o fator de custo dela na tabela.

* **Efeitos Adicionais:** efeitos extras que não acontecem durante a habilidade em si: um dano ou efeito aplicado mais tarde, uma penalidade que você sofre por usar a habilidade ou algo do gênero. Se a habilidade não tiver efeitos adicionais, o campo pode ser omitido.

## Aspectos Fixos


### Efeitos

* Os tiers de habilidade acompanham a categoria das [armas](../../combate/equipamento/#precisão-e-dano-base-por-categoria) e [armaduras](../../combate/equipamento/#armadura) e são desbloqueados nos mesmos níveis: Tier 1 no nível 1, Tier 2 no 5, Tier 3 no 10, Tier 4 no 15, Tier 5 no 25, Tier 6 no 35, Tier 7 no 50, Tier 8 no 70 e Tier 9 no 100.
* O número de efeitos que uma habilidade pode ter depende do tier e do **tipo de sincronia** dela, segundo a tabela a seguir:

| Tiers | Simples | Especial |
| :---: | :---: | :---: |
| Tier 1 | 1 efeito | 2 efeitos |
| Tier 2 | 2 efeitos | 3 efeitos |
| Tier 3 | 3 efeitos | 5 efeitos |
| Tier 4 | 4 efeitos | 6 efeitos |
| Tier 5 | 5 efeitos | 8 efeitos |
| Tier 6 | 6 efeitos | 9 efeitos |
| Tier 7 | 7 efeitos | 11 efeitos |
| Tier 8 | 8 efeitos | 12 efeitos |
| Tier 9 | 9 efeitos | 14 efeitos |

**Efeitos com rolagem:** buffs e debuffs com rolagem seguem o [resultado do ataque](../../combate/ataque-e-dano/#execução-do-ataque): em **Erro**, o efeito não é aplicado; em **Raspão**, dura metade das rodadas da duração rolada, arredondada para baixo, com no mínimo 1 rodada; em **Acerto** ou melhor, dura a duração da habilidade. Efeitos de **controle** (como [atordoar](../../combate/efeitos-de-status/#atordoado)) só são aplicados com Acerto ou melhor.

### Dano

* O dano é definido pelo **Tipo de Sincronia** da habilidade (simples ou especial, pela Forma do ataque abaixo) e escala com o tier.
* **Dano base:** o dano do ataque básico de uma arma da mesma categoria do tier da habilidade, multiplicado por **1,65** (no lugar do multiplicador do [estilo de combate](../../personagem/estilos-de-combate/)).
* Sobre o dano base, vale a **Forma do ataque** da [Fórmula de Dano](../../combate/ataque-e-dano/#fórmula-de-dano).

### Cura

* A cura escala com o tier e usa a mesma conta do dano (ver [Fórmula de Dano](../../combate/ataque-e-dano/#fórmula-de-dano)).

### Área

* Caso a habilidade tenha uma área de efeito, você escolhe o formato da área entre:
  * **Quadrilátero**;
  * **Círculo**;
  * **Cone**.

* O tamanho base da área escala com o nível, segundo a tabela abaixo:

| Tier | Círculo (Raio) | Quadrado (Lado) | Cone (Comprimento) |
| :---: | :---: | :---: | :---: |
| Tier 1 | 2m | 3m | 2m |
| Tier 2 | 3m | 6m | 5m |
| Tier 3 | 5m | 9m | 9m |
| Tier 4 | 6m | 12m | 12m |
| Tier 5 | 8m | 15m | 15m |
| Tier 6 | 9m | 17m | 17m |
| Tier 7 | 11m | 19m | 20m |
| Tier 8 | 12m | 22m | 22m |
| Tier 9 | 14m | 25m | 25m |

* Ao criar a habilidade, você pode escolher qualquer tamanho menor que o tamanho base. Isso não reduz o custo final da habilidade.
* Nas habilidades com área de quadrilátero, o formato não precisa ser um quadrado, mas precisa ser um quadrilátero com a mesma área de um quadrado com o lado indicado na tabela. Por padrão, a área é um quadrado com esse lado, centrado no ponto onde a habilidade é usada.
* Cones têm abertura de 60°: na grade hexagonal, o cone sai numa das 6 direções, e cada fileira à frente tem uma casa a mais que a anterior.
* Na hora de usar uma habilidade em área, você pode sacrificar 50% de todo o efeito dela (dano, cura, duração e o resto) para aumentar o raio, o lado ou o comprimento em até 50%. O tamanho final não precisa ser 50% maior, mas, para qualquer tamanho maior que o base, o efeito é reduzido em 50%. A criação assume o uso normal; o sacrifício é uma escolha do momento, para se adaptar à situação, e não dá para combiná-lo com o sacrifício de alcance no mesmo uso.
* O centro (ou o ponto de origem) de uma habilidade em área precisa estar na linha de visão de quem a usa. Na grade hexagonal, a área é aproximada pelas casas: o círculo pega as casas até o raio, e o quadrilátero, as casas que cobrem a mesma área.


### Custo Base

* O custo base da habilidade, em **[Energia](../../personagem/origens/#energia)**, escala com o tier, segundo as tabelas abaixo:

**Simples:**

| Tier | Custo Base de Energia |
| :---: | :---: |
| Tier 1 | 1,4 |
| Tier 2 | 4,2 |
| Tier 3 | 7,7 |
| Tier 4 | 12 |
| Tier 5 | 18,4 |
| Tier 6 | 26,2 |
| Tier 7 | 36,7 |
| Tier 8 | 49,6 |
| Tier 9 | 70 |

**Especial:**

| Tier | Custo Base de Energia |
| :---: | :---: |
| Tier 1 | 2,8 |
| Tier 2 | 8,3 |
| Tier 3 | 15 |
| Tier 4 | 23,8 |
| Tier 5 | 36,7 |
| Tier 6 | 51,8 |
| Tier 7 | 72,4 |
| Tier 8 | 98,6 |
| Tier 9 | 140 |

* Caso a habilidade seja em área (AoE), ela soma **+20%** ao Fator de Custo.


### Custo Material

* Ao criar uma habilidade, dependendo das características incluídas, ela pode ter um ou mais custos materiais.
* Onde o material for especificado, também aparece ao lado um custo em dinheiro, que é o preço padrão daquele material em uma loja genérica. Em ocasiões especiais, o mestre pode deixar um material mais caro ou mais barato, conforme as circunstâncias locais.
* Geralmente, o material especificado é consumido toda vez que a habilidade é ativada, mas, excepcionalmente, ele pode não ser consumido, caso a habilidade ou a característica diga isso.

## Aspectos de Seleção


### Velocidade

* Você tem **4** opções para decidir o quão rápido as suas habilidades são usadas:

| Tier de Velocidade | Velocidade | Fator de custo |
| ----- | :---: | :---: |
| **Lento** | **10s** | −35% |
| **Normal** | **5s ([Ação Principal](../../combate/rodadas-e-acoes/#ação-principal))** | 0% |
| **Rápido** | **2s ([Ação Bônus](../../combate/rodadas-e-acoes/#ação-bônus))** | +30% |
| **Instantâneo** | **0s ([Reação](../../combate/rodadas-e-acoes/#reação))** | +60% |

* Habilidades **ofensivas** não podem ser mais rápidas que a velocidade **Normal**.


### Alcance

* Você escolhe até onde as suas habilidades alcançam com base na tabela abaixo. Além disso, habilidades especiais ganham 30% de alcance bônus.
* Na hora de usar a habilidade, você pode sacrificar 50% de todo o efeito dela para ter um alcance 50% maior. Não dá para combinar com o sacrifício de área no mesmo uso.

| Alcance | Distância (m) | Fator de custo |
| ----- | :---: | :---: |
| **Toque** | **Toque** | −15% |
| **Curta** | **5** | 0% |
| **Média** | **10** | +15% |
| **Longa** | **20** | +25% |
| **Longuíssima** | **30** | +50% |


### Duração

* A duração vale para efeitos que continuam ao longo das rodadas (overtime), como um dano por rodada. Uma Instantânea dura 1 rodada.
* Caso o seu feitiço tenha um efeito persistente, ele naturalmente já exige um sacrifício material para ser usado. Por isso, por padrão, os feitiços são de curta duração. Na criação da habilidade, você pode aumentar essa duração, recebendo uma penalidade no custo base final dela.

| Tier de Duração | Duração (Dados) | Média de Rodadas | Fator de Custo |
| ----- | :---: | :---: | :---: |
| **Instantânea** | **1 rodada** | 1 | −15% |
| **Curta** | **1d3 rodadas** | 2 | 0% |
| **Média** | **2d3 rodadas** | 4 | +25% |
| **Longa** | **2d5 rodadas** | 6 | +50% |
| **[Concentração](../../personagem/stats/#concentração)** | **Indefinida** | N/A | +40% |

* Caso a habilidade seja do tipo **Especial**, cada tier de duração com dados ganha 1 dado adicional (1d3 vira 2d3, 2d5 vira 3d5). A Instantânea e a Concentração não mudam.


### Limite de Usos

* Os usos têm fatores de custo baseados tanto no **número de usos** quanto no **intervalo de recuperação**, como mostram as tabelas abaixo:

**Número de usos:**

| Usos | Fator de custo | Explicação |
| :---: | :---: | :---: |
| **1** | **0%** | **Número base** |
| **2 - 5** | **10% por uso extra** | **Ex.: uma skill com 3 usos custa 20% a mais** |
| **Escalonável** | **30% fixo** | **Fórmula de usos: 1 + (Nível/10), arredondado para o inteiro mais próximo** |
| **Ilimitado** | **100%** | **Infinity, pai.** |

**Intervalo de Recuperação:**

**Simples:**

| Intervalo de Recuperação | Fator de Custo | Explicação |
| :---: | :---: | :---: |
| **Por [Pernoite](../../exploracao/descanso-e-provisoes/#pernoite)** | **−20%** | **Se você deixar a sua skill recuperando nesses descansos, ela fica menos versátil, mas mais barata** |
| **Por [Descanso Curto](../../exploracao/descanso-e-provisoes/#descanso-curto)** | **0% (Base)** | **Valor base. Tu descansa um pouco, tira uma soneca e acorda recuperado** |
| **Por Combate** | **+50%** | **Permite usar habilidades relevantes em combate de forma extremamente consistente** |

**Especial:**

| Intervalo de Recuperação | Fator de Custo | Explicação |
| :---: | :---: | :---: |
| **Por [Descanso Longo](../../exploracao/descanso-e-provisoes/#descanso-longo)** | **−25%** | **Se você deixar a sua skill recuperando apenas em descansos longos, ela fica menos versátil, mas mais barata** |
| **Por Pernoite** | **0% (Base)** | **Valor base. Tu dorme e acorda recuperado** |
| **Por Descanso Curto** | **+75%** | **Permite usar habilidades poderosas várias vezes ao dia. Isso muda o patamar do personagem, então o custo de energia quase dobra.** |

## Capacidades

Os efeitos que podem entrar numa habilidade vêm das árvores de habilidade. As regras de desbloqueio estão em [Capacidades](../capacidades/).
