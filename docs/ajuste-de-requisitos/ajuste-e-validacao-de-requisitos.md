## Ajuste e Validação de Requisitos

Esta página consolida a resposta da equipe FutBoard ao feedback de revisão por pares sobre os requisitos funcionais (RF) e não funcionais (RNF). Os apontamentos concentraram-se em quatro tipos de problema — **Clareza**, **Beneficiário** (ator / quem se beneficia), **Verificabilidade** e **Escopo** — e os ajustes tornam explícito o ator de cada funcionalidade, definem os ciclos de periodização (macro, meso e microciclo) e substituem termos vagos por critérios verificáveis.

### Resumo

- **43 requisitos funcionais** avaliados: **24 aceitos**, **13 parcialmente aceitos**, **2 não aceitos** e **4 não aplicáveis**.
- **3 requisitos não funcionais**, todos **aceitos**.
- Ajuste predominante: explicitar o **beneficiário/ator** (treinador e/ou auxiliar) na redação do requisito.
- Ajustes de **clareza**: definição resumida de macrociclo, mesociclo e microciclo e dos campos cadastrados/editáveis.
- Ajustes de **escopo**: separação de requisitos que misturavam duas funcionalidades (registro × análise, planejado × comparativo).
- Ajustes de **verificabilidade** (RNF): troca de "segurança", "padrão de mercado" e "otimizado" por critérios técnicos medíveis.

### Requisitos Funcionais

| Código | Decisão | Ajuste realizado / requisito corrigido |
|---|---|---|
| RF01 | Aceito | Treinador cadastra novo **macrociclo** (período mais amplo do planejamento, ex.: temporada 2026), informando nome e data de início. |
| RF02 | Aceito | Treinador edita os dados de um macrociclo já cadastrado (ex.: nome e data de início). |
| RF03 | Não aplicável | — |
| RF04 | Aceito | Treinador cadastra novo **mesociclo** (bloco de semanas com objetivo específico) vinculado a um macrociclo, informando o nome. |
| RF05 | Parcialmente aceito | Treinador edita os dados de um mesociclo já cadastrado (ex.: nome). Definição de mesociclo já constava. |
| RF06 | Não aplicável | — |
| RF07 | Aceito | Treinador cadastra novo **microciclo** vinculado a um mesociclo, informando o nome. |
| RF08 | Parcialmente aceito | Treinador edita os dados de um microciclo (ex.: nome). Definição de microciclo já constava. |
| RF09 | Parcialmente aceito | Treinador exclui um microciclo cadastrado. |
| RF10 | Parcialmente aceito | Treinador cadastra comportamentos táticos (ex.: ofensivo, defensivo, transição) para associar às atividades. |
| RF11 | Parcialmente aceito | Treinador edita um comportamento tático já cadastrado, sem alterar os dados fixos da atividade. |
| RF12 | Parcialmente aceito | Treinador exclui um comportamento tático cadastrado. |
| RF13 | Parcialmente aceito | Treinador cadastra nova atividade (exercício) com dados fixos e invariáveis (tipologia e tipo de SSP). |
| RF14 | Parcialmente aceito | Treinador edita os dados de uma atividade já cadastrada. |
| RF15 | Parcialmente aceito | Treinador exclui uma atividade cadastrada. |
| RF16 | Aceito | Treinador cadastra nova sessão de treino vinculada à periodização (macro/meso/micro), com data e número sequencial. |
| RF17 | Aceito | Treinador e auxiliar editam os dados de uma sessão de treino já cadastrada. |
| RF18 | Aceito | Treinador e auxiliar excluem uma sessão de treino cadastrada. |
| RF19 | Aceito | Treinador e auxiliar cadastram atividade diretamente na biblioteca de treinos, para reutilização futura. |
| RF20 | Aceito | Treinador e auxiliar editam uma atividade cadastrada na biblioteca. |
| RF21 | Aceito | Treinador e auxiliar excluem uma atividade cadastrada na biblioteca. |
| RF22 | Não aceito | — |
| RF23 | Não aceito | — |
| RF24 | Aceito | Treinador e auxiliar adicionam a uma sessão uma atividade já cadastrada na biblioteca, com preenchimento automático dos campos (editáveis antes de salvar). |
| RF25 | Aceito | Treinador e auxiliar ajustam, em uma atividade da sessão, os campos variáveis sem alterar o cadastro-base na biblioteca. |
| RF26 | Aceito | Treinador e auxiliar filtram os dados por macrociclo, mesociclo, microciclo e sessão (removido o termo "filtro único"). |
| RF27 | Parcialmente aceito | Treinador e auxiliar geram relatórios comparativos entre ciclos do mesmo nível, com indicadores (nº de sessões, minutos de treino, exercícios distintos e execuções). |
| RF28 | Aceito | Treinador e auxiliar alternam os gráficos entre tempo absoluto (min) e relativo (% do tempo total da sessão). |
| RF29 | Não aplicável | — |
| RF30 | Não aplicável | — |
| RF31 | Parcialmente aceito | Treinador e auxiliar anexam imagem a uma atividade da biblioteca, exibida na biblioteca e nas sessões em que ela for incluída. |
| RF32 | Parcialmente aceito | Treinador e auxiliar registram, por atividade da sessão, a pontuação planejada e a obtida em cada repetição. |
| RF33 | Aceito | Treinador e auxiliar analisam dados quantitativos de desempenho dos atletas (ex.: scout de jogo) para enriquecer a análise tática. Escopo de registro removido. |
| RF34 | Aceito | **Gerar análises textuais**: treinador e auxiliar geram insights (máx. 300 caracteres) sobre gráficos e dados, via IA. |
| RF35 | Aceito | Treinador e auxiliar associam a uma atividade, opcionalmente, o momento de jogo (ex.: ataque, defesa, transição). |
| RF36 | Aceito | Treinador e auxiliar editam um momento de jogo associado a uma atividade. |
| RF37 | Aceito | Treinador e auxiliar removem um momento de jogo associado a uma atividade. |
| RF38 | Aceito | Treinador e auxiliar associam a uma atividade, opcionalmente, a fase de jogo (ex.: primeira/segunda construção) — específico para jogos setoriais. |
| RF39 | Aceito | Treinador e auxiliar editam uma fase de jogo associada a uma atividade. |
| RF40 | Parcialmente aceito | Ator principal adicionado ao texto (o feedback parecia referir-se ao RF38). |
| RF41 | Aceito | Ator explicitado: treinador edita um atributo técnico. |
| RF42 | Aceito | Ator explicitado (variação CRUD de "Atributo Técnico"). |
| RF43 | Aceito | Ator explicitado (variação CRUD de "Atributo Técnico"). |

### Requisitos Não Funcionais

| Código | Decisão | Ajuste realizado / requisito corrigido |
|---|---|---|
| RNF01 | Aceito | Removidos "garantir a segurança" e "retornar exceção". Critérios objetivos: hashing irreversível de senhas (bcrypt) e resposta HTTP 401 para acessos indevidos, verificável nos logs do backend. |
| RNF02 | Aceito | Substituído "padrão de mercado" por critério de responsividade: em 360px (mobile), 768px (tablet) e 1366px+ (desktop), nenhum gráfico cortado, sobreposto ou com scroll horizontal. |
| RNF03 | Aceito | Substituído "otimizado" por minutagem cronometrada com o cliente: o processo deve produzir o mesmo resultado em tempo inferior ao do uso atual. |