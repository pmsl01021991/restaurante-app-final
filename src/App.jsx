import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
import Reservaciones from './Pages/Reservaciones.jsx';
import ReservacionesHechas from './Pages/ReservacionesHechas.jsx';
import Inicio from './Pages/Inicio.jsx';
import './App.css';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Navbar />
      <main>
      <Routes>
        {/* Page Inicio */}
        <Route path="/" element={<Inicio />} />
        {/* Page Reservaciones */}
        <Route path="/reservaciones" element={<Reservaciones />} />
        {/* ✅ Solo el ADMIN puede acceder */}
        {user?.rol === 'admin' && (
          <Route path="/reservaciones-hechas" element={<ReservacionesHechas />} />
        )}
      </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
