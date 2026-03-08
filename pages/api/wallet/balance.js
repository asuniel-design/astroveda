export default function handler(req, res) {
  // Mock wallet balance until User model is wired
  const { userId } = req.query;
  res.status(200).json({
    userId: userId || 'user1',
    balance: 1450,
    currency: 'INR',
    freeUsed: false,
  });
}