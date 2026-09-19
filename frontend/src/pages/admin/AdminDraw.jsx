import { useState, useEffect } from 'react';
import { createDraftDraw, getDrawHistory, simulateDraw, publishDraw } from '../../api/api';
import toast from 'react-hot-toast';

export default function AdminDraw() {
  const [month, setMonth] = useState('');
  const [type, setType] = useState('random');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await getDrawHistory();
      setHistory(res.data || []);
    } catch {
      setHistory([]);
    }
  }

  const handleCreate = async () => {
    setLoading(true);
    try {
      await createDraftDraw({ month, type });
      toast.success('Draft created');
      await loadHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async (id) => {
    try {
      await simulateDraw(id);
      toast.success('Simulation complete');
      await loadHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Simulation failed');
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishDraw(id);
      toast.success('Published');
      await loadHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Publish failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Draw Management</h2>
      <div className="p-4 bg-white rounded mb-6">
          <div className="grid grid-cols-3 gap-3">
            <input type="month" value={month} onChange={e=>setMonth(e.target.value)} className="col-span-1 border p-2 rounded" />
            <select value={type} onChange={e=>setType(e.target.value)} className="col-span-1 border p-2 rounded">
              <option value="random">Random</option>
              <option value="weighted">Algorithm-weighted</option>
            </select>
            <div className="col-span-1 flex gap-2">
              <button onClick={handleCreate} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60">
                {loading ? 'Creating...' : 'Create Draft'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Drafts & History</h3>
          <div className="space-y-3">
            {history.length===0 && <div className="text-sm text-gray-500">No draws yet</div>}
            {history.map(d=> (
              <div key={d._id} className="p-3 bg-white rounded border flex items-center justify-between">
                <div>
                  <div className="font-medium">{d.month || d._id}</div>
                  <div className="text-sm text-gray-500">Type: {d.type} — Status: {d.status}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>handleSimulate(d._id)} className="px-3 py-1 border rounded">Simulate</button>
                  <button onClick={()=>handlePublish(d._id)} className="px-3 py-1 bg-green-600 text-white rounded">Publish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}
