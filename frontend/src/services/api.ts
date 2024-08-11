import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://news-genie.onrender.com'  // Update this with your actual production URL
    : 'http://127.0.0.1:5001';  // Changed port to 5001

export const fetchNews = async (topic: string, userContext: string = '') => {
  console.log('Attempting to fetch news from:', `${API_BASE_URL}/api/fetch_news`);
  console.log('With payload:', { topic, user_context: userContext });

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/fetch_news`,
      {
        topic,
        user_context: userContext
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 30000, // Increased to 30 seconds timeout
      }
    );

    console.log('API response:', response.data);

    if (!response.data || !response.data.news_summaries) {
      throw new Error('Invalid response format');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      console.error('Error config:', error.config);
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
      }
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      throw new Error(`Axios error: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`, { withCredentials: true });
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Error checking backend health:', error);
    return false;
  }
};

export default API_BASE_URL;