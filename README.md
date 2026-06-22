# 🎬 Proyecto Backend Netflix - Universidad de Caldas

Este proyecto es una API REST construida con **Node.js**, **Express** y **MongoDB Atlas** para gestionar un catálogo de títulos y el historial de visualizaciones.

## 🚀 Configuración del Entorno

### Requisitos previos
* [Node.js](https://nodejs.org/) 18 o superior (incluye `npm`).
* Una base de datos MongoDB: **local** (`mongodb://localhost:27017`) o en la nube con **MongoDB Atlas**.

### Pasos de instalación

1. **Clonar el repositorio y entrar a la carpeta**
   ```bash
   git clone https://github.com/Laura-cardonna/Proyecto-plataforma-Streaming-Back.git
   cd Proyecto-plataforma-Streaming-Back
   ```

2. **Instalar las dependencias**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**

   Copia el archivo de ejemplo y rellénalo con tus valores:
   ```bash
   cp .env.example .env      # en Windows (PowerShell): copy .env.example .env
   ```
   Edita el `.env` y define:
   | Variable    | Descripción                                         | Ejemplo                                  |
   |-------------|-----------------------------------------------------|------------------------------------------|
   | `PORT`      | Puerto donde corre el backend                       | `5000`                                   |
   | `MONGO_URI` | Cadena de conexión a MongoDB (local o Atlas)        | `mongodb://localhost:27017/StreamingProject` |

   > ⚠️ El archivo `.env` contiene credenciales y **no se sube al repositorio** (está en `.gitignore`). Solo se versiona `.env.example`.

4. **Levantar el servidor**
   ```bash
   npm start
   ```
   El servidor corre por defecto en: `http://localhost:5000`
   Para comprobar que está vivo, abre `http://localhost:5000/` o `http://localhost:5000/api/titulos`.

### 📜 Scripts disponibles (`npm run ...`)

| Comando                   | Qué hace                                                                 |
|---------------------------|-------------------------------------------------------------------------|
| `npm start`               | Inicia el servidor de la API (`index.js`).                              |
| `npm run seed`            | Inserta datos de prueba masivos por lotes. Ej: `node seed.js 100000`.   |
| `npm run regenerar`       | Ajusta la BD a un total exacto de documentos conservando los reales.    |
| `npm run diagnostico`     | Muestra totales por colección y cuántos son datos de prueba (seed).     |
| `npm run migrar:exportar` | Exporta las colecciones de Atlas a archivos JSON en `./backup`.         |
| `npm run migrar:importar` | Importa los JSON de `./backup` a una MongoDB local.                     |

### 🗂️ Estructura del proyecto

```
.
├── index.js              # Punto de entrada: configura Express, CORS y la conexión a MongoDB
├── models/               # Esquemas de Mongoose
│   ├── Titulo.js         #   - Catálogo de títulos (películas/series)
│   └── Visualizacion.js  #   - Historial de visualizaciones
├── routes/
│   └── api.js            # Todas las rutas REST (montadas bajo /api)
├── backup/               # Respaldos JSON usados por los scripts de migración
├── seed.js               # Carga masiva de datos de prueba
├── regenerar.js          # Regenera datos hasta un total objetivo
├── diagnostico.js        # Diagnóstico de la base de datos
├── migrar-exportar.js    # Migración: Atlas -> JSON
├── migrar-importar.js    # Migración: JSON -> MongoDB local
├── .env.example          # Plantilla de variables de entorno
└── package.json
```

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