import { useState, useEffect } from 'react';
import { X, MapPin, Clock, IndianRupee, Search, Filter } from 'lucide-react';
import { supabase, type Destination } from '../lib/supabase';

interface DestinationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (destination: Destination) => void;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

const categories = ['All', 'beach', 'hill', 'heritage', 'wildlife', 'nature', 'water', 'spiritual', 'adventure'];

const categoryLabels: Record<string, string> = {
  All: 'All',
  beach: 'Beach',
  hill: 'Hill Stations',
  heritage: 'Heritage',
  wildlife: 'Wildlife',
  nature: 'Nature',
  water: 'Waterways',
  spiritual: 'Spiritual',
  adventure: 'Adventure',
};

const categoryColors: Record<string, string> = {
  beach: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  hill: 'bg-green-500/20 text-green-400 border-green-500/30',
  heritage: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  wildlife: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  nature: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  water: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  spiritual: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  adventure: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function DestinationsModal({
  isOpen,
  onClose,
  onBook,
  isLoggedIn,
  onAuthRequired,
}: DestinationsModalProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'distance'>('price_asc');

  useEffect(() => {
    if (isOpen) {
      fetchDestinations();
    }
  }, [isOpen]);

  async function fetchDestinations() {
    setLoading(true);
    const { data, error } = await supabase.from('destinations').select('*');
    if (!error && data) setDestinations(data);
    setLoading(false);
  }

  const filtered = destinations
    .filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || d.category === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.package_amount - b.package_amount;
      if (sortBy === 'price_desc') return b.package_amount - a.package_amount;
      return a.distance_km - b.distance_km;
    });

  function handleBook(dest: Destination) {
    if (!isLoggedIn) {
      onClose();
      onAuthRequired();
      return;
    }
    onBook(dest);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-7xl mx-4 my-6 bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-3rem)]">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-800 bg-gray-950">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Select Your Destination</h2>
              <p className="text-gray-400 text-sm mt-1">All distances from Bengaluru</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors duration-200"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-gray-900 border border-gray-700 focus:border-amber-500 text-white rounded-xl pl-10 pr-8 py-2.5 text-sm outline-none transition-colors duration-200 appearance-none cursor-pointer"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="distance">Nearest First</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-800" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-800 rounded w-full" />
                    <div className="h-3 bg-gray-800 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No destinations found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((dest) => (
                <div
                  key={dest.id}
                  className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col"
                >
                  <div className="relative overflow-hidden h-44">
                    <img
                      src={dest.image_url}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[dest.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                      {dest.category}
                    </span>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xl font-black text-amber-400">
                        ₹{dest.package_amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-300 text-xs ml-1">/person</span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-white font-bold text-base mb-1 group-hover:text-amber-400 transition-colors duration-200">
                      {dest.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2 flex-1">
                      {dest.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        {dest.distance_km.toLocaleString()} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {dest.duration_days} days
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-amber-500" />
                        {dest.package_amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleBook(dest)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
