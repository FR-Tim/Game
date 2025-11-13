# GUIDE COMPLET - Meal Planner Application

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Utilisation](#utilisation)
5. [Explications détaillées](#explications-détaillées)
6. [Personnalisation](#personnalisation)

---

## Vue d'ensemble

### Qu'est-ce que Meal Planner ?

Meal Planner est une application web complète de planification de repas qui vous permet de :
- Organiser vos repas pour toute la semaine
- Gérer 3 types de repas par jour (petit-déjeuner, déjeuner, dîner)
- Générer automatiquement une liste de courses consolidée
- Suivre vos calories quotidiennes
- Sauvegarder votre planning localement
- Générer un plan aléatoire complet

### Technologies

**Frontend** :
- React 18.2.0 (bibliothèque UI moderne)
- Vite 5.0.8 (bundler ultra-rapide)
- Lucide React (icônes SVG)
- Axios (requêtes HTTP)

**Backend** :
- Node.js avec Express 4.18.2
- CORS pour les requêtes cross-origin
- Body-parser pour le parsing JSON
- Nodemon pour le développement

---

## Architecture

### Structure des fichiers

```
meal-planner-app/
│
├── backend/                      # Serveur API
│   ├── data/
│   │   └── recipes.json         # Base de données JSON (10 recettes)
│   ├── node_modules/            # Dépendances backend
│   ├── package.json             # Config npm backend
│   └── server.js                # Serveur Express principal
│
├── frontend/                    # Application React
│   ├── src/
│   │   ├── App.jsx             # Composant principal avec toute la logique
│   │   ├── App.css             # Styles de l'application
│   │   ├── index.css           # Styles globaux + variables CSS
│   │   └── main.jsx            # Point d'entrée React
│   ├── node_modules/           # Dépendances frontend
│   ├── index.html              # Template HTML
│   ├── package.json            # Config npm frontend
│   └── vite.config.js          # Configuration Vite
│
├── .gitignore                  # Fichiers à ignorer dans git
├── README.md                   # Documentation principale
├── START.md                    # Guide de démarrage rapide
└── GUIDE_COMPLET.md           # Ce fichier
```

### Flux de données

```
Utilisateur
    ↓
Frontend React (port 3000)
    ↓ (Axios HTTP)
Backend Express (port 5000)
    ↓
recipes.json
    ↓
Réponse JSON
    ↓
Frontend (affichage)
    ↓
localStorage (sauvegarde)
```

---

## Installation

### Prérequis

Avant de commencer, assurez-vous d'avoir :
- **Node.js** version 18 ou supérieure
- **npm** (inclus avec Node.js)
- Un **navigateur web** moderne (Chrome, Firefox, Edge, Safari)
- Un **éditeur de code** (VSCode recommandé)

### Vérifier Node.js

```bash
node --version
# Devrait afficher : v18.x.x ou supérieur

npm --version
# Devrait afficher : 9.x.x ou supérieur
```

### Installation étape par étape

#### 1. Naviguer vers le projet

```bash
cd /chemin/vers/meal-planner-app
```

#### 2. Installer le backend

```bash
cd backend
npm install
```

Cela installe :
- express (serveur web)
- cors (gestion des requêtes cross-origin)
- body-parser (parsing JSON)
- nodemon (rechargement auto en dev)

#### 3. Installer le frontend

```bash
cd ../frontend
npm install
```

Cela installe :
- react & react-dom (bibliothèque UI)
- vite (bundler)
- lucide-react (icônes)
- axios (requêtes HTTP)

---

## Utilisation

### Démarrer l'application

Vous devez lancer **2 terminaux en parallèle** :

#### Terminal 1 : Backend

```bash
cd /vercel/sandbox/meal-planner-app/backend
npm start
```

**Sortie attendue :**
```
🚀 Serveur démarré sur http://localhost:5000
📚 API disponible sur http://localhost:5000/api/recipes
```

#### Terminal 2 : Frontend

```bash
cd /vercel/sandbox/meal-planner-app/frontend
npm run dev
```

**Sortie attendue :**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

L'application s'ouvre automatiquement dans votre navigateur par défaut.

### Première utilisation

1. **Ajoutez votre premier repas**
   - Cliquez sur le bouton "+ Ajouter un repas" sous n'importe quel jour
   - Une modal s'ouvre avec toutes les recettes disponibles
   - Cliquez sur une recette pour la sélectionner

2. **Remplissez votre semaine**
   - Ajoutez des repas pour chaque jour
   - Vous pouvez ajouter un petit-déjeuner, déjeuner et dîner par jour

3. **Consultez votre liste de courses**
   - La liste se génère automatiquement en bas de page
   - Les ingrédients sont consolidés (pas de doublons)
   - Utilisez "Copier" ou "Télécharger" pour exporter

4. **Testez le plan aléatoire**
   - Cliquez sur "Plan aléatoire" en haut à droite
   - Toute la semaine est remplie automatiquement
   - Vous pouvez modifier individuellement ensuite

5. **Visualisez vos calories**
   - Sous chaque jour, vous voyez le total de calories
   - Basé sur les 3 repas du jour

---

## Explications détaillées

### 1. Backend (server.js)

#### Routes API principales

**GET /api/recipes**
- Récupère toutes les recettes
- Retourne un objet avec un tableau `recipes`

**POST /api/shopping-list**
- Paramètres : `{ recipeIds: [1, 2, 3] }`
- Génère une liste de courses consolidée
- Additionne les quantités pour les mêmes ingrédients

**POST /api/recipes/random**
- Paramètres : `{ days: 7 }`
- Génère un plan aléatoire pour X jours
- Sélectionne aléatoirement par catégorie

**POST /api/calculate-calories**
- Paramètres : `{ recipeIds: [1, 2, 3] }`
- Calcule le total de calories
- Retourne aussi la moyenne par repas

#### Consolidation des ingrédients

```javascript
// Cette fonction évite les doublons dans la liste de courses
const ingredientsMap = new Map();

selectedRecipes.forEach(recipe => {
  recipe.ingredients.forEach(ingredient => {
    const key = ingredient.name.toLowerCase(); // Clé en minuscule

    if (ingredientsMap.has(key)) {
      const existing = ingredientsMap.get(key);

      // Si même unité, on additionne
      if (existing.unit === ingredient.unit) {
        existing.quantity += ingredient.quantity;
      } else {
        // Sinon, on crée plusieurs entrées
        existing.entries.push({
          quantity: ingredient.quantity,
          unit: ingredient.unit
        });
      }
    } else {
      // Première occurrence
      ingredientsMap.set(key, {
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit
      });
    }
  });
});
```

**Exemple** :
- Recette 1 : Farine 250g
- Recette 2 : Farine 100g
- Résultat : Farine 350g (consolidé)

### 2. Frontend (App.jsx)

#### États React principaux

```javascript
const [recipes, setRecipes] = useState([]);        // Toutes les recettes
const [weekPlan, setWeekPlan] = useState({});      // Planning de la semaine
const [shoppingList, setShoppingList] = useState([]); // Liste de courses
const [totalCalories, setTotalCalories] = useState({}); // Calories par jour
```

#### Structure du weekPlan

```javascript
{
  "Lundi": {
    breakfast: { id: 1, name: "Pancakes", ... },
    lunch: { id: 2, name: "Salade Caesar", ... },
    dinner: null
  },
  "Mardi": {
    breakfast: null,
    lunch: null,
    dinner: { id: 3, name: "Spaghetti", ... }
  },
  ...
}
```

#### Sauvegarde automatique

```javascript
// Ce useEffect s'exécute à chaque modification du weekPlan
useEffect(() => {
  if (Object.keys(weekPlan).length > 0) {
    localStorage.setItem('weekPlan', JSON.stringify(weekPlan));
  }
}, [weekPlan]);
```

#### Génération automatique de la liste

```javascript
// Ce useEffect s'exécute à chaque modification du weekPlan
useEffect(() => {
  if (Object.keys(weekPlan).length > 0) {
    generateShoppingList();      // Appelle l'API
    calculateDailyCalories();    // Calcule les calories
  }
}, [weekPlan]);
```

### 3. Styles CSS

#### Variables globales (index.css)

```css
:root {
  --mint: #B8E6D5;           /* Vert menthe principal */
  --mint-light: #D4F1E8;     /* Vert menthe clair */
  --cream: #FFF8E7;          /* Crème */
  --salmon: #FFB5A7;         /* Saumon */
  --salmon-light: #FFD4C9;   /* Saumon clair */
  --lavender: #E6E6FA;       /* Lavande */
  --peach: #FFDAB9;          /* Pêche */
}
```

#### Animations

**fadeIn** : Apparition en fondu
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**slideIn** : Glissement depuis la gauche
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

#### Classes utilitaires

- `.card` : Carte blanche avec ombre
- `.btn` : Bouton stylisé
- `.btn-primary` : Bouton vert menthe
- `.btn-secondary` : Bouton saumon
- `.badge` : Badge arrondi coloré

---

## Personnalisation

### Ajouter des recettes

Éditez `backend/data/recipes.json` :

```json
{
  "id": 11,
  "name": "Ma nouvelle recette",
  "category": "dejeuner",
  "prepTime": "20 min",
  "cookTime": "15 min",
  "calories": 400,
  "image": "https://images.unsplash.com/photo-XXXXX",
  "ingredients": [
    { "name": "Ingrédient 1", "quantity": 200, "unit": "g" },
    { "name": "Ingrédient 2", "quantity": 100, "unit": "ml" }
  ],
  "instructions": "Étapes de préparation..."
}
```

**Catégories disponibles** :
- `petit-dejeuner`
- `dejeuner`
- `diner`

### Modifier les couleurs

Dans `frontend/src/index.css`, changez les variables :

```css
:root {
  --mint: #VOTRE_COULEUR;
  --salmon: #VOTRE_COULEUR;
  /* etc. */
}
```

### Changer la police

1. Trouvez une police sur [Google Fonts](https://fonts.google.com)
2. Modifiez `frontend/index.html` :

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;600&display=swap" rel="stylesheet">
```

3. Modifiez `frontend/src/index.css` :

```css
body {
  font-family: 'Roboto', sans-serif;
}
```

### Ajouter plus de jours

Dans `frontend/src/App.jsx`, ligne 22 :

```javascript
const daysOfWeek = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi',
  'Vendredi', 'Samedi', 'Dimanche',
  'Lundi suivant' // Ajoutez des jours
];
```

### Changer le port

**Backend** (port 5000) :
Dans `backend/server.js`, ligne 6 :
```javascript
const PORT = process.env.PORT || 5000; // Changez ici
```

**Frontend** (port 3000) :
Dans `frontend/vite.config.js`, ligne 7 :
```javascript
server: {
  port: 3000 // Changez ici
}
```

N'oubliez pas de mettre à jour l'URL dans `frontend/src/App.jsx` :
```javascript
const API_URL = 'http://localhost:NOUVEAU_PORT/api';
```

---

## Résolution de problèmes

### Le backend ne démarre pas

**Erreur** : `Error: Cannot find module 'express'`

**Solution** :
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Le frontend ne charge pas

**Erreur** : `Failed to fetch`

**Causes possibles** :
1. Le backend n'est pas démarré
2. Mauvaise URL dans `App.jsx`
3. Problème de CORS

**Solution** :
- Vérifiez que le backend tourne sur le port 5000
- Vérifiez l'URL dans `frontend/src/App.jsx` ligne 14

### Les images ne s'affichent pas

**Cause** : Pas de connexion internet (images depuis Unsplash)

**Solution** :
- Utilisez des images locales
- Placez-les dans `frontend/public/images/`
- Modifiez les URLs dans `recipes.json` : `"/images/nom.jpg"`

### Erreur CORS

**Erreur** : `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution** :
Le backend utilise déjà le middleware CORS, mais vérifiez dans `backend/server.js` :

```javascript
const cors = require('cors');
app.use(cors()); // Cette ligne doit être présente
```

---

## Améliorations futures possibles

1. **Authentification** : Comptes utilisateurs avec JWT
2. **Base de données** : Migration vers MongoDB ou PostgreSQL
3. **Recherche** : Barre de recherche pour les recettes
4. **Filtres** : Par calories, temps de préparation, ingrédients
5. **Import/Export** : Sauvegarder et partager des plannings
6. **Mode sombre** : Toggle pour changer de thème
7. **Application mobile** : Version React Native
8. **Notifications** : Rappels pour faire les courses
9. **API externe** : Intégration avec Spoonacular ou Edamam
10. **Impression** : Format PDF pour la liste de courses

---

## Support

Pour toute question :
- Consultez le README.md pour les infos de base
- Consultez START.md pour le démarrage rapide
- Lisez ce guide pour les détails techniques

---

## Crédits

- **Images** : [Unsplash](https://unsplash.com)
- **Icônes** : [Lucide Icons](https://lucide.dev)
- **Police** : [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
- **Framework** : [React](https://react.dev)
- **Backend** : [Express.js](https://expressjs.com)

---

**Bon appétit et bonne planification !** 🍽️
