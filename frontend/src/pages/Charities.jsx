import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Filter } from 'lucide-react';

const Charities = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const charities = [
    {
      id: 1,
      name: 'World Golf Foundation',
      category: 'golf',
      description: 'Supporting youth golf development and accessibility worldwide.',
      raised: 125000,
      supporters: 450,
      icon: '⛳',
    },
    {
      id: 2,
      name: 'Children\'s Hospital Foundation',
      category: 'health',
      description: 'Providing medical care and support to children in need.',
      raised: 200000,
      supporters: 680,
      icon: '🏥',
    },
    {
      id: 3,
      name: 'Global Climate Action',
      category: 'environment',
      description: 'Fighting climate change through innovation and education.',
      raised: 150000,
      supporters: 520,
      icon: '🌍',
    },
    {
      id: 4,
      name: 'Education for All',
      category: 'education',
      description: 'Bringing quality education to underprivileged communities.',
      raised: 175000,
      supporters: 610,
      icon: '📚',
    },
    {
      id: 5,
      name: 'Veterans Support Network',
      category: 'military',
      description: 'Supporting military veterans in their transition to civilian life.',
      raised: 185000,
      supporters: 640,
      icon: '🎖️',
    },
    {
      id: 6,
      name: 'Hunger Relief International',
      category: 'hunger',
      description: 'Fighting world hunger and providing sustainable food solutions.',
      raised: 210000,
      supporters: 720,
      icon: '🍽️',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Charities' },
    { id: 'golf', label: 'Golf' },
    { id: 'health', label: 'Health' },
    { id: 'environment', label: 'Environment' },
    { id: 'education', label: 'Education' },
    { id: 'military', label: 'Military' },
    { id: 'hunger', label: 'Hunger Relief' },
  ];

  const filtered = selectedCategory === 'all'
    ? charities
    : charities.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Support Charities You Love
          </h1>
          <p className="text-xl text-gray-300">
            Choose from our partner charities and make a difference with every game
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  : 'bg-slate-800/50 text-gray-300 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Charity Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {filtered.map((charity, index) => (
            <motion.div
              key={charity.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ translateY: -10 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all cursor-pointer group"
            >
              {/* Icon */}
              <motion.div
                className="text-6xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {charity.icon}
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2">{charity.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{charity.description}</p>

              {/* Stats */}
              <div className="space-y-3 mb-6 pt-6 border-t border-slate-700/50">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Funds Raised</span>
                    <span className="text-blue-400">${(charity.raised / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(charity.raised / 250000) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Heart size={16} />
                  <span>{charity.supporters} supporters</span>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all"
              >
                Choose This Charity
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 text-xl">No charities found in this category.</p>
          </motion.div>
        )}

        {/* Join CTA */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-12 border border-purple-700/50 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Add Your Charity?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            We are always looking to partner with amazing organizations making a real difference.
            Get in touch with us to learn about partnership opportunities.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Charities;
