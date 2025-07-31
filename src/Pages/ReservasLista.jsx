import { Clock, UsersRound } from 'lucide-react';
import moment from 'moment';

const ReservasLista = ({ reservas, fechaSeleccionada, onSelectReserva }) => {
  return (
    <div className="rh-panel-container">
      <h3 className="panel-title">
        {fechaSeleccionada ? `Reservas para ${fechaSeleccionada}` : 'Todas las reservas'}
      </h3>

      {reservas.length === 0 ? (
        <p className="no-reservas-text">No hay reservas para esta fecha.</p>
      ) : (
        reservas.map((reserva, i) => (
          <div
            key={i}
            className="rh-reserva-item"
            onClick={() => onSelectReserva(reserva)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="rh-cliente">{reserva.cliente}</p>
              <span className="rh-reserva-mesa">{reserva.mesa}</span>
            </div>
            <div className="rh-reserva-numero">{reserva.numero}</div>
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
  );
};

export default ReservasLista;
