import { useState } from 'react'
import './FilterBar.css'
 
 
// The actual filter logic — called from App.jsx

export default function FilterBar({ includeVal, excludeVal, onIncludeChange, onExcludeChange, filteredCount, totalCount }) {
  const [focused, setFocused] = useState(null)
  const isActive = includeVal.trim() || excludeVal.trim()
 
  function clear() {
    onIncludeChange('')
    onExcludeChange('')
  }
 
  return (
    <div className={`filterbar ${isActive ? 'filterbar--active' : ''}`}>
      <div className="filterbar__inputs">
 
        {/* Include */}
        <div className={`filterbar__field ${focused === 'include' ? 'filterbar__field--focused' : ''}`}>
          <span className="filterbar__mode filterbar__mode--include">show</span>
          <input
            id="filter-include"
            name="filter-include"
            className="filterbar__input"
            type="text"
            placeholder="keywords to show…"
            value={includeVal}
            onChange={e => onIncludeChange(e.target.value)}
            onFocus={() => setFocused('include')}
            onBlur={() => setFocused(null)}
            spellCheck={false}
          />
        </div>
 
        <div className="filterbar__divider" />
 
        {/* Exclude */}
        <div className={`filterbar__field ${focused === 'exclude' ? 'filterbar__field--focused' : ''}`}>
          <span className="filterbar__mode filterbar__mode--exclude">hide</span>
          <input
            id="filter-exclude"
            name="filter-exclude"
            className="filterbar__input"
            type="text"
            placeholder="keywords to hide…"
            value={excludeVal}
            onChange={e => onExcludeChange(e.target.value)}
            onFocus={() => setFocused('exclude')}
            onBlur={() => setFocused(null)}
            spellCheck={false}
          />
        </div>
 
      </div>
 
      {/* Right side: count + clear */}
      <div className="filterbar__right">
        {isActive && (
          <>
            <span className="filterbar__count">
              {filteredCount} <span className="filterbar__count-of">of {totalCount}</span>
            </span>
            <button className="filterbar__clear" onClick={clear} title="Clear filters">
              ✕
            </button>
          </>
        )}
        {!isActive && (
          <span className="filterbar__hint">separate multiple keywords with commas</span>
        )}
      </div>
 
    </div>
  )
}