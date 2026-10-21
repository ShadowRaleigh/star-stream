---
title: "Rodadas, Turnos e Ações"
---
Uma rodada é o conjunto das ações de todos os personagens envolvidos ao longo de **5** segundos de combate. Ela se divide em turnos alternados entre os lados, seguindo a [iniciativa](#iniciativa). Na sua vez, cada personagem tem direito a uma **[Ação Principal](#ação-principal)**, uma **[Ação Bônus](#ação-bônus)**, uma **[Ação de movimento](#movimentação)** e uma **[Reação](#reação)**. Quando for o caso, também pode usar **[Resistências Lendárias](#resistências-lendárias)** ou **[Ações Lendárias](#ações-lendárias)**. Os recursos de cada personagem voltam quando chega a vez dele de novo, e o que não foi usado de uma vez para a outra se perde.

Ninguém usa ações de nenhum tipo fora da sua vez. Reações e Resistências Lendárias não são ações e podem ser usadas a qualquer momento da rodada, quando o gatilho delas acontece.

## Iniciativa

Quando um combate começa, todos os personagens rolam **d20 + [Modificador de Iniciativa]** (se houver). Compara-se o **maior resultado de cada lado**: o lado com o maior resultado **começa todas as rodadas**. Cada rodada se divide em **turnos**, que se **alternam** entre os lados (A → B → A → B). Os dois lados têm a **mesma quantidade de turnos** por rodada, e a quantidade de personagens que agem em cada turno é proporcional ao tamanho do lado. A alternância é a única coisa fixa: quem age em cada turno é escolhido pelo próprio lado, a cada rodada, conforme a estratégia. **Ninguém pode agir duas vezes antes de todos os personagens terem agido, a não ser com uma [Ação Lendária](#ações-lendárias).**

**Lados de tamanhos diferentes:** o lado maior age em **grupos**. Chame de **n** o número de personagens do lado menor: cada lado tem n turnos por rodada. No lado maior, cada turno tem o resultado da divisão de m por n, ignorando o resto (m é o tamanho do lado maior), e os personagens que sobram vão completando um a mais nos últimos turnos da rodada.

**Exemplos:**

* 2 contra 3: o lado maior tem 1 personagem no primeiro turno e 2 seguidos no último;
* 2 contra 4: o lado maior tem sempre 2 personagens por turno;
* 2 contra 5: o lado maior tem 2 personagens no primeiro turno e 3 no último;
* 3 contra 4: o lado maior tem 1 personagem nos dois primeiros turnos e 2 no último.

**Quem cai, morre ou foge:** quem está [Caído](../efeitos-de-status/#caído) ou [Morrendo](../efeitos-de-status/#morrendo) continua jogando a vez dele. A quantidade de turnos de cada lado só é recalculada quando alguém morre (ou foge), a partir da rodada seguinte.

**Ataque de abertura:** se o combate começa porque um personagem atacou outro, o lado dele começa a primeira rodada, mesmo sem ter ganhado a iniciativa. Dali em diante, começa o lado que ganhou a iniciativa.

## Ação Principal

A Ação Principal costuma ser a coisa mais importante que o personagem faz na sua vez. Se for mais conveniente, o jogador pode trocá-la por um **Dash**, um **Disengage**, uma segunda **Ação Bônus**, uma **Preparação** ou uma **Sustentação**, ou simplesmente não usá-la. Ela não tem duração exata, mas, pela lógica, leva mais de 2 segundos e menos de 5.

* **Dash:** você ganha uma segunda ação de movimentação naquela rodada.
* **Disengage:** se você está **[Engajado](../posicionamento/#engajando-inimigos)** com um inimigo, pode usar esta ação pra se afastar dele com segurança, sem permitir um ataque de oportunidade.
* **Sustentação:** você usa a Ação Principal pra manter o foco em todos os efeitos que exigem **[Concentração](../../personagem/stats/#concentração)**. Até o começo da sua próxima vez, nenhum Teste de Concentração quebra as suas concentrações ativas, qualquer que seja o resultado. Isso também vale para habilidades e feitiços que estão sendo preparados.
* **Dar Poção:** você usa a Ação Principal pra dar uma Poção de Cura a um aliado a até 1m.
* **Preparação:** você prepara uma ação para quando um gatilho acontecer. O gatilho é definido na preparação e deve ser algo que o personagem conseguiria perceber.

**Como funciona a Preparação:** quando o gatilho acontece, você escolhe se faz a ação ou não. Depois de definidos, o gatilho e a ação não mudam, e, se a ação não for usada, ela é descartada no começo da sua vez na rodada seguinte. Uma ação preparada, quando disparada, consome uma **[Reação](#reação)**. Uma ação pode ser preparada antes do combate (uma emboscada) e dispara como Reação quando o gatilho acontece. Se o gatilho não acontecer antes da primeira vez do personagem no combate, a ação é descartada no começo dessa vez, e ele pode usar a Ação Principal para preparar a emboscada de novo. Se a ação preparada disparar no meio de uma sequência (como a do [Ímpeto de Execução](../../arquetipos/iniciador/#habilidade-ativa-ímpeto-de-execução)), ela não interrompe a sequência: a sequência continua depois dela.

## Ação Bônus

A Ação Bônus é uma ação menor, usada para ativar efeitos menores e ações mais específicas. Toda Ação Bônus dura menos de **2s**.

**Exemplos:**

* Tomar uma poção pequena.
* Castar um feitiço que já está pronto, mas ainda não foi castado.
* Usar um item básico.

## Ação Livre

A menor ação de uma rodada. Ela não faz parte da rodada normal do personagem: é uma ação extra, que só pode ser feita na rodada em que é concedida por habilidades, [talentos](../../personagem/talentos/) ou pelas circunstâncias. A Ação Livre não usa tempo no jogo, e não há limite de quantas Ações Livres um personagem pode fazer por rodada, mas cada Ação Livre específica tem o próprio limite de usos. Se ela não disser quantas vezes pode ser usada, vale uma vez por rodada.

**Exemplos:**

* Apertar um botão ou interagir rapidamente com algo do ambiente.
* Chorar (sempre disponível).
* Soltar algo ou largar a concentração de um feitiço ou habilidade.
* Reclamar (se o DM estiver de bom humor).
* Falar e conversar "in character".
* Xingar o nano nuts (esteja ele presente ou não).

## Movimentação

Em combate, o personagem se move até um limite por rodada. Ações acrobáticas, como saltar um vão ou escalar uma parede, gastam um metro extra de movimentação a cada metro percorrido. Personagens com estilo de combate corpo a corpo (inclusive o Misto) se movem **13m** por rodada; os de estilo à distância e o Conduíte, **10m** (ver [Estilos de Combate](../../personagem/estilos-de-combate/)). [Raça](../../racas/), [títulos](../../personagem/titulos/), habilidades, buffs e outros modificadores podem aumentar ou diminuir esse valor. A movimentação não precisa ser feita de uma vez: pode ser dividida em várias partes ao longo da vez do personagem.

**Exemplos:**

* Um humano comum com estilo à distância anda até 10m numa rodada, ou escala 5m, ou pula um vão de 5m. Com algum buff ou modificador, ele pode se mover mais ou menos que isso.
* Um personagem pode andar 4m para ficar ao alcance de um inimigo e usar uma habilidade com a Ação Principal, andar mais 2m para usar a Ação Bônus num aliado e, por fim, andar mais 4m para recuar da linha de frente.

## Reação

A Reação é uma das poucas coisas que o personagem faz em combate fora da sua vez. Ela depende de um gatilho: uma condição específica do combate que permite reagir. Sem gatilho, não há Reação.

Quando o gatilho acontece, o personagem escolhe se usa a Reação ou deixa a oportunidade passar. Cada personagem tem só uma Reação por rodada.

**Exemplos:**

* Se um inimigo se afasta de você sem se desengajar, você pode fazer um [ataque de oportunidade](../posicionamento/#efeito) como Reação. Mas, se você já tiver usado a Reação naquela rodada, ele pode se afastar sem se desengajar, e você não consegue reagir.
* Como os recursos só são descartados e recuperados quando chega a sua vez, você pode preparar uma ação na rodada 1 para um gatilho na rodada 2, antes da sua vez. Na sua vez, a Reação volta. Então, ainda na rodada 2, você pode atacar um inimigo que se afastou de você sem se desengajar, usando 2 Reações na rodada 2.
* Reações podem responder a outras Reações. Se um mago pode lançar um feitiço como Reação toda vez que um inimigo causa dano a ele, o mago A, na sua vez, pode atacar o mago B, que reage com esse feitiço. Ao receber o dano da Reação do mago B, o mago A também pode usar a Reação dele. Assim, o mago A, na sua vez, atacou com a Ação Principal, fez algo com a Ação Bônus e usou a Reação contra a Reação do adversário.

## Escalada

A partir da 3ª rodada de um combate, os personagens (monstros e criaturas não escalam) ganham, a cada rodada, **+5** de [Precisão](../../personagem/stats/#precisão) e **+30%** de dano, acumulando por até 6 passos. No 6º passo, o bônus é de **+30** de Precisão e **+180%** de dano. O bônus de dano é um bônus externo: entra na soma dos bônus da [Fórmula de Dano](../ataque-e-dano/#fórmula-de-dano).

## Ações Lendárias

Personagens importantes para o mundo, criaturas míticas e seres poderosos podem ter Ações Lendárias, uma forma de ação especial **exclusiva** de NPCs. Elas se recuperam a cada vez que o personagem joga, e cada uma conta como uma ação extra na vez dele. A quantidade de Ações Lendárias de cada criatura fica a cargo do mestre: em geral, o bastante para ela ter um número de ações parecido com o do grupo que enfrenta.

## Resistências Lendárias

Personagens importantes para o mundo, criaturas míticas e seres poderosos podem ter Resistências Lendárias, uma interação especial **exclusiva** de NPCs. Com elas, o NPC pode passar automaticamente num saving throw em que já falhou ou baixar em uma faixa o resultado de um ataque. A decisão vem depois de ver a rolagem e antes da rolagem de dano, e vale contra qualquer rolagem feita contra o NPC.
