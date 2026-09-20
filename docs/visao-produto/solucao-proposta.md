# Solução Proposta

## 2.1 Objetivo Geral do Produto

Apoiar a tomada de decisões técnicas do corpo técnico do Canaã Esporte Clube, transformando os registros de treino da equipe Sub-17 em métricas analíticas e visuais sobre planejamento e desempenho.

## 2.2 Objetivos Específicos (OE) do Produto

- **(OE1):** Sistematizar a coleta de dados de treinos de forma categorizada para suporte a tomada de decisões.
- **(OE2):** Estruturar o planejamento com base na periodização esportiva (macro, meso e microciclos).
- **(OE3):** Possibilitar a análise e a comparação de desempenho da equipe entre diferentes ciclos e categorias.
- **(OE4):** Fornecer apoio à decisão do corpo técnico por meio do acompanhamento dos treinos passados pelo técnico.

## 2.3 Características do Produto

| ID | OE principal | Contribuição secundária | Característica | Descrição resumida | Valor de negócio principal |
| --- | --- | --- | --- | --- | --- |
| CP01 | OE1 | OE4 | Registro Categorizado de Treinos | Interface que permite ao técnico a inserção estruturada dos dados de treino. | Diminuir o tempo de cadastros das sessões de treinos diminuindo a sobrecarga de trabalho do treinador. |
| CP02 | OE2 | OE3 | Estruturador de Periodização Esportiva | Ferramenta para estruturar nativamente o planejamento do calendário em macrociclos, mesociclos e microciclos. | Padronização metodológica científica relacionada a rotina do clube, substituindo métodos sem padronização. |
| CP03 | OE3 | OE4 | Dashboard Analitico | Painel visual com gráficos interativos com métricas atualizadas imediatamente após o registro dos dados | Substitui dashboards estáticos e atrasados por métricas visuais instantâneas. |
| CP04 | OE4 | OE3 | Geração Automática de Relatórios | Sistema que processa os dados para criar relatórios comparativos entre ciclos. | Fundamenta e apoia a tomada de decisões técnicas com base em estatísticas consolidadas. |
| CP05 | OE1 | OE4 | Controle de Perfis de Acesso | Sistema de cadastro e login para o técnico e seu auxiliar | Protege os dados contra alterações indevidas. 

## 2.4 Tecnologias a Serem Utilizadas

A stack tecnológica e as ferramentas de gestão do **FutBoard** foram definidas a partir de um levantamento estruturado via Microsoft Forms, respondido por todos os integrantes da equipe. Isso garantiu que as escolhas refletissem o conhecimento técnico consolidado pelo grupo, equilibrando eficiência operacional e colaboração fluida. A estrutura se divide nos seguintes pilares:

1. **Front-end & Interface:** Construído em **React** com estilização modular (CSS/Sass) e apoio pontual do Tailwind, garantindo interfaces responsivas, limpas e de rápida construção.
2. **Back-end & API:** Desenvolvido em **Python** utilizando o **Django** e o **Django REST Framework (DRF)** para expor uma API RESTful, aproveitando a maturidade do framework para acelerar entregas.
3. **Persistência de Dados:** Utiliza o **PostgreSQL**, ideal para modelar de forma estruturada e relacional o domínio esportivo (atletas, sessões e ciclos de treinamento).
4. **Infraestrutura:** No desenvolvimento, o sistema utiliza **Vercel** (frontend) e **Render** (API), migrando para uma **VPS na AWS Lightsail** em produção.
5. **Gestão, Design & Colaboração:** O fluxo de trabalho é apoiado por ferramentas integradas: **Figma** para prototipagem de telas, **Miro** para fluxogramas e arquitetura, **GitHub Projects** para controle de tarefas e sprints, além de **Microsoft Teams** (reuniões) e **WhatsApp** (comunicação ágil do dia a dia).

### Resumo Estratégico

| Categoria / Componente | Tecnologia / Ferramenta | Benefício Estratégico / Justificativa |
| :--- | :--- | :--- |
| **Frontend & Interface** | React + Tailwind (pontual) + Sass | **Agilidade e Padronização:** Componentização madura e unânime na equipe, unindo velocidade de estilização a um design limpo. |
| **Linguagem & Backend** | Python + Django + DRF | **Produtividade e Segurança:** Aproveita o domínio da equipe em Python e entrega autenticação e ORM prontos de fábrica. |
| **Persistência de Dados** | PostgreSQL | **Integridade Relacional:** Perfeito para estruturar dados hierárquicos e relacionais de treinos (atletas, ciclos e sessões). |
| **Infraestrutura (Dev & Prod)** | Vercel, Render / AWS Lightsail (VPS) | **Custo-Benefício e Controle:** Ambiente de teste ágil e sem custos iniciais, evoluindo para uma VPS dedicada em produção. |
| **Prototipagem & Design** | Figma | **Validação Visual:** Criação rápida de telas e fluxos de experiência do usuário antes da codificação. |
| **Modelagem & Arquitetura** | Miro | **Colaboração e Alinhamento:** Facilidade para construção conjunta de fluxogramas e diagramas de sistema pela equipe. |
| **Gestão de Projetos** | GitHub Projects | **Rastreabilidade e Controle:** Centralização de tarefas, acompanhamento de sprints e alinhamento direto com o código-fonte. |
| **Comunicação & Reuniões** | WhatsApp & Microsoft Teams | **Fluidez Operacional:** WhatsApp para alinhamentos rápidos cotidianos e Teams para reuniões síncronas formais. |

## 2.5 Pesquisa de Mercado e Análise Competitiva

O mercado de tecnologia para o futebol de base é polarizado: de um lado, plataformas corporativas caras e complexas; de outro, métodos manuais como planilhas, sem integridade de dados. Não há uma alternativa intermediária voltada a clubes formadores brasileiros — e é essa lacuna que a solução do técnico busca preencher.

Entre as soluções existentes, a [*Kitman Labs*](https://www.kitmanlabs.com/) é uma plataforma analítica avançada focada em performance, prontuário médico e predição de lesões, com custo de [US$ 100.000,00](https://aws.amazon.com/marketplace/seller-profile?id=seller-7oitrm5xaotui) anuais. A [*ChoachID*](https://coachidapp.com/#features) é uma plataforma que oferece os recursos e funcionalidades requisitadas pelo técnico, mas possui funcionalidades de gerenciamento individual de dados e desempenho de cada atleta, algo que foge do escopo proposto pelo técnico. Seu custo varia entre €10,00 a €25,00.. Já a [*Iterpro*](https://iterpro.com/plans/#pll_switcher) é um ERP completo para o futebol profissional, com planos entre [€ 1.000,00 a €5.000,00](https://clupik.com/en/blog/software-innovadores-deporte/) e que sofre de excesso de módulos irrelevantes para a base. Como concorrente indireto, as *planilhas eletrônicas* têm custos variáveis de licença, pois dependem da planilha utilizada, microsoft excel e powerBi e carecem de integridade relacional e boa usabilidade em campo. Um problema comum às três plataformas comerciais é operarem exclusivamente em inglês, sem suporte nativo em português.

A solução para o técnico Marcus Vinicius diferencia-se ao ocupar justamente esse espaço intermediário, unindo rigor metodológico e acessibilidade. Seus diferenciais são: o custo pago em moeda local,a localização total em português do Brasil (interface, relatórios e suporte), a substituição de licenças por uma estratégia de infraestrutura em nuvem enxuta e progressiva, o foco estrito na rotina do treinador (sem módulos burocráticos), a periodização científica como estrutura nativa de dados e a independência de sensores caros e a baixa fricção de uso. Onde os concorrentes são caros, restritos ao inglês e sobrecarregados de funções, a proposta se posiciona como acessível, em português, leve e alinhada ao contexto da equipe.

Para viabilizar economicamente a aplicação e garantir que ela seja financeiramente acessível ao clube, a implantação será dividida em duas etapas técnicas:

- **Fase de Desenvolvimento e Validação (Custo Zero):** Durante a criação e testes dos protótipos com o técnico, a aplicação operará em camadas gratuitas (Free Tier). A interface web será hospedada na Vercel, enquanto a API e a lógica de negócio rodarão no Render, permitindo validar os fluxos em campo com custo zero de infraestrutura.
- **Fase de Produção Definitiva (Migração para VPS):** Para a entrega final, garantindo alta disponibilidade e maior velocidade de resposta, o sistema será migrado para um Servidor Virtual Privado (VPS) em provedores consolidados como AWS (Lightsail) ou DigitalOcean.
- **Custos Operacionais Estimados:** O investimento financeiro para manter a plataforma ativa será restrito à aquisição de um domínio próprio de aproximadamente R$ 40,00 anuais, e à mensalidade do servidor virtual, cujos planos de entrada variam entre US$ 5,00 e US$ 7,00 mensais (cerca de R$ 25,00 a R$ 40,00/mês).

Onde os concorrentes de grande porte são excessivamente caros e complexos, e ferramentas anteriormente testadas pelo cliente (como Gesklub, CoachId e Planejador de treino) limitam-se ao cadastro básico sem oferecer qualquer processamento analítico, o FutBoard se posiciona como uma solução acessível, estável, com métricas em tempo real e perfeitamente ajustada à realidade da categoria Sub-17.

## 2.6 Viabilidade da Proposta

A proposta é viável para o contexto da disciplina, considerando o acesso ao cliente, o escopo bem definido pelo cliente com a entrega de um MVP funcional ao final do semestre. Embora a equipe de desenvolvimento seja composta por estudantes, possua recursos limitados e um prazo ligeiramente curto, por volta de 3 meses, o projeto está sendo estruturando considerando todas essas variáveis, com priorização rigorosa das funcionalidades essenciais e validações frequentes com o cliente.

O principal desafio em vista é o limite de tempo e recursos, porém esse risco é mitigado pela escopo bem definido para a entrega do MVP (produto mínimo viável) onde garantiremos a entrega das características essenciais que o cliente demonstrou como o valor central do sistema.

## 2.7 Benefícios Esperados

- Para o **Cliente:**   agilizar e facilitar o processo de preenchimento das informações dos treinos realizados, melhorar a vizualiacao dos dados gerados a partir dos treinos realizados.

- Para a **Comissão Técnica:** Permitir o acesso e visualização dos dados gerados a partir dos treinos realizados, sem a necessidade de compartilhar links ou planilhas.
