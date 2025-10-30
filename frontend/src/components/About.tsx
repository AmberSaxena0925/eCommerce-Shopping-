
import { Sparkles, Award, Shield } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Sparkles,
      title: 'Craftsmanship',
      description: 'Each piece is meticulously handcrafted by master artisans.',
    },
    {
      icon: Award,
      title: 'Premium Materials',
      description: 'Only the finest metals and stones meet our standards.',
    },
    {
      icon: Shield,
      title: 'Lifetime Guarantee',
      description: 'Every creation is backed by our commitment to excellence.',
    },
  ];
  
  return (
    <section id="about" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-5xl font-light tracking-widest text-white mb-6">
              OUR BRAND STORY.
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed">
              Discover the timeless elegance of Sai Naman Pearls, a revered name in the world of pearl 
              jewelry for over 31 years. Our brand stands as a beacon of quality and craftsmanship, 
              offering exquisite pieces that enchant and inspire. Proudly registered with both KVIC and 
              MSME, we blend tradition with innovation, ensuring each creation tells a story of heritage 
              and beauty.
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed">
              From classic strands to contemporary designs, Sai Naman Pearls celebrates the essence of 
              femininity and sophistication, making every piece a cherished treasure for generations to come.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex-1 group bg-zinc-950 border border-zinc-800 p-6 transition-all duration-500 hover:border-zinc-600"
                  style={{
                    animation: `fade-in-left 0.8s ease-out ${index * 0.2}s both`,
                  }}
                >
                  <feature.icon className="w-10 h-10 text-zinc-600 mb-4 group-hover:text-white transition-colors duration-500" />

                  <h3 className="text-lg font-light tracking-wide text-white mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-zinc-500 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <div className="relative group flex justify-center">
              <img
                src="/public/certificate.png"
                alt="Certification"
                className="w-full max-w-md rounded-xl shadow-xl object-cover border border-zinc-700 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-xl" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
