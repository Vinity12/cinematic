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
        <div class="spinner-border" role="status">
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
            alert('error 1')
        }
    } catch (error) {
        alert('error 2');
    }
}

function render(movies) {
    grid.innerHTML = '';

    movies.forEach(function(movie) {
        const movieItem = `
            <div class="col card p-0 m-2 border-0" style="min-width: 12rem; background-image: url(${movie.Poster});">
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body" style="background-color: #77777777; backdrop-filter: blur(40px)">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">${movie.Year}</p>
                </div>
            </div>
        `;

        grid.innerHTML += movieItem;
    });
}

