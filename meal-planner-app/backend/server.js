const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Charger les données des recettes
const recipesPath = path.join(__dirname, 'data', 'recipes.json');
let recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

// Routes API

/**
 * GET /api/recipes
 * Récupère toutes les recettes
 */
app.get('/api/recipes', (req, res) => {
  res.json(recipesData);
});

/**
 * GET /api/recipes/:id
 * Récupère une recette spécifique par son ID
 */
app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipesData.recipes.find(r => r.id === parseInt(req.params.id));
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ error: 'Recette non trouvée' });
  }
});

/**
 * GET /api/recipes/category/:category
 * Récupère les recettes par catégorie (petit-dejeuner, dejeuner, diner)
 */
app.get('/api/recipes/category/:category', (req, res) => {
  const filtered = recipesData.recipes.filter(r => r.category === req.params.category);
  res.json({ recipes: filtered });
});

/**
 * POST /api/recipes/random
 * Génère un plan de repas aléatoire pour la semaine
 * Body: { days: 7 }
 */
app.post('/api/recipes/random', (req, res) => {
  const days = req.body.days || 7;
  const weekPlan = [];

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  for (let i = 0; i < days; i++) {
    const breakfast = recipesData.recipes.filter(r => r.category === 'petit-dejeuner');
    const lunch = recipesData.recipes.filter(r => r.category === 'dejeuner');
    const dinner = recipesData.recipes.filter(r => r.category === 'diner');

    weekPlan.push({
      day: daysOfWeek[i],
      meals: {
        breakfast: breakfast[Math.floor(Math.random() * breakfast.length)],
        lunch: lunch[Math.floor(Math.random() * lunch.length)],
        dinner: dinner[Math.floor(Math.random() * dinner.length)]
      }
    });
  }

  res.json({ weekPlan });
});

/**
 * POST /api/shopping-list
 * Génère une liste de courses à partir des recettes sélectionnées
 * Body: { recipeIds: [1, 2, 3] }
 */
app.post('/api/shopping-list', (req, res) => {
  const { recipeIds } = req.body;

  if (!recipeIds || !Array.isArray(recipeIds)) {
    return res.status(400).json({ error: 'recipeIds doit être un tableau' });
  }

  const selectedRecipes = recipesData.recipes.filter(r => recipeIds.includes(r.id));

  // Consolider les ingrédients (éviter les doublons)
  const ingredientsMap = new Map();

  selectedRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase();

      if (ingredientsMap.has(key)) {
        const existing = ingredientsMap.get(key);
        // Additionner les quantités si même unité
        if (existing.unit === ingredient.unit) {
          existing.quantity += ingredient.quantity;
        } else {
          // Si unités différentes, créer une nouvelle entrée
          existing.entries = existing.entries || [{ quantity: existing.quantity, unit: existing.unit }];
          existing.entries.push({ quantity: ingredient.quantity, unit: ingredient.unit });
          delete existing.quantity;
          delete existing.unit;
        }
      } else {
        ingredientsMap.set(key, {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        });
      }
    });
  });

  // Convertir la Map en tableau
  const shoppingList = Array.from(ingredientsMap.values()).map(item => {
    if (item.entries) {
      // Multiple unités pour le même ingrédient
      return {
        name: item.name,
        details: item.entries.map(e => `${e.quantity} ${e.unit}`).join(' + ')
      };
    } else {
      return {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        display: `${item.quantity} ${item.unit}`
      };
    }
  });

  res.json({
    shoppingList,
    totalRecipes: selectedRecipes.length
  });
});

/**
 * POST /api/calculate-calories
 * Calcule les calories totales pour un jour
 * Body: { recipeIds: [1, 2, 3] }
 */
app.post('/api/calculate-calories', (req, res) => {
  const { recipeIds } = req.body;

  if (!recipeIds || !Array.isArray(recipeIds)) {
    return res.status(400).json({ error: 'recipeIds doit être un tableau' });
  }

  const selectedRecipes = recipesData.recipes.filter(r => recipeIds.includes(r.id));
  const totalCalories = selectedRecipes.reduce((sum, recipe) => sum + recipe.calories, 0);

  res.json({
    totalCalories,
    averagePerMeal: Math.round(totalCalories / selectedRecipes.length),
    recipes: selectedRecipes.map(r => ({ name: r.name, calories: r.calories }))
  });
});

/**
 * POST /api/recipes
 * Ajoute une nouvelle recette
 */
app.post('/api/recipes', (req, res) => {
  const newRecipe = req.body;

  // Générer un nouvel ID
  const maxId = Math.max(...recipesData.recipes.map(r => r.id), 0);
  newRecipe.id = maxId + 1;

  recipesData.recipes.push(newRecipe);

  // Sauvegarder dans le fichier
  fs.writeFileSync(recipesPath, JSON.stringify(recipesData, null, 2));

  res.status(201).json(newRecipe);
});

/**
 * DELETE /api/recipes/:id
 * Supprime une recette
 */
app.delete('/api/recipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = recipesData.recipes.findIndex(r => r.id === id);

  if (index !== -1) {
    recipesData.recipes.splice(index, 1);
    fs.writeFileSync(recipesPath, JSON.stringify(recipesData, null, 2));
    res.json({ message: 'Recette supprimée avec succès' });
  } else {
    res.status(404).json({ error: 'Recette non trouvée' });
  }
});

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API de planification de repas',
    version: '1.0.0',
    endpoints: {
      recipes: '/api/recipes',
      recipeById: '/api/recipes/:id',
      recipesByCategory: '/api/recipes/category/:category',
      randomWeekPlan: 'POST /api/recipes/random',
      shoppingList: 'POST /api/shopping-list',
      calculateCalories: 'POST /api/calculate-calories'
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 API disponible sur http://localhost:${PORT}/api/recipes`);
});
