import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HistoryData } from '../types';

interface ExportImportButtonsProps {
  data: HistoryData[];
  onImport: (data: HistoryData[]) => void;
}

const ExportImportButtons: React.FC<ExportImportButtonsProps> = ({ data, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToExcel = () => {
    const exportData = data.map(item => ({
      id: item.id,
      matchId: item.matchId,
      matchTitle: item.matchTitle,
      initialOddsHome: item.initialOdds?.home,
      initialOddsDraw: item.initialOdds?.draw,
      initialOddsAway: item.initialOdds?.away,
      liveOddsHome: item.liveOdds?.home,
      liveOddsDraw: item.liveOdds?.draw,
      liveOddsAway: item.liveOdds?.away,
      currentMinute: item.currentMinute,
      result: item.result
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "历史数据");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(dataBlob, '足球投注历史数据.xlsx');
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const importedData: HistoryData[] = jsonData.map((item: any) => ({
          id: item.id,
          matchId: item.matchId,
          matchTitle: item.matchTitle,
          initialOdds: {
            home: item.initialOddsHome,
            draw: item.initialOddsDraw,
            away: item.initialOddsAway
          },
          liveOdds: {
            home: item.liveOddsHome,
            draw: item.liveOddsDraw,
            away: item.liveOddsAway
          },
          currentMinute: item.currentMinute,
          result: item.result
        }));

        onImport(importedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="export-import-buttons">
      <button onClick={exportToExcel}>导出到Excel</button>
      <button onClick={() => fileInputRef.current?.click()}>从Excel导入</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
        onChange={importFromExcel}
      />
    </div>
  );
};

export default ExportImportButtons;
