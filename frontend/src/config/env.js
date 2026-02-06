export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Portal Multas Banco ANEUPI',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '4.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development',
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true',
};
