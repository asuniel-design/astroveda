import { useState, useEffect, useRef } from 'react';

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchTestimonials();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?featured=true');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      // Fallback testimonials
      setTestimonials([
        {
          id: 'fallback-1',
          name: 'Rahul Verma',
          rating: 5,
          review: 'Jyotish Patel helped me make a crucial career decision. His guidance was spot on!',
          avatar: '',
        },
        {
          id: 'fallback-2',
          name: 'Priya Singh',
          rating: 5,
          review: 'The compatibility report saved my marriage. Highly recommended!',
          avatar: '',
        },
        {
          id: 'fallback-3',
          name: 'Amit Patel',
          rating: 4,
          review: 'Great platform, easy to use, and astrologers are genuine.',
          avatar: '',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testimonials.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 8000); // Rotate every 8 seconds
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 8000);
    }
  };

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">What Our Users Say</h2>
        <div className="bg-white/[0.04] rounded-2xl p-8 animate-pulse h-64" />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">What Our Users Say</h2>
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/4 mb-6 md:mb-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron-400/25 to-saffron-400/5 flex items-center justify-center text-2xl font-bold text-saffron mb-4">
              {currentTestimonial.avatar ? (
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                currentTestimonial.name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {currentTestimonial.name}
              </h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < currentTestimonial.rating
                        ? 'text-saffron'
                        : 'text-white/20'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="md:w-3/4">
            <p className="text-white/80 text-lg italic">
              "{currentTestimonial.review}"
            </p>
          </div>
        </div>

        {/* Indicators */}
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-saffron w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}