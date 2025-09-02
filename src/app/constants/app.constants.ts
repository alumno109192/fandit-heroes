// Constantes centralizadas para aplicar Clean Code
export const API_CONSTANTS = {
  MARVEL: {
    BASE_URL: 'https://gateway.marvel.com/v1/public',
    ENDPOINTS: {
      CHARACTERS: '/characters',
      SERIES: '/series',
      COMICS: '/comics'
    },
    DEFAULT_LIMITS: {
      HEROES: 20,
      SERIES: 10,
      COMICS: 20
    },
    TIMEOUTS: {
      DEFAULT: 10000,
      SEARCH: 5000
    }
  }
} as const;

export const UI_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    DEBOUNCE_TIME: 300
  },
  IMAGES: {
    PLACEHOLDER: '/assets/hero-placeholder.jpg',
    FALLBACK: '/assets/marvel-logo.png'
  },
  LOADING: {
    DELAY_MS: 500
  }
} as const;

export const ERROR_MESSAGES = {
  API: {
    NOT_AVAILABLE: 'Marvel API no está disponible actualmente',
    NETWORK_ERROR: 'Error de conexión. Verificar conexión a internet',
    TIMEOUT: 'La solicitud ha expirado. Intente nuevamente',
    UNAUTHORIZED: 'Error de autenticación con Marvel API',
    NOT_FOUND: 'Recurso no encontrado',
    GENERIC: 'Error inesperado. Intente nuevamente'
  },
  DATA: {
    NO_HEROES_FOUND: 'No se encontraron héroes',
    NO_SERIES_FOUND: 'No se encontraron series',
    INVALID_ID: 'ID de héroe inválido',
    EMPTY_SEARCH: 'Ingrese un término de búsqueda'
  }
} as const;

export const SUCCESS_MESSAGES = {
  DATA: {
    HEROES_LOADED: 'Héroes cargados exitosamente',
    SERIES_LOADED: 'Series cargadas exitosamente',
    SEARCH_COMPLETED: 'Búsqueda completada'
  },
  MODE: {
    SWITCHED_TO_MOCK: 'Cambiado a modo Mock',
    SWITCHED_TO_API: 'Cambiado a modo API'
  }
} as const;

export const MOCK_IDS = [
  1009368, // Iron Man
  1009610, // Spider-Man
  1009220, // Captain America
  1009664, // Thor
  1009351, // Hulk
  1009189, // Black Widow
  1009262, // Daredevil
  1009282, // Doctor Strange
  1009718, // Wolverine
  1009146  // Abomination
] as const;

export const ROUTE_PATHS = {
  HOME: '',
  HERO_DETAIL: 'hero',
  NOT_FOUND: '**'
} as const;

// Configuraciones de environment
export const ENV_CONFIG = {
  DEVELOPMENT: {
    DEBUG: true,
    API_TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
  },
  PRODUCTION: {
    DEBUG: false,
    API_TIMEOUT: 5000,
    RETRY_ATTEMPTS: 1
  }
} as const;
