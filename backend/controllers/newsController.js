import News from '../models/News.js';
import { fetchCombinedNews } from '../services/newsFetcher.js';
import { detectFakeNews } from '../services/aiService.js';

// @desc    Get all news articles with filtering
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res) => {
  try {
    const { category, prediction, search } = req.query;
    
    // Build query object based on query params
    let query = {};
    if (category && category !== 'all' && category !== 'general') {
      query.category = { $regex: new RegExp(category, 'i') };
    }
    if (prediction && prediction !== 'all') {
      query.prediction = prediction;
    }
    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { content: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const news = await News.find(query).sort({ publishedAt: -1 }).limit(50);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh news from external API and running AI model
// @route   POST /api/news/refresh
// @access  Public
export const refreshNews = async (req, res) => {
  try {
    const category = req.body.category || 'general';
    const fetchedArticles = await fetchCombinedNews(category);
    
    const newArticlesAdded = [];

    for (let articleData of fetchedArticles) {
      const exists = await News.findOne({ url: articleData.url });
      if (!exists) {
        
        const newNews = await News.create({
          ...articleData,
          prediction: 'Real',
          confidenceScore: 100,
          reason: 'Auto-verified from Trusted NewsAPI',
          category: category,
        });
        
        newArticlesAdded.push(newNews);
      }
    }

    res.status(201).json({ 
      message: `Successfully fetched and analyzed ${newArticlesAdded.length} new articles.`, 
      newArticles: newArticlesAdded 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyManualNews = async (req, res) => {
  try {
    const { url } = req.body;
    let base64Image = null;
    let textContent = null;

    if (req.file) {
      base64Image = req.file.buffer.toString('base64');
    } else if (url) {
      const axios = (await import('axios')).default;
      const cheerio = await import('cheerio');
      
      const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const $ = cheerio.load(response.data);
      textContent = $('p').map((i, el) => $(el).text()).get().join(' ').substring(0, 5000);
      
      if (!textContent || textContent.trim().length < 50) {
        return res.status(400).json({ message: 'Could not extract sufficient text from the provided URL.' });
      }
    } else {
      return res.status(400).json({ message: 'Must provide either an image file or a URL.' });
    }

    const { verifyManualContent } = await import('../services/aiService.js');
    const result = await verifyManualContent({ textContent, base64Image });
    
    res.json(result);
  } catch (error) {
    console.error('verifyManualNews error:', error.message);
    res.status(500).json({ message: 'Failed to verify content: ' + error.message });
  }
};
