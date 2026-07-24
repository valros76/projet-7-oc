# --- Étape 1 : Le Builder ---
FROM oven/bun:1 AS builder
WORKDIR /app

# Copie des fichiers de configuration des dépendances
COPY package.json bun.lockb* ./
RUN bun install

# Copie du reste du code source
COPY . .

# Compilation de Nuxt
RUN bun run build

# --- Étape 2 : L'image de production ---
FROM oven/bun:1-slim
WORKDIR /app

# Copie uniquement des fichiers indispensables générés par le builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]