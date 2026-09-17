import { motion } from 'framer-motion';

export default function GlowButton({
  children, onClick, type = 'button', className = '',
  variant = 'primary', size = 'md', loading = false, disabled = false,
}) {
  const sizes = { sm: '8px 16px', md: '12px 24px', lg: '16px 36px' };
  const fontSize = { sm: '0.8rem', md: '0.95rem', lg: '1.05rem' };

  const cls =
    variant === 'primary' ? 'btn-glow' :
    variant === 'green' ? 'btn-glow btn-green' :
    'btn-ghost';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${cls} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      style={{
        padding: sizes[size],
        fontSize: fontSize[size],
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 14, height: 14,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          Loading...
        </span>
      ) : children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.button>
  );
}
