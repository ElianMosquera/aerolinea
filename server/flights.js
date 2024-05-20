// Importa las dependencias necesarias
const express = require('express');
const mongoose = require('mongoose');

// Conecta con la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/reservas', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

// Define el modelo de datos para las reservas de vuelo
const FlightSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  date: Date
});
const Flight = mongoose.model('Flight', FlightSchema);

// Configura la aplicación Express
const app = express();
app.use(express.json());

// Ruta para guardar una nueva reserva de vuelo
app.post('/flights', async (req, res) => {
  try {
    const { origin, destination, date } = req.body;

    // Verifica si los países ya están reservados en cualquier fecha
    const existingOriginReservation = await Flight.findOne({ origin });
    const existingDestinationReservation = await Flight.findOne({ destination });

    if (existingOriginReservation || existingDestinationReservation) {
      // Países ya reservados
      return res.status(400).json({ error: 'Uno o ambos países ya están reservados' });
    }

    // Si no hay conflictos, guarda la nueva reserva en la base de datos
    const newFlight = new Flight({ origin, destination, date });
    await newFlight.save();
    res.status(201).json({ message: 'Reserva guardada exitosamente' });
  } catch (err) {
    console.error('Error al guardar la reserva:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
