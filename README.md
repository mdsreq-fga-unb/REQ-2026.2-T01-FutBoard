# FutBoard ⚽📋

> **Repositório da disciplina de Requisitos de Software - 2026.2 - Turma 01**  
> **Universidade de Brasília (UnB) - Faculdade do Gama (FGA / FCTE)**

---

## Sobre o Projeto

O **FutBoard** é um sistema web idealizado para solucionar a dificuldade no controle, planejamento e análise dos treinos de equipes esportivas de futebol de base (Sub-17 do Canaã Esporte Clube). Em um ambiente esportivo desafiador e com constante demanda por resultados, o acompanhamento da equipe costumava ser feito por meio de anotações fragmentadas em planilhas e dashboards estáticos.

O objetivo do FutBoard é centralizar, padronizar e otimizar o registro categorizado de treinos estruturado na periodização esportiva (macrociclos, mesociclos, microciclos e sessões), fornecendo indicadores analíticos em tempo real e relatórios em PDF para apoiar a tomada de decisão da comissão técnica.

## Documentação (GitHub Pages)

Toda a documentação do projeto, incluindo elicitação, modelagem, análise, catálogo de termos e planejamento, está hospedada e versionada utilizando o **MkDocs Material** e o **GitHub Pages**.

🔗 **Acesse a documentação completa aqui:**  
[[Link para o GitPages do FutBoard](https://mdsreq-fga-unb.github.io/REQ-2026.2-T01-FutBoard/)]

---

## Arquitetura e Stack Tecnológica

Conforme definido no documento de [Solução Proposta](docs/visao-produto/solucao-proposta.md), a aplicação adota uma arquitetura cliente-servidor desacoplada dividida em três camadas principais:

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

## Padronização do Fluxo de Desenvolvimento (Comandos Úteis)

### Subir, Pausar e Derrubar Serviços

```bash
# Subir os serviços aproveitando imagens existentes
docker compose up -d

# Parar os contêineres preservando os dados do banco
docker compose stop

# Derrubar os contêineres e a rede (mantém o volume de dados do PostgreSQL)
docker compose down

# Reiniciar apenas um serviço específico (ex.: backend)
docker compose restart backend
```

### Reconstruir Imagens (após alterar `Dockerfile`, `requirements.txt` ou `package.json`)

```bash
# Reconstruir todas as imagens sem cache e recriar contêineres
docker compose build --no-cache
docker compose up -d --force-recreate

# Reconstruir apenas um serviço específico (ex.: frontend)
docker compose up -d --build frontend
```

### Gerenciamento de Dependências e Migrações

```bash
# Criar novas migrações após alterar models.py no Django
docker compose exec backend python manage.py makemigrations

# Aplicar migrações no banco de dados
docker compose exec backend python manage.py migrate

# Criar superusuário para acessar o Django Admin
docker compose exec backend python manage.py createsuperuser

# Instalar um novo pacote no frontend dentro do contêiner
docker compose exec frontend npm install <nome-do-pacote>
```

### Execução de Testes e Verificações

```bash
# Executar a suíte de testes automatizados do backend Django
docker compose exec backend python manage.py test

# Verificar integridade da configuração do projeto Django
docker compose exec backend python manage.py check

# Executar testes com relatório de cobertura no backend
docker compose exec backend coverage run manage.py test
docker compose exec backend coverage report -m

# Testar o build de produção do frontend
docker compose exec frontend npm run build
```

### Formatação e Análise Estática de Código (Qualidade)

```bash
# Backend: análise estática (lint) e verificação de formatação com Ruff
docker compose exec backend ruff check .
docker compose exec backend ruff format --check .

# Backend: aplicar formatação automática com Ruff
docker compose exec backend ruff format .

# Frontend: análise estática com ESLint
docker compose exec frontend npm run lint
```

### Consulta de Logs e Diagnóstico de Problemas

```bash
# Verificar o status e a saúde (healthcheck) dos contêineres
docker compose ps

# Acompanhar os logs de todos os serviços em tempo real
docker compose logs -f

# Acompanhar logs de um serviço específico (db, backend ou frontend)
docker compose logs -f backend

# Abrir um terminal interativo no backend ou no banco PostgreSQL
docker compose exec backend sh
docker compose exec db psql -U futboard -d futboard
```

### Persistência, Backup, Restauração e Limpeza de Dados

Os dados do PostgreSQL ficam armazenados no volume nomeado `postgres_data`, garantindo que não sejam perdidos ao executar `docker compose down`.

```bash
# Exportar um backup (dump) do banco de dados de desenvolvimento
docker compose exec -T db pg_dump -U futboard futboard > backup_futboard.sql

# Restaurar um backup no banco em execução
docker compose exec -T db psql -U futboard -d futboard < backup_futboard.sql

# Limpar completamente os dados do banco e recriar os volumes do zero (AÇÃO DESTRUTIVA)
docker compose down -v
```

> **Nota para usuários Windows (PowerShell):** O redirecionamento `<` não é nativo no PowerShell. Para restaurar um backup no PowerShell, utilize:  
> `Get-Content backup_futboard.sql | docker compose exec -T db psql -U futboard -d futboard`  
> Além disso, caso execute comandos `npm` diretamente no terminal do Windows fora do Docker e receba erro de política de execução (`PSSecurityException` no `npm.ps1`), utilize `npm.cmd` (ex.: `npm.cmd run build`) ou habilite scripts para o seu usuário com `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

---