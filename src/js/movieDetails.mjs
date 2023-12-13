
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

const API_KEY = "api_key=03f46433061328367057e8ecd0c82606";
const BASE_URL = "https://api.themoviedb.org/3/";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const MOVIE_DETAILS_URL = BASE_URL + "movie/" + movieId + "?" + API_KEY;

const movieDetailsContainer = document.querySelector('.movie-details');

const moviePoster = document.getElementById('moviePoster');
const movieTitle = document.getElementById('movieTitle');
const movieTagline = document.getElementById('movieTagline');
const movieReleaseDate = document.getElementById('movieReleaseDate');
const movieOverview = document.getElementById('movieOverview');
const popularityStars = document.getElementById('popularityStars');
const getMovieDetails = () => {
    fetch(MOVIE_DETAILS_URL)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 404) {
                    displayMovieNotAvailable();
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
            return response.json();
        })
        .then((data) => {
            if (Object.keys(data).length === 0) {
                displayMovieNotAvailable();
            } else {
                showMovieDetails(data);
            }
        })
        .catch(err => { 
            console.error("Error fetching movie details:", err);
        });
}

const showMovieDetails = (movie) => {
    const { title, poster_path, overview, tagline, release_date, popularity } = movie;

    const imageUrl = poster_path ? IMG_URL + poster_path : './img/poster-placeholder.jpg';

    moviePoster.src = imageUrl;
    movieTitle.textContent = title;
    movieTagline.textContent = tagline;
    movieReleaseDate.textContent = release_date;
    movieOverview.textContent = overview;

    const filledStars = calculateFilledStars(popularity);

    displayPopularityStars(filledStars);
}

const calculateFilledStars = (popularity) => {
    const maxPopularity = 10;
    const filledStars = (popularity / maxPopularity) * 5;
    return filledStars;
};

const displayMovieNotAvailable = () => {
    movieDetailsContainer.innerHTML = '<h1 class="movie-not-available">This movie is currently not available</h1>';
}

const displayPopularityStars = (filledStars) => {
    popularityStars.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = i < filledStars ? '★' : '☆';
        popularityStars.appendChild(star);
    }
};

const addToWatchlist = () => {
    const movieId = urlParams.get('id');
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (!watchlist.some(movie => movie.id === movieId)) {
        watchlist.push({ 
            id: movieId, 
            title: movieTitle.textContent, 
            poster_path: moviePoster.src,
        });

        localStorage.setItem('watchlist', JSON.stringify(watchlist));

        alert('Movie added to watchlist!');
    } else {
        alert('Movie is already in the watchlist!');
    }
};
document.getElementById('watchlistButton').addEventListener('click', addToWatchlist);



getMovieDetails();

