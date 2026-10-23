---
title: "Efeitos de Status"
---
Efeitos que causam dano ao longo do tempo (como **Sangrando**, **Queimando** e venenos) causam o dano no fim da vez de quem está afetado.

## Caído e inconsciente

* <span id="morrendo"></span>**Morrendo:** só acontece quando o [HP](../../personagem/stats/#health-points-hp) chega a **0**. Nesse estado, qualquer ação encerra a vez do personagem, e ele não consegue sair de **Caído**. Veja **[Personagens Caídos](../personagens-caidos/)**.
* <span id="caído"></span>**Caído:** o personagem está de joelhos ou deitado no chão. A movimentação dele cai pela metade. Para se levantar, ele gasta a **[Ação Principal](../rodadas-e-acoes/#ação-principal)** ou a **[Movimentação](../rodadas-e-acoes/#movimentação)**, ou um aliado gasta a Ação Principal dele para levantá-lo.
* <span id="desmaiado"></span>**Desmaiado:** o personagem fica inconsciente: não percebe o que acontece ao redor e não pode fazer nenhuma ação.
* <span id="sonolento"></span>**Sonolento:** o personagem está morrendo de sono. Se o efeito vier de combate, ele adormece e fica **Desmaiado** no fim das 2 rodadas seguintes (ex.: se o efeito for aplicado na rodada 1, ele desmaia no fim da rodada 3).

## Controle

* <span id="atordoado"></span>**Atordoado:** o personagem não pode usar a Ação Principal, a Movimentação nem a **[Reação](../rodadas-e-acoes/#reação)** até o fim da próxima vez dele. A **[Ação Bônus](../rodadas-e-acoes/#ação-bônus)** continua disponível. Dura **1** rodada, ou **2** quando vem de uma habilidade especial, e mais 1 rodada se a rolagem for um Crítico.
* <span id="paralisado"></span>**Paralisado:** o personagem não consegue se mexer (fica sem movimentação), mas está consciente. Conforme o nível da paralisia, ele perde só a Reação (**Superficial**), a Reação e a Ação Principal (**Parcial**) ou a rodada inteira (**Total**).
* <span id="congelado"></span>**Congelado:** o personagem está preso no gelo e não pode se mover. Ele continua consciente e percebe o ambiente.
* <span id="agarrado"></span>**Agarrado:** o personagem está preso a algo ou alguém que o agarrou e não pode se mover. Ele tem **[desvantagem](../../regras/dados/#vantagens-e-desvantagens)** na Ação Principal e não pode usar a Ação Bônus. Quem agarrou ainda pode se mover, com **[Lentidão](#lentidão)** de **50%**. A cada rodada, o personagem agarrado pode gastar a Reação para tentar se soltar, com **DC 16**.
* <span id="restringido"></span>**Restringido:** algo prende o personagem ou atrapalha os movimentos dele. Quem está Restringido não usa **Ações Bônus** e tem a Movimentação atrapalhada (com **[Lentidão](#lentidão)** ou outro efeito, conforme a causa).
* <span id="preso"></span>**Preso:** algo prende o personagem a um lugar. Ele não consegue sair da área definida pelo que causa o efeito.
* <span id="lentidão"></span>**Lentidão:** a velocidade de movimento do personagem cai **X%** até o fim do efeito (fora de combate, a [Velocidade de Ação](../../personagem/stats/#velocidade-de-ação) também). O valor de X é definido pela habilidade ou pelo evento que causou a Lentidão.
* <span id="provocado"></span>**Provocado:** o personagem só pode atacar quem o provocou. Se foi provocado por mais de um personagem, pode atacar qualquer um deles.
* <span id="ensandecido"></span>**Ensandecido:** o personagem fica fora de controle: não distingue aliado de inimigo e ataca os alvos mais próximos com violência máxima, instinto e pouca inteligência, até o fim do efeito.

## Dano e defesa

* <span id="sangrando"></span>**Sangrando:** enquanto durar o efeito, o personagem recebe dano igual a **10%** da vida atual.
* <span id="queimando"></span>**Queimando:** o personagem está em chamas e recebe dano de fogo igual a um número de HitDies definido pela habilidade que causou o efeito.
* <span id="vulnerável"></span>**Vulnerável:** o personagem recebe mais dano de todas as fontes: **+25%** quando o efeito vem de uma habilidade simples e **+50%** quando vem de uma especial. Dois efeitos de Vulnerável não se somam: vale o maior. É um bônus externo na [Fórmula de Dano](../ataque-e-dano/#fórmula-de-dano).
* <span id="exposto"></span>**Exposto:** os ataques do grupo de quem expôs o personagem contra ele têm **[vantagem](../../regras/dados/#vantagens-e-desvantagens)**, e um Raspão deles vira Acerto. Os ataques do personagem exposto contra esse grupo têm desvantagem.

## Sentidos

* <span id="surdez"></span>**Surdez:** o personagem não ouve nada: não escuta o que os aliados dizem nem percebe perigos pelo som. A **[PER](../../personagem/atributos/#percepção-per)** dele cai **2** até o fim do efeito.
* <span id="cegueira"></span>**Cegueira:** o personagem não enxerga. Ele não sabe o estado do mapa em tempo real e depende das descrições dos companheiros. Em cada movimento, tem **30%** de chance de ir para uma direção diferente da pretendida, e, para acertar um ataque, precisa passar num teste de **[PER](../../personagem/atributos/#percepção-per)** com dificuldade **20**. A PER dele cai **3** até o fim do efeito.

## Cansaço e sobrevivência

* <span id="fadigado"></span>**Fadigado:** a [Movimentação](../rodadas-e-acoes/#movimentação) em combate e a velocidade de viagem no [Deslocamento](../../exploracao/deslocamento/) do personagem caem **50%** (fora de combate, a [Velocidade de Ação](../../personagem/stats/#velocidade-de-ação) também).
* <span id="faminto"></span>**Faminto:** o personagem fica **Fadigado**, não recupera HP nem Energia em **[Descansos Curtos](../../exploracao/descanso-e-provisoes/#descanso-curto)**, e nos **[Pernoites](../../exploracao/descanso-e-provisoes/#pernoite)** recupera metade do HP e da Energia que recuperaria. O **[Descanso Longo](../../exploracao/descanso-e-provisoes/#descanso-longo)** funciona normalmente. O efeito acaba depois de um dia em que o personagem coma as rações do dia (ver [Provisões](../../exploracao/descanso-e-provisoes/#provisões)).
* <span id="sedento"></span>**Sedento:** o personagem sofre os mesmos efeitos de **Faminto**. O efeito acaba depois de um dia em que ele beba água o bastante (as rações já incluem água).
* <span id="fome-extrema"></span>**Fome Extrema:** o personagem sofre os efeitos de **Faminto** e tem **[desvantagem dupla](../../regras/dados/#vantagens-e-desvantagens)** em todas as rolagens. O efeito acaba como o de Faminto.
* <span id="sede-extrema"></span>**Sede Extrema:** o personagem sofre os efeitos de **Sedento** e tem **desvantagem dupla** em todas as rolagens. O efeito acaba como o de Sedento.

## Mente

* <span id="aflição-mental"></span>**Aflição Mental** e **Característica de Insanidade:** ver [Sanidade](../../personagem/stats/#sanidade-san).

## Efeitos especiais

* <span id="reanimado"></span>**Reanimado:** o personagem foi trazido de volta à vida por necromancia ou por outro meio de ressurreição temporária. Todo o HP dele vira **Vida Temporária**: ele só vive enquanto o efeito dura, e essa vida cai **2d4** a cada rodada (5s). Não é o mesmo que [HP Temporário](../../personagem/stats/#hp-temporário).
* <span id="abençoado"></span>**Abençoado:** efeito amplo que representa uma bênção de um ser superior. O que ele faz depende da habilidade que o causou ou das intenções de quem deu a bênção, mas uma bênção nunca é negativa.
* <span id="amaldiçoado"></span>**Amaldiçoado:** efeito amplo que representa uma maldição. O que ele faz depende da habilidade que o causou ou das intenções de quem amaldiçoou, mas uma maldição nunca é positiva.
* <span id="aprimorado"></span>**Aprimorado:** efeito amplo que indica que um [stat extrínseco](../../personagem/stats/#extrínsecos), um [atributo](../../personagem/atributos/) ou uma [perícia](../../personagem/pericias/) foi modificado.
