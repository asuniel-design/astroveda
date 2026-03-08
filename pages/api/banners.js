export default async function handler(req, res) {
  // Return mock banners (Banner model not in current schema)
  res.status(200).json({
    banners: [
      { id: 1, title: 'Mercury Retrograde Alert', subtitle: 'Special guidance available now', cta_text: 'Talk to Expert', cta_link: '/marketplace', is_active: true },
      { id: 2, title: 'First Chat Free', subtitle: 'Connect with a verified astrologer today', cta_text: 'Start Now', cta_link: '/', is_active: true },
    ]
  });
}