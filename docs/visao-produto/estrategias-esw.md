# Estratégias de Engenharia de Software

## 4.1 Estratégia Priorizada

**Abordagem de Desenvolvimento de Software:** Híbrida.

**Ciclo de vida:** Iterativo e Incremental.

**Processo de Engenharia de Software:** Rapid Application Development (RAD).

A hibridização acontece dentro das próprias fases do RAD, combinando elementos dirigidos por plano com elementos ágeis:

- **Elemento dirigido por plano:** Na fase de Planejamento de Requisitos, em que objetivos de negócio, escopo e restrições do FutBoard foram planejados de forma abrangente antes do início da prototipagem. (MARSICANO, 2026, p. 36)
- **Elementos ágeis:** O planejamento é adaptativo, com planos evoluindo ao longo do projeto com base no feedback dos usuários e nas necessidades emergentes. Por exemplo nas fases: Workshop de Design do Usuário, a Prototipagem Evolutiva e o Feedback Contínuo, em que os requisitos emergem e evoluem em ciclos curtos, validados diretamente com o técnico a cada versão funcional (MARSICANO, 2026, p. 36).

## 4.2 Quadro Comparativo

| Características | RAD                                                                                                                                                                                                                                                           | DSDM |
|---|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|
| Abordagem geral | Enfatiza prototipagem rápida e iterativa como alternativa ao planejamento extensivo, visando acelerar o desenvolvimento de aplicações (MARSICANO, 2026, p. 79)                                                                                                | Abordagem ágil abrangente orientada a negócios, com foco em entregar benefícios reais dentro de restrições de prazo e orçamento previamente definidas (MARSICANO, 2026, p. 77) |
| Eixo central do processo | Entrega veloz e refinamento com os usuários, utilizando os ciclos de workshop de design e prototipagem evolutiva como núcleo do processo (MARSICANO, 2026, p. 79)                                                                                             | Alinhamento entre entrega e objetivos estratégicos de negócio, com prazo e custo fixos e o escopo como variável de ajuste via priorização MoSCoW (MARSICANO, 2026, p. 77-78) |
| Estrutura de fases | Cinco fases: planejamento de requisitos, design do usuário, construção e cutover (MARSICANO, 2026, p. 56)                                                                                                                                                     | Inicia com modelagem de negócios e estudo de viabilidade, seguida de priorização MoSCoW e desenvolvimento organizado em timeboxes fixos (MARSICANO, 2026, p. 77-78) |
| Elicitação de requisitos | Elicitação inicial de alto nível; não busca especificação exaustiva, os requisitos emergem e evoluem durante o processo (MARSICANO, 2026, p. 79)                                                                                                              | Ocorre via "workshops facilitados", com papéis formais dedicados (Embaixador do Negócio, Visionário do Negócio) para garantir a perspectiva do usuário (MARSICANO, 2026, p. 77) |
| Papel da prototipagem | Os protótipos funcionais tendem a evoluir para o sistema final, servindo como especificação e validação de requisitos (MARSICANO, 2026, p. 79)                                                                                                                | Os protótipos evolutivos aparecem como um dos artefatos produzidos na fase de Documentação Apropriada, ao lado do business case e da definição de arquitetura (MARSICANO, 2026, p. 77) |
| Participação do usuário/cliente | Ativa e constante, especialmente intensa no workshop de design do usuário, com comprometimento exigido durante todo o processo (MARSICANO, 2026, p. 79-80)                                                                                                    | Ativa, porém formalizada em papéis de negócio específicos, exigindo maior estrutura organizacional (MARSICANO, 2026, p. 77) |
| Documentação | Mínima; documentação leve, criada apenas quando necessária para dar clareza ou suporte futuro (MARSICANO, 2026, p. 80)                                                                                                                                        | Segue o princípio de "quanto basta", produzindo artefatos formais como business case e definição de arquitetura (MARSICANO, 2026, p. 77) |
| Flexibilidade para mudanças | O escopo tende a se ajustar ao longo dos ciclos de prototipagem, já que os requisitos emergem e evoluem durante o processo (MARSICANO, 2026, p. 79); essa flexibilidade depende do envolvimento constante do usuário e pode gerar retrabalho se mal conduzida | Concentrada no escopo, ajustado pela priorização MoSCoW; prazo e custo permanecem fixos (MARSICANO, 2026, p. 77-78) |
| Limitações principais | Menor adequação a sistemas de grande escala ou missão crítica; risco de foco excessivo em interfaces; exige comprometimento intenso dos usuários finais (MARSICANO, 2026, p. 80)                                                                              | Mais complexo e prescritivo que outras abordagens ágeis; requer compromisso organizacional significativo (MARSICANO, 2026, p. 78) 

## 4.3 Justificativa

O RAD foi escolhido por equilibrar dois aspectos centrais do FutBoard: a necessidade de entregar, dentro de um único semestre, um produto fortemente dependente de validação visual (dashboards e relatórios), e o acesso facilitado ao técnico Marcus Vinicius, principal ponto de contato do projeto. Essa acessibilidade viabiliza o ritmo de validação que o RAD exige, mas não é, por si só, a justificativa completa da estratégia.

Destaca-se alguns motivos:

- **Contato direto e colaboração intensa:** o prazo exige validação constante com o técnico Marcus Vinicius, mas o conjunto de stakeholders como um todo também deve ser considerado durante a elicitação, já que utiliza o produto na rotina do clube. A fase de design do usuário do RAD viabiliza essa colaboração direta e informal (WhatsApp/Teams).

- **Prototipagem como núcleo de validação:** o FutBoard depende fortemente de dashboards e relatórios que precisam ser lidos rapidamente por um usuário não-técnico durante a rotina do treino. O papel central da prototipagem no RAD permite que essas telas evoluam iterativamente até se tornarem o próprio sistema final, servindo simultaneamente como especificação e validação junto ao cliente.

  - **Domínio estabelecido (e a necessidade de análise e validação contínua):** a periodização esportiva (macro, meso e microciclos) é uma estrutura científica bem definida, mas isso não reduz o trabalho de elicitação, apenas o desloca para os ciclos de design e prototipagem do RAD. Ainda é necessário compreender, junto ao técnico: como ele aplica a periodização na prática; quais dados efetivamente registra; quais fórmulas e cálculos utiliza; quais exceções surgem na rotina do clube; entre outros. O fato de o domínio já estar estabelecido aumenta, portanto, a importância da análise de domínio e da validação semântica junto ao cliente, e o processo RAD, com seus ciclos curtos de protótipo-feedback, é adequado justamente para expor essas nuances de forma incremental, em vez de assumir que o domínio já está totalmente compreendido antes do desenvolvimento.

- **Adaptação à equipe:** o RAD é indicado para equipes pequenas e projetos de escopo modularizável, como é o caso do nosso time. A ausência de papéis de governança formalizados evita sobrecarga de processo desproporcional ao tamanho da equipe, do cliente e do projeto.

- **Foco na entrega de valor dentro do prazo:** ciclos curtos de construção e validação permitem que os stakeholders avaliem funcionalidades como registro de sessões e estruturação da periodização rapidamente, reduzindo retrabalho e aumentando a chance de que o MVP entregue ao final reflita a rotina real de trabalho.