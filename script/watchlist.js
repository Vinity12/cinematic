const apikey = '49cb96f4';
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const grid = document.getElementById('movieGrid');

async function loadMovie() {
    grid.innerHTML = `
        <div class="spinner-border mx-auto" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;

    const savedMovies = localStorage.getItem("savedMovies");
    render(savedMovies ? JSON.parse(savedMovies) : []);
}

function render(movies) {
    grid.innerHTML = '';

    if (movies.length === 0) {
        grid.innerHTML = '<p class="text-center">No movies in your watchlist.</p>';
        return;
    }

    movies.forEach(function(movie) {
        const movieItem = `
            <div class="col-12 col-sm-2 col-md-4 col-lg-2 card p-0 m-2 border-0 movie-card" style="background-image: url('${movie.Poster}');">
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" onerror="handleImageError(this)">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">${movie.Year}</p>

                    <button type="button" class="btn btn-danger mt-auto w-auto" onclick="removeFromWatchlist('${movie.imdbID}')">
                        Remove from Watchlist
                    </button>
                </div>
            </div>
        `;

        grid.innerHTML += movieItem;
    });
}

async function removeFromWatchlist(movieID) {
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

function handleImageError(img) {
    console.log("Image not found:", img.src);
    img.onerror = null;
    img.src = "https://via.placeholder.com/300x450?text=No+Image";
}