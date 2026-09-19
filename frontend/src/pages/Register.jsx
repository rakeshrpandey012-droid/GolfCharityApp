import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { register } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function ThemeTogglePill() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle" 
      aria-label="Toggle theme" 
      style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}
    >
      <div className="theme-toggle-knob">{theme === 'dark' ? '🌙' : '☀️'}</div>
    </button>
  );
}

const Field = ({ label, name, type = 'text', placeholder, icon: Icon, value, onChange, error, disabled, ...rest }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <div className="form-input-wrap">
      {Icon && <span className="input-icon input-icon-l"><Icon size={18} /></span>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-input${Icon ? ' has-icon-l' : ''}${error ? ' error' : ''}`}
        {...rest}
      />
    </div>
    {error && <span className="form-error">{error}</span>}
  </div>
);

const STEPS = ['Account', 'Details', 'Confirm'];

export default function Register() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    phone: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
    setErrors(err => ({ ...err, [e.target.name]: undefined }));
  };

  const validateStep = () => {
    const errs = {};

    if (step === 0) {
      if (!form.name.trim()) {
        errs.name = 'Full name is required.';
      }
      if (!form.email.trim()) {
        errs.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errs.email = 'Please enter a valid email address.';
      }
    }

    if (step === 1) {
      if (form.password.length < 8) {
        errs.password = 'Password must be at least 8 characters.';
      } else if (!/[A-Z]/.test(form.password)) {
        errs.password = 'Password must contain at least one uppercase letter.';
      } else if (!/[0-9]/.test(form.password)) {
        errs.password = 'Password must contain at least one number.';
      }

      if (form.password !== form.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
    }

    if (step === 2) {
      if (!form.dob) {
        errs.dob = 'Date of birth is required.';
      }
      if (!form.agreeTerms) {
        errs.agreeTerms = 'You must agree to the terms to continue.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        dob: form.dob,
        phone: form.phone,
      });

      if (res.data && res.data.token && res.data.user) {
        const { token, user } = res.data;
        loginUser(token, user);
        toast.success('Account created successfully! Welcome to GolfWin 🎉');
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Field component is declared above Register to avoid remounting on every render

  return (
    <div className="page-bg" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 24 
    }}>
      <ThemeTogglePill />

      <Motion.div 
        initial={{ opacity: 0, y: 24 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="sidebar-logo-icon" style={{ margin: '0 auto 16px', fontSize: '2.5rem' }}>⛳</div>
          <h2 style={{ marginBottom: 8, fontWeight: 700, fontSize: '24px' }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Join GolfWin and start making an impact today
          </p>
        </div>

        {/* Step progress indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div 
              key={s} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flex: i < STEPS.length - 1 ? 1 : 'none', 
                gap: 8 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: i <= step ? 'var(--grad-brand)' : 'var(--bg-overlay)',
                  color: i <= step ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.3s ease',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: i === step ? 600 : 400, 
                  color: i === step ? 'var(--text-primary)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap'
                }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ 
                  flex: 1, 
                  height: 2, 
                  borderRadius: 2, 
                  background: i < step ? 'var(--brand)' : 'var(--border)', 
                  transition: 'background 0.3s ease'
                }} />
              )}
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '32px 28px' }}>
          <AnimatePresence mode="wait">
            <Motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <form onSubmit={step < 2 ? handleNext : handleSubmit}>
                {step === 0 && (
                  <>
                    <Field 
                      label="Full Name"
                      name="name"
                      icon={User}
                      placeholder="John Doe"
                      required
                      value={form.name}
                      onChange={handleChange}
                      error={errors.name}
                      disabled={loading}
                    />
                    <Field 
                      label="Email Address"
                      name="email"
                      type="email"
                      icon={Mail}
                      placeholder="you@example.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                      error={errors.email}
                      disabled={loading}
                    />
                  </>
                )}

                {step === 1 && (
                  <>
                    <Field 
                      label="Password"
                      name="password"
                      type="password"
                      icon={Lock}
                      placeholder="Min 8 characters, 1 uppercase, 1 number"
                      required
                      value={form.password}
                      onChange={handleChange}
                      error={errors.password}
                      disabled={loading}
                    />
                    <Field 
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      icon={Lock}
                      placeholder="Repeat your password"
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      disabled={loading}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field 
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      icon={Calendar}
                      required
                      value={form.dob}
                      onChange={handleChange}
                      error={errors.dob}
                      disabled={loading}
                    />
                    <Field 
                      label="Phone Number (Optional)"
                      name="phone"
                      type="tel"
                      icon={Phone}
                      placeholder="+44 7700 900000"
                      value={form.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      disabled={loading}
                    />
                    <div className="form-group" style={{ marginTop: 16 }}>
                      <label style={{ 
                        display: 'flex', 
                        gap: 12, 
                        alignItems: 'flex-start', 
                        cursor: 'pointer', 
                        fontSize: '0.875rem', 
                        color: 'var(--text-secondary)'
                      }}>
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={form.agreeTerms}
                          onChange={handleChange}
                          disabled={loading}
                          style={{ 
                            marginTop: 3, 
                            accentColor: 'var(--brand)', 
                            flexShrink: 0,
                            cursor: 'pointer'
                          }}
                        />
                        <span>
                          I agree to GolfWin's{' '}
                          <a href="#" style={{ fontWeight: 600, color: 'var(--brand)' }}>
                            Terms of Service
                          </a>
                          {' '}&amp;{' '}
                          <a href="#" style={{ fontWeight: 600, color: 'var(--brand)' }}>
                            Privacy Policy
                          </a>
                          . I confirm I am 18+.
                        </span>
                      </label>
                      {errors.agreeTerms && (
                        <span className="form-error">{errors.agreeTerms}</span>
                      )}
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                  {step > 0 && (
                    <button 
                      type="button" 
                      onClick={handleBack}
                      disabled={loading}
                      className="btn btn-secondary"
                      style={{ minWidth: 44, padding: '0 12px' }}
                    >
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn btn-primary" 
                    style={{ 
                      flex: 1,
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" style={{ marginRight: '8px' }} />
                        {step < 2 ? 'Next...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        {step < 2 ? (
                          <>Next <ChevronRight size={18} style={{ marginLeft: '8px' }} /></>
                        ) : (
                          <>Create Account 🎉</>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Motion.div>
          </AnimatePresence>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--brand)' }}>
              Log in
            </Link>
          </p>
        </div>
      </Motion.div>
    </div>
  );
}
