import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const BusinessAccount = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    platformFee: 0,
    netEarnings: 0
  });
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    type: 'movie'
  });

  useEffect(() => {
    loadProducts();
    loadEarnings();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);
    setProducts(data || []);
  };

  const loadEarnings = async () => {
    const { data } = await supabase
      .from('sales')
      .select('amount, platform_fee')
      .eq('user_id', user.id);

    const total = data?.reduce((sum, s) => sum + s.amount, 0) || 0;
    const platformFee = data?.reduce((sum, s) => sum + s.platform_fee, 0) || 0;

    setEarnings({
      total,
      platformFee,
      netEarnings: total - platformFee
    });
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
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } else {
      setNewProduct({ title: '', description: '', price: '', type: 'movie' });
      loadProducts();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Business Account</h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>
          Sell your content and earn 55% revenue (45% platform fee)
        </p>

        {/* Earnings Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: '#1f1f1f',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Sales</h3>
            <p style={{ fontSize: '2rem', color: '#ef4444' }}>${earnings.total.toFixed(2)}</p>
          </div>
          
          <div style={{
            background: '#1f1f1f',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Platform Fee (45%)</h3>
            <p style={{ fontSize: '2rem', color: '#fbbf24' }}>${earnings.platformFee.toFixed(2)}</p>
          </div>
          
          <div style={{
            background: '#1f1f1f',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Your Earnings (55%)</h3>
            <p style={{ fontSize: '2rem', color: '#10b981' }}>${earnings.netEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Add Product Form */}
        <div style={{
          background: '#1f1f1f',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '40px'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Add New Product</h3>
          
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
                color: 'white'
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
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Products List */}
        <h3 style={{ marginBottom: '20px' }}>Your Products ({products.length})</h3>
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
              <h4 style={{ margin: '0 0 10px 0' }}>{product.title}</h4>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>{product.description}</p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '15px'
              }}>
                <span style={{
                  background: '#ef4444',
                  padding: '3px 10px',
                  borderRadius: '3px',
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
      </div>
    </div>
  );
};

export default BusinessAccount;