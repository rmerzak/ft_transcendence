# Variables
COMPOSE = docker-compose
COMPOSE_FILE = docker-compose.yml

# Targets
.PHONY: build up down clean remove build-up

build:
	$(COMPOSE) -f $(COMPOSE_FILE) build

up:
	$(COMPOSE) -f $(COMPOSE_FILE) up -d

down:
	$(COMPOSE) -f $(COMPOSE_FILE) down

clean: down
	$(COMPOSE) -f $(COMPOSE_FILE) down --volumes --remove-orphans

remove: clean
	$(COMPOSE) -f $(COMPOSE_FILE) down --volumes --remove-orphans --rmi all

# Combined target for build and up
build-up: build up
