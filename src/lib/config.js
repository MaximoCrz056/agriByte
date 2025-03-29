// Configuración de la aplicación

// Determinar el entorno actual
const isProduction = process.env.NODE_ENV === 'production';

// URL base de la API según el entorno
export const API_BASE_URL = isProduction 
  ? 'https://api.agribyte.com' // URL de producción (cambiar por la URL real en producción)
  : 'http://localhost:5000';

// Endpoints de la API
export const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  USERS: '/api/users',
  GREENHOUSES: '/api/greenhouses',
  DEVICES: '/api/devices',
  SENSOR_DATA: '/api/sensordata',
  PROFILE: '/api/auth/profile',
  CONTROL: '/api/control',
};

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Configuración de JWT
export const JWT_CONFIG = {
  TOKEN_KEY: 'token', // Clave para almacenar el token en localStorage
  USER_KEY: 'user', // Clave para almacenar la información del usuario
  EXPIRATION: '1d', // Tiempo de expiración del token
};

// Otras configuraciones
export const APP_CONFIG = {
  APP_NAME: 'AgriByte',
  VERSION: '1.0.0',
};