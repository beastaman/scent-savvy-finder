const config = {
  development: {
    API_BASE_URL: 'http://localhost:3002'
  },
  production: {
    API_BASE_URL: 'https://your-render-service.onrender.com'
  }
};

const environment = import.meta.env.MODE || 'development';
export const API_CONFIG = config[environment];