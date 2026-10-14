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
            <div class="col-12 col-sm-2 col-md-4 col-lg-2 card p-0 m-2 border-0 movie-card" style="background-image: url('${movie.Poster}');">
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" onerror="handleImageError(this)">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">${movie.Year}</p>

                    <button type="button" class="btn btn-primary mt-auto w-auto" onclick="addWatchlist('${movie.imdbID}')">
                        Watchlist
                    </button>
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

function handleImageError(img) {
    console.log("Image not found:", img.src);
    img.onerror = null;
    img.src = "https://via.placeholder.com/300x450?text=No+Image";
}