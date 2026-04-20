import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import './styles/App.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Selection from './pages/Selection';
import GamePage from './pages/GamePage';
import Rules from './pages/Rules';
import HighScores from './pages/HighScores';
import Login from './pages/Login';
import Register from './pages/Register';
import Custom from './pages/Custom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Selection />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/scores" element={<HighScores />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
