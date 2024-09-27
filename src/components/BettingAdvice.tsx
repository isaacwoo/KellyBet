import React from 'react';
import { Match, HistoryData } from '../types';
import { calculateKellyBet } from '../utils/calculations';
import './BettingAdvice.css';

interface BettingAdviceProps {
  match: Match;
  onUpdateLiveOdds: (id: string, liveOdds: { home: number; draw: number; away: number }) => void;
  onUpdateCurrentMinute: (id: string, currentMinute: number) => void;
  onSaveHistory: (data: HistoryData) => void;
}

const BettingAdvice: React.FC<BettingAdviceProps> = ({ match, onUpdateLiveOdds, onUpdateCurrentMinute, onSaveHistory }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'currentMinute') {
      onUpdateCurrentMinute(match.id, parseInt(value) || 0);
    } else {
      const newLiveOdds = { ...match.liveOdds, [name]: parseFloat(value) || 0 };
      onUpdateLiveOdds(match.id, newLiveOdds);
    }
  };

  const calculateAdvice = () => {
    const homeBet = calculateKellyBet(match.probabilities.home, match.liveOdds.home, match.initialBankroll);
    const drawBet = calculateKellyBet(match.probabilities.draw, match.liveOdds.draw, match.initialBankroll);
    const awayBet = calculateKellyBet(match.probabilities.away, match.liveOdds.away, match.initialBankroll);

    return { home: homeBet, draw: drawBet, away: awayBet };
  };

  const advice = calculateAdvice();

  const handleSaveHistory = () => {
    const historyData: HistoryData = {
      id: Date.now().toString(),
      matchId: match.id,
      matchTitle: match.title,
      initialOdds: match.initialOdds,
      liveOdds: match.liveOdds,
      currentMinute: match.currentMinute,
      result: null
    };
    onSaveHistory(historyData);
  };

  return (
    <div className="betting-advice">
      <div className="input-group">
        <label htmlFor="currentMinute">比赛时间（分钟）：</label>
        <input
          id="currentMinute"
          name="currentMinute"
          type="number"
          min="0"
          max="90"
          value={match.currentMinute || ''}
          onChange={handleInputChange}
          placeholder="请输入比赛进行的分钟数"
        />
      </div>
      <h3>滚球盘赔率输入：</h3>
      <div className="input-group">
        <label htmlFor="liveHome">主胜赔率：</label>
        <input
          id="liveHome"
          name="home"
          type="number"
          step="0.01"
          value={match.liveOdds.home || ''}
          onChange={handleInputChange}
          placeholder="请输入滚球主胜赔率"
        />
      </div>
      <div className="input-group">
        <label htmlFor="liveDraw">平局赔率：</label>
        <input
          id="liveDraw"
          name="draw"
          type="number"
          step="0.01"
          value={match.liveOdds.draw || ''}
          onChange={handleInputChange}
          placeholder="请输入滚球平局赔率"
        />
      </div>
      <div className="input-group">
        <label htmlFor="liveAway">客胜赔率：</label>
        <input
          id="liveAway"
          name="away"
          type="number"
          step="0.01"
          value={match.liveOdds.away || ''}
          onChange={handleInputChange}
          placeholder="请输入滚球客胜赔率"
        />
      </div>
      <h3>投注建议：</h3>
      <p>主胜投注：{advice.home.toFixed(2)}</p>
      <p>平局投注：{advice.draw.toFixed(2)}</p>
      <p>客胜投注：{advice.away.toFixed(2)}</p>
      <button onClick={handleSaveHistory}>保存到历史数据</button>
    </div>
  );
};

export default BettingAdvice;
