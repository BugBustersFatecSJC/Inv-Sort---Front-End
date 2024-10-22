import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import InitialSignUp from './pages/InitialSignUp/InitialSignUp';
import MainPageRender from './pages/MainPageRender/MainPageRender';
import MovementPage from './pages/MovementPage/MovementPage';
import UserPage from './pages/UserPage/UserPage';
import Analytics from './pages/Analytics/Analytics';
import Batch from './pages/Batch/Batch';
import Sector from './pages/Sector/Sector';
import Supplier from './pages/Supplier/Supplier';
import UserProfile from './pages/UserProfile/UserProfile';
import RedirectHandler from './components/RedirectHandler/RedirectHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectHandler />} /> {/* Coloque o controle de redirecionamento aqui */}
        <Route path="/cadastro" element={<InitialSignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<MainPageRender />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/movements" element={<MovementPage />} />
        <Route path="/batches" element={<Batch />} />
        <Route path="/sectors" element={<Sector />} />
        <Route path="/suppliers" element={<Supplier />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
