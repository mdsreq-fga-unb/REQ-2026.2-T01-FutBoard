# Engenharia de Requisitos

As atividades e técnicas de Engenharia de Requisitos (ER) no **FutBoard** foram organizadas e integradas ao longo das quatro fases do *Rapid Application Development* (RAD) — **Planejamento de Requisitos**, **Design do Usuário**, **Construção** e **Cutover (Transição)**.

Essa organização assegura que as seis atividades fundamentais da ER (**Elicitação e Descoberta**, **Análise e Consenso**, **Declaração de Requisitos**, **Verificação e Validação**, **Representação de Requisitos** e **Organização e Atualização**) não ocorram como etapas isoladas ou cartoriais, mas sim de forma contínua e iterativa. A prototipação visual rápida e a validação constante com o técnico Marcus Vinicius (do Canaã Esporte Clube) constituem o núcleo prático do ciclo de desenvolvimento.

---

## 5.1 Atividades e Técnicas de ER por Fase do RAD

Abaixo estão detalhadas as atividades e técnicas de Engenharia de Requisitos adotadas pela equipe, categorizadas e estruturadas explicitamente pelas quatro fases do processo RAD, conectando cada técnica às evidências reais registradas no projeto.

### 5.1.1 Fase 1: Planejamento de Requisitos

Nesta fase inicial, predominantemente orientada a plano, o objetivo foi delimitar o problema, compreender a fundo o contexto do futebol de base, elicitar as necessidades essenciais da comissão técnica e consolidar a base do produto e o escopo do MVP.

#### Elicitação e Descoberta
- **Entrevista com o Stakeholder:** Entrevistas abertas e semiestruturadas com o treinador Marcus Vinicius para investigar o fluxo de trabalho atual, compreender a rotina dos treinos e levantar as dores de gestão e oportunidades de melhoria.  
  *Evidências registradas:* [Ata da Reunião com o Cliente 1 (24/08/2026)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-1) e [Ata da Reunião com o Cliente 2 (10/09/2026)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-2), ambas com vídeos gravados e tópicos minutados.
- **Análise Documental:** Avaliação minuciosa dos artefatos legados em uso pelo treinador — planilhas de controle de treino no Microsoft Excel e consolidação de dados em painéis do Power BI —, mapeando tipologias de exercícios, cálculos de minutos/porcentagens e a taxonomia esportiva utilizada.  
  *Evidências registradas:* Demonstração ao vivo do cliente registrada na [Reunião 1 (4:14–25:22)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-1) e análise estruturada documentada em [Cenário Atual do Cliente e Negócio](cenario-atual.md).
- **Brainstorming e Alinhamento da Equipe:** Reuniões internas da equipe de desenvolvimento para idealizar hipóteses de solução, alinhar expectativas metodológicas e definir a arquitetura e a stack técnica do FutBoard.  
  *Evidências registradas:* [Atas das Reuniões da Equipe](../atas-reunioes/reunioes-da-equipe.md) e consolidação na seção de [Solução Proposta](solucao-proposta.md).

#### Análise e Consenso
- **Matriz Valor x Esforço e Análise de Custo-Benefício:** Avaliação cruzada do valor de negócio percebido pelo treinador Marcus Vinicius em relação ao esforço técnico de desenvolvimento, classificando os requisitos nos quatro quadrantes operacionais para identificar o que era prioritário e viável.  
  *Evidências registradas:* [Matriz de Valor x Esforço no Backlog do Produto](backlog_do_produto.md#4-matriz-valor-x-esforco-e-quadrantes) e quadro interativo no [Miro](https://miro.com/welcomeonboard/YmN1NWlzM0VXeDkyTkhySndlQ3V3UTlqdmJlVDdDdnF1dmdjREpGVTdkb3RJeVptV20xYzlyTVJzd3hZNFpWdHFsVmNtMDQ5eGZIRm0rYzNCSnNybGhSYmFuVXJ3ZGdQZEkxSDRhZ3hjQ2RNK3A4TTZzNmVtUXdEVElpTjkyNFVyVmtkMG5hNDA3dVlncnBvRVB2ZXBnPT0hdjE=?share_link_id=122393869978).
- **Priorização MoSCoW com Filtro por Frequência de Uso:** Classificação qualitativa das necessidades combinada com o critério de frequência de uso das funcionalidades na rotina do clube (diária, semanal e mensal), permitindo um corte objetivo do escopo.  
  *Evidências registradas:* Priorização realizada com o treinador na [Ata da Reunião 2 (57:53–1:02:52)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-2) e justificativa metodológica em [Justificativa para o MVP](backlog_do_produto.md#104-justificativa-para-o-mvp).

#### Declaração de Requisitos
- **Especificação em Linguagem Natural Estruturada:** Descrição textual padronizada e unívoca dos Objetivos Gerais, Objetivos Específicos (OE1 a OE4), restrições de negócio e Características de Produto (CP01 a CP05).  
  *Evidências registradas:* Seção 2.3 de [Solução Proposta](solucao-proposta.md) e contextualização no [Cenário Atual do Cliente e Negócio](cenario-atual.md).

#### Verificação e Validação
- **Validação do Escopo e do MVP com o Cliente:** Apresentação da proposta de valor e homologação da seleção final de requisitos do MVP junto ao técnico Marcus Vinicius via WhatsApp e reuniões.  
  *Evidências registradas:* [Página de Validação com o Cliente](validacao_cliente.md), [Seção 10.3 de Validação do Backlog e Escopo do MVP](backlog_do_produto.md#103-validacao-do-backlog-e-escopo-do-mvp-com-o-cliente) e o artefato visual [MVPValidado](../assets/MVPValidado.jpg).
- **Revisão em Pares:** Inspeção técnica interna contínua realizada pelos integrantes da equipe para identificar ambiguidades, termos imprecisos ou inconsistências na documentação de visão.  
  *Evidências registradas:* Registros nas [Atas das Reuniões da Equipe](../atas-reunioes/reunioes-da-equipe.md) e critérios de preparação em [DoR e DoD](dor-dod.md).

#### Organização e Atualização
- **Catalogação de Requisitos e Baseline Inicial:** Identificação unívoca, catalogação e versionamento dos requisitos funcionais (RF01 a RF41) e não funcionais (RNF01 a RNF05) em itens rastreáveis.  
  *Evidências registradas:* Tabela completa em [Requisitos de Software](Requisitos-de-Software.md) e controle das demandas em [Issues no GitHub](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-FutBoard/issues).

---

### 5.1.2 Fase 2: Design do Usuário

Na fase de Design do Usuário, a abordagem torna-se essencialmente ágil, iterativa e centrada na experiência do usuário. Os requisitos são refinados em ciclos rápidos com base no feedback visual obtido diretamente com o treinador.

#### Elicitação e Descoberta
- **Encontros Frequentes e Co-criação de Interface:** Encontros remotos via Microsoft Teams e trocas diretas pelo WhatsApp com o treinador Marcus Vinicius para co-criar telas, definir fluxos operacionais e descobrir exceções e regras de negócio de domínio esportivo à medida que a interface toma forma.  
  *Evidências registradas:* [Ata da Reunião com o Cliente 4 (15/10/2026)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-4), [Ata da Reunião com o Cliente 5 (22/10/2026)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-5) e detalhamento em [Interação entre Equipe e Cliente](interacao-equipe-cliente.md).

#### Declaração de Requisitos
- **Histórias de Usuário e Critérios de Aceitação:** Decomposição das necessidades do usuário no formato de histórias ágeis (*Como [treinador / auxiliar], quero [ação], para que [benefício]*), complementadas por critérios de aceitação objetivos e regras para resultados vazios.  
  *Evidências registradas:* Critérios de maturidade estabelecidos no [Definition of Ready (DoR)](dor-dod.md#91-definition-of-ready-dor) e [Regras de Negócio para Consultas com Resultado Vazio](Requisitos-de-Software.md#811-regras-de-negocio-para-consultas-com-resultado-vazio).

#### Representação de Requisitos
- **Prototipação de Média Fidelidade (UI/UX):** Concepção e evolução das telas, formulários e componentes visuais no Figma. No modelo RAD, os protótipos desempenham duplo papel: especificam detalhadamente a interface e atuam como instrumento prático para validação antecipada.  
  *Evidências registradas:* [Protótipo no Figma](https://www.figma.com/) e aprovação do fluxo de telas na [Ata da Reunião 4 (10:50–13:29)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-4).

#### Análise e Consenso
- **Repriorização MoSCoW Dinâmica:** Ajuste ágil e contínuo das prioridades e da granularidade das funcionalidades conforme as reações e direcionamentos do cliente durante as sessões de design (utilizando o escopo como variável de ajuste do RAD).  
  *Evidências registradas:* Ajuste na hierarquia de periodização em árvore registrado na [Reunião 5 com Cliente (4:40–13:49)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-5) e replanejamento no [Cronograma de Entregas (Iterações 6 a 10)](cronogramas-entregas.md).

#### Verificação e Validação
- **Validação de Protótipos com o Cliente:** Homologação iterativa das telas e fluxos de navegação junto ao treinador Marcus Vinicius antes do início da codificação, permitindo identificar precocemente falhas de usabilidade e divergências de conceito.  
  *Evidências registradas:* Evidências de validação em [Validação com o Cliente](validacao_cliente.md) e registros nas [Atas das Reuniões da Equipe 14 e 15](../atas-reunioes/reunioes-da-equipe.md).

#### Organização e Atualização
- **Refinamento Contínuo do Backlog:** Atualização constante das tarefas e manutenção da rastreabilidade bidirecional entre as telas validadas no Figma, as histórias de usuário refinadas e as tarefas de implementação.  
  *Evidências registradas:* Quadro estruturado no [Miro](https://miro.com/welcomeonboard/YmN1NWlzM0VXeDkyTkhySndlQ3V3UTlqdmJlVDdDdnF1dmdjREpGVTdkb3RJeVptV20xYzlyTVJzd3hZNFpWdHFsVmNtMDQ5eGZIRm0rYzNCSnNybGhSYmFuVXJ3ZGdQZEkxSDRhZ3hjQ2RNK3A4TTZzNmVtUXdEVElpTjkyNFVyVmtkMG5hNDA3dVlncnBvRVB2ZXBnPT0hdjE=?share_link_id=122393869978) e repositório no [GitHub](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-FutBoard).

---

### 5.1.3 Fase 3: Construção

Durante a fase de Construção, as funcionalidades especificadas e prototipadas são transformadas em código de software de forma rápida e incremental, associando práticas rigorosas de verificação interna a demonstrações funcionais com o cliente.

#### Representação
- **Evolução dos Protótipos Validados em Incrementos Funcionais:** Conversão dos componentes desenhados e aprovados na fase de design em componentes React com styled/Tailwind no frontend e modelos/APIs no Django REST Framework no backend.  
  *Evidências registradas:* Código-fonte modular nos diretórios `frontend/src/` e `backend/apps/` no repositório, com arquitetura documentada em [Solução Proposta](solucao-proposta.md).

#### Verificação e Validação
- **Verificação Interna (Checklists de Qualidade, Revisão e CI/CD):** Inspeção técnica sistemática conduzida pela equipe por meio de ferramentas automatizadas de linting e formatação (Ruff, ESLint), testes unitários e funcionais, revisão de código por pares via Pull Requests e conferência dos critérios do DoD.  
  *Evidências registradas:* Critérios consolidados no [Definition of Done (DoD)](dor-dod.md#92-definition-of-done-dod) e esteira automatizada no [GitHub Actions (ci.yml)](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-FutBoard/blob/main/.github/workflows/ci.yml).
- **Validação com o Cliente (Demonstrações do Incremento):** Demonstrações periódicas dos incrementos implementados ao técnico Marcus Vinicius, validando na prática se o preenchimento de treinos e os gráficos correspondem ao ritmo exigido no ambiente do clube.  
  *Evidências registradas:* Planejamento de validações práticas no [Cronograma de Entregas (Iterações 6 a 11)](cronogramas-entregas.md) e diretrizes em [Processo de Validação](interacao-equipe-cliente.md#73-processo-de-validacao).

#### Organização e Atualização
- **Gestão Visual e Mitigação de Impedimentos:** Acompanhamento dinâmico do fluxo de desenvolvimento no quadro do GitHub Projects, registrando débitos técnicos, decisões de engenharia e repriorizações com base no retorno das verificações e validações.  
  *Evidências registradas:* Quadro de tarefas e issues no [GitHub Projects](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-FutBoard/issues) e alinhamentos nas [Atas de Reunião da Equipe](../atas-reunioes/reunioes-da-equipe.md).

---

### 5.1.4 Fase 4: Cutover (Transição)

A fase de Cutover conclui o ciclo de entrega do RAD, viabilizando a implantação final do sistema no ambiente operacional do Canaã Esporte Clube, a homologação assistida e a formalização da linha de base de requisitos.

#### Verificação e Validação
- **Homologação Final e Testes de Aceitação em Ambiente Real:** Avaliação assistida do sistema em ambiente de produção pelo treinador Marcus Vinicius e seu auxiliar técnico, atestando a aderência plena da solução às atividades do dia a dia do clube.  
  *Evidências registradas:* Planejamento de homologação em ambiente assistido e aceite do MVP documentado no [Cronograma de Entregas (Iterações 12 e 13)](cronogramas-entregas.md) e objetivos de negócio descritos no [Cenário Atual](cenario-atual.md).

#### Declaração de Requisitos
- **Notas de Versão e Documentação de Apoio ao Usuário:** Elaboração de documentação técnica de entrega (*release notes*) e manual prático para apoiar o treinador e a comissão técnica na operação regular do FutBoard.  
  *Evidências registradas:* Manuais e documentação unificada publicados no [GitPages do FutBoard](https://mdsreq-fga-unb.github.io/REQ-2026.2-T01-FutBoard/) e vocabulário controlado no [Catálogo de Termos](../catalogos-termos/catalogos-termos.md).

#### Organização e Atualização
- **Fechamento da Linha de Base (Baseline de Requisitos):** Formalização do conjunto de requisitos funcionais e não funcionais concluídos no MVP, arquivando demandas excedentes no backlog para ciclos e versões futuras do produto.  
  *Evidências registradas:* [Entregas da Unidade](../entregas-unidade/entregas-unidade.md), síntese em [Lições Aprendidas](../licoes-aprendidas.md) e controle de escopo versionado no repositório.

---

## 5.2 Matriz Executiva de Engenharia de Requisitos com Evidências

A tabela a seguir consolida o mapeamento executivo entre cada fase do processo RAD, as atividades e técnicas de Engenharia de Requisitos aplicadas, os resultados gerados e os links diretos para as evidências documentadas no repositório e no site do projeto:

| Fase do Processo (RAD) | Atividade de ER | Técnica Aplicada | Resultado Concreto | Evidência / Artefato Gerado |
| :--- | :--- | :--- | :--- | :--- |
| **Planejamento de Requisitos** | Elicitação e Descoberta | Entrevista com o Stakeholder e Análise Documental | Rotina do técnico, fluxo legado (Excel/Power BI) e dores de negócio levantadas | [Ata Reunião 1 (24/08)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-1), [Ata Reunião 2 (10/09)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-2) e [Cenário Atual](cenario-atual.md) |
| **Planejamento de Requisitos** | Análise e Consenso | Matriz Valor x Esforço e Priorização MoSCoW | Escopo do MVP delimitado e funcionalidades essenciais priorizadas | [Matriz de Valor x Esforço](backlog_do_produto.md#4-matriz-valor-x-esforco-e-quadrantes) e [Quadro Interativo no Miro](https://miro.com/welcomeonboard/YmN1NWlzM0VXeDkyTkhySndlQ3V3UTlqdmJlVDdDdnF1dmdjREpGVTdkb3RJeVptV20xYzlyTVJzd3hZNFpWdHFsVmNtMDQ5eGZIRm0rYzNCSnNybGhSYmFuVXJ3ZGdQZEkxSDRhZ3hjQ2RNK3A4TTZzNmVtUXdEVElpTjkyNFVyVmtkMG5hNDA3dVlncnBvRVB2ZXBnPT0hdjE=?share_link_id=122393869978) |
| **Planejamento de Requisitos** | Declaração de Requisitos | Especificação em Linguagem Natural Estruturada | OEs (1 a 4), CPs (1 a 5) e visão de produto formalizados | [Solução Proposta](solucao-proposta.md) e [Intervenção Social](intervencao-social.md) |
| **Planejamento de Requisitos** | Verificação e Validação | Validação do Escopo com Cliente e Revisão em Pares | Escopo de alto nível e MVP validados com o treinador; Documento de Visão revisado | [Validação com o Cliente](validacao_cliente.md), [Validação do MVP via WhatsApp](backlog_do_produto.md#103-validacao-do-backlog-e-escopo-do-mvp-com-o-cliente) e [DoR e DoD](dor-dod.md) |
| **Planejamento de Requisitos** | Organização e Atualização | Catalogação e Rastreabilidade de Requisitos | Escopo inicial versionado em 41 RFs e 5 RNFs rastreáveis | [Requisitos de Software](Requisitos-de-Software.md) e [Issues no GitHub](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-FutBoard/issues) |
| **Design do Usuário** | Elicitação e Descoberta | Sessões de Co-criação e Entrevistas de Interface | Telas co-criadas e regras de negócio descobertas conforme o layout toma forma | [Ata Reunião 4 (15/10)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-4), [Ata Reunião 5 (22/10)](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-5) e [Interação com o Cliente](interacao-equipe-cliente.md) |
| **Design do Usuário** | Declaração de Requisitos | Histórias de Usuário e Critérios de Aceitação | Comportamento declarado sob a ótica do usuário e regras para consultas vazias | [Critérios do DoR](dor-dod.md#91-definition-of-ready-dor) e [Regras de Resultado Vazio](Requisitos-de-Software.md#811-regras-de-negocio-para-consultas-com-resultado-vazio) |
| **Design do Usuário** | Representação de Requisitos | Prototipação de Média Fidelidade (UI/UX) | Telas, fluxos e componentes interativos modelados para validação prévia | [Protótipo no Figma](https://www.figma.com/) e [Ata Reunião 4](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-4) |
| **Design do Usuário** | Análise e Consenso | Repriorização MoSCoW Dinâmica | Ajustes de escopo e granularidade orientados pelo feedback visual do cliente | [Ata Reunião 5](../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-5) e [Cronograma de Entregas](cronogramas-entregas.md) |
| **Design do Usuário** | Verificação e Validação | Validação Visual dos Protótipos com o Cliente | Interfaces homologadas pelo treinador antes do início da codificação | [Validação com o Cliente](validacao_cliente.md) e [Atas da Equipe 14 e 15](../atas-reunioes/reunioes-da-equipe.md) |
| **Design do Usuário** | Organização e Atualização | Refinamento Contínuo do Backlog | Rastreabilidade mantida entre protótipos, histórias de usuário e tarefas | [Quadro no Miro](https://miro.com/welcomeonboard/YmN1NWlzM0VXeDkyTkhySndlQ3V3UTlqdmJlVDdDdnF1dmdjREpGVTdkb3RJeVptV20xYzlyTVJzd3hZNFpWdHFsVmNtMDQ5eGZIRm0rYzNCSnNybGhSYmFuVXJ3ZGdQZEkxSDRhZ3hjQ2RNK3A4TTZzNmVtUXdEVElpTjkyNFVyVmtkMG5hNDA3dVlncnBvRVB2ZXBnPT0hdjE=?share_link_id=122393869978) e [Backlog do Produto](backlog_do_produto.md) |
| **Construção** | Representação | Evolução dos Protótipos em Código Funcional | Interfaces React e endpoints Django REST implementados a partir dos protótipos | [Repositório GitHub (Código-Fonte)](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-FutBoard) e [Solução Proposta](solucao-proposta.md) |
| **Construção** | Verificação e Validação | Verificação Interna (Checklists, Testes e CI/CD) | Qualidade de código verificada por linters, testes e revisão via Pull Requests | [Definition of Done (DoD)](dor-dod.md#92-definition-of-done-dod) e [GitHub Actions CI](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-FutBoard/blob/main/.github/workflows/ci.yml) |
| **Construção** | Verificação e Validação | Validação do Incremento com o Cliente | Demonstrações funcionais com o treinador frente à rotina real de treinos | [Cronograma de Entregas (Iterações 6 a 11)](cronogramas-entregas.md) e [Processo de Validação](interacao-equipe-cliente.md#73-processo-de-validacao) |
| **Construção** | Organização e Atualização | Gestão Visual do Backlog e Resolução de Issues | Fluxo ágil no GitHub Projects com controle de débitos técnicos | [Quadro de Tarefas / Issues](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-FutBoard/issues) |
| **Cutover** | Verificação e Validação | Homologação Assistida e Testes de Aceitação | Sistema em produção adotado pelo treinador e auxiliar no Canaã Esporte Clube | [Cronograma de Cutover (Iterações 12 e 13)](cronogramas-entregas.md) e [Cenário Atual](cenario-atual.md) |
| **Cutover** | Declaração de Requisitos | Notas de Versão e Documentação de Apoio | Manuais do usuário e notas de versão publicados para uso operacional | [GitPages do FutBoard](https://mdsreq-fga-unb.github.io/REQ-2026.2-T01-FutBoard/) e [Catálogo de Termos](../catalogos-termos/catalogos-termos.md) |
| **Cutover** | Organização e Atualização | Fechamento da Linha de Base (Baseline) | Linha de base do MVP formalizada e demandas futuras registradas no backlog | [Entregas da Unidade](../entregas-unidade/entregas-unidade.md) e [Lições Aprendidas](../licoes-aprendidas.md) |
