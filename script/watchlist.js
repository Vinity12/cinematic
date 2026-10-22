const apikey = '49cb96f4';
const grid = document.getElementById('movieGrid');

function searchMovie(keyword) {
    grid.innerHTML = '';
    if (keyword == '') {
        loadMovie();
        return;
    }

    const savedMovies = JSON.parse(localStorage.getItem('savedMovies') || '{}');
    const movies = Object.values(savedMovies).filter(movie => movie.Title.toLowerCase().includes(keyword.toLowerCase()));

    console.log(movies);

    if (movies.length === 0) {
        grid.innerHTML = '<p class="text-center">Movie not found in your watchlist</p>';
        return;
    }

    movies.forEach(movie => {grid.innerHTML += movieCard(movie, btnAction.REMOVE)});
}

function loadMovie() {
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

        grid.innerHTML += movieCard(movie, btnAction.REMOVE);
    });
}

function removeFromWatchlist(movieID) {
    try {
        let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || {};
        delete savedMovies[movieID];
        console.log(`successfully deleted ${movieID}`);
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));

        const query = searchInput ? searchInput.value.trim() : '';
        if (query !== '') {
            searchMovie(query);
        } else {
            loadMovie();
        }

        showToast('Deleted from watchlist');
    } catch (error) {
        showToast('Could not find movie ID');
    }
}

function handleImageError(img) {
    console.log("Image not found:", img.src);
    img.onerror = null;
    img.src = "https://via.placeholder.com/300x450?text=No+Image";
}