# Requisitos de Software

## 8.1 Requisitos Funcionais — RFs

Os requisitos funcionais abaixo descrevem as capacidades que o sistema deve oferecer ao treinador e ao auxiliar, elicitadas a partir das reuniões de levantamento de requisitos com o cliente (Marcus Vinícius) e organizadas segundo as Características do Produto (CPs) definidas pela equipe:

- **CP01** — Registro Categorizado dos Treinos
- **CP02** — Estruturador de Periodização Esportiva
- **CP03** — Dashboard Analítico
- **CP04** — Geração Automática de Relatórios
- **CP05** — Controle de Perfis de Acesso

| Identificador | Descrição | Regras de Negócio | CP de origem |
|:---|:---|:---:|:---:|
| <a id="rf01"></a>**RF01** | **Cadastrar macrociclo:** o sistema deve permitir que o treinador e o auxiliar cadastrem um novo macrociclo, informando campos como nome e data de início para organizar a periodização dos treinos. | [RN04](#rn04) | CP02 |
| <a id="rf02"></a>**RF02** | **Editar macrociclo:** o sistema deve permitir que o treinador e o auxiliar editem os dados de um macrociclo anteriormente cadastrado. | [RN04](#rn04) | CP02 |
| <a id="rf03"></a>**RF03** | **Excluir macrociclo:** o sistema deve permitir que o treinador e o auxiliar excluam um macrociclo cadastrado, validando a integridade referencial com os ciclos subordinados. | [RN04](#rn04) | CP02 |
| <a id="rf04"></a>**RF04** | **Cadastrar mesociclo:** o sistema deve permitir que o treinador e o auxiliar cadastrem um novo mesociclo vinculado obrigatoriamente a um macrociclo existente, informando o nome do mesociclo. | [RN04](#rn04) | CP02 |
| <a id="rf05"></a>**RF05** | **Editar mesociclo:** o sistema deve permitir que o treinador e o auxiliar editem os dados de um mesociclo anteriormente cadastrado. | [RN04](#rn04) | CP02 |
| <a id="rf06"></a>**RF06** | **Excluir mesociclo:** o sistema deve permitir que o treinador e o auxiliar excluam um mesociclo cadastrado, tratando as dependências estruturais. | [RN04](#rn04) | CP02 |
| <a id="rf07"></a>**RF07** | **Cadastrar microciclo:** o sistema deve permitir que o treinador e o auxiliar cadastrem um novo microciclo vinculado obrigatoriamente a um mesociclo existente, informando o nome do microciclo. | [RN04](#rn04) | CP02 |
| <a id="rf08"></a>**RF08** | **Editar microciclo:** o sistema deve permitir que o treinador e o auxiliar editem os dados de um microciclo anteriormente cadastrado. | [RN04](#rn04) | CP02 |
| <a id="rf09"></a>**RF09** | **Excluir microciclo:** o sistema deve permitir que o treinador e o auxiliar excluam um microciclo cadastrado. | [RN04](#rn04) | CP02 |
| <a id="rf10"></a>**RF10** | **Cadastrar comportamento:** o sistema deve permitir que o treinador e o auxiliar cadastrem um comportamento tático (ex: ofensivo, defensivo), para uso nas atividades. | [RN05](#rn05) | CP01 |
| <a id="rf11"></a>**RF11** | **Editar comportamento:** o sistema deve permitir que o treinador e o auxiliar editem um comportamento tático já cadastrado. | [RN05](#rn05) | CP01 |
| <a id="rf12"></a>**RF12** | **Excluir comportamento:** o sistema deve permitir que o treinador e o auxiliar excluam um comportamento tático cadastrado. | - | CP01 |
| <a id="rf13"></a>**RF13** | **Cadastrar atividade na sessão:** o sistema deve permitir que o treinador e o auxiliar cadastrem uma nova atividade diretamente em uma sessão, informando dados invariáveis (tipologia e tipo de SSP) e, de forma opcional, espaço, orientação, comportamento, momento e fase do jogo, calculando a área por jogador ([RN01](#rn01)), atribuindo a dimensão do espaço ([RN02](#rn02)), controlando a simultaneidade ([RN03](#rn03)) e respeitando o foco central ([RN05](#rn05)). | [RN01](#rn01), [RN02](#rn02), [RN03](#rn03), [RN05](#rn05) | CP01 |
| <a id="rf14"></a>**RF14** | **Editar atividade na sessão:** o sistema deve permitir que o treinador e o auxiliar editem os dados de uma atividade incluída em uma sessão, recalculando automaticamente as métricas de espaço ([RN01](#rn01), [RN02](#rn02)) e ordem de simultaneidade ([RN03](#rn03)). | [RN01](#rn01), [RN02](#rn02), [RN03](#rn03), [RN05](#rn05) | CP01 |
| <a id="rf15"></a>**RF15** | **Excluir atividade na sessão:** o sistema deve permitir que o treinador e o auxiliar excluam uma atividade de uma sessão, sem afetar o registro dela na biblioteca. | - | CP01 |
| <a id="rf16"></a>**RF16** | **Cadastrar sessão:** o sistema deve permitir que o treinador e o auxiliar cadastrem uma nova sessão de treino vinculada à periodização (macrociclo, mesociclo e microciclo), contendo a data e o número sequencial da sessão, apurando o tempo real da sessão sem duplicidade de atividades simultâneas ([RN03](#rn03)). | [RN03](#rn03), [RN04](#rn04) | CP01 |
| <a id="rf17"></a>**RF17** | **Editar sessão:** o sistema deve permitir que o treinador e o auxiliar editem os dados de uma sessão de treino já cadastrada, recalculando a duração líquida da sessão ([RN03](#rn03)). | [RN03](#rn03), [RN04](#rn04) | CP01 |
| <a id="rf18"></a>**RF18** | **Excluir sessão:** o sistema deve permitir que o treinador e o auxiliar excluam uma sessão de treino cadastrada. | [RN04](#rn04) | CP01 |
| <a id="rf19"></a>**RF19** | **Cadastrar atividade na biblioteca:** o sistema deve permitir que o treinador e o auxiliar cadastrem uma atividade na biblioteca de treinos para reutilização futura, calculando a área ([RN01](#rn01)), classificando a dimensão ([RN02](#rn02)) e respeitando o objetivo central ([RN05](#rn05)). | [RN01](#rn01), [RN02](#rn02), [RN05](#rn05) | CP01 |
| <a id="rf20"></a>**RF20** | **Editar atividade na biblioteca:** o sistema deve permitir que o treinador e o auxiliar editem uma atividade cadastrada na biblioteca de treinos, atualizando sua classificação de espaço ([RN02](#rn02)). | [RN01](#rn01), [RN02](#rn02), [RN05](#rn05) | CP01 |
| <a id="rf21"></a>**RF21** | **Excluir atividade na biblioteca:** o sistema deve permitir que o treinador e o auxiliar excluam uma atividade cadastrada na biblioteca de treinos. | - | CP01 |
| <a id="rf22"></a>**RF22** | **Exibir indicador de treino:** o sistema deve exibir indicadores como número de sessões, minutos totais de treino (respeitando simultaneidade da [RN03](#rn03)), índice de variabilidade de exercícios ([RN06](#rn06)), número de execuções e tratamento neutro em períodos sem registros ([RN07](#rn07)). | [RN03](#rn03), [RN06](#rn06), [RN07](#rn07) | CP03 |
| <a id="rf23"></a>**RF23** | **Reutilizar atividade cadastrada:** o sistema deve permitir que o treinador e o auxiliar adicionem a uma sessão de treino uma atividade já cadastrada na biblioteca, recalculando automaticamente as dimensões se forem alteradas ([RN01](#rn01), [RN02](#rn02)). | [RN01](#rn01), [RN02](#rn02) | CP01 |
| <a id="rf24"></a>**RF24** | **Consultar informação de atividade do treino:** o sistema deve permitir que o treinador e o auxiliar consultem, em gráfico e por meio de filtro, a informação de atividade, com atualização automática e visual de estado vazio ([RN07](#rn07)). | [RN07](#rn07) | CP03 |
| <a id="rf25"></a>**RF25** | **Gerar relatório de treino:** o sistema deve permitir que o treinador e o auxiliar gerem relatório em PDF consolidando tempo de sessão ([RN03](#rn03)), variabilidade ([RN06](#rn06)) e notificação orientadora para períodos vazios ([RN07](#rn07)). | [RN02](#rn02), [RN03](#rn03), [RN06](#rn06), [RN07](#rn07) | CP04 |
| <a id="rf26"></a>**RF26** | **Alternar unidade de tempo:** o sistema deve permitir que o treinador e o auxiliar alternem, nos gráficos, a visualização do tempo entre tempo absoluto (minutos) e relativo (porcentagem), calculado a partir do tempo real da sessão ([RN03](#rn03)). | [RN03](#rn03) | CP03 |
| <a id="rf27"></a>**RF27** | **Criar conta:** o sistema deve permitir que o treinador e o auxiliar criem uma conta de acesso à aplicação. | - | CP05 |
| <a id="rf28"></a>**RF28** | **Fazer login:** o sistema deve permitir que o treinador e o auxiliar se autentiquem na aplicação a partir de um login e senha de acesso. | - | CP05 |
| <a id="rf29"></a>**RF29** | **Anexar imagem à atividade:** o sistema deve permitir que o treinador e o auxiliar anexem uma imagem a uma atividade cadastrada na biblioteca, exibindo-a junto à atividade nas sessões de treino. | - | CP01 |
| <a id="rf30"></a>**RF30** | **Registrar pontuação da atividade:** o sistema deve permitir que o treinador e o auxiliar registrem, para cada atividade de uma sessão, a pontuação planejada e a pontuação obtida em cada repetição. | - | CP03 |
| <a id="rf31"></a>**RF31** | **Gerar análise textual do treino:** o sistema deve permitir que o treinador e o auxiliar gerem, com inteligência artificial, uma análise textual (insight) sobre as informações do treino. | - | CP03 |
| <a id="rf32"></a>**RF32** | **Registrar atributo técnico da atividade:** o sistema deve permitir registrar, de forma opcional e restrita às atividades com foco técnico ([RN05](#rn05)), o atributo trabalhado (ex: domínio orientado, cabeceio defensivo). | [RN05](#rn05) | CP01 |
| <a id="rf33"></a>**RF33** | **Editar atributo técnico da atividade:** o sistema deve permitir que o treinador e o auxiliar editem um atributo técnico registrado em uma atividade. | [RN05](#rn05) | CP01 |
| <a id="rf34"></a>**RF34** | **Excluir atributo técnico da atividade:** o sistema deve permitir que o treinador e o auxiliar excluam um atributo técnico registrado em uma atividade. | [RN05](#rn05) | CP01 |
| <a id="rf35"></a>**RF35** | **Consultar informação de espaço do treino:** o sistema deve permitir consultar, em gráfico e filtro, a informação de espaço com base nas faixas da [RN02](#rn02) calculadas pela [RN01](#rn01), com tratamento neutro para ausência de dados ([RN07](#rn07)). | [RN01](#rn01), [RN02](#rn02), [RN07](#rn07) | CP03 |
| <a id="rf36"></a>**RF36** | **Consultar informação de orientação do treino:** o sistema deve permitir consultar, em gráfico e filtro, a orientação do treino (Aquisição, Aplicação, PDI, Eq Carga), com visual neutro para dados vazios ([RN07](#rn07)). | [RN07](#rn07) | CP03 |
| <a id="rf37"></a>**RF37** | **Consultar informação de momento do jogo do treino:** o sistema deve permitir consultar, em gráfico e filtro, a distribuição dos momentos do jogo trabalhados ([RN05](#rn05)), tratando períodos sem registros ([RN07](#rn07)). | [RN05](#rn05), [RN07](#rn07) | CP03 |
| <a id="rf38"></a>**RF38** | **Consultar informação de fase do jogo do treino:** o sistema deve permitir consultar, em gráfico e filtro, a informação de fase do jogo ([RN05](#rn05)), tratando períodos sem registros ([RN07](#rn07)). | [RN05](#rn05), [RN07](#rn07) | CP03 |
| <a id="rf39"></a>**RF39** | **Consultar informação de comportamento do treino:** o sistema deve permitir consultar, em gráfico e filtro, a informação de comportamento tático ([RN05](#rn05)), tratando períodos sem registros ([RN07](#rn07)). | [RN05](#rn05), [RN07](#rn07) | CP03 |
| <a id="rf40"></a>**RF40** | **Consultar informação de atributo técnico do treino:** o sistema deve permitir consultar, em gráfico e filtro, a informação de atributos técnicos trabalhados ([RN05](#rn05)), tratando períodos sem registros ([RN07](#rn07)). | [RN05](#rn05), [RN07](#rn07) | CP03 |
| <a id="rf41"></a>**RF41** | **Consultar análise comparativa por periodização:** o sistema deve permitir consultar a análise comparativa respeitando a hierarquia da periodização ([RN04](#rn04)), com indicativo neutro se um dos ciclos não contiver treinos ([RN07](#rn07)). | [RN04](#rn04), [RN07](#rn07) | CP03 |

---

## 8.2 Regras de Negócio — RNs

As Regras de Negócio (RNs) definem a lógica de domínio esportivo do treinador Marcus Vinicius, as diretrizes de cálculo analítico e as restrições comportamentais do sistema. Elas especificam como as funcionalidades declaradas nos RFs devem operar para garantir a fidelidade metodológica ao futebol de base:

| ID | Regra de Negócio | Categoria | Descrição / Fórmula de Negócio | Requisitos Relacionados |
| :---: | :--- | :---: | :--- | :---: |
| <a id="rn01"></a>**RN01** | **Cálculo da Área por Jogador** | Cálculo Esportivo | A área por jogador em metros quadrados é calculada pela fórmula:<br><br><code>Área (m²/jogador) = (Comprimento × Largura) ÷ Nº de Jogadores</code><br><br>Obrigatório para atividades com orientação de **Aquisição**, **Aplicação** e **Equilíbrio de Carga**. Dispensado para atividades de **PDI** (Proposta de Desenvolvimento Individual), nas quais comprimento, largura e jogadores são opcionais. | [RF13](#rf13), [RF14](#rf14), [RF19](#rf19), [RF20](#rf20), [RF23](#rf23), [RF35](#rf35) |
| <a id="rn02"></a>**RN02** | **Classificação Automática da Dimensão do Espaço** | Validação Automática | A dimensão do espaço não é digitada pelo usuário, sendo classificada automaticamente pelo sistema a partir do resultado da [RN01](#rn01):<br>• <strong>≤ 100 m²:</strong> Espaço Reduzido (Pequeno)<br>• <strong>101 a 200 m²:</strong> Espaço Médio<br>• <strong>> 200 m²:</strong> Espaço Amplo (Grande)<br>• <strong>Sem dimensões delimitadas (ex.: PDI):</strong> Não Definido | [RF13](#rf13), [RF14](#rf14), [RF19](#rf19), [RF20](#rf20), [RF25](#rf25), [RF35](#rf35) |
| <a id="rn03"></a>**RN03** | **Simultaneidade e Contagem de Tempo da Sessão** | Cálculo Esportivo | Atividades cadastradas com o mesmo número no campo **ordem** dentro de uma sessão (ex.: duas atividades com Ordem = 1) ocorrem de forma **simultânea** (elenco dividido em subgrupos). No cálculo da duração líquida da sessão, o tempo de atividades simultâneas é contabilizado **uma única vez** (ex.: duas atividades de 20 minutos com mesma ordem somam 20 minutos à sessão, e não 40). No contador de execuções, o par (Sessão + Ordem) conta como 1 execução. | [RF13](#rf13), [RF14](#rf14), [RF16](#rf16), [RF17](#rf17), [RF22](#rf22), [RF25](#rf25), [RF26](#rf26) |
| <a id="rn04"></a>**RN04** | **Hierarquia e Integridade da Periodização** | Integridade Estrutural | A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade. | [RF01](#rf01) a [RF09](#rf09), [RF16](#rf16), [RF18](#rf18), [RF41](#rf41) |
| <a id="rn05"></a>**RN05** | **Preenchimento Condicional pelo Objetivo Central** | Validação de Entrada | O preenchimento dos campos de momento do jogo, fase do jogo, comportamento tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual). | [RF13](#rf13), [RF14](#rf14), [RF19](#rf19), [RF20](#rf20), [RF32](#rf32), [RF37](#rf37) a [RF40](#rf40) |
| <a id="rn06"></a>**RN06** | **Cálculo da Variabilidade de Treinos** | Cálculo Esportivo | O índice percentual de rotatividade de exercícios em um determinado período é calculado por:<br><br><code>Variabilidade (%) = (Atividades Distintas no Período ÷ Total de Execuções no Período) × 100</code><br><br>Faixa de referência metodológica estipulada pelo treinador: entre 50% e 70% (cada atividade repetida em média de 1 a 2 vezes no ciclo). | [RF22](#rf22), [RF25](#rf25) |
| <a id="rn07"></a>**RN07** | **Tratamento e Estabilidade em Consultas com Resultado Vazio** | Comportamento do Sistema | Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo. | [RF22](#rf22), [RF24](#rf24), [RF25](#rf25), [RF35](#rf35) a [RF41](#rf41) |

---

### <a id="811-regras-de-negocio-para-consultas-com-resultado-vazio"></a>8.2.1 Detalhamento da RN07: Comportamento para Consultas com Resultado Vazio

Esta subseção detalha a especificação operacional da **RN07**, descrevendo o comportamento visual e interativo do sistema nos cenários em que consultas e filtros não retornam dados:

| Requisito | Tipo de Consulta | Condição de Resultado Vazio | Comportamento do Sistema (Regra de Negócio) | Mensagem e Ação Sugerida ao Usuário |
|:---:|:---|:---|:---|:---|
| [**RF22**](#rf22) | Indicadores na tela inicial | Nenhum treino cadastrado no período selecionado. | Os indicadores quantitativos são exibidos com valor neutro (`0 sessões`, `0 min`, `0 execuções`). Não ocorrem erros de renderização. | *"Nenhum treino registrado neste período."* O sistema exibe atalho para cadastrar nova sessão. |
| [**RF24**](#rf24) | Informações de atividades do treino | Filtro aplicado para o qual não existem atividades cadastradas. | A lista de atividades é substituída por um componente visual de estado vazio. | *"Nenhuma atividade encontrada para os filtros aplicados."* O sistema disponibiliza botão para limpar filtros. |
| [**RF25**](#rf25) | Geração de relatório em PDF | Exportação de relatório para um período sem sessões registradas. | O sistema emite notificação informativa na interface, evitando gerar arquivos vazios ou erros. | *"Não há registros de treinos no período selecionado para compor o relatório."* |
| [**RF35**](#rf35) a [**RF40**](#rf40) | Informações de dimensões do treino (espaço, orientação, momento, fase, comportamento, atributo) | Período filtrado não possui treinos com a dimensão selecionada. | O gráfico é renderizado com visual neutro (`0 min` e `0%`), sem disparar exceções (ex.: evitar divisão por zero). | *"Sem atividades com [esta dimensão] no período."* Mantém os filtros ativos para nova consulta. |
| [**RF41**](#rf41) | Análise comparativa por periodização | Um ou ambos os ciclos selecionados não possuem treinos. | O sistema renderiza a coluna do ciclo sem dados com indicativo neutro, alertando a impossibilidade de cálculo comparativo. | *"O ciclo selecionado não possui treinos registrados para permitir o comparativo."* |

---

## 8.3 Requisitos Não Funcionais — RNFs

Lista de requisitos não funcionais, contendo: Numeração do Requisito; Nome; Descrição; Classificação FURPS+; Critério de Verificação.

| ID | Nome | Descrição | Classificação FURPS+ | Critério de Verificação |
| :---: | :--- | :--- | :---: | :---: |
| **RNF01** | Proteção de Dados Pessoais dos Atletas | O sistema deve utilizar a aplicação de hash irreversível de senhas via bcrypt para guardar as senhas dos usuários. | Segurança | Tentativas de acesso por utilizadores sem permissão devem retornar bloqueio de acesso com o código 401, verificável nos logs do backend. |
| **RNF02** | Interface Responsiva e Adaptável | A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela. | Usabilidade | Ao redimensionar a janela do navegador ou abrir a aplicação em janelas com larguras de 360px (mobile), 768px (tablet) e 1366px (desktop). O teste é considerado aprovado se nenhum gráfico ficar cortado, sobreposto ou exigir barra de rolagem horizontal na página. |
| **RNF03** | Eficiência no Cadastro de Treinos | O sistema deve possuir fluxos de tela com tempo máximo de preenchimento dos dados inferior ao tempo atual de 4 minutos e meio para o preenchimento dos dados. Como objetivo, o sistema deve garantir que o processo de registro de um novo treino seja concluído pelo treinador em menos de 2 minutos. | Usabilidade | O teste inicia no momento em que o treinador clica no botão para criar um novo treino e termina no momento em que a mensagem de "Treino cadastrado com sucesso" é exibida. O critério será considerado atendido se, para um cenário de complexidade média (cadastrar um treino utilizando atividades previamente cadastradas na biblioteca), o tempo total for estritamente inferior a 2 minutos. |
| **RNF04** | Atualização em Tempo Real do Dashboard | Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino. | Performance | Durante os testes de sistema, o treinador cadastra um novo treino enquanto visualiza o dashboard. O tempo entre a confirmação do salvamento e a completa re-renderização do gráfico com os novos dados deve ser cronometrado. O critério é atendido se o tempo de atualização for estritamente menor ou igual a 5 segundos. |

---

## 8.4 Matriz Síntese de Rastreabilidade

A matriz a seguir mapeia a correlação direta entre os Objetivos Específicos (OEs), as Características de Produto (CPs), os Requisitos Funcionais (RFs), as Regras de Negócio (RNs) e os Requisitos Não Funcionais (RNFs):

| Contribuição principal | Contribuição secundária | CP | RFs relacionados | Regras de Negócio (RNs) | RNFs relacionados |
| :---: | :---: | :---: | :---: | :---: | :---: |
| OE1 | OE4 | CP01 | RF10, RF11, RF12, RF13, RF14, RF15, RF16, RF17, RF18, RF19, RF20, RF21, RF23, RF29, RF32, RF33, RF34 | [RN01](#rn01), [RN02](#rn02), [RN03](#rn03), [RN05](#rn05) | RNF02, RNF03, RNF04 |
| OE2 | OE3 | CP02 | RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF08, RF09 | [RN04](#rn04) | RNF02, RNF03, RNF04 |
| OE3 | OE4 | CP03 | RF22, RF24, RF26, RF30, RF31, RF35, RF36, RF37, RF38, RF39, RF40, RF41 | [RN01](#rn01), [RN02](#rn02), [RN03](#rn03), [RN05](#rn05), [RN06](#rn06), [RN07](#rn07) | RNF02, RNF04 |
| OE4 | OE3 | CP04 | RF25 | [RN02](#rn02), [RN03](#rn03), [RN06](#rn06), [RN07](#rn07) | RNF02, RNF04 |
| OE1 | OE4 | CP05 | RF27, RF28 | - | RNF01, RNF02 |
