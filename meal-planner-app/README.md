# Meal Planner - Application de Planification de Repas

Une application web moderne et responsive pour planifier vos repas de la semaine et générer automatiquement votre liste de courses.

## Fonctionnalités

### Fonctionnalités principales
- **Planification hebdomadaire** : Sélectionnez vos repas pour chaque jour (petit-déjeuner, déjeuner, dîner)
- **Base de recettes** : 10 recettes préchargées avec images, ingrédients et valeurs nutritionnelles
- **Liste de courses automatique** : Génération intelligente avec consolidation des ingrédients
- **Sauvegarde locale** : Votre planning est sauvegardé automatiquement dans le navigateur
- **Design moderne** : Interface pastel, animations fluides et responsive

### Fonctionnalités bonus
- **Plan aléatoire** : Génération automatique d'un plan de repas pour toute la semaine
- **Compteur de calories** : Calcul automatique des calories par jour
- **Export de liste** : Téléchargez ou copiez votre liste de courses

## Technologies utilisées

### Frontend
- **React 18** avec Vite pour un développement rapide
- **Lucide React** pour les icônes modernes
- **Axios** pour les appels API
- **CSS custom** avec palette pastel (vert menthe, crème, saumon, lavande)
- **Police Poppins** de Google Fonts

### Backend
- **Node.js** avec Express
- **CORS** pour les requêtes cross-origin
- **Base de données JSON** locale
- **API REST** complète

## Structure du projet

```
meal-planner-app/
├── backend/
│   ├── data/
│   │   └── recipes.json          # Base de données des recettes
│   ├── server.js                 # Serveur Express avec toutes les routes API
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx               # Composant principal
    │   ├── App.css               # Styles de l'application
    │   ├── index.css             # Styles globaux et variables CSS
    │   └── main.jsx              # Point d'entrée React
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Installation et lancement

### Prérequis
- Node.js 18+ installé sur votre machine
- npm ou yarn

### Étape 1 : Cloner ou télécharger le projet

```bash
cd meal-planner-app
```

### Étape 2 : Installer les dépendances

**Backend :**
```bash
cd backend
npm install
```

**Frontend :**
```bash
cd ../frontend
npm install
```

### Étape 3 : Lancer l'application

Vous devez lancer **deux terminaux** en parallèle :

**Terminal 1 - Backend :**
```bash
cd backend
npm start
```
Le serveur démarre sur `http://localhost:5000`

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```
L'application s'ouvre automatiquement sur `http://localhost:3000`

## Utilisation

### 1. Planifier vos repas
- Cliquez sur "Ajouter un repas" dans n'importe quel jour/type de repas
- Sélectionnez une recette dans la modal qui s'ouvre
- La recette s'affiche avec son image, temps de préparation et calories

### 2. Générer la liste de courses
- Ajoutez plusieurs repas à votre planning
- La liste de courses se génère automatiquement en bas de page
- Les ingrédients sont consolidés (pas de doublons)

### 3. Télécharger la liste
- Cliquez sur "Télécharger" pour obtenir un fichier texte
- Ou "Copier" pour copier dans le presse-papiers

### 4. Fonctionnalités bonus
- **Plan aléatoire** : Bouton en haut à droite pour générer une semaine complète
- **Calories** : Affichées sous chaque jour du planning
- **Effacer tout** : Réinitialise le planning complet

## API Endpoints

### GET /api/recipes
Récupère toutes les recettes
```json
{
  "recipes": [...]
}
```

### GET /api/recipes/:id
Récupère une recette par ID

### GET /api/recipes/category/:category
Récupère les recettes par catégorie (petit-dejeuner, dejeuner, diner)

### POST /api/recipes/random
Génère un plan de repas aléatoire pour la semaine
```json
{
  "days": 7
}
```

### POST /api/shopping-list
Génère la liste de courses à partir des IDs de recettes
```json
{
  "recipeIds": [1, 2, 3]
}
```

### POST /api/calculate-calories
Calcule les calories totales pour un ensemble de recettes
```json
{
  "recipeIds": [1, 2, 3]
}
```

### POST /api/recipes
Ajoute une nouvelle recette

### DELETE /api/recipes/:id
Supprime une recette

## Personnalisation

### Ajouter de nouvelles recettes
Modifiez le fichier `backend/data/recipes.json` :

```json
{
  "id": 11,
  "name": "Nom de la recette",
  "category": "petit-dejeuner|dejeuner|diner",
  "prepTime": "15 min",
  "cookTime": "10 min",
  "calories": 350,
  "image": "URL de l'image",
  "ingredients": [
    { "name": "Ingrédient", "quantity": 100, "unit": "g" }
  ],
  "instructions": "Instructions de préparation"
}
```

### Modifier les couleurs
Les couleurs sont définies dans `frontend/src/index.css` :

```css
:root {
  --mint: #B8E6D5;
  --cream: #FFF8E7;
  --salmon: #FFB5A7;
  --lavender: #E6E6FA;
  --peach: #FFDAB9;
}
```

### Changer la police
Modifiez l'import dans `frontend/index.html` :

```html
<link href="https://fonts.googleapis.com/css2?family=VotrePolice:wght@300;400;600&display=swap" rel="stylesheet">
```

## Explication du code

### Backend (server.js)

**Consolidation des ingrédients** :
```javascript
// Évite les doublons en regroupant par nom d'ingrédient
const ingredientsMap = new Map();
selectedRecipes.forEach(recipe => {
  recipe.ingredients.forEach(ingredient => {
    const key = ingredient.name.toLowerCase();
    if (ingredientsMap.has(key)) {
      // Additionner si même unité
      existing.quantity += ingredient.quantity;
    }
  });
});
```

**Génération de plan aléatoire** :
```javascript
// Sélectionne aléatoirement des recettes par catégorie
const breakfast = recipes.filter(r => r.category === 'petit-dejeuner');
const randomBreakfast = breakfast[Math.floor(Math.random() * breakfast.length)];
```

### Frontend (App.jsx)

**Sauvegarde automatique** :
```javascript
// Sauvegarde dans localStorage à chaque changement du plan
useEffect(() => {
  if (Object.keys(weekPlan).length > 0) {
    localStorage.setItem('weekPlan', JSON.stringify(weekPlan));
  }
}, [weekPlan]);
```

**Mise à jour réactive** :
```javascript
// Recalcule automatiquement la liste de courses quand le plan change
useEffect(() => {
  if (Object.keys(weekPlan).length > 0) {
    generateShoppingList();
    calculateDailyCalories();
  }
}, [weekPlan]);
```

## Dépannage

### Le frontend ne se connecte pas au backend
- Vérifiez que le backend tourne sur le port 5000
- Vérifiez l'URL dans `frontend/src/App.jsx` (ligne 14)

### Les images ne s'affichent pas
- Les images utilisent Unsplash et nécessitent une connexion internet
- Vous pouvez remplacer par des URLs locales

### Erreur de CORS
- Le backend utilise déjà le middleware CORS
- Vérifiez que les deux serveurs tournent

## Améliorations possibles

- Authentification utilisateur (compte en ligne)
- Base de données MongoDB pour plus de scalabilité
- Recherche et filtres de recettes
- Notes et commentaires sur les recettes
- Import/export de planning
- Mode sombre
- Version mobile native (React Native)
- Suggestions basées sur les préférences
- Intégration avec des services de livraison

## Auteur

Créé avec React, Express et beaucoup de passion pour la cuisine !

## Licence

MIT - Libre d'utilisation et de modification
