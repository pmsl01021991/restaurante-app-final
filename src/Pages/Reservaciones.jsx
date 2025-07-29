import '../Styles/Reservaciones.css';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Container from '../Components/Container';
import '../Styles/Comensales.css';
import '../Styles/Numerocliente.css';
import '../Styles/MesasReservaciones.css';

const mesasDisponibles = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  nombre: `Mesa ${i + 1}`
}));

const horasDisponibles = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

const Reservaciones = () => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [numero, setNumero] = useState('');
  const [comensales, setComensales] = useState('');
  const [mostrarPaso, setMostrarPaso] = useState('mesas');
  const [userName, setUserName] = useState('');
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [platosSeleccionados, setPlatosSeleccionados] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMensaje, setToastMensaje] = useState('');
  const [cantidadMesasVisibles, setCantidadMesasVisibles] = useState(8);
  const [reservasHechas, setReservasHechas] = useState([]);
  const [estadoMesas, setEstadoMesas] = useState({});


 
  const botones = (prevStep, nextStep, habilitado) => (
    <div className="modal-buttons">
      <button onClick={() => setMostrarPaso(prevStep)}>Atrás</button>
      <button 
        disabled={!habilitado}
        onClick={() => setMostrarPaso(nextStep)}
      >
        Siguiente
      </button>
    </div>
  );

  useEffect(() => {
    // Cargar reservas para mostrar mesas ocupadas
    fetch('https://json-backend-reservas2.onrender.com/reservas')
      .then(res => res.json())
      .then(data => {
        setReservasHechas(data);
        actualizarEstadoMesas(data);
      });

    // Obtener usuario logueado
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.name.split('@')[0]);

     fetch(`https://json-backend-reservas2.onrender.com/platosSeleccionados?usuario=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setPlatosSeleccionados(data);
        setPlatoSeleccionado(data.length > 0 ? data[0] : null); // si quieres mostrar el primero como principal
      })
      .catch(err => console.error('Error cargando platos:', err));
       } 
    }, []);


  const actualizarEstadoMesas = (reservas) => {
    const nuevoEstado = {};
    mesasDisponibles.forEach(m => nuevoEstado[`mesa${m.id}`] = 'disponible');
    reservas.forEach(res => {
      const mesaId = mesasDisponibles.find(m => m.nombre === res.mesa)?.id;
      if (mesaId) nuevoEstado[`mesa${mesaId}`] = 'reservado';
    });
    setEstadoMesas(nuevoEstado);
  };

  const confirmarReserva = () => {
    if (!numero.trim()) return alert('Ingresa tu número.');

    const nuevaReserva = {
      cliente: userName,
      plato: platosSeleccionados.map(p => p.nombre).join(', '),
      mesa: mesaSeleccionada?.nombre,
      fecha: fechaSeleccionada?.toISOString().split('T')[0],
      hora: horaSeleccionada,
      numero,
      comensales
    };

    fetch('https://json-backend-reservas2.onrender.com/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaReserva)
    })
      .then(res => res.json())
      .then(data => {
        const nuevasReservas = [...reservasHechas, data];
        setReservasHechas(nuevasReservas);
        actualizarEstadoMesas(nuevasReservas);
        mostrarToast('✅ Reservación confirmada.');

        // Borrar los platos seleccionados del backend
        platosSeleccionados.forEach(plato => {
          fetch(`https://json-backend-reservas2.onrender.com/platosSeleccionados/${plato.id}`, {
            method: 'DELETE'
          });
        });

        // Limpiar estado
        setMostrarPaso('mesas');
        setNumero('');
        setMesaSeleccionada(null);
        setHoraSeleccionada('');
        setFechaSeleccionada(null);
        setPlatosSeleccionados([]);
      })
      .catch(err => console.error('Error al guardar reserva', err));
  };

  const mostrarToast = (mensaje) => {
    setToastMensaje(mensaje);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <>
      <section className="reservation-section" style={{ paddingBottom: '120px' }}>
        <Container>
          <h2 className="menu-title">Reserva tu mesa</h2>
          <p className="section-text">Selecciona una mesa disponible para continuar con tu reservación.</p>

          {mostrarPaso === 'mesas' && (
            <>
              <ul className="mesa-list">
                {mesasDisponibles.slice(0, cantidadMesasVisibles).map(mesa => {
                  const estado = estadoMesas[`mesa${mesa.id}`];
                  const reservaMesa = reservasHechas.find(r => r.mesa === mesa.nombre);

                  return (
                    <li
                      key={mesa.id}
                      className={`mesa-item ${estado}`}
                      onClick={() => {
                        if (!platoSeleccionado && platosSeleccionados.length === 0) {
                          mostrarToast('⚠️ Selecciona tu plato antes de hacer una reservación.');
                          return;
                        }
                        if (estado === 'disponible') {
                          setMesaSeleccionada(mesa);
                          setMostrarPaso('fecha');
                        }
                      }}

                    >
                      <h3>{mesa.nombre}</h3>
                      <p className={`estado-label ${estado}`}>
                        {estado === 'disponible' ? 'Disponible' : 'Reservado'}
                      </p>
                      {estado === 'reservado' && reservaMesa && (
                        <div className="reserva-info">
                          <span><strong>{reservaMesa.cliente === userName ? 'Tú' : reservaMesa.cliente}</strong></span><br />
                          <span>{reservaMesa.fecha}</span><br />
                          <span>{reservaMesa.hora}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              {cantidadMesasVisibles < mesasDisponibles.length && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    onClick={() => setCantidadMesasVisibles(prev => prev + 8)}
                    className="mostrar-mas-btn"
                  >
                    Mostrar más mesas
                  </button>
                </div>
              )}
            </>
          )}

          {mostrarPaso === 'fecha' && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Selecciona una fecha</h3>
                <DatePicker
                  selected={fechaSeleccionada}
                  onChange={(fecha) => setFechaSeleccionada(fecha)}
                  minDate={new Date()}
                  inline
                />
                {botones('mesas', 'hora', !!fechaSeleccionada)}
              </div>
            </div>
          )}

          {mostrarPaso === 'hora' && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Selecciona una hora</h3>
                <select onChange={(e) => setHoraSeleccionada(e.target.value)} defaultValue="">
                  <option disabled value="">Seleccionar hora</option>
                  {horasDisponibles.map(hora => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
                {botones('fecha', 'numero', !!horaSeleccionada)}
              </div>
            </div>
          )}

          {mostrarPaso === 'numero' && (
            <div className="modal-overlay">
              <div className="modal-content numero-modal">
                <h3>Ingresa tu número de celular</h3>
                <input
                  type="tel"
                  maxLength={9}
                  value={numero}
                  onChange={(e) => {
                    const valor = e.target.value;
                    // Solo números
                    if (/^\d*$/.test(valor)) {
                      setNumero(valor);
                    }
                  }}
                  placeholder="Número de celular"
                  required
                  className="numero-input"
                />
                {botones('hora', 'comensales', numero.length === 9)}
              </div>
            </div>
          )}


          {mostrarPaso === 'comensales' && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>¿Cuántos comensales asistirán?</h3>
                <select
                  value={comensales}
                  onChange={(e) => setComensales(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    marginTop: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                >
                  <option value="" disabled>Seleccionar número de personas</option>
                  {Array.from({ length: 8 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                {botones('numero', 'confirmar', !!comensales)}
              </div>
            </div>
          )}


          {mostrarPaso === 'confirmar' && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Resumen de Reservación</h3>
                <p><strong>Nombre:</strong> {userName}</p>
                <p><strong>Plato seleccionado:</strong> {platoSeleccionado?.nombre || 'Ninguno'}</p>
                <p><strong>Platos adicionales:</strong> {
                  platosSeleccionados.length > 0 
                    ? platosSeleccionados.map(p => p.nombre).join(', ') 
                    : 'Ninguno'
                }</p>
                <p><strong>Mesa:</strong> {mesaSeleccionada?.nombre}</p>
                <p><strong>Fecha:</strong> {fechaSeleccionada?.toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {horaSeleccionada}</p>
                <p><strong>Número:</strong> {numero}</p>
                <p><strong>Comensales:</strong> {comensales}</p>
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button onClick={() => setMostrarPaso('numero')}>Volver</button>
                  <button onClick={confirmarReserva}>Confirmar</button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      {toastVisible && (
        <div className="toast-reserva show">
          {toastMensaje}
        </div>
      )}
    </>
  );
};

export default Reservaciones;
