# Solução Proposta

## 2.1 Objetivo Geral do Produto

Apoiar a tomada de decisões técnicas do corpo técnico do Canaã Esporte Clube, transformando os registros de treino da equipe Sub-17 em métricas analíticas e visuais sobre planejamento e desempenho.

## 2.2 Objetivos Específicos (OE) do Produto

- **(OE1):** Sistematizar a coleta de dados de treinos de forma categorizada para suporte a tomada de decisões.
- **(OE2):** Estruturar o planejamento com base na periodização esportiva (macro, meso e microciclos).
- **(OE3):** Disponibilizar métricas visuais e automatizadas para o monitoramento de carga e desempenho da equipe.
- **(OE4):** Facilitar a avaliação da efetividade dos treinos pelo técnico.
- **(OE5):** Possibilitar a análise comparativa de desempenho entre os diferentes ciclos de periodização de treino (macro, meso e microciclos).

## 2.3 Características do Produto

| OE principal | Contribuição secundária | ID | Característica | Descrição resumida | Valor de negócio principal |
| --- | --- | --- | --- | --- | --- |
| OE1 | OE4 | CP01 | Registro Rápido e Categorizado de Sessões | Interface otimizada e intuitiva que permite ao técnico registrar os dados das sessões de treino de forma fácil, concluindo o cadastro em menos de três minutos. | Diminuir o tempo de cadastros das sessões de treinos, e diminuir a sobrecarga de trabalho do treinador. |
| OE2 | OE2 | CP02 | Estruturador de Periodização Esportiva | Ferramenta para estruturar nativamente o planejamento do calendário em macrociclos, mesociclos e microciclos. | Padronização metodológica científica relacionada a rotina do clube, substituindo métodos sem padronização. |
| OE3 | OE1 | CP03 | Dashboard em Tempo Real | Painel visual com gráficos interativos com o objetivo de monitorar o os treinos passados para a equipe. | Substitui dashboards estáticos e atrasados por métricas visuais instantâneas. |
| OE5 | OE4 | CP04 | Geração Automática de Relatórios | Sistema que processa os dados do banco centralizado em nuvem para criar relatórios comparativos entre ciclos. | Fundamenta e apoia a tomada de decisões técnicas com base em estatísticas consolidadas. |

## 2.5 Pesquisa de Mercado e Análise Competitiva

O mercado de tecnologia para o futebol de base é polarizado: de um lado, plataformas corporativas caras e complexas; de outro, métodos manuais como planilhas, sem integridade de dados. Não há uma alternativa intermediária voltada a clubes formadores brasileiros — e é essa lacuna que a solução do técnico busca preencher.

Entre as soluções existentes, a *Kitman Labs* é uma plataforma analítica avançada focada em performance, prontuário médico e predição de lesões via GPS, com custo de US$ 15.000 a 50.000 anuais e forte dependência de hardware. A *Teamworks*, consolidada no meio universitário americano, volta-se à logística e à comunicação interna (US$ 5.000 a 25.000/ano), sem qualquer modelagem nativa para periodização. Já a *Iterpro* é um ERP completo para o futebol profissional (€ 12.000 a 60.000/ano), que sofre de excesso de módulos irrelevantes para a base. Como concorrente indireto, as *planilhas eletrônicas* têm custos variáveis de licença, pois dependem da planilha utilizada, microsoft excel e powerBi e carecem de integridade relacional e boa usabilidade em campo. Um problema comum às três plataformas comerciais é operarem exclusivamente em inglês, sem suporte nativo em português.

A solução para o técnico Marcus Vinicius diferencia-se ao ocupar justamente esse espaço intermediário, unindo rigor metodológico e acessibilidade. Seus diferenciais são a localização total em português (interface, relatórios e suporte), a substituição de licenças por uma estratégia de infraestrutura em nuvem enxuta e progressiva, o foco estrito na rotina do treinador (sem módulos burocráticos), a periodização científica como estrutura nativa de dados, a independência de sensores caros e a baixa fricção de uso, com registro de sessão em menos de três minutos. Onde os concorrentes são caros, restritos ao inglês e sobrecarregados de funções, a proposta se posiciona como acessível, em português, leve e alinhada ao contexto do Sub-17.

Para viabilizar economicamente a aplicação e garantir que ela seja financeiramente acessível ao clube, a implantação será dividida em duas etapas técnicas:

- **Fase de Desenvolvimento e Validação (Custo Zero):** Durante a criação e testes dos protótipos com o técnico, a aplicação operará em camadas gratuitas (Free Tier). A interface web será hospedada na Vercel, enquanto a API e a lógica de negócio rodarão no Render, permitindo validar os fluxos em campo com custo zero de infraestrutura.
- **Fase de Produção Definitiva (Migração para VPS):** Para a entrega final, garantindo alta disponibilidade e maior velocidade de resposta, o sistema será migrado para um Servidor Virtual Privado (VPS) em provedores consolidados como AWS (Lightsail) ou DigitalOcean.
- **Custos Operacionais Estimados:** O investimento financeiro para manter a plataforma ativa será restrito à aquisição de um domínio próprio de aproximadamente R$ 40,00 anuais, e à mensalidade do servidor virtual, cujos planos de entrada variam entre US$ 5,00 e US$ 7,00 mensais (cerca de R$ 25,00 a R$ 40,00/mês).

Onde os concorrentes de grande porte são excessivamente caros e complexos, e ferramentas anteriormente testadas pelo cliente (como Gesklub, CoachId e Planejador de treino) limitam-se ao cadastro básico sem oferecer qualquer processamento analítico, o FutBoard se posiciona como uma solução acessível, estável, com métricas em tempo real e perfeitamente ajustada à realidade da categoria Sub-17.