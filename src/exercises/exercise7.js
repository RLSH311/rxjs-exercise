const { fromHttpRequest } = require('../utils/http');
const { concatMap, map, filter } = require('rxjs/operators');
const { of } = require('rxjs');

thrillerMoviesPerYear = {};

fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        concatMap(movie => {
            movieGenresIds = movie.genres;

        })
    )
    .subscribe(console.log);