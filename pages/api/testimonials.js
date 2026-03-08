export default async function handler(req, res) {
  res.status(200).json({
    testimonials: [
      { id: 1, name: 'Priya Mehta', rating: 5, review: 'Pandit Sharma predicted my job change within 3 months. Absolutely accurate!', is_featured: true },
      { id: 2, name: 'Rajesh Kumar', rating: 5, review: 'The remedies transformed my financial situation. Highly recommend.', is_featured: true },
    ]
  });
}