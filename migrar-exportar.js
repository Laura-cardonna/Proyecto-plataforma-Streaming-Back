/**
 * PASO 1 DE LA MIGRACIÓN: Exportar datos de MongoDB Atlas a archivos JSON.
 *
 * Lee las colecciones Titulos y Visualizaciones desde Atlas (usando el
 * MONGO_URI del archivo .env) y las guarda en la carpeta ./backup como JSON.
 * Esos archivos son tu respaldo permanente y la fuente para importar a local.
 *
 * Uso:  node migrar-exportar.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Titulo = require('./models/Titulo');
const Visualizacion = require('./models/Visualizacion');

(async () => {
  try {
    console.log('Conectando a Atlas (origen)...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado.\n');

    const carpeta = path.join(__dirname, 'backup');
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta);

    const titulos = await Titulo.find().lean();
    fs.writeFileSync(
      path.join(carpeta, 'titulos.json'),
      JSON.stringify(titulos, null, 2)
    );
    console.log(`📦 ${titulos.length} títulos exportados a backup/titulos.json`);

    const visualizaciones = await Visualizacion.find().lean();
    fs.writeFileSync(
      path.join(carpeta, 'visualizaciones.json'),
      JSON.stringify(visualizaciones, null, 2)
    );
    console.log(`📦 ${visualizaciones.length} visualizaciones exportadas a backup/visualizaciones.json`);

    console.log('\n🎉 Exportación completa. Ahora corre: node migrar-importar.js');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ ERROR al exportar:', err.message);
    process.exit(1);
  }
})();
