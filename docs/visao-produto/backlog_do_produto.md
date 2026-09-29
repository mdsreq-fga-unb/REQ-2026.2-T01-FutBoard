# 10 Backlog do Produto

Esta seção descreve o backlog de produto (preliminar ou completo, dependendo do produto), que é uma lista priorizada de todas as funcionalidades e melhorias planejadas para o software. Também aborda a priorização dessas funcionalidades e o que será entregue no Produto Mínimo Viável (MVP).

## 10.1 Backlog Geral

Em produção

## 10.2 Priorização do Backlog Geral e MVP

Para priorizar o backlog do FutBoard, cada requisito funcional (RF) recebeu quatro notas: **valor de negócio**, **esforço**, **complexidade** e **conhecimento da equipe**. As três últimas foram combinadas em uma única medida, o **esforço técnico**, que foi cruzada com o valor de negócio para posicionar cada RF em um quadrante da matriz Valor x Esforço.

### 1. Critérios e legendas

#### 1.1 Valor de negócio

O valor de negócio foi definido a partir da justificativa dada pelo cliente para cada funcionalidade.

| Pontuação | Interpretação | Justificativa do cliente |
|:---:|---|---|
| 4 | Essencial | O sistema necessita dessa funcionalidade. |
| 3 | Muito valioso | Agrega muito valor ao produto e deve ser priorizado. |
| 2 | Desejável | Seria interessante ter, mas o sistema funciona perfeitamente sem. |
| 1 | A definir | Nota ainda não utilizada no backlog atual. |

#### 1.2 Esforço

| Pontuação | Interpretação | Descrição |
|:---:|---|---|
| 1 | Esforço baixo | Até 2 horas |
| 2 | Esforço moderado | Entre 2 e 6 horas |
| 3 | Esforço alto | Entre 6 e 12 horas |
| 4 | Esforço muito alto | Mais de 12 horas |

#### 1.3 Complexidade

| Pontuação | Interpretação |
|:---:|---|
| 1 | Operações cadastrais elementares (CRUD direto) em entidades isoladas, com validações de formato padronizadas, sem dependências de fluxo ou cálculos. Atividades com consumo de dados do banco. |
| 2 | Operações com dependência hierárquica (efeitos em cascata), integridade referencial estrita, upload de arquivos ou manipulação de coleções locais. |
| 3 | Lógica de negócio analítica, processamento em tempo de execução, cálculos derivados e reatividade/interdependência entre múltiplos componentes visuais. |
| 4 | Requisitos com alta incerteza técnica, algoritmos pesados de inferência/estatística ou dependência crítica de serviços/APIs externas de terceiros. |

#### 1.4 Conhecimento da equipe

| Pontuação | Interpretação |
|:---:|---|
| 1 | A equipe domina plenamente os conhecimentos necessários. |
| 2 | A equipe possui conhecimento suficiente, com pouca aprendizagem adicional. |
| 3 | A equipe precisa desenvolver conhecimentos relevantes. |
| 4 | A equipe ainda não possui os conhecimentos ou recursos necessários. |

### 2. Como as notas foram definidas: votação e média

As notas de esforço, complexidade e conhecimento da equipe não foram decididas por uma pessoa só. Para cada critério de cada requisito, todos os seis membros da equipe votaram individualmente, usando as legendas acima, e a nota final foi a **média dos votos**, arredondada para o inteiro mais próximo (valores com 0,5 sobem para o inteiro seguinte).

Exemplo de votação para um critério de um requisito:

| Membro | Voto |
|---|:---:|
| Giovana | 3 |
| Guilherme L. | 3 |
| Guilherme T. | 2 |
| Gustavo | 2 |
| Leonardo | 3 |
| Rafael | 2 |
| **Média** | **2,5 → 3** |

Cálculo: (3 + 3 + 2 + 2 + 3 + 2) / 6 = 2,5, arredondado para **3**.

### 3. Esforço técnico

O esforço técnico resume o custo de desenvolvimento de um RF em um único número, entre 1 e 4, calculado como a média simples das três notas finais:

```
Esforço técnico = (Esforço + Complexidade + Conhecimento da equipe) / 3
```

Exemplo com o RF34 (Gerar análises textuais dos dados cadastrados, com IA): (3 + 4 + 4) / 3 = 3,67.

### 4. Matriz Valor x Esforço e quadrantes

Cada RF é posicionado em um quadrante comparando o **valor de negócio** com o **esforço técnico**, tendo 2 como ponto de corte nos dois eixos.

| Quadrante | Regra | Leitura | Prioridade sugerida |
|:---:|---|---|:---:|
| Q2 | Valor > 2 e esforço técnico <= 2 | Alto valor / Baixa carga técnica | Prioridade 1 |
| Q1 | Valor > 2 e esforço técnico > 2 | Alto valor / Alta carga técnica | Prioridade 2 |
| Q3 | Valor <= 2 e esforço técnico <= 2 | Baixo valor / Baixa carga técnica | Prioridade 3 |
| Q4 | Valor <= 2 e esforço técnico > 2 | Baixo valor / Alta carga técnica | Prioridade 4 |

A classificação foi automatizada na planilha com a fórmula abaixo, em que a coluna C guarda o valor de negócio e a coluna H o esforço técnico:

```excel
=MAP(C3:C500; H3:H500; LAMBDA(val; esf;
  SE(esf=""; "";
  IFS(
    (esf>2)*(val>2);   "Quadrante 1";
    (esf<=2)*(val>2);  "Quadrante 2";
    (esf<=2)*(val<=2); "Quadrante 3";
    (esf>2)*(val<=2);  "Quadrante 4"
  ))
))
```

### 5. Consolidação dos requisitos

| Código | Requisito | Valor | Esforço | Complex. | Conhec. | Esforço técnico | Quadrante |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|
| RF01 | Cadastrar macrociclo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF02 | Editar macrociclo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF03 | Excluir macrociclo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF04 | Cadastrar mesociclo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF05 | Editar mesociclo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF06 | Excluir mesociclo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF07 | Cadastrar microciclo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF08 | Editar microciclo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF09 | Excluir microciclo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF10 | Cadastrar comportamentos | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF11 | Editar comportamentos | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF12 | Excluir comportamentos | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF13 | Cadastrar atividade | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF14 | Editar atividade | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF15 | Excluir atividade | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF16 | Cadastrar sessão | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF17 | Editar sessão | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF18 | Excluir sessão | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF19 | Cadastrar atividades na biblioteca | 4 | 3 | 3 | 3 | 3,00 | Q1 Alto valor / Alta carga técnica |
| RF20 | Editar atividades na biblioteca | 4 | 3 | 3 | 3 | 3,00 | Q1 Alto valor / Alta carga técnica |
| RF21 | Excluir atividades na biblioteca | 4 | 3 | 3 | 3 | 3,00 | Q1 Alto valor / Alta carga técnica |
| RF22 | Exibir painel de indicadores na tela inicial | 4 | 2 | 2 | 3 | 2,33 | Q1 Alto valor / Alta carga técnica |
| RF23 | Exibir dashboard com gráficos | 4 | 4 | 3 | 3 | 3,33 | Q1 Alto valor / Alta carga técnica |
| RF24 | Reutilizar atividades cadastradas | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF25 | Incluir atividades cadastradas nas análises | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF26 | Filtrar informações dos gráficos | 4 | 2 | 3 | 3 | 2,67 | Q1 Alto valor / Alta carga técnica |
| RF27 | Gerar relatórios comparativos entre periodizações esportivas | 4 | 4 | 4 | 4 | 4,00 | Q1 Alto valor / Alta carga técnica |
| RF28 | Interagir com os dados dos gráficos | 4 | 3 | 3 | 3 | 3,00 | Q1 Alto valor / Alta carga técnica |
| RF29 | Criar conta | 2 | 2 | 3 | 2 | 2,33 | Q4 Baixo valor / Alta carga técnica |
| RF30 | Fazer login | 2 | 2 | 3 | 2 | 2,33 | Q4 Baixo valor / Alta carga técnica |
| RF31 | Anexar imagens dos tipos de treino | 3 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF32 | Anexar pontuações de cada exercício | 2 | 2 | 2 | 2 | 2,00 | Q3 Baixo valor / Baixa carga técnica |
| RF33 | Analisar os dados quantitativos dos atletas | 2 | 3 | 3 | 3 | 3,00 | Q4 Baixo valor / Alta carga técnica |
| RF34 | Gerar análises textuais dos dados cadastrados (com IA) | 3 | 3 | 4 | 4 | 3,67 | Q1 Alto valor / Alta carga técnica |
| RF35 | Cadastrar momento do jogo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF36 | Editar momento do jogo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF37 | Deletar momento do jogo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF38 | Cadastrar fase do jogo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF39 | Editar fase do jogo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF40 | Deletar fase do jogo | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF41 | Cadastrar atributo técnico | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF42 | Editar atributo técnico | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF43 | Deletar atributo técnico | 4 | 2 | 2 | 2 | 2,00 | Q2 Alto valor / Baixa carga técnica |
| RF44 | Apresentar contexto dos indicadores | 2 | 3 | 3 | 3 | 3,00 | Q4 Baixo valor / Alta carga técnica |
| RF45 | Apresentar limitações dos indicadores | 2 | 3 | 3 | 3 | 3,00 | Q4 Baixo valor / Alta carga técnica |
| RF46 | Calcular percentual dos gráficos com base no tempo total da sessão | 4 | 2 | 3 | 3 | 2,67 | Q1 Alto valor / Alta carga técnica |