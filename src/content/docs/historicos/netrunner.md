---
title: "Netrunner"
---
Você é o invasor do mundo digital. Muito antes do golpe, você já está lá dentro: na câmera do corredor, no rádio do segurança, na fechadura da porta dos fundos. Cada aparelho que facilita a vida do alvo é um espião seu esperando a hora certa. Quando você age, a segurança dele trabalha para você, e ninguém consegue dizer como.

- **Requisitos:** Nível 5+ em Programação  
- **Modelo de interação:** Alterar (Ambiente) + Ler (Ambiente)

> *“Magia Antiga é só código legado sem documentação.”*

## Habilidades

### Botnet (Ativa)

Você infecta dispositivos e os transforma em bots, aparelhos que continuam funcionando normalmente, mas obedecem a você.

* **Infectar:** você escolhe um dispositivo no seu alcance e faz um teste de Programação contra a dificuldade dele. Infectar leva 1 minuto. Se o teste falhar, o dispositivo registra a tentativa, o que pode disparar um alarme.  
* **Bots:** você mantém bots até o limite do seu estágio. Um bot continua seu até você liberá-lo, queimá-lo ou alguém limpar o dispositivo, e responde a você de qualquer lugar.  
* **Comandos:** você pode dar comandos simples a qualquer bot seu: ligar, desligar, abrir, fechar, travar, destravar ou acionar (fazer o dispositivo cumprir a função dele, como tocar um alarme ou chamar um elevador). Os comandos valem até alguém revertê-los.  
* **Queimar:** os efeitos de queima consomem bots. Um bot queimado sai do seu controle, e o dispositivo dele trava por um instante e volta ao normal, livre da infecção.  
* **Dispositivos e redes:** dispositivo é qualquer coisa sem consciência própria que funcione a partir de um núcleo, como uma porta, uma câmera, um rádio, um elevador, um drone ou um golem. Rede é um conjunto de dispositivos ligados entre si, por fio, éter ou runas de transmissão. Um dispositivo isolado conta como uma rede de um só. A internet não conta como rede: dispositivos ligados só por ela estão em redes diferentes.  
* **Alcance:** distância física, medida a partir de você ou de um bot que você controla. O que um dispositivo enxerga não conta.  
* **Rastro:** o que você faz numa rede só pode ser descoberto por alguém que a inspecione e tenha Programação maior que a sua no momento em que você agiu.  
* **Limite:** nem os bots nem os efeitos deles podem causar dano. O que causaria dano, como um suporte de vida ou um elevador em movimento, mantém o funcionamento mínimo.  

#### Estágio 1 (Níveis 1 - 19): Infecção

* **Alcance:** 10m | **Tempo:** 1 min | **Bots:** 3 | **Força Bruta:** até +2  
* **Descrição:** Você conhece dois efeitos de queima:  
  * **Força Bruta (queima bots da rede do alvo):** antes de um teste de Programação contra um dispositivo, seja da perícia ou da Botnet, cada bot da mesma rede que você queimar dá +1 de nível de Programação para aquele teste, até o máximo do seu estágio. O bônus também conta para o limite de tentativa da perícia.  
  * **Pane (queima 1 bot):** por 10 minutos, todos os dispositivos de um tipo à sua escolha na rede do bot recebem o mesmo comando simples. Todas as câmeras desligam, todas as travas se abrem ou todos os alarmes tocam.  
* **Escalonamento (QL):**  
  **Nível 10:** 4 bots  

#### Estágio 2 (Níveis 20 - 49): Fantoche

* **Alcance:** 10m | **Tempo:** 1 min | **Bots:** 5 | **Força Bruta:** até +3  
* **Descrição:** Você também pode controlar um bot por vez enquanto mantiver a concentração. Os comandos só mudam o estado do bot, enquanto o controle deixa você operá-lo: pilotar um drone, girar uma câmera, falar por um alto-falante, levar um elevador até um andar. Você também vê e ouve pelos sensores dele. Você também conhece:  
  * **Loop (queima 1 bot):** as câmeras da rede do bot passam a transmitir uma imagem gravada por 30 minutos. Só quem tiver Percepção maior que o seu Disfarce nota a troca.  
* **Escalonamento (QL):**  
  **Nível 30:** alcance de 15m  
  **Nível 40:** 6 bots  

#### Estágio 3 (Níveis 50 - 79): Script

* **Alcance:** 15m | **Tempo:** 1 min | **Bots:** 8 | **Força Bruta:** até +4  
* **Descrição:** Você também pode programar comandos e queimas para acontecerem depois, até o próximo pernoite: numa hora marcada ou quando algo acontecer na rede do bot, como uma porta abrir ou um crachá passar. Um bot com uma queima programada continua contando no seu limite até ela acontecer. Se o gatilho não acontecer até o pernoite, a programação se desfaz e o bot continua seu. Você também conhece:  
  * **Credencial (queima 1 bot):** até o próximo pernoite, a rede do bot passa a reconhecer até 4 pessoas com as permissões de alguém registrado nela.  
* **Escalonamento (QL):**  
  **Nível 60:** 10 bots  
  **Nível 70:** alcance de 20m  

#### Estágio 4 (Níveis 80 - 100): Worm

* **Alcance:** 20m | **Tempo:** 1 min | **Bots:** 12 | **Força Bruta:** até +5  
* **Descrição:** Quando você infecta um dispositivo, a infecção também se espalha para até 3 outros dispositivos da mesma rede cuja dificuldade o seu teste também venceria, dentro do seu limite de bots. Você também conhece:  
  * **DDoS (queima 5 bots da mesma rede):** a rede deles cai, junto com todas as redes ligadas diretamente a ela. Por 10 minutos, nenhum dispositivo dessas redes funciona.  
* **Escalonamento (QL):**  
  **Nível 90:** a derrubada dura 30 minutos

### Ping (Passiva)

Ao invadir um dispositivo, seja infectando-o ou pela perícia, você enxerga a rede dele por dentro, e continua enxergando enquanto tiver um bot nela.

#### Estágio 1 (Níveis 1 - 19): Topologia

* **Descrição:** Você vê todos os dispositivos da rede: o que são, onde ficam e o que controlam.  

#### Estágio 2 (Níveis 20 - 49): Logs

* **Descrição:** Você também lê os registros da rede: horários de ronda, troca de guarda, entradas e saídas, quem acessou o quê.  

#### Estágio 3 (Níveis 50 - 79): Perfil

* **Descrição:** Você também pode puxar o perfil de qualquer pessoa registrada na rede: nome, função, permissões e os dispositivos que ela usa.  

#### Estágio 4 (Níveis 80 - 100): Fronteira

* **Descrição:** Você também vê as redes ligadas diretamente à que você invadiu e por quais dispositivos elas se conectam.
