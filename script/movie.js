const apiKey = '5065fea3';
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const grid = document.getElementById('movieGrid')

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
    `

    try {
        const response = await fetch('https://www.omdbapi.com/?apikey=${apiKey}&s=${keyword}');
        const data = await response.json();

        if (data.Response === "True") {
            render(data.search);
        } else {
            alert('error 2');
        }
    } catch (error) {
        alert('error');
    }
}

function render(movies) {
    grid.innerHTML = '';

    movies.array.forEach(element => {
        const movie = `
            <div class="card" style="width: 18rem;">
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">${movie.Year}</p>
                </div>
            </div>
        `;

        grid.append(movie);
    });
}

