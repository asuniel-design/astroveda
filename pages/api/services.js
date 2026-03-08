export default async function handler(req, res) {
  res.status(200).json({
    services: [
      { id: 1, name: 'Horoscope', icon: '♈', description: 'Daily & yearly predictions', route: '/horoscope' },
      { id: 2, name: 'Kundli Matching', icon: '💑', description: 'Marriage compatibility', route: '/kundli' },
      { id: 3, name: 'Career Guidance', icon: '📈', description: 'Professional insights', route: '/career' },
      { id: 4, name: 'Tarot Reading', icon: '🃏', description: 'Card-based guidance', route: '/tarot' },
    ]
  });
}