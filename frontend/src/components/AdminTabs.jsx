import React from 'react'

export default function AdminTabs({tabs, active, onChange}){
  return (
    <div className="flex gap-2 border-b pb-3 mb-6">
      {tabs.map(t=> (
        <button key={t.key} onClick={()=>onChange(t.key)} className={`px-4 py-2 rounded-t-md text-sm ${active===t.key? 'bg-white shadow-md text-gray-900': 'text-gray-500'}`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}
