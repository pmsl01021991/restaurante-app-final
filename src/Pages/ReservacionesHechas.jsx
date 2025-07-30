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
        setReservasDelDia(data);
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
 
        <div className="reservation-content">
          <div className="rh-calendar-container">
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              className="rbc-calendar"
              selectable
              views={['month']}
              popup
              onSelectSlot={handleSelectSlot}
              onSelectEvent={(event) => handleSelectSlot({ start: event.start })}
            />
          </div>
 
          <div className="rh-panel-container">
            <h3 className="panel-title">
              {fechaSeleccionada ? `Reservas para ${fechaSeleccionada}` : 'Todas las reservas'}
            </h3>
 
            {reservasDelDia.length === 0 ? (
              <p className="no-reservas-text">No hay reservas para esta fecha.</p>
            ) : (
              reservasDelDia.map((reserva, i) => (
                <div
                  key={i}
                  className="rh-reserva-item"
                  onClick={() => setReservaSeleccionada(reserva)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="rh-cliente">{reserva.cliente}</p>
                    <span className="rh-reserva-mesa">{reserva.mesa}</span>
                  </div>
                  <div className="rh-reserva-numero">
                    {reserva.numero}
                  </div>
                  {reserva.comensales && (
                    <div className="rh-reserva-info">
                      <Clock className="rh-reserva-icon" />
                      {moment(reserva.hora, 'HH:mm').format('hh:mm A')}
                      <span>|</span>
                      <UsersRound className="rh-reserva-icon" />
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
                setEventos(prev => prev.filter(ev => ev.id !== reservaSeleccionada.id));
                setReservasDelDia(prev => prev.filter(r => r.id !== reservaSeleccionada.id));
                setReservaSeleccionada(null);
              });
          }}
        />
      )}
    </section>
  );
};
 
export default ReservacionesHechas;