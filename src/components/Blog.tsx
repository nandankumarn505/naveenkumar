import { Calendar, Clock, ArrowRight } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'Top 10 Hidden Gems Near Bengaluru You Must Visit in 2026',
    excerpt:
      'Discover the undiscovered — from the misty forests of Agumbe to the ancient temples of Shravanabelagola, these off-beat destinations are waiting for you.',
    image: 'https://images.pexels.com/photos/1537086/pexels-photo-1537086.jpeg',
    date: 'April 28, 2026',
    readTime: '6 min read',
    category: 'Travel Tips',
  },
  {
    id: 2,
    title: 'A Complete Guide to Kerala Backwater Houseboating',
    excerpt:
      'Everything you need to know about planning the perfect houseboat experience in Alleppey — the best seasons, what to pack, and insider tips.',
    image: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg',
    date: 'April 20, 2026',
    readTime: '8 min read',
    category: 'Guides',
  },
  {
    id: 3,
    title: 'Leh-Ladakh Bike Trip: The Ultimate 2026 Itinerary',
    excerpt:
      'From Manali to Khardung La — plan your dream Himalayan motorcycle journey with our detailed route map, stay recommendations, and safety tips.',
    image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
    date: 'April 12, 2026',
    readTime: '10 min read',
    category: 'Adventure',
  },
  {
    id: 4,
    title: 'Why Goa Is Not Just a Beach Destination',
    excerpt:
      'Explore Goa beyond the beaches — spice plantations, Baroque churches, vibrant markets, and authentic Goan cuisine that will surprise you.',
    image: 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg',
    date: 'April 5, 2026',
    readTime: '5 min read',
    category: 'Culture',
  },
  {
    id: 5,
    title: 'Sustainable Travel in India: Tips from Our Agency',
    excerpt:
      'At Indian Tourister, we believe in responsible tourism. Here are our top practices to travel green and support local communities across India.',
    image: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
    date: 'March 28, 2026',
    readTime: '7 min read',
    category: 'Sustainability',
  },
  {
    id: 6,
    title: 'Monsoon Magic: Best Indian Destinations in the Rain Season',
    excerpt:
      'While most avoid monsoon travel, these destinations transform into lush paradises — Coorg, Cherrapunji, and the Valley of Flowers.',
    image: 'https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg',
    date: 'March 18, 2026',
    readTime: '6 min read',
    category: 'Seasonal',
  },
];

const categoryColors: Record<string, string> = {
  'Travel Tips': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Guides: 'bg-green-500/20 text-green-400 border-green-500/30',
  Adventure: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Culture: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Sustainability: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Seasonal: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            Our Stories
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Travel Blog & Guides
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Expert travel advice, destination guides, and stories from our explorers at Indian Tourister
          </p>
        </div>

        {/* Featured Post */}
        <div className="group relative rounded-3xl overflow-hidden mb-8 cursor-pointer">
          <img
            src={posts[0].image}
            alt={posts[0].title}
            className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${categoryColors[posts[0].category]}`}>
              {posts[0].category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-200">
              {posts[0].title}
            </h3>
            <p className="text-gray-300 mb-4 max-w-2xl">{posts[0].excerpt}</p>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{posts[0].date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{posts[0].readTime}</span>
            </div>
          </div>
        </div>

        {/* Grid Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <article
              key={post.id}
              className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-amber-400 transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:border-amber-400">
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
