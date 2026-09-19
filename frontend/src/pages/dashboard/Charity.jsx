import React, { useEffect, useState } from 'react';
import { Search, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getCharities, selectCharity, donateToCharity } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function Charity() {
  const { user, refreshUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharityId, setSelectedCharityId] = useState('');
  const [contribution, setContribution] = useState(10);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState(25);
  const [isSaving, setIsSaving] = useState(false);

  const isSubscriptionActive = user?.subscriptionStatus === 'active';

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await getCharities();
        const list = response.data.charities || response.data || [];
        setCharities(list);

        const savedCharityId = typeof user?.charity === 'object' ? user.charity._id : user?.charity || list[0]?._id || '';
        if (savedCharityId) {
          setSelectedCharityId(savedCharityId);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load charities');
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, [user?.charity]);

  const filteredCharities = charities.filter((charity) =>
    charity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCharity = async (charityId) => {
    if (!isSubscriptionActive) {
      toast.error('Activate your subscription to choose a charity.');
      return;
    }

    try {
      setIsSaving(true);
      await selectCharity(charityId, contribution);
      setSelectedCharityId(charityId);
      await refreshUser();
      toast.success('Primary charity updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update charity');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDonate = async (charityId) => {
    const amount = Number(donationAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid donation amount.');
      return;
    }

    if (!isSubscriptionActive) {
      toast.error('Activate your subscription before making a donation.');
      return;
    }

    try {
      setIsSaving(true);
      await donateToCharity(charityId, amount);
      toast.success(`Donation of £${amount.toFixed(2)} sent successfully.`);
      setDonationAmount(25);
      await refreshUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Donation failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: 700 }}>My Charity</h1>
        <p className="text-secondary" style={{ fontSize: '14px' }}>
          Select your cause and adjust your contribution percentage
        </p>
      </div>

      {!isSubscriptionActive && (
        <Card style={{ marginBottom: '24px', padding: '16px 20px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.05)' }}>
          <p style={{ margin: 0, color: '#fca5a5', fontWeight: 600 }}>
            Your account is currently inactive. Activate a subscription to choose a charity or donate.
          </p>
        </Card>
      )}

      <Card style={{ marginBottom: '32px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
              Contribution Percentage
            </h3>
            <p className="text-secondary" style={{ fontSize: '12px' }}>
              Minimum 10% of your subscription
            </p>
          </div>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--color-success)',
              color: 'var(--color-success)',
              padding: '12px',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)',
              fontSize: '16px'
            }}
          >
            {contribution}%
          </div>
        </div>

        <div className="slider-container">
          <input
            type="range"
            min="10"
            max="100"
            value={contribution}
            onChange={(e) => setContribution(Number(e.target.value))}
            className="styled-slider"
            style={{ width: '100%' }}
            disabled={!isSubscriptionActive}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '12px',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <span>10% (min)</span>
            <span>50%</span>
            <span>100% (max)</span>
          </div>
        </div>
      </Card>

      <div style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Search charities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          iconLeft={<Search size={18} />}
          style={{ background: 'var(--bg-tertiary)', border: 'none' }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map((item) => (
            <Card key={item} style={{ padding: '24px', minHeight: '220px' }}>
              <div className="skeleton" style={{ height: '40px', width: '40px', borderRadius: '50%', marginBottom: '16px' }} />
              <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '80px', width: '100%', marginBottom: '16px' }} />
              <div className="skeleton" style={{ height: '36px', width: '100%' }} />
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredCharities.map((charity, index) => {
            const isSelected = selectedCharityId === charity._id;
            const canInteract = isSubscriptionActive;

            return (
              <div
                key={charity._id}
                style={{
                  opacity: 1,
                  transform: 'scale(1)',
                  transition: `all 0.3s ease ${index * 0.1}s`
                }}
              >
                <Card style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  border: isSelected ? '2px solid var(--brand)' : '1px solid var(--border)'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <Heart size={20} color="var(--color-error)" fill="var(--color-error)" />
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                    {charity.name}
                  </h4>
                  <p
                    className="text-secondary"
                    style={{
                      flex: 1,
                      marginBottom: '24px',
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}
                  >
                    {charity.description || 'Support this charity and help drive positive impact.'}
                  </p>

                  <div style={{ marginBottom: '16px' }}>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Donation amount"
                      disabled={!canInteract}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                      className={isSelected ? 'btn-primary' : 'btn-secondary'}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        height: '36px',
                        fontSize: '14px',
                        fontWeight: 600,
                        border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        background: isSelected ? 'var(--brand)' : 'transparent',
                        color: isSelected ? '#fff' : 'var(--text-primary)',
                        transition: 'all 0.2s ease',
                        opacity: canInteract ? 1 : 0.5,
                        cursor: canInteract ? 'pointer' : 'not-allowed'
                      }}
                      onClick={() => handleSelectCharity(charity._id)}
                      disabled={!canInteract || isSaving}
                    >
                      {isSelected ? '✓ Selected' : 'Select'}
                    </Button>
                    <Button
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        height: '36px',
                        fontSize: '14px',
                        fontWeight: 600,
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-primary)',
                        cursor: canInteract ? 'pointer' : 'not-allowed',
                        opacity: canInteract ? 1 : 0.5,
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleDonate(charity._id)}
                      disabled={!canInteract || isSaving}
                    >
                      Donate
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {filteredCharities.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontSize: '16px' }}>No charities found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}