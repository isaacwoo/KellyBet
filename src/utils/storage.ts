import { v4 as uuidv4 } from 'uuid';
import { Match, HistoryData } from '../types';

const MATCHES_STORAGE_KEY = 'footballBettingMatches';
const HISTORY_STORAGE_KEY = 'footballBettingHistory';

interface MatchData {
  id: string;
  homeWinOdds: number;
  drawOdds: number;
  awayWinOdds: number;
}

export const saveMatchData = (matchData: MatchData | MatchData[]) => {
  let matches: MatchData[];
  if (Array.isArray(matchData)) {
    matches = matchData;
  } else {
    const storedMatches = getStoredMatches();
    matches = [...storedMatches, { ...matchData, id: uuidv4() }];
  }
  localStorage.setItem('matches', JSON.stringify(matches));
};

export const getStoredMatches = (): MatchData[] => {
  return JSON.parse(localStorage.getItem('matches') || '[]');
};

export const deleteMatchData = (id: string) => {
  const matches = getStoredMatches().filter(match => match.id !== id);
  localStorage.setItem('matches', JSON.stringify(matches));
};

export const saveMatches = (matches: Match[]): void => {
  try {
    localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
    console.log('Saved matches:', matches);
  } catch (error) {
    console.error('Error saving matches:', error);
  }
};

export const loadMatches = (): Match[] => {
  try {
    const storedMatches = localStorage.getItem(MATCHES_STORAGE_KEY);
    console.log('Loaded stored matches:', storedMatches);
    if (storedMatches) {
      const parsedMatches = JSON.parse(storedMatches);
      console.log('Parsed matches:', parsedMatches);
      return parsedMatches;
    }
  } catch (error) {
    console.error('Error loading matches:', error);
  }
  return [];
};

export const saveHistory = (history: HistoryData[]): void => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

export const loadHistory = (): HistoryData[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};
