# GUIDE DE DÉMARRAGE RAPIDE

## Pour lancer l'application (2 terminaux nécessaires)

### Terminal 1 - BACKEND
```bash
cd meal-planner-app/backend
npm install
npm start
```
Attendez de voir : `🚀 Serveur démarré sur http://localhost:5000`

### Terminal 2 - FRONTEND
```bash
cd meal-planner-app/frontend
npm install
npm run dev
```
Attendez de voir : `Local: http://localhost:3000`

L'application s'ouvrira automatiquement dans votre navigateur !

## Première utilisation

1. **Ajoutez des repas** : Cliquez sur "+ Ajouter un repas" pour n'importe quel jour
2. **Explorez les recettes** : 10 recettes sont déjà disponibles
3. **Générez votre liste** : Elle apparaît automatiquement en bas
4. **Testez le plan aléatoire** : Bouton "Plan aléatoire" en haut à droite
5. **Sauvegarde automatique** : Votre planning est sauvegardé dans le navigateur

## Raccourcis

- **Effacer tout** : Réinitialise le planning complet
- **Plan aléatoire** : Remplit toute la semaine automatiquement
- **Télécharger** : Exporte la liste de courses en .txt
- **Copier** : Copie la liste dans le presse-papiers

## En cas de problème

- Vérifiez que Node.js est installé : `node --version`
- Les deux serveurs doivent tourner en même temps
- Backend sur port 5000, Frontend sur port 3000
- Consultez README.md pour plus de détails
