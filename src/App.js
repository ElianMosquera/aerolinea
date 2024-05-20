import React, { useState } from 'react';
import './App.css'; // Archivo CSS para estilos personalizados

function FlightBookingForm() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [reservations, setReservations] = useState([]);

  const handleOriginChange = (event) => {
    setOrigin(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ origin, destination, date })
      });
      if (!response.ok) {
        throw new Error('Error al guardar la reserva');
      }
      const data = await response.json();
      console.log(data.message); // Mensaje de éxito de la reserva
      setReservations([...reservations, { origin, destination, date }]);
      setOrigin('');
      setDestination('');
      setDate('');
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      // Manejo de errores
    }
  };

  return (
    <div className="flight-booking-container">
      <h2 className="airline-name">Air Fenix Flight Reservation</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Origin:
          <input type="text" className="form-input" value={origin} onChange={handleOriginChange} />
        </label>
        <label className="form-label">
          Destination:
          <input type="text" className="form-input" value={destination} onChange={handleDestinationChange} />
        </label>
        <label className="form-label">
          Date:
          <input type="date" className="form-input" value={date} onChange={handleDateChange} />
        </label>
        <button type="submit" className="form-button">Save</button>
      </form>

      <h2 className="reservation-header">Your Reservations</h2>
      <div>
        <table className="reservation-table">
          <thead>
            <tr>
              <th>Origin</th>
              <th>Destination</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.origin}</td>
                <td>{reservation.destination}</td>
                <td>{reservation.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FlightBookingForm;
