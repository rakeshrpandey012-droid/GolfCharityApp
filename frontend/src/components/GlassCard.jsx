import { motion } from 'framer-motion';

const MotionDiv = motion.div;

export default function GlassCard({ children, className = '', hover = true, onClick }) {
  return (
    <MotionDiv
      className={`glass ${className}`}
      whileHover={hover ? { y: -4, borderColor: 'rgba(255,255,255,0.2)' } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </MotionDiv>
  );
}
