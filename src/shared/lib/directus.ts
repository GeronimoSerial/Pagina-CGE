import { createDirectus, rest } from '@directus/sdk';
import { DIRECTUS_URL } from '@/shared/lib/config';

const directus = createDirectus(DIRECTUS_URL).with(rest());

export default directus;

