import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Menu } from 'lucide-react';
import Authentication from './Authentication';
import Container from './Container';
import '../Styles/Navbar.css';

const Navbar = () => {
   const [user, setUser] = useState(null);
   const [showAuthentication, setShowAuthentication] = useState(false);
   const [iconMenu, setIconMenu] = useState(false)

   useEffect(() => {
      const cargarUsuario = () => {
         const loggedUser = JSON.parse(localStorage.getItem('user'));
         if (loggedUser && loggedUser.name) {
            setUser(loggedUser);
         } else {
            setUser(null);
         }
      };

      cargarUsuario();
      window.addEventListener('userLoggedIn', cargarUsuario);
      return () => window.removeEventListener('userLoggedIn', cargarUsuario);
   }, []);

   const handleIconMenu = () => setIconMenu(!iconMenu);

   const handleLogout = () => {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('userLoggedIn'));
      window.location.href = '/';
   };

   return (
      <header style={{ position: 'fixed', top: '0', zIndex: '100', width: '100%', height: '5rem', backgroundColor: '#111827e6', backdropFilter: 'blur(5px)', borderBottom: '1px #1f2937 solid' }}>
         <Container>
            <nav>
               <div className="logo">
                  <ChefHat style={{ color: '#f97316', width: '32px', height: '32px' }} />
                  <p style={{ color: '#eeee', fontSize: '1.2rem' }}>
                     {user
                        ? user.rol === 'admin'
                           ? 'Bienvenido al Buen Sabor, Administrador'
                           : `Bienvenido, ${user.name.split('@')[0]}`
                        : 'El Buen Sabor'}
                  </p>


               </div>

               <button className="menu-toggle" onClick={handleIconMenu}>
                  <Menu style={{ color: '#f97316', width: '32px', height: '32px' }} />
               </button>

               {iconMenu ? (
                  <ul className="responsive-ul">
                     <li><Link to="/">Inicio</Link></li>
                     <li><Link to="/reservaciones">Reservaciones</Link></li>
                     {user?.rol === 'admin' && (
                        <li><Link to="/reservaciones-hechas">Reservaciones Hechas</Link></li>
                     )}
                     <li><Link to="/menu">Menú</Link></li>
                     {user ? (
                        <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                     ) : (
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setShowAuthentication(true); }}>Login</a></li>
                     )}
                  </ul>

                  ) : (
                  <ul>
                     <li><Link to="/">Inicio</Link></li>
                     <li className="dropdown">
                        <Link to="/reservaciones">Reservaciones</Link>
                        {user?.rol === 'admin' && (
                           <ul className="dropdown-menu">
                           <li><Link to="/reservaciones-hechas">Reservaciones Hechas</Link></li>
                           </ul>
                        )}
                     </li>
                     <li><Link to="/menu">Menú</Link></li>
                     {user ? (
                        <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                     ) : (
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setShowAuthentication(true); }}>Login</a></li>
                     )}
                  </ul>

                  )}


               
            </nav>
         </Container>
         {showAuthentication && <Authentication onClose={() => setShowAuthentication(false)} />}
      </header>
   );
};

export default Navbar;
