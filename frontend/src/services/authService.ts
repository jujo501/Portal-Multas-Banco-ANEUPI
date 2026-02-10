import api from './api';

export const authService = {
  
  login: async (credentials: any) => {
    try {
      console.log("Enviando credenciales:", credentials);
      
      const response = await api.post('/auth/login', credentials);
      
      console.log("Respuesta del servidor:", response);

      
      if (response.status === 200 && response.data) {
        
        localStorage.setItem('usuario', JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }

    } catch (error: any) { 
      console.error("Error en authService:", error);
      
      
      const mensajeError = error.response?.data?.error || "Error al conectar con el servidor";
      throw new Error(mensajeError);
    }
  },

  logout: () => {
    localStorage.removeItem('usuario');
    window.location.reload();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  }
};