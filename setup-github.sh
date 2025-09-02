#!/bin/bash

# 🚀 Script para configurar GitHub remote y hacer push
# Ejecutar después de crear el repositorio en GitHub

echo "🔧 Configurando repositorio remote de GitHub..."

# Solicitar URL del repositorio
echo "📋 Por favor, pega la URL del repositorio GitHub (ej: https://github.com/usuario/fandit-heroes.git):"
read REPO_URL

# Configurar remote
echo "🔗 Configurando remote origin..."
git remote add origin $REPO_URL

# Verificar remote
echo "✅ Remote configurado:"
git remote -v

# Hacer push inicial
echo "🚀 Subiendo código a GitHub..."
git push -u origin main

echo ""
echo "🎉 ¡Repositorio subido exitosamente a GitHub!"
echo "🌐 URL: $REPO_URL"
echo ""
echo "📋 Resumen del proyecto FANDIT HÉROES:"
echo "   ✅ Angular 14 + TypeScript"
echo "   ✅ Marvel API integrada con autenticación MD5"
echo "   ✅ Toggle Mock/API Real"
echo "   ✅ Búsqueda en tiempo real"
echo "   ✅ Diseño responsive"
echo "   ✅ Documentación completa"
echo ""
echo "🎯 Comandos útiles:"
echo "   npm start        # Ejecutar en desarrollo"
echo "   npm run build    # Compilar para producción"
echo "   git status       # Ver estado del repositorio"
echo "   git push         # Subir cambios futuros"
