.PHONY: db_test_up db_test_down be_local_up be_local_down restart logs ps

DC_FILE = test-db/docker-compose.yml

db_test_up:
	docker compose -f $(DC_FILE) up -d

db_test_down:
	docker compose -f $(DC_FILE) down

be_local_up:
	docker compose up -d

be_local_down:
	docker compose down

restart: down up

logs:
	docker compose -f $(DC_FILE) logs -f

ps:
	docker compose -f $(DC_FILE) ps
