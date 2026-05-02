import axios from 'axios';

// Creamos la instancia de axios con la URL de tu servidor de la U
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Se ejecuta antes de CADA petición que hagas al backend
// ... (parte de arriba del archivo igual)

api.interceptors.request.use(
  (config) => {
    // 1. CAMBIO AQUÍ: Usamos la clave que vimos en tu LocalStorage
    const authData = localStorage.getItem('ethoshub_auth'); 
    
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        // 2. CAMBIO AQUÍ: Según tu estructura de Zustand, el token está en state.token
        const token = parsed.state?.token; 

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error al obtener el token del LocalStorage', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;