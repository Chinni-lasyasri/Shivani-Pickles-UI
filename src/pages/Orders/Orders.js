import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Orders = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchOrders(token);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchOrders = async (token) => {
    try {
      const response = await fetch(`${API}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setOrders(data);
      console.log('Fetched orders:', data[0].totalPrice);
      console.log('Fetched orders:', typeof(data[0].totalPrice));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this order?`)) return;

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
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const canCancelOrder = (status) => {
    return status === 'pending';
  };

  const canMarkAsDelivered = (status) => {
    return status === 'shipped';
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    return filterStatus === 'all' || order.status === filterStatus;
  });

  // Get status counts for summary
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <div className="header-brand">
            <img src="/shivani_pickles_logo.png" alt="Shivani Pickles" />
            <div>
              <h1>My Orders</h1>
              <p>Track and manage your pickle orders</p>
            </div>
          </div>
          <button
            className="back-to-shopping-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Shopping
          </button>
        </div>

        {/* Status Summary */}
        <div className="orders-summary">
          <div className="summary-card">
            <div className="summary-icon">📦</div>
            <div className="summary-info">
              <span className="summary-value">{orders.length}</span>
              <span className="summary-label">Total Orders</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🚚</div>
            <div className="summary-info">
              <span className="summary-value">{statusCounts.shipped || 0}</span>
              <span className="summary-label">In Transit</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">✅</div>
            <div className="summary-info">
              <span className="summary-value">{statusCounts.delivered || 0}</span>
              <span className="summary-label">Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({statusCounts.pending || 0})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'shipped' ? 'active' : ''}`}
            onClick={() => setFilterStatus('shipped')}
          >
            Shipped ({statusCounts.shipped || 0})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilterStatus('delivered')}
          >
            Delivered ({statusCounts.delivered || 0})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-content">
        {filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h3>
              {filterStatus === 'all'
                ? "No orders yet"
                : `No ${filterStatus} orders found`
              }
            </h3>
            <p>
              {filterStatus === 'all'
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `You don't have any ${filterStatus} orders.`
              }
            </p>
            <button
              className="shop-now-btn"
              onClick={() => navigate('/')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-card-header">
                  <div className="order-basic-info">
                    <div className="order-id-section">
                      <h3 className="order-id">Order #{order.id.slice(0, 8)}</h3>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="order-status-section">
                      <div className="status-display">
                        <span className="status-icon">{getStatusIcon(order.status)}</span>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="order-amount">
                        <span className="amount">₹{Number(order.totalPrice).toFixed(2)}</span>

                        {/* <span className="amount">₹{order.totalPrice}</span> */}
                        <span className={`payment-status ${order.paymentDone ? 'paid' : 'pending'}`}>
                          {order.paymentDone ? 'Payment Done' : 'Payment Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Progress */}
                <div className="order-progress">
                  <div className="progress-steps">
                    <div className={`progress-step ${['pending', 'confirmed', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                      <div className="step-icon">📋</div>
                      <span className="step-label">Ordered</span>
                    </div>
                    <div className={`progress-step ${['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                      <div className="step-icon">✅</div>
                      <span className="step-label">Confirmed</span>
                    </div>
                    <div className={`progress-step ${['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                      <div className="step-icon">🚚</div>
                      <span className="step-label">Shipped</span>
                    </div>
                    <div className={`progress-step ${order.status === 'delivered' ? 'completed' : ''}`}>
                      <div className="step-icon">📦</div>
                      <span className="step-label">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items-section">
                  <h4>Order Items</h4>
                  <div className="order-items-grid">
                    {order.items?.map((item, index) => (
                      <div key={index} className="order-item-card">
                        <div className="item-image">
                          <img src="/placeholder.png" alt={item.productName} />
                        </div>
                        <div className="item-details">
                          <h5>{item.productName}</h5>
                          <p className="item-quantity">Quantity: {item.quantity}</p>
                          <p className="item-price">₹{item.price.toFixed(2)} each</p>
                          <p className="item-total">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="shipping-section">
                    <h4>Shipping Address</h4>
                    <div className="address-card">
                      <p>
                        {order.shippingAddress.line1}
                        {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                      </p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Actions */}
                <div className="order-actions">
                  {canCancelOrder(order.status) && (
                    <button
                      className="action-btn cancel-btn"
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      disabled={updatingOrder === order.id}
                    >
                      {updatingOrder === order.id ? 'Cancelling...' : '❌ Cancel Order'}
                    </button>
                  )}

                  {canMarkAsDelivered(order.status) && (
                    <button
                      className="action-btn deliver-btn"
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      disabled={updatingOrder === order.id}
                    >
                      {updatingOrder === order.id ? 'Updating...' : '✅ Mark as Delivered'}
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <div className="delivered-message">
                      <span className="delivered-icon">🎉</span>
                      <span>Order successfully delivered! Enjoy your pickles!</span>
                    </div>
                  )}

                  {order.status === 'cancelled' && (
                    <div className="cancelled-message">
                      <span className="cancelled-icon">❌</span>
                      <span>This order has been cancelled.</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;