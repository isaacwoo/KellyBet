import React from 'react';
import { Match } from '../types';
import './MatchCard.css';

interface MatchCardProps {
  match: Match;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onSelect, onDelete, isSelected }) => {
  return (
    <div className={`match-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(match.id)}>
      <button 
        className="delete-button" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(match.id);
        }}
      >
        ×
      </button>
      <h3>{match.title || `比赛 ${match.id.slice(0, 8)}...`}</h3>
      <div className="probabilities">
        <div className="probability">
          <span>主胜</span>
          <span>{(match.probabilities.home * 100).toFixed(2)}%</span>
        </div>
        <div className="probability">
          <span>平局</span>
          <span>{(match.probabilities.draw * 100).toFixed(2)}%</span>
        </div>
        <div className="probability">
          <span>客胜</span>
          <span>{(match.probabilities.away * 100).toFixed(2)}%</span>
        </div>
      </div>
      <div className="initial-odds">
        <div className="odd">
          <span>{match.initialOdds.home.toFixed(2)}</span>
        </div>
        <div className="odd">
          <span>{match.initialOdds.draw.toFixed(2)}</span>
        </div>
        <div className="odd">
          <span>{match.initialOdds.away.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
