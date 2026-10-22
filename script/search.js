const apikey = '49cb96f4';
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const grid = document.getElementById('movieGrid');
const paginationContainer = document.getElementById('pagination');

let currentQuery = '';
let currentPage = 1;

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query !== '') {  
        currentQuery = query;
        currentPage = 1;
        searchMovie(currentQuery, currentPage);
    }
});

async function searchMovie(keyword, page) {
    grid.innerHTML = `
        <div class="spinner-border mx-auto" role="status">
            <span class="visually-hidden"</span>
        </div>
        <p>Loading...</p>
    `;

    try {
        const page1 = (page * 2) - 1;
        const page2 = page * 2;

        const response1 = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${keyword}&page=${page1}`);
        const data1 = await response1.json();

        if (data1.Response === "True") {
            const totalResults = parseInt(data1.totalResults, 10);
            const totalPages = Math.ceil(totalResults / 20);

            let movies = data1.Search || [];

            if (page2 <= Math.ceil(totalResults / 10)) {
                const response2 = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${keyword}&page=${page2}`);
                const data2 = await response2.json();
                if (data2.Response === "True") {
                    movies = movies.concat(data2.Search);
                }
            }

            grid.innerHTML = '';
            render(movies);
            renderPagination(totalPages, page);
        } else {
            grid.innerHTML = '<p class="text-center">Movie not found</p>';
            paginationContainer.innerHTML = '';
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-center">Failed to fetch movies due to connection issue</p>';
        paginationContainer.innerHTML = '';
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

function renderPagination(totalPages, page) {
    paginationContainer.innerHTML = '';

    //if (totalPages <= 1) return;

    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${page === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<button class="page-link" type="button">Previous</button>`;
    prevLi.addEventListener('click', () => {
        if (page > 1) {
            currentPage--;
            searchMovie(currentQuery, currentPage);
        }
    });
    paginationContainer.appendChild(prevLi);

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (page <= 3) {
        endPage = Math.min(5, totalPages);
    }
    if (page > totalPages - 3) {
        startPage = Math.max(1, totalPages - 4);
    }

    for (let p = startPage; p <= endPage; p++) {
        const li = document.createElement('li');
        li.className = `page-item ${p === page ? 'active' : ''}`;
        li.innerHTML = `<button class="page-link" type="button">${p}</button>`;
        li.addEventListener('click', () => {
            currentPage = p;
            searchMovie(currentQuery, currentPage);
        });
        paginationContainer.appendChild(li);
    }

    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${page === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<button class="page-link" type="button">Next</button>`;
    nextLi.addEventListener('click', () => {
        if (page < totalPages) {
            currentPage++;
            searchMovie(currentQuery, currentPage);
        }
    });
    paginationContainer.appendChild(nextLi);
}

async function addWatchlist(movieID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&i=${movieID}`);
        const movieJson = await response.json();
        console.log(movieJson);

        const savedMovies = localStorage.getItem('savedMovies') ? JSON.parse(localStorage.getItem('savedMovies')) : {};

        savedMovies[movieID] = movieJson;
        localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
        
        searchMovie(currentQuery, currentPage);

        showToast('Added to watchlist');
    } catch (error) {
        showToast('Failed to add to watchlist');
    }
}

function removeFromWatchlist(movieID) {
    try {
        let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || {};
        delete savedMovies[movieID];
        console.log(`successfully deleted ${movieID}`);
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));

        searchMovie(currentQuery, currentPage);

        showToast('Deleted from watchlist');
    } catch (error) {
        showToast('Could not find movie ID');
    }
}