# Requisitos de software 


## 8.1 Requisitos Funcionais — RFs

Os requisitos funcionais abaixo descrevem as capacidades que o sistema deve oferecer ao treinador e ao auxiliar, elicitadas a partir das reuniões de levantamento de requisitos com o cliente (Marcus Vinícius) e organizadas segundo as Características do Produto (CPs) definidas pela equipe:

- **CP01** — Registro Categorizado dos Treinos
- **CP02** — Estruturador de Periodização Esportiva
- **CP03** — Dashboard Analítico
- **CP04** — Geração Automática de Relatórios
- **CP05** — Controle de Perfis de Acesso

<div class="rf-filter" markdown>

**Filtrar requisitos**

<div class="rf-filter-dropdowns">
<details class="rf-filter-dropdown" open>
<summary>Entrega</summary>
<label><input type="checkbox" name="rf-delivery" value="MVP"> MVP</label>
<label><input type="checkbox" name="rf-delivery" value="Escopo Adicional"> Escopo Adicional</label>
</details>

<details class="rf-filter-dropdown" open>
<summary>Situação</summary>
<label><input type="checkbox" name="rf-situation" value="Concluído"> Concluído</label>
<label><input type="checkbox" name="rf-situation" value="Não concluído"> Não concluído</label>
</details>

<details class="rf-filter-dropdown" open>
<summary>Iteração de desenvolvimento</summary>
<label><input type="checkbox" name="rf-iteration" value="Iteração 07"> Iteração 07</label>
<label><input type="checkbox" name="rf-iteration" value="Iteração 08"> Iteração 08</label>
<label><input type="checkbox" name="rf-iteration" value="Iteração 09"> Iteração 09</label>
<label><input type="checkbox" name="rf-iteration" value="Iteração 10"> Iteração 10</label>
<label><input type="checkbox" name="rf-iteration" value="Iteração 11"> Iteração 11</label>
<label><input type="checkbox" name="rf-iteration" value="Não definida"> Não definida</label>
</details>

<details class="rf-filter-dropdown" open>
<summary>Característica de produto</summary>
<label><input type="checkbox" name="rf-product" value="CP01"> CP01 — Registro Categorizado dos Treinos</label>
<label><input type="checkbox" name="rf-product" value="CP02"> CP02 — Estruturador de Periodização Esportiva</label>
<label><input type="checkbox" name="rf-product" value="CP03"> CP03 — Dashboard Analítico</label>
<label><input type="checkbox" name="rf-product" value="CP04"> CP04 — Geração Automática de Relatórios</label>
<label><input type="checkbox" name="rf-product" value="CP05"> CP05 — Controle de Perfis de Acesso</label>
</details>
</div>

<label class="rf-filter-search-label" for="rf-filter-input">Buscar requisito</label>
<input id="rf-filter-input" class="rf-filter-search" type="search" placeholder="Digite código, título ou palavra-chave..." autocomplete="off">

<p id="rf-filter-result" role="status" aria-live="polite"></p>

</div>

<div class="rf-cards" markdown>



<details id="rf01" markdown>
<summary>RF01 · Cadastrar macrociclo<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 07</span><span>Produto: CP02</span></span></summary>



**Declaração RF:** **Cadastrar macrociclo:** o sistema deve permitir que a equipe técnica cadastre um novo macrociclo, informando campos como nome, data de início e data de fim para organizar a periodização dos treinos.


**Declaração US:** Como membro da equipe técnica, eu quero cadastrar um novo macrociclo com nome e data de início, para organizar o planejamento geral da periodização dos treinos.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP02**](solucao-proposta.md#cp02) | [**OE2**](solucao-proposta.md#oe2), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Dado que preencho um nome, data de início e data de fim, quando salvo, o sistema deve criar o ciclo raiz da temporada.
- Se os campos obrigatórios não forem preenchidos, o sistema deve exibir alerta e impedir o cadastro.
- Se a data de fim for antes da data da inicio, o sistema deve exibir alerta e impedir o cadastro.

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 07](evidencias-ciclos/EV_C1.md)

</details>

<details id="rf02" markdown>
<summary>RF02 · Editar macrociclo<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 07</span><span>Produto: CP02</span></span></summary>



**Declaração RF:** **Editar macrociclo:** o sistema deve permitir que a equipe técnica edite os dados de um macrociclo anteriormente cadastrado.


**Declaração US:** Como membro da equipe técnica, eu quero editar os dados de um macrociclo, para corrigir informações ou atualizar o planejamento geral.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP02**](solucao-proposta.md#cp02) | [**OE2**](solucao-proposta.md#oe2), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Dado que seleciono um macrociclo existente, quando altero o nome, data de início ou data de fim e salvo, as modificações devem refletir na visualização da temporada.
- A edição das datas não deve quebrar a hierarquia dos ciclos filhos já vinculados nem permitir data de fim anterior à data de início.

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 07](evidencias-ciclos/EV_C1.md)

</details>

<details id="rf03" markdown>
<summary>RF03 · Excluir macrociclo<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP02</span></span></summary>



**Declaração RF:** **Excluir macrociclo:** o sistema deve permitir que a equipe técnica exclua um macrociclo cadastrado, removendo-o da estrutura de periodização.


**Declaração US:** Como membro da equipe técnica, eu quero excluir um macrociclo, para remover estruturas de periodização que não serão mais utilizadas.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP02**](solucao-proposta.md#cp02) | [**OE2**](solucao-proposta.md#oe2), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [] A User Story está rastreável
- [x] A User Story está mensurável
- [] A User Story foi prototipada
- [] A User Story foi validada com o cliente

</details>

<details id="rf04" markdown>
<summary>RF04 · Cadastrar mesociclo<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 07</span><span>Produto: CP02</span></span></summary>



**Declaração RF:** **Cadastrar mesociclo:** o sistema deve permitir que a equipe técnica cadastre um novo mesociclo vinculado a um macrociclo existente, informando o nome, data de inicio e data de fim do mesociclo.


**Declaração US:** Como membro da equipe técnica, eu quero cadastrar um novo mesociclo vinculado a um macrociclo, para estruturar as fases intermediárias da periodização esportiva.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP02**](solucao-proposta.md#cp02) | [**OE2**](solucao-proposta.md#oe2), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 3,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Dado que possuo um macrociclo ativo, quando preencho os dados do mesociclo (nome, data de início, data de término) e indico seu macrociclo pai, então ele deve ser salvo com sucesso.
- Se não houver macrociclo prévio selecionado ou ativo, o sistema deve exibir alerta e impedir o cadastro.

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 07](evidencias-ciclos/EV_C1.md)

</details>

<details id="rf05" markdown>
<summary>RF05 · Editar mesociclo<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 07</span><span>Produto: CP02</span></span></summary>



**Declaração RF:** **Editar mesociclo:** o sistema deve permitir que a equipe técnica edite os dados de um mesociclo anteriormente cadastrado.


**Declaração US:** Como membro da equipe técnica, eu quero editar os dados de um mesociclo, para manter as fases do planejamento atualizadas.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP02**](solucao-proposta.md#cp02) | [**OE2**](solucao-proposta.md#oe2), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 3,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Ao alterar o nome, data de início, data de fim de um mesociclo, o sistema deve aplicar a atualização mantendo sua posição e vínculos intactos na árvore da periodização.
- A edição não pode desvincular o mesociclo do seu macrociclo pai.

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 07](evidencias-ciclos/EV_C1.md)

</details>

<details id="rf06" markdown>
<summary>RF06 · Excluir mesociclo<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP02</span></span></summary>



**Declaração RF:** **Excluir mesociclo:** o sistema deve permitir que a equipe técnica exclua um mesociclo cadastrado.


**Declaração US:** Como membro da equipe técnica, eu quero Excluir mesociclo, para remover fases da periodização que foram canceladas.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP02**](solucao-proposta.md#cp02) | [**OE2**](solucao-proposta.md#oe2), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [] A User Story está rastreável
- [x] A User Story está mensurável
- [] A User Story foi prototipada
- [] A User Story foi validada com o cliente

</details>

<details id="rf07" markdown>
<summary>RF07 · Cadastrar microciclo<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 07</span><span>Produto: CP02</span></span></summary>



**Declaração RF:** **Cadastrar microciclo:** o sistema deve permitir que a equipe técnica cadastre um novo microciclo vinculado a um mesociclo existente, informando o nome do microciclo, data de inicio e data de fim.


**Declaração US:** Como membro da equipe técnica, eu quero cadastrar um novo microciclo vinculado a um mesociclo, para organizar a rotina de treinos.
<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP02**](solucao-proposta.md#cp02) | [**OE2**](solucao-proposta.md#oe2), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 4,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Dado que existe um mesociclo ativo, quando informo o nome, data de início e data de fim do microciclo  e salvo, o registro deve ser efetuado na árvore de periodização.
- Se não houver mesociclo prévio selecionado, o sistema deve exibir alerta e impedir o cadastro.
- Se os campos  nome, data de início e data de fim não forem preenchidos, o sistema deve exibir alerta e impedir o cadastro.

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 07](evidencias-ciclos/EV_C1.md)

</details>

<details id="rf08" markdown>
<summary>RF08 · Editar microciclo<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 07</span><span>Produto: CP02</span></span></summary>



**Declaração RF:** **Editar microciclo:** o sistema deve permitir que a equipe técnica edite os dados de um microciclo anteriormente cadastrado.


**Declaração US:** Como membro da equipe técnica, eu quero editar um microciclo, para ajustar o planejamento de curto prazo conforme a necessidade da equipe.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP02**](solucao-proposta.md#cp02) | [**OE2**](solucao-proposta.md#oe2), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 4,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Dado que altero as informações de um microciclo salvo, o sistema deve atualizar os dados de exibição sem desconectar as sessões de treino atreladas a ele.

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 07](evidencias-ciclos/EV_C1.md)

</details>

<details id="rf09" markdown>
<summary>RF09 · Excluir microciclo<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP02</span></span></summary>



**Declaração RF:** **Excluir microciclo:** o sistema deve permitir que a equipe técnica exclua um microciclo cadastrado.


**Declaração US:** Como membro da equipe técnica,eu quero excluir um microciclo, para descartar planejamentos inválidos.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP02**](solucao-proposta.md#cp02) | [**OE2**](solucao-proposta.md#oe2), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

</details>

<details id="rf10" markdown>
<summary>RF10 · Cadastrar princípio tático<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 08</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Cadastrar princípio tático:** o sistema deve permitir que a equipe técnica cadastre um princípio tático (ex: ofensivo, defensivo), para uso nas atividades.


**Declaração US:** Como membro da equipe técnica, eu quero cadastrar um princípio tático (ex: ofensivo, defensivo), para vinculá-lo às atividades.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Ao inserir um nome de comportamento, ele deve ser salvo e disponibilizado nas listas de seleção (dropdowns táticos) durante o cadastro de atividades.
- O sistema não deve permitir o cadastro de comportamentos com o exato mesmo nome (duplicidade).

**Regras de Negócio Associadas**

- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 08](evidencias-ciclos/EV_C2.md)

</details>

<details id="rf11" markdown>
<summary>RF11 · Editar princípio tático<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 08</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Editar princípio tático:** o sistema deve permitir que a equipe técnica edite um princípio tático já cadastrado.


**Declaração US:** Como membro da equipe técnica, eu quero editar um princípio tático, para corrigir sua nomenclatura ou ajustar os detalhes técnicos.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Ao corrigir o nome do princípio tático no catálogo, as atividades já salvas que o utilizam devem exibir o nome atualizado automaticamente.

**Regras de Negócio Associadas**

- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 08](evidencias-ciclos/EV_C2.md)

</details>

<details id="rf12" markdown>
<summary>RF12 · Excluir comportamento<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Excluir comportamento:** o sistema deve permitir que a equipe técnica exclua um princípio tático cadastrado.


**Declaração US:** Como membro da equipe técnica, eu quero excluir um princípio tático, para remover opções obsoletas.
<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- Nenhuma regra de negócio associada a este requisito.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

</details>

<details id="rf13" markdown>
<summary>RF13 · Cadastrar atividade na sessão<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 08</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Cadastrar atividade na sessão:** o sistema deve permitir que a equipe técnica cadastre uma nova atividade diretamente em uma sessão, sem necessidade de ela já existir na biblioteca, informando seus dados invariáveis (tipologia e tipo de SSP) e, de forma opcional, o espaço, a orientação, o comportamento, e o momento e fase do jogo trabalhados.


**Declaração US:** Como membro da equipe técnica, eu quero cadastrar uma nova atividade informando sua tipologia e tipo de SSP, para estruturar os exercícios da equipe.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- O sistema deve calcular automaticamente a Área (m²/jogador) ao inserir dimensões (Comprimento e Largura) e o Número de Jogadores.
- O sistema deve classificar automaticamente a dimensão do espaço no ato do cadastro com base na área calculada.
- Atividades salvas com o mesmo número de "ordem" devem ser agrupadas e tratadas como eventos simultâneos na exibição.
- Os campos relacionados aos momentos do jogo, fases do jogo, princípios táticos e atributos técnicos devem permitir salvamento vazios (opcionais).

**Regras de Negócio Associadas**

- **[RN01](#rn01) · Cálculo da Área por Jogador:** A área por jogador em metros quadrados é calculada pela fórmula:<br><br><code>Área (m²/jogador) = (Comprimento × Largura) ÷ Nº de Jogadores</code><br><br>Obrigatório para atividades com orientação de **Aquisição**, **Aplicação** e **Equilíbrio de Carga**. Dispensado para atividades de **PDI** (Proposta de Desenvolvimento Individual), nas quais comprimento, largura e jogadores são opcionais.
- **[RN02](#rn02) · Classificação Automática da Dimensão do Espaço:** A dimensão do espaço não é digitada pelo usuário, sendo classificada automaticamente pelo sistema a partir do resultado da cálculo da área por jogador:<br>• <strong>≤ 100 m²:</strong> Espaço Reduzido (Pequeno)<br>• <strong>101 a 200 m²:</strong> Espaço Médio<br>• <strong>> 200 m²:</strong> Espaço Amplo (Grande)<br>• <strong>Sem dimensões delimitadas (ex.: PDI):</strong> Não Definido
- **[RN03](#rn03) · Simultaneidade e Contagem de Tempo da Sessão:** Atividades cadastradas com o mesmo número no campo **ordem** dentro de uma sessão (ex.: duas atividades com Ordem = 1) ocorrem de forma **simultânea** (elenco dividido em subgrupos). No cálculo da duração líquida da sessão, o tempo de atividades simultâneas é contabilizado **uma única vez** (ex.: duas atividades de 20 minutos com mesma ordem somam 20 minutos à sessão, e não 40). No contador de execuções, o par (Sessão + Ordem) conta como 1 execução.
- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF03](#rnf03) · Eficiência no Cadastro de Treinos:** O sistema deve possuir fluxos de tela com tempo máximo de preenchimento dos dados inferior ao tempo atual de 4 minutos e meio para o preenchimento dos dados. Como objetivo, o sistema deve garantir que o processo de registro de um novo treino seja concluído pelo treinador em menos de 2 minutos.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 08](evidencias-ciclos/EV_C2.md)

</details>

<details id="rf14" markdown>
<summary>RF14 · Editar atividade na sessão<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 09</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Editar atividade na sessão:** o sistema deve permitir que a equipe técnica edite os dados de uma atividade incluída em uma sessão, sem alterar a atividade correspondente na biblioteca.


**Declaração US:** Como membro da equipe técnica, eu quero editar os dados invariáveis de uma atividade, para corrigir e atualizar detalhes do exercício.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Ao alterar as dimensões do campo ou o número de jogadores, o sistema deve recalcular instantaneamente a área por jogador e atualizar a classificação do espaço.
- Ao alterar o campo "ordem" da atividade, a interface e o banco devem reagrupar ou separar as atividades simultâneas afetando o tempo total.

**Regras de Negócio Associadas**

- **[RN01](#rn01) · Cálculo da Área por Jogador:** A área por jogador em metros quadrados é calculada pela fórmula:<br><br><code>Área (m²/jogador) = (Comprimento × Largura) ÷ Nº de Jogadores</code><br><br>Obrigatório para atividades com orientação de **Aquisição**, **Aplicação** e **Equilíbrio de Carga**. Dispensado para atividades de **PDI** (Proposta de Desenvolvimento Individual), nas quais comprimento, largura e jogadores são opcionais.
- **[RN02](#rn02) · Classificação Automática da Dimensão do Espaço:** A dimensão do espaço não é digitada pelo usuário, sendo classificada automaticamente pelo sistema a partir do resultado da cálculo da área por jogador:<br>• <strong>≤ 100 m²:</strong> Espaço Reduzido (Pequeno)<br>• <strong>101 a 200 m²:</strong> Espaço Médio<br>• <strong>> 200 m²:</strong> Espaço Amplo (Grande)<br>• <strong>Sem dimensões delimitadas (ex.: PDI):</strong> Não Definido
- **[RN03](#rn03) · Simultaneidade e Contagem de Tempo da Sessão:** Atividades cadastradas com o mesmo número no campo **ordem** dentro de uma sessão (ex.: duas atividades com Ordem = 1) ocorrem de forma **simultânea** (elenco dividido em subgrupos). No cálculo da duração líquida da sessão, o tempo de atividades simultâneas é contabilizado **uma única vez** (ex.: duas atividades de 20 minutos com mesma ordem somam 20 minutos à sessão, e não 40). No contador de execuções, o par (Sessão + Ordem) conta como 1 execução.
- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 09](evidencias-ciclos/EV_C3.md)

</details>

<details id="rf15" markdown>
<summary>RF15 · Excluir atividade na sessão<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Excluir atividade na sessão:** o sistema deve permitir que a equipe técnica exclua uma atividade de uma sessão, sem afetar o registro dela na biblioteca.


**Declaração US:** Como membro da equipe técnica, eu quero excluir uma atividade cadastrada, para manter o banco de exercícios organizado.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- Nenhuma regra de negócio associada a este requisito.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

</details>

<details id="rf16" markdown>
<summary>RF16 · Cadastrar sessão<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 08</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Cadastrar sessão:** o sistema deve permitir que a equipe técnica cadastre uma nova sessão de treino vinculada à periodização (macrociclo, mesociclo e microciclo), contendo a data e o número sequencial da sessão.


**Declaração US:** Como membro da equipe técnica, eu quero cadastrar uma nova sessão de treino vinculada à periodização com data e sequência, para cadastrar as atividades de um dia específico.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- O sistema só deve salvar o cadastro da sessão se ela estiver corretamente vinculada a um microciclo válido.
- O tempo líquido total da sessão deve ser calculado automaticamente pelo somatório da duração das atividades inseridas nela.
- Se a sessão possuir atividades marcadas com o mesmo número de ordem, a duração da maior atividade assumirá o bloco de tempo, sem duplicar a contagem.

**Regras de Negócio Associadas**

- **[RN03](#rn03) · Simultaneidade e Contagem de Tempo da Sessão:** Atividades cadastradas com o mesmo número no campo **ordem** dentro de uma sessão (ex.: duas atividades com Ordem = 1) ocorrem de forma **simultânea** (elenco dividido em subgrupos). No cálculo da duração líquida da sessão, o tempo de atividades simultâneas é contabilizado **uma única vez** (ex.: duas atividades de 20 minutos com mesma ordem somam 20 minutos à sessão, e não 40). No contador de execuções, o par (Sessão + Ordem) conta como 1 execução.
- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF03](#rnf03) · Eficiência no Cadastro de Treinos:** O sistema deve possuir fluxos de tela com tempo máximo de preenchimento dos dados inferior ao tempo atual de 4 minutos e meio para o preenchimento dos dados. Como objetivo, o sistema deve garantir que o processo de registro de um novo treino seja concluído pelo treinador em menos de 2 minutos.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 08](evidencias-ciclos/EV_C2.md)

</details>

<details id="rf17" markdown>
<summary>RF17 · Editar sessão<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 08</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Editar sessão:** o sistema deve permitir que a equipe técnica edite os dados de uma sessão de treino já cadastrada.


**Declaração US:** Como membro da equipe técnica, eu quero editar os dados de uma sessão de treino, para ajustar a data ou numeração do treino caso haja mudanças.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- A alteração de data, nome, mês deve salvar com sucesso e refletir imediatamente nos gráficos que agrupam esses dados.
- Alterar ou remover atividades dentro desta edição deve disparar o recálculo imediato do tempo total da sessão.

**Regras de Negócio Associadas**

- **[RN03](#rn03) · Simultaneidade e Contagem de Tempo da Sessão:** Atividades cadastradas com o mesmo número no campo **ordem** dentro de uma sessão (ex.: duas atividades com Ordem = 1) ocorrem de forma **simultânea** (elenco dividido em subgrupos). No cálculo da duração líquida da sessão, o tempo de atividades simultâneas é contabilizado **uma única vez** (ex.: duas atividades de 20 minutos com mesma ordem somam 20 minutos à sessão, e não 40). No contador de execuções, o par (Sessão + Ordem) conta como 1 execução.
- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 08](evidencias-ciclos/EV_C2.md)

</details>

<details id="rf18" markdown>
<summary>RF18 · Excluir sessão<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Excluir sessão:** o sistema deve permitir que a equipe técnica exclua uma sessão de treino cadastrada.


**Declaração US:** Como membro da equipe técnica, eu quero excluir uma sessão de treino, para remover um treino que foi cancelado ou registrado incorretamente.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [] A User Story está rastreável
- [x] A User Story está mensurável
- [] A User Story foi prototipada
- [] A User Story foi validada com o cliente

</details>

<details id="rf19" markdown>
<summary>RF19 · Cadastrar atividade na biblioteca<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 08</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Cadastrar atividade na biblioteca:** o sistema deve permitir que a equipe técnica cadastre uma atividade na biblioteca de treinos, independentemente do cadastro em uma sessão específica, para que ela fique disponível para reutilização futura, informando seus dados invariáveis (tipologia e tipo de SSP) e, de forma opcional, o espaço, a orientação, o comportamento, e o momento e fase do jogo trabalhados.


**Declaração US:** Como membro da equipe técnica, eu quero cadastrar atividades diretamente na biblioteca de treinos, para deixá-las disponíveis para reutilização futura sem precisar atrelá-las imediatamente a uma sessão.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 3,00 | Complexidade: 3,00 | Conhecimento: 3,00 | Esforço Técnico: 3,00 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- Ao preencher os dados de uma nova atividade na área "Biblioteca", o sistema deve aplicar o cálculo automático de área e classificar a dimensão, salvando de forma independente no catálogo.
- A atividade pode ser salva mantendo campos de momento de jogo, atributos técnicos, princípios táticos, fases de jogo totalmente em branco (opcionais).

**Regras de Negócio Associadas**

- **[RN01](#rn01) · Cálculo da Área por Jogador:** A área por jogador em metros quadrados é calculada pela fórmula:<br><br><code>Área (m²/jogador) = (Comprimento × Largura) ÷ Nº de Jogadores</code><br><br>Obrigatório para atividades com orientação de **Aquisição**, **Aplicação** e **Equilíbrio de Carga**. Dispensado para atividades de **PDI** (Proposta de Desenvolvimento Individual), nas quais comprimento, largura e jogadores são opcionais.
- **[RN02](#rn02) · Classificação Automática da Dimensão do Espaço:** A dimensão do espaço não é digitada pelo usuário, sendo classificada automaticamente pelo sistema a partir do resultado da cálculo da área por jogador:<br>• <strong>≤ 100 m²:</strong> Espaço Reduzido (Pequeno)<br>• <strong>101 a 200 m²:</strong> Espaço Médio<br>• <strong>> 200 m²:</strong> Espaço Amplo (Grande)<br>• <strong>Sem dimensões delimitadas (ex.: PDI):</strong> Não Definido
- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 08](evidencias-ciclos/EV_C2.md)

</details>

<details id="rf20" markdown>
<summary>RF20 · Editar atividade na biblioteca<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 08</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Editar atividade na biblioteca:** o sistema deve permitir que a equipe técnica edite uma atividade cadastrada na biblioteca de treinos.


**Declaração US:** Como membro da equipe técnica, eu quero editar uma atividade na biblioteca de treinos, para melhorar ou corrigir a descrição base do exercício.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 3,00 | Complexidade: 3,00 | Conhecimento: 3,00 | Esforço Técnico: 3,00 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- Modificar valores como comprimento, largura ou número sugerido de jogadores deve engatilhar o recálculo e a reclassificação automática de dimensão do espaço na biblioteca.
- Atividades já importadas para sessões de treino passadas não devem sofrer alterações retroativas com esta edição.

**Regras de Negócio Associadas**

- **[RN01](#rn01) · Cálculo da Área por Jogador:** A área por jogador em metros quadrados é calculada pela fórmula:<br><br><code>Área (m²/jogador) = (Comprimento × Largura) ÷ Nº de Jogadores</code><br><br>Obrigatório para atividades com orientação de **Aquisição**, **Aplicação** e **Equilíbrio de Carga**. Dispensado para atividades de **PDI** (Proposta de Desenvolvimento Individual), nas quais comprimento, largura e jogadores são opcionais.
- **[RN02](#rn02) · Classificação Automática da Dimensão do Espaço:** A dimensão do espaço não é digitada pelo usuário, sendo classificada automaticamente pelo sistema a partir do resultado da cálculo da área por jogador:<br>• <strong>≤ 100 m²:</strong> Espaço Reduzido (Pequeno)<br>• <strong>101 a 200 m²:</strong> Espaço Médio<br>• <strong>> 200 m²:</strong> Espaço Amplo (Grande)<br>• <strong>Sem dimensões delimitadas (ex.: PDI):</strong> Não Definido
- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 08](evidencias-ciclos/EV_C2.md)

</details>

<details id="rf21" markdown>
<summary>RF21 · Excluir atividade na biblioteca<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Excluir atividade na biblioteca:** o sistema deve permitir que a equipe técnica exclua uma atividade cadastrada na biblioteca de treinos.


**Declaração US:** Como membro da equipe técnica, eu quero excluir uma atividade da biblioteca, para limpar exercícios que não são mais utilizados.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 3,00 | Complexidade: 3,00 | Conhecimento: 3,00 | Esforço Técnico: 3,00 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- Nenhuma regra de negócio associada a este requisito.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

</details>

<details id="rf22" markdown>
<summary>RF22 · Exibir indicador de treino<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 09</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Exibir indicador de treino:** o sistema deve exibir, para a equipe técnica, indicadores como número de sessões, minutos totais de treino, variabilidade de exercícios e número de execuções.


**Declaração US:** Como membro da equipe técnica, eu quero visualizar indicadores de treino (número de sessões, minutos totais, variabilidade de exercícios, execuções), para acompanhar rapidamente o volume geral de trabalho.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 3,00 | Esforço Técnico: 2,33 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- O card de "Minutos Totais" deve expor o tempo líquido, desconsiderando tempos sobrepostos decorrentes de atividades simultâneas na mesma sessão.
- O card de "Variabilidade" deve calcular e expor o número de exercícios distintos em relação ao total de execuções.
- Se o período filtrado não possuir sessões ou dados cadastrados, exibir marcações limpas como "0" ou estados vazios padronizados sem gerar erro.

**Regras de Negócio Associadas**

- **[RN03](#rn03) · Simultaneidade e Contagem de Tempo da Sessão:** Atividades cadastradas com o mesmo número no campo **ordem** dentro de uma sessão (ex.: duas atividades com Ordem = 1) ocorrem de forma **simultânea** (elenco dividido em subgrupos). No cálculo da duração líquida da sessão, o tempo de atividades simultâneas é contabilizado **uma única vez** (ex.: duas atividades de 20 minutos com mesma ordem somam 20 minutos à sessão, e não 40). No contador de execuções, o par (Sessão + Ordem) conta como 1 execução.
- **[RN06](#rn06) · Cálculo da Variabilidade de Treinos:** O índice percentual de rotatividade de exercícios em um determinado período é calculado por:<br><br><code>Variabilidade (%) = (Atividades Distintas no Período ÷ Total de Execuções no Período) × 100</code><br><br>Faixa de referência metodológica estipulada pelo treinador: entre 50% e 70% (cada atividade repetida em média de 1 a 2 vezes no ciclo).
- **[RN07](#rn07) · Tratamento e Estabilidade em Consultas com Resultado Vazio:** Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 09](evidencias-ciclos/EV_C3.md)

</details>

<details id="rf23" markdown>
<summary>RF23 · Reutilizar atividade cadastrada<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 08</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Reutilizar atividade cadastrada:** o sistema deve permitir que a equipe técnica adicione a uma sessão de treino uma atividade já cadastrada na biblioteca, preenchendo automaticamente, no momento da seleção, os campos inerentes à atividade.


**Declaração US:** Como membro da equipe técnica, eu quero adicionar a uma sessão uma atividade já existente na biblioteca com preenchimento automático de campos inerentes, para agilizar a montagem do treino.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Ao selecionar uma atividade via lista da biblioteca durante o fluxo de cadastro da sessão, os campos descritivos e métricos já configurados devem ser populados automaticamente.
- Após a importação, o sistema deve permitir ao usuário editar as informações da atividade (sem alterar a matriz original na biblioteca).

**Regras de Negócio Associadas**

- **[RN01](#rn01) · Cálculo da Área por Jogador:** A área por jogador em metros quadrados é calculada pela fórmula:<br><br><code>Área (m²/jogador) = (Comprimento × Largura) ÷ Nº de Jogadores</code><br><br>Obrigatório para atividades com orientação de **Aquisição**, **Aplicação** e **Equilíbrio de Carga**. Dispensado para atividades de **PDI** (Proposta de Desenvolvimento Individual), nas quais comprimento, largura e jogadores são opcionais.
- **[RN02](#rn02) · Classificação Automática da Dimensão do Espaço:** A dimensão do espaço não é digitada pelo usuário, sendo classificada automaticamente pelo sistema a partir do resultado da cálculo da área por jogador:<br>• <strong>≤ 100 m²:</strong> Espaço Reduzido (Pequeno)<br>• <strong>101 a 200 m²:</strong> Espaço Médio<br>• <strong>> 200 m²:</strong> Espaço Amplo (Grande)<br>• <strong>Sem dimensões delimitadas (ex.: PDI):</strong> Não Definido

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF03](#rnf03) · Eficiência no Cadastro de Treinos:** O sistema deve possuir fluxos de tela com tempo máximo de preenchimento dos dados inferior ao tempo atual de 4 minutos e meio para o preenchimento dos dados. Como objetivo, o sistema deve garantir que o processo de registro de um novo treino seja concluído pelo treinador em menos de 2 minutos.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 08](evidencias-ciclos/EV_C2.md)

</details>

<details id="rf24" markdown>
<summary>RF24 · Consultar informação de atividade do treino<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 09</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Consultar informação de atividade do treino:** o sistema deve permitir que a equipe técnica consulte, em gráfico e por meio de filtro, a informação de atividade, atualizando automaticamente as informações exibidas.


**Declaração US:** Como membro da equipe técnica, eu quero filtrar as informações de atividade do treino, para consultar rapidamente um conjunto de atividades específicas executadas ou planejadas.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 3,00 | Complexidade: 3,00 | Conhecimento: 3,00 | Esforço Técnico: 3,00 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- O usuário deve conseguir visualizar um gráfico com as atividades executadas.
- Quando os parâmetros de filtro selecionados não retornarem nenhuma correspondência, o sistema deve apresentar um layout de estado vazio em vez de mensagens de erro cruas.

**Regras de Negócio Associadas**

- **[RN07](#rn07) · Tratamento e Estabilidade em Consultas com Resultado Vazio:** Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 09](evidencias-ciclos/EV_C3.md)

</details>

<details id="rf25" markdown>
<summary>RF25 · Gerar relatório de treino<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 10</span><span>Produto: CP04</span></span></summary>



**Declaração RF:** **Gerar relatório de treino:** o sistema deve permitir que a equipe técnica gere um relatório do treino em formato PDF.


**Declaração US:** Como membro da equipe técnica, eu quero gerar um relatório da sessão em formato PDF, para conseguir compartilhar a análise com a comissão técnica.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP04**](solucao-proposta.md#cp04) | [**OE4**](solucao-proposta.md#oe4), [**OE3**](solucao-proposta.md#oe3)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 4,00 | Complexidade: 4,00 | Conhecimento: 4,00 | Esforço Técnico: 4,00 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- Ao solicitar a geração do relatório em um período com sessões cadastradas, o sistema deve compilar as informações dos treinos e disponibilizar o arquivo em formato PDF para download.
- Se o período selecionado não possuir nenhuma sessão de treino registrada, o sistema não deve emitir relatório em branco nem disparar erro, apresentando a notificação: `"Não há registros de treinos no período selecionado para compor o relatório."`

**Regras de Negócio Associadas**

- **[RN02](#rn02) · Classificação Automática da Dimensão do Espaço:** A dimensão do espaço não é digitada pelo usuário, sendo classificada automaticamente pelo sistema a partir do resultado da cálculo da área por jogador:<br>• <strong>≤ 100 m²:</strong> Espaço Reduzido (Pequeno)<br>• <strong>101 a 200 m²:</strong> Espaço Médio<br>• <strong>> 200 m²:</strong> Espaço Amplo (Grande)<br>• <strong>Sem dimensões delimitadas (ex.: PDI):</strong> Não Definido
- **[RN03](#rn03) · Simultaneidade e Contagem de Tempo da Sessão:** Atividades cadastradas com o mesmo número no campo **ordem** dentro de uma sessão (ex.: duas atividades com Ordem = 1) ocorrem de forma **simultânea** (elenco dividido em subgrupos). No cálculo da duração líquida da sessão, o tempo de atividades simultâneas é contabilizado **uma única vez** (ex.: duas atividades de 20 minutos com mesma ordem somam 20 minutos à sessão, e não 40). No contador de execuções, o par (Sessão + Ordem) conta como 1 execução.
- **[RN07](#rn07) · Tratamento e Estabilidade em Consultas com Resultado Vazio:** Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 10](evidencias-ciclos/EV_C4.md)

</details>

<details id="rf26" markdown>
<summary>RF26 · Alternar unidade de tempo<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 10</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Alternar unidade de tempo:** o sistema deve permitir que a equipe técnica alterne, nos gŕaficos, a visualização do tempo das atividades entre tempo absoluto (em minutos) e tempo relativo (em porcentagem do tempo total da sessão).


**Declaração US:** Como membro da equipe técnica, eu quero alternar o tempo da atividade entre valor absoluto (minutos) e relativo (porcentagem), para entender melhor o peso do exercício no contexto geral da sessão.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Ao selecionar a opção de tempo absoluto, o sistema deve atualizar imediatamente os gráficos exibindo a minutagem bruta em minutos (`min`).
- Ao alternar para a opção de tempo relativo, o sistema deve recalcular as proporções e exibir os valores em porcentagem (`%`) em relação ao tempo total da sessão ou período filtrado.
- A alternância entre minutos e porcentagem deve preservar os filtros aplicados de periodização (mesociclo, microciclo, mês e sessão) sem recarregar a tela.

**Regras de Negócio Associadas**

- **[RN03](#rn03) · Simultaneidade e Contagem de Tempo da Sessão:** Atividades cadastradas com o mesmo número no campo **ordem** dentro de uma sessão (ex.: duas atividades com Ordem = 1) ocorrem de forma **simultânea** (elenco dividido em subgrupos). No cálculo da duração líquida da sessão, o tempo de atividades simultâneas é contabilizado **uma única vez** (ex.: duas atividades de 20 minutos com mesma ordem somam 20 minutos à sessão, e não 40). No contador de execuções, o par (Sessão + Ordem) conta como 1 execução.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 10](evidencias-ciclos/EV_C4.md)

</details>

<details id="rf27" markdown>
<summary>RF27 · Criar conta<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 09</span><span>Produto: CP05</span></span></summary>



**Declaração RF:** **Criar conta:** o sistema deve permitir que a equipe técnica crie uma conta de acesso à aplicação.


**Declaração US:** Como membro da equipe técnica, eu quero criar uma conta de acesso na aplicação, para ter um perfil dedicado e seguro para gerenciar meu planejamento.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP05**](solucao-proposta.md#cp05) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 3,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 3,00 | Conhecimento: 2,00 | Esforço Técnico: 2,33 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- O preenchimento de e-mail e criação de senha válidos deve persistir o usuário na base de dados de forma criptografada.
- Se o usuário tentar cadastrar um e-mail já existente na plataforma, o sistema deve retornar um alerta de e-mail duplicado ou em uso.

**Regras de Negócio Associadas**

- Nenhuma regra de negócio associada a este requisito.

**Requisitos Não Funcionais Associados**

- **[RNF01](#rnf01) · Proteção de Dados Pessoais dos Atletas:** O sistema deve utilizar a aplicação de hash irreversível de senhas via bcrypt para guardar as senhas dos usuários.
- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 09](evidencias-ciclos/EV_C3.md)

</details>

<details id="rf28" markdown>
<summary>RF28 · Fazer login<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 09</span><span>Produto: CP05</span></span></summary>



**Declaração RF:** **Fazer login:** o sistema deve permitir que a equipe técnica se autentique na aplicação a partir de um login e senha de acesso.


**Declaração US:** Como membro da equipe técnica, eu quero fazer login com e-mail e senha, para garantir que os dados sensíveis do time sejam acessados de forma autenticada.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP05**](solucao-proposta.md#cp05) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 3,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 3,00 | Conhecimento: 2,00 | Esforço Técnico: 2,33 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- A submissão de credenciais válidas redireciona o usuário para a página de dashboard de gráficos.
- Credenciais inválidas (senha/e-mail errados ou não encontrados) exibem mensagem de erro e impedem a navegação para rotas internas.

**Regras de Negócio Associadas**

- Nenhuma regra de negócio associada a este requisito.

**Requisitos Não Funcionais Associados**

- **[RNF01](#rnf01) · Proteção de Dados Pessoais dos Atletas:** O sistema deve utilizar a aplicação de hash irreversível de senhas via bcrypt para guardar as senhas dos usuários.
- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 09](evidencias-ciclos/EV_C3.md)

</details>

<details id="rf29" markdown>
<summary>RF29 · Anexar imagem à atividade<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Anexar imagem à atividade:** o sistema deve permitir que a equipe técnica anexe uma imagem a uma atividade cadastrada na biblioteca, exibindo-a junto à atividade na biblioteca e nas sessões de treino em que ela for incluída.


**Declaração US:** Como membro da equipe técnica, eu quero anexar uma imagem à atividade na biblioteca, para reconhecer visualmente o exercício e facilitar sua reutilização.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 3,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- Nenhuma regra de negócio associada a este requisito.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

</details>

<details id="rf30" markdown>
<summary>RF30 · Registrar pontuação da atividade<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Registrar pontuação da atividade:** o sistema deve permitir que a equipe técnica registre, para cada atividade de uma sessão, a pontuação planejada e a pontuação obtida em cada repetição.


**Declaração US:** Como membro da equipe técnica, eu quero registrar a pontuação planejada e a pontuação obtida em cada repetição da atividade, para monitorar a eficácia e o desempenho do grupo na execução.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 2,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q3 Baixo valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- Nenhuma regra de negócio associada a este requisito.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF03](#rnf03) · Eficiência no Cadastro de Treinos:** O sistema deve possuir fluxos de tela com tempo máximo de preenchimento dos dados inferior ao tempo atual de 4 minutos e meio para o preenchimento dos dados. Como objetivo, o sistema deve garantir que o processo de registro de um novo treino seja concluído pelo treinador em menos de 2 minutos.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

</details>

<details id="rf31" markdown>
<summary>RF31 · Gerar análise textual do treino<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Gerar análise textual do treino:** o sistema deve permitir que a equipe técnica gere, com inteligência artificial, uma análise textual (insight) sobre as informações do treino.


**Declaração US:** Como membro da equipe técnica, eu quero gerar insights e análises textuais com inteligência artificial, para obter resumos e observações aprofundadas sobre o andamento dos treinos.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 2,00 | Frequência: 5,00 | Esforço: 3,00 | Complexidade: 4,00 | Conhecimento: 4,00 | Esforço Técnico: 3,67 → Q4 Baixo valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- Nenhuma regra de negócio associada a este requisito.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

</details>

<details id="rf32" markdown>
<summary>RF32 · Registrar atributo técnico da atividade<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 10</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Registrar atributo técnico da atividade:** o sistema deve permitir que a equipe técnica registre, de forma opcional, o atributo técnico trabalhado em uma atividade (ex: domínio orientado, cabeceira defensiva).


**Declaração US:** Como membro da equipe técnica, eu quero registrar atributos técnicos em uma atividade (ex: domínio orientado), para mapear as habilidades fundamentais trabalhadas no exercício.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- Não permitir cadastros de atributos técnicos em branco.
- Permitir o cadastro de mais de um atributo técnico por vez.

**Regras de Negócio Associadas**

- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 10](evidencias-ciclos/EV_C4.md)

</details>

<details id="rf33" markdown>
<summary>RF33 · Editar atributo técnico da atividade<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Editar atributo técnico da atividade:** o sistema deve permitir que a equipe técnica edite um atributo técnico registrado em uma atividade.


**Declaração US:** Como membro da equipe técnica, eu quero editar o atributo técnico de uma atividade, para refletir melhor o foco real do exercício.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

</details>

<details id="rf34" markdown>
<summary>RF34 · Excluir atributo técnico da atividade<span class='rf-summary-status'><span>Entrega: Escopo Adicional</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: N&atilde;o definida</span><span>Produto: CP01</span></span></summary>



**Declaração RF:** **Excluir atributo técnico da atividade:** o sistema deve permitir que a equipe técnica exclua um atributo técnico registrado em uma atividade.


**Declaração US:** Como membro da equipe técnica, eu quero excluir um atributo técnico registrado em uma atividade, para remover classificações que não representam mais o exercício e manter sua análise consistente.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP01**](solucao-proposta.md#cp01) | [**OE1**](solucao-proposta.md#oe1), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 2,00 | Esforço: 2,00 | Complexidade: 2,00 | Conhecimento: 2,00 | Esforço Técnico: 2,00 → Q2 Alto valor / Baixa carga técnica


</div>

**Critérios de Aceitação**

- *Cenários de aceitação a definir.*

**Regras de Negócio Associadas**

- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

</details>

<details id="rf35" markdown>
<summary>RF35 · Consultar informação de espaço do treino<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 10</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Consultar informação de espaço do treino:** o sistema deve permitir que a equipe técnica consulte, em gráfico e por meio de filtro, a informação de espaço do treino, atualizando automaticamente as informações exibidas.


**Declaração US:** Como membro da equipe técnica, eu quero usar filtros para consultar informações sobre o espaço do treino, através dos gráficos, para comparar a distribuição das atividades pelos locais e apoiar decisões sobre a organização dos treinos.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 2,00 | Complexidade: 3,00 | Conhecimento: 2,00 | Esforço Técnico: 2,33 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- O usuário deve conseguir visualizar um gráfico com o tempo distribuído por categoria de espaço das atividades realizadas e filtrar essa visualização por periodização.
- Quando os filtros aplicados não encontrarem atividades com dados no período, a tela deve exibir um estado vazio informativo mantendo os controles de filtro acessíveis.

**Regras de Negócio Associadas**

- **[RN01](#rn01) · Cálculo da Área por Jogador:** A área por jogador em metros quadrados é calculada pela fórmula:<br><br><code>Área (m²/jogador) = (Comprimento × Largura) ÷ Nº de Jogadores</code><br><br>Obrigatório para atividades com orientação de **Aquisição**, **Aplicação** e **Equilíbrio de Carga**. Dispensado para atividades de **PDI** (Proposta de Desenvolvimento Individual), nas quais comprimento, largura e jogadores são opcionais.
- **[RN02](#rn02) · Classificação Automática da Dimensão do Espaço:** A dimensão do espaço não é digitada pelo usuário, sendo classificada automaticamente pelo sistema a partir do resultado da cálculo da área por jogador:<br>• <strong>≤ 100 m²:</strong> Espaço Reduzido (Pequeno)<br>• <strong>101 a 200 m²:</strong> Espaço Médio<br>• <strong>> 200 m²:</strong> Espaço Amplo (Grande)<br>• <strong>Sem dimensões delimitadas (ex.: PDI):</strong> Não Definido
- **[RN07](#rn07) · Tratamento e Estabilidade em Consultas com Resultado Vazio:** Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 10](evidencias-ciclos/EV_C4.md)

</details>

<details id="rf36" markdown>
<summary>RF36 · Consultar informação de momento do jogo do treino<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 11</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Consultar informação de momento do jogo do treino:** o sistema deve permitir que a equipe técnica consulte, em gráfico e por meio de filtro, a informação de momento do jogo do treino, atualizando automaticamente as informações exibidas.


**Declaração US:** Como membro da equipe técnica, eu quero filtrar a informação por momento do jogo treinado, através dos gráficos para avaliar quais momentos de jogos foram abordados nos treinos.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 3,00 | Complexidade: 3,00 | Conhecimento: 3,00 | Esforço Técnico: 3,00 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- Ao aplicar filtros de periodização, o sistema deve consolidar e exibir nos gráficos a distribuição da minutagem nos momentos trabalhados (Ataque, Defesa, Transição Ofensiva, Transição Defensiva e Bola Parada), considerando que uma atividade pode pontuar em mais de um momento.
- Caso o período filtrado não possua atividades com momento do jogo registrado, o sistema deve renderizar o gráfico com visual neutro (`0 min` e `0%`) e exibir a mensagem: `"Sem atividades com momento do jogo no período."`, preservando os filtros aplicados.

**Regras de Negócio Associadas**

- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).
- **[RN07](#rn07) · Tratamento e Estabilidade em Consultas com Resultado Vazio:** Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 11](evidencias-ciclos/EV_C5.md)

</details>

<details id="rf37" markdown>
<summary>RF37 · Consultar informação de fase do jogo do treino<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 11</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Consultar informação de fase do jogo do treino:** o sistema deve permitir que a equipe técnica consulte, em gráfico e por meio de filtro, a informação de fase do jogo do treino, atualizando automaticamente as informações exibidas.


**Declaração US:** Como membro da equipe técnica, eu quero filtrar a informação por fase de jogo, através dos gráficos, para identificar quais fases do jogo foram associadas às atividades.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 3,00 | Complexidade: 3,00 | Conhecimento: 3,00 | Esforço Técnico: 3,00 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- O usuário deve conseguir visualizar um gráfico com a distribuição do tempo por fase do jogo e filtrar os dados exibidos conforme os ciclos selecionados.
- Quando não houver registros de fase do jogo para o filtro escolhido, a interface deve exibir um estado vazio orientador preservando os filtros selecionados.

**Regras de Negócio Associadas**

- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).
- **[RN07](#rn07) · Tratamento e Estabilidade em Consultas com Resultado Vazio:** Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 11](evidencias-ciclos/EV_C5.md)

</details>

<details id="rf38" markdown>
<summary>RF38 · Consultar informação de comportamento do treino<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 10</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Consultar informação de comportamento do treino:** o sistema deve permitir que a equipe técnica consulte, em gráfico e por meio de filtro, a informação de comportamento do treino, atualizando automaticamente as informações exibidas.


**Declaração US:** Como membro da equipe técnica, eu quero filtrar as informações de treino por comportamento, através dos gráficos para saber o quanto trabalhei os comportamentos distintos.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 3,00 | Complexidade: 3,00 | Conhecimento: 3,00 | Esforço Técnico: 3,00 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- Ao selecionar filtros de ciclo ou período, o sistema deve calcular e exibir nos gráficos a distribuição de minutagem dedicada a cada comportamento tático trabalhado (ex: cobertura, contenção, reação pós-perda, amplitude, quebrar linha, abrir o campo).
- Se o período consultado não possuir treinos com comportamentos associados, o sistema deve apresentar os gráficos com visual neutro (`0 min` e `0%`) e exibir a mensagem: `"Sem atividades com comportamento no período."`, mantendo os filtros ativos.

**Regras de Negócio Associadas**

- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).
- **[RN07](#rn07) · Tratamento e Estabilidade em Consultas com Resultado Vazio:** Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [x] A User Story está rastreável
- [x] A User Story está mensurável
- [x] A User Story foi prototipada
- [x] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 10](evidencias-ciclos/EV_C4.md)

</details>

<details id="rf39" markdown>
<summary>RF39 · Consultar informação de atributo técnico do treino<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 11</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Consultar informação de atributo técnico do treino:** o sistema deve permitir que a equipe técnica consulte, em gráfico e por meio de filtro, a informação de atributo técnico, atualizando automaticamente as informações exibidas.


**Declaração US:** Como membro da equipe técnica, eu quero filtrar informações por atributo técnico, através dos gráficos para saber o quanto trabalhei esse atributo.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 3,00 | Complexidade: 3,00 | Conhecimento: 3,00 | Esforço Técnico: 3,00 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- O usuário deve conseguir consultar em gráfico o tempo investido em cada atributo técnico e filtrar os resultados por período ou atributo.
- Quando não houver atividades com atributo técnico no recorte filtrado, a tela deve exibir o estado vazio informativo mantendo os filtros disponíveis para nova busca.

**Regras de Negócio Associadas**

- **[RN05](#rn05) · Preenchimento Condicional pelo Objetivo Central:** O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual).
- **[RN07](#rn07) · Tratamento e Estabilidade em Consultas com Resultado Vazio:** Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 11](evidencias-ciclos/EV_C5.md)

</details>

<details id="rf40" markdown>
<summary>RF40 · Consultar análise comparativa por periodização<span class='rf-summary-status'><span>Entrega: MVP</span><span>Situação: Não concluído</span><span>Itera&ccedil;&atilde;o: Itera&ccedil;&atilde;o 11</span><span>Produto: CP03</span></span></summary>



**Declaração RF:** **Consultar análise comparativa por periodização:** o sistema deve permitir que a equipe técnica consulte, em gráfico e por meio de filtro, a análise comparativa por periodização (mesociclo, microciclo, mês e sessão), atualizando automaticamente as informações exibidas.


**Declaração US:** Como membro da equipe técnica, eu quero realizar uma análise comparativa através dos gráficos de periodização (meso, micro, mês, sessão), para identificar diferenças na carga e na distribuição dos treinos e apoiar o planejamento da equipe.

<div class='rf-meta' markdown>

**CPs e OEs relacionadas:** [**CP03**](solucao-proposta.md#cp03) | [**OE3**](solucao-proposta.md#oe3), [**OE4**](solucao-proposta.md#oe4)

**Priorização:** Valor: 4,00 | Frequência: 5,00 | Esforço: 4,00 | Complexidade: 3,00 | Conhecimento: 3,00 | Esforço Técnico: 3,33 → Q1 Alto valor / Alta carga técnica


</div>

**Critérios de Aceitação**

- O usuário deve conseguir visualizar lado a lado, em gráficos de barras, a comparação do tempo de treino agrupado por **Microciclo**, **Mesociclo**, **Mês** e **Sessão**.
- Ao selecionar uma opção em qualquer um dos filtros disponíveis (**Tipologia da Atividade**, **Dimensão do Espaço**, **Momento de Jogo**, **Fases de Jogo**, **Comportamento** ou **Princípio tático**), os quatro gráficos comparativos e os indicadores superiores devem ser atualizados para refletir apenas as atividades correspondentes.
- O usuário deve conseguir combinar dois ou mais filtros simultaneamente, restringindo a comparação aos treinos que atendam a todos os critérios selecionados, bem como limpar filtros para restaurar o conjunto completo.
- Ao aplicar, alterar ou limpar qualquer filtro, a unidade selecionada no alternador (`Min` ou `%`) deve ser preservada.
- Quando algum recorte selecionado não possuir treinos ou quando a combinação de filtros não retornar correspondências, a interface deve exibir o estado vazio informativo sem impedir a exibição dos demais recortes e mantendo os filtros acessíveis.

**Regras de Negócio Associadas**

- **[RN04](#rn04) · Hierarquia e Integridade da Periodização:** A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade.
- **[RN07](#rn07) · Tratamento e Estabilidade em Consultas com Resultado Vazio:** Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo.

**Requisitos Não Funcionais Associados**

- **[RNF02](#rnf02) · Interface Responsiva e Adaptável:** A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela.
- **[RNF04](#rnf04) · Atualização em Tempo Real do Dashboard:** Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino.

**Definition of Ready (DoR)**

- [x] A estrutura da User Story está bem definida
- [ ] A User Story está rastreável
- [x] A User Story está mensurável
- [ ] A User Story foi prototipada
- [ ] A User Story foi validada com o cliente

**Evidências**

- [Evidências da Iteração 11](evidencias-ciclos/EV_C5.md)

</details>

</div>

<!-- Tabela original dos RFs mantida abaixo como referência de rastreabilidade.

| Identificador | Descrição | Regras de Negócio | CP de origem |
|:---|:---|:---:|:---:|
| **RF01** | **Cadastrar macrociclo:** o sistema deve permitir que a equipe técnica cadastrem um novo macrociclo, informando campos como nome e data de início para organizar a periodização dos treinos. | [RN04](#rn04) | CP02 |
| **RF02** | **Editar macrociclo:** o sistema deve permitir que a equipe técnica editem os dados de um macrociclo anteriormente cadastrado. | [RN04](#rn04) | CP02 |
| **RF03** | **Excluir macrociclo:** o sistema deve permitir que a equipe técnica excluam um macrociclo cadastrado, validando a integridade referencial com os ciclos subordinados. | [RN04](#rn04) | CP02 |
| **RF04** | **Cadastrar mesociclo:** o sistema deve permitir que a equipe técnica cadastrem um novo mesociclo vinculado obrigatoriamente a um macrociclo existente, informando o nome do mesociclo. | [RN04](#rn04) | CP02 |
| **RF05** | **Editar mesociclo:** o sistema deve permitir que a equipe técnica editem os dados de um mesociclo anteriormente cadastrado. | [RN04](#rn04) | CP02 |
| **RF06** | **Excluir mesociclo:** o sistema deve permitir que a equipe técnica excluam um mesociclo cadastrado, tratando as dependências estruturais. | [RN04](#rn04) | CP02 |
| **RF07** | **Cadastrar microciclo:** o sistema deve permitir que a equipe técnica cadastrem um novo microciclo vinculado obrigatoriamente a um mesociclo existente, informando o nome do microciclo. | [RN04](#rn04) | CP02 |
| **RF08** | **Editar microciclo:** o sistema deve permitir que a equipe técnica editem os dados de um microciclo anteriormente cadastrado. | [RN04](#rn04) | CP02 |
| **RF09** | **Excluir microciclo:** o sistema deve permitir que a equipe técnica excluam um microciclo cadastrado. | [RN04](#rn04) | CP02 |
| **RF10** | **Cadastrar princípio tático:** o sistema deve permitir que a equipe técnica cadastrem um princípio tático (ex: ofensivo, defensivo), para uso nas atividades. | [RN05](#rn05) | CP01 |
| **RF11** | **Editar comportamento:** o sistema deve permitir que a equipe técnica editem um princípio tático já cadastrado. | [RN05](#rn05) | CP01 |
| **RF12** | **Excluir comportamento:** o sistema deve permitir que a equipe técnica excluam um princípio tático cadastrado. | - | CP01 |
| **RF13** | **Cadastrar atividade na sessão:** o sistema deve permitir que a equipe técnica cadastrem uma nova atividade diretamente em uma sessão, informando dados invariáveis (tipologia e tipo de SSP) e, de forma opcional, espaço, orientação, comportamento, momento e fase do jogo, calculando a área por jogador ([RN01](#rn01)), atribuindo a dimensão do espaço ([RN02](#rn02)), controlando a simultaneidade ([RN03](#rn03)) e respeitando o foco central ([RN05](#rn05)). | [RN01](#rn01), [RN02](#rn02), [RN03](#rn03), [RN05](#rn05) | CP01 |
| **RF14** | **Editar atividade na sessão:** o sistema deve permitir que a equipe técnica editem os dados de uma atividade incluída em uma sessão, recalculando automaticamente as métricas de espaço ([RN01](#rn01), [RN02](#rn02)) e ordem de simultaneidade ([RN03](#rn03)). | [RN01](#rn01), [RN02](#rn02), [RN03](#rn03), [RN05](#rn05) | CP01 |
| **RF15** | **Excluir atividade na sessão:** o sistema deve permitir que a equipe técnica excluam uma atividade de uma sessão, sem afetar o registro dela na biblioteca. | - | CP01 |
| **RF16** | **Cadastrar sessão:** o sistema deve permitir que a equipe técnica cadastrem uma nova sessão de treino vinculada à periodização (macrociclo, mesociclo e microciclo), contendo a data e o número sequencial da sessão, apurando o tempo real da sessão sem duplicidade de atividades simultâneas ([RN03](#rn03)). | [RN03](#rn03), [RN04](#rn04) | CP01 |
| **RF17** | **Editar sessão:** o sistema deve permitir que a equipe técnica editem os dados de uma sessão de treino já cadastrada, recalculando a duração líquida da sessão ([RN03](#rn03)). | [RN03](#rn03), [RN04](#rn04) | CP01 |
| **RF18** | **Excluir sessão:** o sistema deve permitir que a equipe técnica excluam uma sessão de treino cadastrada. | [RN04](#rn04) | CP01 |
| **RF19** | **Cadastrar atividade na biblioteca:** o sistema deve permitir que a equipe técnica cadastrem uma atividade na biblioteca de treinos para reutilização futura, calculando a área ([RN01](#rn01)), classificando a dimensão ([RN02](#rn02)) e respeitando o objetivo central ([RN05](#rn05)). | [RN01](#rn01), [RN02](#rn02), [RN05](#rn05) | CP01 |
| **RF20** | **Editar atividade na biblioteca:** o sistema deve permitir que a equipe técnica editem uma atividade cadastrada na biblioteca de treinos, atualizando sua classificação de espaço ([RN02](#rn02)). | [RN01](#rn01), [RN02](#rn02), [RN05](#rn05) | CP01 |
| **RF21** | **Excluir atividade na biblioteca:** o sistema deve permitir que a equipe técnica excluam uma atividade cadastrada na biblioteca de treinos. | - | CP01 |
| **RF22** | **Exibir indicador de treino:** o sistema deve exibir indicadores como número de sessões, minutos totais de treino (respeitando simultaneidade da [RN03](#rn03)), índice de variabilidade de exercícios ([RN06](#rn06)), número de execuções e tratamento neutro em períodos sem registros ([RN07](#rn07)). | [RN03](#rn03), [RN06](#rn06), [RN07](#rn07) | CP03 |
| **RF23** | **Reutilizar atividade cadastrada:** o sistema deve permitir que a equipe técnica adicionem a uma sessão de treino uma atividade já cadastrada na biblioteca, recalculando automaticamente as dimensões se forem alteradas ([RN01](#rn01), [RN02](#rn02)). | [RN01](#rn01), [RN02](#rn02) | CP01 |
| **RF24** | **Consultar informação de atividade do treino:** o sistema deve permitir que a equipe técnica consultem, em gráfico e por meio de filtro, a informação de atividade, com atualização automática e visual de estado vazio ([RN07](#rn07)). | [RN07](#rn07) | CP03 |
| **RF25** | **Gerar relatório de treino:** o sistema deve permitir que a equipe técnica gerem relatório em PDF consolidando tempo de sessão ([RN03](#rn03)), variabilidade ([RN06](#rn06)) e notificação orientadora para períodos vazios ([RN07](#rn07)). | [RN02](#rn02), [RN03](#rn03), [RN06](#rn06), [RN07](#rn07) | CP04 |
| **RF26** | **Alternar unidade de tempo:** o sistema deve permitir que a equipe técnica alternem, nos gráficos, a visualização do tempo entre tempo absoluto (minutos) e relativo (porcentagem), calculado a partir do tempo real da sessão ([RN03](#rn03)). | [RN03](#rn03) | CP03 |
| **RF27** | **Criar conta:** o sistema deve permitir que a equipe técnica criem uma conta de acesso à aplicação. | - | CP05 |
| **RF28** | **Fazer login:** o sistema deve permitir que a equipe técnica se autentique na aplicação a partir de um login e senha de acesso. | - | CP05 |
| **RF29** | **Anexar imagem à atividade:** o sistema deve permitir que a equipe técnica anexem uma imagem a uma atividade cadastrada na biblioteca, exibindo-a junto à atividade nas sessões de treino. | - | CP01 |
| **RF30** | **Registrar pontuação da atividade:** o sistema deve permitir que a equipe técnica registrem, para cada atividade de uma sessão, a pontuação planejada e a pontuação obtida em cada repetição. | - | CP03 |
| **RF31** | **Gerar análise textual do treino:** o sistema deve permitir que a equipe técnica gerem, com inteligência artificial, uma análise textual (insight) sobre as informações do treino. | - | CP03 |
| **RF32** | **Registrar atributo técnico da atividade:** o sistema deve permitir registrar, de forma opcional e restrita às atividades com foco técnico ([RN05](#rn05)), o atributo trabalhado (ex: domínio orientado, cabeceio defensivo). | [RN05](#rn05) | CP01 |
| **RF33** | **Editar atributo técnico da atividade:** o sistema deve permitir que a equipe técnica editem um atributo técnico registrado em uma atividade. | [RN05](#rn05) | CP01 |
| **RF34** | **Excluir atributo técnico da atividade:** o sistema deve permitir que a equipe técnica excluam um atributo técnico registrado em uma atividade. | [RN05](#rn05) | CP01 |
| **RF35** | **Consultar informação de espaço do treino:** o sistema deve permitir consultar, em gráfico e filtro, a informação de espaço com base nas faixas da [RN02](#rn02) calculadas pela [RN01](#rn01), com tratamento neutro para ausência de dados ([RN07](#rn07)). | [RN01](#rn01), [RN02](#rn02), [RN07](#rn07) | CP03 |
| **RF36** | **Consultar informação de momento do jogo do treino:** o sistema deve permitir consultar, em gráfico e filtro, a distribuição dos momentos do jogo trabalhados ([RN05](#rn05)), tratando períodos sem registros ([RN07](#rn07)). | [RN05](#rn05), [RN07](#rn07) | CP03 |
| **RF37** | **Consultar informação de fase do jogo do treino:** o sistema deve permitir consultar, em gráfico e filtro, a informação de fase do jogo ([RN05](#rn05)), tratando períodos sem registros ([RN07](#rn07)). | [RN05](#rn05), [RN07](#rn07) | CP03 |
| **RF38** | **Consultar informação de comportamento do treino:** o sistema deve permitir consultar, em gráfico e filtro, a informação de princípio tático ([RN05](#rn05)), tratando períodos sem registros ([RN07](#rn07)). | [RN05](#rn05), [RN07](#rn07) | CP03 |
| **RF39** | **Consultar informação de atributo técnico do treino:** o sistema deve permitir consultar, em gráfico e filtro, a informação de atributos técnicos trabalhados ([RN05](#rn05)), tratando períodos sem registros ([RN07](#rn07)). | [RN05](#rn05), [RN07](#rn07) | CP03 |
| **RF40** | **Consultar análise comparativa por periodização:** o sistema deve permitir consultar a análise comparativa respeitando a hierarquia da periodização ([RN04](#rn04)), com indicativo neutro se um dos ciclos não contiver treinos ([RN07](#rn07)). | [RN04](#rn04), [RN07](#rn07) | CP03 |

-->

---
## 8.2 Requisitos Não Funcionais — RNFs

Os requisitos não funcionais definem as propriedades de qualidade do sistema e os respectivos critérios de verificação.

<div class="rf-cards" markdown>

<details id="rnf01" markdown>
<summary>RNF01 · Segurança e Proteção de Credenciais de Usuários</summary>

**Nome:** Segurança e Proteção de Credenciais de Usuários

**Classificação FURPS+:** Segurança

**Descrição**

O sistema deve armazenar as senhas dos usuários exclusivamente como hash bcrypt com salt, sem armazenamento em texto puro. O acesso aos recursos internos deve exigir autenticação válida, e a comunicação em produção deve ocorrer por HTTPS. O sistema deve armazenar somente os dados pessoais necessários à identificação e autenticação dos operadores, sem cadastro de dados pessoais nominais ou biométricos dos atletas.

**Critérios de Verificação**

- **Proteção das senhas:** cadastrar dois usuários com a mesma senha e verificar no banco que ambos possuem hashes bcrypt distintos, com salt individual, sem armazenamento da senha em texto puro.
- **Controle de acesso:** realizar requisições às APIs protegidas sem autenticação ou com credenciais inválidas e verificar o bloqueio com HTTP 401, sem exposição dos dados internos. Realizar uma requisição com autenticação válida e verificar o acesso aos recursos permitidos.
- **Comunicação segura:** verificar que a comunicação em produção utiliza HTTPS com certificado válido.
- **Escopo dos dados:** inspecionar os modelos, formulários e APIs para confirmar que não são coletados dados pessoais nominais ou biométricos dos atletas.

</details>

<details id="rnf02" markdown>
<summary>RNF02 · Interface Responsiva e Adaptável</summary>

**Nome:** Interface Responsiva e Adaptável

**Classificação FURPS+:** Usabilidade

**Descrição**

A interface deve adaptar automaticamente seu layout à resolução do dispositivo, preservando a legibilidade e a utilização dos gráficos, indicadores, tabelas, formulários e demais componentes.

**Critérios de Verificação**

- Executar os principais fluxos da aplicação nas larguras de 360 px (mobile), 768 px (tablet) e 1366 px (desktop).
- Verificar que os componentes permanecem legíveis e acessíveis, sem cortes, sobreposições ou necessidade de rolagem horizontal na página.

</details>

<details id="rnf03" markdown>
<summary>RNF03 · Eficiência no Cadastro de Treinos</summary>

**Nome:** Eficiência no Cadastro de Treinos

**Classificação FURPS+:** Usabilidade

**Descrição**

O sistema deve permitir que o treinador ou auxiliar técnico conclua o cadastro de uma sessão de treino de complexidade média em menos de dois minutos, incluindo o registro de suas atividades e respectivas classificações.

**Critérios de Verificação**

- Utilizar a periodização, a biblioteca de atividades e os catálogos previamente cadastrados.
- Registrar uma sessão baseada no treino demonstrado pelo cliente em 21/09/2026, contendo três atividades sequenciais, sem simultaneidade:

    - **Ordem 1:** PDI, 20 min, sem dimensões ou número de jogadores.
    - **Ordem 2:** Aquisição, 25 min, espaço de 50 × 60 m e 18 jogadores.
    - **Ordem 3:** Aplicação, 30 min, espaço de 105 × 68 m e 22 jogadores.

- Iniciar a medição ao acionar o cadastro da sessão e encerrá-la após a confirmação do registro completo das três atividades, incluindo suas classificações táticas e técnicas conforme o treino de referência.
- Verificar que o tempo total é estritamente inferior a 120 segundos, que os dados estão corretamente registrados, que as dimensões do espaço são calculadas automaticamente e que a duração total da sessão corresponde a 75 minutos.

</details>

<details id="rnf04" markdown>
<summary>RNF04 · Atualização Automática do Dashboard</summary>

**Nome:** Atualização Automática do Dashboard

**Classificação FURPS+:** Performance

**Descrição**

Os gráficos e indicadores do dashboard devem ser recalculados e atualizados em até cinco segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino. A atualização automática deve ocorrer na interface do usuário que realizou a operação, sem necessidade de recarregamento manual da página. Outros usuários poderão atualizar manualmente a página para consultar os dados mais recentes.

**Critérios de Verificação**

- Realizar o teste no ambiente implantado, com conexão estável e uma base de referência representativa de uma temporada completa: 1 macrociclo, 10 mesociclos, 40 microciclos, 200 sessões e 600 execuções de atividades.
- Realizar separadamente operações de cadastro, edição e exclusão de um treino.
- Medir o intervalo entre a confirmação de sucesso da operação e a atualização completa dos gráficos e indicadores afetados.
- Verificar que cada atualização ocorre em até cinco segundos, sem recarregamento manual da página pelo usuário responsável, e que os indicadores refletem corretamente os dados persistidos.
- Verificar que outro usuário conectado consegue visualizar os dados atualizados ao recarregar manualmente a página.

</details>

<details id="rnf05" markdown>
<summary>RNF05 · Backup e Recuperação de Dados</summary>

**Nome:** Backup e Recuperação de Dados

**Classificação FURPS+:** Confiabilidade

**Descrição**

O sistema deve preservar os dados históricos mediante a realização automática de backups completos diários, preferencialmente durante a madrugada, mantidos por, no mínimo, 30 dias em armazenamento privado e separado do servidor principal, com acesso restrito aos responsáveis.

As cópias devem contemplar todos os dados persistidos no banco, incluindo periodização, sessões, atividades, biblioteca, classificações e contas de usuários, bem como os arquivos associados, quando aplicável. Em caso de falha, corrupção ou perda de dados, o sistema deve permitir a recuperação das informações com perda máxima de 24 horas de registros (RPO) e restabelecimento do serviço em até 24 horas após a identificação do incidente (RTO).

A geração dos backups e a restauração dos dados serão responsabilidade da administração da infraestrutura.

**Critérios de Verificação**

- Verificar os registros de execução automática dos backups, a frequência diária, a retenção mínima de 30 dias, o armazenamento separado e o acesso restrito.
- Simular uma falha do banco de dados em ambiente de teste e realizar a restauração de uma cópia de segurança.
- Verificar que a perda de dados não ultrapassa 24 horas e que o serviço é restabelecido em até 24 horas após a identificação da falha.
- Confirmar que os registros restaurados estão íntegros, com seus relacionamentos preservados e disponíveis para consulta na aplicação.
- Verificar também a recuperação dos arquivos associados, quando aplicável.

</details>

</div>


---

## 8.3 Regras de Negócio — RNs

As Regras de Negócio (RNs) definem a lógica de domínio esportivo do treinador Marcus Vinicius, as diretrizes de cálculo analítico e as restrições comportamentais do sistema. Elas especificam como as funcionalidades declaradas nos RFs devem operar para garantir a fidelidade metodológica ao futebol de base:

| ID | Regra de Negócio | Categoria | Descrição / Fórmula de Negócio | Requisitos Relacionados |
| :---: | :--- | :---: | :--- | :---: |
| <a id="rn01"></a>**RN01** | **Cálculo da Área por Jogador** | Cálculo Esportivo | A área por jogador em metros quadrados é calculada pela fórmula:<br><br><code>Área (m²/jogador) = (Comprimento × Largura) ÷ Nº de Jogadores</code><br><br>Obrigatório para atividades com orientação de **Aquisição**, **Aplicação** e **Equilíbrio de Carga**. Dispensado para atividades de **PDI** (Proposta de Desenvolvimento Individual), nas quais comprimento, largura e jogadores são opcionais. | [RF13](#rf13), [RF14](#rf14), [RF19](#rf19), [RF20](#rf20), [RF23](#rf23), [RF35](#rf35) |
| <a id="rn02"></a>**RN02** | **Classificação Automática da Dimensão do Espaço** | Validação Automática | A dimensão do espaço não é digitada pelo usuário, sendo classificada automaticamente pelo sistema a partir do resultado da [RN01](#rn01):<br>• <strong>≤ 100 m²:</strong> Espaço Reduzido (Pequeno)<br>• <strong>101 a 200 m²:</strong> Espaço Médio<br>• <strong>> 200 m²:</strong> Espaço Amplo (Grande)<br>• <strong>Sem dimensões delimitadas (ex.: PDI):</strong> Não Definido | [RF13](#rf13), [RF14](#rf14), [RF19](#rf19), [RF20](#rf20), [RF25](#rf25), [RF35](#rf35) |
| <a id="rn03"></a>**RN03** | **Simultaneidade e Contagem de Tempo da Sessão** | Cálculo Esportivo | Atividades cadastradas com o mesmo número no campo **ordem** dentro de uma sessão (ex.: duas atividades com Ordem = 1) ocorrem de forma **simultânea** (elenco dividido em subgrupos). No cálculo da duração líquida da sessão, o tempo de atividades simultâneas é contabilizado **uma única vez** (ex.: duas atividades de 20 minutos com mesma ordem somam 20 minutos à sessão, e não 40). No contador de execuções, o par (Sessão + Ordem) conta como 1 execução. | [RF13](#rf13), [RF14](#rf14), [RF16](#rf16), [RF17](#rf17), [RF22](#rf22), [RF25](#rf25), [RF26](#rf26) |
| <a id="rn04"></a>**RN04** | **Hierarquia e Integridade da Periodização** | Integridade Estrutural | A estrutura esportiva organiza-se estritamente na árvore hierárquica:<br><br><code>Macrociclo (Temporada) ⊃ Mesociclo ⊃ Microciclo (Semana) ⊃ Sessão (Treino) ⊃ Atividades</code><br><br>Nenhum registro subordinado pode ser persistido sem vínculo obrigatório a um elemento pai válido. Não é permitido excluir elementos pais que possuam ciclos ou treinos associados sem validação prévia de integridade. | [RF01](#rf01) a [RF09](#rf09), [RF16](#rf16), [RF18](#rf18), [RF40](#rf40) |
| <a id="rn05"></a>**RN05** | **Preenchimento Condicional pelo Objetivo Central** | Validação de Entrada | O preenchimento dos campos de momento do jogo, fase do jogo, princípio tático e atributo técnico é **opcional** por atividade. O preenchimento deve ser restrito ao foco do exercício (ex.: se o objetivo principal for tático de reação pós-perda, o fundamento de passe não deve ser marcado como atributo técnico, evitando distorções nos indicadores de desenvolvimento técnico individual). | [RF13](#rf13), [RF14](#rf14), [RF19](#rf19), [RF20](#rf20), [RF32](#rf32), [RF36](#rf36) a [RF39](#rf39) |
| <a id="rn06"></a>**RN06** | **Cálculo da Variabilidade de Treinos** | Cálculo Esportivo | O índice percentual de rotatividade de exercícios em um determinado período é calculado por:<br><br><code>Variabilidade (%) = (Atividades Distintas no Período ÷ Total de Execuções no Período) × 100</code><br><br>Faixa de referência metodológica estipulada pelo treinador: entre 50% e 70% (cada atividade repetida em média de 1 a 2 vezes no ciclo). | [RF22](#rf22), [RF25](#rf25) |
| <a id="rn07"></a>**RN07** | **Tratamento e Estabilidade em Consultas com Resultado Vazio** | Comportamento do Sistema | Ao filtrar consultas (indicadores, listas de atividades, dimensões de treino e gráficos comparativos) sem dados no período selecionado, o sistema não deve acusar erros ou disparar exceções de divisão por zero: mantém os filtros ativos, exibe valores neutros (`0 sessões`, `0 min`, `0%`) e apresenta mensagem orientadora ao usuário, conforme o detalhamento da tabela abaixo. | [RF22](#rf22), [RF24](#rf24), [RF25](#rf25), [RF35](#rf35) a [RF40](#rf40) |

---



<!-- RNFs moved to section 8.1.

Lista de requisitos não funcionais, contendo: Numeração do Requisito; Nome; Descrição; Classificação FURPS+; Critério de Verificação.

| ID | Nome | Descrição | Classificação FURPS+ | Critério de Verificação |
| :---: | :--- | :--- | :---: | :---: |
| **RNF01** | Proteção de Dados Pessoais dos Atletas | O sistema deve utilizar a aplicação de hash irreversível de senhas via bcrypt para guardar as senhas dos usuários. | Segurança | Tentativas de acesso por utilizadores sem permissão devem retornar bloqueio de acesso com o código 401, verificável nos logs do backend. |
| **RNF02** | Interface Responsiva e Adaptável | A interface do sistema deve ser responsiva, adaptando o layout automaticamente de acordo com a resolução do dispositivo para não prejudicar a visualização dos gráficos na tela. | Usabilidade | Ao redimensionar a janela do navegador ou abrir a aplicação em janelas com larguras de 360px (mobile), 768px (tablet) e 1366px (desktop). O teste é considerado aprovado se nenhum gráfico ficar cortado, sobreposto ou exigir barra de rolagem horizontal na página. |
| **RNF03** | Eficiência no Cadastro de Treinos | O sistema deve possuir fluxos de tela com tempo máximo de preenchimento dos dados inferior ao tempo atual de 4 minutos e meio para o preenchimento dos dados. Como objetivo, o sistema deve garantir que o processo de registro de um novo treino seja concluído pelo treinador em menos de 2 minutos. | Usabilidade | O teste inicia no momento em que o treinador clica no botão para criar um novo treino e termina no momento em que a mensagem de "Treino cadastrado com sucesso" é exibida. O critério será considerado atendido se, para um cenário de complexidade média (cadastrar um treino utilizando atividades previamente cadastradas na biblioteca), o tempo total for estritamente inferior a 2 minutos. |
| **RNF04** | Atualização em Tempo Real do Dashboard | Os gráficos e indicadores do dashboard devem ser recalculados e atualizados na interface do usuário em um tempo máximo de 5 segundos após a confirmação de sucesso no cadastro, edição ou exclusão de um treino. | Performance | Durante os testes de sistema, o treinador cadastra um novo treino enquanto visualiza o dashboard. O tempo entre a confirmação do salvamento e a completa re-renderização do gráfico com os novos dados deve ser cronometrado. O critério é atendido se o tempo de atualização for estritamente menor ou igual a 5 segundos. |

-->

---

## 8.4 Matriz Síntese de Rastreabilidade

A matriz a seguir mapeia a correlação direta entre os Objetivos Específicos (OEs), as Características de Produto (CPs), os Requisitos Funcionais (RFs), as Regras de Negócio (RNs) e os Requisitos Não Funcionais (RNFs):

| Contribuição principal | Contribuição secundária | CP | RFs relacionados | Regras de Negócio (RNs) | RNFs relacionados |
| :---: | :---: | :---: | :---: | :---: | :---: |
| OE1 | OE4 | CP01 | RF10, RF11, RF12, RF13, RF14, RF15, RF16, RF17, RF18, RF19, RF20, RF21, RF23, RF29, RF32, RF33, RF34 | [RN01](#rn01), [RN02](#rn02), [RN03](#rn03), [RN04](#rn04), [RN05](#rn05) | RNF02, RNF03, RNF04 |
| OE2 | OE3 | CP02 | RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF08, RF09 | [RN04](#rn04) | RNF02 |
| OE3 | OE4 | CP03 | RF22, RF24, RF26, RF30, RF31, RF35, RF36, RF37, RF38, RF39, RF40 | [RN01](#rn01), [RN02](#rn02), [RN03](#rn03), [RN04](#rn04), [RN05](#rn05), [RN06](#rn06), [RN07](#rn07) | RNF02, RNF04 |
| OE4 | OE3 | CP04 | RF25 | [RN02](#rn02), [RN03](#rn03), [RN06](#rn06), [RN07](#rn07) | RNF02 |
| OE1 | OE4 | CP05 | RF27, RF28 | - | RNF01, RNF02 |

---

## 8.5 Histórico de Rastreabilidade
| Versão | Data | Descrição | Autor(es) | Artefato |
| :---: | :---: | :--- | :--- | :---: |
| `1.0` | 12/10/2026 | Versão consolidada referente à entrega da Unidade 02 | Rafael Wasconcelos | [Visualizar v1.0](https://mdsreq-fga-unb.github.io/REQ-2026.2-T01-FutBoard/Entrega-Unidade-02/visao-produto/Requisitos-de-Software/) |
| `2.0` | 15/11/2026 | Atualização referente à entrega da Unidade 03 | Rafael Wasconcelos | **Versão Atual** |