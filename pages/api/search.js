import { searchAllContent } from '../../lib/api';

export default function handler(req, res) {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }
  
  const results = searchAllContent(q);
  res.status(200).json(results);
}