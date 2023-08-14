const API_KEY = "48197844dcdcc8d08e7a3a5a316904fc";
const apiEndPoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${API_KEY}`,
  fetchMoviesList: (id) =>
    `${apiEndPoint}/discover/movie?api_key=${API_KEY}&with_genres=${id}`,
  fetchTrending: `${apiEndPoint}/trending/all/day?api_key=${API_KEY}&language=en-US`,
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`,
};

function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndbuildMovieSection(apiPaths.fetchTrending, "Trending Now")
    .then((list) => {
      const randomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
    })
    .catch((err) => {
      console.error(err);
    });
}

function buildBannerSection(movie) {
  const bannerCont = document.getElementById("banner-section");

  bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

  const div = document.createElement("div");

  div.innerHTML = `
            <h2 class="banner__title">${movie.title}</h2>
            <p class="banner__info">Trending in movies | Released - ${
              movie.release_date
            } </p>
            <p class="banner__overview">${
              movie.overview && movie.overview.length > 200
                ? movie.overview.slice(0, 200).trim() + "..."
                : movie.overview
            }</p>
            <div class="action-buttons-cont banner-button flex">
                <button class="action-button btn">              <span class="fa fa-play play" aria-hidden="true"></span>Play
                </button>
                <button class="action-button btn btn1">
                <span
                class="fa fa-info--circle play info"
                aria-hidden="true"
              ></span
              >More Info
            </button>
            </div>
        `;
  div.className = "banner-content container";

  bannerCont.append(div);
}

function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.slice(0, 3).forEach((category) => {
          fetchAndbuildMovieSection(
            apiPaths.fetchMoviesList(category.id),
            category.name
          );
        });
      }
    })
    .catch((err) => console.error(err));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies.slice(0, 6), categoryName);
      }
      return movies;
    })
    .catch((err) => console.error(err));
}

function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);

  const moviesCont = document.getElementById("movies-cont");

  const moviesListHTML = list
    .map((item) => {
      return `
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
            <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    })
    .join("");

  const moviesSectionHTML = `
        <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    `;

  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = moviesSectionHTML;

  moviesCont.append(div);
}

function searchMovieTrailer(movieName, iframId) {
  if (!movieName) return;

  fetch(apiPaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      const bestResult = res.items[0];

      const elements = document.getElementById(iframId);
      console.log(elements, iframId);

      const div = document.createElement("div");
      div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`;

      elements.append(div);
    })
    .catch((err) => console.log(err));
}

window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("black-bg");
    else header.classList.remove("black-bg");
  });
});
