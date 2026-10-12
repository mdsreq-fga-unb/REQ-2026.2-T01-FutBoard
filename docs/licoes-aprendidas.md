# Lições Aprendidas

## Introdução Geral

Esta seção registra a evolução da equipe ao longo do projeto **FutBoard**, documentando os principais aprendizados de cada etapa do desenvolvimento. O objetivo é transformar dificuldades observadas, feedbacks recebidos do professor, do monitor e do cliente, e decisões tomadas pela equipe em ações concretas para as próximas unidades.

O documento é organizado por unidade, mantendo um histórico transparente da trajetória metodológica, técnica e organizacional do grupo.

---

## 1. Unidade 1

### 1.1. Contexto e Visão Geral

A Unidade 1 foi dedicada à construção da visão do produto e do projeto: entender o cenário atual do cliente, definir o processo de Engenharia de Requisitos e a estratégia de desenvolvimento, e propor uma primeira versão da solução. Foi também o primeiro contato da equipe com o domínio do cliente e com a dinâmica de produzir os artefatos exigidos pela disciplina dentro do prazo.

### 1.2. Dificuldades Observadas e Feedbacks Recebidos

A revisão da entrega mostrou que boa parte das dificuldades teve origem na forma como a elicitação foi conduzida: a equipe se apoiou fortemente em um único ponto de contato com o cliente, o que gerou lacunas na compreensão do negócio e inconsistências entre partes do documento — situações e decisões descritas em uma seção nem sempre estavam alinhadas com o que aparecia em outra.

Também ficou evidente uma dificuldade em justificar de forma consistente as escolhas metodológicas do projeto, tanto na definição do processo de Engenharia de Requisitos quanto na estratégia de desenvolvimento adotada. Algumas decisões foram registradas sem comparação suficiente com alternativas, ou sem deixar claro por que se aplicavam ao contexto específico do cliente.

Na proposta da solução, surgiram imprecisões conceituais — termos usados de forma ambígua, capacidades e requisitos não completamente rastreáveis aos objetivos do projeto, e afirmações de impacto (social, de negócio) difíceis de sustentar ou verificar dentro do escopo do projeto. Riscos éticos e de privacidade relevantes ao domínio foram identificados, mas ainda não totalmente traduzidos em requisitos concretos.

Por fim, na apresentação da entrega, a equipe teve dificuldade em manter a comunicação dentro do tempo estabelecido, refletindo uma preparação de roteiro e ensaio insuficiente para o formato exigido.

### 1.3. Aprendizados Adquiridos

1. **Elicitação mais ampla:** entender bem um domínio não substitui ouvir todos os atores relevantes; múltiplas perspectivas evitam pontos cegos e inconsistências no cenário.
2. **Justificar decisões metodológicas:** toda escolha de processo ou estratégia deve vir acompanhada de comparação com alternativas e de argumentos claros sobre por que se aplica ao contexto do projeto.
3. **Rastreabilidade e precisão conceitual:** termos e capacidades da solução precisam de definições precisas e de uma ligação clara com os objetivos do projeto, para sustentar decisões futuras de escopo.
4. **Riscos sociais como requisitos:** questões éticas e de privacidade identificadas no domínio devem ser convertidas em funcionalidades, políticas de acesso ou restrições explícitas, não apenas mencionadas como preocupação.
5. **Comunicação objetiva:** apresentações dentro do tempo exigem roteiro definido com antecedência e ensaio cronometrado, não apenas revisão de conteúdo.

### 1.4. Ações Concretas para a Unidade 2

| Ação | Responsável | Prazo | Evidência de conclusão |
| --- | --- | --- | --- |
| Ampliar as fontes de elicitação, incluindo demais atores relevantes do cenário do cliente | Todos | Início da Unidade 2 | Registro de novas interações e atualização do cenário atual |
| Revisar as seções do documento de forma integrada, checando consistência entre cenário, estratégia e solução | Revisor designado por entrega | Antes de cada entrega | Checklist de revisão preenchido |
| Justificar formalmente as escolhas de processo de ER e de estratégia de desenvolvimento, com comparação de alternativas | Responsável pela seção de estratégia | Antes da entrega da Unidade 2 | Seção de justificativa atualizada no documento |
| Refinar a rastreabilidade entre objetivos, capacidades e requisitos, eliminando ambiguidades de termos | Todos | Durante o refinamento do MVP | Matriz de rastreabilidade atualizada |
| Traduzir riscos sociais e de privacidade já identificados em requisitos funcionais e não funcionais | Todos | Durante a Unidade 2 | Requisitos correspondentes registrados e rastreados |
| Ensaiar a apresentação com cronômetro antes da gravação final | Todos | Antes da entrega da Unidade 2 | Registro do ensaio e vídeo final dentro do tempo |

---

## 2. Unidade 2

### 2.1. Contexto e Visão Geral

A Unidade 2 foi dedicada a transformar a visão do produto em um escopo concreto e priorizado: elicitação e descoberta, análise e consenso, declaração dos requisitos, definição do Backlog do Produto, definição do MVP e definição de DoR e DoD.
 
Nesse período, a equipe partiu da transcrição das reuniões com o cliente para chegar à lista de 41 requisitos funcionais (RF01–RF41) e aos requisitos não funcionais, com rastreabilidade entre problema, objetivos, características do produto, RFs/RNFs e declarações de requisitos.
 
As atividades da Semana Universitária tiveram papel central nesta unidade, porque os requisitos foram revisados por outra equipe e reavaliados com base nesse retorno. As atividades seguiram quatro etapas:
 
1. A lista inicial de RFs e RNFs foi publicada no site.
2. A equipe produziu um artefato de feedback sobre os requisitos da outra equipe (Requisitados).
3. A equipe recebeu o artefato de feedback da outra equipe e registrou os feedbacks recebidos e as decisões tomadas sobre cada um.
4. A lista final, já revisada, foi publicada no site.
O feedback do professor e do monitor também foi decisivo e fez com que os requisitos fossem alterados e reavaliados várias vezes até chegar à versão atual.

### 2.2. Dificuldades Observadas e Feedbacks Recebidos

**Qualidade e granularidade dos requisitos.** Na Reunião 5, a equipe percebeu que parte dos RFs/RNFs estava ampla demais e precisou granularizá-los. O feedback do grupo Requisitados mostrou outros pontos de ajuste, e foi necessário decidir, caso a caso, quais sugestões aceitar e justificar cada decisão. Para isso, a equipe usou uma planilha de registro e justificativa. Entre os ajustes estavam o refinamento do requisito de filtro, a separação entre busca e reutilização de atividade da biblioteca e a padronização do agente "treinador e auxiliar técnico" em todos os RFs. 
 
**Feedback do professor sobre filtro, dashboard e tamanho do MVP.** Após a apresentação das atividades da Semana Universitária, o professor apontou problemas nos requisitos de filtro e de dashboard e o excesso de RFs no MVP. Isso levou a equipe a:
 
- reescrever o filtro como requisito de consulta ("Consultar treino por periodização"), movendo os filtros de macrociclo, mesociclo, microciclo e sessão para a regra de negócio;
- quebrar o dashboard em requisitos de consulta distintos, levando a explicação de termos técnicos para um catálogo;
- retirar o requisito de scout para não gerar RFs adicionais;
- converter requisitos de efeito emergente em regras de negócio e unificar regras de negócio e critérios de aceitação por requisito.
Como consequência dessas mudanças, a numeração dos RFs mudou (de 46 para 41) e algumas seções do site, como o Backlog (10.2), ficaram desatualizadas em relação ao restante da documentação. Manter Miro, GitPages e planilha sincronizados foi uma dificuldade constante.
 
**Validação com o cliente.** Parte da validação com o cliente passou a ocorrer de forma assíncrona (via WhatsApp), o que exigiu cuidado para deixar as evidências registradas.
 
**Priorização.** A matriz MoSCoW foi usada no início da elicitação e descoberta para guiar a conversa com o cliente, mas foi retirada nas etapas seguintes. A matriz valor x esforço foi feita **duas vezes**. Na primeira versão, o MVP ficou grande demais. Na segunda, foi preciso incluir um **critério adicional, a frequência de uso**, para reduzir o escopo. Esse critério também gerou novas discussões. Os requisitos "criar conta" e "fazer login" apareciam no quarto quadrante da matriz, mas entraram como candidatos ao MVP pela frequência de uso. Depois, a equipe decidiu retirá-los, reafirmando que o valor x esforço é o primeiro critério. Já "cadastrar macrociclo" entrou no MVP mesmo com frequência baixa, por ser a base de todo o cadastro.
 
**Histórias de usuário e declaração de requisitos.** Houve a necessidade de simplificar as histórias de usuário para não enviesar o valor de negócio atribuído pelo cliente e de padronizar o vínculo 1 para 1 entre história de usuário e RF. Na atividade do professor sobre os tipos de declaração de requisitos, o grupo justificou o uso de histórias de usuário na descoberta inicial pelo perfil leigo do cliente.
 
**DoR e DoD.** A definição dos critérios foi a etapa mais recente e exigiu mais discussão. A equipe partiu de exemplos de outro grupo e das orientações do monitor sobre o critério INVEST, e depois adaptou os critérios à abordagem híbrida (RAD e Iterativo Incremental) do FutBoard. O DoR exige que a história de usuário esteja bem estruturada, rastreável até o RF, a característica de produto e o objetivo específico, mensurável (com critérios de aceitação, regras de negócio e fluxos de exceção), prototipada e validada pelo cliente. O DoD exige que 100% dos critérios de aceitação sejam atendidos, que o código passe por code review e seja integrado à branch principal, que os workflows de CI/CD e os testes unitários sejam executados com sucesso, que a documentação esteja atualizada e que o cliente valide a funcionalidade. Alguns critérios discutidos no início, como planning poker e testes de integração, não entraram na versão final.

### 2.3. Aprendizados Adquiridos

1. **Requisitos melhoram com revisão externa e com registro das decisões:** produzir feedback para outra equipe e receber o da nossa mostrou problemas que a própria equipe não enxergava, como ambiguidade, requisitos amplos e termos dependentes do contexto. O que garantiu controle foi o artefato de feedbacks e decisões, que registra o que foi aceito, o que foi recusado e por quê.
2. **Cada técnica de priorização serve a uma etapa:** a matriz MoSCoW ajudou a guiar a descoberta com o cliente, mas não bastava para decidir o escopo. A matriz valor x esforço, com votação e média da equipe, deu um critério mais objetivo para o MVP.
3. **Um critério único de priorização pode não ser suficiente:** ter que refazer a matriz com a frequência de uso mostrou que o corte do MVP precisa de critérios explícitos e de uma hierarquia entre eles, para evitar contradições (como o caso de criar conta e login).
4. **Granularidade importa:** requisitos amplos (filtro, dashboard) escondem várias funcionalidades e dificultam estimativa, priorização e teste. Regras de filtro e detalhes de exibição pertencem à regra de negócio, não ao nome do requisito.
5. **Escopo de MVP precisa ser enxuto:** reduzir o MVP com base em valor e frequência de uso foi mais eficaz do que tentar entregar quase todos os RFs.
6. **Rastreabilidade e documentação precisam ser atualizadas juntas:** mudar numeração e nomes de requisitos sem atualizar todas as seções gera inconsistências. É preciso um responsável por conferir isso a cada alteração.
7. **Validação com o cliente deve deixar evidência:** a validação do MVP e das histórias de usuário precisa ser registrada (prints, vídeos, mensagens) e, quando possível, envolver também a comissão técnica.
8. **DoR e DoD só funcionam com consenso do time:** critérios copiados de exemplos precisam ser discutidos e adaptados ao projeto antes de virar checklist.

### 2.4. Ações Concretas para a Unidade 3

| Ação                                                                                                                                                | Responsável                                  | Prazo                             | Evidência de conclusão                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------- | -------------------------------------------------------- |
| Atualizar todas as seções do site (backlog, matriz, rastreabilidade) para a numeração oficial RF01–RF41 e o MVP validado                            | Todos                                        | Início da Unidade 3               | Site revisado e checklist de consistência preenchido     |
| Manter o registro de feedbacks e decisões (aceito/recusado + justificativa) para qualquer revisão de requisitos, interna ou externa                 | Todos                                        | Durante a Unidade 3               | Planilha de feedbacks e decisões atualizada a cada ciclo |
| Validar com o cliente (e, se possível, com a comissão técnica) os requisitos alterados, mantendo evidências                                         | Gerente do projeto + Analistas de requisitos | A cada ciclo de entrega           | Registros de validação anexados ao site                  |
| Usar o DoR e o DoD como checklist real antes de iniciar e ao finalizar cada história de usuário                                                     | Todos                                        | Durante o desenvolvimento do MVP  | Histórias marcadas conforme DoR/DoD no GitHub Projects   |
| Reavaliar a priorização do backlog se surgirem novos requisitos, mantendo valor x esforço como primeiro critério e frequência de uso como desempate | Todos                                        | Sempre que o escopo mudar         | Matriz e planilha de priorização atualizadas             |
| Ensaiar a apresentação com cronômetro antes da gravação final                                                                                       | Todos                                        | Antes da entrega da Unidade 3     | Registro do ensaio e vídeo dentro do tempo               |
 
---

## 3. Unidade 3

### 3.1. Contexto e Visão Geral
*Esta seção será preenchida ao final da Unidade 3.*

### 3.2. Dificuldades Observadas e Feedbacks Recebidos
*A ser preenchido.*

### 3.3. Aprendizados Adquiridos
*A ser preenchido.*

### 3.4. Ações Concretas e Encerramento
*A ser preenchido.*

---
 
## Histórico de Versões
 
| Versão | Data       | Descrição                                                        | Autor(es)       |
| ------ | ---------- | ---------------------------------------------------------------- | --------------- |
| `1.0`  | 15/09/2026 | Consolidação dos aprendizados, dificuldades e ações da Unidade 1 | Equipe FutBoard |
| `1.1`  | 12/10/2026 | Consolidação dos aprendizados, dificuldades e ações da Unidade 2 | Equipe FutBoard |
 