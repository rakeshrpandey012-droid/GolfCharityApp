import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlowButton from '../components/GlowButton';
import { Trophy, Target, Heart, Shield, FileText, ArrowUpRight } from 'lucide-react';
import TiltCard from '../components/TiltCard';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page-bg" style={{ position: 'relative', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="hero-section"
        style={{ position: 'relative', padding: '140px 24px 80px', textAlign: 'center', zIndex: 10 }}
      >
        {/* Orbs for background depth */}
        <div className="orb orb-cyan" style={{ width: 600, height: 600, top: -200, left: '50%', transform: 'translateX(-50%)' }} />
        <div className="orb orb-blue" style={{ width: 800, height: 600, top: 100, left: -300 }} />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px',
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 99, color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600,
              letterSpacing: '0.05em', marginBottom: 32,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 8px #60a5fa' }} />
              Platform is Live
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 24,
              color: '#ffffff',
            }}
          >
            Turn Your <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Golf Scores</span> <br />
            Into Returns &amp; <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Real Impact</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: 600,
              margin: '0 auto 48px',
              lineHeight: 1.6,
            }}
          >
            GolfWin is a subscription platform that lets golfers log Stableford scores to enter monthly jackpot draws, while directly funding vital charities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <GlowButton size="lg" onClick={() => navigate('/register')} style={{ padding: '0 40px', height: 56, fontSize: '1.05rem' }}>
              Get Started
            </GlowButton>
          </motion.div>
        </div>
      </section>

      {/* ── BENTO BOX SHOWCASE ── */}
      <section className="landing-section" style={{ padding: '0 24px 120px', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="bento-grid">

            {/* Top Left: Score Tracking Component */}
            <TiltCard className="bento-col-4">
              <motion.div variants={fadeUp} className="bento-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: 'auto' }}>
                  <Target size={24} style={{ color: '#06b6d4', marginBottom: 16 }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'white', marginBottom: 8 }}>Score Tracking</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Log your 5 latest Stableford scores seamlessly via our dashboard.</p>
                </div>
                <div style={{ marginTop: 32, background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  {[36, 42, 38].map((score, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i !== 2 ? 12 : 0 }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: 20 }}>{i + 1}</div>
                      <div style={{ height: 6, flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(score / 45) * 100}%`, background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: 3 }} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>{score}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TiltCard>

            {/* Top Center: The Draw Engine (Hero Bento) */}
            <TiltCard className="bento-col-8">
              <motion.div variants={fadeUp} className="bento-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', position: 'relative', height: '100%' }}>
                <div style={{ padding: '32px 32px 0', zIndex: 10, position: 'relative' }}>
                  <Trophy size={24} style={{ color: '#3b82f6', marginBottom: 16 }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'white', marginBottom: 8 }}>Monthly Random Draws</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 400 }}>Matches are computed automatically using our provably fair logic engine. Match 3, 4, or 5 numbers to win.</p>
                </div>

                {/* Graphic container */}
                <div style={{ position: 'relative', flex: 1, minHeight: 200, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', bottom: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: -50, width: 300, height: 150, border: '1px solid rgba(59,130,246,0.4)', borderRadius: '50%', borderBottomColor: 'transparent', transform: 'rotateX(60deg)', boxShadow: '0 -10px 40px rgba(59,130,246,0.2)' }} />
                  <div style={{ position: 'absolute', bottom: -30, width: 220, height: 110, border: '1px solid rgba(139,92,246,0.5)', borderRadius: '50%', borderBottomColor: 'transparent', transform: 'rotateX(60deg)', boxShadow: '0 -10px 30px rgba(139,92,246,0.3)' }} />
                  <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 10, paddingBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[12, 24, 31, 38, 45].map((n, i) => (
                      <div key={i} style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.4))', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, boxShadow: '0 10px 20px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TiltCard>

            {/* Bottom Row - 3 cols */}
            <TiltCard className="bento-col-4">
              <motion.div variants={fadeUp} className="bento-card" style={{ padding: 32, height: '100%' }}>
                <Heart size={24} style={{ color: '#10b981', marginBottom: 16 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'white', marginBottom: 8 }}>Charity Impact</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>A minimum 10% of every subscription automatically funds verified charitable causes.</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Cancer Research', 'Help for Heroes', '+10 More'].map(c => (
                    <span key={c} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', border: '1px solid rgba(16,185,129,0.2)' }}>{c}</span>
                  ))}
                </div>
              </motion.div>
            </TiltCard>

            <TiltCard className="bento-col-4">
              <motion.div variants={fadeUp} className="bento-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
                <Shield size={32} style={{ color: '#8b5cf6', marginBottom: 16, opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'white', marginBottom: 8 }}>Secure &amp; Verified</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All prize distributions are verified by admin review before payouts process.</p>
              </motion.div>
            </TiltCard>

            <TiltCard className="bento-col-4">
              <motion.div variants={fadeUp} className="bento-card" style={{ padding: 32, height: '100%' }}>
                <FileText size={24} style={{ color: '#f59e0b', marginBottom: 16 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'white', marginBottom: 8 }}>Transparent Ledgers</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>Real-time analytics on prize pools, subscriber counts, and charitable donations.</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Pool</span>
                  <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 600 }}>£12,450.00</span>
                </div>
              </motion.div>
            </TiltCard>

          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="landing-section" style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 20 }}>
        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 500, color: 'white' }}>How It Works</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, maxWidth: 500, margin: '12px auto 0', lineHeight: 1.6 }}>Three simple steps to enter the draws and start making a real impact.</p>
        </motion.div>

        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="bento-grid">
          {[
            { step: '01', icon: Shield, title: 'Subscribe & Connect', desc: 'Join the platform and select your preferred charity. A minimum 10% of your subscription goes directly to them.' },
            { step: '02', icon: Target, title: 'Log 5 Scores', desc: 'Enter 5 Stableford scores (1-45) via the dashboard. We automatically use your most recent 5 scores for every draw.' },
            { step: '03', icon: Trophy, title: 'Win Monthly', desc: 'Match your scores against our provably fair monthly draw. Match 3, 4, or 5 numbers to claim your share of the pool.' }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="bento-card bento-col-4" style={{ padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.1)', fontSize: '4rem', fontWeight: 800, lineHeight: 1, position: 'absolute', top: 20, right: 20, fontFamily: "'Inter', sans-serif" }}>{item.step}</div>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: '#60a5fa' }}>
                <item.icon size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'white', marginBottom: 12 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── PRIZES ── */}
      <section id="prizes" className="landing-section" style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 500, color: 'white' }}>Prize Pool Tiers</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, maxWidth: 500, margin: '12px auto 0', lineHeight: 1.6 }}>The total prize pool is divided fairly based on how many numbers you match.</p>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="bento-grid">
            {[
              { match: '5-Number Match', share: '40%', color: '#f59e0b', label: 'Jackpot (Rollover if no winner)', glow: 'rgba(245,158,11,0.15)' },
              { match: '4-Number Match', share: '35%', color: '#3b82f6', label: 'Second Tier', glow: 'rgba(59,130,246,0.1)' },
              { match: '3-Number Match', share: '25%', color: '#8b5cf6', label: 'Third Tier', glow: 'rgba(139,92,246,0.1)' },
            ].map(tier => (
              <motion.div key={tier.match} variants={fadeUp} className="bento-card bento-col-4" style={{ padding: 40, textAlign: 'center', background: `radial-gradient(circle at center 0%, ${tier.glow} 0%, transparent 60%)` }}>
                <div style={{ color: tier.color, fontSize: '3rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>{tier.share}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 500, color: 'white', marginBottom: 8 }}>{tier.match}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{tier.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CHARITIES ── */}
      <section id="charities" className="landing-section" style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 20 }}>
        <div className="bento-grid charities-grid" style={{ alignItems: 'center' }}>
          <motion.div
            variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}
            className="bento-col-5 charities-text"
            style={{ paddingRight: 40 }}
          >
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 500, color: 'white', marginBottom: 24, lineHeight: 1.1 }}>
              Transparent <br /><span style={{ color: '#10b981' }}>Charitable Impact</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 24 }}>
              When you subscribe, you aren't just playing for yourself. You select exactly which verified charity receives your dedicated contribution.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 40 }}>
              Watch the global impact meters fill up in real time as our community drives thousands of pounds directly to front-line causes.
            </p>
            <GlowButton onClick={() => navigate('/register')} variant="ghost">Join the Mission</GlowButton>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="bento-col-7" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { name: 'Cancer Research UK', raised: '£34,200', pct: 72, color: '#3b82f6' },
              { name: 'Help for Heroes', raised: '£28,500', pct: 60, color: '#8b5cf6' },
              { name: 'Macmillan Cancer Support', raised: '£21,800', pct: 46, color: '#10b981' },
            ].map(c => (
              <motion.div key={c.name} variants={fadeUp} className="bento-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 500, fontSize: '1rem', color: 'white' }}>{c.name}</div>
                  <div style={{ color: c.color, fontWeight: 600, fontSize: '1rem' }}>{c.raised}</div>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                    viewport={{ once: true }}
                    style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${c.color}, ${c.color}99)`, boxShadow: `0 0 12px ${c.color}66` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="landing-section" style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 500, color: 'white' }}>Simple, Transparent Pricing</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, maxWidth: 500, margin: '12px auto 0', lineHeight: 1.6 }}>Choose the subscription tier that best fits your game.</p>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="bento-grid">
            {/* Monthly */}
            <motion.div variants={fadeUp} className="bento-card bento-col-4" style={{ padding: 48, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 16 }}>Monthly Plan</h3>
              <div style={{ fontSize: '3rem', color: 'white', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>
                £9.99<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 32 }}>Perfect for getting started and entering the monthly draws.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', gap: 16, display: 'flex', flexDirection: 'column', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#10b981' }}>✓</span> Enter 1 draw per month</li>
                <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#10b981' }}>✓</span> 10% Charity Donation</li>
                <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#10b981' }}>✓</span> Score Tracking Dashboard</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <GlowButton variant="ghost" style={{ width: '100%', minHeight: 48 }} onClick={() => navigate('/register')}>Subscribe Monthly</GlowButton>
              </div>
            </motion.div>

            {/* Yearly (Highlighted) */}
            <motion.div variants={fadeUp} className="bento-card bento-col-4" style={{ padding: 48, display: 'flex', flexDirection: 'column', background: 'linear-gradient(145deg, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0.01) 100%)', borderColor: 'rgba(59,130,246,0.3)' }}>
              <div className="pricing-popular-badge" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: 'white', padding: '4px 16px', borderBottomLeftRadius: 8, borderBottomRightRadius: 8, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Most Popular</div>
              <h3 style={{ fontSize: '1.25rem', color: '#60a5fa', fontWeight: 500, marginBottom: 16 }}>Yearly Plan</h3>
              <div style={{ fontSize: '3rem', color: 'white', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>
                £99.99<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/yr</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 32 }}>Save 20% by committing to a year of golf and giving.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', gap: 16, display: 'flex', flexDirection: 'column', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#3b82f6' }}>✓</span> Enter all 12 monthly draws</li>
                <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#3b82f6' }}>✓</span> Guaranteed 10% Charity Share</li>
                <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#3b82f6' }}>✓</span> Priority Support Access</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <GlowButton style={{ width: '100%', minHeight: 48 }} onClick={() => navigate('/register')}>Subscribe Yearly</GlowButton>
              </div>
            </motion.div>

            {/* Pro Plus */}
            <motion.div variants={fadeUp} className="bento-card bento-col-4" style={{ padding: 48, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 16 }}>Pro Plus</h3>
              <div style={{ fontSize: '3rem', color: 'white', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>
                £19.99<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 32 }}>For dedicated golfers wanting maximum impact.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', gap: 16, display: 'flex', flexDirection: 'column', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8b5cf6' }}>✓</span> Everything in Standard</li>
                <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8b5cf6' }}>✓</span> 20% Charity Donation</li>
                <li style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8b5cf6' }}>✓</span> Exclusive Founder Badge</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <GlowButton variant="ghost" style={{ width: '100%', minHeight: 48 }} onClick={() => navigate('/register')}>Get Pro Plus</GlowButton>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: '80px 16px 120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bento-card cta-box"
          style={{
            maxWidth: 800, margin: '0 auto', padding: '80px 48px', textAlign: 'center',
            background: 'radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)',
          }}
        >
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 500, marginBottom: 16, color: 'white' }}>
            Ready to hit the green?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Join the platform that adds incredible value to your game and the causes you care about.
          </p>
          <GlowButton size="lg" onClick={() => navigate('/register')} style={{ padding: '0 40px', height: 56, fontSize: '1.05rem' }}>
            Subscribe Now <ArrowUpRight size={18} style={{ marginLeft: 8 }} />
          </GlowButton>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 16px', textAlign: 'center', background: '#020617' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © 2026 GolfWin Platform · Built by Digital Heroes
        </div>
      </footer>
    </div>
  );
}
