import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    platformFee: 0,
    netEarnings: 0
  });
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    type: 'movie'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    try {
      // Load products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      setProducts(products || []);

      // Load sales
      const { data: sales } = await supabase
        .from('sales')
        .select('amount, platform_fee')
        .eq('user_id', user.id);

      const total = sales?.reduce((s, sale) => s + sale.amount, 0) || 0;
      const fee = sales?.reduce((s, sale) => s + sale.platform_fee, 0) || 0;

      setStats({
        totalSales: total,
        platformFee: fee,
        netEarnings: total - fee
      });
    } catch (error) {
      console.error('Error loading business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price) {
      alert('Please fill all fields');
      return;
    }

    const { error } = await supabase
      .from('products')
      .insert([{
        ...newProduct,
        user_id: user.id,
        price: parseFloat(newProduct.price),
        created_at: new Date()
      }]);

    if (error) {
      alert('Failed to add product');
    } else {
      setNewProduct({ title: '', description: '', price: '', type: 'movie' });
      loadBusinessData();
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #ef4444',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'white', background: '#0f0f0f', minHeight: '100vh' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Business Account</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>
        Sell your content - Platform fee: 45% | You keep: 55%
      </p>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Sales</h3>
          <p style={{ fontSize: '2rem', color: '#ef4444' }}>${stats.totalSales.toFixed(2)}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Platform Fee (45%)</h3>
          <p style={{ fontSize: '2rem', color: '#fbbf24' }}>${stats.platformFee.toFixed(2)}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Your Earnings (55%)</h3>
          <p style={{ fontSize: '2rem', color: '#10b981' }}>${stats.netEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Add Product Form */}
      <div style={{
        background: '#1f1f1f',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '40px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Add New Product</h2>
        
        <div style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Product Title"
            value={newProduct.title}
            onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
            style={{
              padding: '12px',
              background: '#2d2d2d',
              border: '1px solid #3d3d3d',
              borderRadius: '5px',
              color: 'white'
            }}
          />

          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            rows="3"
            style={{
              padding: '12px',
              background: '#2d2d2d',
              border: '1px solid #3d3d3d',
              borderRadius: '5px',
              color: 'white',
              resize: 'vertical'
            }}
          />

          <select
            value={newProduct.type}
            onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
            style={{
              padding: '12px',
              background: '#2d2d2d',
              border: '1px solid #3d3d3d',
              borderRadius: '5px',
              color: 'white'
            }}
          >
            <option value="movie">Movie</option>
            <option value="music">Music</option>
            <option value="game">Game</option>
            <option value="video">Video</option>
          </select>

          <input
            type="number"
            placeholder="Price ($)"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            style={{
              padding: '12px',
              background: '#2d2d2d',
              border: '1px solid #3d3d3d',
              borderRadius: '5px',
              color: 'white'
            }}
          />

          <button
            onClick={handleAddProduct}
            style={{
              padding: '15px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Products List */}
      <h2 style={{ marginBottom: '20px' }}>Your Products ({products.length})</h2>
      
      {products.length === 0 ? (
        <div style={{
          background: '#1f1f1f',
          borderRadius: '10px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#888' }}>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {products.map(product => (
            <div key={product.id} style={{
              background: '#1f1f1f',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{product.title}</h3>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>
                {product.description || 'No description'}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  background: '#ef4444',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '0.8rem'
                }}>
                  {product.type}
                </span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                  ${product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;