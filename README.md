# FutBoard ⚽📋

> **Repositório da disciplina de Requisitos de Software - 2026.2 - Turma 01**  
> **Universidade de Brasília (UnB) - Faculdade do Gama (FGA / FCTE)**

---

## Sobre o Projeto

O **FutBoard** é um sistema web idealizado para solucionar a dificuldade no controle, planejamento e análise dos treinos da equipe de futebol de base (Sub-17 do Canaã Esporte Clube). Em um ambiente esportivo desafiador e com constante demanda por resultados, o acompanhamento da equipe costumava ser feito por meio de anotações fragmentadas em planilhas e dashboards estáticos.

O objetivo do FutBoard é centralizar, padronizar e otimizar o registro categorizado de treinos estruturado na periodização esportiva (macrociclos, mesociclos, microciclos e sessões), fornecendo indicadores analíticos em tempo real e relatórios em PDF para apoiar a tomada de decisão da comissão técnica.

## Documentação (GitHub Pages)

Toda a documentação do projeto, incluindo elicitação, modelagem, análise, catálogo de termos e planejamento, está hospedada e versionada utilizando o **MkDocs Material** e o **GitHub Pages**.

🔗 **Acesse a documentação completa aqui:**  
[[Link para o GitPages do FutBoard](https://mdsreq-fga-unb.github.io/REQ-2026.2-T01-FutBoard/)]

---

## Arquitetura e Stack Tecnológica

| Camada | Tecnologias | Responsabilidade |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 6, Sass (SCSS), Tailwind CSS 3, Axios | Interface web responsiva (mobile, tablet e desktop), registro categorizado de treinos e visualização de dashboards analíticos. |
| **Backend (API)** | Python 3.12, Django 5.2, Django REST Framework (DRF), Bcrypt | Regras de negócio da periodização esportiva, cálculo de métricas de treino, autenticação e exposição da API RESTful. |
| **Banco de Dados** | PostgreSQL 16 | Persistência relacional com integridade referencial para ciclos de treinamento, biblioteca de atividades, sessões e usuários. |
| **Documentação** | MkDocs Material | Documentação viva de Engenharia de Requisitos publicada via GitHub Actions. |

---

## Estrutura de Pastas do Projeto

```text
REQ-2026.2-T01-FutBoard/
├── .docker/
│   └── postgres/
│       └── init.sql              # Inicialização do PostgreSQL (extensão pgcrypto)
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD da documentação MkDocs para o GitHub Pages
├── backend/                      # API RESTful em Python / Django + DRF
│   ├── apps/                     # Módulos de domínio desacoplados por Característica de Produto (CP)
│   │   ├── ciclos/               # CP02: Estruturador de Periodização (Macro, Meso e Microciclos)
│   │   ├── treinos/              # CP01, CP03, CP04: Sessões, Biblioteca de Atividades, Dashboard e PDF
│   │   └── usuarios/             # CP05: Controle de Perfis de Acesso (Treinador e Auxiliar Técnico)
│   ├── futboard_core/            # Configurações centrais do projeto Django (settings, urls, wsgi, asgi)
│   ├── .dockerignore             # Exclusões de contexto de build do backend
│   ├── Dockerfile                # Imagem de desenvolvimento do backend (python:3.12-slim)
│   ├── manage.py                 # CLI administrativa do Django
│   ├── pyproject.toml            # Configuração do Ruff (linter/formatter) e Coverage
│   ├── requirements.txt          # Dependências principais da API
│   └── requirements-dev.txt      # Dependências de desenvolvimento e qualidade
├── docs/                         # Artefatos de Engenharia de Requisitos (MkDocs)
├── frontend/                     # Single Page Application (SPA) em React + Vite
│   ├── src/
│   │   ├── components/           # Componentes visuais reutilizáveis
│   │   ├── pages/                # Páginas da aplicação
│   │   ├── services/             # Cliente HTTP (Axios) e integração com a API
│   │   ├── styles/               # Estilos modulares em Sass (_variables.scss, main.scss) e Tailwind
│   │   ├── App.jsx               # Componente raiz
│   │   └── main.jsx              # Ponto de entrada React
│   ├── .dockerignore             # Exclusões de contexto de build do frontend
│   ├── Dockerfile                # Imagem de desenvolvimento do frontend (node:22-alpine)
│   ├── eslint.config.js          # Regras de análise estática do código React
│   ├── index.html                # Documento HTML base (pt-BR)
│   ├── package.json              # Scripts e dependências do Node.js
│   ├── postcss.config.js         # Configuração do PostCSS
│   ├── tailwind.config.js        # Configuração do Tailwind CSS
│   └── vite.config.js            # Configuração do servidor de desenvolvimento Vite
├── .dockerignore                 # Exclusões globais de build Docker
├── .env.example                  # Modelo de variáveis de ambiente (sem credenciais sensíveis)
├── .gitignore                    # Arquivos ignorados pelo Git
├── docker-compose.yml            # Orquestração dos serviços (db, backend e frontend)
├── mkdocs.yml                    # Configuração do site de documentação
└── README.md                     # Guia do repositório e instruções de execução
```

---

## Como Executar o Projeto com Docker (Recomendado)

O ambiente com Docker padroniza todas as versões de banco de dados, Python e Node.js para que qualquer integrante da equipe execute o projeto sem precisar instalar dependências manualmente no sistema operacional hospedeiro.

### 1. Pré-requisitos

- **Git** instalado.
- **Docker** (versão 24+) e **Docker Compose** (v2+) instalados e em execução:
  - No **Windows** ou **macOS**: instale e inicie o **Docker Desktop** (no Windows, certifique-se de que o backend WSL 2 está habilitado).
  - No **Linux**: instale `docker-ce` e `docker-compose-plugin` e certifique-se de que o serviço `docker` está ativo (`sudo systemctl start docker`).

### 2. Configuração das Variáveis de Ambiente

Na raiz do repositório, crie o arquivo `.env` a partir do modelo `.env.example`:

**Linux / macOS (Bash/Zsh):**
```bash
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

> Os valores padrão de `.env.example` já estão pré-configurados e prontos para o ambiente de desenvolvimento local. Nunca versione o arquivo `.env` com segredos reais.

### 3. Inicialização dos Serviços

Construa as imagens e inicie os contêineres:

```bash
docker compose up --build
```

Para executar em segundo plano (modo *detached*):

```bash
docker compose up -d --build
```

Na inicialização, o Docker Compose:
1. Sobe o banco **PostgreSQL 16** (`db`), executa `.docker/postgres/init.sql` e aguarda o *healthcheck* (`pg_isready`).
2. Inicia o **Backend Django/DRF** (`backend`), aplica automaticamente as migrações pendentes (`python manage.py migrate --noinput`) e disponibiliza a API na porta `8000`.
3. Após o *healthcheck* da API (`/api/health/`), inicia o **Frontend React/Vite** (`frontend`) na porta `5173` com *hot-reload* ativo.

### 4. Endereços de Acesso Local

- **Frontend (React + Vite):** [http://localhost:5173](http://localhost:5173)
- **API Root (Django REST Framework):** [http://localhost:8000/api/](http://localhost:8000/api/)
- **Healthcheck da API + Banco:** [http://localhost:8000/api/health/](http://localhost:8000/api/health/)
- **Django Admin:** [http://localhost:8000/admin/](http://localhost:8000/admin/)
- **PostgreSQL:** `localhost:5432` (usuário e banco padrão: `futboard`)

---

## Guia de Comandos por Função e Quando Utilizar

> **Observação:** Todos os comandos `docker compose` devem ser executados na pasta raiz do repositório (`REQ-2026.2-T01-FutBoard`).

### 1. Configuração Inicial (Apenas na 1ª vez que clonar o repositório)

| Comando | Quando usar |
| :--- | :--- |
| `Copy-Item .env.example .env` *(PowerShell)*<br>`cp .env.example .env` *(Linux / macOS / Git Bash)* | **Logo após clonar o repositório.** Cria o arquivo `.env` local com as variáveis padrão do banco, Django e Vite. |
| `docker compose up --build` | **Na primeira vez que for subir o projeto.** Constrói as imagens do backend e frontend, sobe o PostgreSQL, roda as migrações e inicia os servidores. |

---

### 2. Comandos de Docker (Para todos os desenvolvedores)

Estes comandos gerenciam os 3 serviços (`db` na porta `5432`, `backend` na porta `8000` e `frontend` na porta `5173`):

| Comando | Quando usar |
| :--- | :--- |
| `docker compose up -d` | **No início do dia de trabalho**, quando as imagens já foram construídas antes. Sobe tudo em segundo plano (deixando o terminal livre). |
| `docker compose ps` | **Para checar se tudo está rodando.** Mostra o status de saúde (`healthy`) do banco, backend e frontend. |
| `docker compose logs -f` | **Para ver erros ou logs em tempo real** de todos os serviços juntos. *(Use `Ctrl + C` para sair dos logs sem parar os contêineres).* |
| `docker compose logs -f frontend`<br>`docker compose logs -f backend` | **Para acompanhar os logs de apenas um serviço** (útil quando você está trabalhando apenas no front ou apenas no back). |
| `docker compose restart backend` | **Para reiniciar rapidamente apenas um serviço específico** sem derrubar os demais. |
| `docker compose stop` | **Para pausar o trabalho** sem remover os contêineres (preserva tudo como está). |
| `docker compose down` | **Para desligar e remover os contêineres** ao final do dia (os dados do banco continuam salvos no volume `postgres_data`). |
| `docker compose build --no-cache`<br>`docker compose up -d --force-recreate` | **Para reconstruir todas as imagens do zero** sem cache e recriar os contêineres quando houver mudanças estruturais de ambiente. |
| `docker compose down -v` | **CUIDADO (Ação destrutiva):** Apaga os contêineres **e zera o banco de dados** por completo. Use apenas quando quiser resetar o banco do zero. |

---

### 3. Comandos para Desenvolvedores Frontend

Os desenvolvedores de Frontend podem rodar os comandos **sem Docker** (direto na pasta `frontend/`, o que é mais rápido quando estiverem desenvolvendo apenas telas) ou **via Docker**.

> 💡 *No PowerShell do Windows, caso `npm` apresente erro de permissão de script (`PSSecurityException`), utilize `npm.cmd` no lugar de `npm`.*

#### A) Rodando direto na máquina (Sem Docker — dentro da pasta `frontend/`)

| Comando | Quando usar |
| :--- | :--- |
| `cd frontend` | **Antes de rodar comandos locais do frontend**, para entrar na pasta `frontend/`. |
| `npm.cmd install` | **Na primeira vez que rodar sem Docker** ou quando alguém da equipe adicionar uma biblioteca nova no `package.json`. |
| `npm.cmd run dev` | **Durante o desenvolvimento da interface.** Inicia o servidor Vite em `http://localhost:5173` com atualização automática (*hot-reload*). |
| `npm.cmd install <nome-do-pacote>` | **Quando precisar instalar uma nova biblioteca** no frontend. |
| `npm.cmd run lint` | **Antes de fazer commit / abrir PR.** Verifica se há erros de código, variáveis não usadas ou problemas nas regras do React (ESLint). |
| `npm.cmd run build` | **Antes de fazer commit / abrir PR.** Testa se o código compila para produção sem erros de importação ou CSS/Sass. |

#### B) Rodando via Docker (Na raiz do repositório)

| Comando | Quando usar |
| :--- | :--- |
| `docker compose up -d --build frontend` | **Quando o `package.json` ou `frontend/Dockerfile` for alterado** (ex.: após puxar alterações da `main`/`staging` com pacotes novos). |
| `docker compose exec frontend npm install <nome-do-pacote>` | **Para instalar um pacote novo** diretamente dentro do contêiner do frontend. |
| `docker compose exec frontend npm run lint` | **Antes de commitar**, para rodar o ESLint dentro do contêiner. |
| `docker compose exec frontend npm run build` | **Antes de commitar**, para testar o build de produção dentro do contêiner. |

---

### 4. Comandos para Desenvolvedores Backend

Como o backend depende do **PostgreSQL 16**, recomenda-se executar os comandos pelo Docker Compose (na raiz do repositório):

#### A) Banco de Dados, Migrações e Administração (Django)

| Comando | Quando usar |
| :--- | :--- |
| `docker compose exec backend python manage.py makemigrations` | **Sempre que criar ou alterar um model (`models.py`).** Gera o arquivo de migração na pasta `migrations/` *(que deve ser commitado no Git)*. |
| `docker compose exec backend python manage.py migrate` | **Logo após o `makemigrations` ou após dar `git pull`** com migrações novas feitas por colegas. Aplica as tabelas/colunas no PostgreSQL. |
| `docker compose exec backend python manage.py createsuperuser` | **Quando quiser acessar o painel `/admin/` do Django** (`http://localhost:8000/admin/`) para inspecionar ou cadastrar registros manualmente. |
| `docker compose exec backend python manage.py check` | **Para validar a integridade da configuração do Django** (`settings.py`, `urls.py`, `models.py`). |
| `docker compose up -d --build backend` | **Quando adicionar uma biblioteca nova no `requirements.txt`** ou alterar o `backend/Dockerfile`. |
| `docker compose exec backend sh` | **Para abrir um terminal interativo** dentro do contêiner do backend. |
| `docker compose exec db psql -U futboard -d futboard` | **Para abrir o cliente SQL interativo (`psql`)** conectado diretamente ao banco PostgreSQL. |

#### B) Testes Automatizados e Qualidade de Código (Ruff + Coverage)

| Comando | Quando usar |
| :--- | :--- |
| `docker compose exec backend python manage.py test` | **Durante o desenvolvimento e antes de commitar.** Executa toda a suíte de testes automatizados (`tests.py`) dos apps `ciclos`, `treinos` e `usuarios`. |
| `docker compose exec backend coverage run manage.py test`<br>`docker compose exec backend coverage report -m` | **Antes de abrir Pull Request (critério de DoD).** Executa os testes medindo a cobertura de código e exibe as linhas não cobertas. |
| `docker compose exec backend ruff check .` | **Antes de commitar.** Analisa o código Python procurando erros de estilo, imports fora de ordem ou variáveis não utilizadas. |
| `docker compose exec backend ruff format --check .` | **Antes de commitar.** Verifica se todos os arquivos `.py` estão formatados no padrão do projeto. |
| `docker compose exec backend ruff format .` | **Quando o comando acima indicar diferenças de formatação.** Formata automaticamente todos os arquivos Python do backend. |

#### C) Backup e Restauração do Banco de Dados

| Comando | Quando usar |
| :--- | :--- |
| `docker compose exec -T db pg_dump -U futboard futboard > backup_futboard.sql` | **Quando quiser exportar um backup (`.sql`)** dos dados atuais do banco de desenvolvimento. |
| `docker compose exec -T db psql -U futboard -d futboard < backup_futboard.sql` *(Linux/macOS)*<br>`Get-Content backup_futboard.sql \| docker compose exec -T db psql -U futboard -d futboard` *(PowerShell)* | **Quando quiser restaurar um backup (`.sql`)** no banco em execução. |

---

### 5. Checklist Rápido antes de cada Commit / Pull Request

**Se você alterou o Frontend:**
```powershell
cd frontend
npm.cmd run lint
npm.cmd run build
```

**Se você alterou o Backend:**
```powershell
docker compose exec backend python manage.py check
docker compose exec backend ruff check .
docker compose exec backend ruff format --check .
docker compose exec backend python manage.py test
```

---
