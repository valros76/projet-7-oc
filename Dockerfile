FROM oven/bun:1
WORKDIR /app

# 1. Copie des fichiers de dépendances et installation
COPY package.json bun.lockb* ./
RUN bun install

# 2. Copie du reste du code source (incluant drizzle.config.ts)
COPY . .

EXPOSE 3000

# 3. Lancement en mode développement (Hot-reload)
CMD ["bun", "run", "dev"]