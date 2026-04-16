/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        navigate('/');
        return;
      }
      setUser(parsedUser);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <img src="/shivani_pickles_logo.png" alt="Shivani Pickles" />
            <div>
              <h3>Admin Panel</h3>
              <p>Management Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="nav-icon">🛍️</span>
            Products
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon">📦</span>
            Orders
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="user-avatar">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="user-name">{user.firstName} {user.lastName}</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          <button
            className="admin-logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-content">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'orders' && <OrderManagement />}
        </div>
      </div>
    </div>
  );
};

// Product Description with Read More tooltip
const DESC_LIMIT = 80;

const ProductDescription = ({ text }) => {
  const [open, setOpen] = useState(false);

  if (!text || text.length <= DESC_LIMIT) {
    return <p className="product-description">{text}</p>;
  }

  return (
    <div className="desc-wrapper">
      <p className="product-description">
        {text.slice(0, DESC_LIMIT)}&hellip;{' '}
        <span
          className="read-more-trigger"
          onClick={() => setOpen(o => !o)}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          Read more
        </span>
      </p>
      {open && (
        <div
          className="desc-tooltip"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {text}
        </div>
      )}
    </div>
  );
};

// Product Management Component
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    oldPrice: '',
    image: '',
    badge: '',
    rating: 5,
    reviews: 0,
    quantity: 0,
    tags: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingProduct ? `${API}/products/${editingProduct.id}` : `${API}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
          tags: formData.tags.length > 0 ? formData.tags.split(',').map(tag => tag.trim()) : []
        })
      });

      if (response.ok) {
        await fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to deactivate this product? This will hide it from customers.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: 0 })
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deactivating product:', error);
      alert('Error deactivating product');
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: newStatus })
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Error updating product status');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      oldPrice: product.oldPrice?.toString() || '',
      image: product.image || '',
      badge: product.badge || '',
      rating: product.rating || 5,
      reviews: product.reviews || 0,
      quantity: product.quantity || 0,
      tags: product.tags?.join(', ') || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      oldPrice: '',
      image: '',
      badge: '',
      rating: 5,
      reviews: 0,
      tags: []
    });
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading && products.length === 0) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-management">
      <div className="products-header">
        <div className="header-content">
          <h1>Product Management</h1>
          <p>Manage your product catalog</p>
        </div>
        <button
          className="add-product-btn"
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowForm(true);
          }}
        >
          <span>+</span> Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="products-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filter">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image || '/placeholder.png'} alt={product.name} />
              {product.badge && <span className="product-badge">{product.badge}</span>}
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <ProductDescription text={product.description} />

              <div className="product-pricing">
                <span className="current-price">₹{product.price}</span>
                {product.oldPrice && (
                  <span className="old-price">₹{product.oldPrice}</span>
                )}
              </div>

              <div className="product-rating">
                <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
                <span className="rating-text">({product.reviews} reviews)</span>
              </div>

              <div className="product-status">
                <span className={`status-badge status-${product.active || 1}`}>
                  {product.active === 0 && 'Deactivated'}
                  {product.active === 1 && 'Active'}
                  {product.active === 2 && 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="product-actions">
              <button
                className="action-btn edit-btn"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>

              {/* Status Change Buttons */}
              {product.active === 1 && (
                <>
                  <button
                    className="action-btn status-btn out-of-stock-btn"
                    onClick={() => handleStatusChange(product.id, 2)}
                    title="Mark as out of stock"
                  >
                    Out of Stock
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Deactivate
                  </button>
                </>
              )}

              {product.active === 2 && (
                <>
                  <button
                    className="action-btn status-btn activate-btn"
                    onClick={() => handleStatusChange(product.id, 1)}
                    title="Mark as active"
                  >
                    Activate
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Deactivate
                  </button>
                </>
              )}

              {product.active === 0 && (
                <button
                  className="action-btn status-btn activate-btn"
                  onClick={() => handleStatusChange(product.id, 1)}
                  title="Reactivate product"
                >
                  Reactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <div className="empty-icon">📦</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-modal" onClick={() => setShowForm(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Old Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({...formData, oldPrice: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    placeholder="e.g., New, Sale"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                  />
                </div>

                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="organic, spicy, homemade"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Order Management Component
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const lastOrderCount = React.useRef(0);

  useEffect(() => {
    fetchOrders(true);

    // Poll for new orders every 30 seconds
    const interval = setInterval(() => fetchOrders(false), 30000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  const fetchOrders = async (isInitial = false) => {
    if (!isInitial) setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Fetched orders totalPrice:', data);
    //   console.log('Fetched orders totalPrice:', data[0].order.totalPrice);
      setOrders(data);

      // Show alert only if new orders arrived since last check
      if (!isInitial && data.length > lastOrderCount.current) {
        setNewOrderAlert(true);
        setTimeout(() => setNewOrderAlert(false), 5000);
      }
      lastOrderCount.current = data.length;
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchOrders();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const reactivateOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to reactivate this cancelled order?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: 1, status: 'pending' })
      });

      if (response.ok) {
        await fetchOrders();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error reactivating order:', error);
      alert('Error reactivating order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'shipped': return '#10b981';
      case 'delivered': return '#8b5cf6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    return allStatuses;
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status counts for summary
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  if (loading && orders.length === 0) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-management">
      {/* New Order Alert */}
      {newOrderAlert && (
        <div className="new-order-alert">
          🛎️ New order received!
        </div>
      )}

      <div className="orders-header">
        <div className="header-content">
          <h1>Order Management</h1>
          <p>Track and manage customer orders</p>
        </div>
        <div className="orders-header-right">
          <div className="orders-summary">
            <div className="summary-item">
              <span className="summary-label">Total</span>
              <span className="summary-value">{orders.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pending</span>
              <span className="summary-value pending">{statusCounts.pending || 0}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Processing</span>
              <span className="summary-value processing">{statusCounts.confirmed || 0}</span>
            </div>
          </div>
          <button
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
            onClick={() => fetchOrders(false)}
            disabled={refreshing}
            title="Refresh orders"
          >
            🔄 {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="status-filter">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3 className="order-id">Order #{order.id.slice(0, 8)}</h3>
                  <p className="order-customer">Customer: {order.userId}</p>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="order-status-section">
                  <div className="status-badges">
                    <span
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    {order.active === 2 && (
                      <span className="status-badge status-2">Cancelled</span>
                    )}
                  </div>
                  <div className="order-amount">
                    <span className="amount">₹{Number(order.totalPrice).toFixed(2)}</span>
                    {/* <span className="amount">₹{order.totalPrice}</span> */}
                    <span className={`payment-status ${order.paymentDone ? 'paid' : 'pending'}`}>
                      {order.paymentDone ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-details">
                <div className="order-items">
                  <h4>Items Ordered</h4>
                  <div className="items-list">
                    {order.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.productName}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">₹{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="shipping-info">
                    <h4>Shipping Address</h4>
                    <p>
                      {order.shippingAddress.line1}
                      {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                )}
              </div>

              <div className="order-actions">
                <div className="status-update">
                  <label>Update Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    disabled={updatingOrder === order.id || order.active === 2}
                  >
                    {getStatusOptions(order.status).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  {updatingOrder === order.id && <span className="updating">Updating...</span>}
                </div>

                {order.active === 2 && (
                  <button
                    className="action-btn activate-btn"
                    onClick={() => reactivateOrder(order.id)}
                  >
                    Reactivate Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch products
      const productsResponse = await fetch(`${API}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const products = await productsResponse.json();

      // Fetch orders
      const ordersResponse = await fetch(`${API}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const orders = await ordersResponse.json();

      // Calculate stats
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const totalRevenue = orders
        .filter(order => order.paymentDone)
        .reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue
      });

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button className="view-all-btn" onClick={() => document.querySelector('.admin-nav-item:nth-child(3)').click()}>
            View All Orders
          </button>
        </div>

        <div className="recent-orders-list">
          {recentOrders.length === 0 ? (
            <div className="no-orders">
              <p>No orders yet</p>
            </div>
          ) : (
            recentOrders.map(order => (
              <div key={order.id} className="recent-order-item">
                <div className="order-info">
                  <h4>Order #{order.id.slice(0, 8)}</h4>
                  <p className="order-customer">Customer: {order.userId}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-meta">
                  <span className={`order-status status-${order.status}`}>
                    {order.status}
                  </span>
                  <p className="order-amount">₹{Number(order.totalPrice).toFixed(2)}</p>
                  {/* <p className="order-amount">₹{order.totalPrice}</p> */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;