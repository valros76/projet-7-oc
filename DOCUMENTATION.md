# Documentation Technique – Projet Webdevoo Lead

## 1. Présentation du projet

### 1.1 Objectif

Le projet **Webdevoo Lead** a pour objectif de centraliser et de digitaliser la gestion des apporteurs d'affaires ainsi que le suivi des opportunités commerciales (leads).

L'application permet notamment :

- la gestion des utilisateurs ;
- la gestion des apporteurs d'affaires ;
- le suivi des leads ;
- la sécurisation des accès utilisateurs ;
- l'automatisation du déploiement de l'application.

L'architecture retenue vise à produire une application performante, sécurisée, facilement maintenable et compatible avec l'environnement d'hébergement retenu.

---

## 2. Diagnostic de l'existant

### 2.1 Contexte technique

Le projet repose sur une architecture moderne basée sur les technologies suivantes.

| Domaine | Technologie |
|---------|-------------|
| Framework Front-end / BFF | Nuxt 4 (Nitro) |
| Langage | TypeScript |
| Styles | CSS3 natif |
| Base de données | MySQL |
| ORM | Drizzle ORM |
| Gestion des versions | Git / GitHub |
| CI/CD | GitHub Actions |
| Hébergement cible | PlanetHoster (cPanel / Application Manager) |

### 2.2 Architecture applicative

L'application repose sur une architecture **Backend For Frontend (BFF)**.

Le serveur Nuxt (Nitro) assure simultanément :

- le rendu de l'application ;
- les routes API ;
- la gestion de l'authentification ;
- les échanges avec la base de données.

Cette architecture limite les échanges réseau, simplifie le déploiement et centralise la logique métier.

### 2.3 Couche de données

La persistance des données est assurée par **MySQL**.

L'accès aux données est réalisé exclusivement via **Drizzle ORM**, qui offre :

- un typage fort grâce à TypeScript ;
- des requêtes préparées (Prepared Statements) ;
- une protection native contre les injections SQL ;
- une maintenance facilitée grâce au mapping des tables.

### 2.4 Authentification

L'authentification repose sur un système de double jeton :

- **Access Token (JWT)** à durée de vie courte ;
- **Refresh Token** stocké de manière sécurisée en base de données.

Cette architecture permet :

- une authentification rapide ;
- la révocation immédiate d'une session utilisateur ;
- une meilleure protection en cas de compromission d'un jeton.

### 2.5 Contraintes techniques

L'application est destinée à être hébergée sur **PlanetHoster**, via **cPanel / Application Manager**.

Cet environnement ne permet pas l'utilisation de Docker ou de Kubernetes en production.

Par conséquent :

- la conteneurisation est utilisée uniquement durant le développement et la CI ;
- la production repose sur le déploiement des artefacts compilés (`.output`) générés par Nuxt.

---

# 3. Outils de développement

Le projet s'appuie sur plusieurs outils garantissant la qualité du développement.

| Outil | Rôle |
|-------|------|
| Git | Gestion de versions |
| GitHub | Hébergement du dépôt |
| GitHub Actions | Intégration et déploiement continus |
| ESLint | Analyse statique du code |
| TypeScript | Vérification du typage |
| Drizzle ORM | Couche d'accès aux données |

Ces outils permettent de limiter les erreurs avant la mise en production tout en automatisant les contrôles qualité.

---

# 4. Plan de mise en œuvre CI/CD

Le projet utilise **GitHub Actions** afin d'automatiser les différentes étapes de validation et de déploiement.

Le pipeline est déclenché automatiquement :

- à chaque **Push** ;
- à chaque **Pull Request** vers la branche principale.

## 4.1 Étapes du pipeline

### 1. Récupération du projet

Le dépôt Git est récupéré sur le runner GitHub.

L'environnement Node.js/Bun est ensuite initialisé.

---

### 2. Installation des dépendances

Les dépendances sont installées via :

```bash
bun install
```

Cette étape installe notamment :

- Nuxt 4 ;
- Drizzle ORM ;
- Vitest ;
- Playwright ;
- les dépendances du projet.

---

### 3. Analyse statique

Avant toute compilation, plusieurs contrôles sont effectués :

- vérification ESLint ;
- contrôle strict du typage TypeScript.

Commande utilisée :

```bash
npx tsc --noEmit
```

Cette étape garantit l'absence d'erreurs de compilation.

---

### 4. Exécution des tests

Les tests automatisés sont exécutés.

Ils permettent de vérifier :

- le fonctionnement des fonctions critiques ;
- les règles métier ;
- les interactions avec la base de données.

---

### 5. Build de production

Lorsque toutes les étapes précédentes sont validées, la version de production est générée.

Commande utilisée :

```bash
bun run build
```

Nuxt produit alors le dossier :

```text
.output/
```

Celui-ci constitue l'artefact de déploiement.

---

# 5. Stratégie de conteneurisation et de déploiement

## 5.1 Développement et CI

Durant le développement et l'intégration continue, des conteneurs temporaires sont utilisés.

Par exemple :

- un conteneur MySQL peut être démarré par GitHub Actions afin d'exécuter les tests d'intégration dans un environnement reproductible.

Cette approche permet :

- l'isolation des tests ;
- la reproductibilité des environnements ;
- une meilleure stabilité des pipelines.

## 5.2 Production

En production, aucune conteneurisation n'est utilisée.

Cette décision est imposée par les contraintes de l'hébergement PlanetHoster.

Le déploiement consiste à transférer uniquement les artefacts compilés produits par le pipeline CI/CD.

Cette approche présente plusieurs avantages :

- déploiement plus rapide ;
- consommation mémoire réduite ;
- compatibilité avec l'hébergement mutualisé.

---

# 6. Stratégie de tests

Afin de limiter les régressions et garantir la qualité du logiciel, plusieurs niveaux de tests sont mis en place.

## 6.1 Outils utilisés

### Vitest

Vitest est utilisé pour :

- les tests unitaires ;
- les tests d'intégration.

Son intégration native avec Nuxt permet une exécution rapide.

### Playwright

Playwright est utilisé pour les tests End-to-End (E2E).

Les principaux parcours utilisateurs sont simulés, notamment :

- authentification via JWT ;
- renouvellement de session via Refresh Token ;
- création d'un lead ;
- validation des formulaires.

---

## 6.2 Planification des tests

### À chaque Push ou Pull Request

Les éléments suivants sont exécutés automatiquement :

- ESLint ;
- contrôle TypeScript ;
- tests unitaires.

Le pipeline est interrompu en cas d'échec.

Aucun merge n'est autorisé tant que ces contrôles ne sont pas validés.

### Exécution planifiée

Des tests plus complets peuvent être exécutés périodiquement (par exemple chaque nuit) sur un environnement de préproduction afin de détecter d'éventuelles régressions avant les mises en production.

### Avant chaque mise en production

Une validation complète est réalisée via le pipeline CI/CD.

---

# 7. Sécurité

La sécurité constitue un axe majeur du projet.

## 7.1 Protection contre les injections SQL

Toutes les interactions avec MySQL passent par Drizzle ORM.

Les requêtes préparées sont utilisées systématiquement.

Cette approche élimine les risques d'injection SQL.

---

## 7.2 Authentification

L'authentification repose sur :

- un Access Token JWT à durée de vie courte ;
- un Refresh Token sécurisé.

Les Access Tokens :

- ne sont pas stockés en base ;
- sont invalidés automatiquement à leur expiration.

Les Refresh Tokens :

- sont enregistrés sous forme hachée en base de données ;
- permettent la révocation immédiate d'une session.

---

## 7.3 Protection des mots de passe

Les mots de passe utilisateurs sont hachés avant leur stockage en base de données à l'aide de **bcrypt**.

Le mot de passe en clair n'est jamais enregistré.

---

## 7.4 Gestion des secrets

Les informations sensibles sont isolées :

- variables d'environnement côté serveur ;
- Secrets GitHub Actions pour les pipelines CI/CD.

Aucun secret n'est présent dans le dépôt Git.

---

# 8. Sauvegardes et maintenance

## 8.1 Sauvegarde des données

La base de données MySQL bénéficie de sauvegardes automatiques quotidiennes via les outils proposés par PlanetHoster.

Ces sauvegardes permettent une restauration rapide en cas d'incident.

## 8.2 Mise à jour des dépendances

Les dépendances font l'objet d'une surveillance régulière.

Les mises à jour sont validées après :

- analyse des vulnérabilités (`bun audit` ou équivalent) ;
- exécution complète du pipeline CI/CD ;
- validation des tests automatisés.

---

# 9. Indicateurs de performance (KPI)

Afin d'évaluer la qualité du projet et l'efficacité de la chaîne CI/CD, plusieurs indicateurs sont suivis.

Ces indicateurs s'inspirent des métriques **DORA**.

## 9.1 Performance du pipeline

### Fréquence de déploiement (Deployment Frequency)

Nombre de mises en production réalisées sur une période donnée.

---

### Lead Time for Changes

Temps écoulé entre la validation d'une modification et son déploiement en production.

**Objectif :**

- inférieur à **15 minutes** grâce à l'automatisation de GitHub Actions.

---

### Change Failure Rate

Pourcentage de déploiements nécessitant un correctif ou un retour arrière (rollback).

**Objectif :**

- inférieur à **5 %**.

---

## 9.2 Qualité logicielle

### Taux de réussite du pipeline CI

Pourcentage de pipelines validés sans erreur.

Cet indicateur reflète la stabilité du projet.

---

### Couverture de code

Mesurée par Vitest.

Objectif :

- **au moins 70 %** de couverture sur les fonctions critiques du backend.

---

### Vulnérabilités critiques

Les rapports issus :

- d'ESLint ;
- de TypeScript ;
- des audits de dépendances ;

sont analysés avant chaque mise en production.

**Objectif :**

- aucune vulnérabilité critique présente en production.

---

# Conclusion

L'architecture retenue pour **Webdevoo Lead** répond aux objectifs de robustesse, de sécurité et de maintenabilité du projet.

L'utilisation de **Nuxt 4**, **TypeScript**, **Drizzle ORM**, **GitHub Actions**, **Vitest** et **Playwright** permet de disposer d'une chaîne de développement moderne intégrant des contrôles automatiques de qualité, des tests réguliers et un processus de déploiement sécurisé.

Bien que l'environnement de production ne permette pas l'utilisation de conteneurs, la stratégie adoptée — fondée sur la génération d'artefacts compilés et l'automatisation du pipeline CI/CD — garantit un déploiement fiable, reproductible et compatible avec les contraintes techniques de l'hébergement PlanetHoster.

# Contributeurs
- © Webdevoo - 2026