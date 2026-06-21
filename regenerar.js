/**
 * Limpia los datos de prueba y rerellena hasta llegar a un TOTAL exacto de
 * documentos (Titulos + Visualizaciones), conservando SIEMPRE los datos reales.
 *
 * Uso:  node regenerar.js 1500000
 */
const mongoose = require('mongoose');
require('dotenv').config();
const Titulo = require('./models/Titulo');
const Visualizacion = require('./models/Visualizacion');

const OBJETIVO = parseInt(process.argv[2]) || 1500000; // total de documentos deseado
const BATCH = 20000;

const TIPOS = ['Película', 'Serie'];
const GENEROS = ['Drama', 'Action', 'Comedies', 'Documentaries', 'Thriller',
  'Sci-Fi', 'Horror', 'International TV Shows', 'TV Dramas', 'Crime TV Shows'];
const PAISES = ['United States', 'Colombia', 'Mexico', 'Spain', 'India',
  'United Kingdom', 'Japan', 'France', 'Brazil', 'South Korea'];
const DIRECTORES = ['Ava Smith', 'Carlos Ruiz', 'Kenji Tanaka', 'Marie Dubois',
  'John Carter', 'Lucia Gómez', 'Sam Patel', 'Olga Petrova'];
const EDADES = ['G', 'PG', 'PG-13', 'R', 'TV-MA', 'TV-14'];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generarTitulo(n) {
  const tipo = pick(TIPOS);
  return {
    id_titulo: `seed-${n}`,
    tipo_contenido: tipo,
    titulo: `Título de Prueba #${n}`,
    director: pick(DIRECTORES),
    elenco: [pick(DIRECTORES), pick(DIRECTORES)],
    pais_produccion: pick(PAISES),
    fecha_adicion: '2024-01-01',
    anio_lanzamiento: rand(1990, 2024),
    clasificacion_edad: pick(EDADES),
    duracion: tipo === 'Serie' ? `${rand(1, 8)} Seasons` : `${rand(80, 160)} min`,
    generos: [pick(GENEROS), pick(GENEROS)],
    descripcion: `Descripción autogenerada para el contenido número ${n}.`
  };
}

(async () => {
  const inicio = Date.now();
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a:', process.env.MONGO_URI, '\n');

    // PASO 1: borrar SOLO los datos de prueba (id_titulo que empieza con "seed-")
    const borr = await Titulo.deleteMany({ id_titulo: /^seed-/ });
    console.log(`🧹 Eliminados ${borr.deletedCount.toLocaleString()} títulos de prueba.`);

    // PASO 2: contar lo que queda (datos reales) en ambas colecciones
    const realesTit = await Titulo.countDocuments();
    const totalVis = await Visualizacion.countDocuments();
    console.log(`   Reales conservados -> Titulos: ${realesTit} | Visualizaciones: ${totalVis}`);

    // PASO 3: calcular cuántos seed faltan para llegar al objetivo total
    const yaExisten = realesTit + totalVis;
    const aInsertar = OBJETIVO - yaExisten;
    if (aInsertar <= 0) {
      console.log(`\n✅ Ya hay ${yaExisten.toLocaleString()} documentos (>= objetivo). Nada que insertar.`);
      await mongoose.disconnect();
      return;
    }
    console.log(`\n📥 Insertando ${aInsertar.toLocaleString()} títulos de prueba para llegar a ${OBJETIVO.toLocaleString()}...\n`);

    let insertados = 0;
    for (let i = 0; i < aInsertar; i += BATCH) {
      const cant = Math.min(BATCH, aInsertar - i);
      const lote = [];
      for (let j = 0; j < cant; j++) lote.push(generarTitulo(i + j));
      await Titulo.insertMany(lote, { ordered: false });
      insertados += cant;
      process.stdout.write(`\r   Insertados: ${insertados.toLocaleString()} / ${aInsertar.toLocaleString()}`);
    }

    // PASO 4: verificación final
    const finTit = await Titulo.countDocuments();
    const finVis = await Visualizacion.countDocuments();
    const seg = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(`\n\n🎉 Listo en ${seg}s.`);
    console.log('=== VERIFICACIÓN FINAL ===');
    console.log(`  Titulos:        ${finTit.toLocaleString()}`);
    console.log(`  Visualizaciones:${finVis.toLocaleString()}`);
    console.log(`  TOTAL:          ${(finTit + finVis).toLocaleString()}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    process.exit(1);
  }
})();
