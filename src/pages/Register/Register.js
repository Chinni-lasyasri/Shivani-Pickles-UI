import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  // Step 0 — Account
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const otpRefs = React.useRef([]);
  const timerRef = React.useRef(null);

  // Step 1 — Personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  // Step 2 — Address
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  React.useEffect(() => () => clearInterval(timerRef.current), []);

  const startTimer = () => {
    setOtpTimer(30);
    clearInterval(timerRef.current);
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
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) { setOtp(text.split('')); otpRefs.current[5]?.focus(); }
    e.preventDefault();
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) { setError('Enter all 6 digits.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify-otp-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');
      setOtpVerified(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const validateStep0 = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) return 'Enter a valid 10-digit mobile number.';
    if (!otpVerified) return 'Please verify your mobile number with OTP.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/\d/.test(password)) return 'Password must contain at least one number.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const validateStep1 = () => {
    if (!firstName.trim()) return 'First name is required.';
    if (!lastName.trim()) return 'Last name is required.';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.';
    return '';
  };

  const validateStep2 = () => {
    if (!addressLine1.trim()) return 'Address line 1 is required.';
    if (!city.trim()) return 'City is required.';
    if (!state.trim()) return 'State is required.';
    if (!/^\d{6}$/.test(pincode)) return 'Enter a valid 6-digit pincode.';
    return '';
  };

  const handleNext = () => {
    let err = '';
    if (step === 0) err = validateStep0();
    if (step === 1) err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          password,
          firstName,
          lastName,
          email: email || undefined,
          dob: dob || undefined,
          gender: gender || undefined,
          address: {
            line1: addressLine1,
            line2: addressLine2 || undefined,
            city,
            state,
            pincode,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const INDIAN_STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
    'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
    'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
    'Chandigarh','Puducherry','Andaman & Nicobar','Dadra & Nagar Haveli','Daman & Diu','Lakshadweep',
  ];

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob--1" />
        <div className="auth-blob auth-blob--2" />
        <div className="auth-particles">
          {[...Array(8)].map((_, i) => <span key={i} className="auth-particle" style={{ '--i': i }} />)}
        </div>
      </div>

      <div className="auth-card auth-card--wide">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <img src="/shivani_pickles_logo.png" alt="Shivani Pickles" className="auth-logo__img" />
          <div>
            <span className="auth-logo__name">Shivani Pickles</span>
            <span className="auth-logo__sub">Artisan Pickles</span>
          </div>
        </Link>

        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us for an amazing pickle experience</p>
        </div>

        {/* Step Indicator */}
        <div className="auth-steps">
          {['Account', 'Personal', 'Address'].map((label, i) => (
            <React.Fragment key={i}>
              <div className={`auth-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                <div className="auth-step__dot">
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="auth-step__label">{label}</span>
              </div>
              {i < 2 && <div className={`auth-step__line ${i < step ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* ── STEP 0: Account ── */}
          {step === 0 && (
            <>
              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-mobile">Mobile Number *</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-prefix">🇮🇳 +91</span>
                  <input
                    id="reg-mobile"
                    className="auth-input auth-input--with-prefix"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobile}
                    onChange={e => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setOtpSent(false); setOtpVerified(false); }}
                    disabled={otpVerified}
                    autoComplete="tel"
                  />
                  {otpVerified && <span className="auth-verified-badge">✓ Verified</span>}
                </div>
              </div>

              {!otpVerified && (
                <>
                  <button
                    id="reg-send-otp-btn"
                    type="button"
                    className="auth-btn auth-btn--outline"
                    onClick={handleSendOtp}
                    disabled={loading || mobile.length < 10}
                  >
                    {loading && !otpSent ? <span className="auth-spinner" /> : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>

                  {otpSent && (
                    <div className="auth-field">
                      <label className="auth-label">Enter OTP sent to +91 {mobile}</label>
                      <div className="auth-otp-row" onPaste={handleOtpPaste}>
                        {otp.map((d, i) => (
                          <input
                            key={i}
                            ref={el => otpRefs.current[i] = el}
                            id={`reg-otp-${i}`}
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
                        {otpTimer > 0
                          ? <span className="auth-text-muted">Resend in {otpTimer}s</span>
                          : <button type="button" className="auth-link" onClick={handleSendOtp}>Resend OTP</button>
                        }
                      </div>
                      <button
                        id="reg-verify-otp-btn"
                        type="button"
                        className="auth-btn auth-btn--outline"
                        onClick={handleVerifyOtp}
                        disabled={loading || otp.join('').length < 6}
                      >
                        {loading ? <span className="auth-spinner" /> : 'Verify OTP'}
                      </button>
                    </div>
                  )}
                </>
              )}

              {otpVerified && (
                <>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-password">Create Password *</label>
                    <div className="auth-input-wrap">
                      <input
                        id="reg-password"
                        className="auth-input"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Min 8 chars, 1 uppercase, 1 number"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                        {showPass ? '🙈' : '👁️'}
                      </button>
                    </div>
                    <PasswordStrength password={password} />
                  </div>

                  <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-confirm-password">Confirm Password *</label>
                    <div className="auth-input-wrap">
                      <input
                        id="reg-confirm-password"
                        className="auth-input"
                        type={showConfPass ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowConfPass(p => !p)} tabIndex={-1}>
                        {showConfPass ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <span className="auth-hint auth-hint--error">Passwords do not match</span>
                    )}
                    {confirmPassword && password === confirmPassword && (
                      <span className="auth-hint auth-hint--success">✓ Passwords match</span>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── STEP 1: Personal ── */}
          {step === 1 && (
            <>
              <div className="auth-row-2">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-first-name">First Name *</label>
                  <input
                    id="reg-first-name"
                    className="auth-input"
                    type="text"
                    placeholder="Priya"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-last-name">Last Name *</label>
                  <input
                    id="reg-last-name"
                    className="auth-input"
                    type="text"
                    placeholder="Sharma"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-email">Email Address <span className="auth-optional">(optional)</span></label>
                <input
                  id="reg-email"
                  className="auth-input"
                  type="email"
                  placeholder="priya@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="auth-row-2">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-dob">Date of Birth <span className="auth-optional">(optional)</span></label>
                  <input
                    id="reg-dob"
                    className="auth-input"
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-gender">Gender <span className="auth-optional">(optional)</span></label>
                  <select
                    id="reg-gender"
                    className="auth-input auth-select"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Address ── */}
          {step === 2 && (
            <>
              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-addr1">Address Line 1 *</label>
                <input
                  id="reg-addr1"
                  className="auth-input"
                  type="text"
                  placeholder="House / Flat No., Street"
                  value={addressLine1}
                  onChange={e => setAddressLine1(e.target.value)}
                  autoComplete="address-line1"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-addr2">Address Line 2 <span className="auth-optional">(optional)</span></label>
                <input
                  id="reg-addr2"
                  className="auth-input"
                  type="text"
                  placeholder="Landmark, Area"
                  value={addressLine2}
                  onChange={e => setAddressLine2(e.target.value)}
                  autoComplete="address-line2"
                />
              </div>

              <div className="auth-row-3">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-city">City *</label>
                  <input
                    id="reg-city"
                    className="auth-input"
                    type="text"
                    placeholder="Mumbai"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    autoComplete="address-level2"
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-state">State *</label>
                  <select
                    id="reg-state"
                    className="auth-input auth-select"
                    value={state}
                    onChange={e => setState(e.target.value)}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-pincode">Pincode *</label>
                  <input
                    id="reg-pincode"
                    className="auth-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="400001"
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    autoComplete="postal-code"
                  />
                </div>
              </div>
            </>
          )}

          {error && <div className="auth-error" role="alert">{error}</div>}

          <div className="auth-btn-row">
            {step > 0 && (
              <button
                type="button"
                className="auth-btn auth-btn--ghost"
                onClick={() => { setStep(s => s - 1); setError(''); }}
              >
                ← Back
              </button>
            )}

            {step < 2 ? (
              <button
                id="reg-next-btn"
                type="button"
                className="auth-btn"
                onClick={handleNext}
                disabled={loading}
              >
                Next →
              </button>
            ) : (
              <button
                id="reg-submit-btn"
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? <span className="auth-spinner" /> : '🎉 Create Account'}
              </button>
            )}
          </div>
        </form>

        <div className="auth-footer">
          <span className="auth-text-muted">Already have an account? </span>
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;
    return score;
  };
  if (!password) return null;
  const strength = getStrength();
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['', '#c0392b', '#e67e22', '#d4a017', '#6aa84f', '#27ae60'];
  return (
    <div className="auth-strength">
      <div className="auth-strength__bars">
        {[1,2,3,4,5].map(i => (
          <div
            key={i}
            className="auth-strength__bar"
            style={{ background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
      <span className="auth-strength__label" style={{ color: colors[strength] }}>
        {labels[strength]}
      </span>
    </div>
  );
}
