import React, { useState, useEffect, useMemo } from 'react';
import { HistoryData } from '../types';
import './HistoryTable.css';

interface HistoryTableProps {
  data: HistoryData[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedData: HistoryData) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ data, onDelete, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filteredData, setFilteredData] = useState<HistoryData[]>(data);
  const [timeStart, setTimeStart] = useState<string>('');
  const [timeEnd, setTimeEnd] = useState<string>('');
  const [oddsMin, setOddsMin] = useState<string>('');
  const [oddsMax, setOddsMax] = useState<string>('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const timeInRange = (!timeStart || !timeEnd || (item.currentMinute && item.currentMinute >= parseInt(timeStart) && item.currentMinute <= parseInt(timeEnd)));
      const oddsInRange = (!oddsMin || !oddsMax || (safeGet(item, 'initialOdds.home') >= parseFloat(oddsMin) && safeGet(item, 'initialOdds.home') <= parseFloat(oddsMax)));
      return timeInRange && oddsInRange;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setTimeStart('');
    setTimeEnd('');
    setOddsMin('');
    setOddsMax('');
    setFilteredData(data);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleEdit = (id: string, field: string, value: string | number) => {
    const updatedData = data.find(item => item.id === id);
    if (updatedData) {
      const newData = { ...updatedData };
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!(newData as any)[parent]) {
          (newData as any)[parent] = {};
        }
        (newData as any)[parent][child] = value;
      } else {
        (newData as any)[field] = value;
      }
      onEdit(id, newData);
    }
  };

  // 辅助函数来安全地获取嵌套属性
  const safeGet = (obj: any, path: string, defaultValue: any = '') => {
    const value = path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
    return value !== undefined ? value : defaultValue;
  };

  const analysisResults = useMemo(() => {
    if (filteredData.length === 0) return null;

    const calculateStats = (values: number[]) => {
      const sorted = values.sort((a, b) => a - b);
      return {
        avg: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        median: sorted[Math.floor(sorted.length / 2)]
      };
    };

    const homeOdds = filteredData.map(item => safeGet(item, 'liveOdds.home', 0));
    const drawOdds = filteredData.map(item => safeGet(item, 'liveOdds.draw', 0));
    const awayOdds = filteredData.map(item => safeGet(item, 'liveOdds.away', 0));

    const totalMatches = filteredData.length;
    const homeWins = filteredData.filter(item => item.result === '3').length;
    const draws = filteredData.filter(item => item.result === '1').length;
    const awayWins = filteredData.filter(item => item.result === '0').length;

    return {
      home: calculateStats(homeOdds),
      draw: calculateStats(drawOdds),
      away: calculateStats(awayOdds),
      summary: {
        totalMatches,
        homeWins,
        draws,
        awayWins
      }
    };
  }, [filteredData]);

  return (
    <div className="history-table">
      <h2>历史数据</h2>
      <div className="filters">
        <div className="filters-row">
          <div className="filter-group">
            <label>时间范围：</label>
            <input type="number" value={timeStart} onChange={(e) => setTimeStart(e.target.value)} placeholder="开始时间" />
            <input type="number" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} placeholder="结束时间" />
          </div>
          <div className="filter-group">
            <label>主胜赔率范围：</label>
            <input type="number" value={oddsMin} onChange={(e) => setOddsMin(e.target.value)} placeholder="最小值" />
            <input type="number" value={oddsMax} onChange={(e) => setOddsMax(e.target.value)} placeholder="最大值" />
          </div>
        </div>
        <div className="filters-buttons">
          <button className="filter-btn" onClick={handleFilter}>筛选</button>
          <button className="reset-btn" onClick={handleReset}>重置</button>
        </div>
      </div>
      {filteredData.length > 0 ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>比赛</th>
                <th>初始主胜</th>
                <th>初始平局</th>
                <th>初始客胜</th>
                <th>滚球主胜</th>
                <th>滚球平局</th>
                <th>滚球客胜</th>
                <th>比赛时间</th>
                <th>比赛结果</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.matchTitle || item.matchId || '未知比赛'}</td>
                  <td><input type="number" value={safeGet(item, 'initialOdds.home')} onChange={(e) => handleEdit(item.id, 'initialOdds.home', parseFloat(e.target.value))} /></td>
                  <td><input type="number" value={safeGet(item, 'initialOdds.draw')} onChange={(e) => handleEdit(item.id, 'initialOdds.draw', parseFloat(e.target.value))} /></td>
                  <td><input type="number" value={safeGet(item, 'initialOdds.away')} onChange={(e) => handleEdit(item.id, 'initialOdds.away', parseFloat(e.target.value))} /></td>
                  <td><input type="number" value={safeGet(item, 'liveOdds.home')} onChange={(e) => handleEdit(item.id, 'liveOdds.home', parseFloat(e.target.value))} /></td>
                  <td><input type="number" value={safeGet(item, 'liveOdds.draw')} onChange={(e) => handleEdit(item.id, 'liveOdds.draw', parseFloat(e.target.value))} /></td>
                  <td><input type="number" value={safeGet(item, 'liveOdds.away')} onChange={(e) => handleEdit(item.id, 'liveOdds.away', parseFloat(e.target.value))} /></td>
                  <td><input type="number" value={item.currentMinute || ''} onChange={(e) => handleEdit(item.id, 'currentMinute', parseInt(e.target.value))} /></td>
                  <td>
                    <select value={item.result || ''} onChange={(e) => handleEdit(item.id, 'result', e.target.value)}>
                      <option value="">选择结果</option>
                      <option value="3">主胜</option>
                      <option value="1">平局</option>
                      <option value="0">主负</option>
                    </select>
                  </td>
                  <td><button onClick={() => onDelete(item.id)}>删除</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>无数据</p>
      )}
      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>上一页</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>下一页</button>
      </div>
      <div className="analysis-section">
        <button onClick={() => setShowAnalysis(!showAnalysis)}>
          {showAnalysis ? '隐藏分析' : '分析筛选数据'}
        </button>
        {showAnalysis && analysisResults && (
          <>
            <table className="analysis-table">
              <thead>
                <tr>
                  <th>赔率类型</th>
                  <th>平均值</th>
                  <th>最小值</th>
                  <th>最大值</th>
                  <th>中位数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>滚球主胜</td>
                  <td>{analysisResults.home.avg.toFixed(2)}</td>
                  <td>{analysisResults.home.min.toFixed(2)}</td>
                  <td>{analysisResults.home.max.toFixed(2)}</td>
                  <td>{analysisResults.home.median.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>滚球平局</td>
                  <td>{analysisResults.draw.avg.toFixed(2)}</td>
                  <td>{analysisResults.draw.min.toFixed(2)}</td>
                  <td>{analysisResults.draw.max.toFixed(2)}</td>
                  <td>{analysisResults.draw.median.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>滚球客胜</td>
                  <td>{analysisResults.away.avg.toFixed(2)}</td>
                  <td>{analysisResults.away.min.toFixed(2)}</td>
                  <td>{analysisResults.away.max.toFixed(2)}</td>
                  <td>{analysisResults.away.median.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="analysis-summary">
              <p>
                本次筛选共 {analysisResults.summary.totalMatches} 条数据，
                主胜 {analysisResults.summary.homeWins} 场，
                平局 {analysisResults.summary.draws} 场，
                客胜 {analysisResults.summary.awayWins} 场。
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryTable;
