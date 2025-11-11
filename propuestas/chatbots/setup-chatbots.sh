#!/bin/bash

# Script de instalación de dependencias para chatbots IA
# Ejecutar con: bash setup-chatbots.sh

echo "🚀 Instalando dependencias de chatbots IA..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 1. Instalar dependencias de IA
echo "📦 Instalando OpenAI y Gemini..."
if pnpm add openai @google/generative-ai; then
    print_success "Dependencias instaladas correctamente"
else
    print_error "Error al instalar dependencias"
    exit 1
fi

echo ""

# 2. Verificar si existe .env.local
if [ -f ".env.local" ]; then
    print_warning ".env.local ya existe"
    echo "   Asegúrate de tener estas variables:"
    echo "   - OPENAI_API_KEY"
    echo "   - GEMINI_API_KEY"
else
    print_warning ".env.local no encontrado"
    echo "   Creando desde .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_success ".env.local creado"
        echo ""
        print_warning "ACCIÓN REQUERIDA:"
        echo "   1. Abre .env.local"
        echo "   2. Rellena tus API keys"
        echo "   3. Guarda el archivo"
    else
        print_error ".env.example no encontrado"
    fi
fi

echo ""

# 3. Verificar instalación
echo "🔍 Verificando instalación..."

# Verificar que openai esté en package.json
if grep -q '"openai"' package.json; then
    print_success "openai encontrado en package.json"
else
    print_error "openai NO encontrado en package.json"
fi

# Verificar que @google/generative-ai esté en package.json
if grep -q '"@google/generative-ai"' package.json; then
    print_success "@google/generative-ai encontrado en package.json"
else
    print_error "@google/generative-ai NO encontrado en package.json"
fi

echo ""
echo "✅ Setup completo!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Obtener API keys:"
echo "      - OpenAI: https://platform.openai.com/api-keys"
echo "      - Gemini: https://aistudio.google.com/app/apikey"
echo ""
echo "   2. Configurar .env.local con tus keys"
echo ""
echo "   3. Iniciar servidor:"
echo "      pnpm dev"
echo ""
echo "   4. Ver documentación completa:"
echo "      cat SETUP_CHATBOTS.md"
echo ""
