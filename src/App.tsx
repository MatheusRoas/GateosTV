import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useAppStore } from '@store/appStore';
import Layout from '@layouts/Layout';
import HomePage from '@pages/HomePage';
import CalendarPage from '@pages/CalendarPage';
import TablePage from '@pages/TablePage';
import BracketPage from '@pages/BracketPage';
import PredictorPage from '@pages/PredictorPage';
import StatisticsPage from '@pages/StatisticsPage';
import PlayersPage from '@pages/PlayersPage';
import TeamsPage from '@pages/TeamsPage';
import StadiumsPage from '@pages/StadiumsPage';

function App() {
  const { darkMode, loadAppState } = useAppStore();

  useEffect(() => {
    loadAppState();
  }, [loadAppState]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/tablas" element={<TablePage />} />
          <Route path="/bracket" element={<BracketPage />} />
          <Route path="/predictor" element={<PredictorPage />} />
          <Route path="/estadisticas" element={<StatisticsPage />} />
          <Route path="/jugadores" element={<PlayersPage />} />
          <Route path="/equipos" element={<TeamsPage />} />
          <Route path="/estadios" element={<StadiumsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
