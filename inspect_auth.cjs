const betterAuth = require('better-auth');
console.log(Object.keys(betterAuth));
try {
  const utils = require('better-auth/utils');
  console.log('Utils:', Object.keys(utils));
} catch (e) {
  console.log('No utils');
}
try {
  const crypto = require('better-auth/crypto');
  console.log('Crypto:', Object.keys(crypto));
} catch (e) {
  console.log('No crypto');
}
