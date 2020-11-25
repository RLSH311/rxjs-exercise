const { fromHttpRequest } = require('../utils/http');
const { map, concatMap, count, filter, tap, mergeMap, take } = require('rxjs/operators');
const { concat } = require('rxjs');

let ratingPerMovie = {};

function calculateRatingForMovie(movie) {
    if (ratingPerMovie[movie.title] === undefined) {
        ratingPerMovie[movie.title] = 0;
    }

    return fromHttpRequest('https://orels-moviedb.herokuapp.com/ratings').pipe(
            concatMap(rate => rate),
            filter(rate => rate.movie === movie.id),
            map(rate => {
                ratingPerMovie[movie.title] += rate.score;
                return rate;
            }),
            count(),
            map(ratesAmount => {
                ratingPerMovie[movie.title] /= ratesAmount;
                return ratesAmount;
            }),
            tap(ratesAmount => console.log(`'${movie.title}' rated: ${ratingPerMovie[movie.title]}`)));
}

fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        concatMap(movie => movie),
        take(10), // only 10 movies because the server is weak
        mergeMap(movie => calculateRatingForMovie(movie))
    ).subscribe();