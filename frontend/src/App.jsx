import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthPage from './features/Auth/AuthPage.jsx';
import DailyStreakPage from './features/DailyStreak/DailyStreakPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/daily-streak" element={<ProtectedRoute><DailyStreakPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/daily-streak" replace />} />
    </Routes>
  );
}

export default App;
