 import { Sparkles, Award, Shield } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Sparkles,
      title: 'Craftsmanship',
      description: 'Each piece is meticulously handcrafted by master artisans',
    },
    {
      icon: Award,
      title: 'Premium Materials',
      description: 'Only the finest metals and stones meet our standards',
    },
    {
      icon: Shield,
      title: 'Lifetime Guarantee',
      description: 'Every creation is backed by our commitment to excellence',
    },
  ];

  return (
    <section id="about" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-light tracking-widest text-white mb-6">
              OUR BRAND STORY.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Discover the timeless elegance of Sai Naman Pearls, a revered name in the world of pearl jewelry for over 31 years. Our brand stands as a beacon of quality and craftsmanship, offering exquisite pieces that enchant and inspire. Proudly registered with both KVIC and MSME, we blend tradition with innovation, ensuring each creation tells a story of heritage and beauty.
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed">
               From classic strands to contemporary designs, Sai Naman Pearls celebrates the essence of femininity and sophistication, making every piece a cherished treasure for generations to come.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-zinc-950 border border-zinc-800 p-8 hover:border-zinc-600 transition-all duration-500"
                style={{
                  animation: `fade-in-left 0.8s ease-out ${index * 0.2}s both`,
                }}
              >
                <feature.icon className="w-12 h-12 text-zinc-600 mb-4 group-hover:text-white transition-colors duration-500" />
                <h3 className="text-xl font-light tracking-wide text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
