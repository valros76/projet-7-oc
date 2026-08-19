# Documentation Technique – Projet Webdevoo Lead

## 1. Présentation du projet

### 1.1 Objectif

Le projet **Webdevoo Lead** a pour objectif de centraliser et de digitaliser la gestion des apporteurs d'affaires ainsi que le suivi des opportunités commerciales (leads).

L'application permet notamment :

* la gestion des utilisateurs ;
* la gestion des apporteurs d'affaires ;
* le suivi des leads ;
* la création et la consultation des leads ;
* la gestion des revenus liés aux leads ;
* la sécurisation des accès utilisateurs ;
* l'administration des utilisateurs ;
* l'automatisation du déploiement de l'application.

L'architecture retenue vise à produire une application performante, sécurisée, facilement maintenable et compatible avec l'environnement d'hébergement retenu.

---

## 2. Diagnostic de l'existant

### 2.1 Contexte technique

Le projet repose sur une architecture moderne basée sur les technologies suivantes.

| Domaine                   | Technologie                                 |
| ------------------------- | ------------------------------------------- |
| Framework Front-end / BFF | Nuxt 4 (Nitro)                              |
| Langage                   | TypeScript strict                           |
| Typage partagé            | Répertoire racine `shared/` (Front & Back)  |
| Styles                    | CSS3 natif                                  |
| Base de données           | MySQL                                       |
| ORM                       | Drizzle ORM                                 |
| Client HTTP               | ofetch                                      |
| Authentification          | JWT + Refresh Token                         |
| Gestion des versions      | Git / GitHub                                |
| Tests unitaires           | Vitest                                      |
| Tests E2E                 | Playwright                                  |
| CI/CD                     | GitHub Actions                              |
| Hébergement cible         | PlanetHoster (cPanel / Application Manager) |

### 2.2 Architecture applicative

L'application repose sur une architecture **Backend For Frontend (BFF)** basée sur **Nuxt 4**.

Le serveur **Nitro** assure simultanément :

* le rendu de l'application ;
* les routes API ;
* la gestion de l'authentification ;
* les échanges avec la base de données ;
* l'exécution de la logique serveur.

Le projet respecte l'organisation recommandée par Nuxt 4, en séparant clairement la logique d'interface utilisateur de la logique serveur.

L'ensemble de l'interface est regroupé dans le répertoire `app/`, qui contient notamment :

* `app/pages/` : les pages de l'application ;
* `app/components/` : les composants Vue réutilisables ;
* `app/layouts/` : les layouts de l'application ;
* `app/composables/` : les composables Vue ;
* `app/middleware/` : les middlewares de routage ;
* `app/plugins/` : les plugins Nuxt ;
* `app/types/` : les déclarations et types spécifiques à Nuxt ;
* `app/assets/` : les ressources CSS de l'application.

Le middleware `app/middleware/auth.ts` est utilisé pour protéger les pages nécessitant une authentification.

Le plugin `app/plugins/api.ts` initialise le client HTTP personnalisé `$api`, utilisé pour centraliser les communications authentifiées avec l'API.

Le projet intègre également un répertoire global **`shared/`** à la racine, dédié à la centralisation des typages et interfaces TypeScript.

Le dossier `shared/types/` contient notamment :

* `auth.ts` : types liés à l'authentification ;
* `lead.ts` : types liés aux leads ;
* `user.ts` : types liés aux utilisateurs ;
* `index.ts` : point d'entrée des exports de types.

Ces types sont utilisables aussi bien par l'application front-end que par le serveur Nitro.

Cette architecture garantit un contrat de données commun entre les différentes couches de l'application, limite les duplications de code et facilite la maintenance lors des évolutions du projet.

---

### 2.3 Couche de données

La persistance des données est assurée par **MySQL**.

L'accès aux données est réalisé via **Drizzle ORM**.

Le schéma de données est centralisé dans :

```text
server/database/schema.ts
```

Les migrations sont regroupées dans :

```text
server/database/migrations/
```

Le projet utilise notamment :

* `server/utils/drizzle.ts` : configuration et accès à la base de données ;
* `server/database/schema.ts` : définition du schéma Drizzle ;
* `server/database/migrations/` : migrations SQL générées.

Drizzle permet notamment de bénéficier :

* d'un typage fort grâce à TypeScript ;
* d'une couche d'accès aux données structurée ;
* de requêtes paramétrées ;
* d'une maintenance facilitée du schéma de données.

---

### 2.4 Authentification et client HTTP

L'authentification repose sur un système de double jeton composé :

* d'un **Access Token (JWT)** à durée de vie courte ;
* d'un **Refresh Token** utilisé pour renouveler la session.

La gestion de la session côté application est centralisée dans :

```text
app/composables/auth/useAuth.ts
```

Le composable `useAuth` assure notamment :

* la connexion ;
* l'inscription ;
* la déconnexion ;
* le renouvellement de session ;
* la gestion de l'utilisateur courant ;
* la gestion de l'Access Token.

L'Access Token est persisté via `useCookie`, ce qui permet de conserver l'état d'authentification lors des rechargements de page et dans le contexte SSR de Nuxt.

Le Refresh Token est géré par l'API d'authentification et repose sur le mécanisme de cookie sécurisé prévu par le serveur.

Le front-end s'appuie sur un client HTTP personnalisé (`$api`) développé à partir de **ofetch** et initialisé via :

```text
app/plugins/api.ts
```

Ce client centralise les communications avec les API authentifiées.

Il assure notamment :

* l'ajout automatique de l'en-tête :

```http
Authorization: Bearer <token>
```

* l'interception des réponses HTTP `401 Unauthorized` ;
* la tentative automatique de renouvellement de session ;
* la mise à jour de l'Access Token ;
* le rejeu de la requête initialement échouée ;
* la déconnexion lorsque le renouvellement de session échoue.

Le mécanisme général est donc :

```text
Requête API
     │
     ▼
Access Token valide ?
     │
 ┌───┴────┐
 │        │
Oui       Non / expiré
 │        │
 ▼        ▼
API      401
          │
          ▼
   refreshSession()
          │
     ┌────┴────┐
     │         │
   Succès     Échec
     │         │
     ▼         ▼
Nouveau      logout()
token
     │
     ▼
Retry de la requête
```

Cette approche permet de centraliser la logique d'authentification dans le client HTTP et d'éviter de dupliquer cette logique dans les composants Vue.

---

### 2.5 Structure des pages

L'interface utilisateur est organisée selon la structure de routage de Nuxt 4.

La page d'accueil :

```text
app/pages/index.vue
```

constitue le point d'entrée principal de l'application.

Elle regroupe les fonctionnalités d'authentification grâce à une interface composée d'onglets permettant de basculer entre :

* la connexion ;
* l'inscription.

Cette approche évite la multiplication de pages dédiées `/login` et `/register`.

Les fonctionnalités accessibles uniquement aux utilisateurs authentifiés disposent de pages dédiées.

#### Pages principales

| Route              | Fichier                         | Description                             |
| ------------------ | ------------------------------- | --------------------------------------- |
| `/`                | `app/pages/index.vue`           | Connexion / inscription                 |
| `/leads/dashboard` | `app/pages/leads/dashboard.vue` | Tableau de bord des leads               |
| `/leads/new`       | `app/pages/leads/new.vue`       | Création d'un nouveau lead              |
| `/leads/[id]`      | `app/pages/leads/[id].vue`      | Consultation / gestion d'un lead        |
| `/leads/earnings`  | `app/pages/leads/earnings.vue`  | Consultation des revenus liés aux leads |
| `/admin/users`     | `app/pages/admin/users.vue`     | Administration des utilisateurs         |

L'accès aux pages privées est protégé par :

```text
app/middleware/auth.ts
```

Le middleware vérifie la présence d'une session utilisateur valide avant d'autoriser l'accès aux pages concernées.

La navigation principale est assurée par :

```text
app/components/layout/Navbar.vue
```

La barre de navigation adapte son affichage selon l'état d'authentification de l'utilisateur.

Elle permet ainsi de distinguer les fonctionnalités accessibles à un utilisateur authentifié des fonctionnalités disponibles publiquement.

---

### 2.6 Composants de l'interface

Les composants réutilisables sont organisés par domaine fonctionnel.

```text
app/components/
├── auth/
│   └── Logout.vue
├── common/
│   ├── BadgeStatus.vue
│   ├── Pagination.vue
│   └── ToastNotification.vue
├── dashboard/
│   ├── DashboardFilters.vue
│   └── DashboardTable.vue
├── layout/
│   └── Navbar.vue
└── leads/
    ├── LeadFilters.vue
    ├── LeadKpiGrid.vue
    ├── LeadModal.vue
    └── LeadTable.vue
```

Les composants `common/` regroupent les composants génériques réutilisables.

Les composants `leads/` regroupent les composants dédiés à la gestion des leads.

Les composants `dashboard/` regroupent les composants utilisés pour l'affichage et le filtrage du tableau de bord.

Le composant `layout/Navbar.vue` gère la navigation principale de l'application.

---

### 2.7 API serveur

Les routes API sont organisées dans :

```text
server/api/
```

#### Authentification

```text
server/api/auth/
├── login.post.ts
├── logout.post.ts
├── refresh.post.ts
└── register.post.ts
```

| Endpoint             | Méthode | Fonction                  |
| -------------------- | ------- | ------------------------- |
| `/api/auth/login`    | POST    | Authentification          |
| `/api/auth/register` | POST    | Création d'un compte      |
| `/api/auth/refresh`  | POST    | Renouvellement de session |
| `/api/auth/logout`   | POST    | Déconnexion               |

#### Leads

```text
server/api/leads/
├── index.get.ts
├── index.post.ts
├── earnings.get.ts
├── [id].get.ts
├── [id].put.ts
└── [id].delete.ts
```

| Endpoint              | Méthode | Fonction                 |
| --------------------- | ------- | ------------------------ |
| `/api/leads`          | GET     | Récupération des leads   |
| `/api/leads`          | POST    | Création d'un lead       |
| `/api/leads/earnings` | GET     | Récupération des revenus |
| `/api/leads/:id`      | GET     | Récupération d'un lead   |
| `/api/leads/:id`      | PUT     | Modification d'un lead   |
| `/api/leads/:id`      | DELETE  | Suppression d'un lead    |

#### Utilisateurs

```text
server/api/users/
├── index.get.ts
├── [id].put.ts
└── [id].delete.ts
```

| Endpoint         | Méthode | Fonction                      |
| ---------------- | ------- | ----------------------------- |
| `/api/users`     | GET     | Récupération des utilisateurs |
| `/api/users/:id` | PUT     | Modification d'un utilisateur |
| `/api/users/:id` | DELETE  | Suppression d'un utilisateur  |

Les routes serveur sont exécutées par Nitro et constituent la couche BFF entre l'interface Nuxt et la base de données.

---

### 2.8 Contraintes techniques

L'application est destinée à être hébergée sur **PlanetHoster**, via **cPanel / Application Manager**.

Cet environnement impose certaines contraintes concernant l'exécution de l'application.

Par conséquent :

* la conteneurisation est utilisée pour le développement et certains environnements de CI ;
* la production repose sur les artefacts compilés générés par Nuxt ;
* le dossier `.output/` constitue l'artefact principal de production.

---

# 3. Outils de développement

Le projet s'appuie sur plusieurs outils garantissant la qualité du développement.

| Outil          | Rôle                                             |
| -------------- | ------------------------------------------------ |
| Git            | Gestion de versions                              |
| GitHub         | Hébergement du dépôt                             |
| GitHub Actions | Intégration et déploiement continus              |
| ESLint         | Analyse statique du code                         |
| TypeScript     | Vérification du typage                           |
| Drizzle ORM    | Couche d'accès aux données                       |
| Vitest         | Tests unitaires                                  |
| Playwright     | Tests End-to-End                                 |
| Bun            | Gestionnaire de paquets et exécution des scripts |

Ces outils permettent de limiter les erreurs avant la mise en production tout en automatisant les contrôles qualité.

---

# 4. Plan de mise en œuvre CI/CD

Le projet utilise **GitHub Actions** afin d'automatiser les différentes étapes de validation et de déploiement.

Le pipeline est défini dans :

```text
.github/workflows/ci-cd.yml
```

Le pipeline est déclenché selon la configuration du workflow GitHub Actions.

## 4.1 Étapes du pipeline

### 1. Récupération du projet

Le dépôt Git est récupéré sur le runner GitHub.

L'environnement nécessaire au projet est ensuite initialisé.

---

### 1.1. Gestion CRON pour les tests périodiques automatisés

J'ai implémenté au projet un lancement périodique.
Github Actions utilisant la timezone UTC, et que je suis sur la timezone Europe/Paris, j'ai donc adapté le cron pour permettre :
- un lancement à 01h00 du matin l'été et à 00h00 l'hiver, avec la commande `cron: "0 23 * * *"`.
- un lancement à 12h00 l'été et à 11h00 l'hiver, avec la commande `cron: "0 10 * * *"`.

---

### 2. Installation des dépendances

Les dépendances sont installées avec :

```bash
bun install
```

Cette étape installe notamment :

* Nuxt 4 ;
* Drizzle ORM ;
* Vitest ;
* Playwright ;
* les autres dépendances du projet.

---

### 3. Analyse statique

Avant la compilation, les contrôles de qualité sont exécutés.

Ils comprennent notamment :

* ESLint ;
* vérification du typage TypeScript.

Ces contrôles permettent de détecter les erreurs de code avant les étapes suivantes du pipeline.

---

### 4. Exécution des tests

Les tests automatisés sont exécutés afin de vérifier le comportement de l'application.

Ils comprennent :

* les tests unitaires Vitest ;
* les tests End-to-End Playwright.

---

### 5. Build de production

Lorsque les étapes précédentes sont validées, la version de production est générée.

Commande :

```bash
bun run build
```

Nuxt produit alors :

```text
.output/
```

Ce dossier constitue l'artefact destiné au déploiement.

---

# 5. Stratégie de conteneurisation et de déploiement

## 5.1 Développement

Le projet dispose des fichiers :

```text
Dockerfile
docker-compose.yml
.dockerignore
```

Ils permettent d'utiliser une configuration conteneurisée pour les environnements qui le nécessitent.

---

## 5.2 Production

En production, l'application est destinée à être déployée sur **PlanetHoster**.

La production repose sur les artefacts compilés générés par Nuxt :

```text
.output/
```

Cette stratégie permet de rester compatible avec l'environnement d'hébergement retenu.

---

# 6. Stratégie de tests

Afin de limiter les régressions et de garantir la qualité du logiciel, plusieurs niveaux de tests sont mis en place.

## 6.1 Tests unitaires

Les tests unitaires sont regroupés dans :

```text
tests/unit/
```

Ils utilisent **Vitest**.

Les fichiers actuellement présents sont notamment :

```text
tests/unit/
├── api.test.ts
└── auth.test.ts
```

Les tests couvrent notamment :

* la logique d'authentification ;
* la génération et la vérification des tokens ;
* la protection des routes ;
* le comportement du client HTTP `$api` ;
* la gestion des erreurs `401` ;
* le renouvellement de session ;
* la déconnexion en cas d'échec du renouvellement.

---

## 6.2 Couverture de code

La couverture est configurée dans :

```text
vitest.config.ts
```

Le projet utilise le provider :

```text
v8
```

Les rapports sont générés aux formats :

* `text` ;
* `json` ;
* `html`.

Les seuils configurés sont :

| Indicateur | Seuil |
| ---------- | ----- |
| Lines      | 80 %  |
| Functions  | 80 %  |
| Branches   | 60 %  |
| Statements | 80 %  |

La commande de couverture peut être exécutée avec le script correspondant défini dans `package.json`.

---

## 6.3 Tests End-to-End

Les tests E2E sont regroupés dans :

```text
tests/e2e/
```

Ils utilisent **Playwright**.

La configuration est définie dans :

```text
playwright.config.ts
```

Les scénarios présents couvrent notamment :

```text
tests/e2e/
├── auth.spec.ts
├── global-setup.ts
└── lead-workflow.spec.ts
```

Les parcours testés comprennent notamment :

* l'authentification ;
* le passage entre connexion et inscription ;
* la gestion d'une session utilisateur ;
* le renouvellement de session ;
* le parcours de création d'un lead.

---

# 7. Sécurité

La sécurité constitue un axe majeur du projet.

## 7.1 Protection contre les injections SQL

Les interactions avec MySQL passent par Drizzle ORM.

Les requêtes sont construites via l'ORM afin de limiter les risques liés à la concaténation directe de requêtes SQL.

---

## 7.2 Authentification

L'authentification repose sur :

* un Access Token JWT ;
* un Refresh Token.

Les fonctions de génération et de vérification des tokens sont regroupées dans :

```text
server/utils/auth.ts
```

Le serveur expose les routes :

```text
/api/auth/login
/api/auth/register
/api/auth/refresh
/api/auth/logout
```

---

## 7.3 Protection des routes front-end

Les pages nécessitant une authentification sont protégées par :

```text
app/middleware/auth.ts
```

Le middleware contrôle l'état de la session avant de permettre l'accès à une route privée.

---

## 7.4 Protection des routes serveur

La protection des routes serveur est assurée par les mécanismes d'authentification côté Nitro.

Le projet dispose également de :

```text
server/middleware/auth.ts
```

Ce middleware intervient au niveau serveur pour gérer les contrôles d'authentification nécessaires aux requêtes API.

---

## 7.5 Protection des mots de passe

Les mots de passe utilisateurs sont hachés avant leur stockage en base de données à l'aide de **bcrypt**.

Le mot de passe en clair n'est pas destiné à être enregistré dans la base de données.

Les fonctions concernées sont regroupées dans :

```text
server/utils/auth.ts
```

---

## 7.6 Gestion des secrets

Les informations sensibles sont isolées :

* dans les variables d'environnement côté serveur ;
* dans les secrets utilisés par GitHub Actions pour la CI/CD.

Le fichier :

```text
.env.example
```

sert de modèle pour les variables nécessaires au fonctionnement de l'application.

Le fichier `.env` n'est pas destiné à être versionné.

---

## 7.7 Typage strict et cohérence des données

Le projet centralise les interfaces et types TypeScript partagés dans :

```text
shared/types/
```

Cette organisation permet aux différentes couches de l'application de partager les mêmes contrats de données.

Les principaux modèles sont notamment regroupés dans :

```text
shared/types/
├── auth.ts
├── lead.ts
├── user.ts
└── index.ts
```

Cette approche permet :

* de limiter les duplications ;
* de réduire les divergences entre le front-end et le serveur ;
* d'améliorer la vérification TypeScript ;
* de faciliter les évolutions du modèle de données ;
* de conserver une cohérence entre les données manipulées par l'interface et l'API.

---

# 8. Sauvegardes et maintenance

## 8.1 Sauvegarde des données

La base de données MySQL est hébergée dans l'environnement de production prévu par le projet.

Les mécanismes de sauvegarde dépendent de l'infrastructure d'hébergement utilisée.

La restauration doit être vérifiée régulièrement afin de garantir la capacité à récupérer les données en cas d'incident.

---

## 8.2 Mise à jour des dépendances

Les dépendances du projet doivent faire l'objet d'une surveillance régulière.

Les mises à jour sont idéalement validées après :

* analyse des vulnérabilités ;
* exécution des tests unitaires ;
* exécution des tests E2E ;
* vérification TypeScript ;
* validation du build de production.

---

# 9. Indicateurs de performance (KPI)

Afin d'évaluer la qualité du projet et l'efficacité de la chaîne CI/CD, plusieurs indicateurs peuvent être suivis.

Ces indicateurs peuvent notamment s'inspirer des métriques **DORA**.

## 9.1 Performance du pipeline

### Fréquence de déploiement (Deployment Frequency)

Nombre de mises en production réalisées sur une période donnée.

---

### Lead Time for Changes

Temps écoulé entre la validation d'une modification et son déploiement en production.

---

### Change Failure Rate

Pourcentage de déploiements nécessitant un correctif ou un retour arrière.

---

## 9.2 Qualité logicielle

### Taux de réussite du pipeline CI

Pourcentage de pipelines validés sans erreur.

Cet indicateur permet de suivre la stabilité globale du projet.

---

### Couverture de code

La couverture est mesurée par **Vitest**.

Les seuils actuellement configurés sont :

* **80 %** pour les lignes ;
* **80 %** pour les fonctions ;
* **60 %** pour les branches ;
* **80 %** pour les statements.

Ces seuils sont définis dans :

```text
vitest.config.ts
```

---

### Vulnérabilités critiques

Les contrôles de qualité et de sécurité peuvent notamment s'appuyer sur :

* ESLint ;
* TypeScript ;
* les audits de dépendances ;
* les tests automatisés.

L'objectif est de détecter les problèmes avant leur déploiement en production.

---

# 10. Structure fonctionnelle actuelle

L'application est actuellement organisée autour de plusieurs espaces fonctionnels.

## 10.1 Authentification

L'utilisateur accède à l'application via :

```text
/
```

Cette page permet :

* de se connecter ;
* de créer un compte ;
* de gérer la session utilisateur.

---

## 10.2 Gestion des leads

L'espace leads comprend notamment :

```text
/leads/dashboard
/leads/new
/leads/[id]
/leads/earnings
```

Le tableau de bord permet d'accéder aux informations liées aux leads.

La route :

```text
/leads/new
```

est dédiée à la création d'un nouveau lead.

La route dynamique :

```text
/leads/[id]
```

permet d'accéder à un lead spécifique.

La route :

```text
/leads/earnings
```

est dédiée à la consultation des revenus associés aux leads.

---

## 10.3 Administration des utilisateurs

L'administration des utilisateurs est accessible via :

```text
/admin/users
```

La page correspondante est :

```text
app/pages/admin/users.vue
```

Les opérations serveur associées sont regroupées dans :

```text
server/api/users/
```

L'accès à l'administration doit rester réservé aux utilisateurs disposant des droits nécessaires.

---

# 11. Maintenance et évolutions

Toute évolution fonctionnelle doit respecter l'organisation générale du projet.

Lorsqu'une fonctionnalité nécessite une modification de données partagées, les types correspondants doivent être ajoutés ou modifiés dans :

```text
shared/types/
```

Lorsqu'une nouvelle page est créée, elle doit être placée dans :

```text
app/pages/
```

et sa protection doit être assurée par le middleware lorsque l'accès nécessite une authentification.

Les nouveaux endpoints API doivent être placés dans :

```text
server/api/
```

Les accès aux données doivent rester centralisés dans la couche serveur et utiliser Drizzle ORM.

Les composants réutilisables doivent être placés dans :

```text
app/components/
```

et regroupés par domaine fonctionnel lorsque cela est pertinent.

Les fonctionnalités nécessitant une logique réutilisable côté client doivent privilégier les composables situés dans :

```text
app/composables/
```

---

# 12. Documentation du projet

Le projet est accompagné de plusieurs documents complémentaires.

| Document           | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| `README.md`        | Présentation générale, installation et prise en main du projet |
| `STRUCTURE.md`     | Organisation détaillée des fichiers et répertoires             |
| `DOCUMENTATION.md` | Documentation technique et architecture du projet              |

Ces documents doivent rester cohérents avec l'évolution réelle de l'application.

En particulier, toute modification de l'architecture des pages, des endpoints API ou de l'organisation des répertoires doit être répercutée dans la documentation correspondante.

---

# Conclusion

L'architecture retenue pour **Webdevoo Lead** répond aux objectifs de robustesse, de sécurité et de maintenabilité du projet.

L'utilisation de **Nuxt 4**, **TypeScript**, **Drizzle ORM**, **GitHub Actions**, **Vitest** et **Playwright** permet de disposer d'une chaîne de développement moderne intégrant des contrôles automatiques de qualité, des tests réguliers et un processus de déploiement structuré.

L'organisation en architecture **Backend For Frontend (BFF)** permet de centraliser les échanges entre l'interface utilisateur, l'API Nitro et la base de données.

La centralisation des types dans `shared/types/`, la protection des routes, le client HTTP `$api`, la gestion des Access Tokens et le mécanisme de renouvellement de session permettent de conserver une séparation claire des responsabilités tout en maintenant une cohérence entre le front-end et le serveur.

La stratégie de tests unitaires et End-to-End permet enfin de limiter les régressions lors des évolutions fonctionnelles et techniques du projet.

# Contributeurs

* © Webdevoo - 2026
