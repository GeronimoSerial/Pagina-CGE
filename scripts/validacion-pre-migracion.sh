#!/bin/bash

# Script de Validación Pre-Migración Tailwind v4
# Verifica clases que serán obsoletas o cambiarán en v4

echo "🔍 ANÁLISIS PRE-MIGRACIÓN TAILWIND CSS v4"
echo "==========================================="
echo ""

# Colores para output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 CONTEO DE CLASES QUE CAMBIARÁN EN v4${NC}"
echo ""

# Clases que cambiarán de nombre
echo -e "${YELLOW}🔄 Clases que cambiarán de nombre:${NC}"
echo ""

echo "Shadow utilities:"
echo -n "  shadow-sm → shadow-xs: "
grep -r "shadow-sm" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | wc -l

echo -n "  shadow (bare) → shadow-sm: "
grep -r "\bshadow\b" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "shadow-" | wc -l

echo ""
echo "Border radius utilities:"
echo -n "  rounded-sm → rounded-xs: "
grep -r "rounded-sm" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | wc -l

echo -n "  rounded (bare) → rounded-sm: "
grep -r "\brounded\b" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "rounded-" | wc -l

echo ""
echo "Ring utilities:"
echo -n "  ring (bare) → ring-3: "
grep -r "\bring\b" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "ring-" | wc -l

echo ""
echo "Outline utilities:"
echo -n "  outline-none → outline-hidden: "
grep -r "outline-none" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | wc -l

echo ""
echo -e "${YELLOW}❌ Clases que serán eliminadas:${NC}"
echo ""

echo "Opacity utilities (usar modifiers /50):"
echo -n "  bg-opacity-*: "
grep -r "bg-opacity-" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | wc -l

echo -n "  text-opacity-*: "
grep -r "text-opacity-" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | wc -l

echo -n "  border-opacity-*: "
grep -r "border-opacity-" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | wc -l

echo ""
echo "Flex utilities (renombradas):"
echo -n "  flex-shrink-* → shrink-*: "
grep -r "flex-shrink-" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | wc -l

echo -n "  flex-grow-* → grow-*: "
grep -r "flex-grow-" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | wc -l

echo ""
echo -e "${BLUE}🔍 ANÁLISIS DE ARCHIVOS CRÍTICOS${NC}"
echo ""

# Verificar archivos de configuración
echo -e "${YELLOW}📄 Archivos de configuración:${NC}"
echo -n "  tailwind.config.js: "
if [ -f "tailwind.config.js" ]; then
    echo -e "${GREEN}✓ Encontrado${NC}"
else
    echo -e "${RED}✗ No encontrado${NC}"
fi

echo -n "  postcss.config.js: "
if [ -f "postcss.config.js" ]; then
    echo -e "${GREEN}✓ Encontrado${NC}"
else
    echo -e "${RED}✗ No encontrado${NC}"
fi

echo -n "  src/app/index.css: "
if [ -f "src/app/index.css" ]; then
    echo -e "${GREEN}✓ Encontrado${NC}"
    echo -n "    - Contiene @tailwind directives: "
    if grep -q "@tailwind" src/app/index.css; then
        echo -e "${YELLOW}⚠ Sí (requiere migración)${NC}"
    else
        echo -e "${GREEN}✓ No${NC}"
    fi
    
    echo -n "    - Contiene @layer components: "
    if grep -q "@layer components" src/app/index.css; then
        echo -e "${YELLOW}⚠ Sí (requiere migración)${NC}"
        echo -n "    - Número de clases @apply: "
        grep -c "@apply" src/app/index.css
    else
        echo -e "${GREEN}✓ No${NC}"
    fi
else
    echo -e "${RED}✗ No encontrado${NC}"
fi

echo ""
echo -e "${BLUE}📦 DEPENDENCIAS ACTUALES${NC}"
echo ""

echo "Tailwind y plugins:"
if command -v npm &> /dev/null; then
    npm list tailwindcss 2>/dev/null | grep tailwindcss || echo "  tailwindcss: No instalado"
    npm list @tailwindcss/typography 2>/dev/null | grep @tailwindcss/typography || echo "  @tailwindcss/typography: No instalado"
    npm list tailwindcss-animate 2>/dev/null | grep tailwindcss-animate || echo "  tailwindcss-animate: No instalado"
    npm list autoprefixer 2>/dev/null | grep autoprefixer || echo "  autoprefixer: No instalado"
    npm list postcss 2>/dev/null | grep postcss || echo "  postcss: No instalado"
fi

echo ""
echo -e "${GREEN}✅ PREPARACIÓN COMPLETADA${NC}"
echo ""
echo "Siguiente paso: Ejecutar 'npx @tailwindcss/upgrade' para migración automática"
echo "o continuar con migración manual según el plan establecido."
echo ""
