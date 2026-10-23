---
title: "Vinculador"
---
O Vinculador opera por meio de um vínculo simbiótico com um companheiro. Os dois dividem recursos, vida e habilidades, e, conforme o vínculo se fortalece, conseguem se fundir em um único ser e, no ápice, agir de forma totalmente independente.

## Progressão de Slots de Sincronia

| Nível | Slots Simples | Slots Especiais |
| :---- | :---- | :---- |
| 1 | 1 | 1 |
| 10 | 3 | 1 |
| 50 | 4 | 2 |
| 80 | 5 | 3 |

## Atributos e Stats Base

* **[HitDie](../../personagem/stats/#health-points-hp):** d8.

### Passiva (Companheiro Vinculado)

O Vinculador começa o jogo com um vínculo a uma criatura de origem espiritual, animal, demoníaca ou tecnológica. Essa criatura, o companion, é de tamanho médio e tem ficha própria.

O companion não tem [perícias](../../personagem/pericias/) e tem habilidades separadas, mas não ganha **[PH](../../habilidades/#pontos-de-habilidade-ph)** ao subir de nível. Em cada **[Quebra de Limite](../../personagem/criacao/#quebra-de-limite)**, ele recebe 7 [Pontos de Atributo](../../personagem/atributos/#distribuição-de-atributos) para distribuir, e usa [armadura](../../combate/equipamento/#armadura) como um personagem. Por isso, o Vinculador precisa gastar os próprios **PH** e recursos para investir nas habilidades do companion e construí-las. Além disso, os **[Slots de Sincronia](../../habilidades/#slots-de-sincronia)** são divididos entre os dois: a partir do nível 10, o companion precisa ter sempre pelo menos um **Slot Simples** e um **Slot Especial** próprios.

Isso quer dizer que o jogador tem que gerenciar o loadout dividido, decidindo quantos slots dar para cada um, quem mais precisa de uma nova habilidade e quais habilidades os dois levam.

Caso, em alguma circunstância, o jogador tenha mais de uma criatura vinculada, cada uma também precisa cumprir os requisitos de **Slots de Sincronia**. Caso o jogador não tenha slots do tipo certo para transferir para outra criatura vinculada, ele só precisa cumprir os requisitos mínimos dos slots que tem o suficiente para transferir.

Depois de compartilhar slots com os companions, o Vinculador precisa ficar com pelo menos 2 slots de qualquer tipo no próprio personagem, em qualquer nível.

O companion tem HitDie de 1d10, com 1 HitDie no valor máximo no nível 1, e compartilha a **[Energia](../../personagem/origens/#energia)** do Vinculador. Em combate, as ações do companion são feitas na mesma vez do Vinculador e usam as ações dele, exceto a **[Ação de movimento](../../combate/rodadas-e-acoes/#movimentação)** e a **[Reação](../../combate/rodadas-e-acoes/#reação)**, que o companion pode usar separadamente.

### Passiva (Dor Compartilhada)

Quando o [HP](../../personagem/stats/#health-points-hp) do companion chega a **0**, o Vinculador escolhe entre deixá-lo morrer ou salvá-lo com a própria vida. Para salvá-lo, ele consome **metade do seu HP atual**, e o companion recupera **metade** desse valor (consumir 50 de HP cura o companion em 25). O valor consumido é arredondado para o número **par** mais próximo e, em caso de empate, para o menor, de forma que a divisão seja sempre exata.

O Vinculador não pode salvar o companion caso esteja com menos de **25%** do seu HP máximo.

Caso o companion morra, o Vinculador pode criar um novo vínculo durante um **[Descanso Longo](../../exploracao/descanso-e-provisoes/#descanso-longo)**, pagando **100 de [cobre](../../exploracao/inventario/#moeda)** por nível do personagem. As habilidades criadas para o companion antigo não são perdidas: como foi o Vinculador quem as ensinou, ele pode ensiná-las ao novo companion sem custo.

## Habilidade Ativa: Elo Vital

### Estágio 1 (Níveis 1 - 29)

* **Efeito:** Suporte | **Alvo:** Target (companion).
* **Tempo:** 5s (**[Ação Principal](../../combate/rodadas-e-acoes/#ação-principal)**) | **[Duração](../../habilidades/criacao/#duração):** 5 rodadas (25s).
* **Cargas:** 1 por Combate.
* **Descrição:** O usuário transfere ou cura dano do companion usando a própria vitalidade.
* **Limitador:** a transferência é limitada a **20%** da vida máxima do usuário por rodada, arredondado pra cima.
* **Escalonamento (QL):**  
  **Nível 10:** limite de 25% da vida máxima por rodada.  
  **Nível 20:** limite de 30% da vida máxima por rodada.

### Estágio 2 (Níveis 30 - 59)

* **Efeito:** Suporte | **Alvo:** Self (companion).
* **Tempo:** 2s (**[Ação Bônus](../../combate/rodadas-e-acoes/#ação-bônus)**) | **[Alcance](../../habilidades/criacao/#alcance):** 5m | **Duração:** 2d4 rodadas.
* **Cargas:** 2 por Combate.
* **Descrição:** Além da transferência, o Vinculador e o companion podem se fundir em um único ser. O companion precisa estar dentro do alcance do vínculo no momento da ativação. Esta habilidade não exige **[Concentração](../../personagem/stats/#concentração)**. Durante a fusão:
  * O ser fundido usa o **maior valor** entre os dois em cada **[atributo](../../personagem/atributos/)** e em cada **[Defesa](../../personagem/stats/#defesas)**.
  * O ser fundido tem acesso às habilidades equipadas nos **Slots de Sincronia dos dois**.
  * O HP máximo do ser fundido é a soma dos HP máximos, e o HP atual é a soma dos HP atuais.
  * O ser fundido age com as ações do Vinculador, e o companion perde a Ação de movimento e a Reação separadas.
  * O Vinculador pode desfazer a fusão na sua vez como **[Ação Livre](../../combate/rodadas-e-acoes/#ação-livre)**.
* **Fim da fusão:** quando a fusão termina, o HP restante é dividido entre os dois: **2/3** para o Vinculador, arredondado pra cima, e **1/3** para o companion, arredondado para baixo, respeitando o HP máximo de cada um. Caso o HP do ser fundido chegue a **0**, a fusão termina e os dois ficam com **0** de HP.
* **Escalonamento (QL):**  
  **Nível 40:** alcance do vínculo de 10m.  
  **Nível 50:** alcance do vínculo de 15m.

### Estágio 3 (Níveis 60 - 89)

* **Descrição:** O ser fundido mantém as **duas Reações**, a do Vinculador e a do companion. Além disso, o Vinculador pode desfazer a fusão como **Reação**, fazendo o companion surgir em um espaço adjacente.
* **Escalonamento (QL):**  
  **Nível 70:** alcance do vínculo de 20m.  
  **Nível 80:** alcance do vínculo de 25m.

### Estágio 4 (Níveis 90 - 100)

* **Tempo:** 2s (Ação Bônus) | **Duração:** 3 rodadas (15s).
* **Cargas:** 1 por Combate.
* **Descrição:** Fora da fusão, o companion assume uma vez própria e independente na **[iniciativa](../../combate/rodadas-e-acoes/#iniciativa)**. Durante o efeito, os dois agem com ações próprias e separadas.

## Defesas

**[Defesa Principal](../#defesa-principal):** [Fortitude](../../personagem/stats/#fortitude).

| Deflexão | Fortitude | Reflexos | Mental |
| :---- | :---- | :---- | :---- |
| 25 | 15 | 10 | 10 |
