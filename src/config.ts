export const siteConfig = {
  name: 'Fuerte de Coquimbo',
  baseUrl: 'https://fuertelambert.com',
  locales: ['es', 'en', 'zh', 'arn'] as const,
};

export const ogLocale: Record<string, string> = {
  es: 'es_CL',
  en: 'en_US',
  zh: 'zh_CN',
  arn: 'arn',
};

/**
 * Opening hours in one place. The human-readable string and the schema.org
 * OpeningHoursSpecification are both derived from these two values, so the
 * structured data can never drift from what the page says.
 */
const opensAt = '10:00';
const closesAt = '20:00';
const openDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Single-attraction SEO entity binding.
 * All values below describe the exact same physical place as the Google
 * Business Profile / Google Maps listing, so name + address (NAP) stay
 * fully consistent across the site and structured data.
 */
export const attraction = {
  domain: 'fuertelambert.com',
  baseUrl: 'https://fuertelambert.com',

  // Entity names
  fullName: 'Fuerte de Coquimbo',
  shortName: 'Fuerte Lambert',
  alsoKnownAs: ['Fuerte Lambert', 'Fuerte Lambert Coquimbo', 'Coquimbo Fuerte de Coquimbo'],

  // NAP (name / address) — must match the Google Maps listing byte for byte
  streetAddress: 'Camino Al Fuerte 20',
  city: 'Coquimbo',
  state: 'Región de Coquimbo',
  country: 'Chile',
  countryCode: 'CL',
  postalCode: '1780000',
  plusCode: '3M87+8H Coquimbo, Chile',

  // Coordinates (Google Maps)
  latitude: -29.9341853,
  longitude: -71.3360829,

  // Maps
  mapsShareUrl: 'https://maps.app.goo.gl/KrnqyUTirGDCBaVTA',
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6145.296224683086!2d-71.3360829!3d-29.9341853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691c84b4440e13b%3A0x4acc655af9ffae8e!2sFuerte%20de%20Coquimbo!5e1!3m2!1szh-CN!2sus!4v1789097607029!5m2!1szh-CN!2sus',

  // Nearby semantic cluster
  nearbyLandmarks: ['Cruz del Tercer Milenio', 'Puerto de Coquimbo'],

  // Authoritative outbound reference (government / official tourism)
  govtTourismUrl: 'https://www.sernatur.cl/region/coquimbo/',
  govtTourismName: 'SERNATUR Región de Coquimbo',

  // Opening hours
  openingHours: `Mo-Su ${opensAt}-${closesAt}`,
  opensAt,
  closesAt,
  openDays,

  // Analytics
  ga4Id: 'G-HXM22WWPKP',

  // Social / schema imagery
  heroImage: '/gallery/fuerte-de-coquimbo-1.jpg',
  heroImageWebp: '/gallery/fuerte-de-coquimbo-1.webp',
  ogImage: '/og-image.jpg',
  schemaImages: [
    'https://fuertelambert.com/gallery/fuerte-de-coquimbo-1.jpg',
    'https://fuertelambert.com/gallery/fuerte-de-coquimbo-2.jpg',
    'https://fuertelambert.com/gallery/fuerte-de-coquimbo-3.jpg',
  ],

  // Aggregate rating shown on the page (source: Google Maps)
  ratingValue: 4.5,
  reviewCount: 5108,
};

export default attraction;
