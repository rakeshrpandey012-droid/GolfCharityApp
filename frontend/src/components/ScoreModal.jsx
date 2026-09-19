/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'

function formatISO(date){
  const d = new Date(date)
  return d.toISOString().slice(0,10)
}

export default function ScoreModal({isOpen, onClose, onSave, existingScores = [], initialDate, initialScore}){
  const [date, setDate] = useState(initialDate ? formatISO(initialDate) : '')
  const [score, setScore] = useState(initialScore ?? '')
  const [error, setError] = useState('')

  useEffect(()=>{
    setDate(initialDate ? formatISO(initialDate) : '')
    setScore(initialScore ?? '')
    setError('')
  },[isOpen, initialDate, initialScore])

  if(!isOpen) return null

  const handleSubmit = (e)=>{
    e.preventDefault()
    setError('')
    if(!date){ setError('Please select a date'); return }
    const numeric = Number(score)
    if(!Number.isInteger(numeric) || numeric < 1 || numeric > 45){ setError('Score must be an integer between 1 and 45'); return }
    // duplicate date check
    const exists = existingScores.some(s => s.date === date)
    if(exists){ setError('A score for this date already exists'); return }

    // build new array applying rolling 5 logic
    const newScores = [...existingScores, {date, score: numeric}]
    // sort ascending by date to identify oldest
    newScores.sort((a,b)=> new Date(a.date) - new Date(b.date))
    if(newScores.length > 5) newScores.shift()
    // return reverse-chronological for display
    const display = [...newScores].sort((a,b)=> new Date(b.date) - new Date(a.date))
    onSave(display)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Add Stableford Score</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Stableford Score (1-45)</label>
            <input type="number" value={score} onChange={e=>setScore(e.target.value)} min={1} max={45} className="w-full border px-3 py-2 rounded" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
