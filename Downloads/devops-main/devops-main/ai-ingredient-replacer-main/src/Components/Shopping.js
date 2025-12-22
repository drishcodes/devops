import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import '../styles/Shopping.css';

// Your existing products array and helper functions remain here
const products = [
  // Dairy Alternatives
  {
    id: 1,
    name: 'Organic Almond Milk',
    prices: {
      amazon: { price: 255, link: 'https://www.amazon.in/dp/B01CSLM7MC/' },
      flipkart: { price: 260, link: 'https://www.flipkart.com/search?q=almond+milk' },
      shopify: { price: 275, link: 'https://example-store.com/almond-milk' }
    },
    description: 'A healthy dairy alternative, perfect for smoothies and cereals.',
    category: 'dairy-free'
  },
  {
    id: 2,
    name: 'Coconut Milk',
    prices: {
      amazon: { price: 189, link: 'https://www.amazon.in/dp/B07V8GJ2K8/' },
      flipkart: { price: 195, link: 'https://www.flipkart.com/search?q=coconut+milk' },
      shopify: { price: 210, link: 'https://example-store.com/coconut-milk' }
    },
    description: 'Rich and creamy coconut milk for cooking and baking.',
    category: 'dairy-free'
  },
  {
    id: 3,
    name: 'Oat Milk',
    prices: {
      amazon: { price: 299, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 305, link: 'https://www.flipkart.com/search?q=oat+milk' },
      shopify: { price: 325, link: 'https://example-store.com/oat-milk' }
    },
    description: 'Creamy oat milk perfect for coffee and cereals.',
    category: 'dairy-free'
  },
  
  // Gluten-Free Products
  {
    id: 4,
    name: 'Gluten-Free Pasta',
        prices: {
      amazon: { price: 199, link: 'https://www.amazon.in/dp/B06XQ7C43Y/' },
      flipkart: { price: 196, link: 'https://www.flipkart.com/search?q=gluten+free+pasta' },
      shopify: { price: 210, link: 'https://example-store.com/gluten-free-pasta' }
    },
    description: 'Delicious pasta made from rice flour, suitable for gluten-free diets.',
    category: 'gluten-free'
  },
  {
    id: 5,
    name: 'Gluten-Free Bread',
        prices: {
      amazon: { price: 249, link: 'https://www.amazon.in/dp/B07XQ4L3K8/' },
      flipkart: { price: 245, link: 'https://www.flipkart.com/search?q=gluten+free+bread' },
      shopify: { price: 269, link: 'https://example-store.com/gluten-free-bread' }
    },
    description: 'Soft and fresh gluten-free bread perfect for sandwiches.',
    category: 'gluten-free'
  },
  {
    id: 6,
    name: 'Quinoa Flour',
        prices: {
      amazon: { price: 399, link: 'https://www.amazon.in/dp/B07NQ4L3K8/' },
      flipkart: { price: 405, link: 'https://www.flipkart.com/search?q=quinoa+flour' },
      shopify: { price: 425, link: 'https://example-store.com/quinoa-flour' }
    },
    description: 'Nutritious quinoa flour for gluten-free baking.',
    category: 'gluten-free'
  },
  
  // Protein Supplements
  {
    id: 7,
    name: 'Vegan Protein Powder',
        prices: {
      amazon: { price: 799, link: 'https://www.amazon.in/dp/B0CGHK55ZN/' },
      flipkart: { price: 799, link: 'https://www.flipkart.com/search?q=vegan+protein' },
      shopify: { price: 799, link: 'https://example-store.com/vegan-protein' }
    },
    description: 'Plant-based protein powder for shakes and baking.',
    category: 'protein'
  },
  {
    id: 8,
    name: 'Plant-Based Protein Bars',
        prices: {
      amazon: { price: 549, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 555, link: 'https://www.flipkart.com/search?q=protein+bars' },
      shopify: { price: 575, link: 'https://example-store.com/protein-bars' }
    },
    description: 'Healthy protein bars for on-the-go nutrition.',
    category: 'protein'
  },
  
  // Nuts and Seeds
  {
    id: 9,
    name: 'Almonds',
        prices: {
      amazon: { price: 699, link: 'https://www.amazon.in/dp/B07NQ4L3K8/' },
      flipkart: { price: 705, link: 'https://www.flipkart.com/search?q=almonds' },
      shopify: { price: 725, link: 'https://example-store.com/almonds' }
    },
    description: 'Premium quality almonds rich in healthy fats and protein.',
    category: 'nuts'
  },
  {
    id: 10,
    name: 'Chia Seeds',
        prices: {
      amazon: { price: 299, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 305, link: 'https://www.flipkart.com/search?q=chia+seeds' },
      shopify: { price: 325, link: 'https://example-store.com/chia-seeds' }
    },
    description: 'Nutrient-dense chia seeds perfect for puddings and smoothies.',
    category: 'seeds'
  },
  {
    id: 11,
    name: 'Walnuts',
        prices: {
      amazon: { price: 899, link: 'https://www.amazon.in/dp/B07NQ4L3K8/' },
      flipkart: { price: 905, link: 'https://www.flipkart.com/search?q=walnuts' },
      shopify: { price: 925, link: 'https://example-store.com/walnuts' }
    },
    description: 'Fresh walnuts packed with omega-3 fatty acids.',
    category: 'nuts'
  },
  
  // Sweeteners
  {
    id: 12,
    name: 'Stevia Sweetener',
        prices: {
      amazon: { price: 199, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 205, link: 'https://www.flipkart.com/search?q=stevia' },
      shopify: { price: 225, link: 'https://example-store.com/stevia' }
    },
    description: 'Natural zero-calorie sweetener perfect for diabetics.',
    category: 'sugar-free'
  },
  {
    id: 13,
    name: 'Maple Syrup',
        prices: {
      amazon: { price: 499, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 505, link: 'https://www.flipkart.com/search?q=maple+syrup' },
      shopify: { price: 525, link: 'https://example-store.com/maple-syrup' }
    },
    description: 'Pure maple syrup for natural sweetening.',
    category: 'natural'
  },
  
  // Cooking Essentials
  {
    id: 14,
    name: 'Avocado Oil',
        prices: {
      amazon: { price: 599, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 605, link: 'https://www.flipkart.com/search?q=avocado+oil' },
      shopify: { price: 625, link: 'https://example-store.com/avocado-oil' }
    },
    description: 'Healthy avocado oil for cooking and salad dressings.',
    category: 'cooking'
  },
  {
    id: 15,
    name: 'Coconut Oil',
        prices: {
      amazon: { price: 349, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 355, link: 'https://www.flipkart.com/search?q=coconut+oil' },
      shopify: { price: 375, link: 'https://example-store.com/coconut-oil' }
    },
    description: 'Pure coconut oil for cooking and beauty uses.',
    category: 'cooking'
  },
  
  // Grains and Legumes
  {
    id: 16,
    name: 'Brown Rice',
        prices: {
      amazon: { price: 299, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 305, link: 'https://www.flipkart.com/search?q=brown+rice' },
      shopify: { price: 325, link: 'https://example-store.com/brown-rice' }
    },
    description: 'Nutritious brown rice rich in fiber and minerals.',
    category: 'grains'
  },
  {
    id: 17,
    name: 'Quinoa',
        prices: {
      amazon: { price: 499, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 505, link: 'https://www.flipkart.com/search?q=quinoa' },
      shopify: { price: 525, link: 'https://example-store.com/quinoa' }
    },
    description: 'Complete protein grain perfect for salads and bowls.',
    category: 'grains'
  },
  {
    id: 18,
    name: 'Lentils',
        prices: {
      amazon: { price: 199, link: 'https://www.amazon.in/dp/B08P5Z7G2K/' },
      flipkart: { price: 205, link: 'https://www.flipkart.com/search?q=lentils' },
      shopify: { price: 225, link: 'https://example-store.com/lentils' }
    },
    description: 'High-protein lentils perfect for soups and curries.',
    category: 'legumes'
  }
];

const getCheapestOption = (prices) => {
  return Object.entries(prices).reduce(
    (cheapest, [store, details]) => {
      if (details.price < cheapest.price) {
        return { price: details.price, link: details.link, store };
      }
      return cheapest;
    },
    { price: Infinity, link: '', store: '' }
  );
};

const getPriceStyle = (currentPrice, allPrices) => {
  const priceValues = Object.values(allPrices).map(p => p.price);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);

  if (minPrice === maxPrice) return 'price-equal';
  if (currentPrice === minPrice) return 'price-low';
  if (currentPrice === maxPrice) return 'price-high';
  return 'price-normal';
};


const Shopping = () => {
  // --- State for search functionality ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // --- Effect to update the list when search term or category changes ---
  useEffect(() => {
    let results = products;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    results = results.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredProducts(results);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="shopping-container">
      <h2>Affiliated Products</h2>

      {/* --- NEW: Category Filter --- */}
      <div className="category-filter-container">
        <div className="category-label">Filter by Category:</div>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a product..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- MODIFIED: List now maps over 'filteredProducts' --- */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            const cheapest = getCheapestOption(product.prices);
            const storeName = cheapest.store.charAt(0).toUpperCase() + cheapest.store.slice(1);
            return (
              <div className="product-card" key={product.id}>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-prices">
                  <h4>Price Comparison</h4>
                  {Object.entries(product.prices).map(([site, details]) => (
                    <p key={site} className={getPriceStyle(details.price, product.prices)}>
                      {site.charAt(0).toUpperCase() + site.slice(1)}: Rs. {details.price}
                    </p>
                  ))}
                </div>
                <a
                  href={cheapest.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-link"
                >
                  View on {storeName} (Cheapest)
                </a>
              </div>
            );
          })
        ) : (
          <p className="no-results">No products found. Try a different search!</p>
        )}
      </div>
    </div>
  );
};

export default Shopping;