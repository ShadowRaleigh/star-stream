---
title: "Stats"
---
Stats são uma série de números que representam uma abstração menor das características e estatísticas do seu personagem que os atributos principais.

Eles podem ser divididos com relação ao tipo: **Intrínsecos** e **Extrínsecos**, e essas categorias ainda podem ser divididas entre **obrigatórios**, que todos os personagens tem, e **situacionais**, que um personagem pode ou não ter dependendo de fatores diversos como classe, raça e eventos.

Vale a pena enfatizar que **quase** **todos** os stats são influenciados pelos **[atributos](../atributos/)** base do personagem

## Intrínsecos

Status **Intrínsecos** são aqueles que representam uma característica do seu personagem que só pode ser alterada por mecânicas internas à esse personagem (**níveis**, **[talentos](../talentos/)** e **[títulos](../titulos/)**) ou eventos específicos que ocorram ao longo do jogo.

### Obrigatórios

#### Health Points (HP)

Representa a sua vida máxima. Esse stat é definido por um HitDie que é rolado para aumentar o valor da vida máxima a cada nível que o personagem sobe, sendo que no primeiro nível o personagem começa com **3 HitDies** no valor máximo (ex.: um HitDie d10 dá **30** de vida base), e a partir do nível 2 rola-se **1 HitDie** por nível. Esse stat é diretamente influenciado pelo atributo **[RES](../atributos/#resistência-res)** do personagem

#### Sanidade (SAN)

Representa a sanidade máxima de um personagem. Ela possui um valor fixo base de 100, mas recebe **+1** por nível do personagem, mais um bônus ou penalidade de **± 1** para cada ponto de **[DET](../atributos/#determinação-det)**  do personagem **acima ou abaixo** de **10**. Caso a sanidade de um jogador fique **abaixo da metade**, ele ganha uma **Aflição Mental temporária**, caso ela chegue a **0**, o jogador ganha uma **Característica de Insanidade permanente**. A SAN, ainda, pode chegar a valores negativos, se ela por acaso chegar em **-100**, o personagem morre instantaneamente

#### Life Force (LF)

É a energia vital máxima de um indivíduo. Representa a sua vitalidade, longevidade e saúde geral desse personagem. Pode ser consumida em alguns tipos de magia ou equipamentos tecnológicos. Esse valor, a princípio, é definido durante a construção da ficha do personagem baseada em múltiplos fatores e não varia muito ao longo da campanha. Personagens maiores, mais saudáveis ou mais longevos tendem a ter uma **LF** maior. Esse stat é influenciado pelo **[RES](../atributos/#resistência-res)** do personagem e não costuma participar de muitos eventos, mas se ele for **0**, o personagem morre imediatamente

### Situacionais

#### Mana Points (MP)

É a energia elemental que um mago ou um personagem tecnomágico consegue acumular nos seu núcleo para manifestar externamente, construir feitiços e alimentar equipamentos tecnológicos. Esse status cresce a cada nível baseado no valor de um dado especificado na classe do personagem.

#### QI

É a energia elemental acumulada e refinada dentro do núcleo de Qi que é utilizada por artistas marciais pra fortalecer seus corpos e executarem técnicas marciais. Esse status cresce a cada nível baseado no valor de um dado especificado na classe.  

#### Plasma Estelar (PE)

A mistura da energia elemental com energia da vida gera um tipo peculiar de energia, com propriedades de subverter a causalidade e relações de causa e consequência, permitindo a manifestação de eventos que contrariam qualquer lógica e estão além da compreensão. Geralmente está associada a seres superiores ou divindades e cresce a cada nível com um dado específico. Esse valor cresce em uma taxa constante de +2 de **PE** por nível.  

**Nota:** Além desses stats, existem outros, mas que são muito específicos ou raros e dependem ou de classes ou de eventos específicos ocorrendo dentro do jogo. Portanto, serão explicados em detalhes pelo mestre quando forem descobertos ou adquiridos por um player

## Extrínsecos

Stats **Extrínsecos** são aqueles que podem ser alterados tanto por mecânicas intrínsecas, quanto por fatores externos (**equipamentos**, **consumíveis**, **estilos de combate, etc**), assim como eventos que ocorram ao longo do jogo

### Obrigatórios

#### Precisão

Precisão é o stat que vai ser considerado contra a **Defesa** específica do personagem quando um personagem for realizar um ataque. A precisão de um personagem pode ser afetada por estilos de combate, efeitos **temporários**, **equipamento ativo** e muitos outros. Todo personagem começa com uma **Precisão** base de **22**, que aumenta em +1 a cada nível. É influenciada por **[PER](../atributos/#percepção-per)**, que dá +1 de Precisão por ponto acima de 10 (ou −1 por ponto abaixo)

#### Concentração

Esse stat é responsável por garantir que uma ação, habilidade ou feitiço não sejam interrompidos e o progresso perdido em razão de imprevistos ou ataques adversários. É afetado por **[DET](../atributos/#determinação-det)**

Existem muitas aplicações para a **Concentração**, mas três das principais seriam impedir que magos percam feitiços que eles já criaram mas não lançaram, impedir que uma habilidade/feitiço que demora mais de uma rodada para ser preparada/ativada seja interrompida e, por último, impedir que habilidades/feitiços de ativação constante sejam interrompidos prematuramente

**Teste de Concentração:** Todo personagem começa com uma **Concentração** base de **20**. Sempre que um personagem receber dano enquanto mantém uma concentração ou prepara uma habilidade, quem causou o dano faz um teste contra ele: **d100 + Precisão − (Mental + Concentração)**. Caso o dano não venha de um ataque (dano contínuo, armadilhas ou efeitos em área sem rolagem de ataque), o mestre usa **20 + o nível da fonte** no lugar da Precisão. Cada instância de dano gera um teste separado, e o resultado segue as mesmas faixas de um ataque:  
**Erro ou Raspão:** a concentração é mantida  
**Acerto:** a concentração é quebrada  
**Crítico:** a concentração é quebrada e o personagem não pode se concentrar em nada durante a sua próxima rodada  
**Crítico Duplo:** a concentração é quebrada e o personagem não pode se concentrar em nada durante as suas próximas 2 rodadas

Um personagem que tenha usado a ação de **Sustentação** mantém suas concentrações até a sua próxima vez, independente do resultado do teste

**Múltiplas Concentrações:** A primeira concentração ativa não tem custo. Para cada concentração ativa além da primeira, o personagem sofre as seguintes penalidades, que se acumulam:  
**Em combate:** todos os rolls feitos contra o personagem, incluindo ataques e **Testes de Concentração**, ganham uma **vantagem**  
**Fora de combate:** os rolls do personagem têm uma **desvantagem**, e testes resolvidos sem rolagem consideram o nível da perícia ou do atributo reduzido em **1**

As penalidades duram até o personagem soltar concentrações suficientes ou elas serem quebradas

#### Velocidade de Ação

A Velocidade de Ação é o quão rápido seu personagem consegue realizar qualquer forma ação (exceto movimentação) fora de combate, como rituais, fabricação e outras ações longas. Ela não se aplica em combate. A velocidade padrão é de 1, ou **100%**, com bônus em porcentagem garantidos por **[DEX](../atributos/#destreza-dex)**.

Isso quer dizer que, um personagem com **200%** de Velocidade de Ação, faria as coisas na metade do tempo normal daquela ação, enquanto que alguém com **50%**, faz as coisas no dobro do tempo

#### Defesas

Esse stat é, na verdade, uma macro estatística, que é dividida em 4 sub stats, sendo essas sub-estatísticas o valor mínimo que um ataque inimigo deve conseguir ao rolar pra acertar pra te afetar com danos daquele tipo:  
  * <span id="deflexão"></span>**Deflexão:** Representa a capacidade que o personagem tem de defletir ou evitar ataques físicos diretos. Esse stat é influenciado por **[DET](../atributos/#determinação-det)**  
  * <span id="fortitude"></span>**Fortitude:** Representa a capacidade que o personagem tem de resistir à ataques que afetam a biologia ou o funcionamento dos sistemas internos do corpo. Esse stat é influenciado por **[RES](../atributos/#resistência-res)** e **[POD](../atributos/#poder-pod)**  
  * <span id="mental"></span>**Mental:** Representa a força mental e capacidade de resistir a ataques psicológicos/mentais. É afetado por **[INT](../atributos/#intelecto-int)** e **[DET](../atributos/#determinação-det)**  
  * <span id="reflexos"></span>**Reflexos:** Representa a capacidade de desviar de ataques em área ou evitar eventos surpresa. É afetado por **[DEX](../atributos/#destreza-dex)** e **[PER](../atributos/#percepção-per)**

**Nota:** As defesas mencionadas acima podem ser influenciadas também por consumíveis, equipamentos, talentos, títulos e outros. Além disso, essas estatísticas não tem nada haver com redução de dano **(RD)** ou penetração de armadura **(PA)**. Todas as defesas aumentam em +1 a cada nível, e a **Defesa Principal** de cada arquétipo ainda recebe +2 adicionais a cada **Quebra de Limite**. Para ver como as Defesas são afetadas por cada atributo, cheque a seção Efeitos dos Atributos em Combate

### Situacionais

#### HP Temporário

HP temporário é um tipo de vida que você pode obter com habilidades que não pode ser regenerada quando perdida, e desaparece caso a party **descanse**  
#### HP Temporário Instável

Uma variação do HP temporário gerada por algumas habilidades de combate. Funciona igual ao HP temporário comum, mas desaparece no fim do combate ou depois de 1 minuto fora de combate  
#### Afinidades

#### Resistências

#### Fraquezas

:::note[Em construção]
Afinidades, Resistências e Fraquezas ainda não têm texto próprio. Por enquanto, veja **Resistência (X)** e **Fraqueza (X)** em [Fatores de Raça](../../racas/fatores/) e os bônus externos na [Fórmula de Dano](../../combate/ataque-e-dano/#fórmula-de-dano).
:::
