import axios from 'axios';

const TMDB_API_KEY = 'f0526715e08ed40a48f706e86577ae6d';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const tmdb = {
  getImageUrl: (path, size = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
  },

  handleImageError: (e) => {
    e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
    e.target.onerror = null;
  },

  getPopular: async (page = 1) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: { api_key: TMDB_API_KEY, page },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return { results: [] };
    }
  },

  getTrending: async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
        params: { api_key: TMDB_API_KEY },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      return { results: [] };
    }
  },

  getMovieDetails: async (id) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
        params: {
          api_key: TMDB_API_KEY,
          append_to_response: 'credits,videos'
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  searchMovies: async (query) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: { api_key: TMDB_API_KEY, query },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      return { results: [] };
    }
  },

  getGenres: async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: { api_key: TMDB_API_KEY },
        timeout: 10000
      });
      return response.data.genres;
    } catch (error) {
      return [];
    }
  }
};