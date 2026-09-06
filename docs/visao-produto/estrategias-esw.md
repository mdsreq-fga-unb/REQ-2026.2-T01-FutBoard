#Estratégias de Engenharia de Software

##4.1 Estratégia Priorizada

**Abordagem de Desenvolvimento de Software:** Híbrida.

**Ciclo de vida:** Iterativo e Incremental. 

**Processo de Engenharia de Software:** Rapid Application Development (RAD).

## 4.2 Quadro Comparativo

| Características | RAD                                                                                                                                                     | DSDM                                                                                                                                                           |
|---|---------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Abordagem geral | Enfatiza prototipagem rápida e iterativa como alternativa ao planejamento extensivo, visando acelerar o desenvolvimento de aplicações                   | Abordagem ágil abrangente orientada a negócios, com foco em entregar benefícios reais dentro de restrições de prazo e orçamento previamente definidas          |
| Eixo central do processo | Entrega veloz e refinamento com os usuários, utilizando prototipagem e feedback como núcleo do processo                                                 | Alinhamento entre entrega e objetivos estratégicos de negócio. Prazo e custo fixos; escopo é a variável de ajuste                                              |
| Estrutura de fases | Quatro fases: planejamento de requisitos, design do usuário, construção e cutover (implementação final)                                                 | Inicia com modelagem de negócios e estudo de viabilidade, seguida de priorização MoSCoW e desenvolvimento organizado em timeboxes fixos                        |
| Elicitação de requisitos | Elicitação inicial de alto nível; não busca especificação exaustiva, os requisitos emergem e evoluem durante os workshops de design e prototipagem      | Elicitação via "workshops facilitados", com papéis formais dedicados (ex.: Embaixador do Negócio, Visionário do Negócio) para garantir a perspectiva do usuário |
| Papel da prototipagem | Central: os protótipos funcionais evoluem até se tornarem o sistema final, serve simultaneamente como especificação e validação dos requisitos          | Complementar: protótipos evolutivos são um dos artefatos produzidos, mas não são o elemento estruturante do processo                                           |
| Participação do usuário/cliente | Participação ativa e constante, especialmente intensa na fase de design do usuário| Participação ativa, porém formalizada em papéis de negócio específicos, exigindo maior estrutura organizacional           |
| Documentação | Mínima; prioriza protótipos e artefatos visuais como meio de comunicação e validação com o cliente                                                      | Documentação essencial e focada; ainda produz artefatos formais como business case e definição de arquitetura                                                  |
| Flexibilidade para mudanças | Alta e ampla: tanto escopo quanto ciclos são ajustados livremente conforme o feedback do usuário                                                        | Concentrada no escopo (via MoSCoW); prazo e custo permanecem fixos                                                                                             |
| Limitações principais | Menor adequação a sistemas de grande escala ou missão crítica; alta dependência da disponibilidade do usuário                                           | Mais complexo e prescritivo que outras abordagens ágeis; requer compromisso organizacional significativo                                                       |
| Complexidade de gerenciamento | Baixa: processo enxuto, focado na entrega rápida e na colaboração direta com o usuário, sem papéis de governança formalizados                           | Alta: exige papéis de negócio específicos, artefatos de governança (business case) e estrutura de priorização hierárquica dos requisitos                       |
| Adequação ao projeto FutBoard | Cliente único e acessível, produto centrado em dashboards e usabilidade que exigem validação visual rápida; escopo modularizável e prazo curto          | Traria uma camada de governança de negócio (business case formal, papéis dedicados) desproporcional a um projeto com equipe reduzida e um único cliente        |

## 4.3 Justificativa

O RAD foi escolhido por equilibrar dois aspectos centrais do FutBoard: a necessidade de entregar, dentro de um único semestre, um produto fortemente dependente de validação visual (dashboards e relatórios), e a realidade da equipe que conta com um único cliente, de fácil acesso e disponível de forma informal.

Destaca-se alguns motivos:

- **Cliente único e colaboração intensa:** o prazo exige validação constante com o técnico Marcus Vinicius, único ponto de contato e de decisão do produto. A fase de design do usuário do RAD viabiliza essa colaboração direta e informal (WhatsApp/Teams), sem exigir os papéis de negócio formalizados que o DSDM demandaria para representar a mesma perspectiva do usuário.

- **Prototipagem como núcleo de validação:** o FutBoard depende fortemente de dashboards e relatórios que precisam ser lidos rapidamente por um usuário não-técnico durante a rotina do treino. O papel central da prototipagem no RAD permite que essas telas evoluam iterativamente até se tornarem o próprio sistema final, servindo simultaneamente como especificação e validação junto ao cliente, algo que um processo com prototipagem apenas complementar dificultaria.

- **Foco na interface:** a periodização esportiva (macro, meso e microciclos) já é uma estrutura científica bem definida, o que reduz a necessidade de elicitação extensa de "o que" o sistema precisa fazer. O esforço real está em "como" apresentar essas informações de forma usável, o que favorece o processo RAD, leve e voltado a ciclos rápidos de protótipo-feedback, em vez de um estudo de viabilidade e business case formal como o exigido pelo DSDM.

- **Adaptação à equipe:** o RAD é indicado para equipes pequenas e projetos de escopo modularizável, como é o caso do nosso time. A ausência de papéis de governança formalizados evita sobrecarga de processo desproporcional ao tamanho da equipe, do cliente e projeto.

- **Foco na entrega de valor dentro do prazo:** ciclos curtos de construção e validação permitem que o técnico avalie funcionalidades como registro de sessões e estruturação da periodização rapidamente, reduzindo retrabalho e garantindo que o MVP entregue ao final reflita, de fato, a rotina real de trabalho do clube.