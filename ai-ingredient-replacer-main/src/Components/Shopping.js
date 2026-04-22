import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import '../styles/Shopping.css';
import { getCurrentAIConfig, extractAIResponse } from '../config/aiConfig';

// Your existing products array and helper functions remain here
const products = [
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
    category: 'Dairy Alternatives',
    rating: 4.5,
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
    category: 'Pantry',
    rating: 4.2,
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
    category: 'Supplements',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Organic Olive Oil',
    image: 'https://m.media-amazon.com/images/I/71bOq8J6xPL._SX679_.jpg',
    prices: {
      amazon: { price: 450, link: 'https://www.amazon.in/dp/B08X7C43Y/' },
      flipkart: { price: 445, link: 'https://www.flipkart.com/search?q=olive+oil' },
      shopify: { price: 475, link: 'https://example-store.com/olive-oil' }
    },
    description: 'Extra virgin olive oil for cooking and dressings.',
    category: 'Pantry',
    rating: 4.6,
  },
  {
    id: 5,
    name: 'Quinoa',
    image: 'https://m.media-amazon.com/images/I/81V7x9pQKTL._SX679_.jpg',
    prices: {
      amazon: { price: 320, link: 'https://www.amazon.in/dp/B09XQ7C43Y/' },
      flipkart: { price: 315, link: 'https://www.flipkart.com/search?q=quinoa' },
      shopify: { price: 340, link: 'https://example-store.com/quinoa' }
    },
    description: 'High-protein grain perfect for salads and side dishes.',
    category: 'Grains',
    rating: 4.4,
  },
  {
    id: 6,
    name: 'Chia Seeds',
    image: 'https://m.media-amazon.com/images/I/71kG5K9C9XL._SX679_.jpg',
    prices: {
      amazon: { price: 280, link: 'https://www.amazon.in/dp/B07XQ7C43Y/' },
      flipkart: { price: 275, link: 'https://www.flipkart.com/search?q=chia+seeds' },
      shopify: { price: 295, link: 'https://example-store.com/chia-seeds' }
    },
    description: 'Nutrient-dense seeds for smoothies and baking.',
    category: 'Pantry',
    rating: 4.3,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [compareList, setCompareList] = useState([]);
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState('');

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || product.category === selectedCategory)
    );
    setFilteredProducts(results);
  }, [searchTerm, selectedCategory]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const toggleCompare = (productId) => {
    if (compareList.includes(productId)) {
      setCompareList(compareList.filter(id => id !== productId));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, productId]);
    }
  };

  const clearCompare = () => setCompareList([]);

  const searchProductsAI = async () => {
    if (!aiSearchQuery.trim()) return;
    setAiLoading(true);
    setAiSearchResults(null);

    try {
      const config = getCurrentAIConfig();
      const response = await fetch(config.BASE_URL, {
        method: 'POST',
        headers: config.HEADERS,
        body: JSON.stringify({
          model: config.MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful shopping assistant. When asked about products, provide a concise list of 3-5 relevant products with their approximate prices on Amazon, Flipkart, and other platforms. Format the response as a simple list with product name, Amazon price, Flipkart price, and best platform recommendation. Do not use asterisks or markdown formatting.'
            },
            {
              role: 'user',
              content: `Find products related to: ${aiSearchQuery}. Include price comparisons across Amazon, Flipkart, and other platforms.`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      const aiResponse = extractAIResponse(data);
      const cleanedResponse = aiResponse ? aiResponse.replace(/\*/g, '') : '';
      setAiSearchResults(cleanedResponse);
    } catch (error) {
      console.error('Error searching products:', error);
      setAiSearchResults('Sorry, there was an error searching for products. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c5282', fontSize: '2rem', marginBottom: '10px' }}>🛒 Shopping & Price Comparison</h2>
        <p style={{ color: '#4a5568', fontSize: '1rem' }}>Find the best deals across platforms with intelligent price comparison</p>
      </div>

      {/* Product Search */}
      <div style={{
        padding: '25px',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f0fe 100%)',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#2c5282', fontSize: '1.2rem' }}>🔍 Product Search</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search for any product (e.g., 'organic milk', 'protein powder')..."
            value={aiSearchQuery}
            onChange={(e) => setAiSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchProductsAI()}
            style={{
              flex: 1,
              minWidth: '250px',
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={searchProductsAI}
            disabled={aiLoading || !aiSearchQuery.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: aiLoading ? '#cbd5e0' : 'linear-gradient(135deg, #3182ce, #38b2ac)',
              color: '#fff',
              border: 'none',
              fontWeight: '500',
              cursor: aiLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {aiLoading ? '🔍 Searching...' : '🔍 Search Products'}
          </button>
        </div>
        {aiSearchResults && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            lineHeight: '1.6',
            color: '#1a202c',
            whiteSpace: 'pre-line'
          }}>
            <strong style={{ color: '#3182ce' }}>Search Results:</strong>
            <br />
            {aiSearchResults}
          </div>
        )}
      </div>

      {/* Local Product Search */}
      <div style={{
        padding: '25px',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#2c5282', fontSize: '1.2rem' }}>📦 Browse Products</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '250px',
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            const cheapest = getCheapestOption(product.prices);
            const storeName = cheapest.store.charAt(0).toUpperCase() + cheapest.store.slice(1);
            const isSelected = compareList.includes(product.id);
            return (
              <div
                key={product.id}
                style={{
                  padding: '20px',
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                  boxShadow: isSelected ? '0 0 0 3px #3182ce' : '0 4px 6px rgba(0, 0, 0, 0.07)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isSelected ? '0 0 0 3px #3182ce' : '0 4px 6px rgba(0, 0, 0, 0.07)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '15px', borderRadius: '8px', background: '#f7fafc' }} />
                <div style={{ marginBottom: '10px' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: '#e8f4f8',
                    color: '#3182ce',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {product.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#1a202c' }}>{product.name}</h3>
                <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.5' }}>{product.description}</p>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                    <span style={{ color: '#ecc94b' }}>★</span>
                    <span style={{ fontSize: '0.9rem', color: '#1a202c' }}>{product.rating}</span>
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#1a202c' }}>Price Comparison:</h4>
                  {Object.entries(product.prices).map(([site, details]) => (
                    <div key={site} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      fontSize: '0.9rem',
                      color: details.price === cheapest.price ? '#48bb78' : '#4a5568',
                      fontWeight: details.price === cheapest.price ? '600' : '400'
                    }}>
                      <span>{site.charAt(0).toUpperCase() + site.slice(1)}</span>
                      <span>₹{details.price}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <button
                    onClick={() => toggleCompare(product.id)}
                    style={{
                      padding: '10px',
                      background: isSelected ? '#2c5282' : '#f7fafc',
                      border: isSelected ? 'none' : '2px solid #e2e8f0',
                      borderRadius: '8px',
                      color: isSelected ? '#fff' : '#1a202c',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {isSelected ? '✓ Selected' : '+ Add to Compare'}
                  </button>
                  <a
                    href={cheapest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px',
                      background: 'linear-gradient(135deg, #3182ce 0%, #38b2ac 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'block'
                    }}
                  >
                    Buy on {storeName} (₹{cheapest.price})
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#4a5568' }}>
            <h3 style={{ marginBottom: '10px' }}>No products found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Compare Section */}
      {compareList.length > 0 && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: '0', color: '#1a202c' }}>Price Comparison Table</h3>
            <button
              onClick={clearCompare}
              style={{
                padding: '8px 16px',
                background: '#f56565',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Clear Selection
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#1a202c' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#1a202c' }}>Amazon</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#1a202c' }}>Flipkart</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#1a202c' }}>Shopify</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#1a202c' }}>Best Deal</th>
              </tr>
            </thead>
            <tbody>
              {compareList.map(id => {
                const product = products.find(p => p.id === id);
                if (!product) return null;
                const cheapest = getCheapestOption(product.prices);
                return (
                  <tr key={id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px' }}>{product.name}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>₹{product.prices.amazon.price}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>₹{product.prices.flipkart.price}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>₹{product.prices.shopify.price}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#48bb78', fontWeight: 'bold' }}>
                      ₹{cheapest.price} ({cheapest.store})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Shopping;