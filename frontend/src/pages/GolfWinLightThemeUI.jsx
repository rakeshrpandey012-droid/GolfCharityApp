import React, { useState } from 'react';
import '../styles/lightTheme.css';

const GolfWinLightThemeUI = () => {
  const [_activeNav] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  return (
    <div data-theme="light" className="min-h-screen bg-white">
      {/* ============ NAVIGATION ============ */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⛳</span>
            </div>
            <span className="font-bold text-xl text-gray-900">GolfWin</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8">
            {['How It Works', 'Prizes', 'Charities', 'Pricing'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex gap-4 items-center">
            <button className="text-gray-700 hover:text-gray-900">🌙</button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="pt-32 pb-20 px-4 bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            🎉 Platform is Live
          </span>
          
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Your Golf Scores Into Returns & <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Real Impact</span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            GolfWin is a subscription platform that lets golfers log Stableford scores to enter monthly jackpot draws, while directly funding vital charities.
          </p>
          
          <button className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105">
            Get Started →
          </button>
        </div>
      </section>

      {/* ============ SUBSCRIPTION PRICING ============ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Choose the subscription tier that best fits your game.
          </h2>
          
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selectedPlan === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Monthly Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Plan</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started and entering the monthly draws.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">$</span>
                <span className="text-2xl text-gray-600 font-semibold">/mo</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-teal-500 text-lg">✓</span>
                  <span className="text-gray-700">Enter 1 draw per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-teal-500 text-lg">✓</span>
                  <span className="text-gray-700">10% Charity Donation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-teal-500 text-lg">✓</span>
                  <span className="text-gray-700">Score Tracking Dashboard</span>
                </li>
              </ul>

              <button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Subscribe Monthly
              </button>
            </div>

            {/* Yearly Plan - Featured */}
            <div className="bg-linear-to-br from-blue-50 to-purple-50 border-2 border-blue-500 rounded-2xl p-8 relative transform hover:shadow-2xl transition-all md:scale-105">
              <span className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </span>
              
              <h3 className="text-2xl font-bold text-blue-600 mb-2">Yearly Plan</h3>
              <p className="text-gray-700 mb-6">Save 20% by committing to a year of golf and giving.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">£99.99</span>
                <span className="text-2xl text-gray-600 font-semibold">/yr</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 text-lg">✓</span>
                  <span className="text-gray-700 font-semibold">Enter all 12 monthly draws</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 text-lg">✓</span>
                  <span className="text-gray-700 font-semibold">Guaranteed 10% Charity Share</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 text-lg">✓</span>
                  <span className="text-gray-700 font-semibold">Priority Support Access</span>
                </li>
              </ul>

              <button className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                Subscribe Yearly
              </button>
            </div>

            {/* Pro Plus Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Plus</h3>
              <p className="text-gray-600 mb-6">For dedicated golfers wanting maximum impact.</p>
              
              <div className="mb-8">
                <span className="text-2xl text-gray-600 font-semibold">/mo</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-purple-500 text-lg">✓</span>
                  <span className="text-gray-700">Everything in Standard</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-500 text-lg">✓</span>
                  <span className="text-gray-700">20% Charity Donation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-500 text-lg">✓</span>
                  <span className="text-gray-700">Exclusive Founder Badge</span>
                </li>
              </ul>

              <button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Get Pro Plus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CHARITABLE IMPACT ============ */}
      <section className="py-20 px-4 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Transparent <span className="text-teal-600">Charitable Impact</span>
              </h2>
              
              <p className="text-lg text-gray-700 mb-6">
                When you subscribe, you aren't just playing for yourself. You select exactly which verified charity receives your dedicated contribution.
              </p>
              
              <p className="text-lg text-gray-700 mb-8">
                Watch the global impact meters fill up in real time as our community drives thousands of pounds directly to front-line causes.
              </p>
              
              <button className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors">
                Join the Mission
              </button>
            </div>

            {/* Impact Progress Bars */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">Cancer Research</h4>
                  <span className="text-2xl font-bold text-blue-600">£34,200</span>
                </div>
                <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '72%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">Mental Health Support</h4>
                  <span className="text-2xl font-bold text-purple-600">£28,500</span>
                </div>
                <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">Child Welfare</h4>
                  <span className="text-2xl font-bold text-teal-600">£21,800</span>
                </div>
                <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: '46%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRIZE POOL BREAKDOWN ============ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Prize Pool Tiers
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12">
            The total prize pool is divided fairly based on how many numbers you match.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 40% - Jackpot */}
            <div className="bg-linear-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-yellow-500 mb-4">40%</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">5-Number Match</h3>
              <p className="text-gray-700 font-semibold">
                Jackpot (Rollover if no winner)
              </p>
            </div>

            {/* 35% - Second Tier */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-blue-500 mb-4">35%</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">4-Number Match</h3>
              <p className="text-gray-700 font-semibold">
                Second Tier Prize
              </p>
            </div>

            {/* 25% - Third Tier */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-purple-500 mb-4">25%</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">3-Number Match</h3>
              <p className="text-gray-700 font-semibold">
                Third Tier Prize
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 px-4 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12">
            Three simple steps to enter the draws and start making a real impact.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join & Select Charity</h3>
              <p className="text-gray-700">
                Join the platform and select your preferred charity. A minimum 10% of your subscription goes directly to them.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Log Your Scores</h3>
              <p className="text-gray-700">
                Enter 5 Stableford scores (1-45) via the dashboard. We automatically use your most recent 5 scores for every draw.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Match & Win</h3>
              <p className="text-gray-700">
                Match your scores against our provably fair monthly draw. Match 3, 4, or 5 numbers to claim your share of the pool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Platform Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Charities</h3>
              <p className="text-gray-700 mb-4">
                A minimum 10% of every subscription automatically funds verified charitable causes.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">Cancer Research</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">Help for Heroes</span>
              </div>
              <button className="text-teal-600 font-semibold mt-4 hover:text-teal-700">
                +10 More →
              </button>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fair & Transparent</h3>
              <p className="text-gray-700">
                All prize distributions are verified by admin review before payouts process.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
              <p className="text-gray-700">
                Real-time analytics on prize pools, subscriber counts, and charitable donations.
              </p>
              <div className="mt-6 bg-gray-100 rounded-lg p-4">
                <p className="text-gray-600 text-sm font-semibold">Current Pool</p>
                <p className="text-3xl font-bold text-orange-500">$14,480.00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-20 px-4 bg-linear-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Hit the Green?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of golfers making a real impact on causes they care about.
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105">
            Get Started Today →
          </button>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Charities</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Follow</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
            <p>&copy; 2026 GolfWin. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GolfWinLightThemeUI;
