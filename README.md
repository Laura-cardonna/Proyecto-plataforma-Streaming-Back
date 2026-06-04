# 🎬 Proyecto Backend Netflix - Universidad de Caldas

Este proyecto es una API REST construida con **Node.js**, **Express** y **MongoDB Atlas** para gestionar un catálogo de títulos y el historial de visualizaciones.

## 🚀 Configuración del Entorno
El servidor corre por defecto en: `http://localhost:5000`

---

## 🛠️ Guía de Pruebas CRUD (Postman)

A continuación se detallan las 15 consultas requeridas para la gestión del sistema.

### 1. CREATE (Inserciones)

* **Insertar un nuevo título**
    * **Método:** `POST`
    * **URL:** `http://localhost:5000/api/titulos`
    * **Body (JSON):**
    ```json
    {
      "id_titulo": "s101",
      "tipo_contenido": "Película",
      "titulo": "Proyecto Final Unicaldas",
      "director": "Laura Cardona",
      "elenco": ["Laura Cardona", "Estudiante IT"],
      "pais_produccion": ["Colombia"],
      "fecha_agregado": "June 4, 2024",
      "anio_lanzamiento": 2024,
      "clasificacion_edad": "G",
      "duracion": "100 min",
      "generos": ["Educación", "Tecnología"],
      "descripcion": "Demostración del CRUD para el proyecto final."
    }
    ```

* **Insertar una nueva visualización**
    * **Método:** `POST`
    * **URL:** `http://localhost:5000/api/visualizaciones`
    * **Body (JSON):**
    ```json
    {
      "id_visualizacion": "v101",
      "id_titulo": "s101",
      "fecha_visualizacion": "2024-06-04",
      "pais_usuario": "Colombia",
      "calificacion_usuario": 5,
      "dispositivo": "Smart TV",
      "tiempo_reproduccion": "100 min"
    }
    ```

### 2. READ (Consultas de Usuario)

* **Consultar todos los títulos tipo Película**
    * **Método:** `GET`
    * **URL:** `http://localhost:5000/api/titulos/tipo/Película`

* **Consultar títulos por género**
    * **Método:** `GET`
    * **URL:** `http://localhost:5000/api/titulos/genero/Documentaries`

* **Consultar títulos por país de producción**
    * **Método:** `GET`
    * **URL:** `http://localhost:5000/api/titulos/pais/United States`

* **Consultar títulos por año de lanzamiento**
    * **Método:** `GET`
    * **URL:** `http://localhost:5000/api/titulos/anio/2020`

* **Consultar visualizaciones por país**
    * **Método:** `GET`
    * **URL:** `http://localhost:5000/api/visualizaciones/pais/Colombia`

* **Consultar visualizaciones de un título específico**
    * **Método:** `GET`
    * **URL:** `http://localhost:5000/api/visualizaciones/titulo/s1`

* **Contar cuántas visualizaciones tiene cada título (Agregación)**
    * **Método:** `GET`
    * **URL:** `http://localhost:5000/api/reporte/conteo-visualizaciones`

### 3. UPDATE (Actualizaciones)

* **Agregar un nuevo género a un título**
    * **Método:** `PUT`
    * **URL:** `http://localhost:5000/api/titulos/agregar-genero/s1`
    * **Body (JSON):** `{"genero": "Acción Romántica"}`

* **Agregar un nuevo actor al elenco**
    * **Método:** `PUT`
    * **URL:** `http://localhost:5000/api/titulos/agregar-actor/s1`
    * **Body (JSON):** `{"actor": "Ricardo Darín"}`

* **Actualizar la clasificación de edad de un título**
    * **Método:** `PATCH`
    * **URL:** `http://localhost:5000/api/titulos/actualizar-edad/s1`
    * **Body (JSON):** `{"nueva_edad": "TV-14"}`

* **Modificar la calificación de una visualización**
    * **Método:** `PATCH`
    * **URL:** `http://localhost:5000/api/visualizaciones/calificacion/v1`
    * **Body (JSON):** `{"nueva_calificacion": 4}`

### 4. DELETE (Eliminación)

* **Eliminar un título del catálogo**
    * **Método:** `DELETE`
    * **URL:** `http://localhost:5000/api/titulos/s101`

---

## 📊 Justificación Técnica (Sustentación)

1.  **Modelo de Datos:** Se utilizó un esquema flexible basado en documentos para permitir el almacenamiento de datos multievaluados (arreglos) como `elenco` y `generos` sin necesidad de tablas intermedias.
2.  **Agregaciones:** Se implementó el `Aggregation Framework` de MongoDB para el conteo de visualizaciones, optimizando el procesamiento de datos directamente en el motor de la base de datos.