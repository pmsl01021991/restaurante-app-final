import '../Styles/Reservaciones.css';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Container from '../Components/Container';
import '../Styles/Comensales.css';
import '../Styles/NumeroCliente.css';
import '../Styles/MesasReservaciones.css';

const mesasDisponibles = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  nombre: `Mesa ${i + 1}`
}));

const horasDisponibles = [
  '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', 
  '21:00', '22:00'
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
    fetch('https://json-backend-reservas3.onrender.com/reservas')
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

     fetch(`https://json-backend-reservas3.onrender.com/platosSeleccionados?usuario=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setPlatosSeleccionados(data);
        setPlatoSeleccionado(data.length > 0 ? data[0] : null); 
      })
      .catch(err => console.error('Error cargando platos:', err));
       } 
    }, []);

    // Recalcula el estado de las mesas cuando cambian fecha, hora o reservas
    useEffect(() => {
      actualizarEstadoMesas(reservasHechas);
    }, [fechaSeleccionada, horaSeleccionada, reservasHechas]);



  const actualizarEstadoMesas = (reservas, fecha = fechaSeleccionada, hora = horaSeleccionada) => {
    const nuevoEstado = {};
    const fechaStr = fecha ? fecha.toISOString().split('T')[0] : null;

    mesasDisponibles.forEach(m => {
      const reservasMesa = reservas.filter(r => r.mesa === m.nombre);

      // Solo la marcamos como ocupada si choca fecha/hora seleccionada
      const reservada = reservasMesa.some(r =>
        (!fechaStr || r.fecha === fechaStr) &&
        (!hora || r.hora === hora)
      );

      nuevoEstado[`mesa${m.id}`] = reservada ? 'reservado' : 'disponible';
    });

    setEstadoMesas(nuevoEstado);
  };



  const confirmarReserva = () => {
      if (!numero.trim()) return alert('Ingresa tu número.');

      // Validar si ya existe reserva con misma mesa/fecha/hora
      const existeConflicto = reservasHechas.some(r =>
        r.mesa === mesaSeleccionada?.nombre &&
        r.fecha === fechaSeleccionada?.toISOString().split('T')[0] &&
        r.hora === horaSeleccionada
      );

      if (existeConflicto) {
        mostrarToast('⚠️ Esta mesa ya está reservada en ese horario.');
        return;
      }

      const nuevaReserva = {
        cliente: userName,
        plato: platosSeleccionados.map(p => p.nombre).join(', '),
        mesa: mesaSeleccionada?.nombre,
        fecha: fechaSeleccionada?.toISOString().split('T')[0],
        hora: horaSeleccionada,
        numero,
        comensales
      };



    fetch('https://json-backend-reservas3.onrender.com/reservas', {
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
          fetch(`https://json-backend-reservas3.onrender.com/platosSeleccionados/${plato.id}`, {
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
                        setMesaSeleccionada(mesa);
                        setMostrarPaso('fecha');
                      }}

                    >
                      <h3>{mesa.nombre}</h3>
                      <p className={`estado-label ${estado}`}>
                        {reservasHechas.some(r => r.mesa === mesa.nombre)
                          ? 'Disponible en algunos horarios'
                          : 'Disponible en todos los horarios'}
                      </p>
                      {estado === 'reservado' && (
                        <div className="info-reservas">
                          {reservasHechas
                            .filter(r => r.mesa === mesa.nombre)
                            .slice(0, 6)  // 👈 Limita a 6
                            .map((r, index) => (
                              <div key={index} className="reserva-info-item">
                                <strong>{r.cliente === userName ? 'Tú' : r.cliente}</strong>
                                <span>{r.fecha} - {r.hora}</span>
                              </div>
                          ))}

                          {reservasHechas.filter(r => r.mesa === mesa.nombre).length > 6 && (
                            <div className="reserva-info-item">
                              +{reservasHechas.filter(r => r.mesa === mesa.nombre).length - 6} más
                            </div>
                          )}
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

                {/* Mensaje de error si el número no cumple */}
                {numero.length > 0 && (numero.length < 9 || !numero.startsWith('9')) && (
                  <p className="error-mensaje">
                    Completa el número de 9 dígitos empezando por "9"
                  </p>
                )}

                {/* Botones: solo permite avanzar si cumple las condiciones */}
                {botones('hora', 'comensales', numero.length === 9 && numero.startsWith('9'))}
              </div>
            </div>
          )}




          {mostrarPaso === 'comensales' && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>¿Cuántos comensales asistirán?</h3>
                
                <select
                  className="comensales-select"
                  value={comensales}
                  onChange={(e) => setComensales(e.target.value)}
                  required
                  aria-label="Seleccionar número de comensales"
                >
                  <option value="" disabled>Seleccionar número de personas</option>
                  {Array.from({ length: 8 }, (_, i) => {
                    const numero = i + 1;
                    return (
                      <option key={numero} value={numero}>
                        {numero} {numero === 1 ? 'persona' : 'personas'}
                      </option>
                    );
                  })}
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
