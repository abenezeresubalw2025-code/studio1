
export const MENU_CATEGORIES = [
  {
    id: 'wraps',
    name: 'Signature Wraps',
    description: 'Freshly toasted flatbreads with our secret spice blends.',
    items: [
      {
        id: 'wrap-chicken',
        name: 'The Crimson Chicken',
        description: 'Succulent hand-carved chicken, pickled wild cucumber, and our signature garlic toum.',
        price: '$12.99',
        tags: ['Popular', 'Garlic Heavy'],
        image: 'dish-chicken'
      },
      {
        id: 'wrap-beef',
        name: 'Royal Beef Shawarma',
        description: 'Prime cuts of beef marinated in 12 spices, roasted tomatoes, and tahini drizzle.',
        price: '$14.99',
        tags: ['Signature'],
        image: 'dish-beef'
      },
      {
        id: 'wrap-falafel',
        name: 'Emerald Falafel Wrap',
        description: 'Crunchy herb-infused falafel, fresh parsley, radish, and zesty lemon tahini.',
        price: '$10.99',
        tags: ['Vegetarian', 'Healthy'],
        image: 'dish-falafel'
      }
    ]
  },
  {
    id: 'platters',
    name: 'Gourmet Platters',
    description: 'Hearty servings served with saffron rice and fresh salads.',
    items: [
      {
        id: 'platter-mix',
        name: 'T-Shawarma Grand Feast',
        description: 'A combination of chicken and beef shawarma, served with hummus and tabbouleh.',
        price: '$22.99',
        tags: ['Chef Recommendation'],
        image: 'hero-bg'
      },
      {
        id: 'platter-veg',
        name: 'Garden Mezze Platter',
        description: 'Hummus, mutabal, falafel, stuffed vine leaves, and warm pita bread.',
        price: '$18.99',
        tags: ['Vegan-Friendly', 'Sharing'],
        image: 'dish-hummus'
      }
    ]
  },
  {
    id: 'desserts',
    name: 'Sweet Endings',
    description: 'Traditional Mediterranean delicacies.',
    items: [
      {
        id: 'baklava-pistachio',
        name: 'Honey-Kissed Baklava',
        description: 'Layers of buttery filo pastry, crushed pistachios, and orange blossom syrup.',
        price: '$6.99',
        tags: ['Sweet'],
        image: 'dish-baklava'
      }
    ]
  }
];

export const MENU_STRING = MENU_CATEGORIES.map(cat => 
  `${cat.name}: ${cat.items.map(item => `${item.name} (${item.description})`).join(', ')}`
).join('\n');
