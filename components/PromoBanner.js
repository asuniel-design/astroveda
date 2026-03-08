import { useState, useEffect, useRef } from 'react';

export default function PromoBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchBanners();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data.banners || []);
      }
    } catch (err) {
      console.error('Failed to fetch banners:', err);
      // Fallback banners
      setBanners([
        {
          id: 'fallback-1',
          title: 'Talk to India\'s Best Astrologers',
          subtitle: 'Get accurate predictions for love, career, and health',
          cta_text: 'Chat Now',
          cta_link: '/marketplace',
          background_color: '#0F172A',
        },
        {
          id: 'fallback-2',
          title: 'First Chat FREE',
          subtitle: 'Experience our platform with a free consultation',
          cta_text: 'Start Consultation',
          cta_link: '/marketplace?free=true',
          background_color: '#1E293B',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Auto-rotate every 5 seconds
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-48 bg-white/[0.04] rounded-2xl animate-pulse" />
    );
  }

  if (banners.length === 0) {
    return null; // Don't render if no banners
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="w-full relative overflow-hidden rounded-2xl mb-8">
      <div
        className="transition-all duration-500 ease-in-out"
        style={{
          backgroundColor: currentBanner.background_color || '#0F172A',
          padding: '2rem',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {currentBanner.title}
            </h2>
            {currentBanner.subtitle && (
              <p className="text-white/80 text-lg mb-6">
                {currentBanner.subtitle}
              </p>
            )}
            <a
              href={currentBanner.cta_link}
              className="inline-block px-6 py-3 bg-saffron text-black font-bold rounded-xl hover:bg-saffron-500 transition-colors"
            >
              {currentBanner.cta_text}
            </a>
          </div>
          {currentBanner.image_url && (
            <div className="md:w-1/3">
              <img
                src={currentBanner.image_url}
                alt={currentBanner.title}
                className="rounded-lg max-h-48"
              />
            </div>
          )}
        </div>
      </div>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-saffron w-6'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() =>
              goToSlide((currentIndex - 1 + banners.length) % banners.length)
            }
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={() =>
              goToSlide((currentIndex + 1) % banners.length)
            }
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}