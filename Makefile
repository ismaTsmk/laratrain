.PHONY: up stop restart shell logs migrate artisan

up:
	docker compose up -d

stop:
	docker compose down

restart:
	docker compose restart

shell:
	docker compose exec php sh

logs:
	docker compose logs -f

migrate:
	docker compose exec php php artisan migrate

artisan:
	docker compose exec php php artisan $(cmd)
