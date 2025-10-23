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
              THE ART OF
              <br />
              PERFECTION
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              For over a century, we have dedicated ourselves to the pursuit of
              excellence in jewelry design. Each piece tells a story of
              uncompromising quality, timeless elegance, and the mastery of our
              craft.
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Our creations are more than accessories—they are heirlooms,
              destined to be cherished for generations.
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
