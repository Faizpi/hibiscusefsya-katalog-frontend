// API Configuration - v2 Fixed CORS
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.hibiscusefsya.com';

export const API_ENDPOINTS = {
  homepage: `${API_BASE_URL}/homepage.php`,
  products: `${API_BASE_URL}/products.php`,
  categories: `${API_BASE_URL}/categories.php`,
  settings: `${API_BASE_URL}/settings.php`,
  articles: `${API_BASE_URL}/articles.php`,
};

export default API_BASE_URL;
