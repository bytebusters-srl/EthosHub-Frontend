const API_BASE_URL = ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

async function requestWithAuth<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ethoshub_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  console.log(`[Frontend] Enviando ${options.method || 'GET'} a: ${API_BASE_URL}${path}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  
  console.log(`[Frontend] El servidor respondió: ${response.status} ${response.statusText}`);

  // SOLUCIÓN AL CRASHEO DE REACT: 
  // SpringBoot devuelve 201 (Created) o 204 (No Content) sin cuerpo JSON.
  if (response.status === 204 || response.status === 201) {
    return {} as T; 
  }
  
  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}`);
  }
  
  return response.json();
}

export const experienceService = {
  getExperiences: async (userId: string) => {
    const data = await requestWithAuth<any[]>(`/api/v1/profiles/${userId}/experiences`, { method: 'GET' });
    
    return data.map(exp => ({
      id: exp.workExperienceId,
      userId: userId,
      companyName: exp.companyName,
      jobTitle: exp.jobTitle,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      description: exp.description || '',
      location: '', 
      technologies: [], 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  },

  addExperience: async (userId: string, data: any) => {
    // SOLUCIÓN AL ERROR SILENCIOSO DE JAVA:
    // Convertimos explícitamente cualquier campo vacío de fecha a un "null" real.
    const payload = {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      description: data.description,
      isCurrent: data.isCurrent,
      isFreelance: false,
      companyUrl: null, 
      startDate: data.startDate || null,
      endDate: (data.isCurrent || !data.endDate) ? null : data.endDate
    };

    console.log("[Frontend] Payload preparado para Java:", payload);

    return requestWithAuth(`/api/v1/profiles/${userId}/experiences`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateExperience: async (userId: string, expId: string, data: any) => {
    const payload = {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      description: data.description,
      isCurrent: data.isCurrent,
      isFreelance: false,
      companyUrl: null,
      startDate: data.startDate || null,
      endDate: (data.isCurrent || !data.endDate) ? null : data.endDate
    };

    return requestWithAuth(`/api/v1/profiles/${userId}/experiences/${expId}`, {
      method: 'PUT', 
      body: JSON.stringify(payload),
    });
  },

  deleteExperience: async (userId: string, expId: string) => {
    return requestWithAuth(`/api/v1/profiles/${userId}/experiences/${expId}`, {
      method: 'DELETE', 
    });
  }
};