/**
 * SCRIPT SEMILLA (SEED) — Inserción masiva de documentos en MongoDB.
 *
 * Uso:
 *    node seed.js 100000        -> inserta 100.000 títulos
 *    node seed.js 1000000       -> inserta 1.000.000 de títulos
 *    node seed.js 10000000      -> inserta 10.000.000 (¡requiere MongoDB local!)
 *
 * Técnica clave: NO se inserta uno por uno. Se generan LOTES grandes
 * (BATCH) y se mandan con insertMany({ ordered: false }), que es la forma
 * más rápida de cargar millones de documentos.
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Titulo = require('./models/Titulo');

// --- Configuración ---
const TOTAL = parseInt(process.argv[2]) || 100000; // cuántos insertar (argumento 1)
const BATCH = 20000;                                // tamaño de cada lote

// --- Valores de ejemplo para generar datos variados ---
const TIPOS = ['Película', 'Serie'];
const GENEROS = ['Drama', 'Action', 'Comedies', 'Documentaries', 'Thriller',
  'Sci-Fi', 'Horror', 'International TV Shows', 'TV Dramas', 'Crime TV Shows'];
const PAISES = ['United States', 'Colombia', 'Mexico', 'Spain', 'India',
  'United Kingdom', 'Japan', 'France', 'Brazil', 'South Korea'];
const DIRECTORES = ['Ava Smith', 'Carlos Ruiz', 'Kenji Tanaka', 'Marie Dubois',
  'John Carter', 'Lucia Gómez', 'Sam Patel', 'Olga Petrova'];
const EDADES = ['G', 'PG', 'PG-13', 'R', 'TV-MA', 'TV-14'];

// Devuelve un elemento al azar de un arreglo
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Entero aleatorio entre min y max
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Genera UN documento de título sintético
function generarTitulo(n) {
  const tipo = pick(TIPOS);
  return {
    id_titulo: `seed-${n}`,                       // id único basado en el contador
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
    console.log(`✅ Conectado. Insertando ${TOTAL.toLocaleString()} documentos en lotes de ${BATCH.toLocaleString()}...\n`);

    let insertados = 0;
    for (let i = 0; i < TOTAL; i += BATCH) {
      const cantidadLote = Math.min(BATCH, TOTAL - i);
      const lote = [];
      for (let j = 0; j < cantidadLote; j++) {
        lote.push(generarTitulo(i + j));
      }
      // ordered:false = si un doc falla, sigue con los demás (más rápido y robusto)
      await Titulo.insertMany(lote, { ordered: false });
      insertados += cantidadLote;
      const pct = ((insertados / TOTAL) * 100).toFixed(1);
      process.stdout.write(`\r   Insertados: ${insertados.toLocaleString()} / ${TOTAL.toLocaleString()} (${pct}%)`);
    }

    const seg = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(`\n\n🎉 Listo. ${insertados.toLocaleString()} documentos insertados en ${seg}s.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    process.exit(1);
  }
})();
