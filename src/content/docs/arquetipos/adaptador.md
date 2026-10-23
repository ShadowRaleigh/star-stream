---
title: "Adaptador"
---
O Adaptador usa a manipulação biológica para alternar entre estados físicos distintos, ganhando resiliência conforme se transforma para enfrentar ameaças diferentes.

## Progressão de Slots de Sincronia

| Nível | Slots Comuns | Slots Especiais |
| :---- | :---- | :---- |
| 1 | 2 | 0 |
| 10 | 3 | 1 |
| 50 | 4 | 2 |
| 80 | 5 | 3 |

## Atributos e Stats Base

* **[HitDie](../../personagem/stats/#health-points-hp):** d10.

### Passiva (Casca Adaptativa)

Ativa ao usar ou trocar o modo da [Sintonização de Forma](#habilidade-ativa-sintonização-de-forma).

* **Nível 1 a 29:** gera **[HP Temporário Instável](../../personagem/stats/#hp-temporário-instável)** igual a 6% do HP Máximo.
* **Nível 30 a 59:** gera 7% do HP Máximo em HP Temporário Instável.
* **Nível 60 a 89:** gera 8% do HP Máximo em HP Temporário Instável.
* **Nível 90 a 99:** gera 9% do HP Máximo em HP Temporário Instável.
* **Nível 100:** gera 10% do HP Máximo em HP Temporário Instável.
* **Acúmulo:** não acumula; vale sempre o maior valor.

## Habilidade Ativa: Sintonização de Forma

### Estágio 1 (Níveis 1 - 29)

* **Efeito:** Suporte | **Alvo:** Self.
* **[Alcance](../../habilidades/criacao/#alcance):** 0 | **Tempo:** 2s (**[Ação Bônus](../../combate/rodadas-e-acoes/#ação-bônus)**) | **[Duração](../../habilidades/criacao/#duração):** [Concentração](../../personagem/stats/#concentração).
* **Recarga:** depois de ativar ou trocar de modo, você só pode trocar de novo após 2 rodadas (10s).
* **Descrição:** Alterna entre o modo Ofensivo (bônus em **[POD](../../personagem/atributos/#poder-pod)**) e o Defensivo (bônus em **[RES](../../personagem/atributos/#resistência-res)**). O bônus é de 2 pontos no nível 1. No modo Ofensivo, você também ganha +12% de dano (bônus externo da [Fórmula de Dano](../../combate/ataque-e-dano/#fórmula-de-dano)); no Defensivo, 12% de Redução de Dano (RD).
* **Escalonamento (QL):**  
  **Nível 10:** bônus de 3 pontos.  
  **Nível 20:** bônus de 5 pontos.
* **Penalidade:** o atributo oposto sofre um redutor de 60% do valor do bônus.

### Estágio 2 (Níveis 30 - 59)

* **Efeito:** Suporte | **Alvo:** Self | **Duração:** Concentração.
* **Descrição:** Ao ativar ou trocar de modo, você ganha +5 de **[Precisão](../../personagem/stats/#precisão)** (Ofensivo) ou +5 de **[Deflexão](../../personagem/stats/#deflexão)** (Defensivo) por 1 rodada. O bônus de dano do modo Ofensivo e a RD do modo Defensivo sobem para 14%.
* **Penalidade:** o redutor no atributo oposto cai para 40% do valor do bônus.

### Estágio 3 (Níveis 60 - 89)

* **Efeito:** Suporte | **Alvo:** Self | **Duração:** Concentração.
* **Descrição:** A troca de modo agora pode ser feita como **[Reação](../../combate/rodadas-e-acoes/#reação)** quando você é atingido por um ataque, depois da rolagem e antes do dano. O bônus de dano do modo Ofensivo e a RD do modo Defensivo sobem para 16%.
* **Penalidade:** o redutor no atributo oposto cai para 20% do valor do bônus.

### Estágio 4 (Níveis 90 - 100)

* **Efeito:** Suporte | **Alvo:** Self | **Duração:** Concentração.
* **Descrição:** Você ganha **[Resistência](../../personagem/stats/#resistências)** a um [tipo de dano](../../combate/ataque-e-dano/#tipos-de-dano) à sua escolha, e pode trocar o tipo ao reativar a habilidade. O bônus de dano do modo Ofensivo e a RD do modo Defensivo sobem para 18%.
* **Penalidade:** nenhuma.

## Defesas

**[Defesa Principal](../#defesa-principal):** [Mental](../../personagem/stats/#mental).

| Deflexão | Fortitude | Reflexos | Mental |
| :---- | :---- | :---- | :---- |
| 28 | 15 | 5 | 20 |
