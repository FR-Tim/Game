import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  ShoppingCart,
  Plus,
  Trash2,
  Download,
  Shuffle,
  Flame,
  Coffee,
  Sun,
  Moon,
  ChefHat,
  Save,
  X
} from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  // États
  const [recipes, setRecipes] = useState([]);
  const [weekPlan, setWeekPlan] = useState({});
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [totalCalories, setTotalCalories] = useState({});

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const mealTypes = {
    breakfast: { label: 'Petit-déjeuner', icon: Coffee, color: 'peach' },
    lunch: { label: 'Déjeuner', icon: Sun, color: 'mint' },
    dinner: { label: 'Dîner', icon: Moon, color: 'lavender' }
  };

  // Charger les recettes au démarrage
  useEffect(() => {
    loadRecipes();
    loadSavedPlan();
  }, []);

  // Sauvegarder automatiquement le plan
  useEffect(() => {
    if (Object.keys(weekPlan).length > 0) {
      localStorage.setItem('weekPlan', JSON.stringify(weekPlan));
    }
  }, [weekPlan]);

  // Mettre à jour la liste de courses et calories quand le plan change
  useEffect(() => {
    if (Object.keys(weekPlan).length > 0) {
      generateShoppingList();
      calculateDailyCalories();
    }
  }, [weekPlan]);

  const loadRecipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes`);
      setRecipes(response.data.recipes);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes:', error);
      setLoading(false);
    }
  };

  const loadSavedPlan = () => {
    const saved = localStorage.getItem('weekPlan');
    if (saved) {
      setWeekPlan(JSON.parse(saved));
    } else {
      // Initialiser un plan vide
      const emptyPlan = {};
      daysOfWeek.forEach(day => {
        emptyPlan[day] = {
          breakfast: null,
          lunch: null,
          dinner: null
        };
      });
      setWeekPlan(emptyPlan);
    }
  };

  const generateShoppingList = async () => {
    const recipeIds = [];
    Object.values(weekPlan).forEach(day => {
      if (day.breakfast) recipeIds.push(day.breakfast.id);
      if (day.lunch) recipeIds.push(day.lunch.id);
      if (day.dinner) recipeIds.push(day.dinner.id);
    });

    if (recipeIds.length === 0) {
      setShoppingList([]);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/shopping-list`, { recipeIds });
      setShoppingList(response.data.shoppingList);
    } catch (error) {
      console.error('Erreur lors de la génération de la liste de courses:', error);
    }
  };

  const calculateDailyCalories = async () => {
    const caloriesPerDay = {};

    for (const day of daysOfWeek) {
      const recipeIds = [];
      if (weekPlan[day]?.breakfast) recipeIds.push(weekPlan[day].breakfast.id);
      if (weekPlan[day]?.lunch) recipeIds.push(weekPlan[day].lunch.id);
      if (weekPlan[day]?.dinner) recipeIds.push(weekPlan[day].dinner.id);

      if (recipeIds.length > 0) {
        try {
          const response = await axios.post(`${API_URL}/calculate-calories`, { recipeIds });
          caloriesPerDay[day] = response.data.totalCalories;
        } catch (error) {
          console.error('Erreur calcul calories:', error);
        }
      }
    }

    setTotalCalories(caloriesPerDay);
  };

  const openRecipeSelector = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setShowRecipeModal(true);
  };

  const selectRecipe = (recipe) => {
    setWeekPlan(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [selectedMealType]: recipe
      }
    }));
    setShowRecipeModal(false);
  };

  const removeRecipe = (day, mealType) => {
    setWeekPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: null
      }
    }));
  };

  const generateRandomWeekPlan = async () => {
    try {
      const response = await axios.post(`${API_URL}/recipes/random`, { days: 7 });
      const newPlan = {};
      response.data.weekPlan.forEach(dayData => {
        newPlan[dayData.day] = dayData.meals;
      });
      setWeekPlan(newPlan);
    } catch (error) {
      console.error('Erreur génération plan aléatoire:', error);
    }
  };

  const clearWeekPlan = () => {
    const emptyPlan = {};
    daysOfWeek.forEach(day => {
      emptyPlan[day] = {
        breakfast: null,
        lunch: null,
        dinner: null
      };
    });
    setWeekPlan(emptyPlan);
    localStorage.removeItem('weekPlan');
  };

  const downloadShoppingList = () => {
    const text = "LISTE DE COURSES\n\n" +
      shoppingList.map(item =>
        `- ${item.name}: ${item.display || item.details}`
      ).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liste-de-courses.txt';
    a.click();
  };

  const copyShoppingList = () => {
    const text = shoppingList.map(item =>
      `${item.name}: ${item.display || item.details}`
    ).join('\n');

    navigator.clipboard.writeText(text);
    alert('Liste de courses copiée dans le presse-papiers!');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading"></div>
        <p>Chargement des recettes...</p>
      </div>
    );
  }

  const filteredRecipes = selectedMealType
    ? recipes.filter(r => {
        if (selectedMealType === 'breakfast') return r.category === 'petit-dejeuner';
        if (selectedMealType === 'lunch') return r.category === 'dejeuner';
        if (selectedMealType === 'dinner') return r.category === 'diner';
        return false;
      })
    : [];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <ChefHat size={32} />
              <h1>Meal Planner</h1>
            </div>
            <div className="header-actions">
              <button className="btn btn-outline btn-small" onClick={clearWeekPlan}>
                <Trash2 size={16} />
                Effacer tout
              </button>
              <button className="btn btn-secondary btn-small" onClick={generateRandomWeekPlan}>
                <Shuffle size={16} />
                Plan aléatoire
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container main-content">
        {/* Section Planification */}
        <section className="section fade-in">
          <div className="section-header">
            <h2>
              <Calendar size={24} />
              Planification de la semaine
            </h2>
          </div>

          <div className="week-grid">
            {daysOfWeek.map((day, index) => (
              <div key={day} className="day-card slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="day-title">{day}</h3>

                {Object.entries(mealTypes).map(([type, config]) => {
                  const Icon = config.icon;
                  const meal = weekPlan[day]?.[type];

                  return (
                    <div key={type} className={`meal-slot meal-${config.color}`}>
                      <div className="meal-header">
                        <Icon size={16} />
                        <span>{config.label}</span>
                      </div>

                      {meal ? (
                        <div className="meal-content">
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="meal-image"
                          />
                          <div className="meal-info">
                            <h4>{meal.name}</h4>
                            <p className="meal-time">
                              {meal.prepTime} + {meal.cookTime}
                            </p>
                            <p className="meal-calories">
                              <Flame size={14} />
                              {meal.calories} cal
                            </p>
                          </div>
                          <button
                            className="btn-remove"
                            onClick={() => removeRecipe(day, type)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn-add-meal"
                          onClick={() => openRecipeSelector(day, type)}
                        >
                          <Plus size={20} />
                          Ajouter un repas
                        </button>
                      )}
                    </div>
                  );
                })}

                {totalCalories[day] && (
                  <div className="day-calories">
                    <Flame size={16} />
                    <strong>{totalCalories[day]} cal/jour</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section Liste de courses */}
        <section className="section fade-in">
          <div className="section-header">
            <h2>
              <ShoppingCart size={24} />
              Liste de courses
            </h2>
            {shoppingList.length > 0 && (
              <div className="shopping-actions">
                <button className="btn btn-small btn-outline" onClick={copyShoppingList}>
                  Copier
                </button>
                <button className="btn btn-small btn-primary" onClick={downloadShoppingList}>
                  <Download size={16} />
                  Télécharger
                </button>
              </div>
            )}
          </div>

          <div className="card shopping-list-card">
            {shoppingList.length === 0 ? (
              <p className="empty-message">
                Ajoutez des repas à votre planning pour générer une liste de courses
              </p>
            ) : (
              <ul className="shopping-list">
                {shoppingList.map((item, index) => (
                  <li key={index} className="shopping-item slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">{item.display || item.details}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      {/* Modal de sélection de recette */}
      {showRecipeModal && (
        <div className="modal-overlay" onClick={() => setShowRecipeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choisir une recette</h3>
              <button className="btn-close" onClick={() => setShowRecipeModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="recipes-grid">
              {filteredRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="recipe-card"
                  onClick={() => selectRecipe(recipe)}
                >
                  <img src={recipe.image} alt={recipe.name} />
                  <div className="recipe-card-content">
                    <h4>{recipe.name}</h4>
                    <div className="recipe-meta">
                      <span>{recipe.prepTime}</span>
                      <span>
                        <Flame size={14} />
                        {recipe.calories} cal
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
