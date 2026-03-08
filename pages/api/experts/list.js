export default async function handler(req, res) {
  // In a live app, you would use: const { data } = await supabase.from('experts').select('*')
  // For now, we use this dynamic-ready structure:
  const experts = [
    { 
      id: "exp_001", 
      name: "Acharya Sharma", 
      role: "astrologer",
      specialty: "Vedic & KP Specialist", 
      rate: 2.00, 
      image: "https://i.pravatar.cc/150?u=sharma", 
      isVerified: true,
      metrics: { reviews: 1240, rating: 4.9 },
      isLive: true
    },
    { 
      id: "exp_002", 
      name: "Dr. Pallavi", 
      role: "astrologer",
      specialty: "Nakshatra Expert", 
      rate: 1.50, 
      image: "https://i.pravatar.cc/150?u=pallavi", 
      isVerified: true,
      metrics: { reviews: 890, rating: 4.8 },
      isLive: true
    }
  ];

  res.status(200).json({ experts });
}
