import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Styles/ReservacionesHechas.css';
import Container from '../Components/Container';
import EditarReservaModal from '../Components/EditarReservaModal';
import { Clock, UsersRound } from 'lucide-react';

const localizer = momentLocalizer(moment);

const ReservacionesHechas = () => {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [reservasDelDia, setReservasDelDia] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  useEffect(() => {
    fetch('https://json-backend-reservas2.onrender.com/reservas')
      .then(res => res.json())
      .then(data => {
        const eventosConvertidos = data.map(reserva => {
          const fechaHora = moment(`${reserva.fecha} ${reserva.hora}`, 'YYYY-MM-DD HH:mm');
          return {
            id: reserva.id,
            title: `${reserva.mesa} - ${reserva.cliente}`,
            start: fechaHora.toDate(),
            end: fechaHora.clone().add(30, 'minutes').toDate(),
            reserva
          };
        });
        setEventos(eventosConvertidos);
        setReservasDelDia(data); // por defecto, mostrar todo
      });
  }, []);

  const handleSelectSlot = ({ start }) => {
    const fecha = moment(start).format('YYYY-MM-DD');
    const reservasFiltradas = eventos
      .filter(evento => moment(evento.start).format('YYYY-MM-DD') === fecha)
      .map(evento => evento.reserva);
    setFechaSeleccionada(fecha);
    setReservasDelDia(reservasFiltradas);
  };

  return (
    <section className="reservation-section">
      <Container>
        <h2 className="menu-title">Reservaciones Hechas</h2>
        <p className="section-text">Consulta las reservaciones registradas por fecha.</p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              style={{
                height: 500,
                backgroundColor: 'white',
                color: '#111827',
                borderRadius: '10px',
                padding: '10px'
              }}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={(event) => handleSelectSlot({ start: event.start })}
              views={['month']}
              popup
            />
          </div>

          <div style={{ flex: '1 1 300px', backgroundColor: '#f9fafb', borderRadius: '10px', padding: '1rem' }}>
            <h3 style={{ color: '#111827', marginBottom: '1rem' }}>
              {fechaSeleccionada ? `Reservas para ${fechaSeleccionada}` : 'Todas las reservas'}
            </h3>

            {reservasDelDia.length === 0 ? (
              <p style={{ color: '#6b7280' }}>No hay reservas para esta fecha.</p>
            ) : (
              reservasDelDia.map((reserva, i) => (
                <div
                  key={i}
                  className="reserva-item"
                  onClick={() => setReservaSeleccionada(reserva)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#ffff',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ textTransform: 'capitalize', fontWeight: 'bolder', fontSize: '18px' }}>{reserva.cliente}</p>
                    <span style={{
                      color: '#ffff',
                      backgroundColor: '#f97316',
                      padding: '3px 12px',
                      borderRadius: '5px',
                      fontSize: '15px'
                    }}>{reserva.mesa}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {reserva.numero}
                  </div>
                  {reserva.comensales && (
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <Clock style={{ width: '18px', height: '18px', marginRight: '5px' }} />
                      {moment(reserva.hora, 'HH:mm').format('hh:mm A')}
                      <span style={{ margin: '0 5px' }}>|</span>
                      <UsersRound style={{ width: '18px', height: '18px', marginRight: '5px' }} />
                      {reserva.comensales} Comensales
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Container>

      {reservaSeleccionada && (
        <EditarReservaModal
          reserva={reservaSeleccionada}
          onClose={() => setReservaSeleccionada(null)}
          onGuardar={(reservaActualizada) => {
            fetch(`https://json-backend-reservas2.onrender.com/reservas/${reservaSeleccionada.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(reservaActualizada)
            })
              .then(res => res.json())
              .then(updated => {
                setEventos(prev =>
                  prev.map(ev =>
                    ev.id === updated.id
                      ? {
                        ...ev,
                        title: `${updated.mesa} - ${updated.cliente}`,
                        start: moment(`${updated.fecha} ${updated.hora}`, 'YYYY-MM-DD HH:mm').toDate(),
                        end: moment(`${updated.fecha} ${updated.hora}`, 'YYYY-MM-DD HH:mm').add(30, 'minutes').toDate(),
                        reserva: updated
                      }
                      : ev
                  )
                );
                setReservaSeleccionada(null);
              });
          }}
          onEliminar={() => {
            fetch(`https://json-backend-reservas2.onrender.com/reservas/${reservaSeleccionada.id}`, {
              method: 'DELETE'
            })
              .then(() => {
                // Elimina del estado global de eventos
                setEventos(prev => prev.filter(ev => ev.id !== reservaSeleccionada.id));

                // Elimina del estado de reservas mostradas en el panel derecho
                setReservasDelDia(prev => prev.filter(r => r.id !== reservaSeleccionada.id));

                // Cierra el modal
                setReservaSeleccionada(null);
              });
          }}

        />
      )}
    </section>
  );
};

export default ReservacionesHechas;
