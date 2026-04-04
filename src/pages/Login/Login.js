import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('password'); // 'password' | 'otp'
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setOtpTimer(30);
    timerRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setOtpSent(true);
      startTimer();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setLoading(true);
    try {
      let res, data;
      if (mode === 'password') {
        res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile, password }),
        });
      } else {
        const otpCode = otp.join('');
        if (otpCode.length < 6) { setError('Enter the 6-digit OTP.'); setLoading(false); return; }
        res = await fetch(`${API}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile, otp: otpCode }),
        });
      }
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob--1" />
        <div className="auth-blob auth-blob--2" />
        <div className="auth-particles">
          {[...Array(8)].map((_, i) => <span key={i} className="auth-particle" style={{ '--i': i }} />)}
        </div>
      </div>

      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <img src="/shivani_pickles_logo.png" alt="Shivani Pickles" className="auth-logo__img" />
          <div>
            <span className="auth-logo__name">Shivani Pickles</span>
            <span className="auth-logo__sub">Artisan Pickles</span>
          </div>
        </Link>

        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Mode Toggle */}
        <div className="auth-mode-toggle">
          <button
            id="login-mode-password"
            className={`auth-mode-btn ${mode === 'password' ? 'active' : ''}`}
            onClick={() => { setMode('password'); setError(''); setOtpSent(false); }}
            type="button"
          >
            🔑 Password
          </button>
          <button
            id="login-mode-otp"
            className={`auth-mode-btn ${mode === 'otp' ? 'active' : ''}`}
            onClick={() => { setMode('otp'); setError(''); }}
            type="button"
          >
            📱 OTP
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Mobile */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-mobile">Mobile Number</label>
            <div className="auth-input-wrap">
              <span className="auth-input-prefix">🇮🇳 +91</span>
              <input
                id="login-mobile"
                className="auth-input auth-input--with-prefix"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Password mode */}
          {mode === 'password' && (
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="login-password"
                  className="auth-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="auth-row-right">
                <Link to="/forgot-password" className="auth-link--small">Forgot password?</Link>
              </div>
            </div>
          )}

          {/* OTP mode */}
          {mode === 'otp' && (
            <>
              {!otpSent ? (
                <button
                  id="send-otp-btn"
                  type="button"
                  className="auth-btn auth-btn--outline"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? <span className="auth-spinner" /> : 'Send OTP'}
                </button>
              ) : (
                <div className="auth-field">
                  <label className="auth-label">Enter OTP</label>
                  <div className="auth-otp-row" onPaste={handleOtpPaste}>
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        id={`otp-digit-${i}`}
                        className="auth-otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => handleOtpChange(e.target.value, i)}
                        onKeyDown={e => handleOtpKeyDown(e, i)}
                      />
                    ))}
                  </div>
                  <div className="auth-otp-resend">
                    {otpTimer > 0 ? (
                      <span className="auth-text-muted">Resend OTP in {otpTimer}s</span>
                    ) : (
                      <button type="button" className="auth-link" onClick={handleSendOtp}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {error && <div className="auth-error" role="alert">{error}</div>}

          {(mode === 'password' || (mode === 'otp' && otpSent)) && (
            <button
              id="login-submit-btn"
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? <span className="auth-spinner" /> : 'Sign In'}
            </button>
          )}
        </form>

        <div className="auth-footer">
          <span className="auth-text-muted">Don't have an account? </span>
          <Link to="/register" className="auth-link">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
