# Structure du projet `webdevoo-lead`

```text
webdevoo-lead/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                         # Pipeline GitHub Actions (Build, Linter, Tests Vitest/Playwright, Artifacts)
├── app/                                      # Front-end & Interface utilisateur (Nuxt 4)
│   ├── assets/
│   │   └── css/
│   │       └── init.css                      # Styles CSS3 natifs globaux
│   ├── components/                           # Composants Vue.js réutilisables
│   │   ├── auth/
│   │   │   └── Logout.vue                    # Composant de déconnexion utilisateur
│   │   ├── common/
│   │   │   ├── BadgeStatus.vue               # Affichage des statuts sous forme de badge
│   │   │   ├── Pagination.vue                # Composant de pagination générique
│   │   │   └── ToastNotification.vue         # Affichage des notifications utilisateur
│   │   ├── dashboard/
│   │   │   ├── DashboardFilters.vue           # Filtres du tableau de bord
│   │   │   └── DashboardTable.vue             # Tableau principal du tableau de bord
│   │   ├── layout/
│   │   │   └── Navbar.vue                     # Barre de navigation principale
│   │   └── leads/
│   │       ├── LeadFilters.vue                # Filtres de recherche et de sélection des leads
│   │       ├── LeadKpiGrid.vue                # Indicateurs clés de performance des leads
│   │       ├── LeadModal.vue                  # Fenêtre modale de consultation / édition d'un lead
│   │       └── LeadTable.vue                  # Tableau d'affichage des leads
│   ├── composables/                          # Logique métier et réactivité front-end
│   │   └── auth/
│   │       └── useAuth.ts                     # Gestion de l'état d'authentification et des tokens
│   ├── layouts/                              # Layouts globaux de l'application
│   │   └── default.vue                        # Layout principal de l'application
│   ├── middleware/                           # Middlewares de routage front-end
│   │   └── auth.ts                            # Protection des routes front-end nécessitant une authentification
│   ├── pages/                                # Pages de l'application (routage automatique Nuxt)
│   │   ├── admin/
│   │   │   └── users.vue                      # Administration des utilisateurs
│   │   ├── leads/
│   │   │   ├── dashboard.vue                  # Tableau de bord sécurisé des leads
│   │   │   ├── earnings.vue                   # Page de suivi des gains liés aux leads
│   │   │   └── [id].vue                       # Consultation d'un lead identifié par son ID
│   │   ├── index.vue                           # Page d'accueil / authentification
│   │   └── new.vue                             # Page de création d'un nouveau lead
│   ├── plugins/                              # Plugins d'initialisation et d'interception
│   │   └── api.ts                             # Client HTTP global ($api) avec injection Bearer & Refresh automatique
│   ├── types/                                # Typages spécifiques au front-end Nuxt
│   │   └── nuxt.d.ts                           # Déclarations TypeScript complémentaires pour Nuxt
│   └── app.vue                               # Composant racine de l'application
├── server/                                   # Back-end & API (Moteur Nitro)
│   ├── api/                                  # Endpoints de l'API REST sécurisée
│   │   ├── auth/
│   │   │   ├── login.post.ts                  # Authentification et génération des tokens
│   │   │   ├── logout.post.ts                 # Déconnexion et révocation de la session
│   │   │   ├── refresh.post.ts                # Renouvellement de l'Access Token
│   │   │   └── register.post.ts               # Inscription d'un nouvel utilisateur
│   │   ├── leads/
│   │   │   ├── index.get.ts                   # Liste des leads
│   │   │   ├── index.post.ts                  # Création d'un lead
│   │   │   ├── [id].delete.ts                 # Suppression d'un lead
│   │   │   ├── [id].get.ts                    # Récupération d'un lead par son ID
│   │   │   ├── [id].put.ts                    # Modification d'un lead
│   │   │   └── earnings.get.ts                # Récupération des données de gains
│   │   └── users/
│   │       ├── index.get.ts                   # Liste des utilisateurs
│   │       ├── [id].delete.ts                 # Suppression d'un utilisateur
│   │       └── [id].put.ts                    # Modification d'un utilisateur
│   ├── database/                             # Couche de persistance et migrations
│   │   ├── migrations/                        # Fichiers de migration SQL générés par Drizzle Kit
│   │   │   ├── meta/                          # Métadonnées des migrations Drizzle
│   │   │   └── 0000_brief_storm.sql           # Migration initiale de la base de données
│   │   └── schema.ts                           # Schéma Drizzle ORM de la base de données
│   ├── middleware/                           # Middlewares serveur Nitro
│   │   └── auth.ts                            # Protection des endpoints nécessitant une authentification
│   ├── repositories/                         # Couche d'accès aux données
│   │   └── userRepository.ts                  # Accès aux données et opérations liées aux utilisateurs
│   └── utils/                                # Utilitaires serveur transverses
│       ├── auth.ts                            # Fonctions de signature, vérification des JWT et hachage des mots de passe
│       └── drizzle.ts                         # Instance de connexion et configuration Drizzle ORM
├── shared/                                   # Logique et typages partagés (Front & Back)
│   └── types/
│       ├── index.ts                            # Fichier pivot d'exportation des types
│       ├── auth.ts                             # Types d'authentification et payloads JWT
│       ├── lead.ts                             # Interfaces et statuts des leads
│       └── user.ts                             # Interfaces des utilisateurs et rôles
├── tests/                                    # Tests automatisés de non-régression
│   ├── unit/
│   │   ├── api.test.ts                         # Tests unitaires du client HTTP et de la gestion du refresh token
│   │   └── auth.test.ts                        # Tests unitaires de la logique d'authentification et des JWT
│   └── e2e/
│       ├── auth.spec.ts                        # Tests End-to-End du parcours d'authentification
│       ├── global-setup.ts                     # Initialisation globale des tests Playwright
│       └── lead-workflow.spec.ts               # Tests End-to-End du parcours de gestion des leads
├── public/                                   # Fichiers statiques publics
│   ├── favicon.ico                            # Favicon de l'application
│   └── robots.txt                              # Directives d'indexation pour les moteurs de recherche
├── .env                                      # Variables d'environnement locales (non versionnées)
├── .env.example                              # Modèle des variables d'environnement requises
├── .dockerignore                             # Fichiers et dossiers exclus du contexte Docker
├── .gitignore                                # Fichiers et dossiers exclus de Git
├── .nuxtrc                                   # Configuration complémentaire Nuxt
├── bun.lock                                  # Verrouillage des dépendances Bun
├── docker-compose.yml                        # Configuration des services Docker
├── Dockerfile                                # Image Docker de l'application
├── DOCUMENTATION.md                          # Documentation technique détaillée du projet
├── drizzle.config.ts                         # Configuration de Drizzle Kit pour la gestion de la BDD
├── nuxt.config.ts                            # Configuration globale du framework Nuxt 4
├── package.json                              # Dépendances et scripts du projet (Bun, Nuxt, Drizzle, Vitest, Playwright)
├── playwright.config.ts                      # Configuration de Playwright pour les tests E2E
├── README.md                                 # Documentation d'installation, d'exécution et choix techniques
├── STRUCTURE.md                              # Documentation de l'architecture des fichiers (ce document)
├── tsconfig.json                             # Configuration TypeScript
└── vitest.config.ts                          # Configuration de Vitest pour les tests unitaires et la couverture
```

## Répertoires générés

Les répertoires suivants sont générés automatiquement par les outils de développement et ne font pas partie de l'architecture source du projet :

```text
.nuxt/                                        # Fichiers générés par Nuxt
coverage/                                     # Rapports de couverture Vitest
node_modules/                                 # Dépendances installées
playwright-report/                            # Rapports HTML générés par Playwright
test-results/                                 # Résultats et traces des tests Playwright
```

Ces répertoires sont normalement exclus du versionnement Git.

## Organisation générale

L'architecture du projet repose sur une séparation claire entre :

* `app/` : interface utilisateur et logique front-end Nuxt 4 ;
* `server/` : API REST, authentification, persistance et logique serveur Nitro ;
* `shared/` : types TypeScript partagés entre le front-end et le back-end ;
* `tests/` : tests unitaires Vitest et tests End-to-End Playwright ;
* `public/` : ressources statiques accessibles publiquement.

Cette organisation permet de maintenir une séparation claire des responsabilités tout en centralisant les types communs dans `shared/`.

## Flux applicatif simplifié

```text
Navigateur
    │
    ▼
app/
    │
    ├── pages/
    ├── components/
    ├── composables/
    ├── middleware/
    └── plugins/api.ts
            │
            │ HTTP / Bearer Token
            ▼
server/
    │
    ├── api/
    ├── middleware/
    ├── repositories/
    ├── utils/
    └── database/
            │
            ▼
        Base de données

shared/
    ▲
    │
    └── Types communs Front-end ↔ Back-end
```
