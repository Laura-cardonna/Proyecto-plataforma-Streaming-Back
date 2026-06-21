const mongoose = require('mongoose');

const tituloSchema = new mongoose.Schema({
    id_titulo: { type: String, required: true, unique: true },
    tipo_contenido: { type: String },
    titulo: { type: String, required: true },
    director: { type: String },
    elenco: { type: Array },
    pais_produccion: { type: String },
    fecha_adicion: { type: String },
    anio_lanzamiento: { type: Number },
    clasificacion_edad: { type: String },
    duracion: { type: String },
    generos: { type: Array },
    descripcion: { type: String },
    imagen: { type: String } // URL del póster de la película/serie
});

// La clave es que este nombre 'tituloSchema' coincida con el de arriba
module.exports = mongoose.model('Titulo', tituloSchema, 'Titulos');