import React, { useState, useEffect } from 'react';
import { calculateProbabilities } from '../utils/calculations';

interface MatchData {
  initialOdds: { home: number; draw: number; away: number };
  probabilities: { home: number; draw: number; away: number };
}

interface MatchFormProps {
  setProbabilities: React.Dispatch<React.SetStateAction<{ home: number; draw: number; away: number }>>;
}

const MatchForm: React.FC<MatchFormProps> = ({ setProbabilities }) => {
  const [matchData, setMatchData] = useState<MatchData>({
    initialOdds: { home: 0, draw: 0, away: 0 },
    probabilities: { home: 0, draw: 0, away: 0 },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newOdds = { ...matchData.initialOdds, [name]: parseFloat(value) };
    const probabilities = calculateProbabilities(newOdds);
    setMatchData({ initialOdds: newOdds, probabilities });
  };

  useEffect(() => {
    setProbabilities(matchData.probabilities);
  }, [matchData.probabilities, setProbabilities]);

  return (
    <form>
      <div>
        <label htmlFor="home">主胜赔率：</label>
        <input
          id="home"
          name="home"
          type="number"
          step="0.01"
          value={matchData.initialOdds.home || ''}
          onChange={handleInputChange}
          placeholder="请输入主胜赔率"
        />
      </div>
      <div>
        <label htmlFor="draw">平局赔率：</label>
        <input
          id="draw"
          name="draw"
          type="number"
          step="0.01"
          value={matchData.initialOdds.draw || ''}
          onChange={handleInputChange}
          placeholder="请输入平局赔率"
        />
      </div>
      <div>
        <label htmlFor="away">客胜赔率：</label>
        <input
          id="away"
          name="away"
          type="number"
          step="0.01"
          value={matchData.initialOdds.away || ''}
          onChange={handleInputChange}
          placeholder="请输入客胜赔率"
        />
      </div>
      <div>
        <h3>计算出的概率：</h3>
        <p>主胜概率：{(matchData.probabilities.home * 100).toFixed(2)}%</p>
        <p>平局概率：{(matchData.probabilities.draw * 100).toFixed(2)}%</p>
        <p>客胜概率：{(matchData.probabilities.away * 100).toFixed(2)}%</p>
      </div>
    </form>
  );
};

export default MatchForm;
