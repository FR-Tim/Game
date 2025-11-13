# COMMENT TESTER L'APPLICATION MEAL PLANNER

## Méthode 1 : Lancement standard (Recommandé)

### Étape 1 : Ouvrir 2 terminaux

Ouvrez deux fenêtres de terminal côte à côte.

### Étape 2 : Terminal 1 - Backend

```bash
cd /vercel/sandbox/meal-planner-app/backend
npm start
```

**Attendre de voir** :
```
🚀 Serveur démarré sur http://localhost:5000
📚 API disponible sur http://localhost:5000/api/recipes
```

### Étape 3 : Terminal 2 - Frontend

```bash
cd /vercel/sandbox/meal-planner-app/frontend
npm run dev
```

**Attendre de voir** :
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Étape 4 : Navigateur

L'application s'ouvre automatiquement dans votre navigateur.
Sinon, allez sur : http://localhost:3000

---

## Méthode 2 : Test rapide de l'API

Si vous voulez tester uniquement le backend :

```bash
cd /vercel/sandbox/meal-planner-app/backend
npm start
```

Puis dans un autre terminal :

```bash
# Tester l'API
curl http://localhost:5000/api/recipes | json_pp

# Ou ouvrez dans le navigateur :
# http://localhost:5000/api/recipes
```

---

## Scénario de test complet

### 1. Première visite

1. Ouvrez l'application (http://localhost:3000)
2. Vous devriez voir :
   - Un header avec "Meal Planner" et deux boutons
   - 7 cartes pour chaque jour de la semaine
   - Une section "Liste de courses" vide en bas

### 2. Ajouter un premier repas

1. Cliquez sur "+ Ajouter un repas" sous "Lundi" → "Petit-déjeuner"
2. Une modal s'ouvre avec 3 recettes de petit-déjeuner
3. Cliquez sur "Pancakes moelleux"
4. La modal se ferme
5. Les pancakes apparaissent dans la carte Lundi

**Vérifications** :
- L'image s'affiche
- Le nom "Pancakes moelleux" est visible
- Le temps "15 min + 10 min" est affiché
- Les calories "350 cal" sont visibles
- Un bouton X apparaît au survol pour supprimer

### 3. Ajouter plusieurs repas

1. Ajoutez un déjeuner pour Lundi (ex: Salade Caesar)
2. Ajoutez un dîner pour Lundi (ex: Spaghetti Bolognaise)
3. Sous la carte Lundi, vous devriez voir :
   - "🔥 1280 cal/jour" (ou similaire)

### 4. Vérifier la liste de courses

1. Descendez jusqu'à la section "Liste de courses"
2. Vous devriez voir tous les ingrédients consolidés :
   - Farine: 250 g
   - Lait: 300 ml
   - Oeufs: 2 pièces
   - etc.

### 5. Tester l'export

1. Cliquez sur "Copier"
   - Une alerte "Liste de courses copiée..." doit apparaître
   - Ouvrez un éditeur de texte et collez (Ctrl+V)
   
2. Cliquez sur "Télécharger"
   - Un fichier "liste-de-courses.txt" doit se télécharger
   - Ouvrez-le pour vérifier le contenu

### 6. Tester le plan aléatoire

1. Cliquez sur "Plan aléatoire" dans le header
2. Toute la semaine doit se remplir instantanément
3. Chaque jour a 3 repas (petit-déjeuner, déjeuner, dîner)
4. Les calories totales apparaissent sous chaque jour

### 7. Tester la suppression

1. Survolez une recette avec la souris
2. Cliquez sur le bouton X en haut à droite
3. La recette disparaît
4. La liste de courses se met à jour automatiquement

### 8. Tester l'effacement

1. Cliquez sur "Effacer tout" dans le header
2. Toutes les recettes disparaissent
3. La liste de courses se vide

### 9. Tester la sauvegarde automatique

1. Ajoutez quelques repas
2. Fermez complètement le navigateur
3. Rouvrez http://localhost:3000
4. Vos repas devraient être toujours là !

### 10. Tester le responsive

1. Redimensionnez la fenêtre du navigateur
2. Passez en mode mobile (Ctrl+Shift+M dans Chrome)
3. L'interface doit s'adapter :
   - Les cartes passent en 1 colonne
   - Les boutons se réorganisent
   - Tout reste lisible

---

## Tests de l'API (Optionnel)

Si vous voulez tester directement l'API :

### 1. Obtenir toutes les recettes

```bash
curl http://localhost:5000/api/recipes
```

### 2. Obtenir une recette spécifique

```bash
curl http://localhost:5000/api/recipes/1
```

### 3. Générer un plan aléatoire

```bash
curl -X POST http://localhost:5000/api/recipes/random \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

### 4. Générer une liste de courses

```bash
curl -X POST http://localhost:5000/api/shopping-list \
  -H "Content-Type: application/json" \
  -d '{"recipeIds": [1, 2, 3]}'
```

### 5. Calculer les calories

```bash
curl -X POST http://localhost:5000/api/calculate-calories \
  -H "Content-Type: application/json" \
  -d '{"recipeIds": [1, 2, 3]}'
```

---

## Vérifications de performance

### Temps de chargement

1. Ouvrez les outils de développement (F12)
2. Onglet "Network"
3. Rafraîchissez la page (F5)
4. Vérifiez :
   - Chargement initial < 2s
   - API recipes < 100ms
   - Taille totale < 500 KB

### Console

1. Ouvrez la console (F12)
2. Vérifiez qu'il n'y a pas d'erreurs rouges
3. Quelques avertissements jaunes sont OK

### LocalStorage

1. F12 → Application → Local Storage → http://localhost:3000
2. Vous devriez voir une clé "weekPlan"
3. Cliquez dessus pour voir le contenu JSON

---

## Checklist finale

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Page s'affiche correctement
- [ ] Peut ajouter un repas
- [ ] Peut supprimer un repas
- [ ] Liste de courses se génère
- [ ] Plan aléatoire fonctionne
- [ ] Export TXT fonctionne
- [ ] Copie presse-papiers fonctionne
- [ ] Calories s'affichent
- [ ] Sauvegarde automatique fonctionne
- [ ] Responsive fonctionne
- [ ] Animations sont fluides
- [ ] Images se chargent

---

## En cas de problème

### Le backend ne démarre pas

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Le frontend ne démarre pas

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### La page est blanche

1. Ouvrez la console (F12)
2. Regardez les erreurs
3. Vérifiez que le backend tourne
4. Vérifiez l'URL dans App.jsx (ligne 14)

### Les images ne chargent pas

- Vérifiez votre connexion internet
- Les images viennent de Unsplash (en ligne)

---

## Félicitations !

Si tous les tests passent, votre application Meal Planner fonctionne parfaitement !

Vous pouvez maintenant :
- L'utiliser pour planifier vos propres repas
- Ajouter vos propres recettes dans recipes.json
- Personnaliser le design
- Déployer en production

Bon appétit ! 🍽️
