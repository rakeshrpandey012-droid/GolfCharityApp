import React, { useState } from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  const [,setHoveredPlan] = useState(null);

  const pricingPlans = [
    {
      id: 1,
      name: 'Casual Golfer',
      price: 4.99,
      period: 'month',
      description: 'Perfect for occasional players',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Scorecard tracking',
        'Basic statistics',
        '2 Charity draws per month',
        'Weekly leaderboards',
        'Email support',
      ],
      cta: 'Start Free Trial',
      ctaStyle: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 2,
      name: 'Serious Competitor',
      price: 9.99,
      period: 'month',
      description: 'For dedicated golf enthusiasts',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Everything in Casual',
        'Advanced analytics & insights',
        'Unlimited charity draws',
        'Private group tournaments',
        'Priority support',
        'Custom handicap tracking',
        'Performance reports',
      ],
      cta: 'Get Premium',
      ctaStyle: 'bg-purple-600 hover:bg-purple-700',
      popular: true,
    },
    {
      id: 3,
      name: 'Pro Champion',
      price: 19.99,
      period: 'month',
      description: 'For tournament players',
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Everything in Serious',
        'Tournament organization tools',
        'Live scoring updates',
        'Professional stats dashboard',
        '24/7 phone & email support',
        'Custom branding for events',
        'API access for developers',
        'Dedicated account manager',
      ],
      cta: 'Contact Sales',
      ctaStyle: 'bg-yellow-600 hover:bg-yellow-700',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const scaleVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-sm font-semibold">
              🎯 PRICING PLANS
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan to elevate your golf game and support charities you care about
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              onHoverStart={() => setHoveredPlan(plan.id)}
              onHoverEnd={() => setHoveredPlan(null)}
              whileHover="hover"
              className="relative h-full"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </motion.div>
              )}

              <motion.div
                variants={scaleVariants}
                className={`relative h-full rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-pink-900/30 pt-8'
                    : 'border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50'
                } p-8 flex flex-col hover:shadow-2xl hover:shadow-purple-500/20`}
              >
                {/* Plan Header */}
                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} mb-4`}></div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-gray-400 text-lg">/{plan.period}</span>
                  </div>

                  {plan.id === 1 && (
                    <p className="text-sm text-blue-400">First month free</p>
                  )}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white mb-8 transition-all duration-300 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </motion.button>

                {/* Features List */}
                <div className="flex-grow space-y-4">
                  {plan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full mt-0.5 bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                question: 'Can I change my plan anytime?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
              },
              {
                question: 'Is there a free trial?',
                answer: 'Absolutely! All plans include a free trial period so you can explore all features before committing.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and Apple Pay for your convenience.',
              },
              {
                question: 'Can I cancel anytime?',
                answer: 'Yes, cancel anytime without penalties. Your access continues until the end of your billing period.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600/50 transition-colors"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-4">Questions about plans? We're here to help.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold transition-all"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Pricing;
