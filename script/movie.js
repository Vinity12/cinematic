const apikey = '49cb96f4';
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const grid = document.getElementById('movieGrid');

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query != '') {
        searchMovie(query);
    }
});

async function searchMovie(keyword) {
    grid.innerHTML = `
        <div class="spinner-border mx-auto" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${keyword}`);
        const data = await response.json();

        if (data.Response === "True") {
            console.log(data);
            render(data.Search);
        } else {
            alert('Movie not found');
        }
    } catch (error) {
        alert('Failed to fetch movies');
    }
}

function render(movies) {
    grid.innerHTML = '';

    movies.forEach(function(movie) {
        const movieItem = `
            <div class="col card p-0 m-2 border-0" style="background-image: url(${movie.Poster});">
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">${movie.Year}</p>
                </div>
                <div class="card-footer text-body-secondary">
                    <button type="button" class="btn btn-primary" onclick="addWatchlist('${movie.imdbID}')">Watchlist</button>
                </div>
            </div>
        `;

        grid.innerHTML += movieItem;
    });
}

async function addWatchlist(movieID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&i=${movieID}`);
        const movie = await response.json();
        console.log(movie);

        let savedMovies = [];
        const saved = localStorage.getItem('savedMovies');
        if (saved) {
            savedMovies = JSON.parse(saved);
        }
        savedMovies.push(movie);
        localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
    } catch (error) {
        alert('Could not find movie ID');
    }
}