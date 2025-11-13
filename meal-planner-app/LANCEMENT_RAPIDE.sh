#!/bin/bash

echo "=================================="
echo "  MEAL PLANNER - Lancement rapide"
echo "=================================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé !"
    echo "Installez Node.js depuis https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Backend
echo "📦 Installation des dépendances backend..."
cd backend
npm install > /dev/null 2>&1
echo "✅ Backend prêt !"

# Frontend
echo "📦 Installation des dépendances frontend..."
cd ../frontend
npm install > /dev/null 2>&1
echo "✅ Frontend prêt !"

echo ""
echo "=================================="
echo "  🚀 Tout est installé !"
echo "=================================="
echo ""
echo "Pour lancer l'application, ouvrez 2 terminaux :"
echo ""
echo "Terminal 1 (Backend) :"
echo "  cd backend && npm start"
echo ""
echo "Terminal 2 (Frontend) :"
echo "  cd frontend && npm run dev"
echo ""
echo "=================================="
