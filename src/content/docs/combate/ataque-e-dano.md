---
title: "Ataque, Defesa e Dano"
---
Para ser classificado como um ataque, toda ação deve ter pelo menos: Quantidade de dano infligido; um ou mais tipos de dano; e ser classificado com relação à como um alvo é atingido.

## Quantidade de Dano

* A quantidade de dano infligida por um ataque deve ser um valor aleatório gerado pelo roll de um ou mais dados, e deve ser instantânea, ter um delay para ser aplicada, ou ser do tipo de dano ao longo do tempo, com duração fixa ou determinada aleatoriamente por dados

## Tipos de Dano

* Perfurante  
* Cortante  
* Contundente  
* Explosivo  
* Elemental (Uma pra cada 1 dos 6 elementos)  
* Sagrado  
* Demoníaco  
* Corrompido  
* Queimante  
* Congelante  
* Elétrico  
* Venenoso  
* Necrótico

### Dano Híbrido

um ataque pode causar dois tipos de dano ao mesmo tempo, como uma espada flamejante (cortante e fogo) ou uma estaca de gelo (perfurante e gelo). Nesse caso, os dados do dano se dividem entre os dois tipos, e cada parte sofre as resistências e fraquezas do próprio tipo.

### Danos Especiais

  * Verdadeiro **:** Um dano absoluto, que ignora **Resistências** ou **Reduções de Dano**, caso acerte  
  * Psíquico **:** Um dano mental, ao invés de te causar dano no seu **[HP](../../personagem/stats/#health-points-hp)**, causa danos à **Sanidade** do personagem  
  * Forçado **:** Um dano paranormal que parece ter origem desconhecida, não existem **Resistências** conta esse tipo de dano

## Classificação de Ataques e Defesas associadas

* Diretos ou Target > **[Deflexão](../../personagem/stats/#defesas)**  
* Em área > **[Reflexos](../../personagem/stats/#defesas)**  
* Psicológicos > **[Mental](../../personagem/stats/#defesas)**  
* Fisiológicos > **[Fortitude](../../personagem/stats/#defesas)**

## Execução do Ataque

Ao declarar a intenção de atacar, o jogador ou mestre deve rolar **1d100** e somar a sua **Precisão** apropriada no resultado. Então, o mestre deve subtrair desse resultado a **[Defesa](../../personagem/stats/#defesas)** apropriada e verificar o resultado de acordo com a tabela abaixo:

**Fórmula:** [ Roll do d100 + **Precisão** - **Defesa** ]

| Faixa de Resultado | Resultado do Ataque | Dano Causado (%) |
| :---: | :---: | :---: |
| **01 - 20** | **Erro (Miss)** | **0%** |
| **21 - 50** | **De Raspão (Graze)** | **50%** |
| **51 - 100** | **Acerto (Hit)** | **100%** |
| **101 - 180** | **Crítico (Crit)** | **150%** |
| **181+** | **Crítico Duplo (D. Crit)** | **200%** |

Incondicionalmente da soma total, um 100 natural rolado no d100 sempre acerta e é um **crítico**  
**Ordem dos efeitos no resultado:** quando efeitos de habilidades e de equipamentos mudam o resultado do mesmo ataque, os das habilidades se aplicam primeiro e os dos equipamentos depois. Por exemplo, contra um alvo **Exposto**, um Raspão vira Acerto; se o alvo tiver um **Defletor**, o Acerto cai de volta para Raspão.

Pra cada **1** ponto acima de **10** no **[atributo Sorte](../../personagem/atributos/#sorte-luk)**, até um total de **20** pontos, essa tabela final é modificada. Cada ponto extra reduz a faixa de **Erro** em **1** e aumenta a faixa de **Crítico** em **1** pra baixo. Por exemplo, um aventureiro com **15** de sorte teria uma tabela de resultados de ataque como essa:

| Faixa de Resultado | Resultado do Ataque | Dano Causado (%) |
| :---: | :---: | :---: |
| **01 - 15** | **Erro (Miss)** | **0%** |
| **16 - 45** | **De Raspão (Graze)** | **50%** |
| **46 - 95** | **Acerto (Hit)** | **100%** |
| **96 - 180** | **Crítico (Crit)** | **150%** |
| **181+** | **Crítico Duplo (D. Crit)** | **200%** |

Caso ele tivesse um **20+** de **[Sorte](../../personagem/atributos/#sorte-luk)****:**

| Faixa de Resultado | Resultado do Ataque | Dano Causado (%) |
| :---: | :---: | :---: |
| **01 - 10** | **Erro (Miss)** | **0%** |
| **11 - 40** | **De Raspão (Graze)** | **50%** |
| **41 - 90** | **Acerto (Hit)** | **100%** |
| **91 - 180** | **Crítico (Crit)** | **150%** |
| **181+** | **Crítico Duplo (D. Crit)** | **200%** |

## Fórmula de Dano

Depois de definir o resultado do ataque, o dano causado é calculado assim:

**Fórmula:** [ **Dano base** × **Forma do ataque** × (1 + **Bônus externos**) × (1 + **Bônus de POD**) × (1 − **RD do alvo**) ]

* **Dano base:** o dano do ataque básico da arma do personagem, já com o multiplicador do estilo de combate. No caso das habilidades, vale o multiplicador próprio das habilidades (ver Habilidades).  
* **Forma do ataque:** ataque básico 1×; habilidade simples 1,5×; habilidade especial 2,5×. Em área, simples 0,75× e especial 1,75×.  
* **Bônus externos:** somam entre si. São o **resultado do ataque** (Raspão −50%, Acerto 0%, Crítico +50%, Crítico Duplo +100%), consumíveis, buffs, títulos, fraquezas (+50%), resistências (−50%), Vulnerável, Escalada e outros. **Não há teto.**  
* **Bônus de POD:** ±2% por ponto acima ou abaixo de 10, multiplicado à parte.  
* **Mínimo:** o fator (1 + soma dos bônus externos) nunca fica abaixo de 0,1, ou seja, 10% do dano base.

A cura e o HP temporário de habilidades usam a mesma conta, sem RD.

**Exemplo:** dano base 20, Crítico (+50%) contra um alvo com fraqueza (+50%), com POD 12 (+4%): 20 × 1 × (1 + 0,5 + 0,5) × 1,04 = 41,6.
