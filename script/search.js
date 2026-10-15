const apikey = '49cb96f4';
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const grid = document.getElementById('movieGrid');

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query != '') {
        searchMovie(query);
    } else {
        localStorage.clear();
    }
});

async function searchMovie(keyword) {
    grid.innerHTML = `
        <div class="spinner-border mx-auto" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p>Searching...</p>
    `;

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${keyword}`);
        const data = await response.json();

        if (data.Response === "True") {
            console.log(data);
            render(data.Search);
        } else {
            grid.innerHTML = '<p class="text-center">Movie not found</p>';
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-center">Failed to fetch movies due to connection issue</p>';
    }
}

function render(movies) {
    grid.innerHTML = '';

    movies.forEach(movie => {
        if (JSON.parse(localStorage.getItem('savedMovies')).hasOwnProperty(movie.imdbID)) {
            grid.innerHTML += movieCard(movie, btnAction.ADDED);
        } else {
            grid.innerHTML += movieCard(movie, btnAction.ADD);
        }
    });
}

async function addWatchlist(movieID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&i=${movieID}`);
        const movieJson = await response.json();
        console.log(movieJson);

        let savedMovies = {};
        const saved = localStorage.getItem('savedMovies');
        if (saved) {
            savedMovies = JSON.parse(saved);
        }
        savedMovies[movieID] = movieJson;
        localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
        
        const query = searchInput.value.trim();
        searchMovie(query);

        showToast('Added to watchlist');
    } catch (error) {
        showToast('Failed to add to watchlist');
    }
}