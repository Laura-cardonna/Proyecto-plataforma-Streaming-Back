const cors = require('cors'); // Al principio con los otros require
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const rutasAPI = require('./routes/api'); // <--- Nueva línea

const app = express();
app.use(cors()); // Esto permite que el Frontend se conecte

app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('¡Conectado exitosamente a MongoDB! 🚀'))
  .catch((error) => console.error('Error al conectar a MongoDB ❌:', error));

// USAR LAS RUTAS
app.use('/api', rutasAPI); // <--- Nueva línea (todas las rutas empezarán con /api)

app.get('/', (req, res) => {
  res.send('El backend está corriendo perfectamente. Prueba /api/titulos');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT} 🏃‍♂️`);
});