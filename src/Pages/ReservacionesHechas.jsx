import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Styles/ReservacionesHechas.css';
import Container from '../Components/Container';
import EditarReservaModal from '../Components/EditarReservaModal';
import ReservasLista from './ReservasLista'; // 👈 Nuevo componente

const localizer = momentLocalizer(moment);

const ReservacionesHechas = () => {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [reservasDelDia, setReservasDelDia] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  const cargarReservas = () => {
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
  };

  useEffect(() => {
    cargarReservas();
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
          {/* ✅ Calendario */}
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

          {/* ✅ Lista separada */}
          <ReservasLista
            reservas={reservasDelDia}
            fechaSeleccionada={fechaSeleccionada}
            onSelectReserva={setReservaSeleccionada}
          />
        </div>
      </Container>

      {/* Modal de edición */}
      <EditarReservaModal
        reserva={reservaSeleccionada}
        onClose={() => setReservaSeleccionada(null)}
        onGuardar={(reservaActualizada) => {
          fetch(`https://json-backend-reservas2.onrender.com/reservas/${reservaSeleccionada.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaActualizada)
          }).then(() => {
            cargarReservas();
            setReservaSeleccionada(null);
          });
        }}
        onEliminar={() => {
          fetch(`https://json-backend-reservas2.onrender.com/reservas/${reservaSeleccionada.id}`, {
            method: 'DELETE'
          }).then(() => {
            cargarReservas();
            setReservaSeleccionada(null);
          });
        }}
      />
    </section>
  );
};

export default ReservacionesHechas;
