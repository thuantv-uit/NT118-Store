.PHONY: db_up db_down restart logs ps

DC_FILE = test-db/docker-compose.yml

db_up:
	docker compose -f $(DC_FILE) up -d

db_down:
	docker compose -f $(DC_FILE) down

restart: down up

logs:
	docker compose -f $(DC_FILE) logs -f

ps:
	docker compose -f $(DC_FILE) ps
