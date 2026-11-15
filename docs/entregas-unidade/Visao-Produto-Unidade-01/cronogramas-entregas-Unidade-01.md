## 6. Cronograma e Entregas

O cronograma foi organizado em iterações semanais distribuídas ao longo das quatro fases do RAD. No núcleo do processo, **Design do Usuário e Construção iteram em conjunto** a cada funcionalidade (protótipo validado → construção → teste → validação com o cliente), entregando fatias verticais completas e testadas. Dessa forma, testes, integração e atividades de Engenharia de Requisitos ocorrem de forma contínua, e não apenas ao final.

| Fase (RAD) | Iteração | Início | Fim | Objetivo Principal | Entregas Esperadas | Validação do Cliente |
|---|---|---|---|---|---|---|
| Planejamento de Requisitos | Iteração 1 | 07/09/2026 | 14/09/2026 | Elicitação, priorização e base técnica | Escopo priorizado (MoSCoW e Valor x Esforço); Documento de Visão; ambiente Free Tier (Vercel e Render) | Revisão do escopo com o técnico |
| Design do Usuário e Construção | Iteração 2 | 14/09/2026 | 21/09/2026 | Prototipação do registro de sessões e da importação de dados (fatia vertical) | Protótipos do registro (CP01); importação dos dados históricos já exibida em tela | Validação dos protótipos e da importação |
| Design do Usuário e Construção | Iteração 3 | 21/09/2026 | 28/09/2026 | Registro rápido e categorizado de sessões (CP01) | Tela de registro funcional (menos de 3 min) e categorização, com testes | Validação do registro em campo |
| Design do Usuário e Construção | Iteração 4 | 28/09/2026 | 05/10/2026 | Periodização – macrociclos (CP02) | Cadastro de macrociclos funcional, com testes | Validação da estrutura de macrociclos |
| Design do Usuário e Construção | Iteração 5 | 05/10/2026 | 12/10/2026 | Periodização – meso e microciclos (CP02) | Meso e microciclos vinculados, com testes | Validação da hierarquia de periodização |
| Design do Usuário e Construção | Iteração 6 | 12/10/2026 | 19/10/2026 | Dashboard de carga de treino (CP03) | Painel de carga funcional, com testes | Validação do dashboard de carga |
| Design do Usuário e Construção | Iteração 7 | 19/10/2026 | 26/10/2026 | Dashboard de desempenho (CP03) | Métricas visuais de desempenho, com testes | Validação das métricas |
| Design do Usuário e Construção | Iteração 8 | 26/10/2026 | 02/11/2026 | Relatórios por ciclo (CP04) | Relatórios estatísticos por ciclo, com testes | Validação dos relatórios |
| Design do Usuário e Construção | Iteração 9 | 02/11/2026 | 09/11/2026 | Relatórios comparativos entre ciclos (CP04 / OE5) | Comparativos macro, meso e micro, com testes | Validação da análise comparativa |
| Design do Usuário e Construção | Iteração 10 | 09/11/2026 | 16/11/2026 | Refinamento de usabilidade para usuário não técnico | Ajustes de UX, com testes de usabilidade | Teste de usabilidade com o técnico e a comissão |
| Cutover | Iteração 11 | 16/11/2026 | 23/11/2026 | Homologação assistida e migração para produção (VPS) | Deploy em VPS (AWS Lightsail ou DigitalOcean); homologação em uso real e correções | Homologação em ambiente real |
| Cutover | Iteração 12 | 23/11/2026 | 30/11/2026 | Entrega final do MVP | MVP homologado; notas de versão e manual | Aceite final do MVP |

**Considerações importantes**

- O cronograma foi organizado em iterações semanais dentro das fases do RAD; Design do Usuário e Construção iteram em conjunto a cada funcionalidade, com prototipação e validação contínuas junto ao técnico Marcus Vinicius.
- Cada iteração entrega uma fatia vertical completa e testada (protótipo, construção, teste e validação), evitando a divisão por camadas técnicas; testes e integração ocorrem continuamente, e não apenas na fase final.
- As atividades de Engenharia de Requisitos (refinamento de requisitos, critérios de aceitação e validação de protótipos e RNFs) acontecem em todas as iterações, com o backlog mantido no GitHub Projects.
- As entregas refletem o produto FutBoard (registro de sessões, periodização, dashboards e relatórios), e não o calendário da disciplina.

> As datas apresentadas são propostas a partir da semana de 07/09/2026 e podem ser ajustadas conforme o calendário da equipe e do cliente.
