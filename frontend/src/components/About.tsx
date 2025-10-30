export default function About() {
  return (
    <section id="about" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT TEXT SECTION */}
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

          <div className="flex justify-center">
            <div className="relative group">
              <img
                src="/images/certificate.png" 
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
