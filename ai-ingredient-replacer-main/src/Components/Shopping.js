import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import '../styles/Shopping.css';

// Your existing products array and helper functions remain here
const products = [
  // ... (keep your existing products array)
  {
    id: 1,
    name: 'Organic Almond Milk',
    image: 'https://m.media-amazon.com/images/I/61WiT++oBTL._SX679_.jpg',
    prices: {
      amazon: { price: 255, link: 'https://www.amazon.in/dp/B01CSLM7MC/' },
      flipkart: { price: 260, link: 'https://www.flipkart.com/search?q=almond+milk' },
      shopify: { price: 275, link: 'https://example-store.com/almond-milk' }
    },
    description: 'A healthy dairy alternative, perfect for smoothies and cereals.',
  },
  {
    id: 2,
    name: 'Gluten-Free Pasta',
    image: 'https://m.media-amazon.com/images/I/41Yzt3fM3KL._SX300_SY300_QL70_FMwebp_.jpg',
    prices: {
      amazon: { price: 199, link: 'https://www.amazon.in/dp/B06XQ7C43Y/' },
      flipkart: { price: 196, link: 'https://www.flipkart.com/search?q=gluten+free+pasta' },
      shopify: { price: 210, link: 'https://example-store.com/gluten-free-pasta' }
    },
    description: 'Delicious pasta made from rice flour, suitable for gluten-free diets.',
  },
  {
    id: 3,
    name: 'Vegan Protein Powder',
    image: 'https://m.media-amazon.com/images/I/41qx6-6TF3L._SX300_SY300_QL70_FMwebp_.jpg',
    prices: {
      amazon: { price: 799, link: 'https://www.amazon.in/dp/B0CGHK55ZN/' },
      flipkart: { price: 799, link: 'https://www.flipkart.com/search?q=vegan+protein' },
      shopify: { price: 799, link: 'https://example-store.com/vegan-protein' }
    },
    description: 'Plant-based protein powder for shakes and baking.',
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
  // --- NEW: State for search functionality ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // --- NEW: Effect to update the list when search term changes ---
  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm]);


  return (
    <div className="shopping-container">
      <h2>Affiliated Products</h2>

      {/* --- NEW: Search Bar --- */}
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
                {/* ... The rest of your product card JSX ... */}
                <img src={product.image} alt={product.name} className="product-image" />
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