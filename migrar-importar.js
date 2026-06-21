/**
 * PASO 2 DE LA MIGRACIÓN: Importar los JSON de respaldo a MongoDB LOCAL.
 *
 * Lee backup/titulos.json y backup/visualizaciones.json y los inserta en
 * la base de datos local (mongodb://localhost:27017/StreamingProject).
 *
 * IMPORTANTE: este script se conecta SIEMPRE a local, sin importar el .env,
 * para que no haya confusión durante la migración.
 *
 * Uso:  node migrar-importar.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Titulo = require('./models/Titulo');
const Visualizacion = require('./models/Visualizacion');

const URI_LOCAL = 'mongodb://localhost:27017/StreamingProject';

(async () => {
  try {
    console.log('Conectando a MongoDB LOCAL (destino)...');
    await mongoose.connect(URI_LOCAL);
    console.log('✅ Conectado a', URI_LOCAL, '\n');

    const carpeta = path.join(__dirname, 'backup');
    const titulosRaw = JSON.parse(fs.readFileSync(path.join(carpeta, 'titulos.json')));
    const visRaw = JSON.parse(fs.readFileSync(path.join(carpeta, 'visualizaciones.json')));

    // IMPORTANTE: el respaldo de Atlas guarda los _id como texto (string).
    // Hay que quitarlos para que MongoDB local genere ObjectId nuevos y no
    // los descarte por conflicto de tipo. Por eso usamos el driver nativo.
    const titulos = titulosRaw.map(({ _id, ...resto }) => resto);
    const visualizaciones = visRaw.map(({ _id, ...resto }) => resto);

    const colTitulos = mongoose.connection.db.collection('Titulos');
    const colVis = mongoose.connection.db.collection('Visualizaciones');

    // Limpiamos antes para no duplicar si se corre dos veces
    await colTitulos.deleteMany({});
    await colVis.deleteMany({});
    console.log('🧹 Colecciones locales limpiadas.');

    if (titulos.length) {
      const r = await colTitulos.insertMany(titulos, { ordered: false });
      console.log(`📥 ${r.insertedCount} títulos importados a local.`);
    }
    if (visualizaciones.length) {
      const r = await colVis.insertMany(visualizaciones, { ordered: false });
      console.log(`📥 ${r.insertedCount} visualizaciones importadas a local.`);
    }

    console.log('\n🎉 Migración a local completa.');
    console.log('   Ahora cambia tu .env para usar la base local (ver instrucciones).');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ ERROR al importar:', err.message);
    process.exit(1);
  }
})();
