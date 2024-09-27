export interface Match {
  id: string;
  title?: string; // 新增可选的标题字段
  initialOdds: { home: number; draw: number; away: number };
  liveOdds: { home: number; draw: number; away: number };
  probabilities: { home: number; draw: number; away: number };
  initialBankroll: number;
  currentMinute: number; // 新增字段，记录比赛进行到第几分钟
}

export interface HistoryData {
  id: string;
  matchId: string; // 添加这一行
  matchTitle?: string; // 添加这一行
  initialOdds: { home: number; draw: number; away: number };
  liveOdds: { home: number; draw: number; away: number };
  currentMinute: number;
  result: '3' | '1' | '0' | null;
}
