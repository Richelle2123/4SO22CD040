const API_BASE_URL = 'http://20.244.56.144/evaluation-service/stocks'; 
const API_TOKEN = 'your-api-token';

const fetchWithCache = async (url, cacheKey, cacheDuration = 60000) => {
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(`${cacheKey}_time`);

  if (cachedData && cachedTime && Date.now() - cachedTime < cacheDuration) {
    return JSON.parse(cachedData);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) throw new Error('API request failed');

  const data = await response.json();
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(`${cacheKey}_time`, Date.now());
  return data;
};

export const getStocks = async () => {
  return fetchWithCache(`${API_BASE_URL}/stocks`, 'stocks');
};

export const getStockHistory = async (ticker, minutes) => {
  return fetchWithCache(
    `${API_BASE_URL}/stocks/${ticker}/history?minutes=${minutes}`,
    `history_${ticker}_${minutes}`,
    30000 // Cache for 30 seconds to balance freshness and cost
  );
};

export const getCorrelation = async (minutes) => {
  return fetchWithCache(
    `${API_BASE_URL}/stocks/correlation?minutes=${minutes}`,
    `correlation_${minutes}`,
    60000 // Cache for 60 seconds
  );
};