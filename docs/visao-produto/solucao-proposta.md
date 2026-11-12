# Solução Proposta

## 2.1 Objetivo Geral do Produto

Apoiar a tomada de decisões técnicas do corpo técnico do Canaã Esporte Clube, transformando os registros de treino da equipe Sub-17 em métricas analíticas e visuais sobre planejamento e desempenho.

## 2.2 Objetivos Específicos (OE) do Produto
- <a id="oe1"></a>**(OE1):** Sistematizar a coleta de dados de treinos de forma categorizada e padronizada.
- <a id="oe2"></a>**(OE2):** Estruturar o planejamento com base na periodização esportiva nativa (macrociclos, mesociclos e microciclos).
- <a id="oe3"></a>**(OE3):** Fornecer diagnósticos analíticos e comparativos em tela (dashboards) sobre a distribuição de cargas e conteúdos entre ciclos de treino.
- <a id="oe4"></a>**(OE4):** Subsidiar a tomada de decisão e a comunicação técnica por meio da geração automatizada de relatórios executivos exportáveis (PDF).

## 2.3 Características do Produto

| ID | OE principal | Contribuição secundária | Característica | Descrição resumida | Valor de negócio principal |
| --- | --- | --- | --- | --- | --- |
| <a id="cp01"></a>CP01 | OE1 | OE4 | Registro Categorizado de Treinos | Interface que permite ao técnico a inserção estruturada dos dados de treino. | Diminuir o tempo de cadastros das sessões de treinos diminuindo a sobrecarga de trabalho do treinador. |
| <a id="cp02"></a>CP02 | OE2 | OE3 | Estruturador de Periodização Esportiva | Ferramenta para estruturar nativamente o planejamento do calendário em macrociclos, mesociclos e microciclos. | Padronização metodológica científica relacionada à rotina do clube, substituindo métodos sem padronização. |
| <a id="cp03"></a>CP03 | OE3 | OE4 | Dashboard Analítico | Painel visual interativo com métricas e filtros analíticos atualizados após o registro dos dados. | Substitui dashboards estáticos por diagnósticos analíticos instantâneos de treino em tela. |
| <a id="cp04"></a>CP04 | OE4 | OE3 | Geração Automática de Relatórios | Sistema que consolida métricas e comparativos de ciclos em relatórios estruturados exportáveis em PDF. | Fornece documento executivo portátil para prestação de contas e tomada de decisão técnica fora da aplicação. |
| <a id="cp05"></a>CP05 | OE1 | OE4 | Controle de Perfis de Acesso | Sistema de cadastro e login para o técnico e seu auxiliar. | Protege os dados contra alterações indevidas. |

## 2.4 Tecnologias a Serem Utilizadas

A stack tecnológica e as ferramentas de gestão do **FutBoard** foram definidas a partir de um levantamento estruturado via Microsoft Forms, respondido por todos os integrantes da equipe. Isso garantiu que as escolhas reflitam o conhecimento técnico consolidado pelo grupo, equilibrando eficiência operacional e colaboração fluida. A estrutura se divide nos seguintes pilares:

### Resumo Estratégico

| Categoria / Componente | Tecnologia / Ferramenta | Benefício Estratégico / Justificativa |
| :--- | :--- | :--- |
| **Frontend & Interface** | React + Tailwind (pontual) + Sass | **Agilidade e Padronização:** Componentização madura e unânime na equipe, unindo velocidade de estilização a um design limpo. |
| **Linguagem & Backend** | Python + Django + DRF | **Produtividade e Segurança:** Aproveita o domínio da equipe em Python e entrega autenticação e ORM prontos de fábrica. |
| **Persistência de Dados** | PostgreSQL | **Integração Relacional:** Perfeito para estruturar dados hierárquicos e relacionais de treinos (ciclos, sessões e atividades). |
| **Infraestrutura (Dev & Prod)** | Vercel, Render / AWS Lightsail (VPS) | **Custo-Benefício e Controle:** Ambiente de teste ágil e sem custos iniciais, evoluindo para uma VPS dedicada em produção. |
| **Prototipagem & Design** | Figma | **Validação Visual:** Criação rápida de telas e fluxos de experiência do usuário antes da codificação. |
| **Modelagem & Arquitetura** | Miro | **Colaboração e Alinhamento:** Facilidade para construção conjunta de fluxogramas e diagramas de sistema pela equipe. |
| **Gestão de Projetos** | GitHub Projects | **Rastreabilidade e Controle:** Centralização de tarefas, acompanhamento de sprints e alinhamento direto com o código-fonte. |
| **Comunicação & Reuniões** | WhatsApp & Microsoft Teams | **Fluidez Operacional:** WhatsApp para alinhamentos rápidos cotidianos e Teams para reuniões síncronas formais. |

## 2.5 Pesquisa de Mercado e Análise Competitiva

No contexto do futebol de base brasileiro e a partir do levantamento prático realizado com a comissão técnica do Canaã Esporte Clube, constata-se uma carência de ferramentas intermediárias acessíveis: o mercado divide-se predominantemente entre plataformas corporativas de alto custo voltadas à elite profissional e métodos manuais (planilhas e anotações avulsas) desprovidos de integridade relacional.

Entre as principais alternativas identificadas e avaliadas frente às necessidades do clube:

- **Kitman Labs:** Plataforma analítica avançada focada em inteligência de desempenho, prontuário médico e predição de lesões via sensores, voltada a ligas de grande porte internacional. Opera sob licenciamento corporativo *enterprise* em moeda estrangeira — com referências públicas a contratos anuais de alta ordem ([AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-7oitrm5xaotui)) —, idioma predominantemente em inglês e alta complexidade, tornando-a inviável para a realidade orçamentária e operacional de um clube formador local.
- **Iterpro:** Plataforma integrada de gestão esportiva (ERP) para o futebol profissional, focada em contratos, finanças, transferências e administração de clubes ([Iterpro Plans](https://iterpro.com/plans/)). Opera em moeda estrangeira com modelos de precificação corporativa sob consulta, agregando módulos burocráticos que extrapolam a rotina prática de planejamento de treino em campo.
- **CoachID:** Plataforma desenvolvida para treinadores, com planos de assinatura individuais que variam tipicamente entre € 10,00 e € 25,00 mensais ([CoachID Features](https://coachidapp.com/#features)). Embora disponibilize interface em língua portuguesa (PT-PT), seu ecossistema é centrado no monitoramento individualizado e biométrico de jogadores (questionários de bem-estar/wellness, assiduidade e prontuários nominais), o que diverge do escopo delimitado pelo cliente (voltado estritamente à periodização e a métricas coletivas das sessões, sem tratamento de dados pessoais de menores), além de não contemplar as regras metodológicas de cálculo de área por atleta e simultaneidade específicas do treinador.
- **Ferramentas de prancheta e anotação (ex.: Gesklub, Planejador de Treino):** Softwares anteriormente testados pelo cliente que se limitam ao desenho estático de diagramas táticos e ao cadastro básico de exercícios, sem motor de cálculo para cruzamento de cargas, comparativos temporais ou estruturação em microciclos.
- **Planilhas eletrônicas e Power BI (solução atual):** Método herdado que, embora de baixo custo direto de licença, acarreta sobrecarga operacional crônica de digitação extracampo, lentidão em relatórios e ausência de integridade relacional entre ciclos, sessões e atividades.

A solução **FutBoard** posiciona-se para ocupar essa lacuna operacional: uma ferramenta leve, totalmente localizada em português do Brasil (PT-BR), com moeda local e infraestrutura em nuvem progressiva (custo zero durante validação e baixo custo em produção), focada exclusivamente na periodização metodológica e na análise coletiva das sessões de treino da categoria Sub-17.

Para viabilizar economicamente a aplicação e garantir que ela seja financeiramente acessível ao clube, a implantação será dividida em duas etapas técnicas:

- **Fase de Desenvolvimento e Validação (Custo Zero):** Durante a criação e testes dos protótipos com o técnico, a aplicação operará em camadas gratuitas (Free Tier). A interface web será hospedada na Vercel, enquanto a API e a lógica de negócio rodarão no Render, permitindo validar os fluxos em campo com custo zero de infraestrutura.
- **Fase de Produção Definitiva (Migração para VPS):** Para a entrega final, garantindo alta disponibilidade e maior velocidade de resposta, o sistema será migrado para um Servidor Virtual Privado (VPS) em provedores consolidados como AWS (Lightsail) ou DigitalOcean.
- **Custos Operacionais Estimados:** O investimento financeiro para manter a plataforma ativa será restrito à aquisição de um domínio próprio de aproximadamente R$ 40,00 anuais, e à mensalidade do servidor virtual, cujos planos de entrada variam entre US$ 5,00 e US$ 7,00 mensais (cerca de R$ 25,00 a R$ 40,00/mês).

## 2.6 Viabilidade da Proposta

A proposta é viável para o contexto da disciplina, considerando o acesso ao cliente, o escopo bem definido do cliente com a entrega de um MVP funcional ao final do semestre. Embora a equipe de desenvolvimento seja composta por estudantes, possua recursos limitados e um prazo ligeiramente curto, por volta de 3 meses, o projeto está sendo estruturando considerando todas essas variáveis, com priorização rigorosa das funcionalidades essenciais e validações frequentes com o cliente.

O principal desafio em vista é o limite de tempo e recursos, porém esse risco é mitigado pela escopo bem definido para a entrega do MVP (produto mínimo viável) onde garantiremos a entrega das características essenciais que o cliente demonstrou como o valor central do sistema.

## 2.7 Benefícios Esperados

- Para o **Cliente(Técnico):**   Agilizar e facilitar o processo de preenchimento das informações dos treinos realizados, melhorar a vizualiacao dos dados gerados a partir dos treinos realizados.

- Para o **Auxiliar técnico:** Permitir o acesso e visualização dos dados gerados a partir dos treinos realizados, sem a necessidade de compartilhar links ou planilhas. Permitir o cadastro dos dados de treino