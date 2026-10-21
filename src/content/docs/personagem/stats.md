---
title: "Stats"
---
Stats são números que representam as características e estatísticas do personagem num nível de detalhe maior que os [atributos](../atributos/). Quase todos os stats são influenciados pelos atributos.

Eles se dividem em **Intrínsecos** e **Extrínsecos**, e cada grupo ainda se divide em **obrigatórios**, que todo personagem tem, e **situacionais**, que um personagem pode ou não ter, dependendo da raça, de eventos e de outros fatores.

## Intrínsecos

Stats **Intrínsecos** representam características que só mudam por mecânicas do próprio personagem (**[nível](../criacao/#nível)**, **[talentos](../talentos/)** e **[títulos](../titulos/)**) ou por eventos específicos ao longo do jogo.

### Obrigatórios

#### Health Points (HP)

O HP é a vida máxima do personagem. Ele é definido por um **HitDie**, rolado a cada nível que o personagem sobe para aumentar a vida máxima. No nível 1, o personagem começa com **3 HitDies** no valor máximo (ex.: um HitDie d10 dá **30** de vida base), e a partir do nível 2 rola **1 HitDie** por nível. O HP é diretamente influenciado pela **[RES](../atributos/#resistência-res)**.

#### Sanidade (SAN)

A SAN é a sanidade máxima do personagem. O valor base é **100**, com **+1** por nível e um bônus ou penalidade de **±1** para cada ponto de **[DET](../atributos/#determinação-det)** acima ou abaixo de **10**. Se a sanidade ficar **abaixo da metade**, o personagem ganha uma **Aflição Mental** temporária; se chegar a **0**, ganha uma **Característica de Insanidade** permanente. A SAN pode ficar negativa: se chegar a **−100**, o personagem morre na hora.

**Aflição Mental:** quando a SAN fica abaixo da metade, o personagem ganha uma aflição ligada ao que abalou a mente dele, escolhida pelo mestre (um medo, uma paranoia, uma compulsão, um apagão de memória). Quando a cena toca na aflição, a critério do mestre, ele tem **[desvantagem](../../regras/dados/#vantagens-e-desvantagens)** em todas as rolagens, inclusive ataques e Testes de Concentração, até o fim da cena. A aflição temporária acaba quando a SAN deixa de estar abaixo da metade.

**Característica de Insanidade:** quando a SAN chega a 0, o personagem ganha uma aflição permanente, com o mesmo efeito da Aflição Mental, que não acaba quando a SAN se recupera. Ela só sai com tratamento (ver o histórico [Médico](../../historicos/medico/)) ou por um evento da história.

**Recuperação:** a SAN não se recupera com [descansos](../../exploracao/descanso-e-provisoes/#descanso). Ela só volta com tratamento especializado, como o do histórico [Médico](../../historicos/medico/), ou com itens de cura próprios, que são raros e caros.

#### Life Force (LF)

A LF é a energia vital máxima do personagem: a vitalidade, a longevidade e a saúde geral dele. Alguns tipos de magia e de equipamento tecnológico consomem LF. Ela é definida na criação da ficha, a partir de vários fatores, e varia pouco ao longo da campanha. Personagens maiores, mais saudáveis ou mais longevos tendem a ter mais LF. A LF é influenciada pela **[RES](../atributos/#resistência-res)** e raramente entra em jogo, mas se chegar a **0**, o personagem morre na hora.

### Situacionais

#### Mana Points (MP)

A Mana é a energia elemental que um mago ou um personagem tecnomágico acumula no seu núcleo para manifestar externamente, construir feitiços e alimentar equipamentos tecnológicos. Cresce a cada nível conforme a [origem](../origens/).

#### Qi

O Qi é a energia elemental acumulada e refinada no núcleo de Qi, usada por artistas marciais pra fortalecer o corpo e executar técnicas marciais. Cresce a cada nível conforme a [origem](../origens/).

#### Plasma Estelar (PE)

A mistura da energia elemental com a energia da vida gera um tipo peculiar de energia, capaz de subverter a causalidade e as relações de causa e consequência, manifestando eventos que contrariam qualquer lógica e estão além da compreensão. Geralmente está associada a seres superiores ou divindades. Cresce **+2** de PE por nível, sem rolagem (ver [Origens](../origens/)).

**Nota:** existem outros stats, muito específicos ou raros, que dependem de eventos do jogo. O mestre explica cada um deles quando um jogador o descobre ou adquire.

## Extrínsecos

Stats **Extrínsecos** podem mudar tanto por mecânicas do próprio personagem quanto por fatores externos ([equipamentos](../../combate/equipamento/), consumíveis, [estilos de combate](../estilos-de-combate/) etc.) e por eventos do jogo.

### Obrigatórios

#### Precisão

A Precisão é o stat que o atacante soma à rolagem de ataque contra a **[Defesa](#defesas)** apropriada do alvo (ver [Classificação de Ataques e Defesas associadas](../../combate/ataque-e-dano/#classificação-de-ataques-e-defesas-associadas) e [Execução do Ataque](../../combate/ataque-e-dano/#execução-do-ataque)). Ela pode mudar com estilos de combate, efeitos temporários, equipamento ativo e outros fatores. Todo personagem começa com Precisão base **22**, com **+1** a cada nível. A **[PER](../atributos/#percepção-per)** dá **+1** de Precisão por ponto acima de 10 (ou **−1** por ponto abaixo).

#### Concentração

A Concentração garante que uma ação, [habilidade](../../habilidades/) ou feitiço não seja interrompido nem perca o progresso por imprevistos ou ataques inimigos. É afetada pela **[DET](../atributos/#determinação-det)**.

Entre os vários usos, três são os principais: impedir que um mago perca um feitiço já criado e ainda não lançado; impedir que uma habilidade ou feitiço que leva mais de uma rodada para ser preparado seja interrompido; e impedir que habilidades ou feitiços de ativação constante sejam interrompidos antes da hora.

**Teste de Concentração:** todo personagem começa com Concentração base **20**. Sempre que um personagem recebe dano enquanto mantém uma concentração ou prepara uma habilidade, quem causou o dano faz um teste contra ele: **d100 + Precisão − ([Mental](#mental) + Concentração)**. Caso o dano não venha de um ataque (dano contínuo, armadilhas ou efeitos em área sem rolagem de ataque), o mestre usa **20 + o nível da fonte** no lugar da Precisão. Cada instância de dano gera um teste separado, e o resultado segue as mesmas [faixas de um ataque](../../combate/ataque-e-dano/#execução-do-ataque):

* **Erro ou Raspão:** a concentração é mantida.
* **Acerto:** a concentração é quebrada.
* **Crítico:** a concentração é quebrada, e o personagem não pode se concentrar em nada durante a próxima rodada.
* **Crítico Duplo:** a concentração é quebrada, e o personagem não pode se concentrar em nada durante as próximas 2 rodadas.

Um personagem que usou a ação de **[Sustentação](../../combate/rodadas-e-acoes/#ação-principal)** mantém as concentrações até a próxima vez dele, qualquer que seja o resultado do teste.

**Múltiplas Concentrações:** a primeira concentração ativa não tem custo. Para cada concentração ativa além da primeira, o personagem sofre as penalidades abaixo, que se acumulam:

* **Em combate:** todas as rolagens feitas contra o personagem, inclusive ataques e Testes de Concentração, ganham uma **[vantagem](../../regras/dados/#vantagens-e-desvantagens)**.
* **Fora de combate:** as rolagens do personagem têm uma **desvantagem**, e os testes resolvidos sem rolagem consideram o nível da perícia ou do atributo reduzido em **1**.

As penalidades duram até o personagem soltar concentrações suficientes ou até elas serem quebradas.

#### Velocidade de Ação

A Velocidade de Ação é o quão rápido o personagem realiza qualquer ação fora de combate (exceto movimentação), como rituais, fabricação e outras ações longas. Ela não se aplica em combate. A velocidade padrão é **1**, ou **100%**, com bônus ou penalidade em porcentagem dados pela **[DEX](../atributos/#destreza-dex)**.

Isso quer dizer que um personagem com **200%** de Velocidade de Ação faz as coisas na metade do tempo normal, e um com **50%** leva o dobro do tempo.

#### Defesas

As Defesas são, na verdade, quatro stats. Cada uma é o valor subtraído do resultado de um ataque daquele tipo (ver [Execução do Ataque](../../combate/ataque-e-dano/#execução-do-ataque)):

* <span id="deflexão"></span>**Deflexão:** a capacidade de defletir ou evitar ataques físicos diretos. É influenciada pela **[DET](../atributos/#determinação-det)**.
* <span id="fortitude"></span>**Fortitude:** a capacidade de resistir a ataques que afetam a biologia ou o funcionamento interno do corpo. É influenciada pela **[RES](../atributos/#resistência-res)** e pelo **[POD](../atributos/#poder-pod)**.
* <span id="mental"></span>**Mental:** a força mental e a capacidade de resistir a ataques psicológicos. É influenciada pelo **[INT](../atributos/#intelecto-int)** e pela **[DET](../atributos/#determinação-det)**.
* <span id="reflexos"></span>**Reflexos:** a capacidade de desviar de ataques em área ou de eventos surpresa. É influenciada pela **[DEX](../atributos/#destreza-dex)** e pela **[PER](../atributos/#percepção-per)**.

**Nota:** as Defesas também podem mudar com consumíveis, [equipamentos](../../combate/equipamento/), [talentos](../talentos/), [títulos](../titulos/) e outros fatores. Elas não têm nada a ver com redução de dano **(RD)** ou penetração de armadura **(PA)**. Todas as Defesas aumentam em **+1** a cada nível, e a **[Defesa Principal](../../arquetipos/#defesa-principal)** de cada arquétipo recebe mais **+2** a cada **[Quebra de Limite](../criacao/#quebra-de-limite)**. O efeito de cada atributo nas Defesas está em [Atributos em Combate](../../combate/atributos-em-combate/).

### Situacionais

#### HP Temporário

O HP temporário é HP extra ganho com habilidades. Ele não se regenera quando é perdido e desaparece quando a [Party](../../exploracao/party/) [descansa](../../exploracao/descanso-e-provisoes/#descanso).

#### HP Temporário Instável

Uma variação do HP temporário, gerada por algumas habilidades de combate. Funciona como o HP temporário comum, mas desaparece no fim do combate ou depois de 1 minuto fora de combate.

#### Afinidades

:::note[Em construção]
As Afinidades ainda não têm regra própria.
:::

#### Resistências

Um personagem com **Resistência** a um tipo de dano tem **−50%** nos bônus externos da [Fórmula de Dano](../../combate/ataque-e-dano/#fórmula-de-dano) contra dano desse tipo. Resistências ao mesmo tipo não se acumulam: o personagem tem a resistência ou não tem. O dano **Forçado** não pode ser resistido, e o dano **Verdadeiro** não é afetado por nada (ver [Danos Especiais](../../combate/ataque-e-dano/#danos-especiais)). Resistências vêm da raça (ver Resistência (X) em [Fatores de Raça](../../racas/fatores/#resistência-x)) e de habilidades.

#### Fraquezas

Um personagem com **Fraqueza** a um tipo de dano tem **+50%** nos bônus externos contra dano desse tipo. Fraquezas vêm da raça (ver Fraqueza (X) em [Fatores de Raça](../../racas/fatores/#fraqueza-x)).

Uma resistência e uma fraqueza ao mesmo tipo se anulam. Num [dano híbrido](../../combate/ataque-e-dano/#dano-híbrido), cada parte do dano usa a resistência e a fraqueza do próprio tipo.
