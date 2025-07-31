import React, { useState, useEffect } from 'react';
import '../Styles/EditarReservaModal.css';

const EditarReservaModal = ({ reserva, onClose, onGuardar, onEliminar }) => {
  const [mesa, setMesa] = useState('');
  const [comensales, setComensales] = useState(1);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [cliente, setCliente] = useState('');
  const [plato, setPlato] = useState('');

  // Lista de horarios permitidos
  const horariosPermitidos = [
    '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00',
    '21:00', '22:00'
  ];

  useEffect(() => {
    if (reserva) {
      setMesa(reserva.mesa || '');
      setComensales(reserva.comensales || 1);
      setFecha(reserva.fecha || '');
      setHora(reserva.hora || '');
      setCliente(reserva.cliente || '');
      setPlato(reserva.plato || '');
    }
  }, [reserva]);

  const handleGuardar = () => {
    const reservaActualizada = { mesa, comensales, fecha, hora, cliente, plato };
    onGuardar(reservaActualizada);
  };

  const handleEliminar = () => {
    onEliminar();     
    onClose();        
  };

  if (!reserva) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Editar Reserva</h3>

        {/* Selección de mesa */}
        <label>Mesa</label>
        <select value={mesa} onChange={(e) => setMesa(e.target.value)}>
          {Array.from({ length: 16 }, (_, i) => {
            const nombreMesa = `Mesa ${i + 1}`;
            return (
              <option key={i + 1} value={nombreMesa}>
                {nombreMesa}
              </option>
            );
          })}
        </select>

        {/* Comensales como select */}
        <label>Comensales</label>
        <select
          value={comensales}
          onChange={(e) => setComensales(Number(e.target.value))}
        >
          {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'comensal' : 'comensales'}
            </option>
          ))}
        </select>

        {/* Fecha */}
        <label>Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        {/* Hora como select */}
        <label>Hora</label>
        <select value={hora} onChange={(e) => setHora(e.target.value)}>
          {horariosPermitidos.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        {/* Cliente */}
        <label>Cliente</label>
        <input
          type="text"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />

        {/* Plato */}
        <label>Plato</label>
        <input
          type="text"
          value={plato}
          onChange={(e) => setPlato(e.target.value)}
        />

        {/* Botones */}
        <div className="modal-buttons">
          <button onClick={onClose}>Cerrar</button>
          <button className="btn-eliminar" onClick={handleEliminar}>Eliminar</button>
          <button className="btn-guardar" onClick={handleGuardar}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default EditarReservaModal;
