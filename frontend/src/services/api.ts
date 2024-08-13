import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://news-genie.onrender.com'
    : 'http://127.0.0.1:10000';

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
          'Access-Control-Allow-Credentials': 'true'
        },
        timeout: 30000
      }
    );

    console.log('API response:', response.data);

    if (!response.data || !Array.isArray(response.data.news_items)) {
      throw new Error('Invalid response format');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        throw new Error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error(
          'No response received from the server. Please check your internet connection and try again.'
        );
      }
      throw new Error(
        `Network error: ${error.message}. Please check your internet connection and try again.`
      );
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred. Please try again later.');
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
