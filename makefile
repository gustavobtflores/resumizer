.PHONY: up frontend backend all

up:
	docker compose up -d

frontend:
	cd apps/frontend && npm install && npm run dev

# Starts backend with npm run dev
backend:
	cd apps/backend && npm install && npx drizzle-kit push && npm run dev

# Run everything: docker-compose, frontend, and backend
dev: up
	$(MAKE) -j2 frontend backend
