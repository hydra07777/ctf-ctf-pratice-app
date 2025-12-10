# CTC CTF Platform

Plateforme web de type réseau social de créateurs de CTF + moteur de compétitions CTF en temps réel.

## Stack technique

- **Backend**

  - Node.js
  - Express
  - Sequelize (ORM)
  - MySQL
  - JSON Web Tokens (JWT) pour l'authentification
  - Multer pour l'upload de fichiers ZIP (challenges CTF)
  - Socket.IO pour le temps réel (leaderboard, événements de compétition)

- **Frontend**

  - React (Vite)
  - React Router
  - Tailwind CSS (v3)
  - Axios (client HTTP vers l'API backend)
  - Socket.IO Client (mise à jour du leaderboard en temps réel)

- **Outils / autres**
  - pnpm comme gestionnaire de paquets
  - Nodemon pour le hot-reload backend
  - ESLint pour le linting frontend

## Fonctionnalités principales

- **Réseau social de créateurs de CTF**

  - Inscription / connexion (participant, admin général)
  - Les participants peuvent uploader leurs CTFs (titre, description, points, flag attendu, fichier ZIP).

- **Compétitions CTF**

  - L'admin général peut créer des compétitions avec une période (start / end).
  - Chaque CTF peut être associé à une compétition.
  - Pendant une compétition :
    - Les participants voient la liste des CTFs (sauf les leurs).
    - Pour chaque CTF, ils peuvent télécharger les fichiers ZIP et soumettre un flag.
    - Si le flag est correct, le score du participant est mis à jour.
  - Leaderboard mis à jour en temps réel via Socket.IO.

- **Règles métier**
  - Un participant ne peut pas résoudre son propre CTF (celui dont il est l'auteur).
  - Un participant ne peut pas gagner plusieurs fois les points du même CTF (une seule validation compte).
  - Les soumissions sont uniquement acceptées pendant la fenêtre de temps de la compétition (status RUNNING et entre `startTime` / `endTime`).

## Structure du projet

```text
ctf/
  backend/
    src/
      app.js
      server.js
      config/
        database.js
        multer.js
      models/
        index.js
        user.model.js
        competition.model.js
        ctfChallenge.model.js
        submission.model.js
        score.model.js
      routes/
        auth.routes.js
        challenge.routes.js
        competition.routes.js
        submission.routes.js
      middleware/
        auth.middleware.js
    .env
    package.json

  frontend/
    src/
      main.jsx
      App.jsx
      index.css
      api/
        client.js
      context/
        AuthContext.jsx
      components/
        Layout.jsx
        ProtectedRoute.jsx
      pages/
        LoginPage.jsx
        RegisterPage.jsx
        UploadCTFPage.jsx
        CompetitionPage.jsx
        AdminCompetitionPage.jsx
    tailwind.config.js
    postcss.config.js
    package.json

  .gitignore
  README.md
```

## Installation et démarrage

### Prérequis

- Node.js (version récente LTS)
- pnpm installé globalement (`npm install -g pnpm`)
- MySQL en local (ou distant), avec une base de données créée (par ex. `ctc_ctf`).

---

### Backend

1. Aller dans le dossier backend :

   ```bash
   cd backend
   ```

2. Installer les dépendances :

   ```bash
   pnpm install
   ```

3. Configurer les variables d'environnement dans `backend/.env` (exemple) :

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=mot_de_passe
   DB_NAME=ctc_ctf
   JWT_SECRET=changeme_super_secret
   PORT=4000
   ```

4. Lancer le serveur backend :

   ```bash
   npm run dev
   ```

5. Vérifier que l'API répond :

   - `GET http://localhost:4000/health` → `{ "status": "ok" }`

---

### Frontend

1. Aller dans le dossier frontend :

   ```bash
   cd frontend
   ```

2. Installer les dépendances :

   ```bash
   pnpm install
   ```

3. Lancer l'application React :

   ```bash
   pnpm dev
   ```

4. Ouvrir le navigateur sur :

   - `http://localhost:5173`

---

## Flux d'utilisation (simplifié)

1. **Créer un admin général** via la page Register (`role = ADMIN_GENERAL`).
2. **Créer un participant** via la page Register (`role = PARTICIPANT`).
3. **Admin** :
   - Crée une compétition via l'API (`POST /competitions`) ou l'interface admin.
   - Démarre la compétition (`POST /competitions/:id/start`).
4. **Participant** :
   - Uploade un CTF via la page "Upload CTF" (avec fichier ZIP, flag, points, competitionId).
   - Va sur la page de compétition (`/competitions/:id`), voit la liste des CTFs, soumet des flags.
5. **Leaderboard** :
   - Se met à jour en temps réel sur la page de compétition.

## Notes

- Ce README décrit la structure et le flux actuels : il peut être complété avec des captures d'écran, des exemples de requêtes Postman, ou des étapes de déploiement (Docker, hébergement, etc.) selon les besoins.
