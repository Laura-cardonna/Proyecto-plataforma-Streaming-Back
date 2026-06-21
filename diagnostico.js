/**
 * Script de diagnóstico: revisa si la BD tiene datos de prueba (seed) mezclados
 * con los datos reales, y muestra los totales por colección.
 */
const mongoose = require('mongoose');
require('dotenv').config();
const Titulo = require('./models/Titulo');
const Visualizacion = require('./models/Visualizacion');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a:', process.env.MONGO_URI, '\n');

    const totalTitulos = await Titulo.countDocuments();
    const seedTitulos = await Titulo.countDocuments({ id_titulo: /^seed-/ });
    const realesTitulos = totalTitulos - seedTitulos;
    const totalVis = await Visualizacion.countDocuments();

    console.log('=== COLECCIÓN Titulos ===');
    console.log('  Total:           ', totalTitulos.toLocaleString());
    console.log('  De prueba (seed):', seedTitulos.toLocaleString());
    console.log('  Reales:          ', realesTitulos.toLocaleString());
    console.log('\n=== COLECCIÓN Visualizaciones ===');
    console.log('  Total:           ', totalVis.toLocaleString());
    console.log('\n=== TOTAL DOCUMENTOS (ambas colecciones) ===');
    console.log('  ', (totalTitulos + totalVis).toLocaleString());

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ ERROR:', err.message);
    process.exit(1);
  }
})();
