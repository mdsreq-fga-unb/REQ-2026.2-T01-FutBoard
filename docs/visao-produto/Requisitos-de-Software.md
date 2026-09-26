# Requisitos Funcionais

## 8.1 Requisitos Funcionais — RFs

Os requisitos funcionais abaixo descrevem as capacidades que o sistema deve oferecer ao treinador, elicitadas a partir das reuniões de levantamento de requisitos com o cliente (Marcus Vinícius) e organizadas segundo as Características do Produto (CPs) definidas pela equipe:

- **CP01** — Registro Categorizado dos Treinos
- **CP02** — Estruturador de Periodização Esportiva
- **CP03** — Dashboard Analítico
- **CP04** — Geração Automática de Relatórios
- **CP05** — Controle de Perfis de Acesso

Além dos requisitos rastreados diretamente a uma CP, alguns requisitos identificados durante a elicitação não decorrem de nenhuma característica de produto planejada previamente — eles surgiram de **efeitos emergentes** identificados na primeira entrega.Esses requisitos são identificados pelo código **EE01** na coluna de rastreabilidade, ao invés de um código de CP.

| Identificador | Descrição | CP/EE de origem |
| :--- | :--- | :---: |
| **RF01** | **Cadastrar macrociclo:** o sistema deve permitir o cadastro de um novo macrociclo (período mais amplo do planejamento, ex: a temporada 2026) para organizar a periodização dos treinos. | CP02 |
| **RF02** | **Editar macrociclo:** o sistema deve permitir a edição dos dados de um macrociclo já cadastrado. | CP02 |
| **RF03** | **Excluir macrociclo:** o sistema deve permitir a exclusão de um macrociclo cadastrado, removendo-o da estrutura de periodização. | CP02 |
| **RF04** | **Cadastrar Mesociclo:** o sistema deve permitir o cadastro de um novo mesociclo vinculado a um macrociclo existente, incluindo a possibilidade de iniciar um novo mesociclo diretamente durante o cadastro de uma sessão de treino. | CP02 |
| **RF05** | **Editar Mesociclo:** o sistema deve permitir a edição dos dados de um mesociclo já cadastrado. | CP02 |
| **RF06** | **Excluir Mesociclo:** o sistema deve permitir a exclusão de um mesociclo cadastrado. | CP02 |
| **RF07** | **Cadastrar Microciclo:** o sistema deve permitir o cadastro de um novo microciclo (correspondente a uma semana de treino) vinculado a um mesociclo existente. | CP02 |
| **RF08** | **Editar Microciclo:** o sistema deve permitir a edição dos dados de um microciclo já cadastrado. | CP02 |
| **RF09** | **Excluir Microciclo:** o sistema deve permitir a exclusão de um microciclo cadastrado. | CP02 |
| **RF10** | **Cadastrar comportamento:** o sistema deve permitir que o treinador cadastre comportamentos táticos (ex.: comportamento ofensivo, defensivo), a serem associados posteriormente a uma atividade dentro de uma sessão de treino. | CP01 |
| **RF11** | **Editar comportamento:** o sistema deve permitir que o treinador edite um comportamento tático já cadastrado, sem alterar os dados fixos da atividade à qual ele está associado. | CP01 |
| **RF12** | **Excluir comportamento:** o ssistema deve permitir que o treinador exclua um comportamento tático cadastrado. | CP01 |
| **RF13** | **Cadastrar Atividade:** o istema deve permitir que o treinador cadastre uma nova atividade (exercício), informando seus dados fixos e invariáveis — tipologia e tipo de SSP —, que não se alteram entre diferentes repetições da mesma atividade. | CP01 |
| **RF14** | **Editar Atividade:** o sistema deve permitir que o treinador edite os dados de uma atividade já cadastrada. | CP01 |
| **RF15** | **Excluir Atividade:** o sistema deve permitir que o treinador exclua uma atividade cadastrada. | CP01 |
| **RF16** | **Cadastrar Sessão:** o sistema deve permitir que o treinador cadastre uma nova sessão de treino vinculada à periodização (macrociclo, mesociclo e microciclo), contendo a data e o número sequencial da sessão. | CP01 |
| **RF17** | **Editar Sessão:** o sistema deve permitir a edição dos dados de uma sessão de treino já cadastrada. | CP01 |
| **RF18** | **Excluir Sessão:** o sistema deve permitir a exclusão de uma sessão de treino cadastrada. | CP01 |
| **RF19** | **Cadastrar atividade na biblioteca:** o sistema deve permitir o cadastro de uma atividade diretamente na biblioteca de treinos, independentemente do cadastro de uma sessão específica, para que ela fique disponível para reutilização futura. | CP01 |
| **RF20** | **Editar atividade na biblioteca:** o sistema deve permitir a edição de uma atividade cadastrada na biblioteca de treinos. | CP01 |
| **RF21** | **Excluir atividade na biblioteca:** o sistema deve permitir a exclusão de uma atividade cadastrada na biblioteca de treinos. | CP01 |
| **RF22** | **Exibir painel de indicadores na tela inicial:** o sistema deve exibir, na tela inicial, um painel com os principais indicadores — número de sessões, minutos totais de treino, variabilidade de exercícios e número de execuções — para consulta rápida ao entrar na aplicação. | CP03 |
| **RF23** | **Exibir dashboard com gráficos:** o sistema deve exibir os gráficos de análise (tipologia de atividade, atividades mais repetidas, entre outros) concentrados na menor quantidade possível de telas, evitando a necessidade de trocar de página constantemente para consultar diferentes informações. | CP03 |
| **RF24** | **Reutilizar atividades cadastradas:** o sistema deve permitir buscar e selecionar uma atividade já cadastrada na biblioteca ao montar uma sessão de treino, preenchendo automaticamente as informações inerentes a ela. | CP03 |
| **RF25** | **Incluir atividades cadastradas nas análises:** o sistema deve permitir, ao incluir uma atividade da biblioteca em uma sessão específica, ajustar campos variáveis (como o comportamento tático associado) sem alterar o cadastro-base da atividade na biblioteca. | CP03 |
| **RF26** | **Filtrar informações dos gráficos:** o sistema deve permitir a aplicação de um filtro único de macrociclo, mesociclo, microciclo e sessão, refletindo automaticamente em todos os gráficos exibidos. | CP03 |
| **RF27** | **Gerar relatórios comparativos, entre diferentes periodizações esportivas:** o sistema deve permitir a geração de relatórios que comparem indicadores entre diferentes períodos (ex: microciclos, mesociclos ou macrociclos distintos). | CP04 |
| **RF28** | **Interagir com os dados dos gráficos:** o sistema deve permitir alternar a visualização dos gráficos entre tempo bruto (em minutos) e tempo relativo (em porcentagem), para todos os gráficos da análise. | CP03 |
| **RF29** | **Criar conta:** o sistema deve permitir a criação de uma conta de acesso à aplicação. | CP05 |
| **RF30** | **Fazer login:** o sistema deve permitir que o usuário se autentique na aplicação a partir de um login e senha geral de acesso. | CP05 |
| **RF31** | **Anexar imagens dos tipos de treino:** o sistema deve permitir anexar uma imagem (diagrama) representando visualmente um exercício cadastrado, exibida junto à atividade correspondente. | CP01 |
| **RF32** | **Anexar pontuações de cada exercício:** o sistema deve permitir registrar a pontuação planejada e/ou obtida em cada exercício, de modo a gerar comparativos de desempenho (ex: entre equipes) ao longo das repetições da atividade. | CP03 |
| **RF33** | **Analisar os dados quantitativos dos atletas:** o sistema deve permitir o registro e a análise de dados quantitativos de desempenho dos atletas (ex: scout de jogo), a fim de enriquecer a análise tática do treinador. | CP03 |
| **RF34** | **Integração com IA's para análise pontuais dos dados cadastrados:** o sistema deve permitir a geração automática de análises textuais curtas (insights) sobre os gráficos e dados cadastrados, utilizando inteligência artificial. | CP03 |
| **RF35** | **Cadastrar Momento do Jogo:** o sistema deve permitir associar a uma atividade, de forma opcional, o momento de jogo trabalhado (ex: ataque, defesa, transição). Esse campo só é preenchido quando a atividade tiver um foco específico nesse critério — atividades que contemplam todos os momentos de jogo, sem um foco definido, podem ficar sem essa associação. | CP01 |
| **RF36** | **Editar Momento do Jogo:** o sistema deve permitir a edição de um momento de jogo já associado a uma atividade. | CP01 |
| **RF37** | **Deletar Momento do Jogo:** o sistema deve permitir a remoção de um momento de jogo associado a uma atividade. | CP01 |
| **RF38** | **Cadastrar Fase do Jogo:** o sistema deve permitir associar a uma atividade, de forma opcional, a fase de jogo trabalhada (ex: primeira construção, segunda construção). Esse campo é utilizado especificamente em atividades do tipo jogos setoriais, não se aplicando a todas as atividades. | CP01 |
| **RF39** | **Editar Fase do Jogo:** o sistema deve permitir a edição de uma fase de jogo já associada a uma atividade. | CP01 |
| **RF40** | **Deletar Fase do Jogo:** o sistema deve permitir a remoção de uma fase de jogo associada a uma atividade. | CP01 |
| **RF41** | **Cadastrar Atributo Técnico:** o sistema deve permitir associar a uma atividade, de forma opcional, o atributo ou fundamento técnico trabalhado (ex: domínio orientado, cabeceira defensiva). Esse campo é utilizado em atividades de cunho técnico, que podem não ter nenhum comportamento tático associado. | CP01 |
| **RF42** | **Editar Atributo Técnico:** o sistema deve permitir a edição de um atributo técnico já associado a uma atividade. | CP01 |
| **RF43** | **Deletar Atributo Técnico:** o sistema deve permitir a remoção de um atributo técnico associado a uma atividade. | CP01 |
| **RF44** | **Apresentar contexto dos indicadores:** o sistema deve exibir, junto aos gráficos e indicadores do dashboard, informações de contexto (ex: período de referência e filtros aplicados) que auxiliem o treinador a interpretar corretamente os dados exibidos. | EE01 |
| **RF45** | **Apresentar limitações dos indicadores:** o sistema deve sinalizar ao treinador eventuais limitações dos dados exibidos (ex: indicadores calculados com base em amostra parcial ou período incompleto), para evitar interpretações equivocadas. | EE01 |
| **RF46** | **Calcular percentual dos gráficos com base no tempo total da sessão:** o sistema deve calcular a porcentagem de tempo exibida nos gráficos de Momento do Jogo, Comportamento e Atributo Técnico com base no tempo total da sessão de treino, e não apenas no tempo destinado àquela categoria específica, evitando distorções no percentual apresentado ao treinador. | CP03 |


## 8.2 Requisitos Não Funcionais - RNFs

Lista de requisitos não funcionais, contendo: Numeração do Requisito; Nome; Descrição; Classificação URPS+; Critério de Verificação.

| ID | Nome | Descrição | Classificação URPS+ | Critério de Verificação |
| :---: | :--- | :--- | :---: | :---: |
| **RNF01** | Proteção de Dados Pessoais dos Atletas | O sistema deve garantir a segurança e a integridade das informações pessoais dos atletas registrados, protegendo-os contra acesso ou alteração não autorizados. | Segurança | Tentativas de acesso por utilizadores sem permissão devem retornar exceção e o sistema não deve expor qualquer dado pessoal. |
| **RNF02** | Interface Responsiva e Adaptável | A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela. | Usabilidade | Ao redimensionar a janela do navegador para resoluções padrão de mercado. A verificação é bem-sucedida se nenhum gráfico ficar cortado, sobreposto ou exigir deslocamento (scroll) horizontal para ser compreendido na sua totalidade. |
| **RNF03** | Eficiência no Cadastro de Treinos | O sistema deve possuir fluxos de tela otimizados para garantir que o processo de registro de um novo treino seja concluído pelo treinador em menos de 2 minutos. | Usabilidade | O teste inicia no momento em que o treinador clica no botão para criar um novo treino e termina no momento em que a mensagem de "Treino cadastrado com sucesso" é exibida. O critério será considerado atendido se, para um cenário de complexidade média (cadastrar um treino utilizando atividades previamente cadastradas na biblioteca), o tempo total for estritamente inferior a 2 minutos. |
| **RNF04** | Atualização em Tempo Real do Dashboard | Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino. | Performance | Durante os testes de sistema, o técnico cadastra um novo treino enquanto visualiza o dashboard. O tempo entre a confirmação do salvamento e a completa re-renderização do gráfico com os novos dados deve ser cronometrado. O critério é atendido se o tempo de atualização for estritamente menor ou igual a 5 segundos.