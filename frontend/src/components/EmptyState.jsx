import React from 'react'

export default function EmptyState({title = 'No data yet', description, ctaLabel, onCta}){
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/60 rounded-lg shadow-sm border border-gray-100">
      <div className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">{title}</div>
      {description && <p className="text-gray-600 mb-6 max-w-xl text-center">{description}</p>}
      {ctaLabel && (
        <button onClick={onCta} className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition">
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
