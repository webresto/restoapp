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