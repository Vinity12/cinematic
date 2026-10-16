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
            <span class="visually-hidden"</span>
        </div>
        <p>Loading...</p>
    `;

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${keyword}`);
        const data = await response.json();
        const page = Math.ceil(data.totalResults / 10);
        grid.innerHTML = '';

        for (let p = 1; p <= page; p++) {
            const responsePage = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${keyword}&page=${p}`);
            const dataPage = await responsePage.json();

            if (dataPage.Response === "True") {
                console.log(dataPage);
                render(dataPage.Search);
            } else {
                grid.innerHTML = '<p class="text-center">Movie not found</p>';
            }
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-center">Failed to fetch movies due to connection issue</p>';
    }
}

function render(movies) {
    movies.forEach(movie => {
        if ((localStorage.getItem('savedMovies') ? JSON.parse(localStorage.getItem('savedMovies')) : {}).hasOwnProperty(movie.imdbID)) {
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

        const savedMovies = localStorage.getItem('savedMovies') ? JSON.parse(localStorage.getItem('savedMovies')) : {};

        savedMovies[movieID] = movieJson;
        localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
        
        const query = searchInput.value.trim();
        searchMovie(query);

        showToast('Added to watchlist');
    } catch (error) {
        showToast('Failed to add to watchlist');
    }
}

async function removeFromWatchlist(movieID) {
    try {
        let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || {};
        delete savedMovies[movieID];
        console.log(`successfully deleted ${movieID}`);
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));

        const query = searchInput.value.trim();
        searchMovie(query);

        showToast('Deleted from watchlist');
    } catch (error) {
        showToast('Could not find movie ID');
    }
}