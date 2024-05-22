# Documentation de l'API

## Introduction

Ce service d'API permet de gérer les utilisateurs, l'authentification, et les budgets personnels, y compris les dépenses, les revenus, et les finances. Les utilisateurs peuvent créer un compte, se connecter, générer un nouveau token (invalider l’ancien token), récupérer leur token, changer leur mot de passe, se déconnecter, et supprimer leur compte. Ils peuvent également gérer leur budget en ajoutant ou mettant à jour le budget de départ, en ajoutant ou supprimant des dépenses ou des revenus, et en récupérant les données financières (Budget, Dépenses totales et Solde).

Pour accéder aux endpoints sécurisés, les utilisateurs doivent s'inscrire pour obtenir un token. Chaque utilisateur récupérera ses propres données en fonction de son token. Si un nouveau token est généré, l'ancien n'est plus valable.

Assurez-vous d'envoyer les données en format JSON dans le corps des requêtes et d'inclure le token dans l'en-tête d'autorisation sous la forme `Bearer {token}`.





### Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/KaneDev7/gestion_budget_API.git
   cd votre-projet
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez MongoDB. Vous pouvez utiliser une instance MongoDB locale ou MongoDB Atlas.

### Configuration

1. Créez un fichier `.env` à la racine du projet et ajoutez les variables d'environnement suivantes :
   ```
   JWT_SECRET=votre_jwt_secret
   SALT_ROUNDS=10
   INVALID_TOKEN_TIME=3600
   MONGODB_URI=votre_mongodb_uri
   ```

### Exécuter l'API

Pour démarrer le serveur, exécutez :
```bash
npm start
```

## URL de base 
https://gestion-budget-api.onrender.com

## Authentification

### Créer un compte
- **Endpoint:** `POST /api/auth`
- **Données à poster:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Se connecter à son compte
- **Endpoint:** `POST /api/login`
- **Données à poster:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Se déconnecter
- **Endpoint:** `GET /api/logout`
- **Autorization:** `Bearer {token}`

## Gestion du Budget

### Ajouter ou mettre à jour le budget de départ
- **Endpoint:** `POST /api/budget`
- **Autorization:** `Bearer {token}`
- **Données à poster:**
  ```json
  {
    "montant": "number"
  }
  ```

## Dépenses

### Récupérer les dépenses
- **Endpoint:** `GET /api/expenses`
- **Autorization:** `Bearer {token}`
- **Query Parameters:**
  - `gt` (optionnel): Montant supérieur à
  - `lt` (optionnel): Montant inférieur à

### Ajouter une dépense
- **Endpoint:** `POST /api/expense`
- **Autorization:** `Bearer {token}`
- **Données à poster:**
  ```json
  {
    "montant": "number",
    "title": "string",
  }
  ```

### Supprimer une dépense
- **Endpoint:** `DELETE /api/expenses/:id`
- **Autorization:** `Bearer {token}`

## Revenus

### Récupérer les revenus
- **Endpoint:** `GET /api/incomes`
- **Autorization:** `Bearer {token}`
- **Query Parameters:**
  - `gt` (optionnel): Montant supérieur à
  - `lt` (optionnel): Montant inférieur à

### Ajouter un revenu
- **Endpoint:** `POST /api/income`
- **Autorization:** `Bearer {token}`
- **Données à poster:**
  ```json
  {
    "montant": "number",
    "title": "string",
  }
  ```

### Supprimer un revenu
- **Endpoint:** `DELETE /api/incomes/:id`
- **Autorization:** `Bearer {token}`

## Finances

### Récupérer les données financières
- **Endpoint:** `GET /api/finances`
- **Autorization:** `Bearer {token}`

## Gestion des Tokens

### Récupérer son token
- **Endpoint:** `GET /api/token`
- **Autorization:** `Bearer {token}`

### Générer un nouveau token
- **Endpoint:** `GET /api/token/new`
- **Autorization:** `Bearer {token}`

## Utilisateurs

### Changer de mot de passe
- **Endpoint:** `PATCH /api/user/edit/password`
- **Autorization:** `Bearer {token}`
- **Données à poster:**
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```

### Supprimer son compte
- **Endpoint:** `DELETE /api/user`
- **Autorization:** `Bearer {token}`


#### Exemple pour récuperer ses dépenses

```javascript
const TOKEN = 'valid_token'
fetch(`https://gestion-budget-api.onrender.com/api/expenses`, {
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }
})

    .then((result) => result.json())
    .then(data => {
        console.log(data)
    })
```

#### Exemple pour ajouter une dépense

```javascript
const TOKEN = 'valid_token'
fetch(`https://gestion-budget-api.onrender.com/api/expense`, {
    method: 'POST',
    body: JSON.stringify({ title: 'expense title', montant: 1000 }),
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }
})

    .then((result) => result.json())
    .then(data => {
        console.log(data)
    })
```

### Dépendances

- Express
- Mongoose
- bcrypt
- jsonwebtoken
- cookie-parser
- body-parser
- cors
- mongodb-memory-server
- Supertest
- Jest
