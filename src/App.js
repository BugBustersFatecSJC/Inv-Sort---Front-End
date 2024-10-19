import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import './App.css'
import Login from './pages/Login/Login'
import InitialSignUp from './pages/InitialSignUp/InitialSignUp'
import api from "./services/api"
import MainPageRender from './pages/MainPageRender/MainPageRender'
import MovimentsPage from './pages/MovementPage/MovementPage'
import UserPage from './pages/UserPage/UserPage'
import Analytics from './pages/Analytics/Analytics'
import BuyAndSell from './pages/BuyAndSell/BuyAndSell'


/* ProtectedRoute redireciona o usuario para a pagina de login, caso o mesmo não esteja logado
IMPORTANTE: Use essa função em toda página que não deve ser acessada antes do login */
function ProtectedRoute({ element: Element }) {
  const user = localStorage.getItem("user");
  return user ? <Element /> : <Navigate to="/login" />;
}

/* ProtectedLogin redireciona o usuario da página de login para a página de produtos, caso o mesmo já esteja logado */
function ProtectedLogin({ element: Element }) {
  const user = localStorage.getItem("user");
  return !user ? <Element /> : <Navigate to="/products" />;
}

function App() {
  return (
    <div>
      <Router>
        <Routes>
          /*
          * TODO: Usar o /products como nosso index (/)
          */
          <Route path="/cadastro" element={<InitialSignUp />} />
          <Route path="/login" element={<ProtectedLogin element={Login} />} />
          <Route path="/products" element={<ProtectedRoute element={MainPageRender} />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/userpage" element={<ProtectedRoute element={UserPage} />} />
          <Route path="/movements" element={<MovimentsPage />} />
          <Route path="/buyandsell" element={<BuyAndSell />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
