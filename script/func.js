const btnAction = {
    ADD: 'add',
    ADDED: 'added',
    REMOVE: 'remove'
}

function movieCard(movie, action) {
    if (action === 'add') {
        action = {
            class: 'btn-primary',
            text: 'Watchlist',
            clickFunction: 'addWatchlist'
        }
    } else if (action === 'added') {
        action = {
            class: 'btn-warning btn-outline-light',
            text: 'Watchlisted',
            clickFunction: 'addWatchlist'
        }
    } else {
        action = {
            class: 'btn-danger',
            text: 'Remove',
            clickFunction: 'removeFromWatchlist'
        }
    }

    return `
        <div class="col-12 col-sm-2 col-md-4 col-lg-2 card p-0 m-2 border-0 movie-card" style="background-image: url('${movie.Poster}');">
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" onerror="handleImageError(this)">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">${movie.Year}</p>
                <button type="button" class="btn ${action.class} fw-bold mt-auto w-auto" onclick="${action.clickFunction}('${movie.imdbID}')">
                    ${action.text}
                </button>
            </div>
        </div>
    `;
}

const toastElement = document.getElementById("toastElement");
const toastMessage = toastElement.querySelector(".toastMessage");
const toast = bootstrap.Toast.getOrCreateInstance(toastElement, {
    delay: 2400
});

function showToast(message) {
    toastMessage.textContent = message;
    toast.show();
}

function handleImageError(img) {
    img.src = "https://via.placeholder.com/300x450?text=No+Image";
}