import { apiClient } from './apiClient'; 
import { WorkExperience } from '../types/experience';

const ROUTE = '/api/v1/work-experiences';

export const experienceService = {
  getExperiences: async (userId: string): Promise<WorkExperience[]> => {
    const response = await apiClient.get(`${ROUTE}/user/${userId}`);
    return response.data;
  },
  
  addExperience: async (userId: string, data: Partial<WorkExperience>): Promise<string> => {
    // Inyectamos el userId en el payload
    const response = await apiClient.post(ROUTE, { ...data, userId });
    return response.data;
  },

  updateExperience: async (userId: string, id: string, data: Partial<WorkExperience>): Promise<void> => {
    // Inyectamos el userId en el payload
    await apiClient.put(`${ROUTE}/${id}`, { ...data, userId });
  },

  deleteExperience: async (userId: string, id: string): Promise<void> => {
    // IMPORTANTE: Tu front tiene un botón de eliminar. 
    // Asegúrate de crear este endpoint en tu controlador de Spring Boot después.
    await apiClient.delete(`${ROUTE}/${id}`);
  }
};