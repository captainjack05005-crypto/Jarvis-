// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

const apiConfig: ApiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default apiConfig;
