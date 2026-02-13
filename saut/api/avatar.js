// api/avatar.js
export default async (req, res) => {
  const { id, ext, ua } = req.query;
  
  if (!id || !ext) {
    return res.status(400).json({ error: 'Missing id or ext parameter' });
  }

  // Используем ПК-User-Agent
  const userAgent = ua === 'desktop' 
    ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 18.5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
  
  try {
    // Запрос к серверу Лолилэнда
    const response = await fetch(
      `https://loliland.net/apiv2/user/avatar/medium/${id}.${ext}`,
      {
        headers: {
          'User-Agent': userAgent,
          'Origin': 'https://loliland.net',
          'Referer': 'https://loliland.net/ru/team',
          'Accept': 'image/webp,image/png,image/jpeg,image/gif,*/*'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    // Получаем изображение как буфер
    const buffer = await response.arrayBuffer();
    
    // Устанавливаем правильный Content-Type
    const contentType = response.headers.get('content-type') || 'image/png';
    res.setHeader('Content-Type', contentType);
    
    // Отправляем изображение
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch avatar' });
  }
};