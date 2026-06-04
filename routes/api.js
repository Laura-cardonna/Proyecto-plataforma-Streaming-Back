const express = require('express');
const router = express.Router();
const Titulo = require('../models/Titulo');
const Visualizacion = require('../models/Visualizacion');

// --- 1. CREATE (Inserciones) ---

// Insertar un nuevo título
router.post('/titulos', async (req, res) => {
    try {
        const nuevoTitulo = new Titulo(req.body);
        await nuevoTitulo.save();
        res.json({ mensaje: "Título creado", data: nuevoTitulo });
    } catch (err) {
        console.log("ERROR DETALLADO:", err);
        res.status(500).json({ mensaje: "Error interno", error: err.message });
    }
});

// Insertar una nueva visualización
router.post('/visualizaciones', async (req, res) => {
    try {
        const nuevaVis = new Visualizacion(req.body);
        await nuevaVis.save();
        res.json({ mensaje: "Visualización registrada", data: nuevaVis });
    } catch (err) { res.status(500).json(err); }
});

// Agregar un nuevo género a un título (Uso de $push para arreglos)
router.put('/titulos/agregar-genero/:id', async (req, res) => {
    try {
        const actualizado = await Titulo.findOneAndUpdate(
            { id_titulo: req.params.id },
            { $push: { generos: req.body.genero } },
            { new: true }
        );
        res.json(actualizado);
    } catch (err) { res.status(500).json(err); }
});

// Agregar un nuevo actor al elenco
router.put('/titulos/agregar-actor/:id', async (req, res) => {
    try {
        const actualizado = await Titulo.findOneAndUpdate(
            { id_titulo: req.params.id },
            { $push: { elenco: req.body.actor } },
            { new: true }
        );
        res.json(actualizado);
    } catch (err) { res.status(500).json(err); }
});

// --- 2. READ (Consultas) ---

// NUEVA: Consultar TODOS los títulos (Necesaria para la carga inicial del Front)
router.get('/titulos', async (req, res) => {
    try {
        const titulos = await Titulo.find();
        res.json(titulos);
    } catch (err) { res.status(500).json(err); }
});

// Consultar todos los títulos tipo Película (Flexible para evitar error 404 por tildes)
router.get('/titulos/tipo/pelicula', async (req, res) => {
    try {
        // Busca "Película" o "pelicula" de forma insensible a mayúsculas/tildes
        const titulos = await Titulo.find({ 
            tipo_contenido: { $regex: new RegExp("Película", "i") } 
        });
        res.json(titulos);
    } catch (err) { res.status(500).json(err); }
});

// Consultar títulos por género (Busca dentro del arreglo)
router.get('/titulos/genero/:genero', async (req, res) => {
    try {
        const titulos = await Titulo.find({ generos: req.params.genero });
        res.json(titulos);
    } catch (err) { res.status(500).json(err); }
});

// Consultar títulos por país de producción
router.get('/titulos/pais/:pais', async (req, res) => {
    try {
        const titulos = await Titulo.find({ pais_produccion: req.params.pais });
        res.json(titulos);
    } catch (err) { res.status(500).json(err); }
});

// Consultar títulos por año de lanzamiento
router.get('/titulos/anio/:anio', async (req, res) => {
    try {
        const titulos = await Titulo.find({ anio_lanzamiento: parseInt(req.params.anio) });
        res.json(titulos);
    } catch (err) { res.status(500).json(err); }
});

// Consultar visualizaciones por país
router.get('/visualizaciones/pais/:pais', async (req, res) => {
    try {
        const vis = await Visualizacion.find({ pais_usuario: req.params.pais });
        res.json(vis);
    } catch (err) { res.status(500).json(err); }
});

// Consultar visualizaciones de un título específico
router.get('/visualizaciones/titulo/:id', async (req, res) => {
    try {
        const vis = await Visualizacion.find({ id_titulo: req.params.id });
        res.json(vis);
    } catch (err) { res.status(500).json(err); }
});

// AGREGACIÓN: Contar cuántas visualizaciones tiene cada título
router.get('/reporte/conteo-visualizaciones', async (req, res) => {
    try {
        const reporte = await Visualizacion.aggregate([
            { $group: { _id: "$id_titulo", total: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);
        res.json(reporte);
    } catch (err) { res.status(500).json(err); }
});
// --- AGREGAR ESTO EN TU BACKEND ---

// Consultar todos los títulos tipo Serie (Insensible a mayúsculas)
router.get('/titulos/tipo/serie', async (req, res) => {
    try {
        const titulos = await Titulo.find({ 
            tipo_contenido: { $regex: new RegExp("Serie", "i") } 
        });
        res.json(titulos);
    } catch (err) { res.status(500).json(err); }
});

// NUEVA: Consultar UN título por su ID (Para que funcione el clic desde visualizaciones)
router.get('/titulos/id/:id', async (req, res) => {
    try {
        const titulo = await Titulo.findOne({ id_titulo: req.params.id });
        res.json(titulo);
    } catch (err) { res.status(500).json(err); }
});
// --- 3. UPDATE (Actualizaciones) ---

// Actualizar la clasificación de edad de un título
router.patch('/titulos/actualizar-edad/:id', async (req, res) => {
    try {
        const actualizado = await Titulo.findOneAndUpdate(
            { id_titulo: req.params.id },
            { clasificacion_edad: req.body.nueva_edad },
            { new: true }
        );
        res.json(actualizado);
    } catch (err) { res.status(500).json(err); }
});

// Modificar la calificación de una visualización
router.patch('/visualizaciones/calificacion/:id', async (req, res) => {
    try {
        const actualizado = await Visualizacion.findOneAndUpdate(
            { id_visualizacion: req.params.id },
            { calificacion_usuario: req.body.nueva_calificacion },
            { new: true }
        );
        res.json(actualizado);
    } catch (err) { res.status(500).json(err); }
});

// --- 4. DELETE (Eliminación) ---

// Eliminar un título
router.delete('/titulos/:id', async (req, res) => {
    try {
        await Titulo.findOneAndDelete({ id_titulo: req.params.id });
        res.json({ mensaje: "Título eliminado satisfactoriamente" });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;