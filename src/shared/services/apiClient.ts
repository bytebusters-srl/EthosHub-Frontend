import axios from 'axios';

// 1. Manejo seguro de la URL base
// Utilizamos el operador 'as string' para forzar a TypeScript a entender
// que esto será una cadena, o le damos un valor por defecto.
// Si import.meta.env sigue marcando error visual, puedes ignorarlo temporalmente
// en este único archivo con un comentario // @ts-ignore, aunque lo ideal es que
// tsconfig lo reconozca.

// @ts-ignore (Solo si tu editor sigue molestando, quítalo si no es necesario)
const baseURL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

// 2. Crear la instancia de Axios
export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Opcional: Interceptor para añadir el token automáticamente si lo usas
/*
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // O donde guardes tu token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/