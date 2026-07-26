# 🚀 Webdevoo Lead

> **Application de gestion des apporteurs d'affaires et des opportunités commerciales (Leads)**

Webdevoo Lead est une application web moderne développée avec **Nuxt 4**, permettant de gérer les utilisateurs, les apporteurs d'affaires et leurs leads au sein d'une architecture **Backend For Frontend (BFF)**.

Le projet met l'accent sur la **sécurité**, la **maintenabilité** et **l'automatisation du déploiement**, tout en restant compatible avec un hébergement mutualisé.

---

## ✨ Fonctionnalités

### Actuellement

* 🔐 Authentification sécurisée par JWT
* 🔄 Renouvellement automatique des sessions (Refresh Token)
* 🛡️ Protection des pages privées par middleware
* ⚡ Client HTTP centralisé avec gestion automatique des tokens
* 🏗️ Architecture Nuxt 4 (BFF)
* 🔒 API sécurisée
* 🚀 Pipeline CI/CD GitHub Actions

### À venir

* 📋 Gestion complète des leads
* 👥 Gestion des utilisateurs
* 🤝 Gestion des apporteurs d'affaires
* 📊 Tableau de bord statistique
* 🔎 Recherche et filtrage
* 📈 Reporting

---

# 🏗️ Stack technique

| Domaine | Technologie |
|----------|-------------|
| Framework | Nuxt 4 |
| Runtime | Nitro |
| Langage | TypeScript |
| Base de données | MySQL |
| ORM | Drizzle ORM |
| Client HTTP | ofetch |
| Authentification | JWT + Refresh Token |
| Typage partagé | `shared/` (types et interfaces communs Front/Back) |
| Tests unitaires | Vitest |
| Tests E2E | Playwright |
| Linter | ESLint |
| CI/CD | GitHub Actions |
| Hébergement | PlanetHoster |

---

# 📁 Architecture du projet

```text
webdevoo-lead/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── app/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── middleware/
│   ├── pages/
│   ├── plugins/
│   └── app.vue
│
├── server/
│   ├── api/
│   ├── database/
│   └── utils/
│
├── shared/
│   └── types/
│       ├── index.ts
│       ├── auth.ts
│       ├── lead.ts
│       └── user.ts
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── public/
│
├── drizzle.config.ts
├── nuxt.config.ts
├── package.json
├── playwright.config.ts
├── vitest.config.ts
├── tsconfig.json
│
├── README.md
├── STRUCTURE.md
└── documentation.md
```

Une documentation détaillée de cette architecture est disponible dans **STRUCTURE.md**.

---

# ⚙️ Architecture générale

L'application suit le modèle **Backend For Frontend (BFF)**.

```text
                 Navigateur
                      │
                      ▼
                Application Nuxt 4
                      │
      ┌───────────────┴───────────────┐
      │                               │
      ▼                               ▼
 Front-end Vue                  API Nitro
      │                               │
      └───────────────┬───────────────┘
                      ▼
                Drizzle ORM
                      │
                      ▼
                    MySQL
```

Le serveur **Nitro** assure simultanément :

* le rendu de l'application ;
* les routes API ;
* la logique métier ;
* l'authentification ;
* les accès à la base de données.

Les types et interfaces TypeScript sont centralisés dans le dossier racine **`shared/`** afin d'être utilisés aussi bien par le front-end (`app/`) que par le serveur (`server/`).

Cette mutualisation garantit :

- un typage unique partagé entre le client et le serveur ;
- l'absence de duplication des interfaces métier ;
- une meilleure maintenabilité du code ;
- une cohérence des modèles de données sur l'ensemble de l'application.

---

# 🔐 Authentification

L'application utilise une authentification moderne basée sur deux jetons.

## Access Token

* JWT à durée de vie courte
* transmis dans l'en-tête

```http
Authorization: Bearer <token>
```

## Refresh Token

* stocké dans un cookie **HttpOnly**
* non accessible en JavaScript
* permet de renouveler automatiquement la session

---

# 🌐 Client HTTP personnalisé

Toutes les requêtes transitent par un client HTTP `$api` basé sur **ofetch**.

Celui-ci assure automatiquement :

* l'ajout du Bearer Token ;
* le rafraîchissement automatique du JWT ;
* le rejeu transparent de la requête après un code **401** ;
* la centralisation de toute la logique d'authentification.

Ainsi, aucune logique liée aux tokens n'est dupliquée dans les composants Vue.

---

# 📄 Pages principales

| Page               | Description                       |
| ------------------ | --------------------------------- |
| `/`                | Connexion / Inscription (onglets) |
| `/leads/dashboard` | Tableau de bord sécurisé          |
| `/leads/new`       | Création d'un lead *(à venir)*    |

Les routes privées sont protégées grâce au middleware :

```text
app/middleware/auth.ts
```

---

# 🛡️ Sécurité

Le projet applique plusieurs bonnes pratiques de sécurité.

* JWT à durée de vie courte
* Refresh Token sécurisé
* Cookies HttpOnly
* bcrypt pour les mots de passe
* Requêtes préparées Drizzle ORM
* Protection contre les injections SQL
* Variables d'environnement
* Secrets GitHub Actions

---

# 🧪 Tests

Les tests automatisés garantissent la stabilité du projet.

## Vitest

* Tests unitaires
* Tests d'intégration

## Playwright

* Parcours utilisateur
* Authentification
* Workflow de création de lead

---

# 🚀 CI / CD

Chaque **Push** ou **Pull Request** déclenche automatiquement le pipeline GitHub Actions.

Le pipeline exécute :

1. Installation des dépendances
2. Analyse ESLint
3. Vérification TypeScript
4. Tests Vitest
5. Tests Playwright
6. Build Nuxt
7. Génération des artefacts

---

# 💻 Installation

## Lancement avec Docker (Recommandé)

### 1. Cloner le projet

```bash
git clone https://github.com/<organisation>/webdevoo-lead.git

cd webdevoo-lead
```

### 2. Créer le fichier d'environnement

```bash
cp .env.example .env
```

Configurer ensuite les variables d'environnement dans le fichier `.env`.

### 3. Lancer l'application

```bash
docker compose up --build
```

L'application sera alors disponible sur :

```text
http://localhost:3000
```

---

## Installation manuelle

### Installer les dépendances

Avec Bun :

```bash
bun install
```

ou avec npm :

```bash
npm install
```

---

### Lancer le serveur de développement

Avec Bun :

```bash
bun run dev
```

ou

```bash
npm run dev
```

L'application sera accessible sur :

```text
http://localhost:3000
```
---

# 🧪 Exécuter les tests

Tests unitaires

```bash
bun run test
```

Tests End-to-End

```bash
bun run test:e2e
```

Lint

```bash
bun run lint
```

Build

```bash
bun run build
```

---

# 📦 Déploiement

Le projet est conçu pour être déployé sur **PlanetHoster**.

Le pipeline CI/CD génère automatiquement le dossier :

```text
.output/
```

Celui-ci est ensuite transféré sur le serveur de production.

Aucune conteneurisation n'est utilisée en production afin de rester compatible avec l'environnement d'hébergement.

---

# 📚 Documentation

Le projet est accompagné de plusieurs documents :

| Document           | Description                        |
| ------------------ | ---------------------------------- |
| `README.md`        | Présentation générale du projet    |
| `STRUCTURE.md`     | Organisation complète des fichiers |
| `documentation.md` | Documentation technique détaillée  |

---

# 👨‍💻 Développement

Le projet respecte les conventions de **Nuxt 4** et privilégie :

* une architecture modulaire ;
* des composants réutilisables ;
* des composables dédiés à la logique métier ;
* une séparation claire entre le front-end et le serveur ;
* un code fortement typé avec TypeScript.

---

# 📄 Licence

Projet développé dans le cadre de **Webdevoo**.

© 2026 Webdevoo — Tous droits réservés.
