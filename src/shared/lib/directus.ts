import { createDirectus, rest } from '@directus/sdk';
import { DIRECTUS_URL } from '@/shared/lib/config';

const directus = createDirectus(DIRECTUS_URL).with(rest());

console.log('Directus SDK initialized:', directus);
export default directus;

