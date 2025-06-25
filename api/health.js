export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Server is running', 
    database: 'Cloud Database',
    timestamp: new Date().toISOString()
  });
} 