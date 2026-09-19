import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Zap,
  TrendingUp,
  Users,
  Trophy
} from 'lucide-react';
import './ExecuteDrawEngine.css';

const ExecuteDrawEngine = ({ draw, onClose, onSuccess }) => {
  const [engineState, setEngineState] = useState('idle'); // idle, running, paused, completed, error
  const [algorithmOutput, setAlgorithmOutput] = useState([]);
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [drawProgress, setDrawProgress] = useState(0);
  const [processedPool, setProcessedPool] = useState('£0.00');
  const [error, setError] = useState('');
  const [liveMetrics, setLiveMetrics] = useState({
    processedParticipants: 0,
    weighedScore: 0,
    poolDistribution: 0,
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const engineIntervalRef = useRef(null);
  const wsRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    return () => {
      if (engineIntervalRef.current) clearInterval(engineIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/admin/draws/${draw._id}/execute`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'progress':
          setDrawProgress(data.progress);
          setLiveMetrics(data.metrics);
          setProcessedPool(`£${data.processedPool.toFixed(2)}`);
          break;
        case 'algorithm_output':
          setAlgorithmOutput(prev => [...prev, data.output]);
          break;
        case 'winner_selected':
          setSelectedWinners(prev => [...prev, data.winner]);
          break;
        case 'completed':
          setEngineState('completed');
          setSelectedWinners(data.winners);
          break;
        case 'error':
          setError(data.message);
          setEngineState('error');
          break;
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Please try again.');
      setEngineState('error');
    };
  };

  const startDraw = async () => {
    try {
      setError('');
      setEngineState('running');
      setAlgorithmOutput([]);
      setSelectedWinners([]);
      setDrawProgress(0);
      setProcessedPool('£0.00');

      connectWebSocket();

      // Send start command
      const response = await axios.post(
        `${API_BASE}/admin/draws/${draw._id}/execute`,
        { action: 'start' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );

      if (response.data.error) {
        setError(response.data.error);
        setEngineState('error');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start draw');
      setEngineState('error');
      console.error('Error starting draw:', err);
    }
  };

  const pauseDraw = async () => {
    try {
      await axios.post(
        `${API_BASE}/admin/draws/${draw._id}/execute`,
        { action: 'pause' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      setEngineState('paused');
    } catch (err) {
      setError('Failed to pause draw');
    }
  };

  const resumeDraw = async () => {
    try {
      await axios.post(
        `${API_BASE}/admin/draws/${draw._id}/execute`,
        { action: 'resume' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      setEngineState('running');
    } catch (err) {
      setError('Failed to resume draw');
    }
  };

  const confirmWinners = async () => {
    try {
      setIsConfirming(true);
      const response = await axios.post(
        `${API_BASE}/admin/draws/${draw._id}/confirm-winners`,
        { 
          winners: selectedWinners,
          drawId: draw._id 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );

      if (response.data.success) {
        onSuccess();
      } else {
        setError(response.data.message || 'Failed to confirm winners');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm winners');
      console.error('Error confirming winners:', err);
    } finally {
      setIsConfirming(false);
    }
  };

  const resetDraw = () => {
    setEngineState('idle');
    setAlgorithmOutput([]);
    setSelectedWinners([]);
    setDrawProgress(0);
    setProcessedPool('£0.00');
    setError('');
    if (wsRef.current) wsRef.current.close();
  };

  return (
    <div className="engine-modal-overlay">
      <div className="engine-modal">
        <div className="engine-modal-header">
          <div className="engine-title">
            <Zap className="engine-icon" size={24} />
            <div>
              <h2>Execute Draw Engine</h2>
              <p className="draw-name">{draw.name}</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="engine-modal-content">
          {/* Live Metrics Dashboard */}
          <div className="metrics-dashboard">
            <div className="metric-card">
              <div className="metric-icon">
                <Users size={20} />
              </div>
              <div className="metric-info">
                <div className="metric-value">{liveMetrics.processedParticipants}</div>
                <div className="metric-label">Processed Participants</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <TrendingUp size={20} />
              </div>
              <div className="metric-info">
                <div className="metric-value">{liveMetrics.weighedScore.toFixed(2)}</div>
                <div className="metric-label">Weighted Score</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <Trophy size={20} />
              </div>
              <div className="metric-info">
                <div className="metric-value">{processedPool}</div>
                <div className="metric-label">Processed Pool</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <Zap size={20} />
              </div>
              <div className="metric-info">
                <div className="metric-value">{drawProgress}%</div>
                <div className="metric-label">Engine Progress</div>
              </div>
            </div>
          </div>

          {/* Live Engine Interface */}
          <div className="engine-section">
            <h3>Live Engine Interface</h3>
            <div className="live-interface">
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${drawProgress}%` }}
                  >
                    {drawProgress > 0 && <span className="progress-label">{drawProgress}%</span>}
                  </div>
                </div>
              </div>

              {/* Algorithm Output Visualization */}
              <div className="algorithm-output">
                <h4>Algorithm Output</h4>
                <div className="algorithm-stream">
                  {algorithmOutput.length === 0 ? (
                    <div className="stream-empty">
                      <div className="spinner-small"></div>
                      {engineState === 'idle' ? 'Ready to execute draw...' : 'Processing participants...'}
                    </div>
                  ) : (
                    algorithmOutput.slice(-5).map((output, idx) => (
                      <div key={idx} className="algorithm-line">
                        <span className="algo-timestamp">
                          {new Date(output.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="algo-text">{output.data}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="engine-status">
                <div className={`status-badge status-${engineState}`}>
                  {engineState === 'running' && (
                    <>
                      <span className="pulse"></span>
                      RUNNING
                    </>
                  )}
                  {engineState === 'paused' && (
                    <>
                      <span></span>
                      PAUSED
                    </>
                  )}
                  {engineState === 'completed' && (
                    <>
                      <Check size={16} />
                      COMPLETED
                    </>
                  )}
                  {engineState === 'error' && (
                    <>
                      <AlertCircle size={16} />
                      ERROR
                    </>
                  )}
                  {engineState === 'idle' && (
                    <>
                      <span></span>
                      IDLE
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Control Protocols */}
          <div className="control-protocols">
            <h3>Control Protocols</h3>
            <div className="protocol-buttons">
              {engineState === 'idle' && (
                <button 
                  className="btn-protocol btn-start"
                  onClick={startDraw}
                  disabled={isConfirming}
                >
                  <Play size={18} />
                  Start Engine
                </button>
              )}

              {engineState === 'running' && (
                <button 
                  className="btn-protocol btn-pause"
                  onClick={pauseDraw}
                  disabled={isConfirming}
                >
                  <Pause size={18} />
                  Pause Engine
                </button>
              )}

              {engineState === 'paused' && (
                <>
                  <button 
                    className="btn-protocol btn-resume"
                    onClick={resumeDraw}
                    disabled={isConfirming}
                  >
                    <Play size={18} />
                    Resume Engine
                  </button>
                  <button 
                    className="btn-protocol btn-reset"
                    onClick={resetDraw}
                    disabled={isConfirming}
                  >
                    <RotateCcw size={18} />
                    Reset
                  </button>
                </>
              )}

              {engineState === 'completed' && (
                <>
                  <button 
                    className="btn-protocol btn-confirm"
                    onClick={confirmWinners}
                    disabled={isConfirming || selectedWinners.length === 0}
                  >
                    {isConfirming ? 'Confirming...' : <><Check size={18} /> Confirm Winners</>}
                  </button>
                  <button 
                    className="btn-protocol btn-reset"
                    onClick={resetDraw}
                    disabled={isConfirming}
                  >
                    <RotateCcw size={18} />
                    Restart
                  </button>
                </>
              )}

              {engineState === 'error' && (
                <button 
                  className="btn-protocol btn-reset"
                  onClick={resetDraw}
                >
                  <RotateCcw size={18} />
                  Try Again
                </button>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Winners Preview */}
          {selectedWinners.length > 0 && (
            <div className="winners-section">
              <h3>Selected Winners ({selectedWinners.length})</h3>
              <div className="winners-list">
                {selectedWinners.map((winner, idx) => (
                  <div key={idx} className="winner-card">
                    <div className="winner-rank">#{idx + 1}</div>
                    <div className="winner-info">
                      <div className="winner-name">{winner.participantName}</div>
                      <div className="winner-prize">Prize: £{winner.prizeAmount?.toFixed(2)}</div>
                    </div>
                    <div className="winner-score">Score: {winner.score?.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecuteDrawEngine;
