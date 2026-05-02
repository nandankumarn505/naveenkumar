import { Shield, HeartHandshake, Globe as Globe2, PhoneCall } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Safe & Trusted',
    desc: 'Over 10 years of delivering worry-free travel experiences with certified guides and vetted accommodations.',
  },
  {
    icon: HeartHandshake,
    title: 'Personalised Trips',
    desc: 'Every journey is tailor-made. We craft itineraries around your preferences, budget, and travel style.',
  },
  {
    icon: Globe2,
    title: 'Pan-India Coverage',
    desc: "From the snow-capped Himalayas to Kerala's backwaters — we cover 23+ iconic Indian destinations.",
  },
  {
    icon: PhoneCall,
    title: '24/7 Support',
    desc: 'Our travel experts are available around the clock to assist you before, during, and after your trip.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-3">
              About Us
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              {"Bengaluru's Premier"}<br />Tourism Agency
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Indian Tourister was founded with a single mission — to make the beauty of India accessible to
              every traveler. Based in the heart of Bengaluru, we have helped over 15,000 travelers explore
              the incredible diversity of our nation.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              From the royal heritage of Rajasthan to the tranquil backwaters of Kerala, from the adventure
              trails of Ladakh to the spiritual ghats of Varanasi — we bring every corner of India to life
              with curated packages and unmatched hospitality.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '15K+', label: 'Happy Travelers' },
                { num: '23+', label: 'Destinations' },
                { num: '10+', label: 'Years Experience' },
                { num: '4.9', label: 'Average Rating' },
              ].map(({ num, label }) => (
                <div key={label} className="bg-gray-950 border border-gray-800 rounded-2xl p-4 text-center hover:border-amber-500/40 transition-colors">
                  <div className="text-2xl font-black text-amber-400">{num}</div>
                  <div className="text-gray-400 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-5 bg-gray-950 border border-gray-800 rounded-2xl hover:border-amber-500/40 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
