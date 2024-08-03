const API_BASE_URL = 'http://localhost:5000'; 

export const fetchNews = async () => {
  const response = await fetch(`${API_BASE_URL}/news`);
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  return response.json();
};
