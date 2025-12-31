import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Get settings data (for hero, about, contact, social)
export const getSettings = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.settings);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

// Get homepage data
export const getHomepageData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.homepage);
    return response.data;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error;
  }
};

// Get products list
export const getProducts = async (params = {}) => {
  try {
    const response = await axios.get(API_ENDPOINTS.products, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get single product by slug
export const getProductBySlug = async (slug) => {
  try {
    const response = await axios.get(API_ENDPOINTS.products, {
      params: { action: 'detail', slug }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Get categories
export const getCategories = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.categories);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Search products
export const searchProducts = async (query) => {
  try {
    const response = await axios.get(API_ENDPOINTS.products, {
      params: { search: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Get articles list
export const getArticles = async (params = {}) => {
  try {
    const response = await axios.get(API_ENDPOINTS.articles, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

// Get single article by slug
export const getArticleBySlug = async (slug) => {
  try {
    const response = await axios.get(API_ENDPOINTS.articles, {
      params: { action: 'detail', slug }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};
