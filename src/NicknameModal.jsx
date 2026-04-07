import { useState } from 'react';
import './NicknameModal.css';

export default function NicknameModal({ onSave }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) onSave(value.trim());
  };

  return (
    <div className="nickname-overlay">
      <div className="nickname-modal">
        <div className="nickname-logo"><span>Lucy</span>News</div>
        <h2>Welcome to LucyNews</h2>
        <p>Pick a nickname to tag your saved articles.<br />No account needed — it stays on this device.</p>
        <input
          type="text"
          placeholder="Your nickname"
          value={value}
          maxLength={30}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button onClick={handleSubmit} disabled={!value.trim()}>
          Let's go →
        </button>
      </div>
    </div>
  );
}