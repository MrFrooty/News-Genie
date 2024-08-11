const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://news-genie.onrender.com'
    : 'http://127.0.0.1:5000';

export const fetchNews = async () => {
  const response = await fetch(`${API_BASE_URL}/news`);
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  return response.json();
};

export default API_BASE_URL;
