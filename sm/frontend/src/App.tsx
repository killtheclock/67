import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error('Error:', err));
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ background: '#2e7d32', color: 'white', padding: '20px' }}>
        <h1>🏪 Supermarket</h1>
        <p>Fresh groceries delivered to your door</p>
      </header>
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Products ({cart.length} in cart)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
              <h3>{product.name}</h3>
              <p>€{product.price.toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <button 
                onClick={() => addToCart(product)}
                style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
      
      <footer style={{ background: '#f5f5f5', padding: '20px', textAlign: 'center', marginTop: '40px' }}>
        <p>© 2026 Supermarket. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
