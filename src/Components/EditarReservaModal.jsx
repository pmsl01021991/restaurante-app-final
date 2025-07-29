// EditarReservaModal.jsx
import React, { useState, useEffect } from 'react';
import '../Styles/EditarReservaModal.css';

const EditarReservaModal = ({ reserva, onClose, onGuardar, onEliminar }) => {
  const [mesa, setMesa] = useState('');
  const [comensales, setComensales] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [cliente, setCliente] = useState('');
  const [plato, setPlato] = useState('');

  useEffect(() => {
    if (reserva) {
      setMesa(reserva.mesa);
      setComensales(reserva.comensales);
      setFecha(reserva.fecha);
      setHora(reserva.hora);
      setCliente(reserva.cliente);
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


        <label>Comensales</label>
        <input type="number" value={comensales} onChange={(e) => setComensales(e.target.value)} />

        <label>Fecha</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <label>Hora</label>
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />

        <label>Cliente</label>
        <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} />

        <label>Plato</label>
        <input type="text" value={plato} onChange={(e) => setPlato(e.target.value)} />


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
