# Evidências por Iteração

Esta seção reúne, para cada iteração de Design do Usuário e Construção, as provas de que o processo descrito nas seções anteriores foi executado. Evidenciamos o trabalho por quatro motivos:

- **O RAD depende da validação constante com o cliente** ([seção 4](../estrategias-esw.md)). A evidência mostra que cada protótipo e cada incremento passou pelo técnico Marcus Vinicius, e não apenas que isso estava planejado no [cronograma](../cronogramas-entregas.md).
- **O DoR e o DoD são checklists** ([seção 9](../dor-dod.md)). Cada item só pode ser marcado como concluído quando há uma prova verificável: vídeo, print, protótipo, pull request ou teste.
- **Os requisitos mudam ao longo das iterações.** Registrar cada decisão, com sua origem e os artefatos que ela atinge, mantém a rastreabilidade entre o que o cliente pediu, o que foi declarado, o que foi prototipado e o que foi construído.
- **O que está pendente fica visível.** A equipe, o professor e o monitor conseguem ver o que já foi executado em cada iteração e o que ainda falta.

Cada página de iteração está organizada nas seções abaixo, que correspondem às atividades de Engenharia de Requisitos da [seção 5](../engenharia-requisitos.md):

| Seção | O que mostra | Atividade de ER |
| :--- | :--- | :--- |
| **Gravações e Atas** | Reuniões, vídeos e prints das validações com o cliente | Verificação e Validação |
| **Protótipos** | Telas de baixa fidelidade de cada história no Figma | Representação de Requisitos |
| **Confronto Cruzado** | Comparação entre o requisito declarado (critérios de aceitação, regras de negócio e RNFs) e o protótipo, antes da construção | Verificação e Validação |
| **Registro de Decisões e Matriz de Impacto** | Decisões que alteraram requisitos e a situação de cada artefato atingido | Organização e Atualização |
| **Definition of Done** | Checklist do DoD com a evidência de cada critério | Verificação e Validação |

A prototipação começou na Iteração 6, com o fluxo de navegação apresentado e aprovado pelo cliente na [Reunião com o cliente 4](../../atas-reunioes/reunioes-cliente.md#reuniao-com-o-cliente-4) (15/10/2026). Até a entrega da Unidade 2 (12/10/2026), ainda não havia protótipos; as telas de cada história foram feitas a partir da Iteração 7.

## Registro de Inspeções dos Requisitos

Resultado das revisões dos requisitos feitas antes e durante as iterações de construção, por outra equipe, pelo professor e pela própria equipe.

| Data | Origem | Problema encontrado | Decisão e justificativa | Requisito atualizado |
| :--- | :--- | :--- | :--- | :--- |
| set/2026 | Semana Universitária (grupo Requisitados) | Agente dos RFs escrito de formas diferentes | Padronizar o agente para facilitar a leitura e a rastreabilidade | Todos os RFs ("equipe técnica") |
| set/2026 | Semana Universitária (grupo Requisitados) | Busca e reutilização de atividade da biblioteca no mesmo requisito | Separar, porque um requisito amplo dificulta a estimativa e o teste | [RF23](../Requisitos-de-Software.md#rf23) |
| set/2026 | Semana Universitária (grupo Requisitados) | Requisito de filtro amplo demais | Reescrever como requisito de consulta e levar os filtros de periodização para a regra de negócio | [RF24](../Requisitos-de-Software.md#rf24) |
| out/2026 | Professor | Dashboard declarado como um único requisito | Dividir em requisitos de consulta, um por dimensão do treino, e levar os termos técnicos para o Catálogo de Termos | [RF35](../Requisitos-de-Software.md#rf35) a [RF41](../Requisitos-de-Software.md#rf41); de 46 para 41 RFs |
| out/2026 | Professor | MVP grande demais, com cerca de 90% dos RFs com valor máximo | Incluir a frequência de uso como segundo critério de corte | [Backlog do Produto](../backlog_do_produto.md) |
| 09/10/2026 | Revisão interna | IDs do RF24 e do RF25 trocados | Corrigir para a numeração oficial | [RF24](../Requisitos-de-Software.md#rf24), [RF25](../Requisitos-de-Software.md#rf25) |
| 29/10/2026 | Revisão interna | Esforço técnico com valores fora da escala de 1 a 4 | Recalcular a partir da média dos votos | Priorização dos RFs |
| 02/11/2026 | Revisão interna | Regras de resultado vazio apontando para IDs antigos (RF25, RF26 e RF37 a RF43) | Corrigir para a numeração oficial RF01 a RF41 | [RN07](../Requisitos-de-Software.md#rn07) |
| 16/11/2026 | Issue #12 | RF27 e RF28 classificados em Q4 e RF31 em Q1, contra a regra da matriz | Reclassificar; o RF27 e o RF28 entram no MVP | [RF27](../Requisitos-de-Software.md#rf27), [RF28](../Requisitos-de-Software.md#rf28), [RF31](../Requisitos-de-Software.md#rf31) |
| nov/2026 | Issue #12 | Regra de simultaneidade e minutagem registrada só no Catálogo de Termos | Declarar como regra de negócio e ligar cada regra à sua origem na elicitação | [RN03](../Requisitos-de-Software.md#rn03) e coluna de origem das RNs |
| 16/11/2026 | Confronto cruzado | Divergências entre os requisitos declarados e os protótipos | Corrigir os protótipos e as declarações | Decisões D03 e seguintes, nas páginas de cada iteração |
