# Engenharia de Requisitos

As atividades e técnicas de Engenharia de Requisitos (ER) no FutBoard foram organizadas ao longo das quatro fases do *Rapid Application Development* (RAD) — **Planejamento de Requisitos**, **Design do Usuário**, **Construção** e **Cutover**. Essa estruturação assegura que as seis atividades fundamentais da ER (**Elicitação e Descoberta**, **Análise e Consenso**, **Declaração**, **Verificação e Validação**, **Representação de Requisitos** e **Organização e Atualização**) estejam presentes de forma contínua e iterativa, tendo a prototipação rápida e a validação constante junto ao técnico Marcus Vinicius como núcleo do processo.

---

## 5.1 Atividades e Técnicas de ER

Abaixo estão detalhadas as atividades e técnicas de Engenharia de Requisitos adotadas pela equipe, categorizadas pelas quatro fases do processo RAD.

---




#### Elicitação e Descoberta
- **Entrevista com o Stakeholder:** Entrevista aberta e semiestruturada com o técnico Marcus Vinicius para compreender o funcionamento do negócio, a rotina dos treinos e levantar as dores e oportunidades de melhoria.
- **Brainstorming:** Reuniões internas com a equipe de desenvolvimento para idealizar hipóteses de solução, alinhar expectativas e nortear a metodologia e as tecnologias da aplicação.
- **Análise Documental:** Avaliação minuciosa dos artefatos em uso pelo técnico (planilhas de controle de treino no Microsoft Excel e consolidação de dados em painéis do Power BI).



#### Análise e Consenso
- **Matriz Valor x Esforço e Análise de Custo-Benefício:** Avaliação conjunta do valor de negócio gerado para o técnico Marcus Vinicius em relação ao esforço técnico de implementação, identificando as funcionalidades mais valiosas e viáveis.
- **Priorização MoSCoW:** Técnica de priorização qualitativa aplicada em conjunto com a Matriz Valor x Esforço para classificar as necessidades em *Must have*, *Should have*, *Could have* e *Won't have*, delimitando o escopo inicial do MVP.

#### Declaração de Requisitos
- **Especificação em Linguagem Natural Estruturada:** Descrição textual e padronizada dos Objetivos Específicos, restrições de negócio, requisitos macro e características gerais do produto FutBoard, consolidando o Documento de Visão como artefato da declaração.

#### Verificação e Validação
- **Validação do Escopo com o Cliente:** Apresentação e leitura guiada dos objetivos e do escopo de alto nível junto ao técnico Marcus Vinicius para confirmação de alinhamento antes do avanço para a fase de design.
- **Revisão em Pares:** Inspeção documental interna realizada pela equipe para identificar ambiguidades, redundâncias ou inconsistências no Documento de Visão.

#### Organização e Atualização
- **Catalogação de Requisitos:** Identificação, registro e estruturação do escopo inicial em itens rastreáveis com apoio da ferramenta GitHub Projects, consolidando a lista inicial de requisitos da equipe.

---



#### Elicitação e Descoberta
- **Entrevista com o Stakeholder:** Encontros frequentes (via Teams e WhatsApp) com o técnico Marcus Vinicius para co-criar telas, definir fluxos operacionais e descobrir exceções e regras de negócio à medida que a interface toma forma.

#### Declaração de Requisitos
- **Histórias de Usuário com Especificação por Cenários:** Declaração do comportamento do sistema através de histórias de usuário decompostas sob a ótica do usuário, tendo como resultado da declaração critérios de aceitação objetivos e verificáveis no formato *Dado/Quando/Então*.

#### Representação de Requisitos
- **Prototipação de Média Fidelidade:** Concepção e evolução das telas e componentes interativos com apoio da ferramenta Figma, fornecendo representações visuais ricas que auxiliam na especificação detalhada da interface e da experiência do usuário.

#### Análise e Consenso
- **Repriorização MoSCoW:** Ajuste dinâmico das prioridades do escopo conforme o feedback visual do cliente nas sessões de design, aproveitando a flexibilidade do RAD onde o escopo atua como variável de ajuste.

#### Verificação e Validação
- **Validação dos Protótipos com o Cliente:** Homologação visual iterativa com o treinador. No RAD, os protótipos validados servem simultaneamente como especificação e instrumento formal de validação de requisitos.

#### Organização e Atualização
- **Refinamento Contínuo do Backlog:** Atualização constante do backlog e das tarefas com apoio da ferramenta GitHub Projects, mantendo a rastreabilidade entre as telas validadas no Figma e os requisitos a serem construídos.

---




#### Representação
- **Evolução dos Protótipos Validados:** Os protótipos e especificações aprovados na fase de design evoluem em código e incrementos funcionais até se consolidarem no sistema final.

#### Verificação e Validação
- **Verificação Interna (Checklists e Testes):** Inspeção técnica conduzida pela equipe de desenvolvimento através de checklists de qualidade de código, revisão por pares e tecnicas de verificação do software frente aos critérios de aceitação declarados.
- **Validação com o Cliente (Demonstração do Incremento):** Demonstrações periódicas dos incrementos funcionais para o técnico Marcus Vinicius, validando na prática se o comportamento da aplicação atende à rotina real de treinos.

#### Organização e Atualização
- **Gestão Visual do Backlog:** Acompanhamento dinâmico do fluxo de desenvolvimento no quadro da ferramenta GitHub Projects, mitigando impedimentos técnicos e repriorizando atividades com base no feedback das validações.

---





#### Verificação e Validação
- **Prática de Validação com o Cliente e Testes de Aceitação:** Utilização do sistema em ambiente real de produção pelo técnico Marcus Vinicius no Canaã Esporte Clube, atestando a aderência plena da solução às atividades do técnico e seu auxiliar técnico.

#### Declaração de Requisitos
- **Notas de Versão e Documento de apoio ao uso:** Elaboração de documentação técnica de entrega (*release notes*) e guia prático do usuário para apoiar o treinador e a comissão na operação do FutBoard.

#### Organização e Atualização
- **Fechamento da Linha de Base:** Fechamento e consolidação do escopo final implementado na ferramenta GitHub Projects, formalizando a linha de base de requisitos entregue e registrando demandas futuras para novas versões do produto.



## 5.2 Mapeamento ER x Processo

O quadro a seguir relaciona cada fase do processo RAD adotado (Planejamento de Requisitos, Design do Usuário, Construção e Cutover) à atividade de Engenharia de Requisitos correspondente, à técnica aplicada e ao resultado esperado, em coerência com o detalhamento do item 5.1. O mapeamento diferencia explicitamente a **verificação interna** (feita pela equipe contra os critérios de aceitação) da **validação com o cliente** (homologação de protótipos e incrementos junto ao técnico Marcus Vinicius).

| Fase do Processo (RAD) | Atividade de ER | Técnica | Resultado Esperado |
|---|---|---|---|
| Planejamento de Requisitos | Elicitação e Descoberta | Entrevista com o stakeholder, Brainstorming e Análise Documental | Negócio, rotina do técnico e fluxo atual (Excel/Power BI) compreendidos; dores e oportunidades levantadas |
| Planejamento de Requisitos | Análise e Consenso | Matriz Valor x Esforço, Análise de Custo-Benefício e Priorização MoSCoW | Escopo inicial do MVP delimitado e funcionalidades de maior valor priorizadas |
| Planejamento de Requisitos | Declaração de Requisitos | Especificação em Linguagem Natural | OEs, restrições e requisitos macro formalizados no Documento de Visão |
| Planejamento de Requisitos | Verificação e Validação | Validação do escopo com o cliente e Revisão em Pares | Escopo de alto nível validado com o técnico e Documento de Visão sem ambiguidades |
| Planejamento de Requisitos | Organização e Atualização | Catalogação de Requisitos (apoio: GitHub Projects) | Escopo inicial versionado e rastreável |
| Design do Usuário | Elicitação e Descoberta | Entrevista com o stakeholder (encontros frequentes via Teams e WhatsApp) | Telas co-criadas e regras de negócio descobertas conforme a interface toma forma |
| Design do Usuário | Declaração de Requisitos | Histórias de Usuário com Especificação por Cenários | Comportamento declarado com critérios de aceitação objetivos (Dado/Quando/Então) |
| Design do Usuário | Representação de Requisitos | Prototipação de Média Fidelidade (apoio: Figma) | Interface especificada e representada visualmente por protótipos de média fidelidade |
| Design do Usuário | Análise e Consenso | Repriorização MoSCoW | Escopo ajustado conforme o feedback visual (escopo como variável no RAD) |
| Design do Usuário | Verificação e Validação | Validação dos protótipos com o cliente | Protótipos validados que servem como especificação e validação |
| Design do Usuário | Organização e Atualização | Refinamento contínuo do backlog (apoio: GitHub Projects) | Rastreabilidade entre telas do Figma e requisitos mantida |
| Construção | Representação | Evolução dos protótipos validados em incrementos | Funcionalidades construídas a partir do protótipo aprovado |
| Construção | Verificação e Validação | Verificação interna: checklists de qualidade, revisão por pares e tecnicas de verificação do software | Incrementos verificados internamente contra os critérios de aceitação |
| Construção | Verificação e Validação | Validação com o cliente: demonstração do incremento | Incrementos validados pelo técnico frente à rotina real de treinos |
| Construção | Organização e Atualização | Gestão visual do backlog (apoio: GitHub Projects) | Impedimentos mitigados e escopo repriorizado conforme as validações |
| Cutover | Verificação e Validação | Prática de validação com o cliente e testes de aceitação | MVP homologado em uso real no Canaã Esporte Clube |
| Cutover | Declaração de Requisitos | Notas de versão e manual do usuário | Documentação de entrega (release notes e guia) consolidada |
| Cutover | Organização e Atualização | Fechamento da linha de base (apoio: GitHub Projects) | Linha de base entregue formalizada e demandas futuras registradas |

