import { useContext, useEffect, useCallback } from 'react';
import { NewsContext } from '../context/NewsContext';
import { getNews } from '../services/newsService';

export const useFetchNews = () => {
  const { setNews, setLoading, setError, filters } = useContext(NewsContext);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNews(filters);
      setNews(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, setNews, setLoading, setError]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { fetchNews };
};
