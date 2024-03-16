import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Header from "./components/Header/Header";
import HomePage from './components/HomePage/HomePage';
import LoginPage from "./components/SecurityPage/LoginPage/LoginPage";
import RegisterPage from "./components/SecurityPage/RegisterPage/RegisterPage";
import Logout from "./components/SecurityPage/Logout";
import ProfilPage from "./components/ProfilPage/ProfilPage";
import PokedexPage from "./components/PokedexPage/PokedexPage";
import ObjetsPage from "./components/ObjetsPage/ObjetsPage";
import CapacitesPage from "./components/CapacitesPage/CapacitesPage";
function App() {
  return (
      <Router>
          <Header />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/logout" element={<Logout />}/>
              <Route path="/profil" element={<ProfilPage />} />
              <Route path="/pokedex" element={<PokedexPage />} />
              <Route path="/objets" element={<ObjetsPage />} />
              <Route path="/capacites" element={<CapacitesPage />} />
          </Routes>
      </Router>
  )
}

export default App
