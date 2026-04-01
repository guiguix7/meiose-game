# Manual do Jogo - Meiose Quest

## Visao geral
Meiose Quest e um jogo de tabuleiro educativo sobre meiose. Cada jogador avanca no tabuleiro, responde perguntas e ganha ou perde pontos conforme o desempenho.

## Objetivo
Ser o primeiro jogador a alcançar 20 pontos.

## Requisitos e configuracao inicial
1. Abra a pagina inicial e selecione a quantidade de jogadores (1 a 6).
2. Informe o nome e escolha uma cor unica para cada jogador.
3. Confirme para iniciar a partida.

## Como jogar (passo a passo)
1. O jogador da vez clica em "Rolar Dados".
2. O peao anda a soma dos dois dados.
3. Uma pergunta aparece; responda no campo e confirme.
4. Se acertar, ganha pontos conforme o tipo da pergunta.
5. Se errar, perde 1 ponto.
6. Se os dados forem iguais e a resposta estiver correta, o jogador ganha um turno extra.
7. O jogo segue para o proximo jogador ate haver um vencedor.

## Pontuacao por tipo de pergunta
1. Pergunta facil: +1 ponto.
2. Pergunta media: +3 pontos.
3. Pergunta dificil: +5 pontos.
4. Multipla escolha: +1 ponto.
5. Verdadeiro ou falso: +2 pontos.
6. Pergunta especial: rouba ate 5 pontos de cada adversario.
7. Resposta incorreta: -1 ponto.

## Casas especiais
1. Crossing-over: troca de posicao com outro jogador aleatorio.
2. Mutacao: perde 2 pontos.
3. Divisao celular: ganha um turno extra.

## Regras gerais
1. O jogo aceita no minimo 1 e no maximo 6 jogadores.
2. Todos os jogadores comecam com 10 pontos na casa 1.
3. Nao pode haver jogadores com nomes ou cores iguais.
4. O nome do jogador deve ter no maximo 20 caracteres.

## Condicoes de vitoria
1. Vence quem alcancar 20 pontos primeiro.
2. Se todas as perguntas forem respondidas, vence quem tiver a maior pontuacao.
3. Em caso de empate, vence o ultimo jogador que respondeu corretamente.

## Tabuleiro
- 64 casas no total.
- Casas normais e casas com fases da meiose.
- 12 casas especiais no total (4 crossing-over, 4 mutacao, 4 divisao celular).

## Checklist rapido
- [ ] Selecionar quantidade de jogadores (1 a 6).
- [ ] Preencher nome e cor de cada jogador (sem repeticoes).
- [ ] Confirmar para iniciar a partida.
- [ ] Rolar os dados no turno correto.
- [ ] Responder a pergunta e confirmar.
- [ ] Conferir pontuacao e eventos na tela.


====================================================

TODAS AS PERGUNTAS VÃO SER DE ALTERNATIVA (A B C D)

Total de Casas: 64

Total de Perguntas: 64

Total de Perguntas Fáceis:20 -> Só em casas normais

Total de Perguntas Médias:8 -> Só em casas normais

Total de Perguntas Difíceis:6 -> Só em casas normais

Total de Perguntas de Verdadeiro ou Falso:20 -> Só de Verdadeiro ou Falso

Total de Perguntas de Especiais:10 -> Só em casas especiais [1: "Inicio",
    4: "Interfase",
    13: "Profase I",
    20: "Metafase I",
    29: "Anafase I",
    36: "Telofase I",
    45: "Profase II",
    52: "Metafase II",
    61: "Anafase II",
    64: "Telofase II",crossing: ([8, 19, 36, 52]),
    mutacao: ([12, 27, 44, 60]),
    divisao: ([5, 22, 40, 58])]

Casas Meiose {
    1: "Inicio",
    4: "Interfase",
    13: "Profase I",
    20: "Metafase I",
    29: "Anafase I",
    36: "Telofase I",
    45: "Profase II",
    52: "Metafase II",
    61: "Anafase II",
    64: "Telofase II"
}

Casas Especiais {
    crossing: ([8, 19, 36, 52]),
    mutacao: ([12, 27, 44, 60]),
}

Casas Verdadeiro ou Falso {

}

Casas Alternativas {

}


===============================

Ajustes {
    Se um jogador acertar uma pergunta especial, mas não tem nenhum jogador pra roubar, ele ganhará 5 pontos
    A casa divisão não vai ter mais pernguntas especiais, serão normais
    
}

Perguntas {

FÁCEIS (20)

1. Em qual fase os cromossomos se alinham no plano equatorial na mitose?
   A) Prófase
   B) Metáfase
   C) Anáfase
   D) Telófase
   **Resposta: B**

2. Qual processo gera duas células-filhas geneticamente idênticas?
   A) Meiose
   B) Mitose
   C) Fecundação
   D) Crossing-over
   **Resposta: B**

3. A meiose possui quantas divisões celulares principais?
   A) 1
   B) 2
   C) 3
   D) 4
   **Resposta: B**

4. Células somáticas se dividem principalmente por:
   A) Meiose
   B) Mitose
   C) Fecundação
   D) Clonagem
   **Resposta: B**

5. Gametas são produzidos por:
   A) Mitose
   B) Meiose
   C) Brotamento
   D) Fragmentação
   **Resposta: B**

6. Qual estrutura une as cromátides irmãs?
   A) Centríolo
   B) Ribossomo
   C) Centrímero
   D) Núcleo
   **Resposta: C**

7. Qual divisão celular forma quatro células-filhas?
   A) Mitose
   B) Meiose
   C) Fecundação
   D) Clivagem
   **Resposta: B**

8. Nome da fase em que a carioteca se desorganiza:
   A) Telófase
   B) Metáfase
   C) Prófase
   D) Interfase
   **Resposta: C**

9. Em qual fase as cromátides irmãs se separam na mitose?
   A) Prófase
   B) Metáfase
   C) Anáfase
   D) Telófase
   **Resposta: C**

10. O que é um gameta?
    A) Célula somática
    B) Célula sexual
    C) Célula nervosa
    D) Célula-tronco
    **Resposta: B**

11. O que é diploide?
    A) n
    B) 2n
    C) 3n
    D) 4n
    **Resposta: B**

12. O que é haploide?
    A) n
    B) 2n
    C) 3n
    D) 4n
    **Resposta: A**

13. A meiose produz quantas células-filhas?
    A) 2
    B) 3
    C) 4
    D) 6
    **Resposta: C**

14. A mitose produz quantas células-filhas?
    A) 2
    B) 3
    C) 4
    D) 8
    **Resposta: A**

15. Qual fase antecede a prófase?
    A) Metáfase
    B) Interfase
    C) Anáfase
    D) Telófase
    **Resposta: B**

16. Qual é a função da meiose?
    A) Crescimento
    B) Reparo
    C) Formar gametas
    D) Digestão
    **Resposta: C**

17. Em qual fase os cromossomos se condensam?
    A) Telófase
    B) Prófase
    C) Metáfase
    D) Interfase
    **Resposta: B**

18. Qual fase sucede a anáfase?
    A) Prófase
    B) Interfase
    C) Telófase
    D) Metáfase
    **Resposta: C**

19. A união de dois gametas forma:
    A) Embrião
    B) Zigoto
    C) Feto
    D) Blastocisto
    **Resposta: B**

20. Quantas cromátides tem um cromossomo duplicado?
    A) 1
    B) 2
    C) 3
    D) 4
    **Resposta: B**

---

MÉDIAS (8)

21. Em qual etapa ocorre o crossing-over?
    A) Prófase I
    B) Metáfase I
    C) Anáfase II
    D) Telófase II
    **Resposta: A**

22. Na meiose I, o que se separa primeiro?
    A) Cromátides irmãs
    B) Cromossomos homólogos
    C) Núcleo
    D) Ribossomos
    **Resposta: B**

23. Qual fase da meiose separa cromátides irmãs?
    A) Anáfase I
    B) Metáfase II
    C) Anáfase II
    D) Prófase II
    **Resposta: C**

24. Quantos cromossomos há em um gameta humano?
    A) 46
    B) 23
    C) 92
    D) 12
    **Resposta: B**

25. Quantos cromossomos há em uma célula somática humana?
    A) 23
    B) 46
    C) 92
    D) 12
    **Resposta: B**

26. Qual fase finaliza a meiose I?
    A) Telófase I
    B) Prófase I
    C) Anáfase I
    D) Metáfase I
    **Resposta: A**

27. Qual é a função do fuso mitótico?
    A) Produzir energia
    B) Separar cromossomos
    C) Sintetizar proteínas
    D) Duplicar DNA
    **Resposta: B**

28. A duplicação do DNA ocorre em qual fase?
    A) Prófase
    B) Metáfase
    C) Fase S
    D) Telófase
    **Resposta: C**

---

DIFÍCEIS (6)

29. A variabilidade genética vem do crossing-over e:
    A) Mutação
    B) Segregação independente
    C) Mitose
    D) Replicação
    **Resposta: B**

30. A sinapse dos cromossomos ocorre em:
    A) Prófase I
    B) Metáfase II
    C) Anáfase I
    D) Telófase II
    **Resposta: A**

31. O quiasma é observado em:
    A) Prófase I
    B) Metáfase I
    C) Anáfase II
    D) Telófase I
    **Resposta: A**

32. Cromossomos homólogos são:
    A) Idênticos
    B) Diferentes genes
    C) Genes para mesmas características
    D) Inexistentes
    **Resposta: C**

33. Qual é o cariótipo?
    A) Tipo de célula
    B) Conjunto de cromossomos
    C) Divisão celular
    D) Tipo de DNA
    **Resposta: B**

34. Quando ocorre a citocinese?
    A) Início da divisão
    B) Meio
    C) Final da divisão
    D) Antes da interfase
    **Resposta: C**

---

VERDADEIRO OU FALSO 

35. A meiose reduz o número de cromossomos pela metade.
A) Verdadeiro
B) Falso
Resposta: A

36. A variabilidade genética aumenta com crossing-over.
A) Verdadeiro
B) Falso
Resposta: A

37. Mitose ocorre para formar gametas.
A) Verdadeiro
B) Falso
Resposta: B

38. Cromossomos homólogos possuem genes semelhantes.
A) Verdadeiro
B) Falso
Resposta: A

39. A mitose é responsável por crescimento e reparo.
A) Verdadeiro
B) Falso
Resposta: A

40. A meiose ocorre em células somáticas.
A) Verdadeiro
B) Falso
Resposta: B

41. A meiose gera variabilidade genética.
A) Verdadeiro
B) Falso
Resposta: A

42. A meiose ocorre em duas divisões celulares.
A) Verdadeiro
B) Falso
Resposta: A

43. Cromátides irmãs se separam na meiose I.
A) Verdadeiro
B) Falso
Resposta: B

44. A mitose gera células idênticas.
A) Verdadeiro
B) Falso
Resposta: A

45. Gametas são formados por meiose.
A) Verdadeiro
B) Falso
Resposta: A

46. Na metáfase os cromossomos se alinham.
A) Verdadeiro
B) Falso
Resposta: A

47. Crossing-over ocorre na prófase I.
A) Verdadeiro
B) Falso
Resposta: A

48. A meiose II separa cromossomos homólogos.
A) Verdadeiro
B) Falso
Resposta: B

49. O DNA se duplica na interfase.
A) Verdadeiro
B) Falso
Resposta: A

50. O zigoto é formado pela união de dois gametas.
A) Verdadeiro
B) Falso
Resposta: A

51. A citocinese separa o citoplasma ao final da divisão.
A) Verdadeiro
B) Falso
Resposta: A

52. O fuso mitótico ajuda a separar cromossomos.
A) Verdadeiro
B) Falso
Resposta: A

53. Cromossomos homólogos são idênticos em tudo.
A) Verdadeiro
B) Falso
Resposta: B

54. A mitose reduz o número de cromossomos pela metade.
A) Verdadeiro
B) Falso
Resposta: B

---

ESPECIAIS (10)

55. Qual processo troca segmentos genéticos?
    A) Mitose
    B) Crossing-over
    C) Clonagem
    D) Replicação
    **Resposta: B**

56. Qual divisão reduz cromossomos?
    A) Mitose
    B) Meiose I
    C) Meiose II
    D) Interfase
    **Resposta: B**

57. Qual divisão separa cromátides irmãs na meiose?
    A) Meiose I
    B) Meiose II
    C) Prófase
    D) Interfase
    **Resposta: B**

58. Qual processo aumenta variabilidade?
    A) Mitose
    B) Crossing-over
    C) Citocinese
    D) Replicação
    **Resposta: B**

59. Qual fase ocorre pareamento de homólogos?
    A) Prófase I
    B) Metáfase II
    C) Anáfase I
    D) Telófase II
    **Resposta: A**

60. Qual evento caracteriza a meiose I?
    A) Separação de cromátides
    B) Redução cromossômica
    C) Replicação
    D) Crescimento
    **Resposta: B**

61. Qual estrutura organiza o fuso?
    A) Ribossomo
    B) Centríolo
    C) Núcleo
    D) Lisossomo
    **Resposta: B**

62. Qual célula é formada após fecundação?
    A) Gameta
    B) Zigoto
    C) Embrião
    D) Óvulo
    **Resposta: B**

63. O que é 2n?
    A) Haploide
    B) Diploide
    C) Triploide
    D) Tetraploide
    **Resposta: B**

64. O que é n?
    A) Diploide
    B) Haploide
    C) Triploide
    D) Tetraploide
    **Resposta: B**

}