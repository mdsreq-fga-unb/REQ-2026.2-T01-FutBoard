# FutBoard ⚽📋

> **Repositório da disciplina de Requisitos de Software - 2026.2 - Turma 01**  
> **Universidade de Brasília (UnB) - Faculdade do Gama (FGA)**



##  Sobre o Projeto

O **FutBoard** é um sistema idealizado para solucionar a dificuldade no controle e planejamento dos treinos de equipes esportivas. Em um ambiente esportivo desafiador e com constante demanda por resultados, o acompanhamento de equipes costuma ser feito por meio de anotações fragmentadas e dashboards estáticos. 

O objetivo do FutBoard é centralizar, padronizar e otimizar o registro manual de treinos, facilitando a gestão da equipe e o acompanhamento de desempenho.

##  Documentação (GitHub Pages)

Toda a documentação do projeto, incluindo elicitação, modelagem, análise e planejamento, está hospedada e versionada utilizando o **GitHub Pages**.

🔗 **Acesse a documentação completa aqui:**  
[[Link para o GitPages do FutBoard](https://mdsreq-fga-unb.github.io/REQ-2026.2-T01-FutBoard/)] 

## Executar a aplicação localmente

A aplicação é composta por um frontend React, uma API Django REST Framework e um banco PostgreSQL, orquestrados pelo Docker Compose.

### Pré-requisitos

- Docker Desktop com Docker Compose
- Git

### Iniciar os serviços

Na raiz do repositório, copie o arquivo de exemplo de variáveis de ambiente e suba os containers:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

O primeiro build pode demorar alguns minutos. Quando os serviços estiverem prontos, acesse:

- Frontend: http://localhost:5173
- API: http://localhost:8000/api/
- PostgreSQL: `localhost:5432`

### Comandos úteis

```powershell
# Aplicar migrações do Django
docker compose exec backend python manage.py migrate

# Criar um usuário administrador
docker compose exec backend python manage.py createsuperuser

# Acompanhar os logs
docker compose logs -f

# Parar os serviços, mantendo os dados do banco
docker compose down
```

Para apagar também os dados persistidos do PostgreSQL, execute `docker compose down -v`.
As credenciais e portas locais podem ser ajustadas no arquivo `.env`; não versione esse arquivo.

### Estrutura da aplicação

- `backend/apps/`: módulos de negócio de treinos, ciclos de periodização e usuários.
- `frontend/src/`: páginas, componentes, estilos e serviços HTTP.
- `.docker/postgres/`: scripts SQL executados pelo PostgreSQL na primeira inicialização do volume.

O scaffold disponibiliza a infraestrutura e os pontos de entrada da aplicação. Os modelos e funcionalidades de negócio serão implementados nas próximas etapas do MVP.

