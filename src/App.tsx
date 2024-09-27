import React, { useState, useEffect, useCallback } from 'react';
import { Match, HistoryData } from './types';
import MatchCard from './components/MatchCard';
import NewMatchModal from './components/NewMatchModal';
import BettingAdvice from './components/BettingAdvice';
import HistoryTable from './components/HistoryTable';
import ExportImportButtons from './components/ExportImportButtons';
import { saveMatches, loadMatches, saveHistory, loadHistory } from './utils/storage';
import './App.css';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);

  useEffect(() => {
    const savedMatches = loadMatches();
    setMatches(savedMatches);
    const savedHistory = loadHistory();
    setHistoryData(savedHistory);
  }, []);

  // 使用 useCallback 来记忆这个函数
  const saveMatchesCallback = useCallback((matchesToSave: Match[]) => {
    console.log('Saving matches:', matchesToSave);
    saveMatches(matchesToSave);
  }, []);

  const handleNewMatch = (match: Match) => {
    const newMatch = {
      ...match,
      liveOdds: { home: 0, draw: 0, away: 0 },
      currentMinute: 0
    };
    setMatches(prev => {
      const updatedMatches = [...prev, newMatch];
      saveMatchesCallback(updatedMatches);
      return updatedMatches;
    });
  };

  const handleSelectMatch = (id: string) => {
    setSelectedMatchId(prevId => prevId === id ? null : id);
  };

  const handleDeleteMatch = (id: string) => {
    setMatches(prev => {
      const updatedMatches = prev.filter(match => match.id !== id);
      saveMatchesCallback(updatedMatches);
      return updatedMatches;
    });
    if (selectedMatchId === id) {
      setSelectedMatchId(null);
    }
  };

  const handleUpdateLiveOdds = (id: string, liveOdds: { home: number; draw: number; away: number }) => {
    setMatches(prev => {
      const updatedMatches = prev.map(match => 
        match.id === id ? { ...match, liveOdds } : match
      );
      saveMatchesCallback(updatedMatches);
      return updatedMatches;
    });
  };

  const handleUpdateCurrentMinute = (id: string, currentMinute: number) => {
    setMatches(prev => {
      const updatedMatches = prev.map(match => 
        match.id === id ? { ...match, currentMinute } : match
      );
      saveMatchesCallback(updatedMatches);
      return updatedMatches;
    });
  };

  const handleSaveHistory = (data: HistoryData) => {
    setHistoryData(prev => {
      const updatedHistory = [...prev, data];
      saveHistory(updatedHistory);
      return updatedHistory;
    });
  };

  const handleDeleteHistory = (id: string) => {
    setHistoryData(prev => {
      const updatedHistory = prev.filter(item => item.id !== id);
      saveHistory(updatedHistory);
      return updatedHistory;
    });
  };

  const handleEditHistory = (id: string, updatedData: HistoryData) => {
    setHistoryData(prev => {
      const updatedHistory = prev.map(item => item.id === id ? updatedData : item);
      saveHistory(updatedHistory);
      return updatedHistory;
    });
  };

  const handleImportHistory = (importedData: HistoryData[]) => {
    setHistoryData(importedData);
    saveHistory(importedData);
  };

  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  return (
    <div className="App">
      <h1>足球投注分析器</h1>
      <button className="new-match-btn" onClick={() => setShowModal(true)}>新建比赛</button>
      <div className="match-list">
        {matches.map(match => (
          <MatchCard 
            key={match.id} 
            match={match} 
            onSelect={handleSelectMatch}
            onDelete={handleDeleteMatch}
            isSelected={match.id === selectedMatchId}
          />
        ))}
      </div>
      {selectedMatch && (
        <div className="betting-advice-container">
          <h2>{selectedMatch.title || `比赛详情 (ID: ${selectedMatch.id.slice(0, 8)}...)`}</h2>
          <BettingAdvice
            match={selectedMatch}
            onUpdateLiveOdds={handleUpdateLiveOdds}
            onUpdateCurrentMinute={handleUpdateCurrentMinute}
            onSaveHistory={handleSaveHistory}
          />
        </div>
      )}
      <HistoryTable
        data={historyData}
        onDelete={handleDeleteHistory}
        onEdit={handleEditHistory}
      />
      <ExportImportButtons data={historyData} onImport={handleImportHistory} />
      {showModal && (
        <NewMatchModal
          onClose={() => setShowModal(false)}
          onSave={handleNewMatch}
        />
      )}
    </div>
  );
};

export default App;