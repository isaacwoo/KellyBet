import React, { useState } from 'react';
import { Match } from '../types';
import { calculateProbabilities } from '../utils/calculations';
import './NewMatchModal.css';

interface NewMatchModalProps {
  onClose: () => void;
  onSave: (match: Match) => void;
}

const NewMatchModal: React.FC<NewMatchModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [odds, setOdds] = useState({ home: 0, draw: 0, away: 0 });
  const [bankroll, setBankroll] = useState(1000);

  const handleOddsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOdds(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSave = () => {
    const probabilities = calculateProbabilities(odds);
    const newMatch: Match = {
      id: Date.now().toString(),
      title: title.trim() || undefined, // 如果标题为空，则不包含此字段
      initialOdds: odds,
      liveOdds: odds,
      currentMinute: 0, // Add the currentMinute property
      probabilities,
      initialBankroll: bankroll,
    };
    onSave(newMatch);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>新建比赛</h2>
        <label>
          比赛标题:
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="输入比赛标题（可选）"
          />
        </label>
        <label>
          初始资金:
          <input 
            type="number" 
            value={bankroll} 
            onChange={(e) => setBankroll(parseFloat(e.target.value) || 0)} 
          />
        </label>
        <label>
          主胜赔率:
          <input type="number" name="home" value={odds.home} onChange={handleOddsChange} />
        </label>
        <label>
          平局赔率:
          <input type="number" name="draw" value={odds.draw} onChange={handleOddsChange} />
        </label>
        <label>
          客胜赔率:
          <input type="number" name="away" value={odds.away} onChange={handleOddsChange} />
        </label>
        <div className="modal-buttons">
          <button onClick={handleSave}>保存</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};

export default NewMatchModal;
