import React, { useState } from 'react';
import { calculateKelly, estimateWinProbability, analyzeOdds } from '../utils/calculations';
import { getStoredMatches } from '../utils/storage';

const OddsAnalyzer: React.FC = () => {
  const [currentOdds, setCurrentOdds] = useState({ home: 0, draw: 0, away: 0 });
  const [analysis, setAnalysis] = useState('');

  const handleOddsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentOdds(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const analyzeCurrentOdds = () => {
    const storedMatches = getStoredMatches();
    const winProbability = estimateWinProbability(currentOdds);
    const kellyResult = calculateKelly(winProbability, currentOdds.home);
    const oddsAnalysis = analyzeOdds(currentOdds, storedMatches);

    setAnalysis(`
      估计胜率: ${winProbability.toFixed(2)}
      凯利指数建议: ${kellyResult.toFixed(2)}
      赔率分析: ${oddsAnalysis}
    `);
  };

  return (
    <div>
      <h2>赔率分析器</h2>
      <input name="home" type="number" step="0.01" value={currentOdds.home} onChange={handleOddsChange} placeholder="当前主胜赔率" />
      <input name="draw" type="number" step="0.01" value={currentOdds.draw} onChange={handleOddsChange} placeholder="当前平局赔率" />
      <input name="away" type="number" step="0.01" value={currentOdds.away} onChange={handleOddsChange} placeholder="当前客胜赔率" />
      <button onClick={analyzeCurrentOdds}>分析</button>
      <pre>{analysis}</pre>
    </div>
  );
};

export default OddsAnalyzer;
