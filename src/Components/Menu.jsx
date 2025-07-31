 import '../Styles/Menu.css';
import Container from './Container';
import { useState, useEffect } from 'react';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);

  // 🔹 Cargar los platos desde Render SOLO UNA VEZ
  useEffect(() => {
    fetch('https://json-backend-reservas2.onrender.com/platos')
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error('Error al obtener platos:', error));
  }, []);

  // 🔹 Función para elegir un plato
  const handleElegirPlato = async (plato) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Debes iniciar sesión primero");
      return;
    }

    // Crear el objeto de plato con usuario
    const platoConUsuario = { ...plato, usuario: user.email };

    try {
      // 1️⃣ Guardar en backend (json-server)
      await fetch('https://json-backend-reservas2.onrender.com/platosSeleccionados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(platoConUsuario),
      });

      // 2️⃣ Guardar también en localStorage para mostrar el toast de inmediato
      const platosGuardados = JSON.parse(localStorage.getItem('platosSeleccionados')) || [];
      platosGuardados.push(platoConUsuario);
      localStorage.setItem('platosSeleccionados', JSON.stringify(platosGuardados));

      
      setMensaje(`🍽️ ${plato.nombre} agregado a tu reservación`);
      setMostrarToast(true);
      setTimeout(() => setMostrarToast(false), 3000);
    } catch (error) {
      console.error('Error guardando plato en backend:', error);
      alert('No se pudo guardar el plato. Intenta de nuevo.');
    }
  };

  return (
    <section id="menu" className="menu-section">
      <Container>
        <h2 className="menu-title">Nuestro Menú</h2>
        <p className='menu-subtitle'>
          Descubre nuestros platos más populares, preparados con ingredientes frescos y técnicas tradicionales
        </p>
        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              <img src={item.imagen} alt={item.nombre} className="menu-image" />
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <span>{item.precio}</span>
              <button
                className="add-button"
                onClick={() => handleElegirPlato(item)}
              >
                Agregar a reservación
              </button>
            </li>
          ))}
        </ul>
      </Container>

      {/* 🔹 Toast de confirmación */}
      {mostrarToast && (
        <div className="plato-toast">
          {mensaje}
          <button onClick={() => setMostrarToast(false)}>✖</button>
        </div>
      )}
    </section>
  );
};

export default Menu;