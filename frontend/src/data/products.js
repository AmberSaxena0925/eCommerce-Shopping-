export const localProducts = [
  {
    id: 'local-1',
    name: 'Golden Pearl Necklace',
    slug: 'golden-pearl-necklace',
    description: 'A stunning handcrafted necklace featuring natural pearls and 18k gold.',
    price: 1299,
    images: ['/images/products/pearl-necklace.jpg'],
    materials: ['Gold', 'Pearl'],
    in_stock: true,
    featured: true,
  },
  {
    id: 'local-2',
    name: 'Silver Hoop Earrings',
    slug: 'silver-hoop-earrings',
    description: 'Elegant sterling silver hoops with a timeless minimalist design.',
    price: 499,
    images: ['/images/products/silver-hoops.jpg'],
    materials: ['Silver'],
    in_stock: true,
    featured: true,
    category: 'necklace',
  },
  {
    id: 'local-3',
    name: 'Rose Gold Bracelet',
    slug: 'rose-gold-bracelet',
    description: 'Delicate rose gold bracelet with diamond accents for special occasions.',
    price: 899,
    images: ['/images/products/rose-gold-bracelet.jpg'],
    materials: ['Rose Gold', 'Diamond'],
    in_stock: true,
    featured: false,
  },
  {
    id: 'local-4',
    name: 'Eclat Circle',
    slug: 'eclat-circle',
    description: `Each bangle is a perfect circle of luminous beauty, meticulously crafted from flawless, hand-selected pearls. 
    Chosen for their exceptional luster and immaculate surfaces, these pearls radiate a soft, incandescent glow that warms the skin.
    When worn, they create a captivating chorus of opulence, stacking together in a luxurious display of timeless sophistication. 
    These are not mere accessories, but a symbol of pure, refined grace, designed to adorn the wrist with an air of effortless prestige.`,
    price: 1999,
    mrp: 3200,
    images: [
      '/images/products/eclat1.png', // Guarantee Certificate
      '/images/products/eclat2.png', // Bracelet on wrist
      '/images/products/eclat3.png', // Bracelet close-up
    ],
    materials: ['Pearl', 'Silver'],
    in_stock: true,
    featured: true,
  },
];
