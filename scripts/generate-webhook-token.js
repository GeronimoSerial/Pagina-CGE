#!/usr/bin/env node

/**
 * Script para generar un token seguro para el webhook de revalidación
 * Uso: node generate-webhook-token.js
 */

const crypto = require('crypto');

function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

function generateHexToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('🔐 Generador de tokens para webhook');
console.log('=====================================\n');

const base64Token = generateSecureToken();
const hexToken = generateHexToken();

console.log('Token Base64 (recomendado):');
console.log(`REVALIDATE_SECRET_TOKEN=${base64Token}\n`);

console.log('Token Hexadecimal (alternativo):');
console.log(`REVALIDATE_SECRET_TOKEN=${hexToken}\n`);

console.log('📋 Cómo usar:');
console.log('1. Copia uno de los tokens generados');
console.log('2. Agrégalo a tu archivo .env.local:');
console.log('   REVALIDATE_SECRET_TOKEN=el_token_que_copiaste');
console.log('3. Configúralo en Directus como header:');
console.log('   Authorization: Bearer el_token_que_copiaste');
console.log('\n✅ ¡Mantén este token seguro y nunca lo compartas públicamente!');
