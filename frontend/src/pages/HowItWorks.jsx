import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Sign Up & Create Account',
      description: 'Quick registration process. Choose your favorite charity.',
      icon: '📝',
    },
    {
      number: 2,
      title: 'Log Your Scores',
      description: 'Track your golf performance with our intuitive scorecard.',
      icon: '⛳',
    },
    {
      number: 3,
      title: 'Compete & Win',
      description: 'Join tournaments and compete for monthly prizes.',
      icon: '🏆',
    },
    {
      number: 4,
      title: 'Support Causes',
      description: '10% of your subscription automatically goes to your charity.',
      icon: '❤️',
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">How It Works</h1>
          <p className="text-xl text-gray-300">
            Simple steps to start your golf journey with purpose
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Content */}
              <div className={`flex-1 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="inline-block text-5xl mb-4">{step.icon}</div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  Step {step.number}: {step.title}
                </h3>
                <p className="text-gray-300 text-lg mb-4">{step.description}</p>
                <div className="flex items-center gap-2 text-blue-400">
                  <CheckCircle size={20} />
                  <span>Easy setup - takes less than 5 minutes</span>
                </div>
              </div>

              {/* Number Circle */}
              <div className={`flex-shrink-0 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center"
                >
                  <span className="text-4xl font-bold text-white">{step.number}</span>
                </motion.div>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="hidden md:block text-gray-500"
                >
                  <ArrowRight size={32} className="rotate-90" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700/50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-12">Common Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: 'Do I need a golf handicap?',
                a: 'No, GolfWin is for all skill levels. Whether you are a beginner or pro, track your improvement.',
              },
              {
                q: 'How are charities paid?',
                a: 'We process donations monthly. 10% of each subscription automatically goes to your selected charity.',
              },
              {
                q: 'Can I change my charity?',
                a: 'Yes, you can update your charity preference anytime from your account settings.',
              },
              {
                q: 'Are there any hidden fees?',
                a: 'No hidden fees. What you see is what you pay. No surprises.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                <p className="text-gray-300">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
