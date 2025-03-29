// Utilidades para gestionar las llamadas a la API
import { API_BASE_URL, ENDPOINTS, getApiUrl } from './config';

// Función para obtener los headers de autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Función para realizar peticiones a la API con autenticación
export const fetchWithAuth = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `Error ${response.status}: ${response.statusText}`,
      }));
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
};

// Funciones específicas para cada tipo de petición
export const apiGet = (endpoint) => fetchWithAuth(endpoint, { method: 'GET' });

export const apiPost = (endpoint, data) => fetchWithAuth(endpoint, {
  method: 'POST',
  body: JSON.stringify(data),
});

export const apiPut = (endpoint, data) => fetchWithAuth(endpoint, {
  method: 'PUT',
  body: JSON.stringify(data),
});

export const apiDelete = (endpoint) => fetchWithAuth(endpoint, { method: 'DELETE' });