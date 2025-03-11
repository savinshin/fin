import "./style.css";

class MovieApp {
  constructor() {
    // Configuración de la API
    this.API_KEY = "366dd3342c5cf8478fd777c6a4d843e6";
    this.BASE_URL = "https://api.themoviedb.org/3";
    this.POPULAR_URL = `${this.BASE_URL}/movie/popular?api_key=${this.API_KEY}&language=es-ES`;
    this.SEARCH_URL = `${this.BASE_URL}/search/movie?api_key=${this.API_KEY}&language=es-ES&query=`;

    // Estado de la aplicación
    this.currentPage = 1;
    this.totalPages = 1;
    this.lastSearchTerm = "";

    // Referencias DOM
    this.moviesContainer = document.getElementById("movies-container");
    this.searchInput = document.getElementById("search-input");
    this.searchButton = document.getElementById("search-button");
    this.prevButton = document.getElementById("prev-page");
    this.nextButton = document.getElementById("next-page");
    this.pageInfo = document.getElementById("page-info");
    this.modal = document.getElementById("movie-modal");
    this.closeModal = document.querySelector(".close-modal");

    // Bindings
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleMovieClick = this.handleMovieClick.bind(this);
    this.closeMovieModal = this.closeMovieModal.bind(this);

    // Inicializar eventos
    this.initializeEventListeners();

    // Cargar películas iniciales
    this.loadPopularMovies();
  }

  initializeEventListeners() {
    this.searchButton.addEventListener("click", this.handleSearch);
    this.searchInput.addEventListener("keypress", this.handleKeyPress);
    this.prevButton.addEventListener("click", this.handlePrevPage);
    this.nextButton.addEventListener("click", this.handleNextPage);
    this.closeModal.addEventListener("click", this.closeMovieModal);
    window.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.closeMovieModal();
      }
    });
  }

  async fetchMovies(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.totalPages = data.total_pages;
      this.updatePaginationControls();
      this.displayMovies(data.results);
    } catch (error) {
      this.handleError(error);
    }
  }

  async fetchMovieDetails(movieId) {
    try {
      const url = `${this.BASE_URL}/movie/${movieId}?api_key=${this.API_KEY}&language=es-ES`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.displayMovieDetails(data);
    } catch (error) {
      console.error("Error al obtener detalles de la película:", error);
      alert("No se pudieron cargar los detalles de la película");
    }
  }

  displayMovieDetails(movie) {
    document.getElementById("modal-title").textContent = movie.title;
    document.getElementById("modal-poster").src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=Sin+Imagen";
    document.getElementById("modal-release-date").textContent = new Date(
      movie.release_date
    ).toLocaleDateString("es-ES");
    document.getElementById("modal-rating").textContent =
      movie.vote_average.toFixed(1);
    document.getElementById("modal-duration").textContent =
      movie.runtime || "N/A";
    document.getElementById("modal-overview").textContent =
      movie.overview || "No hay sinopsis disponible";

    const genresContainer = document.getElementById("modal-genres");
    genresContainer.innerHTML = "";
    if (movie.genres && movie.genres.length > 0) {
      movie.genres.forEach((genre) => {
        const genreTag = document.createElement("span");
        genreTag.classList.add("genre-tag");
        genreTag.textContent = genre.name;
        genresContainer.appendChild(genreTag);
      });
    } else {
      genresContainer.textContent = "Géneros no disponibles";
    }

    this.modal.classList.add("show");
  }

  closeMovieModal() {
    this.modal.classList.remove("show");
  }

  async handleMovieClick(movieId) {
    await this.fetchMovieDetails(movieId);
  }

  updatePaginationControls() {
    this.pageInfo.textContent = `Página ${this.currentPage} de ${this.totalPages}`;
    this.prevButton.disabled = this.currentPage === 1;
    this.nextButton.disabled = this.currentPage === this.totalPages;
  }

  handlePrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCurrentPage();
    }
  }

  handleNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCurrentPage();
    }
  }

  loadCurrentPage() {
    const baseUrl = this.lastSearchTerm
      ? `${this.SEARCH_URL}${encodeURIComponent(this.lastSearchTerm)}`
      : this.POPULAR_URL;
    this.fetchMovies(`${baseUrl}&page=${this.currentPage}`);
  }

  handleError(error) {
    console.error("Error al obtener los datos:", error);
    this.moviesContainer.innerHTML = `
      <div class="error-message">
        Lo sentimos, ha ocurrido un error al cargar las películas. 
        Por favor, inténtelo de nuevo más tarde.
      </div>
    `;
  }

  displayMovies(movies) {
    this.moviesContainer.innerHTML = "";

    if (!movies || movies.length === 0) {
      this.displayNoResults();
      return;
    }

    const moviesFragment = document.createDocumentFragment();

    movies.forEach((movie) => {
      const movieElement = this.createMovieElement(movie);
      moviesFragment.appendChild(movieElement);
    });

    this.moviesContainer.appendChild(moviesFragment);
  }

  createMovieElement(movie) {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");

    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=Sin+Imagen";

    const img = document.createElement("img");
    img.src = posterPath;
    img.alt = movie.title;
    img.loading = "lazy";

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("movie-title");
    titleDiv.textContent = movie.title;

    movieDiv.appendChild(img);
    movieDiv.appendChild(titleDiv);

    // Agregar evento de clic para mostrar detalles
    movieDiv.addEventListener("click", () => this.handleMovieClick(movie.id));

    return movieDiv;
  }

  displayNoResults() {
    const noResultsDiv = document.createElement("div");
    noResultsDiv.classList.add("no-results");
    noResultsDiv.textContent = "No se encontraron películas";
    this.moviesContainer.appendChild(noResultsDiv);
  }

  handleSearch() {
    const searchTerm = this.searchInput.value.trim();
    this.lastSearchTerm = searchTerm;
    this.currentPage = 1;

    if (searchTerm) {
      const searchWithQuery = `${this.SEARCH_URL}${encodeURIComponent(
        searchTerm
      )}&page=${this.currentPage}`;
      this.fetchMovies(searchWithQuery);
    } else {
      this.loadPopularMovies();
    }
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.handleSearch();
    }
  }

  loadPopularMovies() {
    this.lastSearchTerm = "";
    this.currentPage = 1;
    this.fetchMovies(`${this.POPULAR_URL}&page=${this.currentPage}`);
  }
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  new MovieApp();
});
