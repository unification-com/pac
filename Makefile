init-dev:
	docker-compose -f docker-compose.builder.yml run --rm install
dev:
	docker-compose up
dev-down:
	docker-compose down
