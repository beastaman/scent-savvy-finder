import { API_CONFIG } from '../config/api.js';

const BASE_URL = API_CONFIG.API_BASE_URL;

export const searchFragrances = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams({
      q: query,
      ...filters
    });

    const response = await fetch(`${BASE_URL}/api/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

export const getTrendingSearches = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/trending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Trending API error:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: error.message };
  }
};