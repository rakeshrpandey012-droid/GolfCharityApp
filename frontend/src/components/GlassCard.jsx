import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, onClick }) {
  return (
    <motion.div
      className={`glass ${className}`}
      whileHover={hover ? { y: -4, borderColor: 'rgba(255,255,255,0.2)' } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
}
