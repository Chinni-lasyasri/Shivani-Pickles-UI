import React, { useState, useEffect } from 'react';
import './CheckoutModal.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const ADDR_KEY = 'shivani_addresses';

const STEPS = ['Summary', 'Address', 'Contact & Pay', 'Confirm'];

const emptyAddr = { label: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' };

const CheckoutModal = ({ open, onClose, cartItems, onOrderPlaced }) => {
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newAddr, setNewAddr] = useState(emptyAddr);
  const [contact, setContact] = useState({ name: '', phone: '', email: '', notes: '' });
  const [payMethod, setPayMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /* group cart items */
  const grouped = cartItems.reduce((acc, item) => {
    const ex = acc.find(i => i.id === item.id);
    if (ex) ex.qty += 1;
    else acc.push({ ...item, qty: 1 });
    return acc;
  }, []);
  const total = grouped.reduce((s, i) => s + i.price * i.qty, 0);

  /* load saved addresses & user info */
  useEffect(() => {
    if (!open) return;
    setStep(0); setSuccess(false); setError('');
    const saved = JSON.parse(localStorage.getItem(ADDR_KEY) || '[]');
    setAddresses(saved);
    setSelectedAddr(saved.length > 0 ? 0 : null);
    setAddingNew(saved.length === 0);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setContact(c => ({
        ...c,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        phone: user.mobile || user.phone || '',
        email: user.email || '',
      }));
    } catch {}
  }, [open]);

  if (!open) return null;

  /* ── helpers ── */
  const saveAddresses = (list) => {
    setAddresses(list);
    localStorage.setItem(ADDR_KEY, JSON.stringify(list));
  };

  const handleAddAddress = () => {
    const required = ['line1', 'city', 'state', 'pincode'];
    for (const f of required) {
      if (!newAddr[f].trim()) { setError(`Please fill in: ${f}`); return; }
    }
    const updated = [...addresses, { ...newAddr }];
    saveAddresses(updated);
    setSelectedAddr(updated.length - 1);
    setAddingNew(false);
    setNewAddr(emptyAddr);
    setError('');
  };

  const canProceedStep1 = addingNew
    ? newAddr.line1 && newAddr.city && newAddr.state && newAddr.pincode
    : selectedAddr !== null;

  const canProceedStep2 = contact.name && contact.phone;

  const handlePlaceOrder = async () => {
    setPlacing(true); setError('');
    const addr = addresses[selectedAddr];
    try {
      const token = localStorage.getItem('token');
      if (!token) { setError('You must be logged in to place an order.'); setPlacing(false); return; }

      const body = {
        items: grouped.map(i => ({ productId: i.id, productName: i.name, price: i.price, quantity: i.qty })),
        shippingAddress: addr,
        paymentMethod: payMethod,
        paymentDone: payMethod === 'online',
        notes: contact.notes || null,
      };

      console.log('Placing order with body:', body);

      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess(true);
        setStep(3);
        onOrderPlaced?.();
      } else {
        const err = await res.json();
        setError(err.message || 'Failed to place order.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  /* ── render ── */
  return (
    <div className="chk-backdrop" onClick={onClose}>
      <div className="chk-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="chk-header">
          <h2 className="chk-title">Checkout</h2>
          <button className="chk-close" onClick={onClose}>✕</button>
        </div>

        {/* Step indicator */}
        <div className="chk-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`chk-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="chk-step-dot">{i < step ? '✓' : i + 1}</div>
              <span className="chk-step-label">{s}</span>
            </div>
          ))}
        </div>

        <div className="chk-body">

          {/* ── Step 0: Summary ── */}
          {step === 0 && (
            <div className="chk-section">
              <h3 className="chk-section-title">Order Summary</h3>
              <ul className="chk-item-list">
                {grouped.map(item => (
                  <li key={item.id} className="chk-item">
                    <img src={item.image} alt={item.name} className="chk-item-img" />
                    <div className="chk-item-info">
                      <p className="chk-item-name">{item.name}</p>
                      <p className="chk-item-meta">Qty: {item.qty} &nbsp;×&nbsp; ₹{item.price}</p>
                    </div>
                    <span className="chk-item-total">₹{item.price * item.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="chk-total-row">
                <span>Total</span><span className="chk-total-val">₹{total}</span>
              </div>
            </div>
          )}

          {/* ── Step 1: Address ── */}
          {step === 1 && (
            <div className="chk-section">
              <h3 className="chk-section-title">Delivery Address</h3>

              {addresses.length > 0 && !addingNew && (
                <>
                  <div className="chk-addr-list">
                    {addresses.map((a, i) => (
                      <label key={i} className={`chk-addr-card ${selectedAddr === i ? 'selected' : ''}`}>
                        <input type="radio" name="addr" checked={selectedAddr === i}
                          onChange={() => setSelectedAddr(i)} />
                        <div className="chk-addr-body">
                          {a.label && <p className="chk-addr-label">{a.label}</p>}
                          <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                          <p>{a.city}, {a.state} – {a.pincode}</p>
                          {a.phone && <p>📞 {a.phone}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                  <button className="chk-link-btn" onClick={() => setAddingNew(true)}>
                    + Add new address
                  </button>
                </>
              )}

              {(addingNew || addresses.length === 0) && (
                <div className="chk-addr-form">
                  {addresses.length > 0 && (
                    <button className="chk-link-btn" onClick={() => { setAddingNew(false); setError(''); }}>
                      ← Back to saved addresses
                    </button>
                  )}
                  <div className="chk-field-row">
                    <div className="chk-field">
                      <label>Label (e.g. Home)</label>
                      <input value={newAddr.label} onChange={e => setNewAddr(p => ({ ...p, label: e.target.value }))} placeholder="Home / Office" />
                    </div>
                    <div className="chk-field">
                      <label>Phone</label>
                      <input value={newAddr.phone} onChange={e => setNewAddr(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit mobile" />
                    </div>
                  </div>
                  <div className="chk-field">
                    <label>Address Line 1 *</label>
                    <input value={newAddr.line1} onChange={e => setNewAddr(p => ({ ...p, line1: e.target.value }))} placeholder="Flat / House no., Street" />
                  </div>
                  <div className="chk-field">
                    <label>Address Line 2</label>
                    <input value={newAddr.line2} onChange={e => setNewAddr(p => ({ ...p, line2: e.target.value }))} placeholder="Landmark, Area (optional)" />
                  </div>
                  <div className="chk-field-row">
                    <div className="chk-field">
                      <label>City *</label>
                      <input value={newAddr.city} onChange={e => setNewAddr(p => ({ ...p, city: e.target.value }))} placeholder="City" />
                    </div>
                    <div className="chk-field">
                      <label>State *</label>
                      <input value={newAddr.state} onChange={e => setNewAddr(p => ({ ...p, state: e.target.value }))} placeholder="State" />
                    </div>
                    <div className="chk-field chk-field--sm">
                      <label>Pincode *</label>
                      <input value={newAddr.pincode} onChange={e => setNewAddr(p => ({ ...p, pincode: e.target.value }))} placeholder="6 digits" maxLength={6} />
                    </div>
                  </div>
                  {error && <p className="chk-error">{error}</p>}
                  <button className="chk-save-btn" onClick={handleAddAddress}>Save Address</button>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Contact & Payment ── */}
          {step === 2 && (
            <div className="chk-section">
              <h3 className="chk-section-title">Contact Details</h3>
              <div className="chk-field-row">
                <div className="chk-field">
                  <label>Full Name *</label>
                  <input value={contact.name} onChange={e => setContact(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
                </div>
                <div className="chk-field">
                  <label>Phone *</label>
                  <input value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit mobile" />
                </div>
              </div>
              <div className="chk-field">
                <label>Email</label>
                <input value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
              </div>
              <div className="chk-field">
                <label>Order Notes (optional)</label>
                <textarea value={contact.notes} onChange={e => setContact(p => ({ ...p, notes: e.target.value }))} placeholder="Any special instructions..." rows={2} />
              </div>

              <h3 className="chk-section-title" style={{ marginTop: '1.5rem' }}>Payment Method</h3>
              <div className="chk-pay-options">
                {[
                  { val: 'cod',    label: '💵 Cash on Delivery', desc: 'Pay when you receive' },
                  { val: 'upi',    label: '📱 UPI / QR Code',    desc: 'GPay, PhonePe, Paytm' },
                  { val: 'online', label: '💳 Card / Net Banking', desc: 'Secure online payment' },
                ].map(opt => (
                  <label key={opt.val} className={`chk-pay-card ${payMethod === opt.val ? 'selected' : ''}`}>
                    <input type="radio" name="pay" value={opt.val} checked={payMethod === opt.val}
                      onChange={() => setPayMethod(opt.val)} />
                    <div>
                      <p className="chk-pay-label">{opt.label}</p>
                      <p className="chk-pay-desc">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 3 && success && (
            <div className="chk-success">
              <div className="chk-success-icon">🎉</div>
              <h3>Order Placed!</h3>
              <p>Thank you for your order. We'll confirm it shortly.</p>
              <button className="chk-primary-btn" onClick={onClose}>Done</button>
            </div>
          )}

          {error && step !== 1 && <p className="chk-error">{error}</p>}
        </div>

        {/* Footer nav */}
        {step !== 3 && (
          <div className="chk-footer">
            {step > 0 && (
              <button className="chk-back-btn" onClick={() => { setStep(s => s - 1); setError(''); }}>
                ← Back
              </button>
            )}
            {step < 2 && (
              <button
                className="chk-primary-btn"
                disabled={step === 1 && !canProceedStep1}
                onClick={() => { setError(''); setStep(s => s + 1); }}
              >
                Next →
              </button>
            )}
            {step === 2 && (
              <button
                className="chk-primary-btn"
                disabled={!canProceedStep2 || placing}
                onClick={handlePlaceOrder}
              >
                {placing ? 'Placing…' : '🛒 Place Order'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
