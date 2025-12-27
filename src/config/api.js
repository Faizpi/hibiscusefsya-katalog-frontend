// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.hibiscusefsya.com/api';

export const API_ENDPOINTS = {
  homepage: `${API_BASE_URL}/homepage.php`,
  products: `${API_BASE_URL}/products.php`,
  categories: `${API_BASE_URL}/categories.php`,
  settings: `${API_BASE_URL}/settings.php`,
};

export default API_BASE_URL;
