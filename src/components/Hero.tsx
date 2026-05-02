import { useState, useEffect } from 'react';
import { MapPin, Star, Users, Award } from 'lucide-react';

interface HeroProps {
  onSelectDestination: () => void;
}

const slides = [
  {
    image: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
    title: 'Discover Incredible India',
    subtitle: 'From Himalayan peaks to tropical coasts',
  },
  {
    image: 'https://images.pexels.com/photos/1007431/pexels-photo-1007431.jpeg',
    title: 'Desert Sands & Royal Palaces',
    subtitle: 'Experience the magic of Rajasthan',
  },
  {
    image: 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg',
    title: 'Sun, Sea & Serenity',
    subtitle: 'Explore pristine beaches of Goa',
  },
];

const stats = [
  { icon: MapPin, value: '23+', label: 'Destinations' },
  { icon: Users, value: '15K+', label: 'Happy Travelers' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
  { icon: Award, value: '10+', label: 'Years Experience' },
];

export default function Hero({ onSelectDestination }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimating(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-gray-950" />
        </div>
      ))}

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
        <div
          className={`transition-all duration-500 ${
            animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <p className="text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4 animate-fade-in">
            Starting from Bengaluru
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            {slides[current].title}
          </h1>
          <p className="text-gray-300 text-xl mb-12 font-light">
            {slides[current].subtitle}
          </p>
        </div>

        <button
          onClick={onSelectDestination}
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-lg font-bold px-10 py-5 rounded-full shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          <MapPin className="w-6 h-6" />
          SELECT YOUR DESTINATION
        </button>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-8 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all duration-300 hover:bg-gray-800/60"
            >
              <Icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs text-gray-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
