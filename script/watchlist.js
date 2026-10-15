const apikey = '49cb96f4';
const grid = document.getElementById('movieGrid');

async function searchMovie(keyword) {
    grid.innerHTML = '';
    if (keyword == '') {
        loadMovie();
    } else if (Object.keys(movies).length === 0) {
        return;
    }

    keyword.toLowerCase();
    const movies = localStorage.getItem('savedMovies').filter(movie => movie.Title.toLowerCase().includes(keyword));

    Object.keys(movies).forEach(function(key) {
        const movie = movies[key];

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

async function loadMovie() {
    grid.innerHTML = `
        <div class="spinner-border mx-auto" role="status">
            <span class="visually-hidden"></span>
        </div>
        <p>Loading...</p>
    `;

    const savedMovies = localStorage.getItem("savedMovies");
    render(savedMovies ? JSON.parse(savedMovies) : {});
}

function render(movies) {
    grid.innerHTML = '';

    if (Object.keys(movies).length === 0) {
        grid.innerHTML = '<p class="text-center">No movies in your watchlist.</p>';
        return;
    }

    Object.keys(movies).forEach(function(key) {
        const movie = movies[key];
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
        let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || {};
        delete savedMovies[movieID];
        console.log(`successfully deleted ${movieID}`);
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
        loadMovie();
    } catch (error) {
        alert('Could not find movie ID');
    }
}

function handleImageError(img) {
    console.log("Image not found:", img.src);
    img.onerror = null;
    img.src = "https://via.placeholder.com/300x450?text=No+Image";
}