
export const getNews = async (req, res) => {
    const searchQuery = req.query.q || 'india';
    const API_KEY = process.env.NEWS_API_KEY;
  
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${API_KEY}`);
      const data = await response.json();
      res.json(data.articles.slice(0, 10)); // Send top 10 articles
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  };