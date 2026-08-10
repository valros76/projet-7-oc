# 🚀 Webdevoo Lead

> **Application de gestion des apporteurs d'affaires et des opportunités commerciales (Leads)**

Webdevoo Lead est une application web développée avec **Nuxt 4**, permettant de gérer les utilisateurs, les apporteurs d'affaires et leurs opportunités commerciales (leads) au sein d'une architecture **Backend For Frontend (BFF)**.

L'application centralise l'authentification, la gestion des utilisateurs, la création et le suivi des leads ainsi que le calcul des gains associés.

Le projet met l'accent sur la **sécurité**, la **maintenabilité**, le **typage**, les **tests automatisés** et l'**automatisation du déploiement**.

---

# ✨ Fonctionnalités

## Authentification

* 🔐 Connexion utilisateur ;
* 📝 Inscription utilisateur ;
* 🔑 Authentification basée sur JWT ;
* 🔄 Renouvellement automatique de la session ;
* 🍪 Gestion des tokens via cookies ;
* 🛡️ Protection des routes privées ;
* 🚪 Déconnexion ;
* 🔒 Protection des API côté serveur.

## Gestion des leads

* 📋 Consultation des leads ;
* ➕ Création d'un nouveau lead ;
* 🔎 Consultation du détail d'un lead ;
* ✏️ Modification d'un lead ;
* 🗑️ Suppression d'un lead ;
* 📊 Tableau de bord des leads ;
* 💰 Consultation des gains ;
* 🔎 Filtrage des données.

## Gestion des utilisateurs

* 👥 Consultation des utilisateurs ;
* ✏️ Modification des utilisateurs ;
* 🗑️ Suppression des utilisateurs ;
* 🔐 Accès aux fonctionnalités d'administration réservé aux utilisateurs autorisés.

## Interface utilisateur

* 🧭 Navigation centralisée ;
* 🔐 Affichage conditionnel des éléments de navigation selon l'état d'authentification ;
* 📱 Interface organisée en composants Vue réutilisables ;
* 🔔 Notifications utilisateur ;
* 📄 Pagination ;
* 🏷️ Badges de statut.

## Qualité et sécurité

* 🧪 Tests unitaires avec Vitest ;
* 🎭 Tests End-to-End avec Playwright ;
* 📊 Rapport de couverture de code ;
* 🔍 Analyse ESLint ;
* 🏗️ Vérification TypeScript ;
* 🚀 Pipeline CI/CD GitHub Actions ;
* 🔒 Secrets et variables d'environnement ;
* 🗄️ ORM Drizzle avec requêtes préparées.

---

# 🏗️ Stack technique

| Domaine                   | Technologie         |
| ------------------------- | ------------------- |
| Framework                 | Nuxt 4              |
| Runtime                   | Nitro               |
| Langage                   | TypeScript          |
| Front-end                 | Vue.js              |
| Base de données           | MySQL               |
| ORM                       | Drizzle ORM         |
| Client HTTP               | ofetch              |
| Authentification          | JWT + Refresh Token |
| Typage partagé            | `shared/`           |
| Tests unitaires           | Vitest              |
| Environnement de test DOM | happy-dom           |
| Tests E2E                 | Playwright          |
| Couverture                | V8                  |
| Linter                    | ESLint              |
| CI/CD                     | GitHub Actions      |
| Gestionnaire de paquets   | Bun                 |
| Hébergement               | PlanetHoster        |

---

# 📁 Architecture du projet

```text
webdevoo-lead/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                         # Pipeline GitHub Actions
│
├── app/                                      # Front-end Nuxt 4
│   ├── assets/
│   │   └── css/
│   │       └── init.css                      # Styles CSS globaux
│   │
│   ├── components/                           # Composants Vue réutilisables
│   │   ├── auth/
│   │   │   └── Logout.vue                    # Composant de déconnexion
│   │   ├── common/
│   │   │   ├── BadgeStatus.vue               # Badge de statut
│   │   │   ├── Pagination.vue                # Pagination
│   │   │   └── ToastNotification.vue         # Notifications
│   │   ├── dashboard/
│   │   │   ├── DashboardFilters.vue          # Filtres du dashboard
│   │   │   └── DashboardTable.vue            # Tableau du dashboard
│   │   ├── layout/
│   │   │   └── Navbar.vue                    # Barre de navigation
│   │   └── leads/
│   │       ├── LeadFilters.vue               # Filtres des leads
│   │       ├── LeadKpiGrid.vue               # Indicateurs KPI
│   │       ├── LeadModal.vue                 # Modale de lead
│   │       └── LeadTable.vue                 # Tableau des leads
│   │
│   ├── composables/
│   │   └── auth/
│   │       └── useAuth.ts                    # Gestion de l'authentification
│   │
│   ├── layouts/
│   │   └── default.vue                       # Layout principal
│   │
│   ├── middleware/
│   │   └── auth.ts                            # Protection des routes privées
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   └── users.vue                     # Administration des utilisateurs
│   │   ├── leads/
│   │   │   ├── dashboard.vue                 # Tableau de bord des leads
│   │   │   ├── earnings.vue                  # Consultation des gains
│   │   │   ├── new.vue                       # Création d'un lead
│   │   │   └── [id].vue                      # Détail d'un lead
│   │   └── index.vue                          # Connexion / Inscription
│   │
│   ├── plugins/
│   │   └── api.ts                            # Client HTTP $api
│   │
│   ├── types/
│   │   └── nuxt.d.ts                         # Déclarations TypeScript Nuxt
│   │
│   └── app.vue                               # Composant racine
│
├── server/                                   # Back-end Nitro
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts                 # Connexion
│   │   │   ├── logout.post.ts                # Déconnexion
│   │   │   ├── refresh.post.ts               # Rafraîchissement de session
│   │   │   └── register.post.ts              # Inscription
│   │   ├── leads/
│   │   │   ├── earnings.get.ts               # Calcul / consultation des gains
│   │   │   ├── index.get.ts                   # Liste des leads
│   │   │   ├── index.post.ts                  # Création d'un lead
│   │   │   ├── [id].get.ts                    # Détail d'un lead
│   │   │   ├── [id].put.ts                    # Modification d'un lead
│   │   │   └── [id].delete.ts                 # Suppression d'un lead
│   │   └── users/
│   │       ├── index.get.ts                   # Liste des utilisateurs
│   │       ├── [id].put.ts                    # Modification d'un utilisateur
│   │       └── [id].delete.ts                 # Suppression d'un utilisateur
│   │
│   ├── database/
│   │   ├── migrations/                        # Migrations Drizzle
│   │   │   ├── meta/
│   │   │   └── 0000_brief_storm.sql
│   │   └── schema.ts                          # Schéma de base de données
│   │
│   ├── middleware/
│   │   └── auth.ts                            # Protection des endpoints API
│   │
│   ├── repositories/
│   │   └── userRepository.ts                  # Accès aux données utilisateurs
│   │
│   └── utils/
│       ├── auth.ts                            # JWT, hash et vérification
│       └── drizzle.ts                         # Connexion Drizzle / MySQL
│
├── shared/
│   └── types/                                 # Types Front-end / Back-end partagés
│       ├── index.ts                           # Export centralisé
│       ├── auth.ts                            # Types d'authentification
│       ├── lead.ts                            # Types des leads
│       └── user.ts                            # Types des utilisateurs
│
├── tests/
│   ├── unit/
│   │   ├── api.test.ts                        # Tests du client API
│   │   └── auth.test.ts                       # Tests de l'authentification
│   │
│   └── e2e/
│       ├── auth.spec.ts                       # Parcours d'authentification
│       ├── global-setup.ts                    # Initialisation globale Playwright
│       └── lead-workflow.spec.ts              # Parcours complet d'un lead
│
├── public/
│   ├── favicon.ico                            # Favicon
│   └── robots.txt                             # Instructions pour les robots
│
├── .env                                      # Variables d'environnement locales
├── .env.example                              # Exemple de configuration
├── .gitignore                                # Fichiers exclus de Git
├── .dockerignore                             # Fichiers exclus de Docker
├── .nuxtrc                                   # Configuration Nuxt
├── bun.lock                                  # Lockfile Bun
├── docker-compose.yml                         # Configuration Docker Compose
├── Dockerfile                                # Image Docker
├── drizzle.config.ts                         # Configuration Drizzle Kit
├── nuxt.config.ts                            # Configuration Nuxt
├── package.json                              # Dépendances et scripts
├── playwright.config.ts                     # Configuration Playwright
├── tsconfig.json                             # Configuration TypeScript
├── vitest.config.ts                          # Configuration Vitest
├── README.md                                 # Présentation et prise en main
├── STRUCTURE.md                              # Structure détaillée du projet
└── DOCUMENTATION.md                          # Documentation technique
```

Les dossiers générés tels que `.nuxt/`, `node_modules/`, `coverage/`, `playwright-report/` et `test-results/` ne font pas partie du code source de l'application. Ils sont générés automatiquement par Nuxt ou par les outils de test.

Une description détaillée de l'organisation des fichiers est disponible dans **`STRUCTURE.md`**.

---

# 🏗️ Architecture générale

L'application suit une architecture **Backend For Frontend (BFF)** basée sur Nuxt 4 et Nitro.

```text
                         Navigateur
                              │
                              ▼
                         Nuxt 4 / Vue
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
            Pages / UI                Client $api
                 │                         │
                 └────────────┬────────────┘
                              │
                              ▼
                         API Nitro
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        Authentification    Leads          Users
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                       Repositories
                              │
                              ▼
                       Drizzle ORM
                              │
                              ▼
                            MySQL
```

Le serveur **Nitro** assure notamment :

* les routes API ;
* la logique serveur ;
* l'authentification ;
* la protection des endpoints ;
* l'accès à la base de données ;
* l'intégration avec Drizzle ORM.

Les types métier sont centralisés dans **`shared/`** afin d'être utilisés à la fois par le front-end et le back-end.

Cette organisation permet :

* d'éviter la duplication des interfaces ;
* de conserver un typage cohérent ;
* de faciliter les évolutions ;
* de séparer clairement les responsabilités.

---

# 🔐 Authentification

L'application utilise un mécanisme d'authentification basé sur un **Access Token JWT** et un **Refresh Token**.

## Access Token

L'Access Token est utilisé pour authentifier les requêtes vers l'API.

Le client HTTP ajoute automatiquement le token dans l'en-tête :

```http
Authorization: Bearer <token>
```

## Refresh Token

Le Refresh Token permet de renouveler la session lorsqu'un Access Token arrive à expiration.

Le mécanisme de rafraîchissement est centralisé afin d'éviter de dupliquer cette logique dans les différents composants de l'application.

---

# Administration
Pour créer un compte administrateur : 
- Créez un compte utilisateur classique
- Modifiez le rôle de l'utilisateur, pour passer de `referrer` à `admin`, via une commande SQL, sur la table `users`.

---

# 🌐 Client HTTP `$api`

Le fichier :

```text
app/plugins/api.ts
```

fournit un client HTTP personnalisé basé sur **ofetch**.

Le client `$api` assure notamment :

* l'ajout automatique du Bearer Token ;
* la détection des réponses `401 Unauthorized` ;
* la tentative de renouvellement de session ;
* le rejeu de la requête initiale après renouvellement ;
* la déconnexion lorsque le renouvellement échoue.

Les composants Vue n'ont donc pas besoin d'implémenter eux-mêmes cette logique.

---

# 📄 Pages principales

| Page               | Description                        |
| ------------------ | ---------------------------------- |
| `/`                | Connexion / Inscription (onglets)  |
| `/leads/dashboard` | Tableau de bord sécurisé des leads |
| `/leads/new`       | Création d'un nouveau lead         |
| `/leads/[id]`      | Consultation et gestion d'un lead  |
| `/leads/earnings`  | Consultation des gains             |
| `/admin/users`     | Administration des utilisateurs    |

Les routes privées sont protégées grâce au middleware :

```text
app/middleware/auth.ts
```

La barre de navigation située dans :

```text
app/components/layout/Navbar.vue
```

adapte également son affichage selon l'état d'authentification de l'utilisateur.

---

# 👤 Prise en main de l'application

## 1. Accéder à l'application

Après démarrage du serveur, ouvrir :

```text
http://localhost:3000
```

La page `/` constitue le point d'entrée de l'application.

Elle permet de :

* se connecter ;
* créer un compte ;
* accéder ensuite aux fonctionnalités protégées.

---

## 2. Se connecter ou s'inscrire

L'écran d'accueil propose les fonctionnalités de connexion et d'inscription.

Après une authentification réussie, l'utilisateur dispose d'une session lui permettant d'accéder aux routes privées.

La navigation est alors adaptée automatiquement à son état de connexion.

---

## 3. Consulter le tableau de bord

Une fois connecté, accéder à :

```text
/leads/dashboard
```

Le tableau de bord permet de consulter les informations relatives aux leads et d'utiliser les fonctionnalités de filtrage et de suivi proposées par l'application.

---

## 4. Créer un lead

La création d'un lead s'effectue depuis :

```text
/leads/new
```

Le formulaire permet de renseigner les informations nécessaires à l'enregistrement d'une nouvelle opportunité commerciale.

La création est effectuée via l'API Nitro correspondante :

```text
POST /api/leads
```

---

## 5. Consulter un lead

Chaque lead possède une route dédiée :

```text
/leads/[id]
```

Cette page permet d'accéder aux informations détaillées du lead et, selon les droits de l'utilisateur, d'effectuer les opérations disponibles sur celui-ci.

---

## 6. Consulter les gains

Les informations relatives aux gains sont accessibles depuis :

```text
/leads/earnings
```

Les données sont récupérées via l'API :

```text
GET /api/leads/earnings
```

---

## 7. Administration des utilisateurs

Les utilisateurs disposant des droits nécessaires peuvent accéder à :

```text
/admin/users
```

Cette interface permet notamment de consulter, modifier et supprimer les utilisateurs via les endpoints correspondants.

---

# 🛡️ Sécurité

Le projet applique plusieurs mécanismes de sécurité :

* authentification JWT ;
* renouvellement de session ;
* protection des routes front-end ;
* protection des endpoints API ;
* mots de passe hachés ;
* variables d'environnement pour les secrets ;
* séparation des responsabilités entre front-end et serveur ;
* requêtes gérées par Drizzle ORM ;
* protection contre les injections SQL ;
* gestion centralisée de l'authentification côté client.

Les secrets et informations sensibles ne doivent jamais être commités dans le dépôt.

Le fichier :

```text
.env
```

est destiné à la configuration locale et doit rester exclu du contrôle de version.

Le fichier :

```text
.env.example
```

sert de modèle pour la configuration nécessaire au projet.

---

# 🧪 Tests

Le projet utilise deux niveaux principaux de tests.

## Tests unitaires

Les tests unitaires sont exécutés avec **Vitest**.

Ils couvrent notamment :

```text
tests/unit/api.test.ts
```

Tests du client HTTP `$api` et de son mécanisme de renouvellement de session.

```text
tests/unit/auth.test.ts
```

Tests des fonctions d'authentification, de génération et de vérification des tokens ainsi que de la protection des routes serveur.

### Exécuter les tests unitaires

```bash
bun run test:unit
```

### Exécuter les tests avec couverture

```bash
bun run test:unit:coverage
```

La couverture est générée avec **V8**.

Les rapports peuvent notamment être produits dans :

```text
coverage/
```

---

# 🎭 Tests End-to-End

Les tests E2E utilisent **Playwright**.

Ils couvrent notamment :

* l'authentification ;
* la navigation entre connexion et inscription ;
* la création d'un lead ;
* le fonctionnement d'une session existante ;
* le rafraîchissement de session ;
* les principaux workflows utilisateur.

Les tests sont situés dans :

```text
tests/e2e/
```

### Exécuter les tests E2E

```bash
bun run test:e2e
```

Les rapports Playwright sont générés dans :

```text
playwright-report/
```

Les résultats et traces d'exécution peuvent être générés dans :

```text
test-results/
```

---

# 🔍 Qualité du code

Le projet utilise ESLint pour contrôler la qualité et la cohérence du code.

```bash
bun run lint
```

La vérification TypeScript peut être effectuée via la commande de type-checking configurée dans le projet.

---

# 🚀 CI / CD

Le projet dispose d'un pipeline GitHub Actions situé dans :

```text
.github/workflows/ci-cd.yml
```

Le pipeline permet d'automatiser les contrôles avant déploiement.

Selon la configuration actuelle du projet, il peut notamment effectuer :

1. Installation des dépendances ;
2. Analyse du code ;
3. Vérification TypeScript ;
4. Tests unitaires ;
5. Tests avec couverture ;
6. Tests Playwright ;
7. Build Nuxt ;
8. Génération des artefacts.

---

# 💻 Installation

## Prérequis

Pour travailler localement, il est recommandé de disposer de :

* Node.js ;
* Bun ;
* MySQL ;
* Git.

Docker est également disponible pour faciliter l'environnement de développement.

---

## 1. Cloner le projet

```bash
git clone https://github.com/<organisation>/webdevoo-lead.git

cd webdevoo-lead
```

---

## 2. Installer les dépendances

Avec Bun :

```bash
bun install
```

Ou avec npm :

```bash
npm install
```

---

## 3. Configurer l'environnement

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Sous PowerShell :

```powershell
Copy-Item .env.example .env
```

Puis renseigner les différentes variables nécessaires dans `.env`.

Les variables peuvent notamment concerner :

* la connexion à la base de données ;
* les secrets JWT ;
* la configuration de l'application ;
* les paramètres nécessaires au fonctionnement du serveur.

---

# 🐳 Lancement avec Docker

Le projet contient :

```text
Dockerfile
docker-compose.yml
```

Pour construire et lancer l'environnement :

```bash
docker compose up --build
```

L'application est ensuite accessible sur :

```text
http://localhost:3000
```

---

# 🧑‍💻 Développement local

Pour lancer Nuxt en mode développement :

```bash
bun run dev
```

L'application est disponible sur :

```text
http://localhost:3000
```

Le mode développement permet notamment de bénéficier du rechargement automatique des fichiers lors des modifications.

---

# 🗄️ Base de données

Le projet utilise :

* **MySQL** comme système de gestion de base de données ;
* **Drizzle ORM** pour l'accès aux données ;
* **Drizzle Kit** pour la gestion des migrations.

La configuration Drizzle est définie dans :

```text
drizzle.config.ts
```

Le schéma de la base de données est situé dans :

```text
server/database/schema.ts
```

Les migrations sont stockées dans :

```text
server/database/migrations/
```

---

# 📦 Scripts principaux

Les commandes disponibles sont définies dans `package.json`.

Les principales commandes de développement sont :

```bash
bun run dev
```

Lance le serveur de développement.

```bash
bun run build
```

Construit l'application pour la production.

```bash
bun run test:unit
```

Exécute les tests unitaires.

```bash
bun run test:unit:coverage
```

Exécute les tests unitaires avec génération de la couverture.

```bash
bun run test:e2e
```

Exécute les tests End-to-End Playwright.

```bash
bun run lint
```

Lance l'analyse ESLint.

---

# 📦 Build de production

Pour générer le build Nuxt :

```bash
bun run build
```

Le build Nuxt est généré dans :

```text
.output/
```

Le contenu de ce dossier correspond à la version destinée à être exécutée en production.

---

# 🌍 Déploiement

Le projet est conçu pour être déployé sur **PlanetHoster**.

La configuration de production dépend de l'environnement d'hébergement et des variables d'environnement disponibles sur le serveur.

Le pipeline CI/CD peut générer les artefacts nécessaires au déploiement.

Aucune information sensible ne doit être intégrée directement dans le code source.

---

# 📚 Documentation

Le projet est accompagné de plusieurs documents :

| Document           | Description                                 |
| ------------------ | ------------------------------------------- |
| `README.md`        | Présentation, installation et prise en main |
| `STRUCTURE.md`     | Organisation détaillée des fichiers         |
| `DOCUMENTATION.md` | Documentation technique détaillée           |

---

# 👨‍💻 Développement

Le projet respecte les conventions de **Nuxt 4** et privilégie :

* une architecture modulaire ;
* des composants Vue réutilisables ;
* des composables dédiés à la logique métier ;
* une séparation claire entre l'interface et le serveur ;
* une API centralisée ;
* un typage partagé via `shared/` ;
* un code fortement typé avec TypeScript ;
* une couverture par des tests unitaires et E2E ;
* une logique d'authentification centralisée.

Les fonctionnalités doivent être ajoutées en respectant l'organisation existante du projet afin de conserver une architecture cohérente et maintenable.

---

# 📄 Licence

Projet développé dans le cadre de **Webdevoo**.

© 2026 Webdevoo — Tous droits réservés.
