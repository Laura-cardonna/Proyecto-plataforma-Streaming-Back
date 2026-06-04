const mongoose = require('mongoose');

const visualizacionSchema = new mongoose.Schema({
  id_visualizacion: { type: String, required: true, unique: true },
  id_titulo: { type: String, required: true },
  fecha_visualizacion: { type: String, required: true },
  pais_usuario: { type: String },
  calificacion_usuario: { type: Number },
  dispositivo: { type: String },
  tiempo_reproduccion: { type: String }
}, { versionKey: false });

// Ahora sí: visualizacionSchema coincide con la variable de arriba
module.exports = mongoose.model('Visualizacion', visualizacionSchema, 'Visualizaciones');