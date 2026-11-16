# 9. DoR e DoD

Para alinhar o desenvolvimento do FutBoard com uma abordagem híbrida (RAD e Iterativo Incremental), as definições de Preparado (DoR) e Pronto (DoD) focam em prototipação rápida, ciclos curtos de feedback e validação rigorosa dos critérios de qualidade estabelecidos na documentação pelo cliente Marcus Vinicius.


## 9.1 Definition of Ready (DoR)

Para que uma User Story (US) seja escolhida para uma iteração, ela deve estar madura e sem bloqueios.

- **A estrutura da User Story está bem definida?**

A US deve seguir o formato padrão ("Eu como [Treinador/Auxiliar], quero [ação] para [valor]") e possuir um título claro.

- **A User Story está rastreavél?**

A US deve estar explicitamente vinculada a um Requisito Funcional, esse requisito está vinculado a uma característica de produto (CP) e a um objetivo específico (OE).

- **A User Story está mensurável?**

Devem contemplar tanto o caminho feliz quanto os fluxos de exceção, especificamente as regras de resultado vazio. Devem ter os critérios de aceitação e regras de negócio e requisitos não funcionais.

- **A User Story foi prototipada?**

Protótipos de interface (wireframes ou protótipos de baixa fidelidade) devem estar prontos e validados.

- **A User Story foi validada com o cliente?**

A User Story deve ter sido validada pelo cliente.


## 9.2 Definition of Done (DoD)


Para que a User Story seja considerada concluída e pronta para integração ao FutBoard, ela deve passar por verificações de código, testes e validação com o cliente.


- **Os critérios de aceitação foram atendidos?**

100% dos critérios da US foram implementados, incluindo o tratamento adequado de estados vazios (sem quebra de interface ou erros de cálculo).

- **O código foi integrado na branch main e revisado?**

O código foi versionado, passou por Code Review (Pull Request aprovado), aprovado por outro membro, e foi integrado à branch principal sem conflitos.

- **Os workflows de CI/CD do projeto foram executados com sucesso?**

Os workflows de integração e entrega contínua (CI/CD) devem executar automaticamente as etapas de verificação, testes e build da aplicação web.

- **Os testes relacionados foram executados com sucesso?**

Cada User Story relacionada a um Requisito Funcional deve ter passado em 100% dos testes unitários.

- **Os Requisitos Não Funcionais (RNFs) vinculados foram verificados?**

As histórias que possuem RNFs associados no backlog devem comprovar seu atendimento por meio de verificações específicas, com capturas de tela, vídeos ou métricas anexadas:

  ▸ **RNF02 (Interface Responsiva):** A tela deve ser verificada nas resoluções de **360px (mobile)**, **768px (tablet)** e **1366px (desktop)** via ferramentas de desenvolvedor (DevTools) ou dispositivo real, comprovando que elementos e gráficos não ficam cortados, sobrepostos ou com barra de rolagem horizontal.  
  ▸ **RNF03 (Eficiência no Cadastro de Treinos):** Para as histórias diretamente ligadas à montagem de treino (US13, US16, US23 e US30), o fluxo de preenchimento deve ser cronometrado, comprovando conclusão em **menos de 2 minutos** em um cenário de complexidade média com atividades da biblioteca.  
  ▸ **RNF04 (Atualização em Tempo Real do Dashboard):** Para as histórias que alteram dados refletidos nos indicadores e gráficos, deve ser medido o tempo entre a confirmação do salvamento/edição e a re-renderização na tela, comprovando atualização em **no máximo 5 segundos**.  
  ▸ **RNF01 (Proteção de Dados):** Aplicável às histórias de autenticação (US27 e US28), verificando o armazenamento de senhas com hash seguro (`bcrypt`) e o bloqueio de acessos não autorizados com código HTTP 401.



- **A verificação integrada dos fluxos foi realizada com sucesso?**

Quando a User Story fizer parte de fluxos encadeados do sistema (ex.: `Periodização → Sessão/Atividades → Dashboard Analítico → Relatório PDF`), deve ser comprovada a coerência dos dados de ponta a ponta:

  ▸ Cadastrar ou editar uma sessão com atividades ou ciclos que dependem de outro, funcionam de forma encadeada, devem produzir resultados consistentes e idênticos entre a visualizaçoes, os indicadores/gráficos do Dashboard e o relatório gerado em PDF.
  
  ▸ Alterações ou exclusões na hierarquia de ciclos (Macro, Meso e Microciclos — **RN04**) deve refletir de forma íntegra nas opções de seleção e listagens dependentes.
  
  ▸ **Como comprovar:** A verificação deve ser comprovada por **teste manual**, registrando em capturas de tela que o mesmo valor cadastrado na sessão reflete perfeitamente no Dashboard e no PDF baixado. Também vale para a exclusao

- **A documentação e evidências da entrega estão atualizadas?**

A User Story deve possuir um checklist no card do backlog contendo todos os DODs e suas respectivas evidencias (fotos, prints, PRS) para garantir que todos foram seguidos e concluídos para que possa ser possível verificar quais ainda estao pendentes.

- **A funcionalidade da User Story desenvolvida foi validada pelo cliente?**

O cliente deve ter testado a funcionalidade implementada em seu próprio dispositivo e validado a entrega por meio de mensagens ou de vídeos. Os vídeos estarao no carrossel de evidencias.
