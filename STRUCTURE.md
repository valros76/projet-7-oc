webdevoo-lead/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                     # Pipeline GitHub Actions (Build, Linter, Tests Vitest/Playwright, Artifacts)
├── app/                                  # 🎨 Front-end & Interface utilisateur (Nuxt 4)
│   ├── assets/
│   │   └── css/
│   │       └── init.css                  # Styles CSS3 natifs globaux
│   ├── components/                       # Composants Vue.js réutilisables
│   │   ├── LoginForm.vue                 # (Futur) Formulaire de connexion des utilisateurs
│   │   ├── LeadForm.vue                  # (Futur) Formulaire de saisie d'une affaire / lead
│   │   └── Navbar.vue                    # (Futur) Barre de navigation principale
│   ├── composables/                      # Logique métier et réactivité
│   │   └── auth/
│   │       └── useAuth.ts                # Gestion de l'état d'authentification et des tokens
│   ├── middleware/                       # Middlewares de routage front-end
│   │   └── auth.ts                       # Protection des routes front-end (authentification requise)
│   ├── plugins/                          # Plugins d'initialisation et d'interception
│   │   ├── auth.ts                       # Restauration automatique de session au chargement
│   │   └── api.ts                        # Client HTTP personnalisé ($api) avec injection Bearer & Refresh auto
│   ├── pages/                            # Pages de l'application (routage automatique Nuxt)
│   │   ├── index.vue                     # Page d'accueil / Connexion / Inscription
│   │   ├── leads/
│   │   │   ├── dashboard.vue             # Tableau de bord sécurisé des leads
│   │   │   └── new.vue                   # (Futur) Page de création d'un nouveau lead
│   └── app.vue                           # Composant racine de l'application
├── server/                               # ⚙️ Back-end & API (Moteur Nitro)
│   ├── api/                              # Endpoints de l'API REST sécurisée
│   │   ├── auth/
│   │   │   ├── login.post.ts             # Authentification et génération JWT / Refresh Token HttpOnly
│   │   │   ├── refresh.post.ts           # Renouvellement de l'Access Token
│   │   │   └── logout.post.ts            # Révocation du Refresh Token et suppression du cookie
│   │   └── leads/
│   │       ├── index.get.ts              # (Futur) Liste des leads (sécurisée par rôle)
│   │       └── index.post.ts             # (Futur) Création sécurisée d'un lead (Requête préparée Drizzle)
│   ├── database/                         # Couche de persistance et migrations
│   │   ├── schema.ts                     # Schéma Drizzle ORM (Tables users, refresh_tokens, leads)
│   │   └── migrations/                   # Fichiers de migration SQL générés par Drizzle Kit
│   └── utils/                            # Utilitaires serveur transverses
│       ├── drizzle.ts                    # Instance de connexion au pool MySQL (mysql2)
│       └── jwt.ts                        # Fonctions de signature, vérification des JWT et hachage bcrypt
├── tests/                                # 🧪 Tests automatisés de non-régression
│   ├── unit/
│   │   └── auth.test.ts                  # (Futur) Tests unitaires de la logique d'authentification (Vitest)
│   └── e2e/
│       └── lead-workflow.spec.ts         # (Futur) Test End-to-End du parcours de création de lead (Playwright)
├── public/                               # Fichiers statiques publics (logos, favicons)
├── .env.example                          # Modèle des variables d'environnement requises (DB, Secrets JWT)
├── .gitignore                            # Fichiers et dossiers exclus de Git (.output, node_modules, .env)
├── drizzle.config.ts                     # Configuration de Drizzle Kit pour la gestion de la BDD
├── nuxt.config.ts                        # Configuration globale du framework Nuxt 4 (modules, CSS, imports)
├── package.json                          # Dépendances du projet (Bun / npm, Drizzle, Nuxt, Vitest, Playwright)
├── vitest.config.ts                      # Configuration de Vitest pour les tests unitaires et d'intégration
├── playwright.config.ts                  # Configuration de Playwright pour les tests E2E
├── README.md                             # Documentation d'exécution, d'installation et choix techniques
├── STRUCTURE.md                          # Documentation de l'architecture des fichiers (ce document)
└── tsconfig.json                         # Configuration de Typescript