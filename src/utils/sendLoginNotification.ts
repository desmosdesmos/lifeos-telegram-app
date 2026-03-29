interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export async function sendLoginNotification(user: TelegramUser) {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const adminId = import.meta.env.VITE_TELEGRAM_ADMIN_ID;

  if (!botToken || !adminId) {
    console.warn('Telegram bot credentials not configured');
    return;
  }

  const now = new Date();
  const moscowTime = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(now);

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const username = user.username ? `@${user.username}` : '';

  const message = `
🔔 *Новый вход в приложение*

👤 *Пользователь:* ${fullName} ${username}
🆔 *ID:* ${user.id}
🌐 *Язык:* ${user.language_code || 'N/A'}
📅 *Время:* ${moscowTime}
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API error:', error);
    } else {
      console.log('Login notification sent successfully');
    }
  } catch (error) {
    console.error('Failed to send login notification:', error);
  }
}
