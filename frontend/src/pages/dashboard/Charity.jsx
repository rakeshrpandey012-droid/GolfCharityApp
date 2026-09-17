import React, { useState } from 'react';
import { Search, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Charity() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharityId, setSelectedCharityId] = useState(1);
  const [contribution, setContribution] = useState(10);

  const charities = [
    { id: 1, name: 'Children Cancer Support', desc: 'Supporting treatment and family care for children with cancer.' },
    { id: 2, name: 'Clean Water Global', desc: 'Funding clean water projects in underserved communities.' },
    { id: 3, name: 'First Tee Youth Golf', desc: 'Helping young people build life skills through golf.' },
  ];

  const filteredCharities = charities.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectCharity = (id) => {
    setSelectedCharityId(id);
    toast.success("Primary charity updated!");
  };

  return (
    <div className="page-container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>My Charity</h1>
        <p className="text-secondary" style={{ fontSize: '14px' }}>Select your cause and adjust your contribution percentage</p>
      </div>

      {/* Contribution Slider */}
      <Card style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Contribution Percentage</h3>
            <p className="text-secondary" style={{ fontSize: '12px' }}>Minimum 10% of your subscription</p>
          </div>
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', 
            color: 'var(--color-success)', padding: '12px', borderRadius: '50%', 
            width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
          }}>
            {contribution}%
          </div>
        </div>

        <div className="slider-container">
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={contribution} 
            onChange={(e) => setContribution(e.target.value)}
            className="styled-slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>10% (min)</span>
            <span>50%</span>
            <span>100% (max)</span>
          </div>
        </div>
      </Card>

      {/* Charity Search */}
      <div style={{ marginBottom: '24px' }}>
        <Input 
          placeholder="Search charities..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          iconLeft={<Search size={18} />}
          style={{ background: 'var(--bg-tertiary)', border: 'none' }}
        />
      </div>

      {/* Charity Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {filteredCharities.map((charity) => {
          const isSelected = selectedCharityId === charity.id;
          
          return (
            <motion.div key={charity.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                padding: '24px'
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Heart size={20} color="var(--color-error)" fill="var(--color-error)" />
                </div>
                
                <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>{charity.name}</h4>
                <p className="text-secondary text-body-small" style={{ flex: 1, marginBottom: '24px', lineHeight: '1.6' }}>
                  {charity.desc}
                </p>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button 
                    className={isSelected ? 'btn-glow' : 'btn-secondary'}
                    style={{ flex: 1, padding: '0', height: '36px', fontSize: '14px', border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => handleSelectCharity(charity.id)}
                  >
                    Select
                  </Button>
                  <Button 
                    variant="secondary"
                    style={{ flex: 1, padding: '0', height: '36px', fontSize: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    Donate
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
