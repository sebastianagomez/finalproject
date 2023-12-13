const API_KEY = "api_key=03f46433061328367057e8ecd0c82606";
const BASE_URL = "https://api.themoviedb.org/3/";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const API_URL = BASE_URL + "/discover/movie?sort_by=popular.desc&" + API_KEY;
const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;

const form = document.querySelector("#form")
const search = document.querySelector("#search");
const movies = document.querySelector(".movies");

const getMovies = (url) => {
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        showMovies(data.results)
    })
    .catch(err => {console.error(err)});
}

const showMovies = (data) => {
    data.forEach(movie => {
        const { id, title, poster_path } = movie;

        const imageUrl = poster_path ? IMG_URL + poster_path : './img/poster-placeholder.jpg';

        const movieEl = `<li>
            <img src="${imageUrl}">
            <h2>${title}</h2>
            <button class="details-button" data-movie-id="${id}">Details</button>
        </li>`;

        document.querySelector('.movies').innerHTML += movieEl;
    });

    const detailsButtons = document.querySelectorAll('.details-button');
    detailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const movieId = button.getAttribute('data-movie-id');
            window.location.href = `movie_details.html?id=${movieId}`;

        });
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    
    if(searchTerm) {
        movies.innerHTML = '';
       getMovies(SEARCH_URL + "&query=" + searchTerm);         
    } else {
        document.location.reload()
        getMovies(API_URL)

    }
})

getMovies(API_URL)