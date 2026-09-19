import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Play, Pause, RotateCcw, Settings, Trash2, Plus } from 'lucide-react';
import ExecuteDrawEngine from './ExecuteDrawEngine';
import './DrawControl.css';

const DrawControl = () => {
  const navigate = useNavigate();
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [showEngineModal, setShowEngineModal] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [drawStats, setDrawStats] = useState({
    totalDraws: 0,
    activeDraw: 0,
    completedDraws: 0,
    totalPrizePool: 0,
  });

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDraws();
    fetchDrawStats();
  }, []);

  const fetchDraws = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/draws`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setDraws(response.data.draws || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch draws');
      console.error('Error fetching draws:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrawStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/draws/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setDrawStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleExecuteDraw = async (draw) => {
    if (!draw) {
      setError('No draw selected');
      return;
    }
    setSelectedDraw(draw);
    setShowEngineModal(true);
  };

  const handleDrawSuccess = async () => {
    setShowEngineModal(false);
    setSelectedDraw(null);
    await fetchDraws();
    await fetchDrawStats();
  };

  const toggleDrawStatus = async (drawId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const response = await axios.patch(
        `${API_BASE}/admin/draws/${drawId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );

      setDraws(draws.map(d => 
        d._id === drawId ? { ...d, status: newStatus } : d
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update draw status');
    }
  };

  const deleteDraw = async (drawId) => {
    if (!window.confirm('Are you sure you want to delete this draw?')) return;

    try {
      await axios.delete(`${API_BASE}/admin/draws/${drawId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      setDraws(draws.filter(d => d._id !== drawId));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete draw');
    }
  };

  const createNewDraw = () => {
    navigate('/admin/draws/create');
  };

  const filteredDraws = draws.filter(draw => {
    if (activeTab === 'active') return draw.status === 'active';
    if (activeTab === 'paused') return draw.status === 'paused';
    if (activeTab === 'completed') return draw.status === 'completed';
    return true;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: '#00d4ff',
      paused: '#ff9500',
      completed: '#30b030',
    };
    return colors[status] || '#666';
  };

  return (
    <div className="draw-control-container">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(100, 200, 255, 0.1)' }}>
            📊
          </div>
          <div className="stat-content">
            <div className="stat-value">{drawStats.totalDraws}</div>
            <div className="stat-label">Total Draws</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
            ▶️
          </div>
          <div className="stat-content">
            <div className="stat-value">{drawStats.activeDraw}</div>
            <div className="stat-label">Active Now</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(48, 176, 48, 0.1)' }}>
            ✓
          </div>
          <div className="stat-content">
            <div className="stat-value">{drawStats.completedDraws}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 149, 0, 0.1)' }}>
            💷
          </div>
          <div className="stat-content">
            <div className="stat-value">£{drawStats.totalPrizePool?.toFixed(2)}</div>
            <div className="stat-label">Prize Pool</div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="draw-header">
        <div>
          <h2>Draw Management</h2>
          <p>Manage and execute charity draws</p>
        </div>
        <button className="btn-primary" onClick={createNewDraw}>
          <Plus size={18} />
          Create New Draw
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="draw-tabs">
        {['active', 'paused', 'completed'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Draws List */}
      <div className="draws-section">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading draws...
          </div>
        ) : filteredDraws.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No {activeTab} draws found</p>
            <button className="btn-secondary" onClick={createNewDraw}>
              Create your first draw
            </button>
          </div>
        ) : (
          <div className="draws-grid">
            {filteredDraws.map(draw => (
              <div key={draw._id} className="draw-card">
                <div className="draw-card-header">
                  <div className="draw-info">
                    <h3>{draw.name}</h3>
                    <div className="draw-meta">
                      <span className="badge" style={{ background: getStatusColor(draw.status) }}>
                        {draw.status.toUpperCase()}
                      </span>
                      <span className="draw-date">
                        {new Date(draw.scheduledDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="draw-card-body">
                  <div className="draw-detail">
                    <span className="label">Prize Pool</span>
                    <span className="value">£{draw.prizePool?.toFixed(2)}</span>
                  </div>
                  <div className="draw-detail">
                    <span className="label">Participants</span>
                    <span className="value">{draw.participants?.length || 0}</span>
                  </div>
                  <div className="draw-detail">
                    <span className="label">Winners</span>
                    <span className="value">{draw.winners?.length || 0}</span>
                  </div>

                  {draw.description && (
                    <div className="draw-description">
                      {draw.description}
                    </div>
                  )}
                </div>

                <div className="draw-card-actions">
                  {draw.status === 'active' && (
                    <button
                      className="btn-execute"
                      onClick={() => handleExecuteDraw(draw)}
                      title="Execute this draw"
                    >
                      <Play size={16} />
                      Execute Draw
                    </button>
                  )}

                  <button
                    className={`btn-icon ${draw.status === 'active' ? 'btn-pause' : 'btn-resume'}`}
                    onClick={() => toggleDrawStatus(draw._id, draw.status)}
                    title={draw.status === 'active' ? 'Pause draw' : 'Resume draw'}
                  >
                    {draw.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  <button
                    className="btn-icon btn-settings"
                    onClick={() => navigate(`/admin/draws/${draw._id}/edit`)}
                    title="Edit draw"
                  >
                    <Settings size={16} />
                  </button>

                  <button
                    className="btn-icon btn-delete"
                    onClick={() => deleteDraw(draw._id)}
                    title="Delete draw"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Execute Draw Engine Modal */}
      {showEngineModal && selectedDraw && (
        <ExecuteDrawEngine
          draw={selectedDraw}
          onClose={() => setShowEngineModal(false)}
          onSuccess={handleDrawSuccess}
        />
      )}
    </div>
  );
};

export default DrawControl;
