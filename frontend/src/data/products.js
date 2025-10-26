export const localProducts = [
  {
    id: 'local-1',
    name: 'Golden Pearl Necklace',
    slug: 'golden-pearl-necklace',
    description: 'A stunning handcrafted necklace featuring natural pearls and 18k gold.',
    price: 1299,
    images: ['https://i.pinimg.com/1200x/00/34/62/0034624634c52395308e13d9e03dd1be.jpg'],
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
    images: ['https://i.pinimg.com/1200x/11/12/a4/1112a46212544e44c9d303d61f133bbc.jpg'],
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
    images: ['https://i.pinimg.com/736x/f7/76/2a/f7762a6d97ec0f284b64412cef76619f.jpg'],
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
