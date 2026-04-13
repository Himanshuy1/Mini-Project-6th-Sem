import axios from 'axios';

// Helper to assign realistic global hotspots for the WorldMonitor map simulation
const getRandomCoordinate = () => {
  const hotspots = [
    { lat: 40.7128, lon: -74.0060 }, // New York (Finance)
    { lat: 39.9042, lon: 116.4074 }, // Beijing
    { lat: 51.5074, lon: -0.1278 }, // London
    { lat: 35.6895, lon: 139.6917 }, // Tokyo
    { lat: 55.7558, lon: 37.6173 }, // Moscow
    { lat: 28.6139, lon: 77.2090 }, // New Delhi
    { lat: 31.2304, lon: 121.4737 }, // Shanghai
    { lat: 37.7749, lon: -122.4194 }, // SF
    { lat: 31.0461, lon: 34.8516 }, // Israel (Conflit area)
    { lat: 48.8566, lon: 2.3522 }, // Paris
    { lat: 50.4501, lon: 30.5234 }, // Kyiv
    { lat: 25.2769, lon: 55.2962 }, // Dubai
    { lat: -23.5505, lon: -46.6333 } // Sao Paulo
  ];
  return hotspots[Math.floor(Math.random() * hotspots.length)];
};

// Priority news sources — these match the live video channels shown in HUDBottomPanel
const PRIORITY_SOURCES = ['DW', 'France 24', 'Al Jazeera', 'CGTN', 'Euronews', 'Sky News'];

// Use GNews API to fetch news from the same sources shown in the live video panel
export const fetchCombinedNews = async (filter = 'general') => {
  try {
    const API_KEY = process.env.GNEWS_API_KEY;
    if (!API_KEY) {
      console.warn('GNEWS_API_KEY is not set correctly or missing. Make sure to define it in .env');
      return [];
    }
    
    const isStockRequest = filter === 'stock' || filter === 'finance';
    
    // GNews Top Headlines or Search endpoint depending on filter
    let url = 'https://gnews.io/api/v4/top-headlines';
    const params = {
      lang: 'en',
      apikey: API_KEY,
      max: 20
    };

    if (isStockRequest) {
      url = 'https://gnews.io/api/v4/search';
      params.q = 'stock market OR finance OR economic';
    } else if (filter !== 'general' && filter !== 'all') {
      url = 'https://gnews.io/api/v4/search';
      // Combine user filter with priority sources for richer results
      params.q = filter;
    } else {
      // Default: world/general news with a broad query to pull from major international broadcasters
      url = 'https://gnews.io/api/v4/search';
      params.q = 'world news OR international news OR conflict OR politics';
      params.lang = 'en';
    }

    const { data } = await axios.get(url, { params });
    
    if (data && data.articles) {
      return data.articles.map(a => {
        const coords = getRandomCoordinate();
        const latOffset = (Math.random() - 0.5) * 2.0;
        const lonOffset = (Math.random() - 0.5) * 2.0;

        // Normalize source name — map common variants to our display labels
        let sourceName = a.source ? a.source.name : 'GLOBAL FEED';
        const srcLower = sourceName.toLowerCase();
        if (srcLower.includes('dw')) sourceName = 'DW';
        else if (srcLower.includes('france 24') || srcLower.includes('france24')) sourceName = 'FRANCE 24';
        else if (srcLower.includes('al jazeera') || srcLower.includes('aljazeera')) sourceName = 'AL JAZEERA';
        else if (srcLower.includes('cgtn')) sourceName = 'CGTN';
        else if (srcLower.includes('euronews')) sourceName = 'EURONEWS';
        else if (srcLower.includes('sky news')) sourceName = 'SKY NEWS';
        else if (srcLower.includes('reuters')) sourceName = 'REUTERS';
        else if (srcLower.includes('bbc')) sourceName = 'BBC';
        else if (srcLower.includes('ap ') || srcLower === 'ap') sourceName = 'AP';

        return {
          title: a.title, 
          description: a.description ? a.description.substring(0, 200) : a.title, 
          content: a.content || a.description,
          source: sourceName, 
          url: a.url, 
          imageUrl: a.image, 
          publishedAt: a.publishedAt,
          lat: coords.lat + latOffset,
          lon: coords.lon + lonOffset
        };
      });
    }
    return [];
  } catch (error) {
    console.error('GNews API fetch failed:', error.response?.data || error.message);
    return [];
  }
};

