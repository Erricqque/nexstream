import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  ShoppingBag
} from 'lucide-react';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    platformFees: 0,
    netEarnings: 0,
    totalProducts: 0,
    totalViews: 0,
    conversionRate: 0
  });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    type: 'digital',
    stock: -1
  });

  useEffect(() => {
    loadBusinessData();
  }, [user]);

  const loadBusinessData = async () => {
    try {
      // Load business profile
      const { data: businessData } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setBusiness(businessData);

      if (businessData) {
        // Load products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', businessData.id)
          .order('created_at', { ascending: false });

        setProducts(productsData || []);

        // Load sales
        const { data: salesData } = await supabase
          .from('sales')
          .select('*')
          .eq('business_id', businessData.id);

        const totalSales = salesData?.length || 0;
        const totalRevenue = salesData?.reduce((sum, s) => sum + s.amount, 0) || 0;
        const platformFees = salesData?.reduce((sum, s) => sum + s.platform_fee, 0) || 0;
        const totalViews = productsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

        setStats({
          totalSales,
          totalRevenue,
          platformFees,
          netEarnings: totalRevenue - platformFees,
          totalProducts: productsData?.length || 0,
          totalViews,
          conversionRate: totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(2) : 0
        });
      }
    } catch (error) {
      console.error('Error loading business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async () => {
    const businessName = prompt('Enter your business name:');
    if (!businessName) return;

    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .insert([{
          user_id: user.id,
          business_name: businessName,
          verification_status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      setBusiness(data);
    } catch (error) {
      console.error('Error creating business:', error);
      alert('Failed to create business profile');
    }
  };

  const handleAddProduct = async () => {
    if (!formData.title || !formData.price) {
      alert('Title and price are required');
      return;
    }

    try {
      const productData = {
        business_id: business.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        type: formData.type,
        stock_quantity: parseInt(formData.stock) || -1
      };

      let result;
      if (editingProduct) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
      } else {
        result = await supabase
          .from('products')
          .insert([productData]);
      }

      if (result.error) throw result.error;

      setShowAddProduct(false);
      setEditingProduct(null);
      setFormData({ title: '', description: '', price: '', category: '', type: 'digital', stock: -1 });
      loadBusinessData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      type: product.type,
      stock: product.stock_quantity?.toString() || '-1'
    });
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      loadBusinessData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #ef4444',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#1f1f1f',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ marginBottom: '16px' }}>Start Your Business</h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>
            Create a business account to start selling products and earning revenue.
          </p>
          <button
            onClick={handleCreateBusiness}
            style={{
              padding: '12px 32px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            Create Business Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: '40px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Business Dashboard</h1>
          <p style={{ color: '#888' }}>
            Welcome back, {business.business_name}
            {business.verification_status === 'pending' && (
              <span style={{
                marginLeft: '12px',
                padding: '4px 12px',
                background: '#fbbf24',
                color: 'black',
                borderRadius: '20px',
                fontSize: '0.8rem'
              }}>
                Pending Verification
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          style={{
            padding: '12px 24px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: '#1f1f1f',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <ShoppingBag size={24} color="#ef4444" />
            <h3 style={{ margin: 0, color: '#888' }}>Total Sales</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.totalSales}</p>
        </div>

        <div style={{
          background: '#1f1f1f',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <DollarSign size={24} color="#10b981" />
            <h3 style={{ margin: 0, color: '#888' }}>Revenue</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#10b981' }}>
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        <div style={{
          background: '#1f1f1f',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <BarChart3 size={24} color="#fbbf24" />
            <h3 style={{ margin: 0, color: '#888' }}>Platform Fee (45%)</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#fbbf24' }}>
            {formatCurrency(stats.platformFees)}
          </p>
        </div>

        <div style={{
          background: '#1f1f1f',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <TrendingUp size={24} color="#3b82f6" />
            <h3 style={{ margin: 0, color: '#888' }}>Your Earnings (55%)</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#3b82f6' }}>
            {formatCurrency(stats.netEarnings)}
          </p>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#1f1f1f',
            borderRadius: '16px',
            padding: '40px',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h2 style={{ marginBottom: '24px' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Product Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={{
                  padding: '12px',
                  background: '#2d2d2d',
                  border: '1px solid #3d3d3d',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                style={{
                  padding: '12px',
                  background: '#2d2d2d',
                  border: '1px solid #3d3d3d',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />

              <input
                type="number"
                placeholder="Price ($)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={{
                  padding: '12px',
                  background: '#2d2d2d',
                  border: '1px solid #3d3d3d',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{
                  padding: '12px',
                  background: '#2d2d2d',
                  border: '1px solid #3d3d3d',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Category</option>
                <option value="movies">Movies</option>
                <option value="music">Music</option>
                <option value="games">Games</option>
                <option value="videos">Videos</option>
                <option value="digital">Digital Products</option>
                <option value="physical">Physical Products</option>
              </select>

              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{
                  padding: '12px',
                  background: '#2d2d2d',
                  border: '1px solid #3d3d3d',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="digital">Digital Product</option>
                <option value="physical">Physical Product</option>
                <option value="movie">Movie</option>
                <option value="music">Music</option>
                <option value="game">Game</option>
                <option value="video">Video</option>
              </select>

              <input
                type="number"
                placeholder="Stock Quantity (-1 for unlimited)"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                style={{
                  padding: '12px',
                  background: '#2d2d2d',
                  border: '1px solid #3d3d3d',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={handleAddProduct}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  onClick={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                    setFormData({ title: '', description: '', price: '', category: '', type: 'digital', stock: -1 });
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'transparent',
                    color: 'white',
                    border: '1px solid #3d3d3d',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <h2 style={{ marginBottom: '20px' }}>Your Products ({products.length})</h2>
      
      {products.length === 0 ? (
        <div style={{
          background: '#1f1f1f',
          borderRadius: '12px',
          padding: '60px',
          textAlign: 'center'
        }}>
          <Package size={48} color="#888" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#888', fontSize: '1.1rem' }}>No products yet</p>
          <p style={{ color: '#666', marginTop: '8px' }}>Click "Add Product" to start selling</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {products.map(product => (
            <div
              key={product.id}
              style={{
                background: '#1f1f1f',
                borderRadius: '12px',
                padding: '20px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{product.title}</h3>
                <span style={{
                  background: product.status === 'active' ? '#10b981' : '#6b7280',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {product.status}
                </span>
              </div>

              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
                {product.description || 'No description'}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ef4444' }}>
                  ${product.price}
                </span>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>
                  {product.sales_count || 0} sold
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#888',
                fontSize: '0.9rem',
                marginBottom: '16px'
              }}>
                <Eye size={16} />
                <span>{product.views || 0} views</span>
                {product.stock_quantity > 0 && (
                  <>
                    <span>•</span>
                    <span>{product.stock_quantity} in stock</span>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEditProduct(product)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#2d2d2d',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#2d2d2d',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;