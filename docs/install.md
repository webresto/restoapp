# [Install](./install.md) | [Features](./features.md) | [Modules](./modules.md)



# RestoApp Installation
---

## Quick Start with Docker

To quickly launch the application using Docker, run:

```bash
docker run --name restoapp -p 8080:8080 webresto/restoapp:latest
```

After starting the container, open your browser and go to http://localhost:8080 to access the RestoApp application.

### Build Image from Source

```bash
docker build -t webresto/restoapp:latest .
docker run --name restoapp -p 8080:8080 webresto/restoapp:latest
```

---

## Deployment with Docker Compose

For a more complex deployment with a Postgres database, use the following docker-compose.yml example:

```yaml
services:
  restoapp:
    image: "${DOCKER_IMAGE:-webresto/restoapp:next}"
    restart: always
    ports:
      - "8080:8080"
    environment:
      DB_MIGRATE: safe
      NODE_ENV: production
      DATASTORE: postgres
      PG_HOST: postgres
      AUTO_MIGRATION: 'TRUE'
      MODULES_AUTO_UPDATE: 'TRUE'
      LOG_LEVEL: 'debug'
      NODE_RED_TOKEN: 'put-your-token-here'
      STAGING: '0'
      WEBRESTO_LICENSE: "Free"
    env_file:
      - .env
    volumes:
      - ./tmp:/app/.tmp
      - ./modules:/app/modules
      - ./migrations:/app/migrations
      - ./backup:/backup
      - ./.env:/app/.env
    depends_on:
      - postgres

  postgres:
    image: postgres:14
    restart: always
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: postgres
    volumes:
      - ./postgres:/var/lib/postgresql/data
      - ./backup:/backup
```

Start the services with:

```bash
docker compose up -d
```

## Installing Additional Modules

See the instructions for installing and downloading modules in the section [Installing and Downloading Modules](./modules.md).

---

---

> **Note:**
> - All environment variables can be set in the `.env` file.
> - For local data and module storage, use the appropriate volume mounts.
> - After launch, an installation wizard will appear for initial platform setup.