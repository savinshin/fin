# Catálogo de Películas con Vite y TMDB API

Este proyecto es una aplicación web que muestra un catálogo de películas utilizando la API de The Movie Database (TMDB). Permite buscar películas, ver detalles y navegar a través de un sistema de paginación.

## Tecnologías Utilizadas

- Vite
- JavaScript
- HTML5
- CSS3
- API de TMDB

## Pasos de Desarrollo

1. **Configuración Inicial**

   ```bash
   npm create vite@latest final_vite
   cd final_vite
   npm install
   ```

2. **Estructura del Proyecto**

   - Configuración de la estructura básica de archivos
   - Eliminación de archivos innecesarios de Vite
   - Creación de los archivos principales (HTML, CSS, JS)

3. **Integración con TMDB API**

   - Obtención de la API Key de TMDB
   - Implementación de la función para obtener películas populares
   - Configuración de las URLs de la API

4. **Desarrollo de Funcionalidades**

   - Visualización de películas en grid
   - Sistema de búsqueda
   - Paginación
   - Modal con detalles de película
   - Manejo de errores y estados de carga

5. **Mejoras de UX/UI**
   - Diseño responsive
   - Animaciones y transiciones
   - Lazy loading de imágenes
   - Estilos para el modal y componentes

## Características Principales

- Visualización de películas populares
- Búsqueda de películas
- Paginación de resultados
- Diseño responsive
- Detalles completos de cada película
- Interfaz moderna y amigable

## Estructura del Código

- `index.html`: Estructura principal y modal
- `src/main.js`: Lógica principal de la aplicación (clase MovieApp)
- `src/style.css`: Estilos y diseño responsive

## Mejoras Futuras Posibles

- Implementar sistema de favoritos
- Agregar filtros por género
- Integrar reproductor de trailers
- Añadir sistema de recomendaciones
- Implementar modo oscuro

## Autor

Savin Ilya