# ==========================================
# Stage 1: Build & Dépendances
# ==========================================
FROM oven/bun:1.1.20-slim AS builder

WORKDIR /app

# Optimisation du cache : copie explicite des fichiers de locks
COPY package.json bun.lockb* ./

# Installation propre des dépendances
RUN bun install --frozen-lockfile && \
    rm -rf ~/.bun/install/cache

# Copie du reste du code source
COPY . .

RUN bun run build

# ==========================================
# Stage 2: Runtime Production
# ==========================================
FROM oven/bun:1.1.20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# (Inutile de créer un utilisateur avec 'adduser', 'bun' existe déjà et est un utilisateur non-privilégié natif)
USER bun

# Copie sélective depuis l'étape "builder" avec affectation des droits
COPY --chown=bun:bun --from=builder /app/package.json ./
COPY --chown=bun:bun --from=builder /app/node_modules ./node_modules
COPY --chown=bun:bun --from=builder /app/src ./src

EXPOSE 3000

# Exécution en mode production (sans hot-reload)
CMD ["bun", "run", "start"]