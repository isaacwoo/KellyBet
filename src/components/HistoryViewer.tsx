import React, { useEffect, useState } from 'react';
import { getStoredMatches, saveMatchData, deleteMatchData } from '../utils/storage';

interface MatchData {
  id: string;
  homeWinOdds: number;
  drawOdds: number;
  awayWinOdds: number;
}

const HistoryViewer: React.FC = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 10;

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = () => {
    setMatches(getStoredMatches());
  };

  const handleEdit = (id: string, field: keyof MatchData, value: number) => {
    const updatedMatches = matches.map(match => 
      match.id === id ? { ...match, [field]: value } : match
    );
    setMatches(updatedMatches);
    saveMatchData(updatedMatches);
  };

  const handleDelete = (id: string) => {
    deleteMatchData(id);
    loadMatches();
  };

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>历史记录</h2>
      <table>
        <thead>
          <tr>
            <th>主胜赔率</th>
            <th>平局赔率</th>
            <th>客胜赔率</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {currentMatches.map((match) => (
            <tr key={match.id}>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={match.homeWinOdds}
                  onChange={(e) => handleEdit(match.id, 'homeWinOdds', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={match.drawOdds}
                  onChange={(e) => handleEdit(match.id, 'drawOdds', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={match.awayWinOdds}
                  onChange={(e) => handleEdit(match.id, 'awayWinOdds', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(match.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: Math.ceil(matches.length / matchesPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryViewer;
