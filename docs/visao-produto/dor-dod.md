# 9. DoR e DoD

Para alinhar o desenvolvimento do FutBoard com uma abordagem híbrida (RAD e Iterativo Incremental), as definições de Preparado (DoR) e Pronto (DoD) focam em prototipação rápida, ciclos curtos de feedback e validação rigorosa dos critérios de qualidade estabelecidos na documentação pelo cliente Marcus Vinicius.


## 9.1 Definition of Ready (DoR)

Para que uma User Story (US) seja escolhida para uma iteração, ela deve estar madura e sem bloqueios.

- **A estrutura da User Story está bem definida?**

A US deve seguir o formato padrão ("Eu como [Treinador/Auxiliar], quero [ação] para [valor]") e possuir um título claro.

- **A User Story está ratreavél?**

A US deve estar explicitamente vinculada a um Requisito Funcional, esse requisito está vinculado a uma caraterística de produto (CP) e a um objetivo específico (OE).

- **A User Story está mensuravel?**

Devem contemplar tanto o caminho feliz quanto os fluxos de exceção, especificamente as regras de resultado vazio. Devem ter os criterios de aceitação e regras de negócios.

- **A User Story foi prototipada?**

Protótipos de interface (wireframes ou protótipos de baixa fidelidade) devem estar prontos e validados.

- **A User Story foi validada com o cliente?**

A User Story deve ter sido validada pelo cliente.


## 9.2 Definition of Done (DoD)


Para que a User Story seja considerada concluída e pronta para integração ao FutBoard, ela deve passar por verificações de código, testes e validação com o cliente.


- **Os critérios de aceitação foram atendidos?**

100% dos critérios da US foram implementados, incluindo o tratamento adequado de estados vazios (sem quebra de interface ou erros de cálculo).

- **O código foi integrado na branch main e revisado**

O código foi versionado, passou por Code Review (Pull Request aprovado), aprovado por outro membro, e foi integrado à branch principal sem conflitos.

- **Os workflows de CI/CD do projeto foram executados com sucesso?**

Os workflows de integração e entrega contínua (CI/CD) devem executar automaticamente as etapas de verificação, testes e build da aplicação web.

- **Os testes relacionados foram executados com sucesso?**

Cada User Story deve ter passado em 100% dos testes unitários.

- **A documentação e evidências da entrega estão atualizadas?**

A User Story deve ser marcada como feita e atualizada.

- **A funcionalidade da User Story desenvolvida foi validada pelo cliente?**

O cliente deve ter testado a funcionalidade implementada em seu próprio dispositivo e validado a entrega por meio de mensagens ou de vídeos.