// api/loliland-profile.js
export default async function handler(req, res) {
  const { login } = req.query;

  if (!login) {
    return res.status(400).json({ error: 'Параметр login обязателен' });
  }

  try {
    const searchRes = await fetch(`https://loliland.ru/apiv2/user/search?login=${encodeURIComponent(login)}`);
    const data = await searchRes.json();

    if (!data.users || data.users.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const user = data.users[0];
    const userId = user.id;

    // Возвращаем только нужное
    res.status(200).json({
      displayName: user.displayName || login,
      userId: userId,
      role: "Старший Модератор" // или можно вынести в параметр, если нужно
    });
  } catch (err) {
    console.error('Ошибка при запросе к LoliLand API:', err);
    res.status(500).json({ error: 'Не удалось получить данные' });
  }
}
