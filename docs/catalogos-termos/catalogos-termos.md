# Catálogo de Termos do Cliente

Este catálogo reúne o vocabulário usado pelo cliente (Marcus Vinícius Rodrigues, treinador do Sub-17 do Canaã Esporte Clube) para descrever o planejamento e a análise dos treinos. O objetivo é que toda a equipe use os mesmos termos, com o mesmo significado, nos requisitos, protótipos e código.

**Fonte:** reunião de levantamento de requisitos com o cliente, de 24/08/2026 (transcrição), e planilhas de dados do cliente.

---

## 1. Periodização do treinamento

| Termo | Definição (segundo o cliente) |
|---|---|
| **Macrociclo** (temporada) | Período mais amplo do planejamento; equivale à "temporada". No caso do cliente são 6 meses, pois ele assumiu a equipe na segunda metade do ano. |
| **Mesociclo** | Conjunto de microciclos. Não corresponde necessariamente a um mês. Ex.: o 1º mesociclo durou 2 microciclos; o 2º deve durar toda a primeira fase da competição. |
| **Mesociclo preparatório** | Mesociclo que antecede a competição (ex.: as 2 semanas antes da estreia). |
| **Mesociclo competitivo** | Mesociclo que começa na semana da estreia e abrange as semanas de jogo. |
| **Microciclo** | Conjunto de sessões; padronizado como **uma semana, de segunda a domingo**. |
| **Sessão** (de treino) | Um treinamento (não "um dia" de treino). Cada sessão tem uma data e um número sequencial. |
| **Ciclo de trabalho** | Ciclo que se repete: planejar o treino → executar → avaliar (inclusive à luz do jogo) → replanejar. |

**Hierarquia:** Macrociclo ⊃ Mesociclo ⊃ Microciclo ⊃ Sessão ⊃ Atividade (execução).

---

## 2. Atividades, execuções e biblioteca

| Termo | Definição (segundo o cliente) |
|---|---|
| **Atividade** | Exercício **distinto**, cadastrado uma única vez na biblioteca com um ID. Se alguma característica essencial muda, já é outra atividade. |
| **Execução** (exercício, "exercitação") | Cada vez que uma atividade é realizada em uma sessão. No dashboard, o card *Execuções* conta **sessão + ordem** (atividades simultâneas contam uma vez). |
| **Biblioteca (de atividades)** | Cadastro das atividades já criadas. Ao repetir uma atividade, só se informa o ID; se for nova, cadastra-se com um novo ID. |
| **ID da atividade** | Código na biblioteca: **sigla da tipologia + número sequencial** (ex.: CF1, JC1, JC2, DP1). |
| **ID da execução** | Número sequencial crescente (1, 2, 3…), um por linha da aba *01_Sessoes*; liga a sessão às abas de momento, fase, comportamento e técnica. Não se liga à biblioteca. |
| **Ordem (da atividade)** | Posição da atividade dentro da sessão. Atividades com a **mesma ordem** acontecem **em simultâneo** (grupo dividido); ordem 2 é a atividade feita logo depois. Vai até 3 por sessão. |
| **Atividade simultânea** | Atividades de mesma ordem, feitas ao mesmo tempo por subgrupos. Cada uma é cadastrada separadamente, com a mesma minutagem, e a minutagem da sessão conta o tempo **uma vez só**. Ex.: 3 atividades de 20 min em simultâneo = 20 min. |
| **Atividade principal** | A atividade que representa o objetivo da sessão naquele momento. Só ela é registrada; o que o grupo restante faz (ex.: com o preparador físico) não entra na planilha. |
| **Objetivo central / principal** | Foco principal da atividade. Define em qual classificação ela é preenchida (técnica, comportamento, fase ou momento do jogo). Uma atividade pode ter só técnica, só tática, ou mais de um item. |
| **Dados inerentes (fixos)** | Informações que fazem parte da identidade da atividade (ex.: tipologia e tipo de SSP) e não mudam entre repetições. |
| **Dados editáveis (variáveis)** | Informações que podem mudar ao repetir a atividade sem torná-la outra (ex.: tamanho do espaço, nº de jogadores). |
| **Tipologia da atividade** | Categoria da atividade, criada pelo cliente (tema de TCC), inspirada na literatura de SSPs. Na nomenclatura, o que fica **à esquerda do traço** é a tipologia. |
| **SSP** | **Situações Simuladoras Preferenciais**: "nada mais é do que uma atividade", o tipo da atividade. Sigla de origem espanhola, de uma metodologia de treino espanhola. |

---

## 3. Espaço e dimensão

| Termo | Definição (segundo o cliente) |
|---|---|
| **Comprimento / Largura** | Dimensões do espaço da atividade, em metros (ex.: 24 × 25; campo completo 100 × 60). Preenchidos pelo cliente. |
| **Número de jogadores** | Jogadores envolvidos na atividade (inclui goleiros quando participam). Ex.: 22 = 10 de linha por equipe + 2 goleiros. Obrigatório em todas as orientações, **exceto PDI** (que também dispensa comprimento e largura). |
| **Área por jogador (m²/jogador)** | Coluna *Área (m²)* da planilha: `(comprimento × largura) ÷ nº de jogadores`. **Calculada** pelo sistema. Ex.: 24 × 25 ÷ 6 = 100. |
| **Dimensão do espaço** | Classificação derivada da área (m²), conforme a planilha: **≤ 100 = Pequeno**; **≤ 200 = Médio**; **> 200 = Grande**. **Não Definido** quando a atividade não tem espaço delimitado (ex.: atividades de PDI). |
| **Campo pequeno × grande** | Em espaços pequenos trabalha-se mais força e mudança de direção; em espaços grandes, mais velocidade e resistência. Os dados são cruzados com o preparador físico. |

---

## 4. Conteúdo trabalhado na atividade

| Termo | Definição (segundo o cliente) |
|---|---|
| **Orientação (da atividade)** | Finalidade metodológica da atividade. Valores na planilha: **Aquisição**, **Aplicação**, **PDI** e **Eq Carga** (equilíbrio de carga). |
| **Aquisição** | Exercício para **adquirir um conceito/ideia**; em geral mais reduzido e curto. Ex.: posse de bola 4 × 4 + 2 coringas para aprender a reação pós-perda. |
| **Aplicação** | Exercício para **aplicar** o que foi adquirido, em situação parecida com o jogo. Ex.: 10 × 10 em meio-campo, com 15 s para recuperar a bola após perder. |
| **PDI** | **Proposta de Desenvolvimento Individual**: atividade mais técnica, voltada ao refinamento de fundamentos. Apesar do nome, é aplicada ao **grupo** (ou subgrupos por posição), não a um atleta isolado. |
| **Momento do jogo** | **Ataque, defesa, transições e bola parada.** Opcional: só se preenche quando a atividade tem foco definido. |
| **Fase do jogo** | Subdivisão dentro de ataque ou defesa (ex.: primeira e segunda construção). Usada principalmente em jogos setoriais. |
| **Comportamento (tático)** | Princípio tático que se quer estimular; mistura conceitos da literatura (ex.: cobertura) com conceitos criados pelo cliente a partir do seu **modelo de jogo**. Ex.: abrir o campo, amplitude, busca, reação pós-perda. |
| **Modelo de jogo** | A forma como o treinador quer que a equipe jogue; é a base dos comportamentos trabalhados. |
| **Reação pós-perda** | Comportamento em que, após perder a bola, os atletas reagem imediatamente (ex.: nos primeiros 5 segundos) para recuperá-la o mais rápido possível. |
| **Atributo técnico** (fundamento técnico) | Fundamento trabalhado de forma direta. Ex.: cabeceio e rebatida frontal (defensores), cruzamento por zona, domínio orientado, finalização, passe. Só é preenchido se for o objetivo central. |

> **Regra do objetivo central:** um jogo de posse com regra de reação pós-perda envolve muitos passes, mas, se o objetivo é a reação pós-perda, o **passe não** é registrado como fundamento técnico.

---

## 5. Jargão de campo e tipos de atividade

| Termo | Definição (segundo o cliente) |
|---|---|
| **CD** | **Coletivo direcionado**: exemplo de tipologia. Uma variação é indicada depois do traço (ex.: de 5 corredores). |
| **Jogo de posse / posse de bola** | Atividade de manutenção da bola entre equipes. |
| **Jogo setorial** | Atividade em um setor do campo, usada para trabalhar fases do jogo (ex.: primeira e segunda construção). |
| **Corredores** | Divisão do campo em faixas longitudinais para organizar a atividade. |
| **Coringa** | Jogador que atua com a equipe que está com a bola (joga pelas duas equipes). |
| **Notação 2 × 2, 4 × 4, 10 × 10** | Número de jogadores de cada lado. Ex.: 2 × 2 + 2 goleiros = 4 jogadores no espaço (24 × 25), com troca a cada 30 s. |
| **Confrontos (CF)** | Tipologia de duelos curtos com rodízio (ex.: 2 × 2 + 2 goleiros, troca a cada 30 s). Na biblioteca: `CF \| G2XG`, tipo SSP Especial. O "F1" da transcrição é erro de "CF". |
| **Rodízio** | Troca dos atletas que estão dentro da atividade pelos que estão fora, conforme o objetivo e o tempo. |
| **Ativação** | Trabalho inicial da sessão (ex.: sessão com o grupo dividido em três). |

---

## 5.1 Tipos de SSP (Situações Simuladoras Preferenciais), tipologias e IDs

**Tipo SSP** (Situações Simuladoras Preferenciais; 3 valores): **Especial**, **Dirigido** e **Competitivo**.

| Sigla | Tipologia | Tipo SSP | IDs na biblioteca (Atividade SSP) |
|---|---|---|---|
| **CF** | Confrontos | Especial | CF1 (G2XG) |
| **JC** | Jogo Condicionante | Especial; Competitivo no EC1 | JC1 (RecPosPerd), JC2 (AlemRecPosPerd), EC1 (2Eq MeioCampo) |
| **JP** | Jogo de Posse | Especial | JP1 (RecPosPerd) |
| **RD** | Rondo | Especial | RD1 (Cont/Cob) |
| **JS** | Jogo Setorial | Especial | JS1 (1ª/2ªConst), JS2 (Cri/Fin) |
| **SIT** | Situacional | Especial | SIT1 (JgAer/CaAtqRap) |
| **DP** | Dinâmica de Passe | Dirigido | DP1 (DomOrien \| Var1), DP2 (DomOrien \| Var2) |
| **DF** | Dinâmica de Finalização | Dirigido | DF1 (FinCruz/Chap), DF2 (CruzZon1/Fin1ª) |
| **DPD** | Dinâmica ProtDef | Dirigido | DPD1 (Circ+CabRebFrontLat), DPD2 (BolDesc+CabRebFrontLat) |
| **CD** | Coletivo Direcionado | Competitivo | CD1 (5Corredores) |
| **JBP** | Jogo de Bola Parada | Competitivo | JBP1 (ColetivoBP), JBP2 (Meio Campo) |

> O tipo de SSP não decorre só da tipologia: Jogo Condicionante aparece como Especial (JC1, JC2) e como Competitivo (EC1). Por isso é um atributo da atividade cadastrada.

---

## 5.2 Valores das listas fechadas (planilha do cliente)

Valores que o cliente já usa e que podem virar botões/seleções no sistema. Na planilha, as colunas marcadas como **"Lista Fixa"** são: Objetivo da Atividade (Orientação), Dimensão do Espaço (calculada), Tipo SSP, Tipologia Atividade, Momento Principal e Fase do Jogo Principal. **Comportamento Principal** e **Atributo Técnico** não têm essa marcação, o que combina com a fala do cliente de que parte dos dados precisa ficar aberta para cadastro.

| Campo | Valores |
|---|---|
| **Orientação** | Aquisição, Aplicação, PDI, Eq Carga (equilíbrio de carga) |
| **Momento do jogo** | Ataque, Defesa, Trans Of (transição ofensiva), Trans Def (transição defensiva), Bola Parada. Uma atividade pode ter mais de um. |
| **Fase do jogo** | 1ª Construção, 2ª Construção, Criação, Finalização, Bola Parada |
| **Comportamento** | Cobertura, Contenção, RecPosPerd (reação pós-perda), MantPoss (manter a posse), Quebrar Linha, Balanço Def (balanço defensivo), Amplitude, Abrir o Campo, Atacar Espaço, CoordLinDef (coordenação da linha defensiva), DefCruz (defesa de cruzamento), JogoEntrelinhas, ContrProf (controle de profundidade), Pisar Área, Atq o Gol/AO, Atq o Gol/CAeAR (contra-ataque e ataque rápido) |
| **Atributo técnico** | DomOrient (domínio orientado), Fin Cruz/Chap, Passe Ruptura, Cab/Reb Frontal (cabeceio/rebatida frontal), Cab/Reb Lateral, Cruz Zon1, Cruz Zon2 (cruzamento por zona), Fin 1ª (finalização de primeira) |

---

## 6. Métricas e indicadores

| Termo | Definição (segundo o cliente) |
|---|---|
| **Minutagem** | Minutos dedicados a uma atividade ou categoria. Ex.: 558 min em 10 sessões; 140 min de trabalho técnico. |
| **Minutagem bruta** | Total de minutos (valor absoluto). |
| **Minutagem relativa** | Porcentagem do tempo em relação ao total (da sessão, do ciclo etc.). |
| **Variabilidade** | **Atividades distintas ÷ execuções**, em %. Mede o quanto o treinador varia os exercícios. Ex.: 18 ÷ 23 = 78%. Faixa desejada pelo cliente: entre ~50–60% e 70% (cada exercício repetido de 1 a 2 vezes). É métrica **secundária e subjetiva**, criada pelo cliente. No dashboard é um **card** do painel de indicadores da página inicial (ao lado de *Atividades*), que fica escondido atrás da barra de rolagem do painel: é a "barrinha" que ele puxa na reunião. |
| **Número de execuções** | Quantidade de execuções (sessão + ordem) no período. Ex.: 23. |
| **Número de sessões** (Qtd Sessões) | Quantidade de treinos realizados no período filtrado. Ex.: 10. |
| **Tempo Total** | Soma dos minutos de treino no período filtrado. Ex.: 558 min. |
| **Min/Sessão** | Tempo total ÷ número de sessões. Ex.: 558 ÷ 10 = 55,8. |
| **Min/Execução** | Tempo total ÷ número de execuções. Ex.: 558 ÷ 23 ≈ 24,3. |
| **Atividades** (card) | Número de atividades **distintas** no período. Ex.: 18. |
| **Distribuição** | Quanto cada comportamento, técnica ou momento foi trabalhado ao longo dos ciclos; ajuda a ver o que ficou tempo sem ser treinado. |
| **Análise comparativa** | Aba que compara a distribuição por mesociclo, microciclo e sessão (falta incluir o gráfico por mês). Para o cliente, é **a visão mais importante**. |

---

## 7. Ferramentas e estrutura atuais do cliente

| Termo | Definição (segundo o cliente) |
|---|---|
| **Planilha** | Fonte dos dados. Na versão "Entendendo a Planilha de Dados", as abas são: **Macrociclo** (data → macrociclo), **Mesociclo** (mesociclo → mês), **Microciclo**, **Sessões** (entrada principal) e **Macro + Meso + Micro + Sessão** (visão consolidada), seguidas de **02_Biblioteca**, **03_MomentoDoJogo**, **04_FaseDoJogo**, **05_Comportamentos** e **06_Técnico**. As abas 03–06 são associações N:N por `ID Execução` + `ID` (uma execução pode ter vários comportamentos, momentos etc.). |
| **Dashboard (Power BI)** | Painel alimentado automaticamente pela planilha; é o que o FutBoard pretende substituir/migrar para uma aplicação. |
| **Guia (aba)** | Cada tela do dashboard, organizada por tema. Nomes vistos no Power BI: **Atividades**, **Espaço/Orientação**, **Momentos/Fases do Jogo**, **Comportamentos**, **Técnica** e **Análise Comparativa**. |
| **Filtros** | Quatro filtros presentes em todas as guias (exceto a última): **mesociclo, microciclo, mês e sessão**. |
| **Card** | Indicador resumido no dashboard (ex.: minutos de trabalho técnico). Na página inicial, o painel de cards traz: Qtd Sessões, Tempo Total, Min/Sessão, Execuções, Min/Execução, Atividades e Variabilidade; a barra de rolagem do painel esconde os últimos. |

---

## 8. Pessoas, posições e contexto do clube

| Termo | Definição |
|---|---|
| **Treinador / técnico** | Marcus Vinícius; planeja, executa e avalia os treinos; usuário principal. |
| **Auxiliar (técnico)** | Conduz subgrupos nos treinos; também cadastra dados. |
| **Preparador físico** | Conduz parte do grupo e analisa junto com o treinador os dados de espaço (força, velocidade, resistência). |
| **Posições** | Atacantes, defensores, laterais, zagueiros, volantes e goleiros; os subgrupos de treino costumam ser separados por posição. |
| **Clube de formação / categoria de base** | Clube cujo objetivo é formar e **negociar atletas** (ex.: negociações com Santos e Cruzeiro); por isso o trabalho técnico individual é prioridade. |
| **Sub-17** | Categoria de atletas de 16 e 17 anos. |
| **Campeonato Candango Sub-17** | Competição em que a equipe estreou em 23/08/2026. |