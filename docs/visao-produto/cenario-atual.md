#Cenário Atual do Cliente e do Negócio

##1.1 Identificação do Cliente/Parceiro
- Nome: Marcus Vinicius Rodrigues 
- Tipo:  Clube esportivo (categoria de base — futebol) - Canaã Esporte Clube 
- Representante: Marcus Vinicius Rodrigues
- Forma de contato: Contato rápido por  WhatsApp, reuniões periódicas feitas pelo Teams.
- Vínculo com o projeto: Cliente direto, principal contato, responsável por informar os requisitos do produto, autorizar e validar as entregas.

##1.2 Introdução ao Negócio e Contexto

O Canaã Esporte Clube atua na formação de atletas de futebol, com foco na categoria de base Sub-17. O público-alvo direto da aplicação é o técnico responsável por planejar, executar e avaliar e gerenciar os treinamentos ao longo da temporada esportiva composta por cerca de 34 atletas e com treinos diários, com horários e durações variadas. 

Atualmente, o técnico representado pelo cliente Marcus Vinicius Rodrigues registra seus treinos em planilhas do Excel de forma manual, densa e pouco intuitiva, coletando dados no campo e digitando-os um a um após as sessões. Após o preenchimento, ele utiliza filtros que relacionam as tabelas para alimentar dashboards estáticos no PowerBI usados na análise de cada treino. Todo esse processo gera uma sobrecarga no cadastramento dos dados devido ao calendário apertado do clube e à demanda por resultados, já que esse volume de inserção diária consome horas do seu tempo extracampo. 

##1.3 Rich Picture
<figure>
  <img src="../../assets/RichPicture.jpg" alt="Rich Picture do FutBoard" width="70%">
  <figcaption>Figura 1: Rich Picture do sistema FutBoard</figcaption>
</figure>
##1.4 Identificação da Oportunidade ou Problema

O projeto surge da necessidade de solucionar a dificuldade do controle dos planejamentos dos treinamentos da equipe. Esse problema é potencializado por um ambiente esportivo desafiador, marcado por um calendário estrito e por uma constante demanda por resultados. Atualmente o acompanhamento da equipe é realizado por meio de planilhas fragmentadas e dashboards estáticos. Esse registro manual dos treinos junto à falta de padronização e a ausência de um método de análise bem definido causam sobrecarga do técnico, que esbarra na falta de tempo para análise e registro dos treinos. Com falta de métricas para as análises e a dificuldade de visualização global dos treinamentos dificultam a avaliação da efetividade e da distribuição das cargas de treino ao longo da temporada, prejudicando decisões técnicas que deveriam ser fundamentadas em dados. O nosso projeto atua como uma ferramenta estruturada para mitigar essas dores operacionais do cliente.

<figure>
  <img src="../../assets/DiagramaIshikawa.png" alt="Diagrama de Ishikawa" width="75%">
  <figcaption>Figura 2: Diagrama de Ishikawa</figcaption>
</figure>

##1.5 Desafios do Projeto
- Estruturar os conceitos de periodização esportiva (macrociclos, mesociclos, microciclos).
- Processar automaticamente os dados registrados em relatórios estatísticos e gráficos interativos
- Garantir usabilidade para um usuário não necessariamente técnico em tecnologia (o treinador)
- Desafio técnicos acerca das tecnologias que o time de desenvolvimento utilizará para criar as análises e gráficos.
- Conduzir a transição operacional do uso das planilhas manuais para a inserção direta no novo sistema. A importação automatizada de dados históricos das planilhas foi formalmente **retirada do compromisso do MVP** (postergada para etapas pós-MVP), adotando-se o modelo de "marco zero": as novas sessões passam a ser cadastradas diretamente no FutBoard a partir da nova periodização, enquanto as planilhas legadas de Excel permanecem arquivadas como fonte de consulta histórica sob responsabilidade do treinador.
- Assegurar conformidade com a LGPD através do princípio de minimização de dados (*Privacy by Design*), delimitando que a aplicação trata exclusivamente métricas e dados operacionais coletivos dos treinos, sem coletar, processar ou armazenar quaisquer dados pessoais identificáveis ou prontuários individuais dos atletas menores de idade.

##1.6 Mapa de Stakeholders

**1. Marcus Vinicius Rodrigues(Técnico do sub-17 e Cliente Direto):** É o representante do Canaã Esporte Clube, atuando como técnico da equipe Sub-17 e principal contato do projeto.

- **Relação:** É o público-alvo direto e usuário principal, será quem vai utilizar da aplicação diariamente para registrar, analisar, planejar, executar e avaliar os treinamentos esportivos.

- **Interesse e Expectativa:** Tem o interesse de solucionar a sobrecarga causada pelo registro manual fragmentado em planilhas e pela lentidão dos dashboards estáticos.  Espera obter um sistema com dashboards em tempo real, geração automatizada de relatórios, onde consiga obter o controle do planejamento de seus treinamentos estruturado cientificamente na periodização esportiva (macro, meso e microciclos). Possui uma familiaridade mediana com o uso de soluções digitais.

- **Nível de Influência:** Figura principal, é o grande decisor do projeto. Ele autoriza e valida as entregas.

 **2. Auxilar técnico:** O profissional que auxilia o técnico em seus treinos.

- **Relação:** Público secundário da aplicação, usuário direto. Ele poderá visualizar e cadastrar dados de treino.

- **Interesse e Expectativa:** Têm interesse em realizar análises estatísticas por meio de relatórios e gráficos interativos.  

- **Nível de Influência:** Participa do uso da aplicação, mas não participa das validações.

**3. Jogadores (Atletas do sub-17):** Os jovens atletas em formação no clube pertencem à faixa etária de 16 a 17 anos.

- **Relação:** Participantes das sessões práticas de treinamento. O sistema não realiza cadastro individual, nominal ou biométrico dos atletas, registrando apenas a quantidade de participantes e os dados coletivos das atividades.

- **Interesses e Expectativas:** Não interagem diretamente com o sistema. Beneficiam-se indiretamente da organização metodológica das cargas e conteúdos de treino planejados pela comissão técnica.

- **Nível de Influência:** Baixa influência direta sobre o software. No entanto, são o grupo impactado pelas decisões técnicas e pela dosagem das cargas de treinamento coletivo planejadas pela comissão.

**4. Preparador físico:** O profissional responsável pelo condicionamento físico, prevenção de lesões e reabilitação dos atletas.

- **Relação:** Público terciário da aplicação, usuário indireto. Não terá acesso à plataforma, consumindo as informações unicamente por meio de relatórios físicos ou digitais exportados pelo técnico ou seu auxiliar.

- **Interesse e Expectativa:** Têm interesse em receber relatórios gerados pela aplicação que mostrem dados de treinos realizados, minutagem e estatísticas de para otimizar o planejamento físico da equipe.

- **Nível de Influência:** Não participa do uso direto da aplicação nem das validações de software, mas os dados gerados pelo sistema podem vir a influenciar diretamente/indiretamente o seu planejamento de treinos diário.

**5. Preparador de goleiros:** O profissional focado no treinamento específico, técnica e fundamentos dos goleiros do time.

- **Relação:** Público terciário da aplicação, usuário indireto. Sem acesso ao sistema, ele recebe os dados filtrados e repassados, por meio de relatórios pelo técnico principal ou seu auxiliar.

- **Interesse e Expectativa:** Têm interesse em análises estatísticas específicas de desempenho dos treinos defensivos extraídas dos relatórios para direcionar correções e ajustes nas cargas de treino do setor defensivo da equipe.

- **Nível de Influência:** Não utiliza a aplicação e não valida o sistema. Sua particiapação se limita ao consumo passivo das métricas geradas para a tomada de decisão em campo.

**6. Diretor do clube:** O gestor responsável pelo planejamento estratégico, contratações e avaliação geral do departamento de futebol.

- **Relação:** Stakeholder e público terciário da aplicação, usuário indireto. Não opera o sistema, sendo impactado apenas pelas apresentações de resultados e relatórios fornecidos pelo técnico.

- **Interesse e Expectativa:** Têm interesse em relatórios consolidados e gráficos de alto nível (visão macro) que demonstrem a evolução da equipe, a distribuição das cargas de trabalho na categoria e a eficácia metodológica do trabalho da comissão técnica ao longo da temporada.

- **Nível de Influência:** Não acessa a aplicação e não atua em suas validações da aplicação, porém pode ter suas decisões influênciadas diretamente/indiretamente com base nos relatórios gerados por ela.

<figure>
  <img src="../../assets/MapaStakeHolders.png" alt="Mapa dos Stakeholders" width="90%">
  <figcaption>Figura 3: Mapa dos Stakeholders</figcaption>
</figure>

##1.7 Segmentação de Clientes

**Técnico / Auxiliar técnico:** Independente da faixa etária, este grupo é composto pelo técnico e seu auxiliar técnico, que se interessam por fazer análises dos treinos por meio de dashboards, gráficos e relatórios. 

**Técnico:** O nível de familiaridade tecnológica é intermediário. Com base na utilização de planilhas no Excel e uso do PowerBi.

**Auxiliar técnico:** Possui uma familiaridade tecnológica intermediária em comparação ao técnico, visto que também utiliza as planilhas no Excel.



